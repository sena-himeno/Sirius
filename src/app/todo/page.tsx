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
        <div className={`container-fluid  ${styles.todoListContainer}`}>
            <div className={`col-12 `}>
                <div className={`col-3 ${styles.buttonBlock}`}>
                <button className={` ${styles.todoListControlButton}  ${showTodoList ? styles.buttonChoose : styles.todoListTableButton}`}  onClick={handleToggleTodoList} >
                    TODO LIST(Long)
                </button>
                <button className={` ${styles.todoListControlButton} ${!showTodoList ? styles.buttonChoose : styles.todoListTableButton}`} onClick={handleToggleTodoListShort}>
                    TODO LIST(Short)
                </button>
                </div>
            </div>
            <div className={styles.todoListContext}>
            {showTodoList ? <TodoList /> : <TodoListShort />}
            </div>
        </div >
    );
};

export default TodoListPage;

