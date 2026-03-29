import { useState, useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import { ExternalLink, Github, Linkedin, Mail, MapPin, FileText, ChevronDown, Cpu, Eye, Wifi, Zap, Bot, BrainCircuit, Cog, Send, Menu, X } from "lucide-react";

const ACCENT = "#00e5ff";
const ACCENT2 = "#ff3d00";
const ACCENT3 = "#7c4dff";
const BG = "#040404";
const SURFACE = "#0a0a0a";
const BORDER = "#161616";

const PROJECTS = [
  { title: "Rombotics Q8", sub: "Self-Balancing Quadruped Robot", desc: "Open-source sub-£250 quadruped with per-axis PID tuning, PWM-space IK approximation, complementary filter sensor fusion, and loop jitter characterisation. ESP32-based with MG996R servos & MPU6050 IMU.", tags: ["ESP32","PID","IMU","C++","3D Print"], icon: Bot, color: ACCENT, link: "https://github.com/romil0001/rombotics-q8" },
  { title: "Smart Glasses", sub: "Gesture-Activated AR System", desc: "YOLOv8 with TensorRT INT8 quantisation achieving 99.5% detection accuracy on Raspberry Pi + ESP32. Highest-marked project in the cohort.", tags: ["YOLOv8","TensorRT","RPi","ESP32"], icon: Eye, color: ACCENT2, link: "#" },
  { title: "Autonomous Driving", sub: "YOLO Perception Pipeline", desc: "Real-time autonomous driving perception pipeline running at 28 FPS on NVIDIA Jetson Nano with multi-class object detection and depth estimation.", tags: ["YOLO","Jetson Nano","Python","CV"], icon: Zap, color: ACCENT3, link: "#" },
  { title: "PLC Automation", sub: "Siemens S7-1200 Fries System", desc: "Fully automated PLC-controlled cooking system with zero logic errors on first trial. Designed ladder logic, HMI, and safety interlocks.", tags: ["Siemens","PLC","SCADA","HMI"], icon: Cog, color: "#00e676", link: "#" },
  { title: "IoT Health Monitor", sub: "Cloud-Connected Wearable", desc: "ESP32-based IoT health monitoring system with MQTT protocol, AWS IoT Core integration, and real-time biometric data dashboarding.", tags: ["ESP32","MQTT","AWS","IoT"], icon: Cpu, color: "#ff9100", link: "#" },
  { title: "Smart Home Security", sub: "AI-Powered Surveillance", desc: "Raspberry Pi + YOLO-based security system with 8-channel free notifications: Telegram, Discord, Gmail, Slack, IFTTT, Ntfy.sh, Matrix, WhatsApp.", tags: ["YOLO","RPi","Python","Alerts"], icon: Wifi, color: "#e040fb", link: "#" },
  { title: "Stereo Vision Rig", sub: "Dual Camera Depth System", desc: "Custom stereo vision rig with dual cameras at 60cm baseline for depth estimation and 3D reconstruction applications.", tags: ["OpenCV","Python","3D","Stereo"], icon: BrainCircuit, color: "#40c4ff", link: "#" },
  { title: "rombotics.com", sub: "Full-Stack SaaS Platform", desc: "Full-stack platform on Netlify + Cloudflare Workers with Neon PostgreSQL, Stripe payments, 3D print ordering, admin dashboard, and token auth.", tags: ["React","Cloudflare","Stripe","PostgreSQL"], icon: ExternalLink, color: "#69f0ae", link: "https://rombotics.com" },
];

const EXPERIENCE = [
  { role: "Robotics Wrangler", company: "HCL (via Dabster Systems)", period: "2026 — Contract", desc: "Robotics lab operations, system wrangling, and testing for enterprise automation projects.", color: ACCENT },
  { role: "PLC & SCADA Engineer", company: "Zebra EM", period: "2025", desc: "Programmed Siemens PLCs, designed SCADA interfaces, and commissioned automated industrial systems.", color: ACCENT2 },
  { role: "Energy Adviser", company: "Scottish Power", period: "2024", desc: "Advised residential customers on energy solutions with technical assessment of heating and insulation systems.", color: ACCENT3 },
  { role: "Shift Manager", company: "Capital Arches Group (McDonald's)", period: "2021 — Present", desc: "Managing teams of 30+, P&L accountability, operational excellence, and real-time decision-making under pressure.", color: "#00e676" },
];

const SKILLS = [
  { name: "ESP32 / Arduino", pct: 95 }, { name: "Python", pct: 92 }, { name: "C / C++", pct: 88 },
  { name: "PLC (Siemens S7)", pct: 85 }, { name: "Computer Vision", pct: 90 }, { name: "ROS2", pct: 78 },
  { name: "PID / Control Systems", pct: 92 }, { name: "3D Printing", pct: 88 }, { name: "SCADA / HMI", pct: 82 },
  { name: "React / JavaScript", pct: 80 }, { name: "MQTT / IoT", pct: 87 }, { name: "Sensor Fusion", pct: 90 },
  { name: "PCB Design", pct: 75 }, { name: "YOLO / TensorRT", pct: 88 }, { name: "AWS IoT Core", pct: 72 },
];

const STATS = [
  { label: "Projects Built", value: 12 }, { label: "GitHub Repos", value: 8 },
  { label: "IEEE Member", value: 1, suffix: "✓" }, { label: "Servo Motors Tuned", value: 96 },
];

// ─────────────── GLITCH TEXT ───────────────
function GlitchText({ text, className = "", as: Tag = "h1" }) {
  return (
    <Tag className={`glitch-text ${className}`} data-text={text}>
      {text}
      <span className="glitch-copy glitch-1" aria-hidden="true">{text}</span>
      <span className="glitch-copy glitch-2" aria-hidden="true">{text}</span>
    </Tag>
  );
}

// ─────────────── TYPEWRITER ───────────────
function Typewriter({ texts, speed = 60, pause = 2000 }) {
  const [display, setDisplay] = useState("");
  const [idx, setIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[idx % texts.length];
    const timeout = deleting ? speed / 2 : speed;
    if (!deleting && charIdx === current.length) {
      setTimeout(() => setDeleting(true), pause);
      return;
    }
    if (deleting && charIdx === 0) {
      setDeleting(false);
      setIdx(i => i + 1);
      return;
    }
    const timer = setTimeout(() => {
      setCharIdx(c => deleting ? c - 1 : c + 1);
      setDisplay(current.substring(0, deleting ? charIdx - 1 : charIdx + 1));
    }, timeout);
    return () => clearTimeout(timer);
  }, [charIdx, deleting, idx, texts, speed, pause]);

  return <span className="typewriter">{display}<span className="cursor">|</span></span>;
}

