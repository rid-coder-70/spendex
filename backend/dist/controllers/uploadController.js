"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadController = void 0;
const csvParser_1 = require("../services/csvParser");
const Transaction_1 = require("../models/Transaction");
const Category_1 = require("../models/Category");
const UploadHistory_1 = require("../models/UploadHistory");
const uploadMiddleware_1 = require("../middleware/uploadMiddleware");
class UploadController {
    static async uploadCSV(req, res) {
        let uploadId = null;
        let filePath = null;
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    error: {
                        message: 'Not authenticated',
                        code: 'NOT_AUTHENTICATED',
                    },
                });
            }
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    error: {
                        message: 'No file uploaded',
                        code: 'NO_FILE',
                    },
                });
            }
            filePath = req.file.path;
            const fileSize = req.file.size;
            const originalName = req.file.originalname;
            console.log(`📁 Processing CSV file: ${originalName} (${fileSize} bytes)`);
            const uploadRecord = await UploadHistory_1.UploadHistoryModel.create({
                user_id: req.user.id,
                filename: originalName,
                file_size: fileSize,
                status: 'processing',
            });
            uploadId = uploadRecord.id;
            const parseResult = await csvParser_1.CSVParserService.parseCSV(filePath);
            if (!parseResult.success) {
                await UploadHistory_1.UploadHistoryModel.update(uploadId, {
                    status: 'failed',
                    rows_processed: 0,
                    rows_imported: 0,
                    rows_failed: 0,
                    error_message: parseResult.errors[0]?.error || 'CSV parsing failed',
                });
                (0, uploadMiddleware_1.deleteUploadedFile)(filePath);
                return res.status(400).json({
                    success: false,
                    error: {
                        message: 'Failed to parse CSV file',
                        code: 'PARSE_ERROR',
                        details: parseResult.errors,
                    },
                });
            }
            console.log(`📊 Parsed ${parseResult.totalRows} rows: ${parseResult.validTransactions.length} valid, ${parseResult.errors.length} errors`);
            let importedCount = 0;
            const importErrors = [];
            for (let i = 0; i < parseResult.validTransactions.length; i++) {
                const transaction = parseResult.validTransactions[i];
                try {
                    let categoryId = transaction.category_id;
                    if (!categoryId && (transaction.description || transaction.merchant)) {
                        categoryId =
                            (await Category_1.CategoryModel.autoCategorize(transaction.description || '', transaction.merchant)) || undefined;
                    }
                    await Transaction_1.TransactionModel.create({
                        user_id: req.user.id,
                        category_id: categoryId,
                        amount: transaction.amount,
                        type: transaction.type,
                        description: transaction.description,
                        merchant: transaction.merchant,
                        payment_method: transaction.payment_method,
                        transaction_date: transaction.transaction_date,
                        notes: transaction.notes,
                    });
                    importedCount++;
                }
                catch (error) {
                    console.error(`❌ Error importing transaction ${i + 1}:`, error);
                    importErrors.push({
                        index: i + 1,
                        error: error.message,
                    });
                }
            }
            await UploadHistory_1.UploadHistoryModel.update(uploadId, {
                status: importedCount > 0 ? 'completed' : 'failed',
                rows_processed: parseResult.totalRows,
                rows_imported: importedCount,
                rows_failed: parseResult.errors.length + importErrors.length,
                error_message: importErrors.length > 0
                    ? `Failed to import ${importErrors.length} transactions`
                    : undefined,
            });
            (0, uploadMiddleware_1.deleteUploadedFile)(filePath);
            const allErrors = [
                ...parseResult.errors.map((e) => ({
                    row: e.row,
                    error: e.error,
                    type: 'validation',
                })),
                ...importErrors.map((e) => ({
                    row: e.index,
                    error: e.error,
                    type: 'import',
                })),
            ];
            res.status(200).json({
                success: true,
                message: 'CSV processed successfully',
                data: {
                    total_rows: parseResult.totalRows,
                    imported: importedCount,
                    failed: allErrors.length,
                    upload_id: uploadId,
                    errors: allErrors.length > 0 ? allErrors : undefined,
                },
            });
        }
        catch (error) {
            console.error('❌ CSV upload error:', error);
            if (uploadId) {
                await UploadHistory_1.UploadHistoryModel.update(uploadId, {
                    status: 'failed',
                    error_message: error.message,
                });
            }
            if (filePath) {
                (0, uploadMiddleware_1.deleteUploadedFile)(filePath);
            }
            res.status(500).json({
                success: false,
                error: {
                    message: 'Failed to process CSV file',
                    code: 'UPLOAD_ERROR',
                    details: error.message,
                },
            });
        }
    }
    static async getUploadHistory(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    error: {
                        message: 'Not authenticated',
                        code: 'NOT_AUTHENTICATED',
                    },
                });
            }
            const limit = parseInt(req.query.limit) || 10;
            const history = await UploadHistory_1.UploadHistoryModel.findByUser(req.user.id, limit);
            res.json({
                success: true,
                data: history,
            });
        }
        catch (error) {
            console.error('Get upload history error:', error);
            res.status(500).json({
                success: false,
                error: {
                    message: 'Failed to fetch upload history',
                    code: 'FETCH_ERROR',
                },
            });
        }
    }
    static async getUploadById(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    error: {
                        message: 'Not authenticated',
                        code: 'NOT_AUTHENTICATED',
                    },
                });
            }
            const id = Number(req.params.id);
            const upload = await UploadHistory_1.UploadHistoryModel.findById(id, req.user.id);
            if (!upload) {
                return res.status(404).json({
                    success: false,
                    error: {
                        message: 'Upload record not found',
                        code: 'NOT_FOUND',
                    },
                });
            }
            res.json({
                success: true,
                data: upload,
            });
        }
        catch (error) {
            console.error('Get upload error:', error);
            res.status(500).json({
                success: false,
                error: {
                    message: 'Failed to fetch upload record',
                    code: 'FETCH_ERROR',
                },
            });
        }
    }
    static async downloadTemplate(req, res) {
        try {
            const template = csvParser_1.CSVParserService.generateTemplate();
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename="spendguard_template.csv"');
            res.send(template);
        }
        catch (error) {
            console.error('Download template error:', error);
            res.status(500).json({
                success: false,
                error: {
                    message: 'Failed to generate template',
                    code: 'TEMPLATE_ERROR',
                },
            });
        }
    }
}
exports.UploadController = UploadController;
//# sourceMappingURL=uploadController.js.map