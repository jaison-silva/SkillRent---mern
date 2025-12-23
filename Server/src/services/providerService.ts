import providerRepository from "../repositories/providerRepository";

export default class ProviderService{
    constructor(private providerRepo : providerRepository){}

    providerProfileService(id: string) {
        return this.providerRepo.findProviderById(id);
    }

    updateProviderProfileService(id: string, data: any) {
        return this.providerRepo.updateProviderById(id, data);
    }

    // providerDashboardService(id: string) {
    //     return this.providerRepo.findById(id);
    // }

      listProviderService(){
        return this.providerRepo.findProviders()
    }

    providerDetailService(id:string){
        return this.providerRepo.findProviderById(id)
    }
}