'use client'
import styles from '@/style/archive.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import MoreChart from '@/app/archive/components/MoreChart';
import Archive from '@/app/archive/components/Archive';
import Setting from '@/app/archive/components/Setting';
import TimeLineComponent from '@/app/archive/components/TimeLine';

export default function Page (): React.JSX.Element {
    const [activeComponent, setActiveComponent] = useState('MoreChart');

    const renderComponent = () => {
        switch (activeComponent) {
            case 'MoreChart':
                return <MoreChart />;
            case 'Archive':
                return <Archive />;
            case 'Setting':
                return <Setting />;
            case 'TimeLine':
                return <TimeLineComponent />;
            default:
                return null;
        }
    };

    return (
        <div>
            <div className={`container-fluid  ${styles.archiveContainer}  justify-content-center `}>
                <div className={'col-12 '}>
                    <div className={'row'}>
                        <div className={'col-1'}></div>
                        <div className={`col-8 ${styles.buttonBlock}`}>
                            <button
                                className={` ${styles.archiveControlButton} ${activeComponent === 'MoreChart' ? styles.activeButton : ''}`}
                                onClick={() => { setActiveComponent('MoreChart'); }}>
                                MORE CHART
                            </button>
                            <button
                                className={` ${styles.archiveControlButton} ${activeComponent === 'Archive' ? styles.activeButton : ''}`}
                                onClick={() => { setActiveComponent('Archive'); }}>
                                ARCHIVE
                            </button>
                            <button
                                className={` ${styles.archiveControlButton} ${activeComponent === 'Setting' ? styles.activeButton : ''}`}
                                onClick={() => { setActiveComponent('Setting'); }}>
                                SETTING
                            </button>
                            <button
                                className={` ${styles.archiveControlButton} ${activeComponent === 'TimeLine' ? styles.activeButton : ''}`}
                                onClick={() => { setActiveComponent('TimeLine'); }}>
                                TIMELINE
                            </button>
                        </div>
                    </div>
                    <div className={`col-12 ${styles.archiveContent} shadow-lg p-3 mb-5`}>
                        {renderComponent()}
                    </div>
                </div>
            </div>
        </div>
    );
}
