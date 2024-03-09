import fs from 'fs/promises';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { fileName, todoEvent, isUpdateList } = req.body;

        if (!fileName || !todoEvent || typeof isUpdateList === 'undefined') {
            return res.status(400).json({ error: 'Missing file name, todo event data, or isUpdateList parameter' });
        }

        const filePath = path.join(process.cwd(), 'public', 'todoList', `${fileName}.json`);

        try {
            const fileData = await fs.readFile(filePath, 'utf-8');
            let jsonData = JSON.parse(fileData);

            if (isUpdateList) {
                jsonData = todoEvent;
            } else {
                jsonData.push(todoEvent);
            }
            console.log(jsonData+"jsonData");
            console.log(fileData+"fileData");

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
