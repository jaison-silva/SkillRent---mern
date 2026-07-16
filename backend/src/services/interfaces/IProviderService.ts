// interfaces/IProviderService.ts

import { UpdateProviderProfileDTO } from "../../dto/provider/updateProviderProfileDTO";
import { IProvider } from "../../models/providerModel"; // or from your model interface

export interface IProviderService {
  providerProfileService(id: string): Promise<IProvider | null>;

  updateProviderProfileService(
    id: string,
    data: UpdateProviderProfileDTO
  ): Promise<IProvider | null>;

  listProviderService(filter?: Record<string, unknown>, page?: number, limit?: number, search?: string, sort?: string, lat?: number, lng?: number, maxDistance?: number): Promise<{ providers: any[], total: number }>;

  providerDetailService(id: string): Promise<IProvider | null>;
}
