import { type NextApiRequest, type NextApiResponse } from 'next';
import fs from 'fs-extra';
import path from 'path';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default async function handler (req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { date } = req.body;
            const diaryPath = path.join(process.cwd(), 'public', 'diary', `${date}.md`);
            const fileExists = await fs.pathExists(diaryPath);
            res.status(200).json({ fileExists });
        } catch (error: any) {
            res.status(500).json({ message: 'Error checking Markdown file', error: error.message });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
