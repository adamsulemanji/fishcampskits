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
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col justify-center items-center text-black">
      {confetti && <ConfettiComponent />}
      <h1 className="text-5xl font-bold mb-4 text-blue-500">Fish Camp Skit Block Creator</h1>
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
        <p className="mt-4 text-xs text-gray-500">Please upload a CSV file with the first column as the skit name and the rest of the columns as participants. No header is needed.</p>
      </div>
      <div className="mt-4">
          Created by Adam Sulemanji
      </div>
      {jsonData && (
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
