import React from "react";

export interface TodoDetailDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (addTime: string) => void;
    todo: TodoEvent;
}

export type TodoItemProps = {
    index: number;
    item: TodoEvent;
    moveItem: (dragIndex: number, hoverIndex: number) => void;
    renderContent: (value: TodoEvent) => React.ReactNode;
    statusFilter: string;
    buttonText: string;
    onButtonClick: (index: number, action: string, addTime: string, title: string) => void;
};


export type TodoEvent = {
    title: string;
    status: string;
    startTime?: string;
    endTime?: string;
    addTime: string;
}

export type TodoListComponentProps = {
    title: string;
    buttonText: string;
    statusFilter: string;
    items: TodoEvent[];
    renderContent: (value: TodoEvent) => JSX.Element;
    onUpdateItems: (index: number, action: string, addTime: string, title: string) => void;
}
export interface SaveButtonProps {
    updatedItems: TodoEvent[];
    setIsSaved: React.Dispatch<React.SetStateAction<boolean>>;
}
