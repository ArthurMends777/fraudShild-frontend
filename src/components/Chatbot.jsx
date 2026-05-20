import { useState, useEffect, useRef } from "react";
import { X, Send, Shield } from "lucide-react";
import { api } from "../services/api";

const SimonAvatar = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <radialGradient id="avbg" cx="40%" cy="30%" r="65%"><stop offset="0%" stopColor="#fff"/><stop offset="100%" stopColor="#d0d8e8"/></radialGradient>
      <radialGradient id="avey" cx="35%" cy="32%" r="60%"><stop offset="0%" stopColor="#6ec6ff"/><stop offset="100%" stopColor="#1565C0"/></radialGradient>
      <radialGradient id="avpu" cx="38%" cy="35%" r="55%"><stop offset="0%" stopColor="#1a237e"/><stop offset="100%" stopColor="#0d0d2b"/></radialGradient>
    </defs>
    <ellipse cx="100" cy="72" rx="60" ry="58" fill="url(#avbg)" stroke="#9aa8c0" strokeWidth="2"/>
    <path d="M42 72 Q44 20 100 16 Q156 20 158 72" fill="none" stroke="#1a1a2e" strokeWidth="7" strokeLinecap="round"/>
    <ellipse cx="40" cy="76" rx="10" ry="13" fill="#1a1a2e"/>
    <ellipse cx="40" cy="76" rx="6" ry="8" fill="#1565C0" opacity=".8"/>
    <ellipse cx="160" cy="76" rx="10" ry="13" fill="#1a1a2e"/>
    <ellipse cx="160" cy="76" rx="6" ry="8" fill="#1565C0" opacity=".8"/>
    <ellipse cx="76" cy="74" rx="22" ry="24" fill="#e8f4ff" stroke="#c0d4e8" strokeWidth="1"/>
    <ellipse cx="76" cy="74" rx="18" ry="20" fill="url(#avey)"/>
    <ellipse cx="77" cy="75" rx="11" ry="12" fill="url(#avpu)"/>
    <ellipse cx="70" cy="67" rx="5" ry="4" fill="#fff" opacity=".85"/>
    <ellipse cx="124" cy="74" rx="22" ry="24" fill="#e8f4ff" stroke="#c0d4e8" strokeWidth="1"/>
    <ellipse cx="124" cy="74" rx="18" ry="20" fill="url(#avey)"/>
    <ellipse cx="125" cy="75" rx="11" ry="12" fill="url(#avpu)"/>
    <ellipse cx="118" cy="67" rx="5" ry="4" fill="#fff" opacity=".85"/>
    <path d="M82 106 Q100 118 118 106" fill="none" stroke="#1a2a4a" strokeWidth="2.5" strokeLinecap="round"/>
    <ellipse cx="58" cy="96" rx="14" ry="9" fill="#ffb3ba" opacity="0.45"/>
    <ellipse cx="142" cy="96" rx="14" ry="9" fill="#ffb3ba" opacity="0.45"/>
  </svg>
);

const RISK_CONFIG = {
  safe:   { icon: "🟢", label: "Confiável",  bar: "#22c55e", bg: "#f0fdf4", border: "#bbf7d0", text: "#166534" },
  warn:   { icon: "🟡", label: "Suspeito",   bar: "#eab308", bg: "#fefce8", border: "#fef08a", text: "#854d0e" },
  danger: { icon: "🔴", label: "Alto risco", bar: "#ef4444", bg: "#fef2f2", border: "#fecaca", text: "#991b1b" },
};

function RiskCard({ risk }) {
  const cfg = RISK_CONFIG[risk.level] || RISK_CONFIG.warn;
  return (
    <div style={{
      marginTop: 10, borderRadius: 10, overflow: "hidden",
      border: `1.5px solid ${cfg.border}`, background: cfg.bg,
      fontSize: 12, fontFamily: "'DM Sans', sans-serif",
    }}>
      <div style={{
        padding: "7px 12px", fontWeight: 700, color: cfg.text,
        display: "flex", alignItems: "center", gap: 6,
        borderBottom: `1px solid ${cfg.border}`,
      }}>
        <span>{cfg.icon}</span>
        <span>{cfg.label} — {risk.score}%</span>
      </div>
      <div style={{ padding: "8px 12px", color: "#374151" }}>
        <div style={{ height: 6, borderRadius: 99, background: "#e5e7eb", marginBottom: 7, overflow: "hidden" }}>
          <div style={{ height: "100%", borderRadius: 99, background: cfg.bar, width: `${risk.score}%`, transition: "width 0.6s ease" }}/>
        </div>
        <span>{risk.reason}</span>
      </div>
    </div>
  );
}

