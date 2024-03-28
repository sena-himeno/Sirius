'use client'
import React, { useState } from "react";
import CalendarComponent from "./components/calendar";
import MDEditorComponent from "./components/mdeditor";
import styles from '@/style/diary.module.css';
import MoodTracker from "@/app/diary/components/currentMonthMood";

export default function Page() {
    const [dateFileName, setMdFileName] = useState(() => {
        const currentDate = new Date();
        return currentDate.toLocaleDateString('en-CA');
    });

    const handleDateChange = (date: Date) => {
        const formattedDate = date.toLocaleDateString('en-CA');
        console.log(formattedDate);
        setMdFileName(formattedDate);
    };

    const filePath = `/diary/${dateFileName}.md`;

    return (
        <div className={`container-fluid  ${styles.container}`}>
            <div className="row">
                <div className="col-md-8">
                    <MDEditorComponent url={filePath}/>
                </div>
                <div className="col-md-3 ">
                    <CalendarComponent onDateChange={handleDateChange}/>
                    <MoodTracker currentDate={dateFileName}/>
                </div>
                <div className="col-md-1 ">
                </div>
            </div>
        </div>
    );
}
