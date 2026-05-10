import { User } from '../types/index';
export declare class UserModel {
    static create(name: string, email: string, password_hash: string, phone?: string): Promise<User>;
    static findByEmail(email: string): Promise<User | null>;
    static findById(id: number): Promise<User | null>;
    static update(id: number, updates: Partial<User>): Promise<User | null>;
    static delete(id: number): Promise<boolean>;
    static emailExists(email: string): Promise<boolean>;
}
//# sourceMappingURL=User.d.ts.map