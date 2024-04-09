import fs from 'fs/promises';
import path from 'path';
import { type NextApiRequest, type NextApiResponse } from 'next';

export default async function handler (req: NextApiRequest, res: NextApiResponse): Promise<any> {
    if (req.method === 'POST') {
        const { fileName, todoEvent, isUpdateList } = req.body;
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (!fileName || !todoEvent || typeof isUpdateList === 'undefined') {
            res.status(400).json({ error: 'Missing file name, todo event data, or isUpdateList parameter' }); return;
        }
        const filePath = path.join(process.cwd(), 'public', 'todoList', `${fileName}.json`);
        try {
            const fileData = await fs.readFile(filePath, 'utf-8');
            let jsonData = JSON.parse(fileData);
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
            if (isUpdateList) {
                jsonData = todoEvent;
            } else {
                jsonData.push(todoEvent);
            }
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
