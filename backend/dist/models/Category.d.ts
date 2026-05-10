import { Category } from '../types';
export declare class CategoryModel {
    static findAll(type?: 'expense' | 'income'): Promise<Category[]>;
    static findById(id: number): Promise<Category | null>;
    static create(data: {
        name: string;
        type: 'expense' | 'income';
        icon?: string;
        color?: string;
        keywords?: string[];
    }): Promise<Category>;
    static seedDefaults(): Promise<void>;
    static autoCategorize(description: string, merchant?: string): Promise<number | null>;
}
//# sourceMappingURL=Category.d.ts.map