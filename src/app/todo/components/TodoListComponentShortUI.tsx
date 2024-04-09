import React, { useState } from 'react'
import { type TodoDetailDialogProps, type AddTodoDialogProps } from '@/app/interface/todoList'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'

export const TodoDetailDialog: React.FC<TodoDetailDialogProps> = ({ open, onClose, onConfirm, todo }) => {
  const [selectedTime, setSelectedTime] = React.useState<string>('')

  const handleClose = (): void => {
    onClose()
  }

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSelectedTime(event.target.value)
  }

  const handleConfirm = (): void => {
    onConfirm(selectedTime)
    onClose()
  }

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
                      step: 60
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
  )
}



export const AddTodoDialog: React.FC<AddTodoDialogProps> = ({ open, onClose, onAddTodo }) => {
  const [title, setTitle] = useState('')

  const handleConfirm = (): void => {
    onAddTodo(title)
    onClose()
  }

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
                    onChange={(e) => { setTitle(e.target.value) }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">cancel</Button>
                <Button onClick={handleConfirm} color="primary">add</Button>
            </DialogActions>
        </Dialog>
  )
}
