/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */
import React, { useEffect, useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { TodoListComponent } from './TodoListTableComponentShort'
import { type TodoEvent } from '../../interface/todoList'
import { TodoDetailDialog, AddTodoDialog } from './TodoListComponentShortUI'
import { getBasicTodoList, getShortTodoList } from '@/app/utils/todoList'
import { getDate } from '@/app/utils/common'
import { Button } from '@mui/material'
import styles from '@/style/todoList.module.css'
import { SaveButtonShort } from './SaveButton'
import { TimelineComponent } from '@/app/todo/components/ClientUI';

const TodoListShort: React.FC = () => {
    const [baseTodoList, setBaseTodoList] = useState<TodoEvent[]>([])
    const [inProgressItems, setInProgressItems] = useState<TodoEvent[]>([])
    const [addTodoDialogOpen, setAddTodoDialogOpen] = useState(false)
    const [todoDetailDialogOpen, setTodoDetailDialogOpen] = useState(false)
    const [selectedTodo, setSelectedTodo] = useState<TodoEvent | null>(null)
    const [sortedInProgressItems, setSortedInProgressItems] = useState<TodoEvent[]>([])
    const [isSaved, setIsSaved] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)

    useEffect((): void => {
        void fetchTodoList().then(r => {
        })
    }, [])

    useEffect(() => {
        sortInProgressItems()
    }, [baseTodoList, inProgressItems])

    const fetchTodoList = async (): Promise<void> => {
        const basicTodoList: TodoEvent[] = await getBasicTodoList()
        const fetchInProgressItems: TodoEvent[] = await getShortTodoList(getDate())
        setBaseTodoList(basicTodoList)
        setInProgressItems(fetchInProgressItems)
    }

    const sortInProgressItems = (): void => {
        const sortedItems = [...inProgressItems].sort((a, b) => a.addTime.localeCompare(b.addTime))
        setSortedInProgressItems(sortedItems)
    }

    const findTodoByTitleAndAddTime = (items: TodoEvent[], title: string, addTime: string): TodoEvent | undefined => {
        return items.find(item => (item.title + item.addTime) === (title + addTime));
    }

    const updateInProgressItems = (action: string, addTime: string, title: string): void => {
        setInProgressItems(prevItems => {
            const inProgressItemsCopy = [...prevItems]
            let updatedItem
            if (action === 'ADD') {
                updatedItem = findTodoByTitleAndAddTime(baseTodoList, title, addTime)
            } else {
                updatedItem = findTodoByTitleAndAddTime(inProgressItemsCopy, title, addTime)
            }
            if (updatedItem != null) {
                if (action === 'REMAKE') {
                    const itemToRemoveIndex = inProgressItemsCopy.findIndex(item => (item.title + item.addTime) === (title + addTime))
                    if (itemToRemoveIndex !== -1) {
                        inProgressItemsCopy.splice(itemToRemoveIndex, 1)
                        setIsSaved(true)
                    } else {
                        console.log('Item not found:', title, addTime)
                    }
                } else if (action === 'ADD') {
                    setTodoDetailDialogOpen(true)
                    setSelectedTodo(updatedItem)
                }
            } else {
                console.log('Item not found:', title, addTime)
            }
            return inProgressItemsCopy
        })
    }

    const handleUpdateItems = (index: number, action: string, addTime: string, title: string): void => {
        if (action === 'CANCEL') {
            console.log('CANCEL')
            setBaseTodoList(prevItems => {
                const baseTodoListCopy = [...prevItems]
                const itemToRemoveIndex = baseTodoList.findIndex(item => (item.title + item.addTime) === (title + addTime))
                console.log(itemToRemoveIndex)
                if (itemToRemoveIndex !== -1) {
                    baseTodoListCopy.splice(itemToRemoveIndex, 1)
                    setIsSaved(true)
                } else {
                    console.log('Item not found:', title, addTime)
                }
                return baseTodoListCopy
            })
        } else {
            updateInProgressItems(action, addTime, title)
        }
    }

    const chooseUpdateItems = (addTime: string): void => {
        setInProgressItems(prevItems => {
            const newTodoList = [...prevItems]
            if (selectedTodo != null) {
                const newTodo: TodoEvent = { ...selectedTodo, addTime }
                newTodoList.push(newTodo)
            } else {
                console.error('selectedTodo is undefined or null')
            }
            return newTodoList
        })
    }

    // ui controller

    const handleConfirm = (addTime: string): void => {
        chooseUpdateItems(addTime)
        setTodoDetailDialogOpen(false)
        setIsSaved(true)
    }

    const handleOpenAddTodoDialog = (): void => {
        setAddTodoDialogOpen(true)
    }

    const handleCloseAddTodoDialog = (): void => {
        setAddTodoDialogOpen(false)
    }

    const handleAddTodo = (title: string): void => {
        setBaseTodoList(prevList => [...prevList, { title, status: 'pending', startTime: '', endTime: '', addTime: '', progressRate: -1}])
        setIsSaved(true)
    }

    const handleCloseDialog = (): void => {
        setDialogOpen(false)
    }

    // end

    return (
        <div>
            <div className={`${styles.todoContainer} row shadow-lg p-3 mb-5`}>
                <DndProvider backend={HTML5Backend}>
                    <div className="col-md-5 col-lg-5">
                        <TodoListComponent
                            key={JSON.stringify(baseTodoList)}
                            title="BASIC_LIST"
                            buttonText="ADD"
                            statusFilter="pending"
                            items={baseTodoList}
                            renderContent={(value: TodoEvent) => <>{value.title}</>}
                            onUpdateItems={handleUpdateItems}
                        />
                        <div className={`col-12 border-top ${styles.todoListTableButton}`}>
                            <Button onClick={handleOpenAddTodoDialog}>add basic item</Button>
                            <AddTodoDialog open={addTodoDialogOpen} onClose={handleCloseAddTodoDialog}
                                           onAddTodo={handleAddTodo}/>
                        </div>
                        <AddTodoDialog open={dialogOpen} onClose={handleCloseDialog} onAddTodo={handleAddTodo}/>
                        <div className={`col-12 border-top ${styles.todoListTableButton}`}>
                            {isSaved && <SaveButtonShort basicTodoList={baseTodoList} TodoList={sortedInProgressItems}
                                                         setIsSaved={setIsSaved}/>}
                        </div>
                    </div>
                    <div className="col-md-2 col-lg-2 ">
                        <TimelineComponent items={sortedInProgressItems}/>
                    </div>
                    <div className="col-md-5 col-lg-5">
                        <TodoListComponent
                            key={JSON.stringify(sortedInProgressItems)}
                            title="TODO_LIST"
                            buttonText="REMAKE"
                            statusFilter="in-progress"
                            items={sortedInProgressItems}
                            renderContent={(value: TodoEvent) => <>{value.title}</>}
                            onUpdateItems={handleUpdateItems}
                        />
                    </div>
                </DndProvider>
            </div>
            {(selectedTodo != null) && (
                <TodoDetailDialog
                    open={todoDetailDialogOpen}
                    onClose={() => {
                        setTodoDetailDialogOpen(false)
                    }}
                    onConfirm={handleConfirm}
                    todo={selectedTodo}
                />
            )}
        </div>
    )
}

export default TodoListShort
