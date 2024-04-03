'use server'
import React from 'react'
import { type TodoEvent } from '@/app/interface/todoList';

const BasicState: React.FC<{ todoItem: TodoEvent[], diaryContent: string | null }> = async ({ todoItem, diaryContent }) => {
    const hasDiaryContent: string = diaryContent === null ? 'false' : 'Done';
    const inProgressCount = todoItem.filter(item => item.status === 'in-progress').length;
    const pendingCount = todoItem.filter(item => item.status === 'pending').length;
    return (
        <div>
            <p>diary:{hasDiaryContent}</p>
            <p>in progress count:{inProgressCount}</p>
            <p>pending count:{pendingCount}</p>
        </div>
    )
}

export default BasicState
