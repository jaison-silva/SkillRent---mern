export default interface IUserRepository{
    listProviders(): Promise<any>;
    // providerDetailedById(id:string):Promise<any>
    updateProviderById(id:string,data:object):Promise<any> 
    findProviderById(id:string):Promise<any> 
    blockProviderById(id: string, isBanned: boolean): Promise<any>;
    verifyProviderById(id: string, status: string):Promise<any>
}
   