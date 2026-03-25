import styles from './SegmentControl.module.css';

export default function SegmentControl({ options, value, onChange }) {
    return (
        <div className={styles.control}>
            {options.map(opt => (
                <button
                    key={opt.value ?? opt}
                    className={[styles.btn, (opt.value ?? opt) === value ? styles.active : ''].join(' ')}
                    onClick={() => onChange(opt.value ?? opt)}
                >
                    {opt.label ?? opt}
                </button>
            ))}
        </div>
    );
}
