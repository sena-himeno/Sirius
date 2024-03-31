'use client'
import React, {useEffect, useState} from 'react';
import {TodoEvent} from "@/app/interface/todoList";
import {getInProgress} from "@/app/utils/todoList";


const InProgress = () => {
    const [inProgress, setInProgress] = useState<TodoEvent[]>([]);
    const fetchDate = async() =>{
        try {
            const data = await getInProgress();
            setInProgress(data);
        } catch (error) {
            console.error('Error fetching todo list:', error);
        }
    }

    useEffect(() => {
        fetchDate();
    }, []);

    return (
        <div>
            <div className={`col-md-6 col-lg-4   `}>
                {inProgress.map((event, index) => (
                    <div key={index}>{event.title}</div>
                ))}
            </div>
        </div>
    );
};

export default InProgress;
