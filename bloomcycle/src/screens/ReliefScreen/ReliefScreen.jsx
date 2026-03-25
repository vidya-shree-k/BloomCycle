import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './ReliefScreen.module.css';

/* ══════════════════════════════════════
   YOGA / COMFORT DATA
══════════════════════════════════════ */
const YOGA = [
    {
        icon: '🙏', name: "Child's Pose", desc: 'Stretches lower back & hips', dur: '2 min',
        body: 'Gently stretches your lower back and hips, melting away menstrual tension.',
        how: 'Sit on heels, fold forward, arms stretched out. Hold 1–3 minutes, breathing deeply.',
        poseType: 'childs',
    },
    {
        icon: '🤗', name: 'Knees to Chest', desc: 'Releases lower abdomen tension', dur: '2 min',
        body: 'Releases tension in the lower abdomen and massages the lower back gently.',
        how: 'Lie on your back and hug both knees to your chest for 2 minutes.',
        poseType: 'knees',
    },
    {
        icon: '🌀', name: 'Supine Twist', desc: 'Massages uterus gently', dur: '3 min',
        body: 'Massages the uterus and releases lower back tension in a nurturing way.',
        how: 'Lie on back, drop knees to the left for 1 min, then switch to the right.',
        poseType: 'twist',
    },
];
const COMFORT = [
    {
        icon: '🌡️', name: 'Heat Pad', desc: 'Place on lower abdomen 15–20 min', dur: '20 min',
        body: 'Warmth relaxes uterine muscles and significantly reduces cramping.',
        how: 'Apply a warm heat pad to your lower abdomen and rest quietly.',
        poseType: 'heat',
    },
    {
        icon: '☕', name: 'Warm Drinks', desc: 'Ginger tea, chamomile, warm water', dur: 'Anytime',
        body: 'Warm liquids soothe cramps and reduce inflammation.',
        how: 'Sip ginger or chamomile tea slowly throughout the day.',
        poseType: 'drink',
    },
];

const BREATH_PATTERNS = {
    calm: { label: '2-Min Calm Breath', steps: [{ phase: 'Inhale', dur: 4 }, { phase: 'Exhale', dur: 4 }], maxCycles: 15 },
    '478': { label: '4-7-8 Technique', steps: [{ phase: 'Inhale', dur: 4 }, { phase: 'Hold', dur: 7 }, { phase: 'Exhale', dur: 8 }], maxCycles: 5 },
};

/* ══════════════════════════════════════
   WEB AUDIO — soothing tones
══════════════════════════════════════ */
function createAudioCtx() {
    try { return new (window.AudioContext || window.webkitAudioContext)(); } catch { return null; }
}

function useBreathAudio() {
    const ctxRef  = useRef(null);
    const nodesRef = useRef([]);

    const stopNodes = useCallback(() => {
        nodesRef.current.forEach(n => { try { n.stop(); n.disconnect(); } catch {} });
        nodesRef.current = [];
    }, []);

    const playPhase = useCallback((phase) => {
        if (!ctxRef.current) ctxRef.current = createAudioCtx();
        const ctx = ctxRef.current;
        if (!ctx) return;

        // Resume if suspended (browser policy)
        if (ctx.state === 'suspended') ctx.resume();

        stopNodes();

        const t = ctx.currentTime;
        const dur = phase === 'Inhale' ? 4 : phase === 'Hold' ? 2 : 6;

        // Base drone — soft sine
        const freqs =
            phase === 'Inhale' ? [174, 261] :   // rising warmth
            phase === 'Hold'   ? [174, 220] :   // held stillness
                                 [130, 174];    // falling release

        freqs.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t);
            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(0.06, t + 0.4);
            gain.gain.linearRampToValueAtTime(0.06, t + dur - 0.4);
            gain.gain.linearRampToValueAtTime(0, t + dur);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(t);
            osc.stop(t + dur);
            nodesRef.current.push(osc);
        });

        // Subtle shimmer overtone
        const shimmer = ctx.createOscillator();
        const shimGain = ctx.createGain();
        shimmer.type = 'sine';
        shimmer.frequency.setValueAtTime(freqs[0] * 3.01, t);
        shimGain.gain.setValueAtTime(0, t);
        shimGain.gain.linearRampToValueAtTime(0.018, t + 0.6);
        shimGain.gain.linearRampToValueAtTime(0, t + dur);
        shimmer.connect(shimGain);
        shimGain.connect(ctx.destination);
        shimmer.start(t);
        shimmer.stop(t + dur);
        nodesRef.current.push(shimmer);
    }, [stopNodes]);

    const stopAll = useCallback(() => {
        stopNodes();
    }, [stopNodes]);

    useEffect(() => () => stopNodes(), [stopNodes]);

    return { playPhase, stopAll };
}

