import React, { useLayoutEffect, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../../../style/todoList.module.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Button } from '@mui/material';
import { type TodoEvent, type TodoListComponentProps, type TodoItemProps } from '../../interface/todoList';

export const TodoListComponent: React.FC<TodoListComponentProps> = ({ title, buttonText, statusFilter, items, renderContent, onUpdateItems }) => {
    const [filteredItems, setFilteredItems] = useState<TodoEvent[]>(items);

    const moveItem = (dragIndex: number, hoverIndex: number): TodoEvent[] | null => {
        const dragItem = filteredItems[dragIndex];
        setFilteredItems(prevItems => {
            const updatedItems = [...prevItems];
            updatedItems.splice(dragIndex, 1);
            updatedItems.splice(hoverIndex, 0, dragItem);
            return updatedItems;
        });
        return null;
    };
    useLayoutEffect(() => {
    }, [filteredItems, onUpdateItems]);

    const handleButtonClick = (index: number, action: string, addTime: string, title: string): void => {
        onUpdateItems(index, action, addTime, title);
    };
    return (
        <div className={''}>

            <h4 className={'align-content-center text-center'}>
                <div className={'row'}>
                    <div className={`col-4`}>{buttonText === 'DONE' ? 'startTime' : buttonText}</div>
                    <div className={`col-4`}>
                        {title === 'PENDING'
                            ? (
                                <i className="bi bi-hourglass-top"></i>
                            )
                            : title === 'IN_PROGRESS'
                                ? (
                                    <i className="bi bi-hourglass-split"></i>
                                )
                                : (
                                    <i className="bi bi-hourglass-bottom"></i>
                                )}
                    </div>
                    {statusFilter === 'done'
                        ? <div className={`${''} col-4`}>endTime</div>
                        : <div className={`${''} col-4`}>{buttonText === 'CANCEL' ? 'START' : 'DONE'}</div>}
                </div>
            </h4>
            <div className={styles.tableContent}>
                <table className={styles.listTable}>
                    <thead>
                    </thead>
                    <tbody>
                    {filteredItems.map((item, index) => (
                        <TodoItem
                            key={index}
                            index={index}
                            item={item}
                            moveItem={moveItem}
                            renderContent={renderContent}
                            statusFilter={statusFilter}
                            buttonText={buttonText}
                            onButtonClick={handleButtonClick}
                        />
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export const TodoItem: React.FC<TodoItemProps> = ({ index, item, moveItem, renderContent, statusFilter, buttonText, onButtonClick }) => {
    const handleButtonClicked = (action: string, item: TodoEvent): void => {
        onButtonClick(index, action, item.addTime, item.title);
    };

    const ref = React.useRef<HTMLTableRowElement>(null);

    const [, drop] = useDrop({
        accept: 'todoItem',
        hover: (item: { index: number }, monitor) => {
            if (ref.current == null) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;
            if (dragIndex === hoverIndex) {
                return;
            }
            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            if (clientOffset == null) {
                return;
            }
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }
            moveItem(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver()
        })
    });

    const [{ isDragging }, drag] = useDrag({
        type: 'todoItem',
        item: () => {
            return { index };
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    });

    drag(drop(ref));

    return (
        <tr ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }}>
            <td className={`col-md-3 ${styles.listButton}`}>
                {statusFilter === 'done'
                    ? item.startTime
                    : <Button className={styles.listButton} onClick={() => { handleButtonClicked(buttonText === 'CANCEL' ? 'CANCEL' : 'REMAKE', item); }}>
                        {buttonText === 'CANCEL' ? <i className="bi bi-eraser-fill"></i> : <i className="bi bi-hourglass-top"></i>}
                    </Button>
                }
            </td>
            <td className={`col-md-6 ${styles.listContext}`}>{renderContent(item)}</td>
            {statusFilter === 'done'
                ? <td className={styles.listButton}>{item.endTime}</td>
                : <td className={styles.listButton}>
                    <Button className={`col-md-3 ${styles.listButton}`} onClick={() => { handleButtonClicked(buttonText === 'CANCEL' ? 'START' : 'DONE', item); }}>
                        {buttonText === 'CANCEL' ? <i className="bi bi-hourglass-split"></i> : <i className="bi bi-hourglass-bottom"></i>}
                    </Button>
                </td>
            }
        </tr>
    );
};
