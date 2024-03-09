import React from "react";

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
