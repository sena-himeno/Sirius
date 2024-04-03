'use server'
import TimeTracker from '@/app/components/TimeTracker';
import InProgress from '@/app/components/InProgress';
import BasicState from '@/app/components/BasicState';
import React from 'react';
import { getAllTodoList } from '@/app/utils/todoList';
import type { TodoEvent } from '@/app/interface/todoList';
import { getTodoDayDiary } from '@/app/utils/fileContolUseServer';
import { getDate } from '@/app/utils/common';

export default async function Home (): Promise<React.JSX.Element> {
    let todoItem: TodoEvent[] = [];
    let diaryContent: string | null = null;
    const date = getDate()
    const fetchTodo = async (): Promise<void> => {
        todoItem = await getAllTodoList(false)
        diaryContent = await getTodoDayDiary(date);
    }
    await fetchTodo().then(r => {
    })
  return (
      <div>
        Planner【-】
            <TimeTracker />
            <InProgress todoItem={todoItem.filter(item => item.status === 'in-progress')}/>
            <BasicState todoItem={todoItem} diaryContent={diaryContent}/>
      </div>
  );
}
