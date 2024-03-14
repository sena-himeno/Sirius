import {TodoEvent} from "@/app/interface/todoList";
import {MoodDateType} from "@/app/interface/diary";
import axios from "axios";

export const startEvent = (todoEvent:TodoEvent) => {
    todoEvent.status = 'in-progress';
    todoEvent.startTime = getDate();
    return todoEvent;

}
export const doneEvent = (todoEvent:TodoEvent) => {
    todoEvent.status = 'done';
    todoEvent.endTime = getDate();
    return todoEvent;
}
export const remakeEvent = (todoEvent:TodoEvent) => {
    todoEvent.status = 'pending';
    todoEvent.startTime = "";
}
export const getDate = ( ) => {
    const currentDate = new Date();
    return currentDate.toLocaleDateString('en-CA');
}
export const getTodoList = async (fileName:string) => {
    try {
        const response = await fetch('/api/todoList/getTodoList', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fileName: fileName })
        });

        return await response.json();
    } catch (error) {
        console.error('get todo list error: ', error);
        throw error;
    }
};

export const getAllTodoList = async () => {
    try {
        const todoLists = [];
        const fileNames = ['doneEvent', 'in-progress', 'pendingEvent'];

        for (const fileName of fileNames) {
            console.log("fileName:" + fileName);
            const todoList = await getTodoList(fileName);
            todoLists.push(...todoList);
        }
        return todoLists;
    } catch (error) {
        console.error('get all todo lists error: ', error);
        throw error;
    }
};

export const addTodoEvent = async ( todoEvent: TodoEvent) => {
    try {
        const isUpdateList = false;
        let fileName = 'pendingEvent';
        const response = await fetch('/api/todoList/postTodoEvent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fileName, todoEvent ,isUpdateList})
        });

        return await response.json();
    } catch (error) {
        console.error('Error adding todo list:', error);
        throw error;
    }
};

export const postTodoEventList = async (fileName:string,todoEvent: TodoEvent[]) => {
    try {
        const isUpdateList = true;
        const response = await fetch('/api/todoList/postTodoEvent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fileName, todoEvent , isUpdateList})
        });

        return await response.json();
    } catch (error) {
        console.error('Error adding todo list:', error);
        throw error;
    }
};

export const getBasicTodoList = async() =>{
    const fileName = 'basicTodolist';
    const date = null;
    try {
            const response = await fetch('/api/todoList/getTodoListShort', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({ fileName,date})
            
        });
        return await response.json();
        
    } catch (error) {
        console.error('Error load basic todo list:', error);
        throw error;
    }
}

export const getShortTodoList = async(date:string) =>{
    let preFileName =date.substring(0,date.lastIndexOf("-"));
    const fileName = preFileName+'-shortTodoList';
    try {
        const response = await fetch('/api/todoList/getTodoListShort', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({ fileName,date})

        });
        return await response.json();

    } catch (error) {
        console.error('Error load basic todo list:', error);
        throw error;
    }

}
export const postShortTodoList = async (todoList:TodoEvent | TodoEvent[],isBasic:boolean,date:string) =>{
    let fileName
    if(!isBasic){
        let preFileName =date.substring(0,date.lastIndexOf("-"));
        fileName = preFileName+'-shortTodoList';
    }else{
        fileName = 'basicTodolist';
    }
    try {
        const response = await fetch('/api/todoList/postTodoListShort', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fileName,todoList,date,isBasic})
        });
        return await response.json();

    } catch (error) {
        console.error('Error post basic todo list:', error);
        throw error;
    }

}