import { Document, FilterQuery, UpdateQuery, SaveOptions } from 'mongoose';

export interface IBaseRepository<T> {
    create(data: Partial<T>, options?: SaveOptions): Promise<T>;
    findById(id: string): Promise<T | null>;
    findOne(filter: FilterQuery<T>): Promise<T | null>;
    find(filter?: FilterQuery<T>): Promise<T[]>;
    updateById(id: string, updateData: UpdateQuery<T>): Promise<T | null>;
    deleteById(id: string): Promise<T | null>;
}
