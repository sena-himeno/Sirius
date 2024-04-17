import axios from 'axios';

export const MOOD_CHOOSE = ['٩(◕‿◕｡)۶', ' (´；ω；`)', '｡ﾟ( ﾟஇ‸இﾟ)ﾟ｡', ' (╬ Ò ‸ Ó)', '(≧◡≦)', '(≧∇≦)', '(´～｀)', ' (´∀｀)♡', '(ﾉ*>∀<)ﾉ', '（╥_╥）'];
export const MAX_RETRY_COUNT = 5;

export const createMarkdownFile = async (localDate: string) => {
    try {
        await axios.post('/api/diary/autoCreateDiary', { date: localDate });
    } catch (error) {
        console.error('Error creating Markdown file:', error);
    }
};

export const checkCurrentMonthDiaryFile = async () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const datesToCheck: Date[] = [];
    for (let i = 1; i <= 31; i++) {
        const date = new Date(currentDate.getFullYear(), currentMonth, i);
        if (date.getMonth() !== currentMonth) {
            break;
        }
        datesToCheck.push(date);
    }
    const results: Record<string, boolean> = {};
    for (const date of datesToCheck) {
        try {
            const dateString = date.toLocaleDateString('en-CA');
            const response = await axios.post('/api/diary/checkDiaryFile', { date: dateString });
            results[dateString] = response.data.fileExists;
        } catch (error) {
            console.error('Error checking Markdown file:', error);
            results[date.toLocaleDateString('en-CA')] = false;
        }
    }
    return results;
};

export const checkMoodFileExists = async (currentDate: string) => {
    try {
        const month = currentDate.substring(0, 7);

        const checkResponse = await axios.get('/api/diary/checkMoodFile', {
            params: {
                month
            }
        });

        return checkResponse.data.exists;
    } catch (error) {
        console.error('Error checking file existence:', error);
        return false;
    }
};

export const fetchMoodData = async (currentDate: string) => {
    try {
        const month = currentDate.substring(0, 7);
        const response = await axios.get(`diary/${month}-mood.json`);

        return response.data.sort((a: { day: string, mood: string }, b: { day: string, mood: string }) => parseInt(b.day) - parseInt(a.day));
    } catch (error) {
        console.error('Error fetching mood data:', error);
        return [];
    }
};

export const postCurrentDayMood = async (currentDate: string, mood: string, moodData: Array<{ day: string, mood: string }>) => {
    try {
        const response = await axios.post('/api/diary/pushCurrentDayMood', {
            date: currentDate,
            mood
        });

        if (response.status === 200) {
            const updatedMoodData = [...moodData];
            const index = updatedMoodData.findIndex(item => item.day === currentDate.substring(8, 10));
            if (index !== -1) {
                updatedMoodData[index].mood = mood;
            } else {
                updatedMoodData.push({ day: currentDate.substring(8, 10), mood });
            }
            return updatedMoodData;
        } else {
            console.error('保存心情数据失败');
            return moodData;
        }
    } catch (error) {
        console.error('保存心情数据出错:', error);
        return moodData;
    }
};
