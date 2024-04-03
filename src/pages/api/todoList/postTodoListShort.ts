import fs from 'fs/promises';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { fileName, todoList, isBasic, date } = req.body;
        console.log("saveing!!!!!!!!!!!!!!!!!!!!!!!");
        if (!fileName || !date ||  !todoList ||  typeof isBasic === 'undefined') {
            return res.status(400).json({ error: 'Missing file name, todo event data, or isBasic parameter' });
        }

        const filePath = path.join(process.cwd(), 'public', 'todoList', `${fileName}.json`);

        try {
            const fileExists = await fs.access(filePath).then(() => true).catch(() => false);
            if (!fileExists) {
                await fs.writeFile(filePath, '{}', 'utf-8');
                console.log(`${fileName}.json created.`);
            }

            let jsonData:any = [];
            const fileData = await fs.readFile(filePath, 'utf-8');
            jsonData = JSON.parse(fileData);

            if (fileExists && !isBasic) {
                const day = date.substring(date.lastIndexOf("-") + 1);
                jsonData[day]=[...todoList];

            }else{
                jsonData = todoList;
            }

            console.log(jsonData);
            console.log(filePath);

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
