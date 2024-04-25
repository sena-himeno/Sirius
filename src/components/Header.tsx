import React from 'react';
import Link from 'next/link';
import { Button } from '@mui/material';
import styles from '../style/header.module.css';

const Header: React.FC = () => {
    return (
        <div className="container-fluid">
            <div className={`row ${styles.header} align-items-center`}>
                <div className="col-md-12 col-lg-2 col-xl-2 col-sm-12">
                    <h3 className="mb-0">Sirius <i className="bi bi-feather"></i></h3>
                </div>
                <div className="col-lg-6 d-none d-xl-block">
                    <p className="mb-0">私たちの願いは同じ空を繋いでる 私たちがしたいつかの約束と、 手に入れた誰かの記憶と妄想も</p>
                </div>
                <div className={`col-md-10 col-xl-4 col-lg-6 col-sm-6 col-sm-12 d-flex justify-content-end ${styles.buttonContainer}`}>
                    <Link href="/">
                        <Button disableElevation className={styles.button}>
                            Home
                        </Button>
                    </Link>
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
                </div>
            </div>
        </div>
    );
};

export default Header;
