'use server'
import path from 'path';
import fs from 'fs/promises';
import {type MonthlyStats, type TodoEvent} from '@/app/interface/todoList';

// todo
export const getTodoListAtServer = async (fileName: string): Promise<any> => {
	const filePath = path.join(process.cwd(), 'public', 'todoList', `${fileName}.json`);
	try {
		const fileExists = await fs.access(filePath).then(() => true).catch(() => false);
		if (!fileExists) {
			await fs.writeFile(filePath, '[]', 'utf-8');
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

export const monthlyStatsForYear = async (todoList: TodoEvent[], year: string): Promise<MonthlyStats[]> => {
	const monthlyStats: MonthlyStats[] = [];

	for (let i = 1; i <= 12; i++) {
		const monthStr = i < 10 ? `0${i}` : `${i}`;
		monthlyStats.push({ month: `${monthStr}`, doneTasks: 0, addedTasks: 0 });
	}

	todoList.forEach(item => {
		if ((item.doneTime != null) && item.doneTime.startsWith(year)) {
			const monthIndex = parseInt(item.doneTime.substring(5, 7)) - 1;
			monthlyStats[monthIndex].doneTasks++;
		}
		if (item.addTime.startsWith(year)) {
			const monthIndex = parseInt(item.addTime.substring(5, 7)) - 1;
			monthlyStats[monthIndex].addedTasks++;
		}
	});
	return monthlyStats;
}

export const getMood = async (currentDate: string): Promise<string> => {
	const month = currentDate.substring(0, 7);
	const filePath = path.join(process.cwd(), 'public', 'diary', `${month}-mood.json`);
	await fs.access(filePath);
	const moodData = await fs.readFile(filePath, 'utf-8');
	const moodJson = JSON.parse(moodData);
	const day = currentDate.substring(currentDate.lastIndexOf('-') + 1);
	for (const moods of moodJson) {
		if (moods.day === day && moods.mood.length !== 0) {
			return moods.mood;
		}
	}
	return 'Empty';
}

export const getDiaryCharCountByMonth = async (currentDate: string): Promise<Array<{ day: number, diaryCharCount: number }>> => {
	const result: Array<{ day: number, diaryCharCount: number }> = [];
	const [year, month] = currentDate.split('-');
	const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate();

	for (let day = 1; day <= daysInMonth; day++) {
		const paddedDay = day < 10 ? `0${day}` : day.toString();
		const dayContent = await getTodoDayDiary(`${year}-${month}-${paddedDay}`);
		result.push({ day, diaryCharCount: (dayContent != null) ? dayContent.length : 0 });
	}

	return result;
}

export const getDefaultTodoSHortContent = async (): Promise<any> => {
	const filePath = path.join(process.cwd(), 'public', 'config', 'defaultTodoShort.json');
	const fileExists = await fs.access(filePath).then(() => true).catch(() => false);
	if (fileExists) {
		return await fs.readFile(filePath, 'utf-8');
	}
	return [];
}
export const getTodayTodoSHortContent = async (date: string): Promise<any> => {
	const preFileName = date.substring(0, date.lastIndexOf('-'));
	const day = date.substring(date.lastIndexOf('-') + 1);
	const filePath = path.join(process.cwd(), 'public', 'todoList', `${preFileName}-shortTodoList.json`);
	const fileExists = await fs.access(filePath).then(() => true).catch(() => false);
	if (fileExists) {
		const fileData = await fs.readFile(filePath, 'utf-8');
		const jsonData = JSON.parse(fileData);
		return jsonData[day];
	}
	return [];
}

export const postTodoShortAtServer = async (date: string, todoListShort: TodoEvent[]): Promise<boolean> => {
	const preFileName = date.substring(0, date.lastIndexOf('-'));
	const fileName = preFileName + '-shortTodoList';
	const filePath = path.join(process.cwd(), 'public', 'todoList', `${fileName}.json`);
	const fileExists = await fs.access(filePath).then(() => true).catch(() => false);

	if (fileExists) {
		try {
			const jsonData: any = await fs.readFile(filePath, 'utf-8').then(data => JSON.parse(data)).catch(() => ({}));

			const day = date.substring(date.lastIndexOf('-') + 1);
			// @ts-ignore
			jsonData[day] = JSON.parse(todoListShort);

			await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf-8');
			return true;
		} catch (error) {
			console.error('写入文件时出错:', error);
			return false;
		}
	}
	return false;
};

const defaultArchiveConfig: archiveConfigType = {
	todo: true,
	diary: true,
	mood: true,
	chart: false,
	defaultPreMonth: true,
	selectMonth: '',
	fullYear: false,
	via: 'day'
}

export const readConfig = async (fileName: string): Promise<archiveConfigType> => {
	const filePath = path.join(process.cwd(), 'public', 'config', `${fileName}.json`);
	const fileExists = await fs.access(filePath).then(() => true).catch(() => false);
	if (fileExists) {
		return await fs.readFile(filePath, 'utf-8').then(data => JSON.parse(data)).catch(() => ({}));
	}
	return defaultArchiveConfig
}
export const writeConfig = async (fileName: string, configs: archiveConfigType): Promise<archiveConfigType> => {
	console.log(configs)
	const filePath = path.join(process.cwd(), 'public', 'config', `${fileName}.json`);
	const fileExists = await fs.access(filePath).then(() => true).catch(() => false);
	if (fileExists) {
		await fs.writeFile(filePath, JSON.stringify(configs, null, 2), 'utf-8');
	}
	return defaultArchiveConfig
}

// archive
export interface archiveConfigType {
	'todo': boolean
	'diary': boolean
	'mood': boolean
	'chart': boolean
	'defaultPreMonth': boolean
	'selectMonth': string
	'fullYear': boolean
	'via': string
}
export const archiveMain = async (date: string): Promise<boolean> => {
	const archiveConfig = await readConfig('archiveConfig');
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const	 { todo, diary, mood, chart, defaultPreMonth, selectMonth, fullYear, via } = archiveConfig;
	let archiveContent = '';

	const year: number = Number(date.split('-')[0])
	const preMonth: number = Number(date.split('-')[1]) - 1
	const daysInMonth = new Date(year, preMonth, 0).getDate()
	const stringPreMonth = preMonth < 10 ? '0' + preMonth : String(preMonth)
	if (defaultPreMonth && via === 'day') {
		archiveContent += '# ' + year + stringPreMonth + '\n';
		for (let i = 1; i <= daysInMonth; i++) {
			let day = String(i);
			if (i < 10) {
				day = '0' + day
			}
			const targetDate = String(year) + '-' + stringPreMonth + '-' + day;
			archiveContent += '## ' + targetDate + '\n\n';
			archiveContent += '---' + '\n';
			// archive mood
			if (mood) {
				const currentMoodData = await archiveMood(targetDate)
				archiveContent += '### ' + currentMoodData + '\n';
			}
			// archive diary
			if (diary) {
				const currentDiaryContent = await archiveDiary(targetDate);
				archiveContent += currentDiaryContent;
			}

			// archive chart

			// archive todo

			archiveContent += '\n\n\n';
		}
	}
	console.log(archiveContent)
	return await saveArchiveFile(path.join(process.cwd(), 'public', 'archive'), date + '-archive', archiveContent)
}

export const saveArchiveFile = async (path: string, fileName: string, data: string): Promise<boolean> => {
	try {
		await fs.mkdir(path, { recursive: true });
		await fs.writeFile(`${path}/${fileName}.md`, data, 'utf8');
		return true;
	} catch (error) {
		console.error('Failed to save file:', error);
		return false;
	}
};

// export const archiveByMonth = async (month: string, operate: []) => {
//
// }
export const archiveTodo = async (date: string): Promise<boolean> => {
	return false
}
export const archiveMood = async (date: string): Promise<string> => {
	const currentMoodData = await getMood(date)
	if (currentMoodData !== null && currentMoodData !== 'Empty') {
		return 'mood ' + currentMoodData
	} else {
		return 'No mood entries for today';
	}
}
export const archiveDiary = async (date: string): Promise<string> => {
	const currentDiaryContent = await getTodoDayDiary(date);
	if (currentDiaryContent !== null) {
		return '### DiaryContent \n' + currentDiaryContent
	} else {
		return '### No diary entries for today';
	}
}

export const archiveChart = async (date: string): Promise<boolean> => {
	return false
}
