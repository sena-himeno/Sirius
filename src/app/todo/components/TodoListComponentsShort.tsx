'use client'
import React, {useEffect, useState} from 'react';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import {TodoListComponent} from './TodoListTableComponentShort';
import {TodoEvent} from '../../interface/todoList';
import {TimelineComponent,TodoDetailDialog} from './TodoListComponentShortUI'

const baseTodoLists: TodoEvent[] = [
    {
        title: "t1",
        status: 'pending',
        startTime: '',
        endTime: '',
        addTime: ''
    }, {
        title: "t2",
        status: 'pending',
        startTime: '',
        endTime: '',
        addTime: ''
    }, {
        title: "t3",
        status: 'pending',
        startTime: '',
        endTime: '',
        addTime: ''
    }, {
        title: "t4",
        status: 'pending',
        startTime: '',
        endTime: '',
        addTime: ''
    }, {
        title: "t5",
        status: 'pending',
        startTime: '',
        endTime: '',
        addTime: ''
    }
]
const inProgress: TodoEvent[] = [
    {
        title: "t1",
        status: 'in-progress',
        startTime: '',
        endTime: '',
        addTime: ''
    }
]

const TodoListShort: React.FC = () => {
    const [baseTodoList, setBaseTodoList] = useState<TodoEvent[]>(baseTodoLists);
    const [inProgressItems, setInProgressItems] = useState<TodoEvent[]>(inProgress);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedTodo, setSelectedTodo] = useState<TodoEvent | null>(null);
    const [sortedInProgressItems, setSortedInProgressItems] = useState<TodoEvent[]>([]);


    useEffect(() => {
        sortInProgressItems();
    }, [inProgressItems]);

    const sortInProgressItems = () => {
        const sortedItems = [...inProgressItems].sort((a, b) => a.addTime.localeCompare(b.addTime));
        setSortedInProgressItems(sortedItems);
    };


    useEffect(() => {

    }, []);

    useEffect(() => {

    }, [setInProgressItems]);
    const findTodoByTitleAndAddTime = (items: TodoEvent[], title: string, addTime: string) => {
        return items.find(item => (item.title + item.addTime) === (title + addTime));
    };

    const handleUpdateItems = (index: number, action: string, addTime: string, title: string) => {
        if (action === "CANCEL") {
            console.log("CANCEL")
            setBaseTodoList(prevItems => {
                const baseTodoListCopy = [...prevItems];
                const itemToRemoveIndex = baseTodoList.findIndex(item => (item.title + item.addTime) === (title + addTime));
                console.log(itemToRemoveIndex)
                if (itemToRemoveIndex) {
                    baseTodoListCopy.splice(itemToRemoveIndex, 1);
                } else {
                    console.log('Item not found:', title, addTime);
                }
                return baseTodoListCopy;
            });
        }
        if (action === "REMAKE" || action === "DONE" || action === "ADD") {
            setInProgressItems(prevItems => {
                let inProgressItemsCopy = [...prevItems];
                let updatedItem;
                if (action === 'ADD') {
                    updatedItem = findTodoByTitleAndAddTime(baseTodoList, title, addTime);
                } else {
                    updatedItem = findTodoByTitleAndAddTime(inProgressItemsCopy, title, addTime);
                }
                if (updatedItem) {
                    if (action === 'REMAKE') {
                        const itemToRemoveIndex = inProgressItemsCopy.findIndex(item => (item.title + item.addTime) === (title + addTime));
                        if (itemToRemoveIndex !== -1) {
                            inProgressItemsCopy.splice(itemToRemoveIndex, 1);
                        } else {
                            console.log('Item not found:', title, addTime);
                        }
                    } else if (action === 'ADD') {
                        setDialogOpen(true);
                        setSelectedTodo(updatedItem);
                    }
                } else {
                    console.log('Item not found:', title, addTime);
                }
                return inProgressItemsCopy;
            });
        }
    };

    const chooseUpdateItems = (addTime: string) => {
        setInProgressItems(prevItems => {
            const newTodoList = [...prevItems];
            if (selectedTodo) {
                const newTodo: TodoEvent = { ...selectedTodo, addTime: addTime };
                newTodoList.push(newTodo);
            } else {
                console.error('selectedTodo is undefined or null');
            }
            return newTodoList;
        });
    };

    const handleConfirm = (addTime: string) => {
        chooseUpdateItems(addTime);
        setDialogOpen(false);
    };


    return (
        <div>
            <div className="row">
                <DndProvider backend={HTML5Backend}>
                    <div className="col-md-5 col-lg-5">
                        <TodoListComponent
                            key={JSON.stringify(baseTodoList)}
                            title="添加列表"
                            buttonText="ADD"
                            statusFilter="pending"
                            items={baseTodoList}
                            renderContent={(value: TodoEvent) => <>{value.title}</>}
                            onUpdateItems={handleUpdateItems}
                        />
                    </div>
                    <div className="col-md-2 col-lg-2">
                        <TimelineComponent items={sortedInProgressItems} />
                    </div>
                    <div className="col-md-5 col-lg-5">
                        <TodoListComponent
                            key={JSON.stringify(sortedInProgressItems)}
                            title="日程列表"
                            buttonText="REMAKE"
                            statusFilter="in-progress"
                            items={sortedInProgressItems}
                            renderContent={(value: TodoEvent) => <>{value.title}</>}
                            onUpdateItems={handleUpdateItems}
                        />
                    </div>
                </DndProvider>
            </div>
            {selectedTodo && (
                <TodoDetailDialog
                    open={dialogOpen}
                    onClose={() => setDialogOpen(false)}
                    onConfirm={handleConfirm}
                    todo={selectedTodo}
                />
            )}
        </div>
    );
};

export default TodoListShort;

