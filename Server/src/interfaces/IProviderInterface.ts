export default interface IUserRepository{
    findProviderById(id:string):Promise<any>
    updateProviderById(id:string,data:any):Promise<any>
    blockProviderById(id: string, isBanned: boolean): Promise<any>;
    findProviders(): Promise<any>;
    verifyProviderById(id: string, status: string):Promise<any>
}
