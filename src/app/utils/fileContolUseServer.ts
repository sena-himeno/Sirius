'use server'
import { type MonthlyStats, type TodoEvent } from '@/app/interface/todoList';
import path from 'path';
import fs from 'fs/promises';
import { type ArchiveConfigType } from '@/app/interface/other';

const checkFileExists = async (filePath: string): Promise<boolean> => {
	try {
		await fs.access(filePath);
		return true;
	} catch (error) {
		return false;
	}
};

const readJSONFile = async <T>(filePath: string): Promise<T> => {
	const fileData = await fs.readFile(filePath, 'utf-8');
	return JSON.parse(fileData);
};

const writeJSONFile = async (filePath: string, data: any): Promise<void> => {
	await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
};

export const getTodoListAtServer = async (fileName: string): Promise<any[]> => {
	const filePath = path.join(process.cwd(), 'public', 'todoList', `${fileName}.json`);
	try {
		const fileExists = await checkFileExists(filePath);
		if (!fileExists) {
			await writeJSONFile(filePath, []);
		}
		return await readJSONFile<any[]>(filePath);
	} catch (error) {
		console.error('错误：', error);
		throw error;
	}
};

export const getTodoDayDiary = async (date: string): Promise<string | null> => {
	const diaryPath = path.join(process.cwd(), 'public', 'diary', `${date}.md`);
	try {
		const diaryExists = await checkFileExists(diaryPath);
		if (diaryExists) {
			const diaryContent = await fs.readFile(diaryPath, 'utf-8');
			return diaryContent === '' ? null : diaryContent;
		} else {
			return null;
		}
	} catch (error) {
		console.error('读取日记文件时出错：', error);
		return null;
	}
};

export const getShortTodoListAtServer = async (date: string): Promise<TodoEvent[] | null> => {
	const preFileName = date.substring(0, date.lastIndexOf('-'));
	const fileName = `${preFileName}-shortTodoList.json`;
	const todoListPath = path.join(process.cwd(), 'public', 'todoList', fileName);
	console.log(fileName)
	try {
		const diaryExists = await checkFileExists(todoListPath);
		if (diaryExists) {
			const todoListShortContent = await readJSONFile<TodoEvent[]>(todoListPath);
			const day = date.substring(date.lastIndexOf('-') + 1);
			console.log(todoListShortContent)
			// @ts-expect-error
			return todoListShortContent[day];
		} else {
			return null;
		}
	} catch (error) {
		console.error('加载基本待办事项列表时出错：', error);
		throw error;
	}
};

export const monthlyStatsForYear = async (todoList: TodoEvent[], year: string): Promise<MonthlyStats[]> => {
	const monthlyStats: MonthlyStats[] = Array.from({ length: 12 }, (_, i) => ({
		month: `${i < 9 ? '0' : ''}${i + 1}`,
		doneTasks: 0,
		addedTasks: 0
	}));

	todoList.forEach(item => {
		const { doneTime, addTime } = item;
		if ((doneTime != null) && doneTime.startsWith(year)) {
			const monthIndex = parseInt(doneTime.substring(5, 7)) - 1;
			monthlyStats[monthIndex].doneTasks++;
		}
		if (addTime.startsWith(year)) {
			const monthIndex = parseInt(addTime.substring(5, 7)) - 1;
			monthlyStats[monthIndex].addedTasks++;
		}
	});
	return monthlyStats;
};

export const getMood = async (currentDate: string): Promise<string> => {
	const month = currentDate.substring(0, 7);
	const filePath = path.join(process.cwd(), 'public', 'diary', `${month}-mood.json`);
	const moodExists = await checkFileExists(filePath);
	if (moodExists) {
		const moodData = await readJSONFile<[{ day: string, mood: string }]>(filePath); // 正确类型化为 MoodData 数组
		const day = currentDate.substring(currentDate.lastIndexOf('-') + 1);
		const moodEntry = moodData.find((mood) => mood.day === day && mood.mood.length !== 0);
		return (moodEntry != null) ? moodEntry.mood : 'Empty';
	}
	return 'Empty';
};
export const getDiaryCharCountByMonth = async (currentDate: string): Promise<Array<{ day: number, diaryCharCount: number }>> => {
	const [year, month] = currentDate.split('-');
	const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate();
	const diaryCounts: Array<{ day: number, diaryCharCount: number }> = [];

	for (let day = 1; day <= daysInMonth; day++) {
		const paddedDay = day < 10 ? `0${day}` : day.toString();
		const dayContent = await getTodoDayDiary(`${year}-${month}-${paddedDay}`);
		diaryCounts.push({ day, diaryCharCount: (dayContent != null) ? dayContent.length : 0 });
	}
	return diaryCounts;
};

