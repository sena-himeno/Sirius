'use client'
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '@/style/archive.module.css';
import { type archiveConfigType, archiveMain, readConfig, writeConfig } from '@/app/utils/fileContolUseServer';
import { getDate } from '@/app/utils/common';

export default function Archive (): React.JSX.Element {
    const [archiveConfig, setArchiveConfig] = useState<archiveConfigType>({
        chart: false,
        defaultPreMonth: false,
        diary: false,
        fullYear: false,
        mood: false,
        selectMonth: "",
        todo: false,
        via: ""
    });
    const [isConfigChanged, setIsConfigChanged] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            setArchiveConfig(await readConfig('archiveConfig'));
        }
        void fetchData();
    }, []);

    const handleToggle = (name: string): void => {
        setArchiveConfig(prevState => {
            // @ts-ignore
            const updatedConfig = { ...prevState, [name]: !prevState[name] };
            setIsConfigChanged(true);
            return updatedConfig;
        });
    };

    const handleSaveConfig = async (): Promise<void> => {
        await writeConfig('archiveConfig', archiveConfig);
        setIsConfigChanged(false);
    };

    return (
        <div className={' '}>
            <div className={'row'}>
                <div className={`col-11 ${styles.chartContent}`}>
                    <div className={'row '}>
                        <ArchivePreviewContent archiveConfig={archiveConfig} handleToggle={handleToggle} />
                    </div>
                </div>
                <div className={`col-1 row ${styles.chartInfo}`}>
                    <div className={`col-12 ${styles.chartInfoButton} ${styles.paddingLeftZero}`}>
                        <button>Main</button>
                        <button>Todo</button>
                        <button>Diary</button>
                        <button>Diary</button>
                    </div>
                    <div className={`col-12 justify-content-end ${styles.chartInfoButton} ${styles.paddingLeftZero}`}>
                        {isConfigChanged && <button className={'justify-content-end'} onClick={handleSaveConfig}>Save Config</button>}
                    </div>
                </div>
            </div>
        </div>
    );
}

interface ArchiveContentProps {
    archiveConfig: archiveConfigType
    handleToggle: (name: string) => void
}

function ArchivePreviewContent ({ archiveConfig, handleToggle }: ArchiveContentProps): React.JSX.Element {
    const [isArchive, setisArchive] = useState<boolean>(false);

    const handleArchive = async () => {
        setisArchive(true);
        const result = await archiveMain(getDate());
        if (!result) {
            setisArchive(false)
        }
    };
    return (
        <div className={`col-12 ${styles.archiveBody}`}>
            <div className={'row '}>
                <div className={`col-6 ${styles.rightContainer}`}>
                    {Object.keys(archiveConfig).length > 0 && (
                        <>
                            {Object.entries(archiveConfig).map(([key, value]) => (
                                <ConfigItems key={key} name={key} value={value} handleToggle={handleToggle} />
                            ))}
                        </>
                    )}
                </div>
                <div className={`col-6 ${styles.rightContainer}`}>
                    <div className={' row'}>
                        <div className={''}>
                            <button disabled={isArchive} className={`${styles.archiveFileButton}`}
                                    onClick={handleArchive}>Archive File
                            </button>
                        </div>
                        <RangePreviewContent isDefault={archiveConfig.defaultPreMonth}
                                             selectMonth={archiveConfig.selectMonth}
                                             isFullYear={archiveConfig.fullYear}/>
                        <div className={`border-top ${styles.archiveFilePreView}`}>
                            {archiveConfig.mood && <MoodPreviewContent/>}
                            {archiveConfig.todo && <TodoPreviewContent/>}
                            {archiveConfig.diary && <DiaryPreviewContent/>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface ConfigItemsProps {
    name: string
    value: any
    handleToggle: (name: string) => void
}

const ConfigItems = ({name, value, handleToggle }: ConfigItemsProps): React.JSX.Element => {
    const isBoolean = typeof value === 'boolean';
    const displayValue = isBoolean ? (value ? 'On' : 'Off') : String(value);

    return (
        <div className={`row ${styles.configItem} align-items-end`}>
            <div className={`col-7 ${styles.textBottomBorder}`}>{name}</div>
            <div className={'col-1'}></div>
            {isBoolean
                ? (<button
                    className={`col-4 text-center ${styles.textBottomBorder} ${styles.basicButton}`}
                    onClick={() => {
                        handleToggle(name);
                    }}
                >
                    {displayValue}
                </button>)
                : (<div className={`col-4 text-center ${styles.textBottomBorder}`}>{displayValue}</div>)}
        </div>
    );
};

const DiaryPreviewContent = (): React.JSX.Element => {
    return (
        <div className={''}>
            Diary Content
        </div>
    );
};

const MoodPreviewContent = (): React.JSX.Element => {
    return (
        <div className={''}>
            ### Mood : Mood Content
        </div>
    );
};

const TodoPreviewContent = (): React.JSX.Element => {
    return (
        <div>
            Todo Content
        </div>
    );
};
const RangePreviewContent = ({ isDefault, selectMonth, isFullYear }: { isDefault: boolean, selectMonth: string, isFullYear: boolean }): React.JSX.Element => {
    const getPreviousMonthDate = (): string => {
        if (isDefault) {
            const today = new Date();
            const year = today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear();
            const month = today.getMonth() === 0 ? 11 : today.getMonth() - 1;
            const firstDay = new Date(year, month, 1).toLocaleDateString();
            const lastDay = new Date(year, month + 1, 0).toLocaleDateString();
            return `${firstDay} to ${lastDay}`;
        }
        return '阿巴阿巴';
    };


    return (
        <div className={`${styles.archiveFilePreView}`}>
            {getPreviousMonthDate()}
        </div>
    );
};
