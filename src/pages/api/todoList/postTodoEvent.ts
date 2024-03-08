import fs from 'fs/promises';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {

        const { fileName, todoEvent } = req.body;
        console.log('fileName:', fileName);
        console.log('todoEvent:', todoEvent);
        if (!fileName || !todoEvent) {
            return res.status(400).json({ error: 'Missing file name or todo event data' });
        }

        const filePath = path.join(process.cwd(), 'public', 'todoList', `${fileName}.json`);

        try {
            // 读取文件内容
            const fileData = await fs.readFile(filePath, 'utf-8');
            const jsonData = JSON.parse(fileData);

            jsonData.push(todoEvent);

            await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf-8');

            res.status(200).json({ success: true });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
