import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { type TodoEvent } from '../../interface/todoList';
import { addTodoEvent } from '@/app/utils/todoList';
import {getDate} from "@/app/utils/common";

interface AddTodoEventFormProps {
    onUpdate: () => void
}

const AddTodoEventForm: React.FC<AddTodoEventFormProps> = ({ onUpdate }: AddTodoEventFormProps) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [title, setTitle] = useState('');
    const [endTime, setEndTime] = useState('');
    const [eventType, setEventType] = useState('');
    const [submitting, setSubmitting] = useState(false); // State to manage form submission

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        if (submitting) return;

        const newTodoEvent: TodoEvent = {
            title,
            status: 'pending',
            endTime,
            addTime: getDate(),
            startTime: '',
            eventType,
            progressRate: 0,
            doneTime: ''
        };

        try {
            setSubmitting(true);
            await addTodoEvent(newTodoEvent);
            console.log('Todo Event added successfully:', newTodoEvent);
            onUpdate();
        } catch (error) {
            console.error('Error adding todo event:', error);
        } finally {
            setSubmitting(false);
            handleCloseDialog();
        }
    };

    const handleOpenDialog = (): void => {
        setOpenDialog(true);
    };

    const handleCloseDialog = (): void => {
        setOpenDialog(false);
    };

    return (
        <>
            <Button onClick={handleOpenDialog} disabled={openDialog}>
                Add Todo Event
            </Button>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Add Todo Event</DialogTitle>
                <DialogContent>
                    {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Title"
                            value={title}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setTitle(e.target.value); }}
                            required
                            fullWidth
                        />
                        <TextField
                            label="End Time"
                            type="date"
                            value={endTime}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setEndTime(e.target.value); }}
                            required
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        />
                        <FormControl fullWidth>
                            <InputLabel>eventType</InputLabel>
                            <Select
                                value={eventType}
                                onChange={(e: any) => { setEventType(e.target.value as string); }}
                                required
                            >
                                <MenuItem value="notUrgentNotImportant">NotUrgent NotImportant</MenuItem>
                                <MenuItem value="notUrgentImportant">NotUrgent Important</MenuItem>
                                <MenuItem value="urgentNotImportant">Urgent NotImportant</MenuItem>
                                <MenuItem value="urgentImportant">Urgent Important</MenuItem>
                            </Select>
                        </FormControl>
                        <DialogActions>
                            <Button onClick={handleCloseDialog} color="secondary">
                                Cancel
                            </Button>
                            <Button type="submit" color="primary" disabled={submitting}>
                                Add Todo Event
                            </Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default AddTodoEventForm;
