import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { type TodoEvent } from '../../interface/todoList';
import { addTodoEvent } from '@/app/utils/todoList';

interface AddTodoEventFormProps {
    onUpdate: () => void
}

const AddTodoEventForm: React.FC<AddTodoEventFormProps> = ({ onUpdate }: AddTodoEventFormProps) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [title, setTitle] = useState('');
    const [endTime, setEndTime] = useState('');
    const [importance, setImportance] = useState('');
    const [submitting, setSubmitting] = useState(false); // State to manage form submission

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        if (submitting) return;

        const newTodoEvent: TodoEvent = {
            title,
            status: 'pending',
            endTime,
            addTime: new Date().toLocaleDateString(),
            startTime: ''
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
                            <InputLabel>Importance</InputLabel>
                            <Select
                                value={importance}
                                onChange={(e: any) => { setImportance(e.target.value as string); }}
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
