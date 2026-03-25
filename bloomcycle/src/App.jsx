import { useState, useCallback } from 'react';
import './styles/globals.css';
import appStyles from './App.module.css';
import BottomNav from './components/BottomNav';
import HomeScreen from './screens/HomeScreen';
import CycleScreen from './screens/CycleScreen';
import ReliefScreen from './screens/ReliefScreen';
import LearnScreen from './screens/LearnScreen';
import { useCycleData } from './hooks/useCycleData';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [flash, setFlash] = useState('');
  const { logs, periodStart, cycleDay, phase, nextPeriod, todayTip, saveLog, quickLog } = useCycleData();

  const showFlash = useCallback((msg) => {
    setFlash(msg);
    setTimeout(() => setFlash(''), 2000);
  }, []);

  function handleQuickLog(type) {
    quickLog(type);
    showFlash(`${type} logged ✓`);
  }

  function handleSaveLog(entry, markAsPeriodStart) {
    saveLog(entry, markAsPeriodStart);
    showFlash('Today logged ✨');
  }

  return (
    <div className={appStyles.shell}>
      {/* Background blobs */}
      <div className={[appStyles.blob, appStyles.blob1].join(' ')} />
      <div className={[appStyles.blob, appStyles.blob2].join(' ')} />
      <div className={[appStyles.blob, appStyles.blob3].join(' ')} />
      <div className={[appStyles.blob, appStyles.blob4].join(' ')} />

      {/* Status bar */}
      <div className={appStyles.statusBar}>
        <StatusTime />
        <span>🌸 BloomCycle</span>
        <span>📶 🔋</span>
      </div>

      {/* Screens */}
      <div className={appStyles.screenArea}>
        {activeTab === 'home' && (
          <HomeScreen
            cycleDay={cycleDay}
            phase={phase}
            nextPeriod={nextPeriod}
            todayTip={todayTip}
            onQuickLog={handleQuickLog}
            onStartRelief={() => setActiveTab('relief')}
          />
        )}
        {activeTab === 'cycle' && (
          <CycleScreen
            logs={logs}
            periodStart={periodStart}
            nextPeriod={nextPeriod}
            onSave={handleSaveLog}
          />
        )}
        {activeTab === 'relief' && <ReliefScreen />}
        {activeTab === 'learn' && <LearnScreen />}
      </div>

      <BottomNav active={activeTab} onSwitch={setActiveTab} />

      {flash && <div className={appStyles.flash}>{flash}</div>}
    </div>
  );
}

function StatusTime() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  return <span>{h}:{m}</span>;
}
