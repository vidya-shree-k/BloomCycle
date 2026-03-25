import styles from './BottomNav.module.css';

const TABS = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'cycle', icon: '🗓️', label: 'Cycle' },
    { id: 'relief', icon: '🌿', label: 'Relief' },
    { id: 'learn', icon: '📖', label: 'Learn' },
];

export default function BottomNav({ active, onSwitch }) {
    return (
        <nav className={styles.nav}>
            {TABS.map(tab => (
                <button
                    key={tab.id}
                    className={[styles.item, active === tab.id ? styles.active : ''].join(' ')}
                    onClick={() => onSwitch(tab.id)}
                >
                    <span className={styles.icon}>{tab.icon}</span>
                    <span className={styles.pip} />
                    <span className={styles.label}>{tab.label}</span>
                </button>
            ))}
        </nav>
    );
}
