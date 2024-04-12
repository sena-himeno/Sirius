'use server'
import TimeTracker from '@/app/components/TimeTracker';
import InProgress from '@/app/components/InProgress';
import BasicState from '@/app/components/BasicState';
import React from 'react';
import { getAllTodoList } from '@/app/utils/todoList';
import { type MonthlyStats, type TodoEvent } from '@/app/interface/todoList';
import { getShortTodoListAtServer, getTodoDayDiary, monthlyStatsForYear } from '@/app/utils/fileContolUseServer';
import { getDate } from '@/app/utils/common';
import TimeLine from '@/app/components/TimeLine';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '@/style/home.module.css';
import {TodoLollipop} from '@/app/components/todoListChart';

export default async function Home (): Promise<React.JSX.Element> {
    let todoItem: TodoEvent[] = [];
    let todoShortItem: TodoEvent[] | null = null;
    let diaryContent: string | null = null;
    let todoLineChartDate: MonthlyStats[] = [];
    const date = getDate()
    const fetchTodo = async (): Promise<void> => {
        todoItem = await getAllTodoList(false)
        diaryContent = await getTodoDayDiary(date);
        todoShortItem = await getShortTodoListAtServer(date);
        todoLineChartDate = await monthlyStatsForYear(todoItem, `${new Date().getFullYear()}`);
    }
    await fetchTodo();
    return (
      <div className={`container-fluid ${styles.home} justify-content-center mt-2`}>
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
                  <div className={`row justify-content-center mt-2 ${styles.upperRight}`}>
                      <div className={'col-5 text-center'}>
                          <div className={styles.titleContainer}>
                              <h4 className={'text-center'}>Todo In Progress <i className="bi bi-hourglass-split"></i>
                              </h4>
                          </div>
                          <div className={`${styles.defaultContent}`}>
                            <InProgress todoItem={todoItem.filter(item => item.status === 'in-progress')}/>
                          </div>
                      </div>
                      <div className={'col-5 text-center'}>
                          <div className={styles.titleContainer}>
                              <h4 className={'text-center'}>Time Line</h4>
                          </div>
                          <div className={`${styles.defaultContent}`}>
                              <TimeLine todoShortItem={todoShortItem ?? []}/>
                          </div>
                      </div>
                  </div>
                  <div className={'text-center'}>
                      <TodoLollipop todoLineChartDate={todoLineChartDate} />
                  </div>
              </div>
          </div>
      </div>
  );
}