/* ══════════════════════════════════════
   ANIMATED CHILD'S POSE SVG
══════════════════════════════════════ */
function ChildsPoseAnimated() {
    return (
        <svg viewBox="0 0 240 140" className={styles.poseSvg} aria-label="Child's Pose" xmlns="http://www.w3.org/2000/svg">
            {/* Floor */}
            <line x1="10" y1="118" x2="230" y2="118" stroke="rgba(167,139,250,0.25)" strokeWidth="2" strokeLinecap="round"/>

            {/* Back glow pulse — shows breathing */}
            <ellipse cx="100" cy="95" rx="38" ry="14" fill="rgba(244,114,182,0.08)" className={styles.torsoGlow}/>

            {/* Torso curved down — animates with breathing */}
            <path d="M125 108 Q110 85 90 72 Q72 60 58 64"
                  stroke="#c084fc" strokeWidth="5.5" strokeLinecap="round" fill="none"
                  className={styles.torsoPath}/>

            {/* Hips/butt up */}
            <ellipse cx="140" cy="100" rx="17" ry="12"
                     fill="rgba(192,132,252,0.18)" stroke="#c084fc" strokeWidth="2.5"
                     className={styles.torsoPath}/>

            {/* Thighs folded */}
            <path d="M125 108 Q134 118 148 118" stroke="#a78bfa" strokeWidth="5" strokeLinecap="round" fill="none"/>
            <path d="M125 108 Q132 120 145 120" stroke="#a78bfa" strokeWidth="4" strokeLinecap="round" fill="none"/>

            {/* Arms stretched forward */}
            <line x1="58" y1="66" x2="24" y2="80"
                  stroke="#f472b6" strokeWidth="4.5" strokeLinecap="round" className={styles.armL}/>
            <line x1="58" y1="66" x2="20" y2="93"
                  stroke="#f472b6" strokeWidth="3.5" strokeLinecap="round" className={styles.armR}/>

            {/* Hands */}
            <circle cx="22" cy="80" r="4" fill="rgba(244,114,182,0.3)" stroke="#f472b6" strokeWidth="1.5" className={styles.armL}/>
            <circle cx="18" cy="93" r="4" fill="rgba(244,114,182,0.3)" stroke="#f472b6" strokeWidth="1.5" className={styles.armR}/>

            {/* Head resting on ground */}
            <circle cx="44" cy="90" r="13"
                    fill="rgba(244,114,182,0.16)" stroke="#f472b6" strokeWidth="2.5"
                    className={styles.headBob}/>
            {/* Hair suggestion */}
            <path d="M34 82 Q44 76 54 82" stroke="#f472b6" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6"/>

            {/* Breathing aura rings around head */}
            <circle cx="44" cy="90" r="18" fill="none" stroke="rgba(244,114,182,0.18)" strokeWidth="1.5" className={styles.aura1}/>
            <circle cx="44" cy="90" r="24" fill="none" stroke="rgba(167,139,250,0.12)" strokeWidth="1" className={styles.aura2}/>
        </svg>
    );
}

