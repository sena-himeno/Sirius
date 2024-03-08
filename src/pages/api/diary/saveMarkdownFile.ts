import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs-extra';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            let { content, filePath } = req.body;
            let savedFilePath = "public/"+filePath;
            await fs.writeFile(savedFilePath, content);

            res.status(200).json({ message: 'File saved successfully' });
        } catch (error:any) {
            res.status(500).json({ message: 'Error saving file', error: error.message });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