function RedirectButton({ to }) {
  return (
    <a href={to} style={{
      display: "inline-flex", alignItems: "center", gap: 7,
      marginTop: 10, padding: "8px 16px", borderRadius: 10,
      background: "linear-gradient(135deg,#1565c0,#0d47a1)",
      color: "#e3f2fd", fontSize: 13, fontWeight: 600,
      fontFamily: "'DM Sans', sans-serif", textDecoration: "none",
      boxShadow: "0 2px 10px rgba(21,101,192,0.45)",
      transition: "opacity 0.18s",
    }}
      onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
      onMouseLeave={e => e.currentTarget.style.opacity = "1"}
    >
      🔍 Ir para Analisar
    </a>
  );
}

function BotMessage({ html, risk, redirect }) {
  return (
    <div style={{ display: "flex", gap: 9, alignItems: "flex-start", marginBottom: 14 }}>
      <div style={{
        flexShrink: 0, width: 34, height: 34, borderRadius: "50%",
        background: "linear-gradient(135deg,#1e3a5f,#0d1b2e)",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 2px 8px rgba(21,101,192,0.35)",
      }}>
        <SimonAvatar size={22} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, color: "#42a5f5", marginBottom: 3, letterSpacing: "0.05em", fontFamily: "'DM Mono', monospace" }}>SIMON</div>
        <div style={{
          background: "linear-gradient(135deg,#1e2d42,#162236)",
          border: "1px solid rgba(66,165,245,0.2)", borderRadius: "4px 14px 14px 14px",
          padding: "10px 14px", fontSize: 13.5, lineHeight: 1.6, color: "#d6e8f8",
          fontFamily: "'DM Sans', sans-serif", boxShadow: "0 2px 12px rgba(0,0,0,0.25)",
        }} dangerouslySetInnerHTML={{ __html: html }} />
        {redirect && <RedirectButton to={redirect} />}
        {risk && <RiskCard risk={risk} />}
      </div>
    </div>
  );
}

