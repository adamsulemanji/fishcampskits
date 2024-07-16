// SkitBlock.tsx
import React from 'react';

interface Skit {
  skitName: string;
  [key: string]: string;
}

interface SkitBlockProps {
  skits: Skit[];
  blockIndex: number;
}

const SkitBlock: React.FC<SkitBlockProps> = ({ skits, blockIndex }) => {
  return (
    <div className="my-4 p-4 border rounded shadow-lg text-black">
      <h2 className="text-2xl font-bold mb-2">Skit Block {blockIndex + 1}</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 border-b">Skit Name</th>
            <th className="py-2 border-b">Persons</th>
          </tr>
        </thead>
        <tbody>
          {skits.map((skit, index) => (
            <tr key={index} className="border-t">
              <td className="py-2 border-b p-2">{skit.skitName}</td>
              <td className="py-2 border-b">
                {Object.entries(skit)
                  .filter(([key]) => key.startsWith('Person'))
                  .map(([key, value]) => value)
                  .join(', ')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SkitBlock;
