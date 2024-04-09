'use server'
import React from 'react';
import { type TodoEvent } from '@/app/interface/todoList';
import styles from '@/style/home.module.css';
import QuadrantChart from './QuadrantChart';

const countEventsByType = (todoItem: TodoEvent[], eventType: string, status: string): number => {
    return todoItem.filter(item => item.eventType === eventType && item.status !== status).length;
};

const BasicState: React.FC<{ todoItem: TodoEvent[], diaryContent: string | null }> = async ({ todoItem, diaryContent }) => {
    const hasDiaryContent = diaryContent === null ? 'false' : diaryContent.length + ' char';
    const inProgressCount = todoItem.filter(item => item.status === 'in-progress').length;
    const pendingCount = todoItem.filter(item => item.status === 'pending').length;
    const eventTypes = ['urgentImportant', 'urgentNotImportant', 'notUrgentImportant', 'notUrgentNotImportant'];
    const eventCounts = eventTypes.map(eventType => countEventsByType(todoItem, eventType, 'done'));

    return (
        <div className={`row ${styles.basicStateContent}`}>
            <h4 className={'text-center'}>Basic State</h4>
            <div className="col-8">
                <p>diary:</p>
                <p>in progress count:</p>
                <p>pending count:</p>
                {eventTypes.map((eventType, index) => (
                    <p key={index}>{eventType} count:</p>
                ))}
            </div>
            <div className="col-4 text-end">
                <p>{hasDiaryContent}</p>
                <p>{inProgressCount}</p>
                <p>{pendingCount}</p>
                {eventCounts.map((count, index) => (
                    <p key={index}>{count}</p>
                ))}
                {/* 在此处调用QuadrantChart组件并传递相应的数据 */}
            </div>
            <div className={`col-12 ${styles.quadrantChart}`}>
                <QuadrantChart eventCounts={eventCounts} />
            </div>
        </div>
    );
};

export default BasicState;