// ─────────────── ANIMATED COUNTER ───────────────
function Counter({ end, duration = 2000, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const animate = (now) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(eased * end));
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{suffix === "✓" ? "✓" : count}</span>;
}

// ─────────────── THREE.JS HERO ───────────────
function HeroScene() {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const w = mountRef.current.clientWidth;
    const h = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 1000);
    camera.position.z = 4;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Wireframe icosahedron
    const geo = new THREE.IcosahedronGeometry(1.8, 1);
    const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(ACCENT), wireframe: true, transparent: true, opacity: 0.35 });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    // Inner icosahedron
    const geo2 = new THREE.IcosahedronGeometry(1.2, 0);
    const mat2 = new THREE.MeshBasicMaterial({ color: new THREE.Color(ACCENT2), wireframe: true, transparent: true, opacity: 0.2 });
    const mesh2 = new THREE.Mesh(geo2, mat2);
    scene.add(mesh2);

    // Particles
    const pGeo = new THREE.BufferGeometry();
    const pCount = 600;
    const positions = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i++) positions[i] = (Math.random() - 0.5) * 12;
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const pMat = new THREE.PointsMaterial({ color: new THREE.Color(ACCENT), size: 0.02, transparent: true, opacity: 0.6 });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    let mouseX = 0, mouseY = 0;
    const onMouse = (e) => {
      mouseX = (e.clientX / w - 0.5) * 2;
      mouseY = (e.clientY / h - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouse);

    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      mesh.rotation.x += 0.003;
      mesh.rotation.y += 0.005;
      mesh2.rotation.x -= 0.004;
      mesh2.rotation.y -= 0.003;
      particles.rotation.y += 0.0005;
      camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.03;
      camera.position.y += (-mouseY * 0.5 - camera.position.y) * 0.03;
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const nw = mountRef.current?.clientWidth || w;
      const nh = mountRef.current?.clientHeight || h;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} style={{ position: "absolute", inset: 0, zIndex: 0 }} />;
}

