import Provider, { IProvider } from "../../models/providerModel";
import IProviderhRepository from "../../repositories/interfaces/IProviderRepository";
import { ProviderStatus } from "../../enum/providerStatusEnum";
import { UpdateProviderProfileDTO } from "../../dto/provider/updateProviderProfileDTO";
import { BaseRepository } from "./baseRepository";

export default class MongoProviderRepository extends BaseRepository<IProvider> implements IProviderhRepository {
  constructor() {
    super(Provider);
  }

  async listProviders(
    filter?: Record<string, unknown>,
    page: number = 1,
    limit: number = 10,
    search: string = "",
    sort: string = "newest",
    lat?: number,
    lng?: number
  ): Promise<{ providers: IProvider[], total: number }> {
    const query: Record<string, unknown> = { ...(filter || {}) };

    if (lat !== undefined && lng !== undefined && !isNaN(lat) && !isNaN(lng)) {
      const radiusInDegrees = 50 / 111; // ~50km radius
      query['location.lat'] = { $gte: lat - radiusInDegrees, $lte: lat + radiusInDegrees };
      query['location.lng'] = { $gte: lng - radiusInDegrees, $lte: lng + radiusInDegrees };
    }

    // Sort mapping
    let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
    if (sort === "rating") sortOption = { rating: -1 };
    if (sort === "oldest") sortOption = { createdAt: 1 };

    const skip = (page - 1) * limit;

    if (search) {
      // Need to find matching users first
      const User = (await import("../../models/userModel")).default;
      const matchingUsers = await User.find({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } }
        ]
      }).select("_id");
      const matchingUserIds = matchingUsers.map((u: any) => u._id);

      query.$or = [
        { userId: { $in: matchingUserIds } },
        { skills: { $regex: search, $options: "i" } }
      ];
    }

    const [providers, total] = await Promise.all([
      Provider.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .populate("userId"),
      Provider.countDocuments(query)
    ]);

    return { providers, total };
  }

  findProviderById(id: string): Promise<IProvider | null> {
    return Provider.findById(id).populate("userId") as unknown as Promise<IProvider | null>;
  }


  findByUserId(userId: string) {
    return Provider.findOne({ userId }).populate("userId");
  }

  updateProviderById(id: string, data: UpdateProviderProfileDTO) {
    return Provider.findByIdAndUpdate(id, data, { new: true }); // { new: true } returns the updated document instead of the old one
  }

  updateProviderByUserId(userId: string, data: UpdateProviderProfileDTO) {
    return Provider.findOneAndUpdate({ userId }, data, { new: true });
  }

  verifyProviderById(id: string, validationStatus: ProviderStatus) {
    return Provider.findByIdAndUpdate(id,
      { validationStatus },
      { new: true }
    )
  }
}