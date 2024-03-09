'use client'
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import TodoList from './components/TodoListComponent';
import  AddTodoEventForm from './components/AddTodoEventForm';


const ParentComponent = () => {
    const [isFormUpdated, setIsFormUpdated] = useState(false);

    const handleFormUpdate = () => {
        setIsFormUpdated(prevState => !prevState);
    };

    return (
        <div>
            <AddTodoEventForm onUpdate={handleFormUpdate} />
            <TodoList isUpdated={isFormUpdated} />
        </div>
    );
};

export default ParentComponent;