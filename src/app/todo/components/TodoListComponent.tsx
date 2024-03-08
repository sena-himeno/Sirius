'use client'
import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../../../style/todoList.module.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import {  TodoListComponent} from './TodoListTableComponent';
import {TodoEvent} from '../../interface/todoList';
import {startEvent,doneEvent,remakeEvent,getDate,getAllTodoList} from "@/app/utils/todoList";

const TodoList: React.FC = () => {
    const [updatedItems, setUpdatedItems] = useState<TodoEvent[]>([]);
    const [pendingItems, setPendingItems] = useState<TodoEvent[]>([]);
    const [inProgressItems, setInProgressItems] = useState<TodoEvent[]>([]);
    const [doneItems, setDoneItems] = useState<TodoEvent[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAllTodoList();

                setUpdatedItems(data);

            } catch (error) {
                console.error('Error fetching todo list:', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        console.log('Updated Items:', updatedItems);

        const pending = updatedItems.filter(item => item.status === 'pending');
        console.log('Pending Items:', pending);

        setPendingItems(pending);

        const inProgress = updatedItems.filter(item => item.status === 'in-progress');
        console.log('In Progress Items:', inProgress);
        setInProgressItems(inProgress);

        const done = updatedItems.filter(item => item.status === 'done');
        console.log('Done Items:', done);
        setDoneItems(done);
    }, [updatedItems]);


    const handleUpdateItems = (index: number, action: string, addTime: string, title: string) => {
        setUpdatedItems(prevItems => {
            const updatedItemsCopy = [...prevItems];
            console.log(title);
            const filteredItems = updatedItemsCopy.filter(item => (item.title + item.addTime) === (title + addTime));
            if (filteredItems.length > 0) {
                const updatedItem = { ...filteredItems[0] };
                if (action === 'CANCEL') {
                    const remainingItems = updatedItemsCopy.filter(item => (item.title + item.addTime) !== (title + addTime));
                    console.log(remainingItems);
                    return remainingItems;
                } else if (action === 'REMAKE') {
                    remakeEvent(updatedItem);
                } else if (action === 'START') {
                    startEvent(updatedItem);
                } else if (action === 'DONE') {
                    doneEvent(updatedItem);
                }
                return updatedItemsCopy.map(item => (item.title + item.addTime) === (title + addTime) ? updatedItem : item);
            } else {
                console.log('Item not found:', title, addTime);
                return prevItems;
            }
        });
    };

    return (
        <div>
            <div className="row">
                <DndProvider backend={HTML5Backend}>
                    <div className="col-md-6 col-lg-4">
                        <TodoListComponent
                            key={JSON.stringify(pendingItems)}
                            title="待进行"
                            buttonText="CANCEL"
                            statusFilter="pending"
                            items={pendingItems}
                            renderContent={(value: TodoEvent) => <>{value.title}</>}
                            onUpdateItems={handleUpdateItems}
                        />
                    </div>
                    <div className="col-md-6 col-lg-4">
                        <TodoListComponent
                            key={JSON.stringify(inProgressItems)}
                            title="进行中"
                            buttonText="REMAKE"
                            statusFilter="in-progress"
                            items={inProgressItems}
                            renderContent={(value: TodoEvent) => <>{value.title}</>}
                            onUpdateItems={handleUpdateItems}
                        />
                    </div>
                    <div className="col-md-6 col-lg-4">
                        <TodoListComponent
                            key={JSON.stringify(inProgressItems)}
                            title="已完成"
                            buttonText="DONE"
                            statusFilter="done"
                            items={doneItems}
                            renderContent={(value: TodoEvent) => (
                                <>
                                    <span className={`col-md-12 ${styles.listContextDone}`}>{value.title}</span>
                                </>
                            )}
                            onUpdateItems={handleUpdateItems}
                        />
                    </div>
                </DndProvider>
            </div>
        </div>
    );
};

export default TodoList;
