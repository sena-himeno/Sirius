import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs-extra';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { date } = req.body;
            const diaryPath = path.join(process.cwd(),'public', 'diary', `${date}.md`);
            const fileExists = await fs.pathExists(diaryPath);
            return res.status(200).json({ fileExists });

        } catch (error:any) {
            return res.status(500).json({ message: 'Error checking Markdown file', error: error.message });
        }
    } else {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
}
