'use client'
import { type TodoEvent } from '@/app/interface/todoList';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import React, { useState } from 'react';
import styles from '@/style/todoList.module.css';

const InProgress: React.FC<{ todoItem: TodoEvent[] }> = ({ todoItem }) => {
    if (todoItem.length === 0) {
        return <div className={styles.inProgressContainer}>No items in progress.</div>;
    }
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const handleMouseEnter = (index: number): void => {
        setHoveredIndex(index);
    };

    const handleMouseLeave = (): void => {
        setHoveredIndex(null);
    };

    return (
        <div className={styles.inProgressContainer}>
            <div className={styles.itemContainer}>
                <table className={`${styles.listTable} text-center`}>
                    <thead></thead>
                    <tbody>
                    {todoItem.map((item, index) => (
                        <tr key={index}>
                            <td
                                className={`col-12 ${styles.listContext}`}
                                onMouseEnter={() => handleMouseEnter(index)}
                                onMouseLeave={handleMouseLeave}
                            >
                                {hoveredIndex === index ? item.progressRate + '%' : item.title}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default InProgress;
