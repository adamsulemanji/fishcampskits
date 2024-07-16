'use client';

import { useState, ChangeEvent } from 'react';
import Papa from 'papaparse';

function page() {
  const [csvData, setCsvData] = useState<any[]>([]);
  const [jsonData, setJsonData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          setCsvData(result.data);
        },
        header: false,
        skipEmptyLines: true,
      });
    }
  };

  const handleSubmit = async () => {
    if (csvData.length) {
      try {
        const response = await fetch('/api/parse', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(csvData),
        });
        const data = await response.json();
        setJsonData(data);
      } catch (err) {
        setError('Error uploading CSV data');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col justify-center items-center">
      <h1 className="text-5xl font-bold mb-4">Fish Camp Skit Block Creator</h1>
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="mb-4"
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Upload CSV
        </button>
        {jsonData && (
          <pre className="mt-4 p-4 bg-gray-200 rounded-lg">
            {JSON.stringify(jsonData, null, 2)}
          </pre>
        )}
        {error && (
          <p className="text-red-500 mt-4">{error}</p>
        )}
      </div>
      {jsonData && (
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4">Parsed JSON</h2>
          <pre className="p-4 bg-gray-200 rounded-lg">
            {JSON.stringify(jsonData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default page;
