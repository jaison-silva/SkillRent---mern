import MongoUserRepository from "../repositories/userRepository";

export default class UserService { 
    constructor(private userRepo: MongoUserRepository){}

    userProfileService(id:string){
       return this.userRepo.findUserById(id)
    } 

    updateUserProfileService(id:string){
        return this.userRepo.updateUserById(id) 
    }

    listUserService(){
        return this.userRepo.findUsers()
    }
    
}