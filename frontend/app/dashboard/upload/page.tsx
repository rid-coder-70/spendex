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
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
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
      if (response.success) setUploadResult(response.data);
    } catch (error: any) {
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
    const csvContent = `date,description,amount,type,merchant,payment_method,notes\n2025-01-21,Lunch at restaurant,1500.00,expense,Pizza Hut,bKash,Team lunch\n2025-01-20,Freelance project payment,15000.00,income,Client ABC,Bank Transfer,Project completed\n2025-01-19,Grocery shopping,3500.00,expense,Shwapno,Cash,Weekly groceries`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'spendguard_template.csv';
    a.click();
  };

  return (
    <div className="space-y-4 max-w-3xl pb-8">
      <div>
        <h1 className="text-base font-semibold text-zinc-900">Upload CSV</h1>
        <p className="text-xs text-zinc-400 mt-0.5">Bulk import your transactions via CSV</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Card>
            <CardContent className="p-0">
              <div
                className={`border-2 border-dashed m-4 rounded-xl p-8 text-center transition-colors ${
                  dragActive ? 'border-zinc-500 bg-zinc-50' : 'border-zinc-200 hover:border-zinc-300'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {file ? (
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center mb-3">
                      <FileText className="w-5 h-5 text-zinc-600" />
                    </div>
                    <p className="text-sm font-medium text-zinc-900 mb-1">{file.name}</p>
                    <p className="text-xs text-zinc-400 mb-4">{(file.size / 1024).toFixed(1)} KB</p>
                    <div className="flex gap-2">
                      <Button onClick={handleUpload} isLoading={isUploading}>
                        Upload file
                      </Button>
                      <Button variant="outline" onClick={() => setFile(null)} disabled={isUploading}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-zinc-50 rounded-full flex items-center justify-center mb-3">
                      <Upload className="w-5 h-5 text-zinc-400" />
                    </div>
                    <p className="text-sm font-medium text-zinc-900 mb-1">Select a file or drag and drop</p>
                    <p className="text-xs text-zinc-400 mb-4">CSV files up to 10MB</p>
                    <label className="btn-primary px-4 py-2 text-sm rounded-lg cursor-pointer">
                      <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
                      <span className="relative z-10">Select file</span>
                    </label>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Format requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-zinc-900 mb-1">Required columns:</p>
                <ul className="text-xs text-zinc-500 list-disc pl-4 space-y-0.5 marker:text-zinc-300">
                  <li><strong>date</strong> (YYYY-MM-DD)</li>
                  <li><strong>amount</strong> (number)</li>
                  <li><strong>type</strong> (expense/income)</li>
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-900 mb-1">Optional columns:</p>
                <p className="text-xs text-zinc-500">description, merchant, payment_method, notes</p>
              </div>
              <Button variant="secondary" size="sm" onClick={downloadTemplate} className="w-full">
                <Download className="w-3.5 h-3.5" />
                Download template
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {uploadResult && (
        <Card className="animate-in">
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-zinc-50 rounded-lg p-3 text-center border border-zinc-100">
                <p className="text-xl font-semibold text-zinc-900">{uploadResult.total_rows}</p>
                <p className="text-xs text-zinc-500">Total Rows</p>
              </div>
              <div className="bg-emerald-50 rounded-lg p-3 text-center border border-emerald-100">
                <p className="text-xl font-semibold text-emerald-600">{uploadResult.imported}</p>
                <p className="text-xs text-emerald-600/70">Imported</p>
              </div>
              <div className="bg-red-50 rounded-lg p-3 text-center border border-red-100">
                <p className="text-xl font-semibold text-red-600">{uploadResult.failed}</p>
                <p className="text-xs text-red-600/70">Failed</p>
              </div>
            </div>

            {uploadResult.errors?.length > 0 && (
              <div className="border border-red-200 rounded-lg overflow-hidden">
                <div className="bg-red-50 px-3 py-2 border-b border-red-200 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-500" />
                  <p className="text-xs font-medium text-red-800">Errors found</p>
                </div>
                <div className="p-2 bg-white max-h-48 overflow-y-auto divide-y divide-zinc-50">
                  {uploadResult.errors.map((e: any, i: number) => (
                    <div key={i} className="py-1.5 px-2 flex gap-2 text-xs">
                      <span className="font-semibold text-zinc-900 shrink-0">Row {e.row}:</span>
                      <span className="text-red-600">{e.error}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}