export const getDefaultTodoShortContent = async (date: string): Promise<any[]> => {
	const filePath = path.join(process.cwd(), 'public', 'config', 'defaultTodoShort.json');
	const fileExists = await checkFileExists(filePath);
	return fileExists ? await readJSONFile<any[]>(filePath) : [];
};

export const getTodayTodoShortContent = async (date: string): Promise<any[]> => {
	const preFileName = date.substring(0, date.lastIndexOf('-'));
	const day = date.substring(date.lastIndexOf('-') + 1);
	const fileName = `${preFileName}-shortTodoList.json`;
	const filePath = path.join(process.cwd(), 'public', 'todoList', fileName);
	const fileExists = await checkFileExists(filePath);
	// @ts-expect-error
	return fileExists ? (Boolean((await readJSONFile<any[]>(filePath))[day])) || [] : [];
};

export const postTodoShortAtServer = async (date: string, todoListShort: TodoEvent[]): Promise<boolean> => {
	const preFileName = date.substring(0, date.lastIndexOf('-'));
	const fileName = `${preFileName}-shortTodoList.json`;
	const filePath = path.join(process.cwd(), 'public', 'todoList', fileName);
	const fileExists = await checkFileExists(filePath);

	if (fileExists) {
		try {
			const jsonData: any = await readJSONFile(filePath);
			const day = date.substring(date.lastIndexOf('-') + 1);
			jsonData[day] = todoListShort;
			await writeJSONFile(filePath, jsonData);
			return true;
		} catch (error) {
			console.error('写入文件时出错：', error);
			return false;
		}
	}
	return false;
};

export const readConfig = async (fileName: string): Promise<ArchiveConfigType> => {
	const filePath = path.join(process.cwd(), 'public', 'config', `${fileName}.json`);
	const fileExists = await checkFileExists(filePath);
	return fileExists ? await readJSONFile<ArchiveConfigType>(filePath) : defaultArchiveConfig;
};

export const writeConfig = async (fileName: string, configs: ArchiveConfigType): Promise<ArchiveConfigType> => {
	const filePath = path.join(process.cwd(), 'public', 'config', `${fileName}.json`);
	await writeJSONFile(filePath, configs);
	return defaultArchiveConfig;
};

export const archiveMain = async (date: string): Promise<boolean> => {
	const archiveConfig = await readConfig('archiveConfig');
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { todo, diary, mood, chart, defaultPreMonth, selectMonth, fullYear, via } = archiveConfig;
	let archiveContent = '';

	const year = Number(date.split('-')[0]);
	const preMonth = Number(date.split('-')[1]) - 1;
	const daysInMonth = new Date(year, preMonth, 0).getDate();
	const stringPreMonth = preMonth < 10 ? '0' + preMonth : String(preMonth);

	if (defaultPreMonth && via === 'day') {
		archiveContent += `# ${year}${stringPreMonth}\n`;
		for (let i = 1; i <= daysInMonth; i++) {
			const day = String(i).padStart(2, '0');
			const targetDate = `${year}-${stringPreMonth}-${day}`;
			archiveContent += `## ${targetDate}\n\n---\n`;

			if (mood) {
				const currentMoodData = await archiveMood(targetDate);
				archiveContent += `### ${currentMoodData}\n`;
			}
			if (diary) {
				const currentDiaryContent = await archiveDiary(targetDate);
				archiveContent += currentDiaryContent;
			}
			archiveContent += '\n\n\n';
		}
	}
	console.log(archiveContent);
	return await saveArchiveFile(path.join(process.cwd(), 'public', 'archive'), `${date}-archive`, archiveContent);
};

export const saveArchiveFile = async (path: string, fileName: string, data: string): Promise<boolean> => {
	try {
		await fs.mkdir(path, { recursive: true });
		await fs.writeFile(`${path}/${fileName}.md`, data, 'utf8');
		return true;
	} catch (error) {
		console.error('保存文件失败：', error);
		return false;
	}
};

export const archiveTodo = async (date: string): Promise<boolean> => false;

export const archiveMood = async (date: string): Promise<string> => {
	const currentMoodData = await getMood(date);
	return currentMoodData !== 'Empty' ? `心情 ${currentMoodData}` : '今天没有心情记录';
};

export const archiveDiary = async (date: string): Promise<string> => {
	const currentDiaryContent = await getTodoDayDiary(date);
	return (currentDiaryContent != null) ? `### 日记内容 \n${currentDiaryContent}` : '### 今天没有日记记录';
};

export const archiveChart = async (date: string): Promise<boolean> => {
	return false
}

const defaultArchiveConfig: ArchiveConfigType = {
	todo: true,
	diary: true,
	mood: true,
	chart: false,
	defaultPreMonth: true,
	selectMonth: '',
	fullYear: false,
	via: 'day'
};
