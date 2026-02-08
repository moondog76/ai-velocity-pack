'use client';

import { useState } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AuditUploadFormProps {
  companyId: string;
  existingAudit: any;
}

export function AuditUploadForm({ companyId, existingAudit }: AuditUploadFormProps) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    const allowedTypes = ['.md', '.txt', '.pdf'];
    const fileExt = '.' + selectedFile.name.split('.').pop()?.toLowerCase();
    if (!allowedTypes.includes(fileExt)) {
      setError('Please upload a .md, .txt, or .pdf file');
      return;
    }

    // Validate file size (10MB max)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setFile(selectedFile);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('companyId', companyId);

      const response = await fetch('/api/audit/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Upload failed');
      }

      // Success - refresh the page
      router.refresh();
      setFile(null);
    } catch (err: any) {
      setError(err.message || 'Failed to upload audit');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Select Audit Report File
        </label>
        <div className="flex items-center gap-3">
          <input
            type="file"
            accept=".md,.txt,.pdf"
            onChange={handleFileChange}
            className="block w-full text-sm text-slate-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100
              cursor-pointer"
          />
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Supported formats: .md, .txt, .pdf (Max 10MB)
        </p>
      </div>

      {file && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex items-center gap-3">
          <FileText className="h-5 w-5 text-slate-400" />
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-900">{file.name}</p>
            <p className="text-xs text-slate-500">
              {(file.size / 1024).toFixed(1)} KB
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={!file || uploading}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
      >
        <Upload className="h-4 w-4" />
        {uploading ? 'Uploading...' : existingAudit ? 'Replace Audit' : 'Upload Audit'}
      </button>
    </form>
  );
}
