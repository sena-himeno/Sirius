import {TodoEvent} from "@/app/interface/todoList";

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
        let fileName = 'pendingEvent';
        const response = await fetch('/api/todoList/postTodoEvent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fileName, todoEvent })
        });

        return await response.json();
    } catch (error) {
        console.error('Error adding todo list:', error);
        throw error;
    }
};
