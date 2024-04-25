'use client'
import React, { useState, useEffect } from 'react';
import { type TodoEvent } from '@/app/interface/todoList';
import styles from '@/style/home.module.css';
import QuadrantChart from './chart/QuadrantChart';
import { getDiaryCharCountByMonth, getMood } from '@/app/utils/fileContolUseServer';
import { getDate } from '@/app/utils/common';
import 'bootstrap/dist/css/bootstrap.min.css';
import DiaryCharCountLineChart from '@/app/components/chart/DiaryCharCountLineChart';

const countEventsByType = (todoItem: TodoEvent[], eventType: string, status: string): number => {
    return todoItem.filter(item => item.eventType === eventType && item.status !== status).length;
};

const BasicState: React.FC<{ todoItem: TodoEvent[], diaryContent: string | null }> = ({ todoItem, diaryContent }) => {
    const [hasDiaryContent, setHasDiaryContent] = useState<string>('Empty');
    const [inProgressCount, setInProgressCount] = useState<number>(0);
    const [pendingCount, setPendingCount] = useState<number>(0);
    const [eventCounts, setEventCounts] = useState<number[]>([]);
    const [todayMood, setTodayMood] = useState<string | undefined>('');
    const [diaryCharCount, setDiaryCharCount] = useState<any>(null);
    const [selectedChart, setSelectedChart] = useState<'quadrant' | 'diaryCharCount'>('quadrant');

    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            const mood = await getMood(getDate());
            setTodayMood(mood);
            const charCount = await getDiaryCharCountByMonth(getDate());
            setDiaryCharCount(charCount);
        };
         void fetchData();
    }, []);

    useEffect(() => {
        setHasDiaryContent(diaryContent === null ? 'Empty' : diaryContent.length + ' char');
        setInProgressCount(todoItem.filter(item => item.status === 'in-progress').length);
        setPendingCount(todoItem.filter(item => item.status === 'padding').length);
        setEventCounts([
            countEventsByType(todoItem, 'urgentImportant', 'done'),
            countEventsByType(todoItem, 'urgentNotImportant', 'done'),
            countEventsByType(todoItem, 'notUrgentImportant', 'done'),
            countEventsByType(todoItem, 'notUrgentNotImportant', 'done')
        ]);
    }, [todoItem, diaryContent]);

    return (
        <div className={styles.basicStateContainer}>
            <div className={`row ${styles.basicStateContent}`}>
                <h4 className={'text-center'}>Basic State <i className="bi bi-clipboard2-pulse"></i></h4>
                <div className="col-8">
                    <p>{"Today's Diary:"}</p>
                    <p>{"Today's Mood:"}</p>
                    <p>{'Count in Progress:'}</p>
                    <p>{'Pending Count:'}</p>
                </div>
                <div className="col-4 text-end">
                    <p>{hasDiaryContent}</p>
                    <p>{todayMood}</p>
                    <p>{inProgressCount}</p>
                    <p>{pendingCount}</p>
                </div>
            </div>
            {/* chart */}
            <div className={`row ${styles.basicStateChart}`}>
                <div className={`col-9 ${styles.defaultOverFlow} ${styles.chartContent}`}>
                    {selectedChart === 'quadrant' && <QuadrantChart eventCounts={eventCounts} />}
                    {selectedChart === 'diaryCharCount' && <DiaryCharCountLineChart data={diaryCharCount} />}
                </div>
                <div className={`col-3 ${styles.chartControlButtons} text-end`}>
                    <button onClick={() => { setSelectedChart('quadrant'); }}>QuadrantChart</button>
                    <button onClick={() => { setSelectedChart('diaryCharCount'); }}>DiaryCharCount</button>
                </div>
            </div>
        </div>
    );
};

export default BasicState;
