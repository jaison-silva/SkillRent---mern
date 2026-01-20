import { UpdateProviderProfileDTO } from "../dto/provider/updateProviderProfileDTO";
import { ProviderStatus } from "../enum/providerStatusEnum";
import { IProvider } from "../models/providerModel";

export default interface IProviderRepository {
    listProviders(filter?: Record<string, any>): Promise<IProvider[] | null>
    updateProviderById(id: string, data: UpdateProviderProfileDTO): Promise<IProvider | null>
    updateProviderByUserId(userId: string, data: UpdateProviderProfileDTO): Promise<IProvider | null>
    findProviderById(id: string): Promise<IProvider | null>
    findByUserId(userId: string): Promise<IProvider | null>
    verifyProviderById(id: string, validationStatus: ProviderStatus): Promise<IProvider | null>
    // providerDetailedById(id:string):Promise<>
}
