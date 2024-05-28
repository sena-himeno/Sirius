import React, { useState, useEffect } from 'react';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../../../style/calednar.module.css'
// @ts-expect-error
import { type Value } from 'react-calendar/src/shared/types';
import { type CalendarComponentProps } from '../../interface/diary';
import { createMarkdownFile, checkCurrentMonthDiaryFile } from '../../utils/diary';

const CalendarComponent: React.FC<CalendarComponentProps> = ({ onDateChange }) => {
    const [selectedDate, setSelectedDate] = useState<Date | Date[] | null>(new Date());
    const [fileExistsMap, setFileExistsMap] = useState<Record<string, boolean>>({});

    useEffect(() => {
        fetchExistDiaryFiles();
    }, []);

    const fetchExistDiaryFiles = async () => {
            let results: Record<string, boolean> = {};
            results = await checkCurrentMonthDiaryFile();
            setFileExistsMap(results);
    };

    const tileClassName = ({ date }: { date: Date }): string => {
        const dateString = date.toLocaleDateString('en-CA');
        return fileExistsMap[dateString] ? styles['current-month'] : styles['no-file'];
    };

    const handleDateChange = (value: Value, event: React.MouseEvent<HTMLButtonElement>) => {
        if (!value || Array.isArray(value)) {

        }
    }

    const handleClick = async (value: Date | Date[] | null, event: React.MouseEvent<HTMLButtonElement>) => {
        if (!value || Array.isArray(value)) {
            return;
        }

        const date = value;
        const currentDate = new Date();
        const selectDate = new Date(date.getTime());
        selectDate.setHours(0);

        if (selectDate <= currentDate) {
            await createMarkdownFile(selectDate.toLocaleDateString('en-CA'));
            setSelectedDate(selectDate);
            onDateChange(selectDate);
        } else {
            setSelectedDate(date);
            onDateChange(date);
        }
    };

    return (
        <div className={`offset-md-1 ${styles.container}`}>
            <Calendar className={`${styles.calendar} `}
                onClickDay={handleClick}
                onChange={handleDateChange}
                value={selectedDate as Date}
                tileClassName={tileClassName}
            />
        </div>
    );
}

export default CalendarComponent;
