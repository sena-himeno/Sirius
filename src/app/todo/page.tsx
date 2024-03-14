'use client'
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import TodoList from './components/TodoListComponent';
import TodoListShort from './components/TodoListComponentsShort';
import { Button} from 'react-bootstrap';
import styles from '@/style/todoList.module.css'

const TodoListPage = () => {
    const [showTodoList, setShowTodoList] = useState(true);

    const handleToggleTodoList = () => {
        setShowTodoList(true);
    };

    const handleToggleTodoListShort = () => {
        setShowTodoList(false);
    };

    return (
        <div className={`container-xxl ${styles.todoListContainer}`}>
            <div className="col-12  ">
                <div className="col-3">
                <Button className={`border-0 ${styles.todoListControlButton}`} onClick={handleToggleTodoList} variant={showTodoList ? "primary" : "outline-primary"}>
                    TODO LIST(Long)
                </Button>
                <Button className={`border-0 ${styles.todoListControlButton}`} onClick={handleToggleTodoListShort} variant={!showTodoList ? "primary" : "outline-primary"}>
                    TODO LIST(Short)
                </Button>
                </div>
            </div>
            <div className={styles.todoListContext}>
            {showTodoList ? <TodoList /> : <TodoListShort />}
            </div>
        </div >
    );
};

export default TodoListPage;

