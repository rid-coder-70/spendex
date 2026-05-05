export declare class PasswordUtils {
    static hash(password: string): Promise<string>;
    static compare(password: string, hash: string): Promise<boolean>;
    static validate(password: string): {
        valid: boolean;
        errors: string[];
    };
}
//# sourceMappingURL=password.d.ts.map