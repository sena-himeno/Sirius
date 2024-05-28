import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '@/style/archive.module.css';

export default function Setting (): React.JSX.Element {
    return (
        <div className={' '}>
            <div className={'row'}>
                <div className={`col-11 ${styles.chartContent}`}>
                    <div className={'row '}>
                        <ArchiveContent />
                    </div>
                </div>
                <div className={`col-1 row ${styles.chartInfo}`}>
                    <div className={`col-12 ${styles.chartInfoButton} ${styles.paddingLeftZero}`}>
                        <button>Todo</button>
                        <button>Diary</button>
                        <button>Diary</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
function ArchiveContent (): React.JSX.Element {
    return (
        <><div className={`col-12 ${styles.settingBody}`}>
            <div className={'text-center justify-content-center'}>setting</div>
        </div>
        </>
    )
}
