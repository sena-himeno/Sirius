import React from 'react';
import { LinearProgress } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getDaysInMonth } from "@/app/utils/common";

interface ProgressProps {
    mode: 'month' | 'day';
    value: number;
}

const ProgressComponent: React.FC<ProgressProps> = ({ mode, value }) => {
    return (
        <div className={`progress-container`}>
            <div className={`progress-bars`}>
                <div className={`row`}>
                    <LinearProgress className={`col-10`}
                                    variant="determinate"
                                    value={value}
                    />
                    <p className={`col-2`} >{`${value}%`}</p>
                </div>
            </div>
        </div>
    );
};

const TimeTracker = () => {
    const daysInMonth = getDaysInMonth();
    const today = new Date();
    const dayValue = (today.getDate() / daysInMonth * 100).toFixed(2);
    const hourValue = (today.getHours() / 24 * 100).toFixed(2);
    return (
        <div className={`col-4`}>
            <ProgressComponent mode={`month`} value={Number(dayValue)} />
            <ProgressComponent mode={`day`} value={Number(hourValue)} />
        </div>
    );
};

export default TimeTracker;
