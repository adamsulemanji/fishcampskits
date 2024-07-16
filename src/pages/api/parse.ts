// src/pages/api/parse.ts

import type { NextApiRequest, NextApiResponse } from 'next';

type Skit = { skitName: string, [key: string]: string };

type ResponseData = {
  message: string;
  data?: any;
};

function createSkitBlocks(skits: Skit[]): Skit[][] {
  const blocks: Skit[][] = [];
  const skitMap: Map<string, Set<string>> = new Map();

  for (const skit of skits) {
    const people = new Set(Object.values(skit).filter((value) => value !== skit.skitName));

    let placed = false;
    for (const block of blocks) {
      const blockPeople = new Set<string>();
      for (const bSkit of block) {
        const bPeople = Object.values(bSkit).filter((value) => value !== bSkit.skitName);
        bPeople.forEach(person => blockPeople.add(person));
      }

      const intersection = [...people].filter(person => blockPeople.has(person));
      if (intersection.length === 0) {
        block.push(skit);
        placed = true;
        break;
      }
    }

    if (!placed) {
      blocks.push([skit]);
    }
  }

  return blocks;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === 'POST') {
    const csvData: Skit[] = req.body;
    const skitBlocks = createSkitBlocks(csvData);
    res.status(200).json({ message: 'CSV data received and processed', data: skitBlocks });
  } else {
    res.status(200).json({ message: 'Hello from Next.js!' });
  }
}
