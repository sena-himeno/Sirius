'use server'
import { type TodoEvent } from '@/app/interface/todoList';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import React from 'react';
import styles from '@/style/todoList.module.css';

const InProgress: React.FC<{ todoItem: TodoEvent[] }> = async ({ todoItem }) => {
    if (todoItem.length === 0) {
        return <div className={styles.inProgressContainer}>No items in progress.</div>;
    }
    return (
        <div className={styles.inProgressContainer}>
            <div className={styles.itemContainer}>
                <table className={`${styles.listTable}  text-center `}>
                    <thead>
                    </thead>
                    <tbody>
                    {todoItem.map((item, index) => (
                        <tr key={index}>
                            <td className={`col-12 ${styles.listContext}`}>{item.title}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default InProgress;
