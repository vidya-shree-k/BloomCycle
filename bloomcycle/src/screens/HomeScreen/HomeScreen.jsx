import GlassCard from '../../components/GlassCard';
import CycleRing from '../../components/CycleRing';
import styles from './HomeScreen.module.css';

const QUICK_LOGS = [
    { type: 'Pain', icon: '😣' },
    { type: 'Mood', icon: '🌙' },
    { type: 'Flow', icon: '💧' },
];

export default function HomeScreen({ cycleDay, phase, nextPeriod, todayTip, onQuickLog, onStartRelief }) {
    return (
        <div className={styles.screen}>
            <p className={styles.greeting}>Good evening, lovely 🌸</p>
            <h1 className={styles.title}>How are you feeling?</h1>

            {/* ① Cycle ring card */}
            <GlassCard glow>
                <CycleRing day={cycleDay} />
                <div className={styles.phaseCenter}>
                    <span className={styles.phaseBadge}>{phase.emoji} {phase.name} Phase</span>
                    <p className={styles.phaseDesc}>{phase.desc}</p>
                </div>
            </GlassCard>

            {/* ② Next Period — moved to top for prominence */}
            <GlassCard
                gradient="linear-gradient(135deg,rgba(244,114,182,0.16),rgba(167,139,250,0.16))"
                style={{ borderColor: 'rgba(244,114,182,0.32)', marginBottom: 14 }}
            >
                <div className={styles.nextRow}>
                    <span className={styles.nextIcon}>🗓️</span>
                    <div>
                        <p className={styles.tipTitle}>Next Period</p>
                        <p className={styles.nextDate}>{nextPeriod}</p>
                        <p className={styles.tipText}>Based on your 28-day cycle</p>
                    </div>
                </div>
            </GlassCard>

            {/* ③ Quick Log */}
            <p className={styles.sectionLabel}>Quick Log</p>
            <div className={styles.quickLogGrid}>
                {QUICK_LOGS.map(item => (
                    <button key={item.type} className={styles.qlogBtn} onClick={() => onQuickLog(item.type)}>
                        <span className={styles.qlogIcon}>{item.icon}</span>
                        <span className={styles.qlogLabel}>{item.type}</span>
                    </button>
                ))}
            </div>

            {/* ④ Start Relief */}
            <button className={styles.primaryBtn} onClick={onStartRelief}>
                🌿 Start Cramps Relief
            </button>

            {/* ⑤ Daily Tip */}
            <GlassCard className={styles.tipCard}>
                <div className={styles.tipEmoji}>💡</div>
                <p className={styles.tipTitle}>Daily Tip</p>
                <p className={styles.tipText}>{todayTip}</p>
            </GlassCard>
        </div>
    );
}
