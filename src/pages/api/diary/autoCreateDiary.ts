import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs-extra';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { date } = req.body;
            const currentDate = new Date();
            const localDate = currentDate.toLocaleDateString('en-CA');
            console.log("localDate"+localDate);
            console.log("date"+date);
            // 约束 检查日期是否超过今天
            if (date > localDate) {
                return res.status(400).json({ message: 'Date cannot exceed today' });
            }

            const diaryPath = path.join('public/diary/', `${date}.md`);

            // 检查文件是否存在，如果不存在则创建文件
            const fileExists = await fs.pathExists(diaryPath);
            if (!fileExists) {
                await fs.writeFile(diaryPath, '');
                return res.status(200).json({ message: 'Markdown file created successfully' });
            } else {
                // 如果文件已经存在，直接返回空响应
                return res.status(200).json({});
            }
        } catch (error:any) {
            return res.status(500).json({ message: 'Error creating Markdown file', error: error.message });
        }
    } else {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
}
