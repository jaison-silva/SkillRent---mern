import Provider, { IProvider } from "../../models/providerModel";
import IProviderhRepository from "../../repositories/interfaces/IProviderRepository";
import { ProviderStatus } from "../../enum/providerStatusEnum";
import { UpdateProviderProfileDTO } from "../../dto/provider/updateProviderProfileDTO";
import { BaseRepository } from "./baseRepository";
import User from "../../models/userModel";

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
    lng?: number,
    maxDistance?: number
  ): Promise<{ providers: any[], total: number }> {
    const query: Record<string, unknown> = { ...(filter || {}) };

    const useGeo = lat !== undefined && lng !== undefined && !isNaN(lat) && !isNaN(lng);

    const skip = (page - 1) * limit;

    if (search) {
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

    if (useGeo) {
      const maxDist = maxDistance !== undefined && !isNaN(maxDistance) ? maxDistance : 50;
      
      const pipeline: any[] = [
        {
          $geoNear: {
            near: { type: "Point", coordinates: [lng, lat] },
            distanceField: "distance",
            distanceMultiplier: 0.001, // Convert meters to km
            maxDistance: maxDist * 1000, // Convert km to meters
            spherical: true,
            query: query
          }
        }
      ];

      let sortStage: any = { distance: 1 };
      if (sort === "rating") sortStage = { rating: -1 };
      if (sort === "oldest") sortStage = { createdAt: 1 };
      if (sort === "newest") sortStage = { createdAt: -1 };

      pipeline.push({ $sort: sortStage });

      pipeline.push({
        $facet: {
          metadata: [{ $count: "total" }],
          data: [{ $skip: skip }, { $limit: limit }]
        }
      });

      const result = await Provider.aggregate(pipeline);
      const total = result[0]?.metadata[0]?.total || 0;
      const providers = result[0]?.data || [];

      // Map back GeoJSON to expected format and populate
      const formattedProviders = providers.map(p => {
        if (p.location && p.location.coordinates) {
          p.location = {
            lat: p.location.coordinates[1],
            lng: p.location.coordinates[0],
            address: p.location.address
          };
        }
        return p;
      });

      await Provider.populate(formattedProviders, { path: "userId" });

      return { providers: formattedProviders, total };
    } else {
      let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
      if (sort === "rating") sortOption = { rating: -1 };
      if (sort === "oldest") sortOption = { createdAt: 1 };

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