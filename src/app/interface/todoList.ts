import type React from 'react'

export interface TodoDetailDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: (addTime: string) => void
  todo: TodoEvent
}

export interface TodoItemProps {
  index: number
  item: TodoEvent
  moveItem: (dragIndex: number, hoverIndex: number) => void
  renderContent: (value: TodoEvent) => React.ReactNode
  statusFilter: string
  buttonText: string
  onButtonClick: (index: number, action: string, addTime: string, title: string) => void
}

export interface TodoEvent {
  title: string
  status: string
  startTime?: string
  endTime?: string
  addTime: string
  eventType?: string
  progressRate: number
  doneTime?: string
}

export interface TodoListComponentProps {
  title: string
  buttonText: string
  statusFilter: string
  items: TodoEvent[]
  renderContent: (value: TodoEvent) => JSX.Element
  onUpdateItems: (index: number, action: string, addTime: string, title: string) => void
}
export interface SaveButtonProps {
  updatedItems: TodoEvent[]
  setIsSaved: React.Dispatch<React.SetStateAction<boolean>>
}
export interface SaveButtonShortProps {
  basicTodoList: TodoEvent[]
  TodoList: TodoEvent[]
  setIsSaved: React.Dispatch<React.SetStateAction<boolean>>
}
export interface AddTodoDialogProps {
  open: boolean
  onClose: () => void
  onAddTodo: (title: string) => void
}

export interface MonthlyStats {
  month: string
  doneTasks: number
  addedTasks: number
}
