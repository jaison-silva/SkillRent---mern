import { Model, Document, FilterQuery, UpdateQuery, SaveOptions } from 'mongoose';
import { IBaseRepository } from '../interfaces/IBaseRepository';

export abstract class BaseRepository<T extends Document> implements IBaseRepository<T> { 
    protected constructor(protected readonly model: Model<T>) { }

    async create(data: Partial<T>, options?: SaveOptions): Promise<T> {
        const document = new this.model(data);
        await document.save(options);
        return document;
    }

    async findById(id: string): Promise<T | null> {
        return this.model.findById(id);
    } 

    async findOne(filter: FilterQuery<T>): Promise<T | null> {
        return this.model.findOne(filter);
    }

    async find(filter: FilterQuery<T> = {}): Promise<T[]> {
        return this.model.find(filter);
    }

    async updateById(id: string, updateData: UpdateQuery<T>): Promise<T | null> {
        return this.model.findByIdAndUpdate(id, updateData, { new: true });
    }

    async deleteById(id: string): Promise<T | null> {
        return this.model.findByIdAndDelete(id);
    }
}