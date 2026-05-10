export interface UploadHistory {
    id: number;
    user_id: number;
    filename: string;
    file_size: number;
    rows_processed: number;
    rows_imported: number;
    rows_failed: number;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    error_message?: string;
    uploaded_at: Date;
}
export declare class UploadHistoryModel {
    static create(data: {
        user_id: number;
        filename: string;
        file_size: number;
        status?: 'pending' | 'processing' | 'completed' | 'failed';
    }): Promise<UploadHistory>;
    static update(id: number, updates: {
        rows_processed?: number;
        rows_imported?: number;
        rows_failed?: number;
        status?: 'pending' | 'processing' | 'completed' | 'failed';
        error_message?: string;
    }): Promise<UploadHistory | null>;
    static findByUser(userId: number, limit?: number): Promise<UploadHistory[]>;
    static findById(id: number, userId: number): Promise<UploadHistory | null>;
}
//# sourceMappingURL=UploadHistory.d.ts.map