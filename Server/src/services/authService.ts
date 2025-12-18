import bcrypt, { compare } from "bcryptjs";
import jwtToken from "../utils/generateToken";
// import userRepository from "../repositories/authRepository";
// import authRepository from "../repositories/authRepository";
import { IAuthRepository } from "../interfaces/IAuthRepository";
import { ProviderRegisterInput, UserRegisterInput } from "../types/authTypes";
import ApiError from "../utils/apiError";

export class AuthServices {
    constructor(private authRepo: IAuthRepository){}

    async login(email: string, password: string) {
        if (!email) throw new Error("Invalid credentials")

        const user = await this.authRepo.findByEmail(email)

        if (!user || !user.password) {
            throw new ApiError(409, "Email already in use")
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) throw new ApiError(409, "Email already in use")

        const accessToken = jwtToken.generateToken(user._id.toString())
        const refreshToken = jwtToken.refreshToken(user._id.toString())

        return {
            user: {
                id: user?._id,
                name: user?.name,
                email: user?.email,
                role: user?.role
            },
            accessToken,
            refreshToken
        }
    }

    async UserRegister({ name, email, password }: UserRegisterInput) {
        const existingUser = await this.authRepo.findByEmail(email);
        if (existingUser) throw new ApiError(409, "Email already in use")

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await this.authRepo.createUser({ name, email, password: hashedPassword, role: "user" });

        const accessToken = jwtToken.generateToken(newUser._id.toString())
        const refreshToken = jwtToken.refreshToken(newUser._id.toString())


        return {
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
            },
            accessToken,
            refreshToken
        }
    }

    async ProviderRegister(data: ProviderRegisterInput) {
        const existingUser = await this.authRepo.findByEmail(data.email);
        if (existingUser) throw new ApiError(409, "Email already in use")

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const newUser = await this.authRepo.createUser({ name: data.name, email: data.email, password: hashedPassword, role: "provider" });
        await this.authRepo.createProvider({
            userId: newUser._id,
            bio: data.bio,
            skills: data.skills,
            language: data.language,
            hasTransport: data.hasTransport,
            location: data.location,
        });

        const accessToken = jwtToken.generateToken(newUser._id.toString())
        const refreshToken = jwtToken.refreshToken(newUser._id.toString())


        return {
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
            },
            accessToken,
            refreshToken
        }
    }
}

// export default {
//     login,
//     ProviderRegister,
//     UserRegister
// }