// ─────────────── REVEAL WRAPPER ───────────────
function Reveal({ children, direction = "up", delay = 0, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.12 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const transforms = { up: "translateY(60px)", down: "translateY(-60px)", left: "translateX(80px)", right: "translateX(-80px)", scale: "scale(0.85)" };
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "none" : transforms[direction],
      transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
    }}>{children}</div>
  );
}

// ─────────────── PROJECT CARD ───────────────
function ProjectCard({ project, index }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);
  const cardRef = useRef(null);

  const handleMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20;
    setTilt({ x: y, y: x });
  };

  const Icon = project.icon;
  return (
    <Reveal direction="up" delay={index * 0.08}>
      <div ref={cardRef} className="project-card"
        onMouseMove={handleMove}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => { setHover(false); setTilt({ x: 0, y: 0 }); }}
        style={{
          transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ${hover ? "scale(1.03)" : "scale(1)"}`,
          borderColor: hover ? project.color + "55" : BORDER,
          boxShadow: hover ? `0 0 40px ${project.color}15, 0 20px 60px rgba(0,0,0,0.5)` : "0 4px 20px rgba(0,0,0,0.3)",
        }}>
        <div className="card-glow" style={{ background: `radial-gradient(circle at 50% 0%, ${project.color}12 0%, transparent 70%)`, opacity: hover ? 1 : 0 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, position: "relative" }}>
          <div style={{ width: 42, height: 42, borderRadius: 10, background: project.color + "18", display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${project.color}30` }}>
            <Icon size={20} color={project.color} />
          </div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#f0f0f0", fontFamily: "'Syne', sans-serif" }}>{project.title}</div>
            <div style={{ fontSize: 11, color: project.color, fontFamily: "'Fira Code', monospace", letterSpacing: 0.5 }}>{project.sub}</div>
          </div>
        </div>
        <p style={{ fontSize: 13, lineHeight: 1.65, color: "#999", margin: "0 0 16px", position: "relative" }}>{project.desc}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, position: "relative" }}>
          {project.tags.map(t => (
            <span key={t} style={{
              fontSize: 10, padding: "3px 8px", borderRadius: 4, background: project.color + "10",
              color: project.color, border: `1px solid ${project.color}20`, fontFamily: "'Fira Code', monospace",
            }}>{t}</span>
          ))}
        </div>
        {project.link !== "#" && (
          <a href={project.link} target="_blank" rel="noopener noreferrer" style={{
            position: "absolute", top: 16, right: 16, color: "#555", transition: "color 0.3s",
          }} onMouseOver={e => e.currentTarget.style.color = project.color}
             onMouseOut={e => e.currentTarget.style.color = "#555"}>
            <ExternalLink size={14} />
          </a>
        )}
      </div>
    </Reveal>
  );
}

