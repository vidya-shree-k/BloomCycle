import { useState, useEffect } from 'react';
import { todayStr, getCycleDay, getPhase, getNextPeriod, TIPS } from '../utils/cycleUtils';

export function useCycleData() {
    const [logs, setLogs] = useState(() => JSON.parse(localStorage.getItem('bloom_logs') || '{}'));
    const [periodStart, setPeriodStartState] = useState(() => localStorage.getItem('bloom_period_start') || null);

    const cycleDay = getCycleDay(periodStart);
    const phase = getPhase(cycleDay);
    const nextPeriod = getNextPeriod(periodStart);
    const todayTip = TIPS[new Date().getDate() % TIPS.length];
    const todayLog = logs[todayStr()] || null;

    function saveLog(entry, markAsPeriodStart = false) {
        const today = todayStr();
        const updated = { ...logs, [today]: { date: today, ...entry } };
        setLogs(updated);
        localStorage.setItem('bloom_logs', JSON.stringify(updated));
        if (markAsPeriodStart) {
            setPeriodStartState(today);
            localStorage.setItem('bloom_period_start', today);
        }
    }

    function quickLog(type) {
        const today = todayStr();
        const current = logs[today] || { date: today };
        const patch = type === 'Pain' ? { pain: 3 } : type === 'Mood' ? { mood: 'Calm' } : { flow: 'Medium' };
        const updated = { ...logs, [today]: { ...current, ...patch } };
        setLogs(updated);
        localStorage.setItem('bloom_logs', JSON.stringify(updated));
    }

    useEffect(() => {
        // Re-sync on focus (in case another tab updated)
        const sync = () => {
            const stored = JSON.parse(localStorage.getItem('bloom_logs') || '{}');
            setLogs(stored);
        };
        window.addEventListener('focus', sync);
        return () => window.removeEventListener('focus', sync);
    }, []);

    return { logs, periodStart, cycleDay, phase, nextPeriod, todayTip, todayLog, saveLog, quickLog };
}
