import { GoogleLogin as GoogleAuthButtonComponent } from "@react-oauth/google";
import { useGoogleLoginMutation } from "../authApiSlice";
import { setCredentials } from "../authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const GoogleLoginUser = ({ role }: { role?: string }) => {
    const [googleLogin] = useGoogleLoginMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onSuccess = async (credentialResponse: any) => {
        try {
            const { credential } = credentialResponse;
            const response = await googleLogin({ credential, role }).unwrap();
            
            if (response && response.user && response.accessToken) {
                dispatch(
                    setCredentials({
                        user: response.user,
                        token: response.accessToken,
                    })
                );
                navigate("/");
            }
        } catch (error: any) {
            console.error("Google Auth failed", error);
            toast.error(error?.data?.message || "Google Login failed");
        }
    }

    return (
        <div className="flex justify-center w-full my-4">
            <GoogleAuthButtonComponent 
                onSuccess={onSuccess} 
                onError={() => toast.error("Google Login failed")} 
            />
        </div>
    );
};
