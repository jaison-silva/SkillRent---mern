import { Document, Model, FilterQuery, UpdateQuery } from "mongoose";
import { IBaseRepository } from "../interfaces/IBaseRepository";

export default class BaseRepository<T extends Document> implements IBaseRepository<T> {

    constructor(protected model: Model<T>) { }

    async findById(id: string): Promise<T | null> {
        return await this.model.findById(id);
    }


    async findOne(filter: FilterQuery<T>): Promise<T | null> {
        return await this.model.findOne(filter);
    }

    async findAll(
        filter: FilterQuery<T> = {},
        page: number = 1,
        limit: number = 10
    ): Promise<{ items: T[], total: number }> {
        const skip = (page - 1) * limit;

        const [items, total] = await Promise.all([
            this.model.find(filter).skip(skip).limit(limit),
            this.model.countDocuments(filter)
        ]);

        return { items, total };
    }

    async create(data: Partial<T>): Promise<T> {
        const doc = new this.model(data);
        return await doc.save() as T;
    }


    async updateById(id: string, data: UpdateQuery<T>): Promise<T | null> {
        return await this.model.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true }  // Return updated doc, not the old one
        );
    }


    async deleteById(id: string): Promise<T | null> {
        return await this.model.findByIdAndDelete(id);
    }
}
