import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { fetchMoodData, postCurrentDayMood, checkMoodFileExists, MOOD_CHOOSE } from '../../utils/diary';
import styles from '@/style/diary.module.css';

const MoodTracker: React.FC<{ currentDate: string }> = ({ currentDate }) => {
    const [moodData, setMoodData] = useState<Array<{ day: string, mood: string }>>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newMood, setNewMood] = useState<string>('');

    useEffect(() => {
        async function fetchData () {
            const exists = await checkMoodFileExists(currentDate);
            if (exists) {
                const moodData = await fetchMoodData(currentDate);
                setMoodData(moodData);
            } else {
                await postCurrentDayMood(currentDate, '', moodData);
            }
        }
        void fetchData();
    }, []);

    const handleAddMood = () => {
        setNewMood('');
        const existingMood = moodData.find(item => item.day === currentDate.substring(8, 10));
        if (existingMood) {
            setNewMood(existingMood.mood);
        }
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const handleMoodSelection = async (mood: string) => {
        const updatedMoodData = await postCurrentDayMood(currentDate, mood, moodData);
        setMoodData(updatedMoodData);
        handleCloseDialog();
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <div className="row">
                        <div className="col-2"></div>
                        <button className={`${styles.moodButton} col-8`} onClick={handleAddMood}>{currentDate.substring(0, 7)} Mood</button>
                    </div>
                    <div className="row">
                        <div className="col-1"></div>
                        <div className={`col-11 ${styles.moodBody}`}>
                            <List>
                                {moodData.map(({ day, mood }) => (
                                    <ListItem key={day} className={`${styles.moodItem}`}>
                                        <ListItemText primary={`${day}: ${mood}`} />
                                    </ListItem>
                                ))}
                            </List>
                            <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                                <DialogTitle>{`请选择${currentDate}的心情`}</DialogTitle>
                                <DialogContent>
                                    <List>
                                        {MOOD_CHOOSE.map((mood, index) => (
                                            <ListItem key={index} onClick={async () => { await handleMoodSelection(mood); }}>
                                                <ListItemText primary={mood} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleCloseDialog} variant="contained" color="secondary">取消</Button>
                                </DialogActions>
                            </Dialog>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MoodTracker;
