'use client'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import TodoList from './components/TodoListComponent';
import  AddTodoEventForm from './components/AddTodoEventForm';
export  default function Page(){
    return (
        <div className="container-fluid ">
            <h1>this is todo page</h1>
            <AddTodoEventForm />
            <TodoList />
        </div>
    )
}