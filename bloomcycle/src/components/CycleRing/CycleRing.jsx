import styles from './CycleRing.module.css';

export default function CycleRing({ day }) {
    return (
        <div className={styles.ringWrap}>
            <div className={styles.ring}>
                <div className={styles.inner}>
                    <div className={styles.dayNum}>{day ?? '—'}</div>
                    <div className={styles.dayLabel}>Cycle Day</div>
                </div>
            </div>
        </div>
    );
}
