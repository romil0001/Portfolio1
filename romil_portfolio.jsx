import { useState, useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import { ExternalLink, Github, Linkedin, Mail, MapPin, FileText, ChevronDown, Cpu, Eye, Wifi, Zap, Bot, BrainCircuit, Cog, Send, Menu, X, SlidersHorizontal, Crosshair, Activity } from "lucide-react";

const ACCENT = "#00e5ff";
const ACCENT2 = "#ff3d00";
const ACCENT3 = "#7c4dff";
const BG = "#040404";
const SURFACE = "#0a0a0a";
const BORDER = "#161616";

const PROJECTS = [
  { title: "Rombotics Q8", sub: "Self-Balancing Quadruped Robot", desc: "Open-source sub-£250 quadruped with per-axis PID tuning, PWM-space IK approximation, complementary filter sensor fusion. ESP32-based with MG996R servos & MPU6050 IMU.", tags: ["ESP32","PID","IMU","C++","3D Print"], icon: Bot, color: ACCENT, link: "https://github.com/romil0001/rombotics-q8" },
  { title: "Smart Glasses", sub: "Gesture-Activated AR System", desc: "YOLOv8 with TensorRT INT8 quantisation achieving 99.5% detection accuracy on Raspberry Pi + ESP32. Highest-marked project in cohort.", tags: ["YOLOv8","TensorRT","RPi","ESP32"], icon: Eye, color: ACCENT2 },
  { title: "Autonomous Driving", sub: "YOLO Perception Pipeline", desc: "Real-time autonomous driving perception at 28 FPS on NVIDIA Jetson Nano with multi-class detection and depth estimation.", tags: ["YOLO","Jetson Nano","Python","CV"], icon: Zap, color: ACCENT3 },
  { title: "PLC Automation", sub: "Siemens S7-1200 Fries System", desc: "Fully automated PLC cooking system with zero logic errors on first trial. Ladder logic, HMI, safety interlocks.", tags: ["Siemens","PLC","SCADA","HMI"], icon: Cog, color: "#00e676" },
  { title: "IoT Health Monitor", sub: "Cloud-Connected Wearable", desc: "ESP32-based health monitoring with MQTT protocol, AWS IoT Core, and real-time biometric dashboarding.", tags: ["ESP32","MQTT","AWS","IoT"], icon: Cpu, color: "#ff9100" },
  { title: "Smart Home Security", sub: "AI-Powered Surveillance", desc: "RPi + YOLO security system with 8-channel notifications: Telegram, Discord, Gmail, Slack, IFTTT, Ntfy.sh, Matrix, WhatsApp.", tags: ["YOLO","RPi","Python","Alerts"], icon: Wifi, color: "#e040fb" },
  { title: "rombotics.com", sub: "Full-Stack SaaS Platform", desc: "Netlify + Cloudflare Workers with Neon PostgreSQL, Stripe payments, 3D print ordering, admin dashboard, token auth.", tags: ["React","Cloudflare","Stripe","PostgreSQL"], icon: ExternalLink, color: "#69f0ae", link: "https://rombotics.com" },
];

const EXPERIENCE = [
  { role: "Robotics Wrangler", company: "HCL (via Dabster Systems)", period: "2026 — Contract", desc: "Robotics lab operations, system wrangling, and testing for enterprise automation.", color: ACCENT },
  { role: "PLC & SCADA Engineer", company: "Zebra EM", period: "2025", desc: "Programmed Siemens PLCs, designed SCADA interfaces, commissioned automated systems.", color: ACCENT2 },
  { role: "Energy Adviser", company: "Scottish Power", period: "2024", desc: "Technical assessment of heating/insulation systems for residential customers.", color: ACCENT3 },
  { role: "Shift Manager", company: "Capital Arches Group (McDonald's)", period: "2021 — Present", desc: "Managing teams of 30+, P&L accountability, operational excellence.", color: "#00e676" },
];

const SKILLS = [
  { name: "ESP32 / Arduino", pct: 95 }, { name: "Python", pct: 92 }, { name: "C / C++", pct: 88 },
  { name: "PLC (Siemens S7)", pct: 85 }, { name: "Computer Vision", pct: 90 }, { name: "ROS2", pct: 78 },
  { name: "PID / Control", pct: 92 }, { name: "3D Printing", pct: 88 }, { name: "SCADA / HMI", pct: 82 },
  { name: "React / JS", pct: 80 }, { name: "MQTT / IoT", pct: 87 }, { name: "Sensor Fusion", pct: 90 },
];

const STATS = [
  { label: "Projects Built", value: 12 }, { label: "GitHub Repos", value: 8 },
  { label: "IEEE Member", value: 1, suffix: "y" }, { label: "Servos Tuned", value: 96 },
];

function GlitchText({ text }) {
  return (
    <h1 className="glitch-text" data-text={text}>{text}
      <span className="glitch-copy glitch-1" aria-hidden="true">{text}</span>
      <span className="glitch-copy glitch-2" aria-hidden="true">{text}</span>
    </h1>
  );
}

function Typewriter({ texts, speed = 60, pause = 2000 }) {
  const [display, setDisplay] = useState("");
  const [idx, setIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const current = texts[idx % texts.length];
    if (!deleting && charIdx === current.length) { setTimeout(() => setDeleting(true), pause); return; }
    if (deleting && charIdx === 0) { setDeleting(false); setIdx(i => i + 1); return; }
    const timer = setTimeout(() => {
      setCharIdx(c => deleting ? c - 1 : c + 1);
      setDisplay(current.substring(0, deleting ? charIdx - 1 : charIdx + 1));
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(timer);
  }, [charIdx, deleting, idx, texts, speed, pause]);
  return <span>{display}<span className="cursor">|</span></span>;
}

function Counter({ end, duration = 2000, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null); const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true; const start = performance.now();
        const a = (now) => { const p = Math.min((now - start) / duration, 1); setCount(Math.floor((1 - Math.pow(1 - p, 3)) * end)); if (p < 1) requestAnimationFrame(a); };
        requestAnimationFrame(a);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current); return () => obs.disconnect();
  }, [end, duration]);
  return <span ref={ref}>{suffix === "y" ? "\u2713" : count}</span>;
}

