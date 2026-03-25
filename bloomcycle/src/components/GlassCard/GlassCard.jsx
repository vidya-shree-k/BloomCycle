import styles from './GlassCard.module.css';

export default function GlassCard({ children, glow = false, gradient = null, className = '', style = {}, onClick }) {
    return (
        <div
            className={[styles.card, glow ? styles.glow : '', className].join(' ')}
            style={{ background: gradient || undefined, ...style }}
            onClick={onClick}
        >
            {children}
        </div>
    );
}
