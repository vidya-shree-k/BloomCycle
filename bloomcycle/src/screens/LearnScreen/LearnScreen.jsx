import { useState } from 'react';
import styles from './LearnScreen.module.css';

const CATEGORIES = [
    {
        id: 'products', icon: '🩹', color: 'lci1', title: 'Menstrual Products',
        items: [
            { name: 'Pads', body: 'Worn outside the body. Great for beginners. Change every 4–6 hours.' },
            { name: 'Tampons', body: 'Inserted internally. Use lowest absorbency needed. Change every 4–8 hours.' },
            { name: 'Menstrual Cup', body: 'Reusable silicone cup. Eco-friendly. Can wear up to 12 hours.' },
            { name: 'Period Underwear', body: 'Absorbent underwear. Comfortable and reusable. Great for light days.' },
            { name: 'Discs', body: 'Worn at the cervix. Can be worn during intimacy. Holds more than a cup.' },
        ],
    },
    {
        id: 'phases', icon: '🌙', color: 'lci2', title: 'Cycle Phases',
        items: [
            { name: '🔴 Menstrual (Days 1–5)', body: 'Uterine lining sheds. Rest, warmth & iron-rich foods help.' },
            { name: '🌱 Follicular (Days 6–13)', body: 'Energy rises. Estrogen builds up. Great time for new projects.' },
            { name: '✨ Ovulation (Day 14)', body: 'Egg released. Peak energy & confidence. You may feel your best!' },
            { name: '🍂 Luteal (Days 15–28)', body: 'Progesterone rises then drops. PMS can occur. Self-care is key.' },
        ],
    },
    {
        id: 'pms', icon: '💚', color: 'lci3', title: 'PMS Basics',
        items: [
            { name: 'What is PMS?', body: 'Premenstrual Syndrome — physical & emotional symptoms in the luteal phase (days 15–28).' },
            { name: 'Common Symptoms', body: 'Bloating, breast tenderness, mood swings, fatigue, cravings, headaches.' },
            { name: 'Nutrition Help', body: 'Reduce sodium & sugar. Add magnesium-rich foods (dark chocolate, leafy greens).' },
            { name: 'Movement', body: 'Light exercise like walking or yoga can reduce bloating and improve mood.' },
            { name: 'Sleep', body: 'Aim for 7–9 hours. Your body heals during rest, especially during this phase.' },
        ],
    },
    {
        id: 'doctor', icon: '🩺', color: 'lci4', title: 'When to See a Doctor',
        items: [
            { name: 'Very Heavy Bleeding', body: 'Soaking a pad/tampon every hour for 2+ hours. Could indicate fibroids.' },
            { name: 'Severe Cramps', body: 'Pain that disrupts daily life may be endometriosis or adenomyosis.' },
            { name: 'Irregular Cycles', body: 'Cycles consistently shorter than 21 or longer than 35 days warrant a check-up.' },
            { name: 'Missed Periods', body: 'Missing 3+ periods (excluding pregnancy) may signal hormonal or thyroid issues.' },
            { name: 'Unusual Discharge', body: 'Strong odor, unusual color, or itching outside of period can indicate infection.' },
        ],
    },
];

function LearnCategory({ cat }) {
    const [open, setOpen] = useState(false);
    return (
        <div className={styles.cat}>
            <div className={styles.catHead} onClick={() => setOpen(o => !o)}>
                <div className={[styles.catIcon, styles[cat.color]].join(' ')}>{cat.icon}</div>
                <p className={styles.catTitle}>{cat.title}</p>
                <span className={[styles.arrow, open ? styles.arrowOpen : ''].join(' ')}>▶</span>
            </div>
            {open && (
                <div className={styles.catBody}>
                    {cat.items.map(item => (
                        <div key={item.name} className={styles.catItem}>
                            <strong>{item.name}</strong>
                            <span>{item.body}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function LearnScreen() {
    return (
        <div className={styles.screen}>
            <h2 className={styles.title}>Learn & Discover</h2>
            <p className={styles.subtitle}>Knowledge is self-care 🌸</p>
            {CATEGORIES.map(cat => <LearnCategory key={cat.id} cat={cat} />)}
        </div>
    );
}
