'use server'
import TimeTracker from '@/app/components/TimeTracker';
import InProgress from '@/app/components/InProgress';
import BasicState from '@/app/components/BasicState';
import React from 'react';
import { getAllTodoList } from '@/app/utils/todoList';
import type { TodoEvent } from '@/app/interface/todoList';
import { getShortTodoListAtServer, getTodoDayDiary } from '@/app/utils/fileContolUseServer';
import { getDate } from '@/app/utils/common';
import TimeLine from '@/app/components/TimeLine';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '@/style/home.module.css';

export default async function Home (): Promise<React.JSX.Element> {
    let todoItem: TodoEvent[] = [];
    let todoShortItem: TodoEvent[] | null = null;
    let diaryContent: string | null = null;
    const date = getDate()
    const fetchTodo = async (): Promise<void> => {
        todoItem = await getAllTodoList(false)
        diaryContent = await getTodoDayDiary(date);
        todoShortItem = await getShortTodoListAtServer(date);
    }
    await fetchTodo();
  return (
      <div className={`container-fluid ${styles.home}`}>
          <div className={'row'}>
              <div className={`col-5 ${styles.containerLeft}`}>
                  <div className={`${styles.timeTracker}`}>
                    <TimeTracker />
                  </div>
                  <div className={`${styles.basicState}`}>
                    <BasicState todoItem={todoItem} diaryContent={diaryContent}/>
                  </div>
              </div>
              <div className={`col-6 ${styles.containerRight}`}>
                  <div className={'row'}>
                  <div className={'col-5'}>
                    <InProgress todoItem={todoItem.filter(item => item.status === 'in-progress')}/>
                  </div>
                  <div className={'col-5'}>
                      <TimeLine todoShortItem={todoShortItem ?? []}/>
                  </div>
                  </div>
              </div>
          </div>
      </div>
  );
}
