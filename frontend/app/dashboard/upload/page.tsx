'use client';

import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, XCircle, Download } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { transactionsAPI } from '@/lib/api';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadResult(null);

    try {
      const response = await transactionsAPI.uploadCSV(file);
      if (response.success) {
        setUploadResult(response.data);
      }
    } catch (error: any) {
      console.error('Upload failed:', error);
      setUploadResult({
        total_rows: 0,
        imported: 0,
        failed: 0,
        errors: [{ row: 0, error: 'Upload failed. Please try again.' }],
      });
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = `date,description,amount,type,merchant,payment_method,notes
2025-01-21,Lunch at restaurant,1500.00,expense,Pizza Hut,bKash,Team lunch
2025-01-20,Freelance project payment,15000.00,income,Client ABC,Bank Transfer,Project completed
2025-01-19,Grocery shopping,3500.00,expense,Shwapno,Cash,Weekly groceries`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'spendguard_template.csv';
    a.click();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Upload Transactions</h1>
        <p className="text-gray-600 mt-2">
          Import multiple transactions at once using a CSV file
        </p>
      </div>

      {/* CSV Format Info */}
      <Card>
        <CardHeader>
          <CardTitle>CSV Format Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-900 mb-2">Required Columns:</p>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li><strong>date</strong> - Transaction date (YYYY-MM-DD format preferred)</li>
                <li><strong>amount</strong> - Transaction amount (positive number)</li>
                <li><strong>type</strong> - Transaction type ("expense" or "income")</li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 mb-2">Optional Columns:</p>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>description, merchant, payment_method, notes</li>
              </ul>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={downloadTemplate}
              className="mt-3"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Sample CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upload Area */}
      <Card>
        <CardContent className="pt-6">
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              dragActive
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-300 hover:border-primary-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {file ? (
              <div>
                <FileText className="w-16 h-16 mx-auto text-primary-600 mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">{file.name}</p>
                <p className="text-sm text-gray-500 mb-4">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={handleUpload} isLoading={isUploading}>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload File
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setFile(null)}
                    disabled={isUploading}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <Upload className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Drag and drop your CSV file here
                </p>
                <p className="text-sm text-gray-500 mb-4">or</p>
                <label className="btn-primary cursor-pointer inline-block">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  Choose File
                </label>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Upload Results */}
      {uploadResult && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Summary */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">
                    {uploadResult.total_rows}
                  </p>
                  <p className="text-sm text-gray-600">Total Rows</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">
                    {uploadResult.imported}
                  </p>
                  <p className="text-sm text-gray-600">Imported</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <p className="text-2xl font-bold text-red-600">
                    {uploadResult.failed}
                  </p>
                  <p className="text-sm text-gray-600">Failed</p>
                </div>
              </div>

              {/* Success Message */}
              {uploadResult.imported > 0 && (
                <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-900">
                      Successfully imported {uploadResult.imported} transactions
                    </p>
                    <p className="text-sm text-green-700 mt-1">
                      Your transactions have been added to your account.
                    </p>
                  </div>
                </div>
              )}

              {/* Errors */}
              {uploadResult.errors && uploadResult.errors.length > 0 && (
                <div>
                  <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg mb-3">
                    <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-900">
                        {uploadResult.failed} rows failed to import
                      </p>
                      <p className="text-sm text-red-700 mt-1">
                        Please fix the errors below and try again.
                      </p>
                    </div>
                  </div>

                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {uploadResult.errors.map((error: any, index: number) => (
                      <div
                        key={index}
                        className="p-3 bg-red-50 border border-red-200 rounded text-sm"
                      >
                        <span className="font-medium text-red-900">Row {error.row}:</span>{' '}
                        <span className="text-red-700">{error.error}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action */}
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setFile(null);
                    setUploadResult(null);
                  }}
                >
                  Upload Another File
                </Button>
                <Button
                  variant="outline"
                  onClick={() => (window.location.href = '/dashboard/transactions')}
                >
                  View Transactions
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}