import {TodoEvent,TodoDetailDialogProps} from "@/app/interface/todoList";
import React from "react";
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
                    label="时间"
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
                    取消
                </Button>
                <Button onClick={handleConfirm} color="primary">
                    确认
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