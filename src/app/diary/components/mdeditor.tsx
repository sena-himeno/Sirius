import React, { useState, useEffect, useRef } from 'react';
import MDEditor from '@uiw/react-md-editor';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { type MDEditorProps } from '../../interface/diary'
import { createMarkdownFile } from '@/app/utils/diary';
import { getDate } from '@/app/utils/common';
import styles from '@/style/diary.module.css'

const AUTO_SAVE_CHANGE_COUNT = 20;
const MDEditorComponent: React.FC<MDEditorProps> = ({ url }) => {
    const savePath = url;

    const [value, setValue] = useState<string>('');
    const [pending, setPending] = useState<boolean>(false);
    const [editCount, setEditCount] = useState<number>(0); // 变更统计 用来自动保存
    const divRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const currentDate = new Date();
        const selectedDate = new Date(url.replace('/diary/', '').replace('.md', ''));
        selectedDate.setHours(0);

        if (!isNaN(selectedDate.getTime()) && selectedDate <= currentDate) {
            const fetchMarkdownFile = async () => {
                setPending(true);
                try {
                    await createMarkdownFile(getDate());
                    const response = await axios.get(url);
                    setValue(defaultContent(response.data));
                } catch (error) {
                    setValue('');
                } finally {
                    setPending(false);
                }
            };

            fetchMarkdownFile();
            setIsSaved(true);
        }
    }, [url]);

    const handleEditorChange = (value: string | undefined) => {
        setValue(value ?? '');
        setIsSaved(false)
        setEditCount(count => count + 1); // 变更统计 用来自动保存
    };

    const handleSaveFile = async () => {
        try {
            await fetch('/api/diary/saveMarkdownFile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: value, filePath: savePath })
            });
            console.log('File saved successfully');
            setEditCount(0);
        } catch (error) {
            console.error('Error saving file:', error);
        }
        setIsSaved(true);
    };

    const defaultContent = (value: string) => {
        return value === '' ? 'No thing / Loading' : value;
    }

    useEffect(() => {
        if (editCount >= AUTO_SAVE_CHANGE_COUNT) {
            handleSaveFile();
        }
    }, [editCount]);

    const [showMDEditor, setShowMDEditor] = useState(true);

    const handleToggleMDEditor = () => {
        setShowMDEditor(true);
    };

    const handleToggleMDEditorShort = () => {
        setShowMDEditor(false);
    };

    const [isSaved, setIsSaved] = useState<boolean>(true);

    return (
        <div className={`${styles.markdownContainer} container`}>
            <div className={'col-12 row'}>
                <div className={'col-1'}>

                </div>
            <div className={`row col-4 ${styles.buttonBlock}`}>
                <button
                    className={`col-6 ${styles.todoListControlButton}  ${showMDEditor ? styles.buttonChoose : styles.todoListTableButton}`}
                    onClick={handleToggleMDEditor}>
                    Diary Editor
                </button>
                <button
                    className={`col-6 ${styles.todoListControlButton} ${!showMDEditor ? styles.buttonChoose : styles.todoListTableButton}`}
                    onClick={handleToggleMDEditorShort}>
                    Diary Preview
                </button>

            </div>
                {
                    !isSaved && <button className={`col-2 ${styles.saveButton} ${styles.todoListControlButton}`} onClick={handleSaveFile}>Save</button>
                }
            </div>

            <div className={styles.todoListContext}>
                {
                    showMDEditor
                        ? <div className={styles.mdeditorBody}>
                            <MDEditor className={styles.MDEditor}
                                      value={value}
                                      onChange={handleEditorChange}
                                      preview={'edit'}
                                      height={700}
                            />
                        </div>
                        : <div>
                            <div className={`p-3 ${styles.markdownPreviewBody}`} ref={divRef}>
                                <MDEditor.Markdown className={`${styles.diaryPreview}`}
                                                   source={value}
                                />
                            </div>
                        </div>
                }
            </div>

        </div>
    );
};

export default MDEditorComponent;