/* ══════════════════════════════════════
   STATIC POSE FIGURES
══════════════════════════════════════ */
function PoseFigure({ type }) {
    if (type === 'childs') return <ChildsPoseAnimated />;
    if (type === 'knees') return (
        <svg viewBox="0 0 220 130" className={styles.poseSvg} aria-label="Knees to Chest">
            <line x1="10" y1="112" x2="210" y2="112" stroke="rgba(167,139,250,0.25)" strokeWidth="2" strokeLinecap="round"/>
            <rect x="55" y="82" width="90" height="17" rx="8.5" fill="rgba(192,132,252,0.18)" stroke="#c084fc" strokeWidth="2.5"/>
            <circle cx="42" cy="90" r="11" fill="rgba(244,114,182,0.16)" stroke="#f472b6" strokeWidth="2.5"/>
            <path d="M120 82 Q138 60 158 66 Q172 72 168 88 Q162 104 148 100 Q130 94 120 82Z"
                  fill="rgba(192,132,252,0.16)" stroke="#c084fc" strokeWidth="2.5"/>
            <path d="M95 84 Q118 60 155 70" stroke="#f472b6" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
            <path d="M95 96 Q118 108 155 86" stroke="#f472b6" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
            <circle cx="145" cy="78" r="20" fill="none" stroke="rgba(167,139,250,0.14)" strokeWidth="1.5" className={styles.aura1}/>
        </svg>
    );
    if (type === 'twist') return (
        <svg viewBox="0 0 220 130" className={styles.poseSvg} aria-label="Supine Twist">
            <line x1="10" y1="112" x2="210" y2="112" stroke="rgba(167,139,250,0.25)" strokeWidth="2" strokeLinecap="round"/>
            <rect x="55" y="80" width="90" height="18" rx="9" fill="rgba(192,132,252,0.18)" stroke="#c084fc" strokeWidth="2.5"/>
            <circle cx="42" cy="89" r="11" fill="rgba(244,114,182,0.16)" stroke="#f472b6" strokeWidth="2.5"/>
            <line x1="55" y1="89" x2="18" y2="66" stroke="#f472b6" strokeWidth="3.5" strokeLinecap="round"/>
            <path d="M145 82 Q162 72 174 84 Q180 96 170 102 Q156 108 145 97" fill="rgba(192,132,252,0.16)" stroke="#c084fc" strokeWidth="2.5"/>
            <circle cx="105" cy="89" r="20" fill="none" stroke="rgba(167,139,250,0.12)" strokeWidth="1.5" className={styles.aura1}/>
        </svg>
    );
    if (type === 'heat') return (
        <svg viewBox="0 0 220 130" className={styles.poseSvg} aria-label="Heat pad">
            <rect x="65" y="48" width="90" height="52" rx="18" fill="rgba(244,114,182,0.15)" stroke="#f472b6" strokeWidth="2.5"/>
            <path d="M90 36 Q95 24 100 36 Q105 48 110 36 Q115 24 120 36" stroke="#f472b6" strokeWidth="2.5" fill="none" strokeLinecap="round" className={styles.heatWave}/>
            <circle cx="110" cy="74" r="22" fill="rgba(244,114,182,0.1)" className={styles.aura1}/>
            <circle cx="110" cy="74" r="11" fill="rgba(244,114,182,0.2)" stroke="#f472b6" strokeWidth="1.5"/>
            <path d="M105 72 Q108 66 115 72 Q108 78 105 72Z" fill="#f472b6" opacity="0.7"/>
        </svg>
    );
    if (type === 'drink') return (
        <svg viewBox="0 0 220 130" className={styles.poseSvg} aria-label="Warm drink">
            <path d="M80 54 L92 110 L128 110 L140 54Z" fill="rgba(167,139,250,0.15)" stroke="#a78bfa" strokeWidth="2.5" strokeLinejoin="round"/>
            <path d="M140 70 Q162 70 162 84 Q162 98 140 98" fill="none" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round"/>
            <path d="M95 45 Q100 32 105 45" stroke="rgba(167,139,250,0.7)" strokeWidth="2.2" fill="none" strokeLinecap="round" className={styles.steam1}/>
            <path d="M108 40 Q113 27 118 40" stroke="rgba(167,139,250,0.5)" strokeWidth="2.2" fill="none" strokeLinecap="round" className={styles.steam2}/>
            <path d="M121 45 Q126 32 131 45" stroke="rgba(167,139,250,0.4)" strokeWidth="2.2" fill="none" strokeLinecap="round" className={styles.steam1}/>
            <path d="M83 82 L137 82 L128 110 L92 110Z" fill="rgba(167,139,250,0.18)"/>
        </svg>
    );
    return null;
}

