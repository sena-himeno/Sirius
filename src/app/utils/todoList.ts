import { type TodoEvent } from '@/app/interface/todoList';
import { getTodoListAtServer } from '@/app/utils/fileContolUseServer';

// todo control
export const startEvent = (todoEvent: TodoEvent): TodoEvent => {
    todoEvent.status = 'in-progress';
    todoEvent.startTime = getDate();
    return todoEvent;
}
export const doneEvent = (todoEvent: TodoEvent): TodoEvent => {
    todoEvent.status = 'done';
    todoEvent.endTime = getDate();
    return todoEvent;
}
export const remakeEvent = (todoEvent: TodoEvent): void => {
    todoEvent.status = 'pending';
    todoEvent.startTime = '';
}
export const getDate = (): string => {
    const currentDate = new Date();
    return currentDate.toLocaleDateString('en-CA');
}
export const getTodoList = async (fileName: string): Promise<TodoEvent[]> => {
    try {
        const response = await fetch('/api/todoList/getTodoList', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fileName })
        });
        return await response.json();
    } catch (error) {
        console.error('get todo list error: ', error);
        throw error;
    }
};

// get todo
export const getTodoListServer = async (fileName: string): Promise<TodoEvent[]> => {
    try {
        return await getTodoListAtServer(fileName)
    } catch (error) {
        console.error('get todo list error: ', error);
        throw error;
    }
}

export const getAllTodoList = async (isClient: boolean): Promise<any[]> => {
    try {
        const todoLists = [];
        const fileNames = ['doneEvent', 'in-progress', 'pendingEvent'];
        for (const fileName of fileNames) {
            let todoList;
            if (isClient) {
                todoList = await getTodoList(fileName);
            } else {
                todoList = await getTodoListServer(fileName)
            }
            todoLists.push(...todoList);
        }
        return todoLists;
    } catch (error) {
        console.error('get all todo lists error: ', error);
        throw error;
    }
};

export const getInProgress = async (): Promise<TodoEvent[]> => {
    try {
        const fileName = 'in-progress';
        return await getTodoList(fileName);
    } catch (error) {
        console.error('get all todo lists error: ', error);
        throw error;
    }
};

export const addTodoEvent = async (todoEvent: TodoEvent): Promise<TodoEvent> => {
    try {
        const isUpdateList = false;
        const fileName = 'pendingEvent';
        const response = await fetch('/api/todoList/postTodoEvent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fileName, todoEvent, isUpdateList })
        });

        return await response.json();
    } catch (error) {
        console.error('Error adding todo list:', error);
        throw error;
    }
};

export const postTodoEventList = async (fileName: string, todoEvent: TodoEvent[]): Promise<TodoEvent> => {
    try {
        const isUpdateList = true;
        const response = await fetch('/api/todoList/postTodoEvent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fileName, todoEvent, isUpdateList })
        });

        return await response.json();
    } catch (error) {
        console.error('Error adding todo list:', error);
        throw error;
    }
};

export const getBasicTodoList = async (): Promise<TodoEvent[]> => {
    const fileName = 'basicTodolist';
    const date = null;
    try {
            const response = await fetch('/api/todoList/getTodoListShort', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({ fileName, date })

        });
        return await response.json();
    } catch (error) {
        console.error('Error load basic todo list:', error);
        throw error;
    }
}

export const getShortTodoList = async (date: string): Promise<TodoEvent[]> => {
    const preFileName = date.substring(0, date.lastIndexOf('-'));
    const fileName = preFileName + '-shortTodoList';
    try {
        const response = await fetch('/api/todoList/getTodoListShort', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({ fileName, date })

        });
        return await response.json();
    } catch (error) {
        console.error('Error load basic todo list:', error);
        throw error;
    }
}
export const postShortTodoList = async (todoList: TodoEvent | TodoEvent[], isBasic: boolean, date: string): Promise<TodoEvent> => {
    let fileName
    if (!isBasic) {
        const preFileName = date.substring(0, date.lastIndexOf('-'));
        fileName = preFileName + '-shortTodoList';
    } else {
        fileName = 'basicTodolist';
    }
    try {
        const response = await fetch('/api/todoList/postTodoListShort', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fileName, todoList, date, isBasic })
        });
        return await response.json();
    } catch (error) {
        console.error('Error post basic todo list:', error);
        throw error;
    }
}
