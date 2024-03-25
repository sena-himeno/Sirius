import React, { useState } from 'react';
import {TodoEvent,TodoDetailDialogProps} from "@/app/interface/todoList";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import {Timeline,TimelineConnector, TimelineContent,TimelineDot,TimelineItem,TimelineOppositeContent,TimelineSeparator} from "@mui/lab";

export const TodoDetailDialog: React.FC<TodoDetailDialogProps> = ({ open, onClose, onConfirm, todo }) => {
    const [selectedTime, setSelectedTime] = React.useState<string>("");

    const handleClose = () => {
        onClose();
    };

    const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedTime(event.target.value);
    };

    const handleConfirm = () => {
        onConfirm(selectedTime);
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{todo.title}</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="addTime"
                    label="time"
                    type="time"
                    fullWidth
                    value={selectedTime}
                    onChange={handleTimeChange}
                    inputProps={{
                        step: 60,
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    cancel
                </Button>
                <Button onClick={handleConfirm} color="primary">
                    add
                </Button>
            </DialogActions>


        </Dialog>
    );
};

export const TimelineComponent: React.FC<{ items: TodoEvent[] }> = ({ items }) => {
    return (
        <Timeline position="alternate">
            {items.map((todo, index) => (
                <TimelineItem key={index} sx={{ minHeight: '50px' }}>
                    <TimelineOppositeContent color="text.secondary">
                        {todo.addTime}
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                        <TimelineDot />
                        <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>{todo.title}</TimelineContent>
                </TimelineItem>
            ))}
        </Timeline>
    );
};

interface AddTodoDialogProps {
    open: boolean;
    onClose: () => void;
    onAddTodo: (title: string) => void;
}

export const AddTodoDialog: React.FC<AddTodoDialogProps> = ({ open, onClose, onAddTodo }) => {
    const [title, setTitle] = useState('');

    const handleConfirm = () => {
        onAddTodo(title);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>add basic todo info</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    fullWidth
                    variant="standard"
                    placeholder="Enter title"
                    value={title}
                    onChange={(e) =>    setTitle(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">cancel</Button>
                <Button onClick={handleConfirm} color="primary">add</Button>
            </DialogActions>
        </Dialog>
    );
};
