import { Document, Model, FilterQuery, UpdateQuery } from "mongoose";

export interface IBaseRepository<T extends Document> {
    findById(id: string): Promise<T | null>;
    findOne(filter: FilterQuery<T>): Promise<T | null>;
    findAll(filter?: FilterQuery<T>, page?: number, limit?: number): Promise<{ items: T[], total: number }>;
    create(data: Partial<T>): Promise<T>;
    updateById(id: string, data: UpdateQuery<T>): Promise<T | null>;
    deleteById(id: string): Promise<T | null>;
}
