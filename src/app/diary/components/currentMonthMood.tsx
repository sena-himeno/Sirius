import React, { useState, useEffect } from 'react';
import { Button, Typography, List, ListItem, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions, Container, Grid } from '@mui/material';
import { fetchMoodData, postCurrentDayMood, checkMoodFileExists ,MOOD_CHOOSE} from '../../utils/diary';

const MoodTracker: React.FC<{ currentDate: string }> = ({ currentDate }) => {
    const [moodData, setMoodData] = useState<{ day: string; mood: string }[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newMood, setNewMood] = useState<string>('');

    useEffect(() => {
        async function fetchData() {
            const exists = await checkMoodFileExists(currentDate);
            if (exists) {
                const moodData = await fetchMoodData(currentDate);
                setMoodData(moodData);
            } else {
                await postCurrentDayMood(currentDate, '[]', moodData);
            }
        }
        fetchData();
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
        <Container>
            <Grid container justifyContent="center">
                <Grid item xs={12} md={12}>
                    <div style={{ margin: '16px', padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', maxHeight: '55vh', overflowY: 'auto' }}>
                        <Typography variant="h6">{currentDate.substring(0, 7)} 的心情:</Typography>
                        <Button variant="contained" onClick={handleAddMood}>添加/修改今天的心情</Button>
                        <List>
                            {moodData.map(({ day, mood }) => (
                                <ListItem key={day} style={{ justifyContent: 'space-between' }} disablePadding>
                                    <ListItemText primary={`${day}: ${mood || '暂无记录'}`} />
                                </ListItem>
                            ))}
                        </List>
                        <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                            <DialogTitle>{`请选择${currentDate}的心情`}</DialogTitle>
                            <DialogContent>
                                <List>
                                    {MOOD_CHOOSE.map((mood, index) => (
                                        <ListItem key={index} onClick={() => handleMoodSelection(mood)}>
                                            <ListItemText primary={mood} />
                                        </ListItem>
                                    ))}
                                </List>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseDialog} color="primary">取消</Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                </Grid>
            </Grid>
        </Container>
    );
};

export default MoodTracker;