function Reveal({ children, direction = "up", delay = 0, className = "", style = {} }) {
  const ref = useRef(null); const [vis, setVis] = useState(false);
  useEffect(() => { const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.08 }); if (ref.current) obs.observe(ref.current); return () => obs.disconnect(); }, []);
  const t = { up: "translateY(60px)", down: "translateY(-60px)", left: "translateX(80px)", right: "translateX(-80px)", scale: "scale(0.85)" };
  return <div ref={ref} className={className} style={{ ...style, opacity: vis ? 1 : 0, transform: vis ? "none" : t[direction], transition: `all 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s` }}>{children}</div>;
}

function HeroScene() {
  const mountRef = useRef(null);
  useEffect(() => {
    if (!mountRef.current) return;
    const w = mountRef.current.clientWidth, h = mountRef.current.clientHeight;
    const scene = new THREE.Scene(); const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 1000); camera.position.z = 4;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); renderer.setSize(w, h); renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);
    const mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(1.8, 1), new THREE.MeshBasicMaterial({ color: ACCENT, wireframe: true, transparent: true, opacity: 0.3 }));
    const mesh2 = new THREE.Mesh(new THREE.IcosahedronGeometry(1.2, 0), new THREE.MeshBasicMaterial({ color: ACCENT2, wireframe: true, transparent: true, opacity: 0.18 }));
    scene.add(mesh, mesh2);
    const pGeo = new THREE.BufferGeometry(); const pos = new Float32Array(500 * 3);
    for (let i = 0; i < 1500; i++) pos[i] = (Math.random() - 0.5) * 12;
    pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({ color: ACCENT, size: 0.02, transparent: true, opacity: 0.5 })));
    let mx = 0, my = 0;
    const onM = e => { mx = (e.clientX / w - 0.5) * 2; my = (e.clientY / h - 0.5) * 2; };
    window.addEventListener("mousemove", onM);
    let fid;
    const anim = () => { fid = requestAnimationFrame(anim); mesh.rotation.x += 0.003; mesh.rotation.y += 0.005; mesh2.rotation.x -= 0.004; mesh2.rotation.y -= 0.003; camera.position.x += (mx * 0.5 - camera.position.x) * 0.03; camera.position.y += (-my * 0.5 - camera.position.y) * 0.03; camera.lookAt(scene.position); renderer.render(scene, camera); };
    anim();
    const onR = () => { if (!mountRef.current) return; const nw = mountRef.current.clientWidth; const nh = mountRef.current.clientHeight; camera.aspect = nw / nh; camera.updateProjectionMatrix(); renderer.setSize(nw, nh); };
    window.addEventListener("resize", onR);
    return () => { cancelAnimationFrame(fid); window.removeEventListener("mousemove", onM); window.removeEventListener("resize", onR); renderer.dispose(); if (mountRef.current?.contains(renderer.domElement)) mountRef.current.removeChild(renderer.domElement); };
  }, []);
  return <div ref={mountRef} style={{ position: "absolute", inset: 0, zIndex: 0 }} />;
}

/* ══════════════════════════════════════════
   LAB 1: PID CONTROLLER SIMULATOR
   ══════════════════════════════════════════ */
