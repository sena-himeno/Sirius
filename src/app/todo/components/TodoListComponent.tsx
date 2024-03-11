import React, { useEffect, useMemo, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../../../style/todoList.module.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { TodoListComponent } from './TodoListTableComponent';
import { TodoEvent } from '../../interface/todoList';
import { Button } from '@mui/material';
import { doneEvent, getAllTodoList, postTodoEventList, remakeEvent, startEvent } from "@/app/utils/todoList";
import {SaveButtonProps} from "@/app/interface/todoList";

interface TodoListProps {
    isUpdated: boolean;
}

const TodoList: React.FC<TodoListProps> = ({ isUpdated }: TodoListProps) => {
    const [updatedItems, setUpdatedItems] = useState<TodoEvent[]>([]);
    const [isSaved, setIsSaved] = useState<boolean>(true);

    const fetchData = async () => {
        try {
            const data = await getAllTodoList();
            setUpdatedItems(data);
        } catch (error) {
            console.error('Error fetching todo list:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [isUpdated]);

    const handleUpdateItems = async (index: number, action: string, addTime: string, title: string) => {
        setUpdatedItems(prevItems => {
            const updatedItemsCopy = [...prevItems];
            const filteredItems = updatedItemsCopy.filter(item => (item.title + item.addTime) === (title + addTime));
            if (filteredItems.length > 0) {
                const updatedItem = { ...filteredItems[0] };
                if (action === 'CANCEL') {
                    return updatedItemsCopy.filter(item => (item.title + item.addTime) !== (title + addTime));
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

        setIsSaved(false);
    };

    const memoizedValues = useMemo(() => {
        const pendingItems = updatedItems.filter(item => item.status === 'pending');
        const inProgressItems = updatedItems.filter(item => item.status === 'in-progress');
        const doneItems = updatedItems.filter(item => item.status === 'done').reverse() ;  //存的是旧的在上 所以先反转再用

        return { pendingItems, inProgressItems, doneItems };
    }, [updatedItems]);

    return (
        <div>
            <div className="row">
                <DndProvider backend={HTML5Backend}>
                    <div className="col-md-6 col-lg-4">
                        <TodoListComponent
                            key={JSON.stringify(memoizedValues.pendingItems)}
                            title="待进行"
                            buttonText="CANCEL"
                            statusFilter="pending"
                            items={memoizedValues.pendingItems}
                            renderContent={(value: TodoEvent) => <>{value.title}</>}
                            onUpdateItems={handleUpdateItems}
                        />
                    </div>
                    <div className="col-md-6 col-lg-4">
                        <TodoListComponent
                            key={JSON.stringify(memoizedValues.inProgressItems)}
                            title="进行中"
                            buttonText="REMAKE"
                            statusFilter="in-progress"
                            items={memoizedValues.inProgressItems}
                            renderContent={(value: TodoEvent) => <>{value.title}</>}
                            onUpdateItems={handleUpdateItems}
                        />
                    </div>
                    <div className="col-md-6 col-lg-4">
                        <TodoListComponent
                            key={JSON.stringify(memoizedValues.doneItems)}
                            title="已完成"
                            buttonText="DONE"
                            statusFilter="done"
                            items={memoizedValues.doneItems.slice(0, 20)}
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
            <div>
                <div>
                    {!isSaved && <SaveButton updatedItems={updatedItems} setIsSaved={setIsSaved} />}
                </div>
            </div>
        </div>
    );
};

export const SaveButton: React.FC<SaveButtonProps> = ({ updatedItems, setIsSaved }: SaveButtonProps) => {
    const updateTodoListToJson = async () => {
        try {
            await postTodoEventList('pendingEvent', updatedItems.filter(item => item.status === 'pending'));
            await postTodoEventList('in-progress', updatedItems.filter(item => item.status === 'in-progress'));
            await postTodoEventList('doneEvent', updatedItems.filter(item => item.status === 'done'));
            console.log('Updated items saved successfully.');
            setIsSaved(true);
        } catch (error) {
            console.error('Error saving updated items:', error);
        }
    }

    return (
        <Button onClick={updateTodoListToJson}>Save Updated</Button>
    );
};


export default TodoList;
