'use client';

import { useState, ChangeEvent } from 'react';
import SkitBlock from './SkitBlock';
import Papa from 'papaparse';
import ConfettiComponent from './Confetti';

function Page() {
  const [csvData, setCsvData] = useState<any[]>([]);
  const [jsonData, setJsonData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confetti, setConfetti] = useState<boolean>(false);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          setCsvData(result.data);
        },
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
          body: JSON.stringify({ data: csvData }),
        });
        const data = await response.json();
        setJsonData(data);
      } catch (err) {
        setError('Error uploading CSV data');
      }
      renderConfetti();
    }
  };

  const renderConfetti = () => {
    setConfetti(true);
    setTimeout(() => {
      setConfetti(false);
    }, 10000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-6 flex flex-col justify-center items-center text-gray-800">
      {confetti && <ConfettiComponent />}
      <h1 className="text-5xl font-extrabold mb-6 text-blue-600">Fish Camp Skit Block Creator</h1>
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-lg w-full">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="mb-4 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
        />
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-3 rounded-md shadow-md hover:bg-blue-700 transition-colors"
        >
          Upload CSV
        </button>
        <p className="mt-4 text-xs text-gray-600">Please upload a CSV file with the first column as the skit name and the rest of the columns as participants. No header is needed.</p>
        <a
          href="/example.csv"
          download
          className="mt-4 inline-block text-xs text-blue-600 hover:text-blue-800 underline"
        >
          Download example CSV
        </a>
      </div>
      <div className="mt-4 text-sm text-gray-600">
        Created by <span className="font-semibold">Adam Sulemanji</span>
      </div>
      {jsonData && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full">
          {jsonData.data.map((skitBlock: any, index: number) => (
            <SkitBlock key={index} skits={skitBlock} blockIndex={index} />
          ))}
        </div>
      )}
      {error && (
        <p className="text-red-500 mt-4">{error}</p>
      )}
    </div>
  );
};

export default Page;
