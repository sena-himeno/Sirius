import React from "react";
import {SaveButtonProps,SaveButtonShortProps} from "@/app/interface/todoList";
import {postTodoEventList,postShortTodoList} from "@/app/utils/todoList";
import {Button} from "@mui/material";
import {getDate} from "@/app/utils/common";

export const SaveButton: React.FC<SaveButtonProps> = ({updatedItems, setIsSaved}: SaveButtonProps) => {
    const updateTodoListToJson = async () => {
        try {
            await postTodoEventList('pendingEvent', updatedItems.filter(item => item.status === 'pending'));
            await postTodoEventList('in-progress', updatedItems.filter(item => item.status === 'in-progress'));
            await postTodoEventList('doneEvent', updatedItems.filter(item => item.status === 'done'));
            console.log('Updated items saved successfully.');
            setIsSaved(true);
        } catch (error) {
            console.error('Error saving updated items:', error);
        }
    }

    return (
        <Button onClick={updateTodoListToJson}>Save Updated</Button>
    );
};

export const SaveButtonShort: React.FC<SaveButtonShortProps> = ({basicTodoList,TodoList ,setIsSaved}: SaveButtonShortProps) => {
    const date = getDate();
    const updateTodoListToJson = async () => {
        try {
             await postShortTodoList(basicTodoList,true,date);
             await postShortTodoList(TodoList,false,date);

        } catch (error) {
            console.error('Error saving updated items:', error);
        }
        setIsSaved(false);
    }

    return (
        <Button onClick={updateTodoListToJson}>Save Updated</Button>
    );

};