function UserMessage({ text }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
      <div style={{
        maxWidth: "78%", background: "linear-gradient(135deg,#1565c0,#0d47a1)",
        borderRadius: "14px 4px 14px 14px", padding: "10px 14px",
        fontSize: 13.5, lineHeight: 1.6, color: "#e3f2fd",
        fontFamily: "'DM Sans', sans-serif", boxShadow: "0 2px 12px rgba(21,101,192,0.4)",
      }}>
        {text}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display: "flex", gap: 9, alignItems: "flex-start", marginBottom: 14 }}>
      <div style={{
        flexShrink: 0, width: 34, height: 34, borderRadius: "50%",
        background: "linear-gradient(135deg,#1e3a5f,#0d1b2e)",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 2px 8px rgba(21,101,192,0.35)",
      }}>
        <SimonAvatar size={22} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, color: "#42a5f5", marginBottom: 3, letterSpacing: "0.05em", fontFamily: "'DM Mono', monospace" }}>SIMON</div>
        <div style={{
          background: "linear-gradient(135deg,#1e2d42,#162236)",
          border: "1px solid rgba(66,165,245,0.2)", borderRadius: "4px 14px 14px 14px",
          padding: "12px 16px", display: "inline-flex", gap: 5, alignItems: "center",
          boxShadow: "0 2px 12px rgba(0,0,0,0.25)",
        }}>
          {[0, 1, 2].map(i => (
            <span key={i} style={{
              width: 7, height: 7, borderRadius: "50%", background: "#42a5f5",
              display: "inline-block", animation: "simonBounce 1.2s infinite ease-in-out",
              animationDelay: `${i * 0.2}s`,
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Chip({ label, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: "5px 11px", borderRadius: 20,
      border: "1px solid rgba(66,165,245,0.4)", background: "rgba(66,165,245,0.08)",
      color: "#90caf9", fontSize: 12, cursor: "pointer", whiteSpace: "nowrap",
      fontFamily: "'DM Sans', sans-serif", transition: "all 0.18s",
    }}
      onMouseEnter={e => { e.target.style.background = "rgba(66,165,245,0.2)"; e.target.style.borderColor = "#42a5f5"; }}
      onMouseLeave={e => { e.target.style.background = "rgba(66,165,245,0.08)"; e.target.style.borderColor = "rgba(66,165,245,0.4)"; }}
    >
      {label}
    </button>
  );
}

export default function Chatbot() {
  const [isOpen, setIsOpen]           = useState(false);
  const [messages, setMessages]       = useState([]);
  const [history, setHistory]         = useState([]);
  const [input, setInput]             = useState("");
  const [loading, setLoading]         = useState(false);
  const [showNotif, setShowNotif]     = useState(false);
  const [chipsHidden, setChipsHidden] = useState(false);
  const [firstOpen, setFirstOpen]     = useState(true);
  const msgsRef  = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => { if (!isOpen) setShowNotif(true); }, 2500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  function openChat() {
    setIsOpen(true);
    setShowNotif(false);
    if (firstOpen) {
      setFirstOpen(false);
      setMessages([{
        type: "bot",
        html: `Olá! Sou o <strong style="color:#42a5f5">Simon</strong>, seu assistente de segurança digital do FraudShield! 👋<br><br>
Posso te ajudar com:<br>
🔍 <strong>Análise</strong> de mensagens e links suspeitos<br>
🛡️ <strong>Educação</strong> sobre golpes e fake news<br>
🗺️ <strong>Navegação</strong> pelo portal FraudShield<br><br>
Cole uma mensagem suspeita ou escolha um tópico abaixo!`,
      }]);
    }
  }

  async function sendMsg(customMsg) {
    const text = (customMsg || input).trim();
    if (!text || loading) return;

    setInput("");
    setChipsHidden(true);
    setMessages(prev => [...prev, { type: "user", text }]);

    const newHistory = [...history, { role: "user", content: text }];
    setHistory(newHistory);
    setLoading(true);

    try {
      const res   = await api.post("/simon", { messages: newHistory });
      const reply = res.data.content?.[0]?.text || "Desculpe, ocorreu um erro. Tente novamente.";

      setLoading(false);

      let botMsg;

      if (reply.includes("REDIRECT:/analisar")) {
        const textPart = reply.replace("REDIRECT:/analisar", "").trim();
        botMsg = { type: "bot", html: textPart, redirect: "/app/analise" };
      } else {
        botMsg = { type: "bot", html: reply };
      }

      setMessages(prev => [...prev, botMsg]);
      setHistory(prev => [...prev, { role: "assistant", content: reply }]);

    } catch (err) {
      setLoading(false);
      console.error("[Simon]", err);
      setMessages(prev => [...prev, {
        type: "bot",
        html: "⚠️ Erro de conexão. Verifique sua internet e tente novamente.",
      }]);
    }
  }

  const chips = ["O que é phishing?", "Como identificar fake news?", "Golpes via PIX", "Analisar mensagem suspeita"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=DM+Mono:wght@500;700&display=swap');
        @keyframes simonBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes simonFabPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(21,101,192,0.5), 0 4px 20px rgba(0,0,0,0.5); }
          50% { box-shadow: 0 0 0 10px rgba(21,101,192,0), 0 4px 20px rgba(0,0,0,0.5); }
        }
        @keyframes simonSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes simonNotif {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.3); }
        }
        .simon-fab {
          position: fixed; bottom: 24px; right: 24px; width: 58px; height: 58px;
          border-radius: 50%; background: linear-gradient(135deg, #1565c0, #0d47a1);
          border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;
          animation: simonFabPulse 2.8s infinite; z-index: 9998; transition: transform 0.2s;
        }
        .simon-fab:hover { transform: scale(1.1); }
        .simon-notif {
          position: absolute; top: 4px; right: 4px; width: 12px; height: 12px;
          border-radius: 50%; background: #ef4444; border: 2px solid #0d1b2e;
          animation: simonNotif 1s infinite;
        }
        .simon-win {
          position: fixed; bottom: 96px; right: 24px; width: 370px; height: 540px;
          background: linear-gradient(160deg, #0d1b2e 0%, #091525 100%);
          border: 1px solid rgba(66,165,245,0.25); border-radius: 18px;
          display: flex; flex-direction: column; overflow: hidden;
          box-shadow: 0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.03);
          animation: simonSlideUp 0.28s cubic-bezier(0.34,1.56,0.64,1); z-index: 9999;
        }
        .simon-msgs { flex: 1; overflow-y: auto; padding: 16px 14px 8px; scroll-behavior: smooth; }
        .simon-msgs::-webkit-scrollbar { width: 4px; }
        .simon-msgs::-webkit-scrollbar-track { background: transparent; }
        .simon-msgs::-webkit-scrollbar-thumb { background: rgba(66,165,245,0.25); border-radius: 99px; }
        .simon-input {
          flex: 1; background: rgba(255,255,255,0.06); border: 1px solid rgba(66,165,245,0.22);
          border-radius: 12px; padding: 9px 14px; color: #e3f2fd; font-size: 13.5px;
          font-family: 'DM Sans', sans-serif; outline: none; transition: border-color 0.2s;
        }
        .simon-input::placeholder { color: rgba(144,202,249,0.45); }
        .simon-input:focus { border-color: rgba(66,165,245,0.55); }
        .simon-send {
          width: 38px; height: 38px; flex-shrink: 0; border-radius: 10px;
          background: linear-gradient(135deg, #1565c0, #0d47a1); border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center; transition: all 0.18s; color: white;
        }
        .simon-send:hover:not(:disabled) { background: linear-gradient(135deg, #1976d2, #1565c0); transform: scale(1.06); }
        .simon-send:disabled { opacity: 0.4; cursor: default; }
        @media (max-width: 420px) { .simon-win { width: calc(100vw - 20px); right: 10px; bottom: 88px; } }
      `}</style>

      {!isOpen && (
        <button className="simon-fab" onClick={openChat} aria-label="Abrir Simon">
          <SimonAvatar size={30} />
          {showNotif && <div className="simon-notif" />}
        </button>
      )}

      {isOpen && (
        <div className="simon-win" role="dialog" aria-label="Simon — Assistente FraudShield">
          <div style={{
            padding: "14px 16px 12px", background: "linear-gradient(135deg, #1e3a5f, #0d1b2e)",
            borderBottom: "1px solid rgba(66,165,245,0.18)",
            display: "flex", alignItems: "center", gap: 10, flexShrink: 0,
          }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#1565c0,#0d47a1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <SimonAvatar size={24} />
            </div>
            <div style={{ flex: 1, marginLeft: 10 }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontWeight: 700, fontSize: 13, color: "#e3f2fd", letterSpacing: "0.04em" }}>Simon</div>
              <div style={{ fontSize: 11, color: "#42a5f5", display: "flex", alignItems: "center", gap: 5, fontFamily: "'DM Sans', sans-serif" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block", boxShadow: "0 0 6px #22c55e" }} />
                Online · FraudShield
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Shield size={14} color="#42a5f5" />
              <button onClick={() => setIsOpen(false)} aria-label="Fechar" style={{
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8, width: 30, height: 30, display: "flex", alignItems: "center",
                justifyContent: "center", cursor: "pointer", color: "#90caf9", transition: "background 0.18s",
              }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
              >
                <X size={14} />
              </button>
            </div>
          </div>

          <div className="simon-msgs" ref={msgsRef}>
            {messages.map((msg, i) =>
              msg.type === "bot"
                ? <BotMessage key={i} html={msg.html} risk={msg.risk} redirect={msg.redirect} />
                : <UserMessage key={i} text={msg.text} />
            )}
            {loading && <TypingIndicator />}
          </div>

          {!chipsHidden && messages.length > 0 && (
            <div style={{ padding: "4px 14px 10px", display: "flex", gap: 6, flexWrap: "wrap", flexShrink: 0 }}>
              {chips.map(c => <Chip key={c} label={c} onClick={() => sendMsg(c)} />)}
            </div>
          )}

          <div style={{ padding: "10px 12px 14px", display: "flex", gap: 8, alignItems: "center", borderTop: "1px solid rgba(66,165,245,0.12)", flexShrink: 0 }}>
            <input
              ref={inputRef}
              className="simon-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMsg(); } }}
              placeholder="Digite sua pergunta..."
              disabled={loading}
            />
            <button className="simon-send" onClick={() => sendMsg()} disabled={loading || !input.trim()} aria-label="Enviar">
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

