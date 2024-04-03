import { type TodoEvent } from '@/app/interface/todoList'
import React from 'react';

const InProgress: React.FC<{ todoItem: TodoEvent[] }> = ({ todoItem }) => {
  return (
            <div className={'col-md-6 col-lg-4   '}>
                <h3>in progress count{todoItem.length}</h3>
                {todoItem.map((event, index) => (
                    <div key={index}>{event.title}</div>
                ))}
            </div>
  )
}

export default InProgress
