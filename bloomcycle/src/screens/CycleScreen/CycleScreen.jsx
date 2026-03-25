import { useState, useEffect } from 'react';
import GlassCard from '../../components/GlassCard';
import SegmentControl from '../../components/SegmentControl';
import { todayStr, daysBetween } from '../../utils/cycleUtils';
import styles from './CycleScreen.module.css';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const FLOW_OPTS = ['Light', 'Medium', 'Heavy', 'None'];
const MOOD_OPTS = [
    { value: 'Calm', label: '😌 Calm' },
    { value: 'Neutral', label: '😐 Neutral' },
    { value: 'Low', label: '😔 Low' },
    { value: 'Irritable', label: '😤 Irritable' },
];

export default function CycleScreen({ logs, periodStart, nextPeriod, onSave }) {
    const [flow, setFlow] = useState('Medium');
    const [pain, setPain] = useState(2);
    const [mood, setMood] = useState('Calm');
    const [isPeriodStart, setIsPeriodStart] = useState(false);

    // Restore today's log
    useEffect(() => {
        const todayLog = logs[todayStr()];
        if (todayLog) {
            if (todayLog.flow) setFlow(todayLog.flow);
            if (todayLog.mood) setMood(todayLog.mood);
            if (todayLog.pain != null) setPain(todayLog.pain);
        }
    }, [logs]);

    // Build 14-day strip centered on today
    const calDays = Array.from({ length: 14 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i - 5);
        const dStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const isToday = i === 5;
        const hasLog = !!logs[dStr];
        const isPeriod = periodStart && daysBetween(periodStart, dStr) >= 0 && daysBetween(periodStart, dStr) < 5;
        return { d, dStr, isToday, hasLog, isPeriod };
    });

    return (
        <div className={styles.screen}>
            <h2 className={styles.title}>Cycle Tracker</h2>

            <GlassCard>
                <p className={styles.label}>This Week</p>
                <div className={styles.calStrip}>
                    {calDays.map(({ d, isToday, hasLog, isPeriod }) => (
                        <div key={d.toISOString()}
                            className={[styles.calDay, isToday ? styles.today : '', isPeriod ? styles.period : ''].join(' ')}>
                            <span className={styles.calDn}>{DAYS[d.getDay()]}</span>
                            <span className={styles.calDd}>{d.getDate()}</span>
                            {hasLog && <span className={styles.calDot} />}
                        </div>
                    ))}
                </div>
            </GlassCard>

            <GlassCard>
                <p className={styles.label}>Log Today</p>

                <div className={styles.formGroup}>
                    <p className={styles.fieldLabel}>💧 Flow</p>
                    <SegmentControl options={FLOW_OPTS} value={flow} onChange={setFlow} />
                </div>

                <div className={styles.formGroup}>
                    <div className={styles.painRow}>
                        <p className={styles.fieldLabel}>😣 Pain Level</p>
                        <span className={styles.painVal}>{pain}</span>
                    </div>
                    <input type="range" min="0" max="5" value={pain}
                        onChange={e => setPain(Number(e.target.value))} className={styles.slider} />
                    <div className={styles.painLabels}><span>None</span><span>Severe</span></div>
                </div>

                <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                    <p className={styles.fieldLabel}>🌸 Mood</p>
                    <SegmentControl options={MOOD_OPTS} value={mood} onChange={setMood} />
                </div>

                <label className={styles.checkRow}>
                    <input type="checkbox" checked={isPeriodStart} onChange={e => setIsPeriodStart(e.target.checked)} />
                    <span>Mark as Period Start (Day 1)</span>
                </label>
            </GlassCard>

            <button className={styles.saveBtn} onClick={() => onSave({ flow, pain, mood }, isPeriodStart)}>
                Save Today's Log ✨
            </button>

            <div className={styles.predCard}>
                <span className={styles.predIcon}>🌙</span>
                <div>
                    <p className={styles.predSub}>Next period predicted</p>
                    <p className={styles.predDate}>{nextPeriod}</p>
                    <p className={styles.predSub}>~28 day cycle</p>
                </div>
            </div>
        </div>
    );
}
