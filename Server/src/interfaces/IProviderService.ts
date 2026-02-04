// interfaces/IProviderService.ts

import { UpdateProviderProfileDTO } from "../dto/provider/updateProviderProfileDTO";
import { IProvider } from "../models/providerModel"; // or from your model interface

export interface IProviderService {
  providerProfileService(id: string): Promise<IProvider | null>;

  updateProviderProfileService(
    id: string,
    data: UpdateProviderProfileDTO
  ): Promise<IProvider | null>;

  listProviderService(filter?: any, page?: number, limit?: number): Promise<{ providers: IProvider[], total: number }>;

  providerDetailService(id: string): Promise<IProvider | null>;
}
