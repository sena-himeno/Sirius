import fs from 'fs/promises';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

const MOODS_DIR = path.join(process.cwd(), 'public', 'diary');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const { month } = req.query;
            const filename = `${month}-mood.json`;

            const filePath = path.join(MOODS_DIR, filename);
            await fs.access(filePath);

            res.status(200).json({ exists: true });
        } catch (error:any) {
            if (error.code === 'ENOENT') {
                res.status(404).json({ exists: false });
            } else {
                console.error('Error checking file existence:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