// ─────────────── SKILL BAR ───────────────
function SkillBar({ name, pct, delay }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const hue = (pct / 100) * 160;
  return (
    <div ref={ref} style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: "#ccc", fontFamily: "'Fira Code', monospace" }}>{name}</span>
        <span style={{ fontSize: 11, color: `hsl(${hue}, 90%, 60%)`, fontFamily: "'Fira Code', monospace" }}>{pct}%</span>
      </div>
      <div style={{ height: 4, background: "#1a1a1a", borderRadius: 2, overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 2,
          width: visible ? `${pct}%` : "0%",
          background: `linear-gradient(90deg, hsl(${hue}, 90%, 40%), hsl(${hue}, 90%, 60%))`,
          transition: `width 1.2s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
          boxShadow: `0 0 10px hsl(${hue}, 90%, 50%, 0.3)`,
        }} />
      </div>
    </div>
  );
}

// ═══════════════ MAIN PORTFOLIO ═══════════════
export default function Portfolio() {
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const sections = ["hero", "about", "projects", "skills", "publications", "experience", "contact"];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setNavOpen(false);
  };

  return (
    <div style={{ background: BG, color: "#f0f0f0", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600;700&family=Fira+Code:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${BG}; }
        ::-webkit-scrollbar-thumb { background: ${ACCENT}40; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: ${ACCENT}80; }

        /* Glitch */
        .glitch-text { position: relative; display: inline-block; }
        .glitch-copy {
          position: absolute; top: 0; left: 0; width: 100%; height: 100%;
          display: inline-block; pointer-events: none;
        }
        .glitch-1 { color: ${ACCENT}; animation: glitch1 3s infinite linear alternate-reverse; clip-path: inset(0 0 65% 0); }
        .glitch-2 { color: ${ACCENT2}; animation: glitch2 2.5s infinite linear alternate-reverse; clip-path: inset(65% 0 0 0); }
        @keyframes glitch1 {
          0%,90% { transform: translate(0); }
          92% { transform: translate(-3px, 1px); }
          94% { transform: translate(3px, -1px); }
          96% { transform: translate(-2px, 2px); }
          98% { transform: translate(2px, 0); }
          100% { transform: translate(0); }
        }
        @keyframes glitch2 {
          0%,88% { transform: translate(0); }
          90% { transform: translate(3px, -2px); }
          93% { transform: translate(-3px, 1px); }
          96% { transform: translate(2px, 1px); }
          100% { transform: translate(0); }
        }

        /* Typewriter cursor */
        .cursor { animation: blink 1s step-end infinite; color: ${ACCENT}; font-weight: 300; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

        /* Scan line */
        .scanline {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; z-index: 9999;
          background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,229,255,0.015) 2px, rgba(0,229,255,0.015) 4px);
        }

        /* Project card */
        .project-card {
          position: relative; padding: 24px; border-radius: 14px; background: ${SURFACE};
          border: 1px solid ${BORDER}; cursor: default; overflow: hidden;
          transition: transform 0.15s ease, border-color 0.4s, box-shadow 0.4s;
          will-change: transform;
        }
        .card-glow { position: absolute; inset: 0; transition: opacity 0.4s; pointer-events: none; }

        /* Grid background */
        .grid-bg {
          background-image: linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        /* Floating animation */
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        .float { animation: float 6s ease-in-out infinite; }
        .float-delay { animation: float 7s ease-in-out 1s infinite; }

        /* Pulse ring */
        @keyframes pulse-ring { 0%{transform:scale(1);opacity:0.4} 100%{transform:scale(1.8);opacity:0} }
        .pulse-ring { position: absolute; border-radius: 50%; border: 1px solid ${ACCENT}; animation: pulse-ring 2.5s ease-out infinite; }

        /* Nav link */
        .nav-link {
          font-size: 13px; color: #777; cursor: pointer; text-transform: uppercase; letter-spacing: 2px;
          font-family: 'Fira Code', monospace; transition: color 0.3s; background: none; border: none; padding: 8px 0;
        }
        .nav-link:hover { color: ${ACCENT}; }

        /* Section title */
        .section-tag {
          font-family: 'Fira Code', monospace; font-size: 11px; color: ${ACCENT};
          letter-spacing: 3px; text-transform: uppercase; margin-bottom: 8px;
        }
        .section-title {
          font-family: 'Syne', sans-serif; font-size: clamp(28px, 4vw, 42px);
          font-weight: 800; line-height: 1.15; margin-bottom: 24px;
        }

        /* Timeline */
        .timeline-line {
          position: absolute; left: 19px; top: 0; bottom: 0; width: 2px;
          background: linear-gradient(180deg, ${ACCENT}40, ${ACCENT2}40, ${ACCENT3}40);
        }
        .timeline-dot {
          width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center;
          justify-content: center; flex-shrink: 0; position: relative; z-index: 1;
        }

        /* Hero gradient mesh */
        .hero-gradient {
          position: absolute; width: 600px; height: 600px; border-radius: 50%; filter: blur(120px); opacity: 0.12;
        }

        /* Marquee */
        @keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .marquee-track { display: flex; animation: marquee 30s linear infinite; width: max-content; }

        /* Magnetic button */
        .mag-btn {
          position: relative; display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 32px; border: 1px solid ${ACCENT}50; border-radius: 8px;
          background: transparent; color: ${ACCENT}; font-family: 'Fira Code', monospace;
          font-size: 13px; cursor: pointer; overflow: hidden; transition: all 0.4s;
          text-decoration: none;
        }
        .mag-btn::before {
          content: ''; position: absolute; inset: 0; background: ${ACCENT};
          transform: translateY(100%); transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        .mag-btn:hover::before { transform: translateY(0); }
        .mag-btn:hover { color: ${BG}; border-color: ${ACCENT}; }
        .mag-btn > * { position: relative; z-index: 1; }

        /* Noise overlay */
        .noise {
          position: fixed; inset: 0; pointer-events: none; z-index: 9998; opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        /* Responsive */
        @media (max-width: 768px) {
          .project-grid { grid-template-columns: 1fr !important; }
          .hero-content { padding: 0 20px !important; }
          .section-pad { padding: 80px 20px !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .skills-grid { grid-template-columns: 1fr !important; }
          .nav-desktop { display: none !important; }
        }
        @media (min-width: 769px) {
          .nav-mobile-btn { display: none !important; }
          .nav-mobile-menu { display: none !important; }
        }
      `}</style>

      {/* Overlays */}
      <div className="scanline" />
      <div className="noise" />

      {/* ═══ NAVIGATION ═══ */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "16px 40px",
        background: scrolled ? BG + "e6" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? `1px solid ${BORDER}` : "1px solid transparent",
        transition: "all 0.4s",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, cursor: "pointer", letterSpacing: -0.5 }} onClick={() => scrollTo("hero")}>
          <span style={{ color: ACCENT }}>R</span>OMIL<span style={{ color: ACCENT }}>.</span>
        </div>
        <div className="nav-desktop" style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {sections.slice(1).map(s => (
            <button key={s} className="nav-link" onClick={() => scrollTo(s)}>{s}</button>
          ))}
        </div>
        <button className="nav-mobile-btn" onClick={() => setNavOpen(!navOpen)} style={{ background: "none", border: "none", color: "#f0f0f0", cursor: "pointer" }}>
          {navOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {navOpen && (
        <div className="nav-mobile-menu" style={{
          position: "fixed", inset: 0, zIndex: 99, background: BG + "f5", backdropFilter: "blur(30px)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24,
        }}>
          {sections.slice(1).map(s => (
            <button key={s} className="nav-link" onClick={() => scrollTo(s)} style={{ fontSize: 18 }}>{s}</button>
          ))}
        </div>
      )}

      {/* ═══ HERO ═══ */}
      <section id="hero" style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <HeroScene />
        <div className="hero-gradient" style={{ top: "-20%", left: "-10%", background: ACCENT }} />
        <div className="hero-gradient float-delay" style={{ bottom: "-20%", right: "-10%", background: ACCENT2 }} />
        <div className="hero-content" style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 40px", maxWidth: 800 }}>
          <Reveal direction="up" delay={0.2}>
            <div style={{ fontFamily: "'Fira Code', monospace", fontSize: 13, color: ACCENT, letterSpacing: 4, marginBottom: 20, textTransform: "uppercase" }}>
              // MECHATRONICS & ROBOTICS ENGINEER
            </div>
          </Reveal>
          <Reveal direction="up" delay={0.4}>
            <GlitchText text="ROMIL MODI" className="" as="h1"
              style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(48px, 8vw, 96px)", fontWeight: 800, letterSpacing: -2, lineHeight: 1, marginBottom: 20 }} />
          </Reveal>
          <Reveal direction="up" delay={0.6}>
            <div style={{ fontSize: 18, color: "#999", marginBottom: 36, fontWeight: 300, lineHeight: 1.6 }}>
              <Typewriter texts={[
                "Building intelligent machines",
                "PID-tuning quadruped robots",
                "Designing SCADA systems",
                "Training YOLO models at 28 FPS",
                "Engineering the future"
              ]} />
            </div>
          </Reveal>
          <Reveal direction="up" delay={0.8}>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <a href="https://github.com/romilmodi" className="mag-btn" target="_blank" rel="noopener noreferrer">
                <Github size={16} /><span>GitHub</span>
              </a>
              <a href="https://linkedin.com/in/romilmodi" className="mag-btn" target="_blank" rel="noopener noreferrer">
                <Linkedin size={16} /><span>LinkedIn</span>
              </a>
              <a href="mailto:romil2002modi@gmail.com" className="mag-btn" target="_blank" rel="noopener noreferrer">
                <Mail size={16} /><span>Contact</span>
              </a>
            </div>
          </Reveal>
          <Reveal direction="up" delay={1.0}>
            <button onClick={() => scrollTo("about")} style={{
              marginTop: 48, background: "none", border: "none", color: "#555", cursor: "pointer",
              animation: "float 2s ease-in-out infinite",
            }}>
              <ChevronDown size={28} />
            </button>
          </Reveal>
        </div>
      </section>

      {/* ═══ TECH MARQUEE ═══ */}
      <div style={{ borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, padding: "14px 0", overflow: "hidden" }}>
        <div className="marquee-track">
          {[...Array(2)].map((_, i) => (
            <div key={i} style={{ display: "flex", gap: 40, paddingRight: 40 }}>
              {["ESP32","PLC","SCADA","ROS2","YOLO","PID CONTROL","SENSOR FUSION","IoT","MQTT","PYTHON","C++","3D PRINTING","PCB DESIGN","COMPUTER VISION","JETSON","TensorRT","AWS","REACT","CLOUDFLARE"].map(t => (
                <span key={t+i} style={{ fontFamily: "'Fira Code', monospace", fontSize: 11, color: "#444", letterSpacing: 2, whiteSpace: "nowrap" }}>
                  {t} <span style={{ color: ACCENT, margin: "0 4px" }}>◆</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ═══ ABOUT ═══ */}
      <section id="about" className="section-pad grid-bg" style={{ padding: "120px 40px", maxWidth: 1200, margin: "0 auto" }}>
        <Reveal direction="right"><div className="section-tag">// 001 — ABOUT</div></Reveal>
        <Reveal direction="up" delay={0.1}>
          <h2 className="section-title">Engineering the<br /><span style={{ color: ACCENT }}>physical</span> & <span style={{ color: ACCENT2 }}>digital</span></h2>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "start" }}>
          <Reveal direction="left" delay={0.2}>
            <div>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: "#aaa", marginBottom: 20 }}>
                MEng Mechatronics & Robotics graduate (Distinction) from Anglia Ruskin University with a passion for building systems that bridge software intelligence and physical actuation. From PID-tuned quadruped robots to YOLO-powered autonomous perception, I engineer solutions at the intersection of embedded systems, control theory, and computer vision.
              </p>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: "#aaa", marginBottom: 24 }}>
                Founder of <span style={{ color: ACCENT }}>Rombotics</span> — an open-source robotics initiative. IEEE Graduate Student Member. Currently pursuing opportunities in robotics, automation, and control systems engineering.
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#666", fontSize: 13 }}>
                <MapPin size={14} color={ACCENT} /> London, United Kingdom
              </div>
            </div>
          </Reveal>
          <Reveal direction="right" delay={0.3}>
            <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              {STATS.map((s, i) => (
                <div key={i} style={{
                  padding: 24, borderRadius: 12, background: SURFACE, border: `1px solid ${BORDER}`,
                  textAlign: "center", position: "relative", overflow: "hidden",
                }}>
                  <div style={{ fontSize: 36, fontWeight: 800, fontFamily: "'Syne', sans-serif", color: ACCENT, marginBottom: 4 }}>
                    <Counter end={s.value} suffix={s.suffix} />
                  </div>
                  <div style={{ fontSize: 11, color: "#666", fontFamily: "'Fira Code', monospace", letterSpacing: 1, textTransform: "uppercase" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ PROJECTS ═══ */}
      <section id="projects" className="section-pad" style={{ padding: "120px 40px", maxWidth: 1200, margin: "0 auto" }}>
        <Reveal direction="right"><div className="section-tag">// 002 — PROJECTS</div></Reveal>
        <Reveal direction="up" delay={0.1}>
          <h2 className="section-title">What I've <span style={{ color: ACCENT2 }}>built</span></h2>
        </Reveal>
        <div className="project-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
          {PROJECTS.map((p, i) => <ProjectCard key={i} project={p} index={i} />)}
        </div>
      </section>

      {/* ═══ SKILLS ═══ */}
      <section id="skills" className="section-pad grid-bg" style={{ padding: "120px 40px", maxWidth: 1200, margin: "0 auto" }}>
        <Reveal direction="right"><div className="section-tag">// 003 — SKILLS</div></Reveal>
        <Reveal direction="up" delay={0.1}>
          <h2 className="section-title">Technical <span style={{ color: ACCENT3 }}>proficiency</span></h2>
        </Reveal>
        <div className="skills-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px 40px" }}>
          {SKILLS.map((s, i) => <SkillBar key={i} name={s.name} pct={s.pct} delay={i * 0.05} />)}
        </div>
      </section>

      {/* ═══ PUBLICATIONS ═══ */}
      <section id="publications" className="section-pad" style={{ padding: "120px 40px", maxWidth: 1200, margin: "0 auto" }}>
        <Reveal direction="right"><div className="section-tag">// 004 — PUBLICATIONS</div></Reveal>
        <Reveal direction="up" delay={0.1}>
          <h2 className="section-title">Research & <span style={{ color: ACCENT }}>publication</span></h2>
        </Reveal>
        <Reveal direction="up" delay={0.2}>
          <div style={{
            padding: 32, borderRadius: 16, background: SURFACE, border: `1px solid ${BORDER}`,
            position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT2}, ${ACCENT3})` }} />
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <FileText size={18} color={ACCENT} />
              <span style={{ fontFamily: "'Fira Code', monospace", fontSize: 11, color: ACCENT, letterSpacing: 2 }}>IEEE T-ASE — UNDER REVIEW</span>
            </div>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 700, lineHeight: 1.4, marginBottom: 12, color: "#e0e0e0" }}>
              Design, Implementation, and Experimental Validation of a Low-Cost Self-Balancing Quadruped Robot with Axis-Tuned Embedded PID Control and Independent IMU Sensor Validation
            </h3>
            <p style={{ fontSize: 13, color: "#888", lineHeight: 1.7, marginBottom: 16 }}>
              Manuscript ID: T-ASE-2026-1502 — Submitted to IEEE Transactions on Automation Science and Engineering (Impact Factor: 9.41). Presents a novel sub-£250 open-source quadruped with per-axis PID tuning, PWM-space tibia-coupling IK approximation, complementary filter sensor fusion, and systematic loop jitter characterisation.
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {["IEEE","Quadruped Robot","PID Control","Sensor Fusion","Open-Source"].map(t => (
                <span key={t} style={{ fontSize: 10, padding: "4px 10px", borderRadius: 4, background: ACCENT + "10", color: ACCENT, border: `1px solid ${ACCENT}20`, fontFamily: "'Fira Code', monospace" }}>{t}</span>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ═══ EXPERIENCE ═══ */}
      <section id="experience" className="section-pad grid-bg" style={{ padding: "120px 40px", maxWidth: 1200, margin: "0 auto" }}>
        <Reveal direction="right"><div className="section-tag">// 005 — EXPERIENCE</div></Reveal>
        <Reveal direction="up" delay={0.1}>
          <h2 className="section-title">Where I've <span style={{ color: ACCENT2 }}>worked</span></h2>
        </Reveal>
        <div style={{ position: "relative", paddingLeft: 60 }}>
          <div className="timeline-line" />
          {EXPERIENCE.map((exp, i) => (
            <Reveal key={i} direction="left" delay={i * 0.12}>
              <div style={{ position: "relative", marginBottom: 40, display: "flex", gap: 20 }}>
                <div className="timeline-dot" style={{ background: exp.color + "15", border: `2px solid ${exp.color}40`, position: "absolute", left: -60 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: exp.color }} />
                  <div className="pulse-ring" style={{ width: 40, height: 40, borderColor: exp.color }} />
                </div>
                <div style={{ padding: 24, borderRadius: 12, background: SURFACE, border: `1px solid ${BORDER}`, flex: 1 }}>
                  <div style={{ fontFamily: "'Fira Code', monospace", fontSize: 11, color: exp.color, marginBottom: 6, letterSpacing: 1 }}>{exp.period}</div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{exp.role}</div>
                  <div style={{ fontSize: 13, color: "#888", marginBottom: 8 }}>{exp.company}</div>
                  <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6 }}>{exp.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══ EDUCATION ═══ */}
      <section style={{ padding: "80px 40px", maxWidth: 1200, margin: "0 auto" }}>
        <Reveal direction="up">
          <div style={{
            padding: 32, borderRadius: 16, background: SURFACE, border: `1px solid ${BORDER}`,
            display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20,
          }}>
            <div>
              <div style={{ fontFamily: "'Fira Code', monospace", fontSize: 11, color: ACCENT3, letterSpacing: 2, marginBottom: 6 }}>EDUCATION</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 4 }}>MEng Mechatronics & Robotics Engineering</div>
              <div style={{ fontSize: 14, color: "#888" }}>Anglia Ruskin University — Graduated May 2025</div>
            </div>
            <div style={{
              padding: "10px 24px", borderRadius: 8, background: ACCENT3 + "15", border: `1px solid ${ACCENT3}30`,
              fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, color: ACCENT3,
            }}>
              Distinction
            </div>
          </div>
        </Reveal>
      </section>

      {/* ═══ CONTACT ═══ */}
      <section id="contact" className="section-pad" style={{ padding: "120px 40px", maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
        <Reveal direction="up"><div className="section-tag">// 006 — CONTACT</div></Reveal>
        <Reveal direction="up" delay={0.1}>
          <h2 className="section-title">Let's build <span style={{ color: ACCENT }}>something</span></h2>
        </Reveal>
        <Reveal direction="up" delay={0.2}>
          <p style={{ fontSize: 15, color: "#888", lineHeight: 1.7, marginBottom: 40 }}>
            Open to roles in robotics engineering, automation, control systems, and embedded software development. Based in London, UK. No sponsorship required.
          </p>
        </Reveal>
        <Reveal direction="up" delay={0.3}>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="mailto:romil2002modi@gmail.com" className="mag-btn">
              <Mail size={16} /><span>romil2002modi@gmail.com</span>
            </a>
            <a href="https://rombotics.com" className="mag-btn" target="_blank" rel="noopener noreferrer">
              <ExternalLink size={16} /><span>rombotics.com</span>
            </a>
          </div>
        </Reveal>
        <Reveal direction="up" delay={0.4}>
          <div style={{ display: "flex", gap: 20, justifyContent: "center", marginTop: 32 }}>
            <a href="https://github.com/romilmodi" target="_blank" rel="noopener noreferrer" style={{ color: "#555", transition: "color 0.3s" }}
               onMouseOver={e => e.currentTarget.style.color = ACCENT} onMouseOut={e => e.currentTarget.style.color = "#555"}>
              <Github size={22} />
            </a>
            <a href="https://linkedin.com/in/romilmodi" target="_blank" rel="noopener noreferrer" style={{ color: "#555", transition: "color 0.3s" }}
               onMouseOver={e => e.currentTarget.style.color = ACCENT} onMouseOut={e => e.currentTarget.style.color = "#555"}>
              <Linkedin size={22} />
            </a>
            <a href="https://instagram.com/romil.modi.01" target="_blank" rel="noopener noreferrer" style={{ color: "#555", transition: "color 0.3s" }}
               onMouseOver={e => e.currentTarget.style.color = ACCENT} onMouseOut={e => e.currentTarget.style.color = "#555"}>
              <Send size={22} />
            </a>
          </div>
        </Reveal>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{
        padding: "32px 40px", borderTop: `1px solid ${BORDER}`,
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12,
      }}>
        <div style={{ fontFamily: "'Fira Code', monospace", fontSize: 11, color: "#444" }}>
          © 2026 Romil Modi — Built with precision
        </div>
        <div style={{ fontFamily: "'Fira Code', monospace", fontSize: 11, color: "#333" }}>
          <span style={{ color: ACCENT }}>rombotics</span>.com
        </div>
      </footer>
    </div>
  );
}
