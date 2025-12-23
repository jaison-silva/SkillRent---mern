
export default interface IUserRepository{
    findUserById(id:string):Promise<any>
    updateUserById(id:string):Promise<any>
    findUsers():Promise<any>
    blockUserById(id:string,isBanned:boolean): Promise<any>
    }