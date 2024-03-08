import React from 'react';
import Link from 'next/link';
import { Button, Box } from '@mui/material';
import styles from '../style/header.module.css';

const Header: React.FC = () => {
    return (
        <Box className={styles.header}>
            <Box className={styles.toolbar}>
                <h3>Planner</h3>
                <Box className={styles.buttonContainer}>
                    <Link href="/diary">
                        <Button disableElevation className={styles.button}>
                            Diary
                        </Button>
                    </Link>
                    <Link href="/todo">
                        <Button disableElevation className={styles.button}>
                            TODO
                        </Button>
                    </Link>
                    <Link href="/planner">
                        <Button disableElevation className={styles.button}>
                            Planner
                        </Button>
                    </Link>
                    <Link href="/message">
                        <Button disableElevation className={styles.button}>
                            Message
                        </Button>
                    </Link>
                    <Link href="/archive">
                        <Button disableElevation className={styles.button}>
                            Archive
                        </Button>
                    </Link>
                </Box>
            </Box>
        </Box>
    );
};

export default Header;
