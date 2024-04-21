import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '@/style/archive.module.css';

export default function MoreChart () {
    return (
        <div className={' '}>
            <div className={'row'}>
                <div className={`col-11 ${styles.chartContent}`}>
                    <div className={'row '}>
                        <TodoChartContent />
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
function TodoChartContent (): React.JSX.Element {
    return (
        <><div className={`col-12 ${styles.chartBody}`}>
            <div className={'text-center justify-content-center'}>Chart</div>
        </div>
        {/* chart choose buton */}
        <div className={`col-12 ${styles.charChooseButton}  `}>
            <button>TodoButton1</button>
            <button>TodoButton2</button>
            <button>TodoButton3</button>
        </div>
        </>
    )
}
