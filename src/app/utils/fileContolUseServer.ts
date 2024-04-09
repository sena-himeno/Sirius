'use server'
import path from 'path';
import fs from 'fs/promises';
import { type TodoEvent } from '@/app/interface/todoList';

// todo
export const getTodoListAtServer = async (fileName: string): Promise<any> => {
	const filePath = path.join(process.cwd(), 'public', 'todoList', `${fileName}.json`);
	try {
		const fileExists = await fs.access(filePath).then(() => true).catch(() => false);
		if (!fileExists) {
			await fs.writeFile(filePath, '[]', 'utf-8');
			console.log(`${fileName}.json created.`);
		}
		const fileData = await fs.readFile(filePath, 'utf-8');
		return JSON.parse(fileData);
	} catch (error) {
		console.error('Error:', error);
	}
}

// diary
export const getTodoDayDiary = async (date: string): Promise<string | null> => {
	const diaryPath = path.join(process.cwd(), 'public', 'diary', `${date}.md`);
	try {
		const diaryExists = await fs.access(diaryPath).then(() => true).catch(() => false);
		if (diaryExists) {
			const diaryContent = await fs.readFile(diaryPath, 'utf-8');
			return diaryContent === '' ? null : diaryContent;
		} else {
			return null;
		}
	} catch (error) {
		console.error('Error reading diary file:', error);
		return null;
	}
};

export const getShortTodoListAtServer = async (date: string): Promise<TodoEvent[] | null> => {
	const preFileName = date.substring(0, date.lastIndexOf('-'));
	const fileName = preFileName + '-shortTodoList';
	try {
		const todoListPath = path.join(process.cwd(), 'public', 'todoList', `${fileName}.json`);
		const diaryExists = await fs.access(todoListPath).then(() => true).catch(() => false);
		if (diaryExists) {
			const todoListShortContent = await fs.readFile(todoListPath, 'utf-8');
			const todoListObject = JSON.parse(todoListShortContent);
			const day = date.substring(date.lastIndexOf('-') + 1);
			return todoListObject[day];
		} else {
			return null;
		}
	} catch (error) {
		console.error('Error load basic todo list:', error);
		throw error;
	}
}