function PIDSimulator() {
  const [kp, setKp] = useState(2.0);
  const [ki, setKi] = useState(0.5);
  const [kd, setKd] = useState(0.8);
  const canvasRef = useRef(null);

  const simulate = useCallback(() => {
    const dt = 0.01, setpoint = 1.0, mass = 1.0, damping = 0.5, stiffness = 0.2;
    let x = 0, v = 0, integral = 0, prevError = 0;
    const points = [];
    for (let t = 0; t <= 6; t += dt) {
      const error = setpoint - x; integral = Math.max(-10, Math.min(10, integral + error * dt));
      const derivative = (error - prevError) / dt;
      const F = kp * error + ki * integral + kd * derivative;
      v += ((F - damping * v - stiffness * x) / mass) * dt; x += v * dt; prevError = error;
      if (Math.round(t * 100) % 2 === 0) points.push({ t: Math.round(t * 100) / 100, x });
    }
    return points;
  }, [kp, ki, kd]);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const data = simulate();
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth; const H = canvas.offsetHeight;
    canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr);
    const pad = { t: 20, r: 16, b: 28, l: 38 };
    const pw = W - pad.l - pad.r, ph = H - pad.t - pad.b;
    const yMin = -0.3, yMax = 2.0;
    ctx.clearRect(0, 0, W, H);

    ctx.strokeStyle = "#1a1a1a"; ctx.lineWidth = 0.5;
    for (let i = 0; i <= 5; i++) { const y = pad.t + (ph / 5) * i; ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(pad.l + pw, y); ctx.stroke(); }
    for (let i = 0; i <= 6; i++) { const x = pad.l + (pw / 6) * i; ctx.beginPath(); ctx.moveTo(x, pad.t); ctx.lineTo(x, pad.t + ph); ctx.stroke(); }

    ctx.fillStyle = "#444"; ctx.font = "9px monospace"; ctx.textAlign = "right";
    for (let i = 0; i <= 5; i++) { ctx.fillText((yMax - (yMax - yMin) * (i / 5)).toFixed(1), pad.l - 4, pad.t + (ph / 5) * i + 3); }
    ctx.textAlign = "center";
    for (let i = 0; i <= 6; i++) ctx.fillText(i + "s", pad.l + (pw / 6) * i, pad.t + ph + 14);

    const spY = pad.t + ph * (1 - (1.0 - yMin) / (yMax - yMin));
    ctx.strokeStyle = ACCENT + "35"; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(pad.l, spY); ctx.lineTo(pad.l + pw, spY); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = ACCENT + "60"; ctx.font = "8px monospace"; ctx.textAlign = "left"; ctx.fillText("SETPOINT", pad.l + pw - 52, spY - 5);

    // Glow
    ctx.strokeStyle = ACCENT + "20"; ctx.lineWidth = 8; ctx.beginPath();
    data.forEach((p, i) => { const px = pad.l + (p.t / 6) * pw; const py = pad.t + ph * (1 - (p.x - yMin) / (yMax - yMin)); i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py); });
    ctx.stroke();

    // Line
    ctx.strokeStyle = ACCENT; ctx.lineWidth = 2; ctx.beginPath();
    data.forEach((p, i) => { const px = pad.l + (p.t / 6) * pw; const py = pad.t + ph * (1 - (p.x - yMin) / (yMax - yMin)); i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py); });
    ctx.stroke();

    // Metrics box
    const maxVal = Math.max(...data.map(d => d.x));
    const overshoot = Math.max(0, ((maxVal - 1) / 1) * 100);
    const settled = data.findIndex((d, i) => i > 50 && data.slice(i, Math.min(i + 100, data.length)).every(p => Math.abs(p.x - 1) < 0.02));
    const riseIdx = data.findIndex(d => d.x >= 0.9);

    ctx.fillStyle = "#0c0c0c"; ctx.strokeStyle = "#222"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect(pad.l + 4, pad.t + 4, 136, 50, 4); ctx.fill(); ctx.stroke();
    ctx.font = "8px monospace"; ctx.textAlign = "left";
    const metrics = [
      ["Overshoot:", overshoot.toFixed(1) + "%", overshoot > 20 ? ACCENT2 : ACCENT],
      ["Rise Time:", riseIdx > 0 ? data[riseIdx].t.toFixed(2) + "s" : ">6s", ACCENT],
      ["Settle:", settled > 0 ? data[settled].t.toFixed(2) + "s" : ">6s", ACCENT],
    ];
    metrics.forEach(([label, val, c], i) => {
      ctx.fillStyle = "#666"; ctx.fillText(label, pad.l + 10, pad.t + 17 + i * 13);
      ctx.fillStyle = c; ctx.fillText(val, pad.l + 82, pad.t + 17 + i * 13);
    });
  }, [simulate]);

  const Slider = ({ label, value, set, min, max, step, color }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
      <span style={{ fontFamily: "monospace", fontSize: 11, color: "#777", width: 22 }}>{label}</span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => set(+e.target.value)} style={{ flex: 1, accentColor: color, height: 3, cursor: "pointer" }} />
      <span style={{ fontFamily: "monospace", fontSize: 12, color, width: 36, textAlign: "right" }}>{value.toFixed(1)}</span>
    </div>
  );

  return (
    <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 24, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT3})` }} />
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: ACCENT + "12", display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${ACCENT}25` }}>
          <SlidersHorizontal size={18} color={ACCENT} />
        </div>
        <div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15 }}>PID Controller Simulator</div>
          <div style={{ fontFamily: "monospace", fontSize: 10, color: ACCENT, letterSpacing: 1 }}>REAL-TIME STEP RESPONSE</div>
        </div>
      </div>
      <canvas ref={canvasRef} style={{ width: "100%", height: 200, borderRadius: 8, background: "#060606", border: `1px solid ${BORDER}`, marginBottom: 14, display: "block" }} />
      <Slider label="Kp" value={kp} set={setKp} min={0} max={10} step={0.1} color={ACCENT} />
      <Slider label="Ki" value={ki} set={setKi} min={0} max={5} step={0.1} color="#00e676" />
      <Slider label="Kd" value={kd} set={setKd} min={0} max={5} step={0.1} color={ACCENT3} />
      <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
        {[["UNDERDAMPED", 2.0, 0.5, 0.8], ["CRITICAL", 4.0, 0.2, 3.0], ["OVERDAMPED", 0.8, 0.1, 4.0]].map(([name, p, i, d]) => (
          <button key={name} onClick={() => { setKp(p); setKi(i); setKd(d); }} style={{ flex: 1, padding: 7, borderRadius: 5, border: `1px solid ${BORDER}`, background: "#111", color: "#777", fontFamily: "monospace", fontSize: 9, cursor: "pointer", transition: "all 0.3s" }}
            onMouseOver={e => { e.currentTarget.style.borderColor = ACCENT + "50"; e.currentTarget.style.color = ACCENT; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = "#777"; }}>{name}</button>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   LAB 2: INVERSE KINEMATICS PLAYGROUND
   ══════════════════════════════════════════ */
function IKPlayground() {
  const canvasRef = useRef(null);
  const [target, setTarget] = useState({ x: 120, y: 110 });
  const L1 = 80, L2 = 65, originX = 160, originY = 40;

  const solve = (tx, ty) => {
    const dx = tx - originX, dy = ty - originY, dist = Math.sqrt(dx * dx + dy * dy);
    const reachable = dist <= L1 + L2 && dist >= Math.abs(L1 - L2);
    if (!reachable) return { q1: 0, q2: 0, reachable: false };
    const cosQ2 = (dx * dx + dy * dy - L1 * L1 - L2 * L2) / (2 * L1 * L2);
    const q2 = Math.acos(Math.max(-1, Math.min(1, cosQ2)));
    const q1 = Math.atan2(dy, dx) - Math.atan2(L2 * Math.sin(q2), L1 + L2 * Math.cos(q2));
    return { q1, q2, reachable: true };
  };

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const { q1, q2, reachable } = solve(target.x, target.y);
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth, H = canvas.offsetHeight;
    canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = "#0e0e0e"; ctx.lineWidth = 0.5;
    for (let x = 0; x < W; x += 20) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 20) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    // Workspace boundary
    ctx.strokeStyle = ACCENT + "10"; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.arc(originX, originY, L1 + L2, 0, Math.PI * 2); ctx.stroke();
    ctx.setLineDash([]);

    if (reachable) {
      const j1x = originX + L1 * Math.cos(q1), j1y = originY + L1 * Math.sin(q1);
      const j2x = j1x + L2 * Math.cos(q1 + q2), j2y = j1y + L2 * Math.sin(q1 + q2);

      // Glow
      ctx.strokeStyle = ACCENT + "15"; ctx.lineWidth = 14; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(originX, originY); ctx.lineTo(j1x, j1y); ctx.stroke();
      ctx.strokeStyle = ACCENT3 + "15";
      ctx.beginPath(); ctx.moveTo(j1x, j1y); ctx.lineTo(j2x, j2y); ctx.stroke();

      // Links
      ctx.strokeStyle = ACCENT; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(originX, originY); ctx.lineTo(j1x, j1y); ctx.stroke();
      ctx.strokeStyle = ACCENT3; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(j1x, j1y); ctx.lineTo(j2x, j2y); ctx.stroke();

      // Joints
      [[originX, originY, 7, "#fff"], [j1x, j1y, 5, ACCENT], [j2x, j2y, 4, ACCENT3]].forEach(([x, y, r, c]) => {
        ctx.fillStyle = c + "25"; ctx.beginPath(); ctx.arc(x, y, r + 4, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
      });

      // Angle arcs
      ctx.strokeStyle = ACCENT + "40"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(originX, originY, 18, 0, q1); ctx.stroke();
      ctx.strokeStyle = ACCENT3 + "40";
      ctx.beginPath(); ctx.arc(j1x, j1y, 14, q1, q1 + q2); ctx.stroke();
    }

    // Target crosshair
    const tc = reachable ? ACCENT2 : "#ff0000";
    ctx.strokeStyle = tc; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(target.x - 8, target.y); ctx.lineTo(target.x + 8, target.y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(target.x, target.y - 8); ctx.lineTo(target.x, target.y + 8); ctx.stroke();
    ctx.beginPath(); ctx.arc(target.x, target.y, 8, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = tc + "25"; ctx.beginPath(); ctx.arc(target.x, target.y, 14, 0, Math.PI * 2); ctx.stroke();
  }, [target]);

  const handleMouse = (e) => { const r = canvasRef.current.getBoundingClientRect(); setTarget({ x: e.clientX - r.left, y: e.clientY - r.top }); };
  const { q1, q2, reachable } = solve(target.x, target.y);

  return (
    <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 24, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${ACCENT3}, ${ACCENT2})` }} />
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: ACCENT3 + "12", display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${ACCENT3}25` }}>
          <Crosshair size={18} color={ACCENT3} />
        </div>
        <div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15 }}>2-DOF Inverse Kinematics</div>
          <div style={{ fontFamily: "monospace", fontSize: 10, color: ACCENT3, letterSpacing: 1 }}>CLICK / DRAG TO MOVE TARGET</div>
        </div>
      </div>
      <canvas ref={canvasRef} onClick={handleMouse} onMouseMove={(e) => { if (e.buttons === 1) handleMouse(e); }}
        style={{ width: "100%", height: 200, borderRadius: 8, background: "#060606", border: `1px solid ${BORDER}`, cursor: "crosshair", marginBottom: 10, display: "block" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
        {[
          ["\u03B8\u2081 SHOULDER", reachable ? (q1 * 180 / Math.PI).toFixed(1) + "\u00B0" : "\u2014", ACCENT],
          ["\u03B8\u2082 ELBOW", reachable ? (q2 * 180 / Math.PI).toFixed(1) + "\u00B0" : "\u2014", ACCENT3],
          ["STATUS", reachable ? "REACHABLE" : "OUT OF RANGE", reachable ? "#00e676" : ACCENT2],
        ].map(([label, val, c]) => (
          <div key={label} style={{ padding: 8, borderRadius: 5, background: "#0d0d0d", border: `1px solid ${BORDER}`, textAlign: "center" }}>
            <div style={{ fontFamily: "monospace", fontSize: 8, color: "#555", marginBottom: 2 }}>{label}</div>
            <div style={{ fontFamily: "monospace", fontSize: 13, color: c, fontWeight: 600 }}>{val}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   LAB 3: COMPLEMENTARY FILTER SENSOR FUSION
   ══════════════════════════════════════════ */
function SensorFusion() {
  const canvasRef = useRef(null);
  const [alpha, setAlpha] = useState(0.96);
  const dataRef = useRef({ accel: [], gyro: [], fused: [], truth: [] });

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    let animId, t = 0;
    dataRef.current = { accel: [], gyro: [], fused: [], truth: [] };

    const run = () => {
      animId = requestAnimationFrame(run);
      t += 0.03;
      const truth = 30 * Math.sin(t * 0.5) + 15 * Math.sin(t * 0.8);
      const accel = truth + (Math.random() - 0.5) * 18;
      const gyroDrift = truth + t * 1.2 + (Math.random() - 0.5) * 2;
      const d = dataRef.current;
      const prev = d.fused.length > 0 ? d.fused[d.fused.length - 1] : truth;
      const prevGyro = d.gyro.length > 0 ? d.gyro[d.gyro.length - 1] : gyroDrift;
      const fused = alpha * (prev + (gyroDrift - prevGyro)) + (1 - alpha) * accel;

      d.truth.push(truth); d.accel.push(accel); d.gyro.push(gyroDrift); d.fused.push(fused);
      const maxPts = 280;
      if (d.truth.length > maxPts) { d.truth.shift(); d.accel.shift(); d.gyro.shift(); d.fused.shift(); }

      const ctx = canvas.getContext("2d");
      const dpr = window.devicePixelRatio || 1;
      const W = canvas.offsetWidth, H = canvas.offsetHeight;
      canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, W, H);

      const pad = { t: 10, r: 8, b: 8, l: 8 };
      const pw = W - pad.l - pad.r, ph = H - pad.t - pad.b;
      const yMin = -60, yMax = 100;

      const drawLine = (arr, color, width, dash = []) => {
        if (arr.length < 2) return;
        ctx.strokeStyle = color; ctx.lineWidth = width; ctx.setLineDash(dash); ctx.beginPath();
        arr.forEach((v, i) => { const px = pad.l + (i / (maxPts - 1)) * pw; const py = pad.t + ph * (1 - (v - yMin) / (yMax - yMin)); i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py); });
        ctx.stroke(); ctx.setLineDash([]);
      };

      drawLine(d.accel, "#ff6b6b30", 1);
      drawLine(d.gyro, "#ffd93d30", 1);
      drawLine(d.truth, "#ffffff18", 1, [3, 3]);
      drawLine(d.fused, ACCENT + "20", 7);
      drawLine(d.fused, ACCENT, 2);

      ctx.font = "8px monospace";
      [["FUSED", ACCENT], ["ACCEL", "#ff6b6b60"], ["GYRO", "#ffd93d60"], ["TRUE", "#ffffff40"]].forEach(([l, c], i) => {
        ctx.fillStyle = c; ctx.fillRect(pad.l + 6 + i * 80, pad.t + 4, 8, 2); ctx.fillText(l, pad.l + 18 + i * 80, pad.t + 8);
      });
    };
    run();
    return () => cancelAnimationFrame(animId);
  }, [alpha]);

  return (
    <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 24, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, #ff6b6b, ${ACCENT}, #ffd93d)` }} />
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: "#ff6b6b12", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #ff6b6b25" }}>
          <Activity size={18} color="#ff6b6b" />
        </div>
        <div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15 }}>Complementary Filter</div>
          <div style={{ fontFamily: "monospace", fontSize: 10, color: "#ff6b6b", letterSpacing: 1 }}>LIVE SENSOR FUSION — IMU DATA</div>
        </div>
      </div>
      <canvas ref={canvasRef} style={{ width: "100%", height: 170, borderRadius: 8, background: "#060606", border: `1px solid ${BORDER}`, marginBottom: 10, display: "block" }} />
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontFamily: "monospace", fontSize: 11, color: "#777" }}>\u03B1</span>
        <input type="range" min={0.5} max={0.99} step={0.01} value={alpha} onChange={e => setAlpha(+e.target.value)} style={{ flex: 1, accentColor: ACCENT, height: 3, cursor: "pointer" }} />
        <span style={{ fontFamily: "monospace", fontSize: 12, color: ACCENT, width: 36, textAlign: "right" }}>{alpha.toFixed(2)}</span>
      </div>
      <div style={{ fontFamily: "monospace", fontSize: 8, color: "#444", marginTop: 6, textAlign: "center" }}>
        \u03B1 \u2192 1.0 = trust gyro (smooth but drifts) &nbsp;|&nbsp; \u03B1 \u2192 0.5 = trust accel (noisy but stable)
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════ */
function ProjectCard({ project, index }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 }); const [hover, setHover] = useState(false); const ref = useRef(null);
  const hM = (e) => { if (!ref.current) return; const r = ref.current.getBoundingClientRect(); setTilt({ x: ((e.clientY - r.top) / r.height - 0.5) * -18, y: ((e.clientX - r.left) / r.width - 0.5) * 18 }); };
  const Icon = project.icon;
  return (
    <Reveal direction="up" delay={index * 0.06}>
      <div ref={ref} className="project-card" onMouseMove={hM} onMouseEnter={() => setHover(true)} onMouseLeave={() => { setHover(false); setTilt({ x: 0, y: 0 }); }}
        style={{ transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ${hover ? "scale(1.02)" : ""}`, borderColor: hover ? project.color + "40" : BORDER }}>
        <div className="card-glow" style={{ background: `radial-gradient(circle at 50% 0%, ${project.color}0c 0%, transparent 70%)`, opacity: hover ? 1 : 0 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, position: "relative" }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: project.color + "12", display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${project.color}20` }}><Icon size={17} color={project.color} /></div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "'Syne', sans-serif" }}>{project.title}</div>
            <div style={{ fontSize: 10, color: project.color, fontFamily: "monospace" }}>{project.sub}</div>
          </div>
        </div>
        <p style={{ fontSize: 12, lineHeight: 1.6, color: "#777", margin: "0 0 12px", position: "relative" }}>{project.desc}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, position: "relative" }}>
          {project.tags.map(t => <span key={t} style={{ fontSize: 9, padding: "2px 6px", borderRadius: 3, background: project.color + "0c", color: project.color, border: `1px solid ${project.color}15`, fontFamily: "monospace" }}>{t}</span>)}
        </div>
        {project.link && <a href={project.link} target="_blank" rel="noopener noreferrer" style={{ position: "absolute", top: 14, right: 14, color: "#333" }}><ExternalLink size={12} /></a>}
      </div>
    </Reveal>
  );
}

