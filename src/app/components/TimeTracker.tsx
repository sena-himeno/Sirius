import React from 'react'
import { LinearProgress } from '@mui/material'
import 'bootstrap/dist/css/bootstrap.min.css'
import { getDaysInMonth } from '@/app/utils/common'
import styles from '@/style/home.module.css'

interface ProgressProps {
    mode: 'month' | 'day'
    value: number
}

const ProgressComponent: React.FC<ProgressProps> = ({ mode, value }) => {
    return (
        <div className={`container ${styles.progressContainer}`}>
            <div className="row align-items-center">
                <div className={'col-2 '}>
                    <p className={styles.timeTrackerValue}>{`${mode.toUpperCase()}: `}</p>
                </div>
                <div className="col-8">
                    <LinearProgress className={styles.progress}
                                    variant="determinate"
                                    value={value}
                    />

                </div>
                <div className={'col-2 '}>
                    <p className={styles.timeTrackerValue}>{`${value}%`}</p>
                </div>
            </div>
        </div>
    )
}

const TimeTracker = async (): Promise<React.JSX.Element> => {
    const daysInMonth = getDaysInMonth()
    const today = new Date()
    const dayValue = (((today.getDate() - 1) * 24 + today.getHours()) / (daysInMonth * 24) * 100).toFixed(2)
    const hourValue = ((today.getHours() * 60 + today.getMinutes()) / (24 * 60) * 100).toFixed(2)
    return (
        <div className={''}>
            <h4 className={'text-center'}>Time Progress <i className="bi bi-activity"></i></h4>
            <ProgressComponent mode={'month'} value={Number(dayValue)} />
            <ProgressComponent mode={'day'} value={Number(hourValue)} />
        </div>
    )
}

export default TimeTracker
