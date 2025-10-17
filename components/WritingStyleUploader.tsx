import React, { useState, useCallback } from 'react';

interface WritingStyleUploaderProps {
  onStyleUpload: (style: string | null) => void;
}

const WritingStyleUploader: React.FC<WritingStyleUploaderProps> = ({ onStyleUpload }) => {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        onStyleUpload(text);
        setFileName(file.name);
      };
      reader.readAsText(file);
    } else {
      onStyleUpload(null);
      setFileName(null);
    }
  }, [onStyleUpload]);
  
  const handleRemoveFile = () => {
      onStyleUpload(null);
      setFileName(null);
      const input = document.getElementById('file-upload') as HTMLInputElement;
      if (input) {
          input.value = '';
      }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {!fileName ? (
        <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-[var(--border-color)] border-dashed rounded-lg cursor-pointer bg-[var(--bg-tertiary)] hover:bg-[var(--bg-interactive)] transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg className="w-8 h-8 mb-4 text-[var(--text-muted)]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
            </svg>
            <p className="mb-2 text-sm text-[var(--text-muted)]"><span className="font-semibold text-[var(--text-secondary)]">Click to upload</span> a .txt file</p>
            <p className="text-xs text-gray-500">with examples of your writing</p>
          </div>
          <input id="file-upload" type="file" className="hidden" accept=".txt" onChange={handleFileChange} />
        </label>
      ) : (
        <div className="w-full p-4 text-center bg-[var(--bg-tertiary)] border border-[var(--accent-primary)] rounded-lg">
          <p className="text-green-400">File uploaded successfully!</p>
          <p className="text-sm text-[var(--text-secondary)] truncate mt-1">{fileName}</p>
          <button onClick={handleRemoveFile} className="mt-2 text-xs text-red-400 hover:text-red-300">
            Remove file
          </button>
        </div>
      )}
    </div>
  );
};

export default WritingStyleUploader;