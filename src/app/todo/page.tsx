'use client'
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import TodoList from './components/TodoListComponent';
import TodoListShort from './components/TodoListComponentsShort';
import  AddTodoEventForm from './components/AddTodoEventForm';


const ParentComponent = () => {
    const [isFormUpdated, setIsFormUpdated] = useState(false);

    const handleFormUpdate = () => {
        setIsFormUpdated(prevState => !prevState);
    };

    return (
        <div>
            {/*<AddTodoEventForm onUpdate={handleFormUpdate} />*/}
            {/*<TodoList isUpdated={isFormUpdated} />*/}
            <TodoListShort />
        </div>

    );
};

export default ParentComponent;