function SkillBar({ name, pct, delay }) {
  const ref = useRef(null); const [vis, setVis] = useState(false);
  useEffect(() => { const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.3 }); if (ref.current) obs.observe(ref.current); return () => obs.disconnect(); }, []);
  const hue = (pct / 100) * 160;
  return (
    <div ref={ref} style={{ marginBottom: 9 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
        <span style={{ fontSize: 11, color: "#aaa", fontFamily: "monospace" }}>{name}</span>
        <span style={{ fontSize: 10, color: `hsl(${hue},90%,60%)`, fontFamily: "monospace" }}>{pct}%</span>
      </div>
      <div style={{ height: 3, background: "#1a1a1a", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 2, width: vis ? `${pct}%` : "0%", background: `linear-gradient(90deg, hsl(${hue},90%,40%), hsl(${hue},90%,60%))`, transition: `width 1.2s cubic-bezier(0.16,1,0.3,1) ${delay}s` }} />
      </div>
    </div>
  );
}

/* ═══════════ MAIN ═══════════ */
export default function Portfolio() {
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const sections = ["hero", "about", "projects", "labs", "skills", "publications", "experience", "contact"];
  useEffect(() => { const fn = () => setScrolled(window.scrollY > 80); window.addEventListener("scroll", fn); return () => window.removeEventListener("scroll", fn); }, []);
  const scrollTo = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setNavOpen(false); };

  return (
    <div style={{ background: BG, color: "#f0f0f0", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600;700&family=Fira+Code:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0} html{scroll-behavior:smooth}
        ::-webkit-scrollbar{width:5px} ::-webkit-scrollbar-track{background:${BG}} ::-webkit-scrollbar-thumb{background:${ACCENT}40;border-radius:3px}
        .glitch-text{position:relative;display:inline-block;font-family:'Syne',sans-serif;font-size:clamp(48px,8vw,88px);font-weight:800;letter-spacing:-2px;line-height:1}
        .glitch-copy{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none}
        .glitch-1{color:${ACCENT};animation:g1 3s infinite linear alternate-reverse;clip-path:inset(0 0 65% 0)}
        .glitch-2{color:${ACCENT2};animation:g2 2.5s infinite linear alternate-reverse;clip-path:inset(65% 0 0 0)}
        @keyframes g1{0%,90%{transform:translate(0)}92%{transform:translate(-3px,1px)}94%{transform:translate(3px,-1px)}96%{transform:translate(-2px,2px)}100%{transform:translate(0)}}
        @keyframes g2{0%,88%{transform:translate(0)}90%{transform:translate(3px,-2px)}93%{transform:translate(-3px,1px)}100%{transform:translate(0)}}
        .cursor{animation:blink 1s step-end infinite;color:${ACCENT}} @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        .scanline{position:fixed;inset:0;pointer-events:none;z-index:9999;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,229,255,0.012) 2px,rgba(0,229,255,0.012) 4px)}
        .project-card{position:relative;padding:20px;border-radius:14px;background:${SURFACE};border:1px solid ${BORDER};cursor:default;overflow:hidden;transition:transform 0.15s,border-color 0.4s;will-change:transform}
        .card-glow{position:absolute;inset:0;transition:opacity 0.4s;pointer-events:none}
        .grid-bg{background-image:linear-gradient(rgba(0,229,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,255,0.02) 1px,transparent 1px);background-size:60px 60px}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        @keyframes pulse-ring{0%{transform:scale(1);opacity:0.4}100%{transform:scale(1.8);opacity:0}}
        .pulse-ring{position:absolute;border-radius:50%;animation:pulse-ring 2.5s ease-out infinite}
        .nav-link{font-size:11px;color:#555;cursor:pointer;text-transform:uppercase;letter-spacing:2px;font-family:monospace;transition:color 0.3s;background:none;border:none;padding:8px 0}
        .nav-link:hover{color:${ACCENT}}
        .section-tag{font-family:monospace;font-size:11px;color:${ACCENT};letter-spacing:3px;text-transform:uppercase;margin-bottom:8px}
        .section-title{font-family:'Syne',sans-serif;font-size:clamp(24px,4vw,38px);font-weight:800;line-height:1.15;margin-bottom:22px}
        .timeline-line{position:absolute;left:19px;top:0;bottom:0;width:2px;background:linear-gradient(180deg,${ACCENT}40,${ACCENT2}40,${ACCENT3}40)}
        .timeline-dot{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;position:relative;z-index:1}
        .hero-gradient{position:absolute;width:500px;height:500px;border-radius:50%;filter:blur(120px);opacity:0.1}
        @keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}} .marquee-track{display:flex;animation:marquee 30s linear infinite;width:max-content}
        .mag-btn{position:relative;display:inline-flex;align-items:center;gap:8px;padding:12px 26px;border:1px solid ${ACCENT}50;border-radius:8px;background:transparent;color:${ACCENT};font-family:monospace;font-size:12px;cursor:pointer;overflow:hidden;transition:all 0.4s;text-decoration:none}
        .mag-btn::before{content:'';position:absolute;inset:0;background:${ACCENT};transform:translateY(100%);transition:transform 0.4s cubic-bezier(0.16,1,0.3,1)}
        .mag-btn:hover::before{transform:translateY(0)} .mag-btn:hover{color:${BG};border-color:${ACCENT}} .mag-btn>*{position:relative;z-index:1}
        @media(max-width:768px){.project-grid,.labs-grid,.skills-grid{grid-template-columns:1fr!important}.hero-content{padding:0 20px!important}.sp{padding:80px 20px!important}.stats-grid{grid-template-columns:repeat(2,1fr)!important}.nav-desktop{display:none!important}.labs-full{grid-column:auto!important}}
        @media(min-width:769px){.nav-mobile-btn{display:none!important}.nav-mobile-menu{display:none!important}}
      `}</style>
      <div className="scanline" />

      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "14px 40px", background: scrolled ? BG + "e6" : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: scrolled ? `1px solid ${BORDER}` : "1px solid transparent", transition: "all 0.4s", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, cursor: "pointer" }} onClick={() => scrollTo("hero")}><span style={{ color: ACCENT }}>R</span>OMIL<span style={{ color: ACCENT }}>.</span></div>
        <div className="nav-desktop" style={{ display: "flex", gap: 22, alignItems: "center" }}>
          {sections.slice(1).map(s => <button key={s} className="nav-link" onClick={() => scrollTo(s)}>{s === "labs" ? "\u26A1 LABS" : s}</button>)}
        </div>
        <button className="nav-mobile-btn" onClick={() => setNavOpen(!navOpen)} style={{ background: "none", border: "none", color: "#f0f0f0", cursor: "pointer" }}>{navOpen ? <X size={22} /> : <Menu size={22} />}</button>
      </nav>
      {navOpen && <div className="nav-mobile-menu" style={{ position: "fixed", inset: 0, zIndex: 99, background: BG + "f5", backdropFilter: "blur(30px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>{sections.slice(1).map(s => <button key={s} className="nav-link" onClick={() => scrollTo(s)} style={{ fontSize: 18 }}>{s}</button>)}</div>}

      {/* HERO */}
      <section id="hero" style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <HeroScene />
        <div className="hero-gradient" style={{ top: "-20%", left: "-10%", background: ACCENT }} />
        <div className="hero-gradient" style={{ bottom: "-20%", right: "-10%", background: ACCENT2, animation: "float 7s ease-in-out 1s infinite" }} />
        <div className="hero-content" style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 40px", maxWidth: 800 }}>
          <Reveal direction="up" delay={0.2}><div style={{ fontFamily: "monospace", fontSize: 12, color: ACCENT, letterSpacing: 4, marginBottom: 20 }}>// MECHATRONICS & ROBOTICS ENGINEER</div></Reveal>
          <Reveal direction="up" delay={0.4}><GlitchText text="ROMIL MODI" /></Reveal>
          <Reveal direction="up" delay={0.6}><div style={{ fontSize: 16, color: "#777", marginTop: 16, marginBottom: 30, fontWeight: 300 }}><Typewriter texts={["Building intelligent machines", "PID-tuning quadruped robots", "Designing SCADA systems", "Training YOLO at 28 FPS", "Engineering the future"]} /></div></Reveal>
          <Reveal direction="up" delay={0.8}>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <a href="https://github.com/romilmodi" className="mag-btn" target="_blank" rel="noopener noreferrer"><Github size={15} /><span>GitHub</span></a>
              <a href="https://linkedin.com/in/romilmodi" className="mag-btn" target="_blank" rel="noopener noreferrer"><Linkedin size={15} /><span>LinkedIn</span></a>
              <a href="mailto:romil2002modi@gmail.com" className="mag-btn" target="_blank" rel="noopener noreferrer"><Mail size={15} /><span>Contact</span></a>
            </div>
          </Reveal>
          <Reveal direction="up" delay={1.0}><button onClick={() => scrollTo("about")} style={{ marginTop: 40, background: "none", border: "none", color: "#444", cursor: "pointer", animation: "float 2s ease-in-out infinite" }}><ChevronDown size={24} /></button></Reveal>
        </div>
      </section>

      {/* MARQUEE */}
      <div style={{ borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, padding: "11px 0", overflow: "hidden" }}>
        <div className="marquee-track">
          {[...Array(2)].map((_, i) => <div key={i} style={{ display: "flex", gap: 34, paddingRight: 34 }}>
            {["ESP32","PLC","SCADA","ROS2","YOLO","PID","SENSOR FUSION","IoT","MQTT","PYTHON","C++","3D PRINTING","CV","JETSON","REACT"].map(t => <span key={t+i} style={{ fontFamily: "monospace", fontSize: 10, color: "#333", letterSpacing: 2, whiteSpace: "nowrap" }}>{t} <span style={{ color: ACCENT, margin: "0 2px" }}>\u25C6</span></span>)}
          </div>)}
        </div>
      </div>

      {/* ABOUT */}
      <section id="about" className="sp grid-bg" style={{ padding: "100px 40px", maxWidth: 1200, margin: "0 auto" }}>
        <Reveal direction="right"><div className="section-tag">// 001 \u2014 ABOUT</div></Reveal>
        <Reveal direction="up" delay={0.1}><h2 className="section-title">Engineering the<br /><span style={{ color: ACCENT }}>physical</span> & <span style={{ color: ACCENT2 }}>digital</span></h2></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 50, alignItems: "start" }}>
          <Reveal direction="left" delay={0.2}><div>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: "#999", marginBottom: 16 }}>MEng Mechatronics & Robotics graduate (Distinction) from Anglia Ruskin University. I build systems bridging software intelligence and physical actuation \u2014 PID-tuned quadrupeds to YOLO-powered perception.</p>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: "#999", marginBottom: 16 }}>Founder of <span style={{ color: ACCENT }}>Rombotics</span>. IEEE Graduate Student Member. London, UK.</p>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#555", fontSize: 12 }}><MapPin size={13} color={ACCENT} /> London, United Kingdom</div>
          </div></Reveal>
          <Reveal direction="right" delay={0.3}>
            <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
              {STATS.map((s, i) => <div key={i} style={{ padding: 18, borderRadius: 10, background: SURFACE, border: `1px solid ${BORDER}`, textAlign: "center" }}>
                <div style={{ fontSize: 30, fontWeight: 800, fontFamily: "'Syne', sans-serif", color: ACCENT }}><Counter end={s.value} suffix={s.suffix} /></div>
                <div style={{ fontSize: 9, color: "#555", fontFamily: "monospace", letterSpacing: 1 }}>{s.label}</div>
              </div>)}
            </div>
          </Reveal>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="sp" style={{ padding: "100px 40px", maxWidth: 1200, margin: "0 auto" }}>
        <Reveal direction="right"><div className="section-tag">// 002 \u2014 PROJECTS</div></Reveal>
        <Reveal direction="up" delay={0.1}><h2 className="section-title">What I've <span style={{ color: ACCENT2 }}>built</span></h2></Reveal>
        <div className="project-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))", gap: 16 }}>
          {PROJECTS.map((p, i) => <ProjectCard key={i} project={p} index={i} />)}
        </div>
      </section>

      {/* ═══ LIVE LABS ═══ */}
      <section id="labs" className="sp grid-bg" style={{ padding: "100px 40px", maxWidth: 1200, margin: "0 auto" }}>
        <Reveal direction="right"><div className="section-tag" style={{ color: ACCENT2 }}>// 003 \u2014 LIVE LABS \u26A1</div></Reveal>
        <Reveal direction="up" delay={0.1}>
          <h2 className="section-title">Interactive <span style={{ color: ACCENT2 }}>demos</span></h2>
          <p style={{ fontSize: 13, color: "#666", lineHeight: 1.7, marginBottom: 28, maxWidth: 550 }}>Don't just read about my work \u2014 interact with it. These live simulations run the same algorithms from my real projects.</p>
        </Reveal>
        <div className="labs-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          <Reveal direction="up" delay={0.15} className="labs-full" style={{ gridColumn: "1 / -1" }}><PIDSimulator /></Reveal>
          <Reveal direction="left" delay={0.25}><IKPlayground /></Reveal>
          <Reveal direction="right" delay={0.3}><SensorFusion /></Reveal>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="sp" style={{ padding: "100px 40px", maxWidth: 1200, margin: "0 auto" }}>
        <Reveal direction="right"><div className="section-tag">// 004 \u2014 SKILLS</div></Reveal>
        <Reveal direction="up" delay={0.1}><h2 className="section-title">Technical <span style={{ color: ACCENT3 }}>proficiency</span></h2></Reveal>
        <div className="skills-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px 34px" }}>
          {SKILLS.map((s, i) => <SkillBar key={i} name={s.name} pct={s.pct} delay={i * 0.04} />)}
        </div>
      </section>

      {/* PUBLICATIONS */}
      <section id="publications" className="sp grid-bg" style={{ padding: "100px 40px", maxWidth: 1200, margin: "0 auto" }}>
        <Reveal direction="right"><div className="section-tag">// 005 \u2014 PUBLICATIONS</div></Reveal>
        <Reveal direction="up" delay={0.1}><h2 className="section-title">Research & <span style={{ color: ACCENT }}>publication</span></h2></Reveal>
        <Reveal direction="up" delay={0.2}>
          <div style={{ padding: 26, borderRadius: 14, background: SURFACE, border: `1px solid ${BORDER}`, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT2}, ${ACCENT3})` }} />
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}><FileText size={15} color={ACCENT} /><span style={{ fontFamily: "monospace", fontSize: 10, color: ACCENT, letterSpacing: 2 }}>IEEE T-ASE \u2014 UNDER REVIEW</span></div>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 17, fontWeight: 700, lineHeight: 1.4, marginBottom: 8, color: "#ddd" }}>Low-Cost Self-Balancing Quadruped Robot with Axis-Tuned Embedded PID Control</h3>
            <p style={{ fontSize: 12, color: "#666", lineHeight: 1.7, marginBottom: 12 }}>T-ASE-2026-1502 \u2014 Impact Factor: 9.41. Novel sub-\u00A3250 open-source quadruped with per-axis PID, PWM-space tibia-coupling IK, complementary filter sensor fusion.</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["IEEE","Quadruped","PID","Sensor Fusion","Open-Source"].map(t => <span key={t} style={{ fontSize: 9, padding: "2px 8px", borderRadius: 3, background: ACCENT + "0c", color: ACCENT, border: `1px solid ${ACCENT}15`, fontFamily: "monospace" }}>{t}</span>)}
            </div>
          </div>
        </Reveal>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="sp" style={{ padding: "100px 40px", maxWidth: 1200, margin: "0 auto" }}>
        <Reveal direction="right"><div className="section-tag">// 006 \u2014 EXPERIENCE</div></Reveal>
        <Reveal direction="up" delay={0.1}><h2 className="section-title">Where I've <span style={{ color: ACCENT2 }}>worked</span></h2></Reveal>
        <div style={{ position: "relative", paddingLeft: 56 }}>
          <div className="timeline-line" />
          {EXPERIENCE.map((exp, i) => (
            <Reveal key={i} direction="left" delay={i * 0.1}>
              <div style={{ position: "relative", marginBottom: 32 }}>
                <div className="timeline-dot" style={{ background: exp.color + "10", border: `2px solid ${exp.color}30`, position: "absolute", left: -56 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: exp.color }} />
                  <div className="pulse-ring" style={{ width: 40, height: 40, borderColor: exp.color }} />
                </div>
                <div style={{ padding: 20, borderRadius: 10, background: SURFACE, border: `1px solid ${BORDER}` }}>
                  <div style={{ fontFamily: "monospace", fontSize: 10, color: exp.color, marginBottom: 4, letterSpacing: 1 }}>{exp.period}</div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 2 }}>{exp.role}</div>
                  <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>{exp.company}</div>
                  <p style={{ fontSize: 12, color: "#555", lineHeight: 1.5 }}>{exp.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* EDUCATION */}
      <Reveal direction="up"><div style={{ padding: "0 40px 50px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ padding: 24, borderRadius: 12, background: SURFACE, border: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
          <div>
            <div style={{ fontFamily: "monospace", fontSize: 10, color: ACCENT3, letterSpacing: 2, marginBottom: 4 }}>EDUCATION</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 2 }}>MEng Mechatronics & Robotics</div>
            <div style={{ fontSize: 12, color: "#666" }}>Anglia Ruskin University \u2014 May 2025</div>
          </div>
          <div style={{ padding: "7px 20px", borderRadius: 6, background: ACCENT3 + "10", border: `1px solid ${ACCENT3}20`, fontFamily: "'Syne', sans-serif", fontSize: 17, fontWeight: 800, color: ACCENT3 }}>Distinction</div>
        </div>
      </div></Reveal>

      {/* CONTACT */}
      <section id="contact" className="sp" style={{ padding: "100px 40px", maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
        <Reveal direction="up"><div className="section-tag">// 007 \u2014 CONTACT</div></Reveal>
        <Reveal direction="up" delay={0.1}><h2 className="section-title">Let's build <span style={{ color: ACCENT }}>something</span></h2></Reveal>
        <Reveal direction="up" delay={0.2}><p style={{ fontSize: 13, color: "#666", lineHeight: 1.7, marginBottom: 32 }}>Open to robotics, automation, control systems, and embedded engineering. London, UK \u2014 no sponsorship required.</p></Reveal>
        <Reveal direction="up" delay={0.3}>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="mailto:romil2002modi@gmail.com" className="mag-btn"><Mail size={14} /><span>romil2002modi@gmail.com</span></a>
            <a href="https://rombotics.com" className="mag-btn" target="_blank" rel="noopener noreferrer"><ExternalLink size={14} /><span>rombotics.com</span></a>
          </div>
        </Reveal>
        <Reveal direction="up" delay={0.4}>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 24 }}>
            {[["https://github.com/romilmodi", Github], ["https://linkedin.com/in/romilmodi", Linkedin], ["https://instagram.com/romil.modi.01", Send]].map(([h, I]) => (
              <a key={h} href={h} target="_blank" rel="noopener noreferrer" style={{ color: "#444", transition: "color 0.3s" }}
                onMouseOver={e => e.currentTarget.style.color = ACCENT} onMouseOut={e => e.currentTarget.style.color = "#444"}><I size={19} /></a>
            ))}
          </div>
        </Reveal>
      </section>

      <footer style={{ padding: "24px 40px", borderTop: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
        <div style={{ fontFamily: "monospace", fontSize: 10, color: "#2a2a2a" }}>\u00A9 2026 Romil Modi</div>
        <div style={{ fontFamily: "monospace", fontSize: 10, color: "#222" }}><span style={{ color: ACCENT }}>rombotics</span>.com</div>
      </footer>
    </div>
  );
}