/* ══════════════════════════════════════
   RELIEF ITEM ROW
══════════════════════════════════════ */
function ReliefItem({ item, onOpen }) {
    return (
        <div className={styles.item} onClick={() => onOpen(item)}>
            <div className={styles.iconBox}>{item.icon}</div>
            <div className={styles.info}>
                <p className={styles.name}>{item.name}</p>
                <p className={styles.desc}>{item.desc}</p>
            </div>
            <span className={styles.dur}>{item.dur}</span>
        </div>
    );
}

/* ══════════════════════════════════════
   MAIN SCREEN
══════════════════════════════════════ */
export default function ReliefScreen() {
    const [poseModal, setPoseModal]     = useState(null);
    const [breathType, setBreathType]   = useState(null);
    const [stepIdx, setStepIdx]         = useState(0);
    const [cycle, setCycle]             = useState(0);
    const [timeLeft, setTimeLeft]       = useState(0);
    const timerRef = useRef(null);
    const { playPhase, stopAll } = useBreathAudio();

    const startBreathing = (type) => {
        setBreathType(type);
        setStepIdx(0);
        setCycle(0);
        const firstDur = BREATH_PATTERNS[type].steps[0].dur;
        setTimeLeft(firstDur);
        playPhase(BREATH_PATTERNS[type].steps[0].phase);
        tick(type, 0, 0, firstDur);
    };

    const tick = (type, step, cyc, t) => {
        clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            t--;
            setTimeLeft(t);
            if (t <= 0) {
                clearInterval(timerRef.current);
                const pattern = BREATH_PATTERNS[type];
                const nextStep = (step + 1) % pattern.steps.length;
                const nextCyc  = nextStep === 0 ? cyc + 1 : cyc;
                if (nextCyc >= pattern.maxCycles) {
                    stopBreathing();
                } else {
                    const nextDur = pattern.steps[nextStep].dur;
                    setStepIdx(nextStep);
                    setCycle(nextCyc);
                    setTimeLeft(nextDur);
                    playPhase(pattern.steps[nextStep].phase);
                    tick(type, nextStep, nextCyc, nextDur);
                }
            }
        }, 1000);
    };

    const stopBreathing = () => {
        clearInterval(timerRef.current);
        stopAll();
        setBreathType(null);
        setStepIdx(0); setCycle(0); setTimeLeft(0);
    };

    useEffect(() => () => { clearInterval(timerRef.current); stopAll(); }, [stopAll]);

    const pattern  = breathType ? BREATH_PATTERNS[breathType] : null;
    const step     = pattern ? pattern.steps[stepIdx] : null;
    const phase    = step?.phase ?? '';
    const phaseDur = step?.dur ?? 4;

    const phaseClass =
        phase === 'Inhale' ? styles.phaseInhale :
        phase === 'Hold'   ? styles.phaseHold   :
        phase === 'Exhale' ? styles.phaseExhale : '';

    const progress = step ? ((phaseDur - timeLeft) / phaseDur) : 0;

    return (
        <div className={styles.screen}>
            <h2 className={styles.title}>Cramps Relief</h2>

            <p className={styles.sectionHead}>🧘 Yoga for Cramps</p>
            {YOGA.map(item => <ReliefItem key={item.name} item={item} onOpen={setPoseModal} />)}

            <p className={styles.sectionHead}>🌬️ Breathing</p>
            <div className={styles.item} onClick={() => startBreathing('calm')}>
                <div className={[styles.iconBox, styles.iconBreath].join(' ')}>😌</div>
                <div className={styles.info}><p className={styles.name}>2-Min Calm Breath</p><p className={styles.desc}>Slow, equal inhale & exhale</p></div>
                <span className={styles.dur}>2 min</span>
            </div>
            <div className={styles.item} onClick={() => startBreathing('478')}>
                <div className={[styles.iconBox, styles.iconBreath].join(' ')}>💫</div>
                <div className={styles.info}><p className={styles.name}>4-7-8 Technique</p><p className={styles.desc}>Reduces anxiety & pain perception</p></div>
                <span className={styles.dur}>3 min</span>
            </div>

            <p className={styles.sectionHead}>🧸 Comfort Tips</p>
            {COMFORT.map(item => <ReliefItem key={item.name} item={item} onOpen={setPoseModal} />)}

            {/* ── Pose modal ── */}
            {poseModal && (
                <div className={styles.modal}>
                    <div className={styles.modalIcon}>{poseModal.icon}</div>
                    <p className={styles.modalTitle}>{poseModal.name}</p>
                    <div className={styles.poseFigureWrap}><PoseFigure type={poseModal.poseType} /></div>
                    <div className={styles.modalCard}>
                        <p className={styles.modalBody}>{poseModal.body}</p>
                        <p className={styles.modalHow}>{poseModal.how}</p>
                    </div>
                    <button className={styles.closeBtn} onClick={() => setPoseModal(null)}>Done ✓</button>
                </div>
            )}

            {/* ── Breathing modal ── */}
            {breathType && (
                <div className={styles.modal}>
                    <p className={styles.modalTitle}>{pattern.label}</p>
                    <p className={styles.eyesHint}>✨ Close your eyes &amp; breathe</p>

                    {/* Ambient wave rings */}
                    <div className={styles.breathWrap}>
                        <div className={styles.waveRing} style={{ animationDuration: `${phaseDur * 1.1}s` }} />
                        <div className={styles.waveRing} style={{ animationDuration: `${phaseDur * 1.1}s`, animationDelay: `${phaseDur * 0.35}s` }} />
                        <div className={styles.waveRing} style={{ animationDuration: `${phaseDur * 1.1}s`, animationDelay: `${phaseDur * 0.7}s` }} />

                        {/* Main circle — CSS transition duration = step duration */}
                        <div
                            className={[styles.breathCircle, phaseClass].join(' ')}
                            style={{ transition: `transform ${phaseDur}s cubic-bezier(0.4,0,0.2,1), background ${phaseDur * 0.5}s ease, box-shadow ${phaseDur * 0.5}s ease` }}
                        >
                            <div className={styles.breathInner}>
                                <span className={styles.breathPhaseLabel}>{phase}</span>
                                <span className={styles.breathTimer}>{timeLeft}</span>
                                <span className={styles.breathTimerUnit}>sec</span>
                            </div>
                        </div>
                    </div>

                    {/* Progress arc / step strip */}
                    <div className={styles.breathSteps}>
                        {pattern.steps.map((s, i) => (
                            <div key={s.phase} className={[styles.stepPill, i === stepIdx ? styles.stepPillActive : ''].join(' ')}>
                                <span className={styles.stepLabel}>{s.phase}</span>
                                <span className={styles.stepDur}>{s.dur}s</span>
                            </div>
                        ))}
                    </div>

                    <p className={styles.breathSub}>Breath {cycle + 1} of {pattern.maxCycles}</p>
                    <button className={styles.closeBtn} onClick={stopBreathing}>End Session</button>
                </div>
            )}
        </div>
    );
}
