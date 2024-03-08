import fs from 'fs/promises';
import path from 'path';
import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const {fileName} = req.body;

        const filePath = path.join(process.cwd(), 'public', 'todoList', `${fileName}.json`);

        try {
            // 检查文件是否存在
            const fileExists = await fs.access(filePath).then(() => true).catch(() => false);

            if (!fileExists) {
                // 如果文件不存在，则创建一个空数组写入文件
                await fs.writeFile(filePath, '[]', 'utf-8');
                console.log(`${fileName}.json created.`);
            }

            // 读取文件内容
            const fileData = await fs.readFile(filePath, 'utf-8');
            const jsonData = JSON.parse(fileData);

            res.status(200).json(jsonData);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({error: 'Internal Server Error'});
        }
    }
}
