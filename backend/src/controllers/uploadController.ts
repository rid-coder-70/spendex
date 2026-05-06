import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { CSVParserService } from '../services/csvParser';
import { TransactionModel } from '../models/Transaction';
import { CategoryModel } from '../models/Category';
import { UploadHistoryModel } from '../models/UploadHistory';
import { deleteUploadedFile } from '../middleware/uploadMiddleware';

export class UploadController {
  // Upload and process CSV file
  static async uploadCSV(req: Request, res: Response) {
    let uploadId: number | null = null;
    let filePath: string | null = null;

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

      // Check if file was uploaded
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

      // Create upload history record
      const uploadRecord = await UploadHistoryModel.create({
        user_id: req.user.id,
        filename: originalName,
        file_size: fileSize,
        status: 'processing',
      });
      uploadId = uploadRecord.id;

      // Parse CSV file
      const parseResult = await CSVParserService.parseCSV(filePath);

      if (!parseResult.success) {
        await UploadHistoryModel.update(uploadId, {
          status: 'failed',
          rows_processed: 0,
          rows_imported: 0,
          rows_failed: 0,
          error_message: parseResult.errors[0]?.error || 'CSV parsing failed',
        });

        deleteUploadedFile(filePath);

        return res.status(400).json({
          success: false,
          error: {
            message: 'Failed to parse CSV file',
            code: 'PARSE_ERROR',
            details: parseResult.errors,
          },
        });
      }

      console.log(
        `📊 Parsed ${parseResult.totalRows} rows: ${parseResult.validTransactions.length} valid, ${parseResult.errors.length} errors`
      );

      // Import valid transactions
      let importedCount = 0;
      const importErrors: Array<{ index: number; error: string }> = [];

      for (let i = 0; i < parseResult.validTransactions.length; i++) {
        const transaction = parseResult.validTransactions[i];

        try {
          // Auto-categorize if no category provided
          let categoryId = transaction.category_id;
          if (!categoryId && (transaction.description || transaction.merchant)) {
            categoryId =
              (await CategoryModel.autoCategorize(
                transaction.description || '',
                transaction.merchant
              )) || undefined;
          }

          // Create transaction
          await TransactionModel.create({
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
        } catch (error: any) {
          console.error(`❌ Error importing transaction ${i + 1}:`, error);
          importErrors.push({
            index: i + 1,
            error: error.message,
          });
        }
      }

      // Update upload history
      await UploadHistoryModel.update(uploadId, {
        status: importedCount > 0 ? 'completed' : 'failed',
        rows_processed: parseResult.totalRows,
        rows_imported: importedCount,
        rows_failed: parseResult.errors.length + importErrors.length,
        error_message:
          importErrors.length > 0
            ? `Failed to import ${importErrors.length} transactions`
            : undefined,
      });

      // Delete uploaded file
      deleteUploadedFile(filePath);

      // Prepare response
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
    } catch (error: any) {
      console.error('❌ CSV upload error:', error);

      // Update upload history if record was created
      if (uploadId) {
        await UploadHistoryModel.update(uploadId, {
          status: 'failed',
          error_message: error.message,
        });
      }

      // Delete uploaded file
      if (filePath) {
        deleteUploadedFile(filePath);
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

  // Get upload history
  static async getUploadHistory(req: Request, res: Response) {
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

      const limit = parseInt(req.query.limit as string) || 10;

      const history = await UploadHistoryModel.findByUser(req.user.id, limit);

      res.json({
        success: true,
        data: history,
      });
    } catch (error: any) {
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

  // Get single upload record
  static async getUploadById(req: Request, res: Response) {
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

      const upload = await UploadHistoryModel.findById(id, req.user.id);

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
    } catch (error: any) {
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

  // Download CSV template
  static async downloadTemplate(req: Request, res: Response) {
    try {
      const template = CSVParserService.generateTemplate();

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="spendguard_template.csv"'
      );
      res.send(template);
    } catch (error: any) {
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