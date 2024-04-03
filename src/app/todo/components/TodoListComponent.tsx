import React, { useEffect, useMemo, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../../../style/todoList.module.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { TodoListComponent } from './TodoListTableComponent';
import { type TodoEvent } from '../../interface/todoList';
import { doneEvent, getAllTodoList, remakeEvent, startEvent } from '@/app/utils/todoList';
import AddTodoEventForm from './AddTodoEventForm';
import { SaveButton } from '@/app/todo/components/SaveButton';

const TodoList = (): React.JSX.Element => {
    const [updatedItems, setUpdatedItems] = useState<TodoEvent[]>([]);
    const [isSaved, setIsSaved] = useState<boolean>(true);

    const fetchData = async (): Promise<void> => {
        try {
            const data = await getAllTodoList(true);
            setUpdatedItems(data);
        } catch (error) {
            console.error('Error fetching todo list:', error);
        }
    };

    useEffect(() => {
        void fetchData().then(r => {
        });
    }, []);

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
        const doneItems = updatedItems.filter(item => item.status === 'done').reverse(); // 存的是旧的在上 所以先反转再用

        return { pendingItems, inProgressItems, doneItems };
    }, [updatedItems]);

    return (
            <div className={`${styles.todoContainer} row shadow-lg p-3 mb-5`}>
                <DndProvider backend={HTML5Backend}>
                    <div className={'col-md-6 col-lg-4  '}>
                        <TodoListComponent
                            key={JSON.stringify(memoizedValues.pendingItems)}
                            title="PENDING"
                            buttonText="CANCEL"
                            statusFilter="pending"
                            items={memoizedValues.pendingItems}
                            renderContent={(value: TodoEvent) => <>{value.title}</>}
                            onUpdateItems={handleUpdateItems}
                        />
                        <div className={`col-12 border-top ${styles.todoListTableButton}`}>
                            <AddTodoEventForm onUpdate={fetchData}/>
                        </div>
                        <div className={`col-12 ${styles.todoListTableButton}`}>
                            {!isSaved && <SaveButton updatedItems={updatedItems} setIsSaved={setIsSaved}/>}
                        </div>
                    </div>
                    <div className={'col-md-6 col-lg-4   '}>
                        <TodoListComponent
                            key={JSON.stringify(memoizedValues.inProgressItems)}
                            title="IN_PROGRESS"
                            buttonText="REMAKE"
                            statusFilter="in-progress"
                            items={memoizedValues.inProgressItems}
                            renderContent={(value: TodoEvent) => <>{value.title}</>}
                            onUpdateItems={handleUpdateItems}
                        />
                    </div>
                    <div className={'col-md-6 col-lg-4 '}>
                        <TodoListComponent
                            key={JSON.stringify(memoizedValues.doneItems)}
                            title="DONE_ITEM"
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
    );
};

export default TodoList;
