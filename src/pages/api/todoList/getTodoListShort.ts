import fs from 'fs/promises';
import path from 'path';
import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const {fileName,date} = req.body;
        let filePath = path.join(process.cwd(), 'public', 'todoList', `${fileName}.json`);

        try {
            const fileExists = await fs.access(filePath).then(() => true).catch(() => false);

            if (!fileExists) {
                await fs.writeFile(filePath, '[]', 'utf-8');
                console.log(`${fileName}.json created.`);
            }

            const fileData = await fs.readFile(filePath, 'utf-8');
            let jsonData = JSON.parse(fileData);
            if(null !== date){
                let day = date.substring(date.lastIndexOf("-") + 1);
                jsonData = jsonData[day];

            }

            console.log(jsonData)

            res.status(200).json(jsonData);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({error: 'Internal Server Error'});
        }
    }
}
