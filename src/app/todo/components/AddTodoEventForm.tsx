'use client'
import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { TodoEvent } from '../../interface/todoList';
import { addTodoEvent } from '@/app/utils/todoList';

const AddTodoEventForm: React.FC = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const [title, setTitle] = useState('');
    const [endTime, setEndTime] = useState('');
    const [importance, setImportance] = useState('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const newTodoEvent: TodoEvent = {
            title: title,
            status: 'pending',
            endTime: endTime,
            addTime: new Date().toLocaleDateString(),
            startTime: ''
        };

        try {
            await addTodoEvent(newTodoEvent);
            console.log('Todo Event added successfully:', newTodoEvent);
        } catch (error) {
            console.error('Error adding todo event:', error);
        }

        handleCloseDialog();
    };

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    return (
        <>
            <Button variant="contained" color="primary" onClick={handleOpenDialog}>
                Add Todo Event
            </Button>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Add Todo Event</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Title"
                            value={title}
                            onChange={(e: any) => setTitle(e.target.value)}
                            required
                            fullWidth
                        />
                        <TextField
                            label="End Time"
                            type="date"
                            value={endTime}
                            onChange={(e: any) => setEndTime(e.target.value)}
                            required
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        />
                        <FormControl fullWidth>
                            <InputLabel>Importance</InputLabel>
                            <Select
                                value={importance}
                                onChange={(e: any) => setImportance(e.target.value as string)}
                                required
                            >
                                <MenuItem value="">Select Importance</MenuItem>
                                <MenuItem value="low">Low</MenuItem>
                                <MenuItem value="medium">Medium</MenuItem>
                                <MenuItem value="high">High</MenuItem>
                                <MenuItem value="urgent">Urgent</MenuItem>
                            </Select>
                        </FormControl>
                        <DialogActions>
                            <Button onClick={handleCloseDialog} color="secondary">
                                Cancel
                            </Button>
                            <Button type="submit" color="primary">
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
