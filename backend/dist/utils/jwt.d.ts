export interface JWTPayload {
    id: number;
    email: string;
}
export declare class JWTUtils {
    static generate(payload: JWTPayload): string;
    static verify(token: string): JWTPayload | null;
    static decode(token: string): JWTPayload | null;
}
//# sourceMappingURL=jwt.d.ts.map