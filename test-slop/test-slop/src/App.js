import './storage';
import { useState, useEffect, useRef, useCallback } from "react";

const PAGE = 12;
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const THEME_ORDER = ["dark", "y2k", "xp"];
const REACTION_EMOJIS = ["🔥", "😂", "💀", "👀", "🤌", "💯"];

const THEMES = {
  dark: {
    pageBg: "#0A0A0A", pageExtra: {},
    navBg: "#0A0A0A", navBorder: "1px solid #1a1a1a",
    cardBg: "#111", cardBorder: c => ({ borderTop: `3px solid ${c}` }), cardRadius: 8,
    modalBg: "#0f0f0f", modalBorder: "1px solid #1e1e1e",
    inputBg: "#080808", inputBorder: "#222",
    text: "#EFEFEF", subText: "#DCDCDC", muted: "#555", dim: "#3a3a3a",
    accent: "#FFE500", accentText: "#0A0A0A", err: "#FF3366",
    cancelBorder: "1px solid #1e1e1e", cancelColor: "#555",
    emptyTitle: "#333", emptyBody: "#555",
    loadColor: "#2a2a2a", endColor: "#1e1e1e",
    logoFont: "'Bangers', cursive", logoSize: "2rem", logoSpacing: "3px",
    logoColor: "#FFE500", logoGlow: {},
    bodyFont: "'Space Grotesk', sans-serif",
    dumpBtn: { fontFamily: "'Bangers', cursive", fontSize: "1.1rem", letterSpacing: "1px", borderRadius: "5px" },
    reactionBar: { background: "#0d0d0d", border: "1px solid #1a1a1a" },
    reactionBtn: { active: { background: "#1a1a00", border: "1px solid #FFE500", color: "#FFE500" }, inactive: { background: "transparent", border: "1px solid #222", color: "#555" } },
    replyArea: { background: "#0d0d0d", border: "1px solid #1a1a1a" },
    replyInput: { background: "#080808", border: "1px solid #222" },
    replyText: "#888",
    sliderTrack: "#1a1a1a", sliderBorder: "1px solid #333",
    sliderPip: "#FFE500", sliderPipShadow: "none",
    sliderLabelActive: "#FFE500", sliderLabelInactive: "#333",
    floatBg: "rgba(10,10,10,0.95)", floatBorder: "1px solid #222",
    colors: ["#FFE500","#FF3366","#00E5C0","#FF6B00","#9B5DE5","#00B9F1"],
    postLabel: "anon", marquee: null,
    emptyHeading: "THE VOID IS EMPTY", emptyAction: "dump something into existence", emptyBtn: "BE FIRST",
    modalTitle: "DUMP SOMETHING", submitLabel: "DUMP IT",
    placeholder: "say anything. or don't.",
    loadingMsg: "LOADING THE VOID...", endMsg: "you've reached the bottom of the slop",
  },
  y2k: {
    pageBg: "#000022",
    pageExtra: { backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)", backgroundSize: "24px 24px" },
    navBg: "#000080", navBorder: "3px solid #00FFFF",
    cardBg: "#00003a", cardBorder: c => ({ border: `3px solid ${c}` }), cardRadius: 0,
    modalBg: "#000055", modalBorder: "3px solid #FF00FF",
    inputBg: "#000033", inputBorder: "#00FFFF",
    text: "#00FF41", subText: "#00FF41", muted: "#00AAFF", dim: "#004488",
    accent: "#FF00FF", accentText: "#000000", err: "#FF4444",
    cancelBorder: "2px solid #00CCFF", cancelColor: "#00CCFF",
    emptyTitle: "#00AAFF", emptyBody: "#006688",
    loadColor: "#003300", endColor: "#001a55",
    logoFont: "'VT323', monospace", logoSize: "2.5rem", logoSpacing: "2px",
    logoColor: "#00FFFF", logoGlow: { textShadow: "0 0 8px #00FFFF, 2px 2px 0 #FF00FF" },
    bodyFont: "'Comic Sans MS', cursive",
    dumpBtn: { fontFamily: "'Comic Sans MS', cursive", fontSize: "0.95rem", borderRadius: "0px", boxShadow: "3px 3px 0 #000" },
    reactionBar: { background: "#000033", border: "2px solid #004488" },
    reactionBtn: { active: { background: "#000066", border: "2px solid #FF00FF", color: "#FF00FF" }, inactive: { background: "transparent", border: "1px solid #004488", color: "#004488" } },
    replyArea: { background: "#000033", border: "2px solid #004488" },
    replyInput: { background: "#000022", border: "1px solid #00FFFF" },
    replyText: "#00AAFF",
    sliderTrack: "#000066", sliderBorder: "2px solid #00FFFF",
    sliderPip: "#FF00FF", sliderPipShadow: "0 0 8px #FF00FF",
    sliderLabelActive: "#00FFFF", sliderLabelInactive: "#003366",
    floatBg: "rgba(0,0,34,0.97)", floatBorder: "2px solid #00FFFF",
    colors: ["#FF00FF","#00FFFF","#FFFF00","#FF6600","#00FF00","#FF0080"],
    postLabel: "~*~anonymous~*~",
    marquee: "★ WELCOME 2 SLOP ZONE ★ BEST VIEWED IN 800x600 ★ ANONYMOUS POSTING ★ DO NOT STEAL ★ SIGN THE GUESTBOOK ★ VISITOR COUNT: 1,337,420 ★ SITE UNDER CONSTRUCTION ★ NO HOTLINKING PLZ ★ ASL? ★",
    emptyHeading: "[ GUESTBOOK IS EMPTY ]", emptyAction: "be the first to sign!! dont be shy :)", emptyBtn: "SIGN IT!!",
    modalTitle: "SIGN THE GUESTBOOK", submitLabel: "SUBMIT!!",
    placeholder: "leave ur mark on the internet...",
    loadingMsg: "PLEASE WAIT LOADING...", endMsg: "~*~ end of guestbook ~*~ thanks 4 visiting!! ~*~",
  },
  xp: {
    pageBg: "#3A6EA5", pageExtra: {},
    navBg: "#ECE9D8", navBorder: "1px solid #ACA899",
    cardBg: "#ECE9D8", cardBorder: c => ({ border: `2px solid ${c}`, boxShadow: "2px 2px 4px rgba(0,0,0,0.15)" }), cardRadius: 4,
    modalBg: "#ECE9D8", modalBorder: "2px solid #0054E3",
    inputBg: "#fff", inputBorder: "#7F9DB9",
    text: "#000", subText: "#1a1a1a", muted: "#666", dim: "#999",
    accent: "#316AC5", accentText: "#fff", err: "#CC0000",
    cancelBorder: "2px solid #ACA899", cancelColor: "#333",
    emptyTitle: "#fff", emptyBody: "rgba(255,255,255,0.7)",
    loadColor: "rgba(255,255,255,0.4)", endColor: "rgba(255,255,255,0.5)",
    logoFont: "'Tahoma', sans-serif", logoSize: "1.3rem", logoSpacing: "0",
    logoColor: "#fff", logoGlow: { textShadow: "1px 1px 2px rgba(0,0,0,0.5)" },
    bodyFont: "'Tahoma', sans-serif",
    dumpBtn: { fontFamily: "'Tahoma', sans-serif", fontSize: "0.85rem", borderRadius: "3px", border: "2px outset #ccc", boxShadow: "1px 1px 0 rgba(255,255,255,0.8) inset" },
    reactionBar: { background: "#D4D0C8", border: "1px solid #ACA899" },
    reactionBtn: { active: { background: "#316AC5", border: "2px inset #0054E3", color: "#fff" }, inactive: { background: "#ECE9D8", border: "2px outset #ccc", color: "#444" } },
    replyArea: { background: "#D4D0C8", border: "1px solid #ACA899" },
    replyInput: { background: "#fff", border: "1px inset #888" },
    replyText: "#555",
    sliderTrack: "#1B6FCC", sliderBorder: "2px solid #0054E3",
    sliderPip: "#ECE9D8", sliderPipShadow: "0 1px 3px rgba(0,0,0,0.4)",
    sliderLabelActive: "#fff", sliderLabelInactive: "rgba(255,255,255,0.35)",
    floatBg: "rgba(236,233,216,0.97)", floatBorder: "2px solid #0054E3",
    colors: ["#316AC5","#CC0000","#228B22","#FF6600","#800080","#008B8B"],
    postLabel: "anonymous user", marquee: null,
    emptyHeading: "No posts yet", emptyAction: "This folder is empty. Be the first to post!", emptyBtn: "New Post",
    modalTitle: "New Post", submitLabel: "Post",
    placeholder: "Type your message here...",
    loadingMsg: "Loading...", endMsg: "— End of posts —",
    isXP: true,
  },
};

// ── Username generator ──────────────────────────────────────────────────────
const ADJ = ["cosmic","goblin","feral","cursed","chaotic","soggy","void","haunted","based","liminal","rotting","glitched","ancient","spicy","hollow","crusty","floating","broken","neon","rusted","damp","fuzzy","lanky","smug","grim","wobbly","cryptid","sleepy","jaded","soggy"];
const NOUN = ["raccoon","oracle","toaster","specter","prophet","burrito","phantom","entity","waffle","cryptid","goblin","menace","artifact","sandwich","anomaly","wraith","relic","daemon","pilgrim","ghoul","biscuit","vessel","wendigo","marmot","cipher","poltergeist","fungus","herald","revenant","omen"];
const genUsername = () => `${pick(ADJ)}_${pick(NOUN)}${Math.floor(Math.random()*99)+1}`;

// ── Post types ───────────────────────────────────────────────────────────────
const POST_TYPES = [
  { id: "meme", label: "Meme", icon: "🔥" },
  { id: "quote", label: "Quote", icon: "💭" },
  { id: "code", label: "Code", icon: "💻" },
];

const CODE_LANGS = [
  "JavaScript","TypeScript","Python","Java","C","C++","C#","Go","Rust","Ruby",
  "PHP","Swift","Kotlin","HTML","CSS","SQL","Shell","JSON","YAML","Markdown","Other",
];

const formatSize = (str) => {
  const bytes = new Blob([str || ""]).size;
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
};

// ── Dark theme background presets ───────────────────────────────────────────
const DARK_BGS = [
  { name: "Void", bg: "#0A0A0A" },
  { name: "Slate", bg: "#0d1117" },
  { name: "Plum", bg: "#150f1c" },
  { name: "Forest", bg: "#0a1410" },
  { name: "Crimson", bg: "#1a0a0d" },
  { name: "Navy", bg: "#0a0f1a" },
];

const compressImage = (file) => new Promise(res => {
  const reader = new FileReader();
  reader.onload = e => {
    const img = new Image();
    img.onload = () => {
      const MAX = 900, scale = img.width > MAX ? MAX / img.width : 1;
      const [w, h] = [Math.round(img.width * scale), Math.round(img.height * scale)];
      const canvas = document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      canvas.getContext("2d").drawImage(img, 0, 0, w, h);
      res(canvas.toDataURL("image/jpeg", 0.65));
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
});

const ago = ts => {
  const m = Math.floor((Date.now() - ts) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

async function fetchBatch(keys) {
  const results = await Promise.all(keys.map(async k => {
    try { const r = await window.storage.get(k, true); return r ? JSON.parse(r.value) : null; }
    catch { return null; }
  }));
  return results.filter(Boolean);
}

// ── Draggable theme slider ──────────────────────────────────────────────────
function ThemeSlider({ theme, setTheme }) {
  const T = THEMES[theme];
  const trackRef = useRef();
  const dragging = useRef(false);
  const idx = THEME_ORDER.indexOf(theme);
  // pip positions as % of (track - pip): 0%, 50%, 100% → px inside 120px track, pip 20px
  // left = idx * (120-20) / 2 = idx * 50  but we offset 2px for visual centering
  const pipLeft = idx === 0 ? 2 : idx === 1 ? 51 : 100;

  const resolve = useCallback((clientX) => {
    const rect = trackRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const i = pct < 0.33 ? 0 : pct < 0.66 ? 1 : 2;
    setTheme(THEME_ORDER[i]);
  }, [setTheme]);

  useEffect(() => {
    const onMove = e => { if (dragging.current) resolve(e.touches ? e.touches[0].clientX : e.clientX); };
    const onUp = () => { dragging.current = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [resolve]);

  const labels = ["DARK", "Y2K", "XP"];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
      {/* label row — always legible regardless of theme */}
      <div style={{ display: "flex", justifyContent: "space-between", width: 120 }}>
        {labels.map((l, i) => (
          <span key={l} onClick={() => setTheme(THEME_ORDER[i])} style={{
            fontSize: "0.65rem", cursor: "pointer", userSelect: "none",
            fontFamily: "'Space Grotesk', 'Tahoma', sans-serif", letterSpacing: "0.5px",
            color: i === idx ? "#fff" : "rgba(255,255,255,0.38)",
            fontWeight: i === idx ? 700 : 400,
            textShadow: i === idx ? "0 1px 4px rgba(0,0,0,0.7)" : "none",
            transition: "color 0.2s",
          }}>{l}</span>
        ))}
      </div>
      {/* track */}
      <div
        ref={trackRef}
        onMouseDown={e => { dragging.current = true; resolve(e.clientX); }}
        onTouchStart={e => { dragging.current = true; resolve(e.touches[0].clientX); }}
        onClick={e => resolve(e.clientX)}
        style={{
          position: "relative", width: 120, height: 18, borderRadius: 9,
          cursor: "grab", flexShrink: 0,
          background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)",
          userSelect: "none",
        }}
      >
        {/* filled portion */}
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0,
          width: `${(pipLeft + 10) / 120 * 100}%`,
          borderRadius: 9,
          background: T.accent,
          opacity: 0.25,
          pointerEvents: "none",
          transition: "width 0.25s cubic-bezier(.4,0,.2,1)",
        }} />
        {/* pip */}
        <div style={{
          position: "absolute", width: 18, height: 18, borderRadius: "50%",
          top: 0, left: pipLeft,
          transition: "left 0.25s cubic-bezier(.4,0,.2,1)",
          pointerEvents: "none",
          background: T.accent || "#fff",
          boxShadow: "0 1px 4px rgba(0,0,0,0.5)",
        }} />
        {/* notch marks */}
        {[10, 51, 92].map(x => (
          <div key={x} style={{
            position: "absolute", width: 2, height: 6,
            top: 6, left: x,
            background: "rgba(128,128,128,0.3)",
            borderRadius: 1, pointerEvents: "none",
          }} />
        ))}
      </div>
    </div>
  );
}

// ── Floating fixed theme pill ───────────────────────────────────────────────
function FloatingThemeSwitcher({ theme, setTheme }) {
  return (
    <div style={{
      position: "fixed", bottom: 20, right: 20, zIndex: 999,
      background: "rgba(14,14,14,0.92)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 14,
      padding: "10px 14px",
      backdropFilter: "blur(12px)",
      boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
    }}>
      <ThemeSlider theme={theme} setTheme={setTheme} />
    </div>
  );
}

// ── Section filter tabs (All / Memes / Quotes / Code) ──────────────────────
function FilterTabs({ filterType, setFilterType, theme }) {
  const T = THEMES[theme];
  const tabs = [{ id: "all", label: "All", icon: "✨" }, ...POST_TYPES];
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", padding: "0 0 14px" }}>
      {tabs.map(t => {
        const active = filterType === t.id;
        return (
          <button key={t.id} onClick={() => setFilterType(t.id)} style={{
            padding: "5px 13px", fontSize: "0.78rem", cursor: "pointer",
            fontFamily: T.bodyFont, borderRadius: T.isXP ? 2 : 20,
            border: active ? `1px solid ${T.accent}` : `1px solid ${T.isXP ? "#ACA899" : T.dim}`,
            background: active ? T.accent : "transparent",
            color: active ? T.accentText : T.muted,
            transition: "all 0.15s",
          }}>
            {t.icon} {t.label}
          </button>
        );
      })}
    </div>
  );
}

// ── Leaderboard: top posters by post count ──────────────────────────────────
function Leaderboard({ posts, theme }) {
  const T = THEMES[theme];
  const [expanded, setExpanded] = useState(false);
  const counts = {};
  posts.forEach(p => {
    const u = p.username || "anon";
    counts[u] = (counts[u] || 0) + 1;
  });
  const ranked = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const top = ranked.slice(0, 5);
  const rest = ranked.slice(5, 15);
  if (top.length === 0) return null;
  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div style={{
      margin: "0 0 14px", padding: "12px 14px",
      borderRadius: T.cardRadius, background: T.cardBg, ...T.cardBorder(T.colors[0]),
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <div style={{ fontFamily: T.logoFont, fontSize: "0.85rem", letterSpacing: "1px", color: T.logoColor, ...T.logoGlow }}>
          🏆 TOP NAMES
        </div>
        {rest.length > 0 && (
          <button
            onClick={() => setExpanded(e => !e)}
            title={expanded ? "Collapse" : "Show more"}
            style={{
              width: 22, height: 22, borderRadius: "50%", border: `1px solid ${T.dim}`,
              background: "transparent", color: T.muted, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.7rem", fontFamily: T.bodyFont, lineHeight: 1, flexShrink: 0,
              transition: "transform 0.2s ease",
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >▾</button>
        )}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {top.map(([user, count], i) => (
          <div key={user} style={{
            display: "flex", alignItems: "center", gap: 6, padding: "5px 11px",
            borderRadius: T.isXP ? 2 : 20, fontSize: "0.78rem", fontFamily: T.bodyFont,
            ...(T.reactionBtn.inactive),
          }}>
            <span>{medals[i] || `#${i + 1}`}</span>
            <span style={{ color: T.subText }}>{user}</span>
            <span style={{ color: T.muted }}>· {count}</span>
          </div>
        ))}
      </div>
      {rest.length > 0 && expanded && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 10px", marginTop: 7, paddingTop: 7, borderTop: `1px solid ${T.dim}` }}>
          {rest.map(([user, count], i) => (
            <span key={user} style={{ fontSize: "0.65rem", fontFamily: T.bodyFont, color: T.muted, opacity: 0.75 }}>
              #{i + 6} {user} · {count}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}


function BgSwitcher({ bgIndex, setBgIndex, customBg, customBgVideo, onUpload, onUploadVideo, onClearCustom, theme, bgFileRef, bgVideoFileRef }) {
  if (theme !== "dark") return null;
  const T = THEMES[theme];
  const label = customBgVideo ? "Video" : customBg ? "Custom image" : DARK_BGS[bgIndex].name;
  const hasCustom = !!(customBg || customBgVideo);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
      <button
        onClick={() => { if (hasCustom) onClearCustom(); setBgIndex(i => (i + 1) % DARK_BGS.length); }}
        title={`Background: ${label} (click to ${hasCustom ? "switch to presets" : "cycle presets"})`}
        style={{
          background: "transparent", border: `1px solid ${T.dim}`, color: T.muted,
          borderRadius: 20, padding: "5px 11px", fontSize: "0.75rem", cursor: "pointer",
          fontFamily: T.bodyFont, display: "flex", alignItems: "center", gap: 5,
        }}
      >
        🎨 {label}
      </button>
      <button
        onClick={() => bgFileRef.current?.click()}
        title="Upload a custom background image"
        style={{
          background: "transparent", border: `1px solid ${T.dim}`, color: T.muted,
          borderRadius: 20, padding: "5px 9px", fontSize: "0.75rem", cursor: "pointer",
          fontFamily: T.bodyFont, display: "flex", alignItems: "center",
        }}
      >🖼️</button>
      <button
        onClick={() => bgVideoFileRef.current?.click()}
        title="Upload a video background (plays behind the page as you scroll)"
        style={{
          background: "transparent", border: `1px solid ${T.dim}`, color: T.muted,
          borderRadius: 20, padding: "5px 9px", fontSize: "0.75rem", cursor: "pointer",
          fontFamily: T.bodyFont, display: "flex", alignItems: "center",
        }}
      >🎬</button>
      {hasCustom && (
        <button
          onClick={onClearCustom}
          title="Remove custom background"
          style={{
            background: "transparent", border: `1px solid ${T.dim}`, color: T.muted,
            borderRadius: 20, padding: "5px 9px", fontSize: "0.75rem", cursor: "pointer",
            fontFamily: T.bodyFont, display: "flex", alignItems: "center",
          }}
        >✕</button>
      )}
      <input
        ref={bgFileRef}
        type="file"
        accept="image/*"
        onChange={async e => { const f = e.target.files[0]; if (f) await onUpload(f); e.target.value = ""; }}
        style={{ display: "none" }}
      />
      <input
        ref={bgVideoFileRef}
        type="file"
        accept="video/*"
        onChange={e => { const f = e.target.files[0]; if (f) onUploadVideo(f); e.target.value = ""; }}
        style={{ display: "none" }}
      />
    </div>
  );
}


function PostActions({ post, theme, onUpdate, myReacted, onReact }) {
  const T = THEMES[theme];
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyUser, setReplyUser] = useState(() => genUsername());
  const [busy, setBusy] = useState(false);

  const reactions = post.reactions || {};
  const replies = post.replies || [];

  const submitReply = async () => {
    if (!replyText.trim() || busy) return;
    setBusy(true);
    const reply = { id: Date.now(), text: replyText.trim(), ts: Date.now(), username: replyUser || "anon" };
    const newPost = { ...post, replies: [...replies, reply] };
    try {
      await window.storage.set(`slop:${post.id}`, JSON.stringify(newPost), true);
      onUpdate(newPost);
      setReplyText("");
    } catch {}
    setBusy(false);
  };

  const totalReactions = Object.values(reactions).reduce((a, b) => a + b, 0);

  return (
    <div style={{ borderTop: `1px solid ${T.isXP ? "#ACA899" : T.dim}` }}>
      {/* reaction bar */}
      <div style={{
        display: "flex", flexWrap: "wrap", gap: 4, padding: "8px 12px",
        ...T.reactionBar,
      }}>
        {REACTION_EMOJIS.map(emoji => {
          const count = reactions[emoji] || 0;
          const active = myReacted.includes(emoji);
          return (
            <button
              key={emoji}
              onClick={() => onReact(post, emoji)}
              style={{
                padding: "2px 7px", fontSize: "0.8rem", cursor: "pointer",
                borderRadius: T.isXP ? 2 : 20,
                fontFamily: T.bodyFont,
                transition: "all 0.15s",
                ...(active ? T.reactionBtn.active : T.reactionBtn.inactive),
              }}
            >
              {emoji}{count > 0 ? ` ${count}` : ""}
            </button>
          );
        })}
        <button
          onClick={() => setShowReplies(v => !v)}
          style={{
            marginLeft: "auto", padding: "2px 8px", fontSize: "0.72rem",
            cursor: "pointer", borderRadius: T.isXP ? 2 : 20,
            fontFamily: T.bodyFont,
            ...(showReplies ? T.reactionBtn.active : T.reactionBtn.inactive),
          }}
        >
          💬 {replies.length > 0 ? replies.length : ""}{showReplies ? " ▲" : " ▼"}
        </button>
      </div>

      {/* replies section */}
      {showReplies && (
        <div style={{ padding: "10px 12px 12px", ...T.replyArea }}>
          {replies.length === 0 && (
            <p style={{ margin: "0 0 8px", fontSize: "0.75rem", color: T.muted, fontFamily: T.bodyFont, fontStyle: "italic" }}>
              no replies yet
            </p>
          )}
          {replies.map(r => (
            <div key={r.id} style={{ marginBottom: 8, paddingLeft: 10, borderLeft: `2px solid ${T.accent}` }}>
              <p style={{ margin: 0, fontSize: "0.83rem", color: T.subText, fontFamily: T.bodyFont, lineHeight: 1.5, wordBreak: "break-word" }}>{r.text}</p>
              <span style={{ fontSize: "0.65rem", color: T.replyText, fontFamily: T.bodyFont }}>{r.username || T.postLabel} · {ago(r.ts)}</span>
            </div>
          ))}
          {/* reply input */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 10 }}>
            <div style={{ display: "flex", gap: 6 }}>
              <input
                value={replyUser}
                onChange={e => setReplyUser(e.target.value)}
                maxLength={32}
                placeholder="your handle"
                style={{
                  flex: 1, fontSize: "0.75rem", padding: "4px 8px",
                  fontFamily: T.bodyFont, color: T.text, outline: "none",
                  borderRadius: T.isXP ? 2 : 6, ...T.replyInput,
                }}
              />
              <button onClick={() => setReplyUser(genUsername())} title="Random" style={{
                padding: "4px 8px", background: T.accent, color: T.accentText,
                border: "none", borderRadius: T.isXP ? 2 : 6, cursor: "pointer", fontSize: "0.75rem",
              }}>🎲</button>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <input
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                onKeyDown={e => e.key === "Enter" && submitReply()}
                placeholder={theme === "y2k" ? "reply here... :)" : theme === "xp" ? "Type a reply..." : "reply..."}
                style={{
                  flex: 1, fontSize: "0.82rem", padding: "5px 9px",
                  fontFamily: T.bodyFont, color: T.text, outline: "none",
                  borderRadius: T.isXP ? 2 : 6, ...T.replyInput,
                }}
              />
              <button
                onClick={submitReply}
                disabled={!replyText.trim() || busy}
                style={{
                  padding: "5px 12px", fontSize: "0.8rem", cursor: "pointer",
                  background: replyText.trim() ? T.accent : T.dim,
                  color: replyText.trim() ? T.accentText : T.muted,
                  border: "none", borderRadius: T.isXP ? 2 : 6, fontFamily: T.bodyFont,
                }}
              >{T.isXP ? "Reply" : "↩"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── XP chrome wrapper ───────────────────────────────────────────────────────
function XPWindow({ children }) {
  const [time, setTime] = useState(() => {
    const d = new Date(); let h = d.getHours(), m = d.getMinutes();
    const ap = h >= 12 ? "PM" : "AM"; h = h % 12 || 12;
    return `${h}:${String(m).padStart(2, "0")} ${ap}`;
  });
  useEffect(() => {
    const iv = setInterval(() => {
      const d = new Date(); let h = d.getHours(), m = d.getMinutes();
      const ap = h >= 12 ? "PM" : "AM"; h = h % 12 || 12;
      setTime(`${h}:${String(m).padStart(2, "0")} ${ap}`);
    }, 10000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div style={{ padding: "12px 12px 0" }}>
      <div style={{ border: "2px solid #0054E3", borderRadius: "8px 8px 4px 4px", overflow: "hidden", background: "#ECE9D8" }}>
        <div style={{ background: "linear-gradient(to bottom, #1B6FCC 0%, #3D9BF0 8%, #0D5DB0 100%)", padding: "4px 6px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "white", fontFamily: "'Tahoma', sans-serif", fontSize: 12, fontWeight: "bold" }}>
            <span style={{ width: 16, height: 16, background: "#FFD700", border: "1px solid #B8860B", borderRadius: 2, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>🌐</span>
            Slop Zone — Internet Explorer
          </div>
          <div style={{ display: "flex", gap: 2 }}>
            {["_","□"].map(s => (
              <div key={s} style={{ width: 21, height: 21, borderRadius: 3, border: "1px solid rgba(0,0,0,0.4)", background: "linear-gradient(to bottom,#f0f0f0,#d0d0d0)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: "bold", cursor: "pointer" }}>{s}</div>
            ))}
            <div style={{ width: 21, height: 21, borderRadius: 3, border: "1px solid rgba(0,0,0,0.4)", background: "linear-gradient(to bottom,#e05050,#b02020)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, cursor: "pointer" }}>✕</div>
          </div>
        </div>
        <div style={{ background: "#ECE9D8", borderBottom: "1px solid #ACA899", padding: "2px 4px", display: "flex", gap: 2 }}>
          {["File","Edit","View","Favorites","Tools","Help"].map(m => (
            <span key={m} style={{ fontFamily: "'Tahoma',sans-serif", fontSize: 11, padding: "2px 8px", cursor: "pointer", borderRadius: 2 }}
              onMouseEnter={e => { e.target.style.background="#316AC5"; e.target.style.color="white"; }}
              onMouseLeave={e => { e.target.style.background=""; e.target.style.color=""; }}
            >{m}</span>
          ))}
        </div>
        <div style={{ background: "#fff", margin: "4px 6px", padding: "3px 8px", display: "flex", alignItems: "center", gap: 6, border: "2px inset #888" }}>
          <span style={{ fontFamily: "'Tahoma',sans-serif", fontSize: 11, color: "#666" }}>Address</span>
          <div style={{ flex: 1, background: "#fff", border: "1px solid #7F9DB9", padding: "2px 6px", fontFamily: "'Tahoma',sans-serif", fontSize: 11 }}>http://www.slopzone.net/</div>
        </div>
        <div style={{ padding: "8px 16px", borderBottom: "1px solid #ACA899", background: "#ECE9D8" }}>
          <span style={{ fontFamily: "'Tahoma',sans-serif", fontSize: 13, fontWeight: "bold" }}>Slop Zone</span>
          <span style={{ fontFamily: "'Tahoma',sans-serif", fontSize: 11, color: "#666", marginLeft: 8 }}>— anonymous posts</span>
        </div>
        {children}
      </div>
      <div style={{ background: "linear-gradient(to bottom,#1F5BBB,#2F74D3)", borderTop: "2px solid #1F5BBB", padding: "3px 6px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ background: "linear-gradient(to bottom,#5A9D18,#3D7A0E)", border: "1px solid #2A5A08", borderRadius: 12, color: "white", fontFamily: "'Tahoma',sans-serif", fontSize: 13, fontWeight: "bold", padding: "4px 14px 4px 8px", cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>🪟 start</div>
          <div style={{ background: "rgba(0,0,0,0.25)", border: "1px solid rgba(0,0,0,0.3)", borderRadius: 2, color: "white", fontFamily: "'Tahoma',sans-serif", fontSize: 11, padding: "3px 10px" }}>📄 Slop Zone</div>
        </div>
        <div style={{ color: "white", fontFamily: "'Tahoma',sans-serif", fontSize: 11, background: "rgba(0,0,0,0.2)", padding: "3px 8px", borderRadius: 2 }}>{time}</div>
      </div>
    </div>
  );
}

// ── Main app ────────────────────────────────────────────────────────────────
export default function App() {
  const [theme, setTheme] = useState("dark");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [modal, setModal] = useState(false);
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [username, setUsername] = useState(() => genUsername());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [bgIndex, setBgIndex] = useState(0);
  const [customBg, setCustomBg] = useState(null);
  const [customBgVideo, setCustomBgVideo] = useState(null);
  const [videoBgError, setVideoBgError] = useState("");
  const [videoBgNeedsTap, setVideoBgNeedsTap] = useState(false);
  const [myReactions, setMyReactions] = useState({});
  const [recentPosts, setRecentPosts] = useState([]);
  const [cooldownUntil, setCooldownUntil] = useState(0);
  const [nowTick, setNowTick] = useState(Date.now());
  const [postType, setPostType] = useState("meme");
  const [quoteAuthor, setQuoteAuthor] = useState("");
  const [codeLang, setCodeLang] = useState("JavaScript");
  const fileRef = useRef();
  const bgFileRef = useRef();
  const bgVideoFileRef = useRef();
  const videoBgRef = useRef();
  const sentinelRef = useRef();
  const allKeysRef = useRef([]);
  const offsetRef = useRef(0);
  const hasMoreRef = useRef(false);
  const loadingMoreRef = useRef(false);

  const T = THEMES[theme];

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Bangers&family=Space+Grotesk:wght@400;500&family=VT323&display=swap";
    document.head.appendChild(link);
    const style = document.createElement("style");
    style.textContent = `
      * { box-sizing: border-box; }
      body { margin: 0; }
      .masonry { columns: 2; column-gap: 14px; }
      .card { break-inside: avoid; margin-bottom: 14px; }
      @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
      .marquee { display: inline-block; animation: marquee 22s linear infinite; white-space: nowrap; }
      @keyframes rgbCycle { 0% { filter: hue-rotate(0deg) saturate(1.4); } 100% { filter: hue-rotate(360deg) saturate(1.4); } }
      .rgb-cycle { animation: rgbCycle 2.5s linear infinite; }
      .post-card { transition: transform 0.18s ease, filter 0.18s ease, box-shadow 0.18s ease; }
      .post-card:hover { transform: scale(1.025); filter: brightness(1.12); z-index: 2; }
    `;
    document.head.appendChild(style);
    init();
    (async () => {
      try {
        const saved = await window.storage.get("dark-bg-image", false);
        if (saved?.value) setCustomBg(saved.value);
      } catch {}
    })();
    (async () => {
      try {
        const saved = await window.storage.get("my-reactions", false);
        if (saved?.value) setMyReactions(JSON.parse(saved.value));
      } catch {}
    })();
    (async () => {
      try {
        const saved = await window.storage.get("post-cooldown", false);
        if (saved?.value) {
          const data = JSON.parse(saved.value);
          if (data.posts) {
            setRecentPosts(data.posts);
          } else if (data.timestamps) {
            // backward-compat with old format (timestamps only, no username)
            setRecentPosts(data.timestamps.map(ts => ({ ts, username: null })));
          }
          setCooldownUntil(data.until || 0);
        }
      } catch {}
    })();
  }, []);

  useEffect(() => {
    if (cooldownUntil <= Date.now()) return;
    const id = setInterval(() => setNowTick(Date.now()), 250);
    return () => clearInterval(id);
  }, [cooldownUntil]);

  useEffect(() => {
    return () => { if (customBgVideo) URL.revokeObjectURL(customBgVideo); };
  }, [customBgVideo]);

  useEffect(() => {
    if (!customBgVideo) return;
    const v = videoBgRef.current;
    if (!v) return;
    v.muted = true;
    v.playsInline = true;
    const playPromise = v.play();
    if (playPromise && typeof playPromise.then === "function") {
      playPromise
        .then(() => setVideoBgNeedsTap(false))
        .catch(() => setVideoBgNeedsTap(true)); // autoplay blocked — needs a user gesture
    }
  }, [customBgVideo]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(e => { if (e[0].isIntersecting) loadMore(); }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [posts]);

  async function init() {
    setLoading(true);
    try {
      const list = await window.storage.list("slop:", true);
      if (list?.keys?.length) {
        const sorted = [...list.keys].sort((a, b) => parseInt(b.split(":")[1]) - parseInt(a.split(":")[1]));
        allKeysRef.current = sorted;
        const data = await fetchBatch(sorted.slice(0, PAGE));
        setPosts(data);
        offsetRef.current = PAGE;
        hasMoreRef.current = sorted.length > PAGE;
        setHasMore(sorted.length > PAGE);
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  async function loadMore() {
    if (loadingMoreRef.current || !hasMoreRef.current) return;
    loadingMoreRef.current = true; setLoadingMore(true);
    const batch = allKeysRef.current.slice(offsetRef.current, offsetRef.current + PAGE);
    try {
      const data = await fetchBatch(batch);
      setPosts(p => [...p, ...data]);
      offsetRef.current += PAGE;
      const more = offsetRef.current < allKeysRef.current.length;
      hasMoreRef.current = more; setHasMore(more);
    } catch (e) { console.error(e); }
    loadingMoreRef.current = false; setLoadingMore(false);
  }

  async function submit() {
    if (postType === "meme" ? (!text.trim() && !img) : !text.trim()) return;
    if (cooldownUntil > Date.now()) return;
    setBusy(true); setError("");

    if (!window.storage) {
      setError("couldn't save: storage isn't available in this environment.");
      setBusy(false);
      return;
    }

    const post = {
      id: Date.now(), ts: Date.now(), text: text.trim(),
      img: postType === "meme" ? img : null,
      color: pick(T.colors), reactions: {}, replies: [], username,
      type: postType,
      ...(postType === "quote" ? { author: quoteAuthor.trim() } : {}),
      ...(postType === "code" ? { lang: codeLang } : {}),
    };

    const payload = JSON.stringify(post);
    if (payload.length > 4.5 * 1024 * 1024) {
      setError("couldn't save: that image is too large (over the 5MB storage limit). try a smaller image.");
      setBusy(false);
      return;
    }

    const trySave = async (attempt) => {
      try {
        await window.storage.set(`slop:${post.id}`, payload, true);
      } catch (e) {
        if (attempt < 1) {
          await new Promise(r => setTimeout(r, 700));
          return trySave(attempt + 1);
        }
        throw e;
      }
    };

    try {
      await trySave(0);
      allKeysRef.current = [`slop:${post.id}`, ...allKeysRef.current];
      offsetRef.current += 1;
      setPosts(p => [post, ...p]);
      setText(""); setImg(null); setModal(false); setPostType("meme"); setQuoteAuthor("");

      const updated = [...recentPosts, { ts: Date.now(), username }].slice(-3);
      let until = cooldownUntil;
      if (updated.length === 3 && Date.now() - updated[0].ts < 60000) {
        until = Date.now() + 60000;
      }
      setRecentPosts(updated);
      setCooldownUntil(until);
      try { await window.storage.set("post-cooldown", JSON.stringify({ posts: updated, until }), false); } catch {}
    } catch (e) {
      console.error("post save failed:", e);
      setError(`couldn't save${e?.message ? `: ${e.message}` : ""}. try again in a moment.`);
    }
    setBusy(false);
  }

  const updatePost = useCallback((updated) => {
    setPosts(ps => ps.map(p => p.id === updated.id ? updated : p));
  }, []);

  const openModal = () => setModal(true);
  const closeModal = () => { setModal(false); setText(""); setImg(null); setError(""); setPostType("meme"); setQuoteAuthor(""); };
  const onCooldown = cooldownUntil > nowTick;
  const cooldownSecs = Math.max(0, Math.ceil((cooldownUntil - nowTick) / 1000));
  const canSubmit = !busy && !onCooldown && (postType === "meme" ? (text.trim() || img) : text.trim().length > 0);

  const handleBgUpload = async (file) => {
    const dataUrl = await compressImage(file);
    if (customBgVideo) setCustomBgVideo(null);
    setVideoBgError(""); setVideoBgNeedsTap(false);
    setCustomBg(dataUrl);
    try { await window.storage.set("dark-bg-image", dataUrl, false); } catch {}
  };
  const handleBgVideoUpload = async (file) => {
    setVideoBgError(""); setVideoBgNeedsTap(false);
    if (!file.type.startsWith("video/")) {
      setVideoBgError("that doesn't look like a video file.");
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      setVideoBgError(`that video is ${(file.size / (1024 * 1024)).toFixed(1)}MB — keep it under 12MB, larger files often fail to load as a background.`);
      return;
    }
    // .mov reports as video/quicktime, which Chrome/Firefox/Edge reject for <video>
    // outright — regardless of the codec inside. Only Safari plays this natively.
    if (file.type === "video/quicktime" || /\.(mov|qt)$/i.test(file.name)) {
      setVideoBgError(".mov files use the video/quicktime type, which Chrome, Firefox, and Edge refuse to play in <video> — even if the footage inside is H.264. Convert it to .mp4 (H.264 video) and try again.");
      return;
    }
    // Lightweight codec sniff: look for HEVC sample-description FourCCs (hev1/hvc1)
    // without a matching H.264 one (avc1/avc3). HEVC support in Chrome depends on
    // OS/hardware decoders that vary by machine — likely culprit for iPhone clips.
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const has = (code) => {
        const t = Array.from(code, c => c.charCodeAt(0));
        for (let i = 0; i < bytes.length - 4; i++) {
          if (bytes[i] === t[0] && bytes[i+1] === t[1] && bytes[i+2] === t[2] && bytes[i+3] === t[3]) return true;
        }
        return false;
      };
      if ((has("hev1") || has("hvc1")) && !has("avc1") && !has("avc3")) {
        setVideoBgError("this video looks like it's encoded with HEVC/H.265 (common for iPhone clips) — browser support for that depends on your OS and hardware. Re-encode to H.264 (e.g. ffmpeg -i input.mp4 -c:v libx264 -c:a aac output.mp4) and try again.");
        return;
      }
    } catch {}
    const reader = new FileReader();
    reader.onload = (e) => {
      setCustomBgVideo(e.target.result); // data: URL — works even in sandboxed iframes
      if (customBg) {
        setCustomBg(null);
        window.storage.delete("dark-bg-image", false).catch(() => {});
      }
    };
    reader.onerror = () => setVideoBgError("couldn't read that video file — try a smaller one.");
    reader.readAsDataURL(file);
    // Note: video backgrounds are NOT persisted — they're typically way over
    // the 5MB storage-per-key limit, so this only lasts for the current session.
  };
  const clearCustomBg = async () => {
    setCustomBg(null);
    setCustomBgVideo(null);
    setVideoBgError(""); setVideoBgNeedsTap(false);
    try { await window.storage.delete("dark-bg-image", false); } catch {}
  };

  const toggleReaction = useCallback((post, emoji) => {
    const mine = myReactions[post.id] || [];
    const already = mine.includes(emoji);
    const reactions = { ...(post.reactions || {}) };
    reactions[emoji] = Math.max(0, (reactions[emoji] || 0) + (already ? -1 : 1));
    const newPost = { ...post, reactions };
    const newMine = already ? mine.filter(e => e !== emoji) : [...mine, emoji];
    const newMyReactions = { ...myReactions, [post.id]: newMine };

    // optimistic: update UI immediately
    setPosts(ps => ps.map(p => p.id === post.id ? newPost : p));
    setMyReactions(newMyReactions);

    // persist in the background, in parallel — roll back UI if it fails
    Promise.all([
      window.storage.set(`slop:${post.id}`, JSON.stringify(newPost), true),
      window.storage.set("my-reactions", JSON.stringify(newMyReactions), false),
    ]).catch(() => {
      setPosts(ps => ps.map(p => p.id === post.id ? post : p));
      setMyReactions(myReactions);
    });
  }, [myReactions]);

  const visiblePosts = filterType === "all" ? posts : posts.filter(p => (p.type || "meme") === filterType);

  const postCard = (p) => {
    const pType = p.type || "meme";
    const isByuan = (p.text || "").trim().toLowerCase() === "byuan" && (p.reactions?.["🔥"] || 0) > 0;
    return (
    <div key={p.id} className="card">
      <div
        className={`post-card${isByuan ? " rgb-cycle" : ""}`}
        style={{
          borderRadius: T.cardRadius, overflow: "hidden", background: T.cardBg, ...T.cardBorder(p.color),
          ...(isByuan ? { boxShadow: "0 0 20px 3px rgba(255,0,90,0.6)" } : {}),
        }}
      >
        {pType === "code" ? (
          <div style={{ background: "#1e1e1e" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 12px", background: "#2d2d2d", borderBottom: "1px solid #383838" }}>
              <span style={{ fontFamily: "'Space Grotesk', monospace", fontSize: "0.68rem", color: "#9d9d9d", letterSpacing: "0.5px", textTransform: "uppercase" }}>💻 {p.lang || "Code"}</span>
              <span style={{ fontFamily: "'Space Grotesk', monospace", fontSize: "0.68rem", color: "#9d9d9d" }}>{formatSize(p.text)}</span>
            </div>
            <pre style={{ margin: 0, padding: "12px 14px", overflowX: "auto", fontSize: "0.78rem", lineHeight: 1.55, color: "#e4e4e4", fontFamily: "'Fira Code', 'Consolas', monospace" }}><code>{p.text}</code></pre>
          </div>
        ) : pType === "quote" ? (
          <div style={{ padding: "20px 18px 12px" }}>
            <div style={{ fontSize: "2.2rem", lineHeight: 0.6, color: T.accent, fontFamily: T.logoFont, ...(theme === "y2k" ? T.logoGlow : {}) }}>"</div>
            <p style={{ margin: "6px 0 10px", fontSize: "1.02rem", fontStyle: "italic", lineHeight: 1.65, color: T.subText, whiteSpace: "pre-wrap", wordBreak: "break-word", fontFamily: T.bodyFont }}>{p.text}</p>
            {p.author && <div style={{ textAlign: "right", fontSize: "0.78rem", color: T.muted, fontFamily: T.bodyFont }}>— {p.author}</div>}
          </div>
        ) : (
          <>
            {p.img && <img src={p.img} alt="" style={{ width: "100%", display: "block" }} />}
            {p.text && (
              <p style={{ margin: 0, padding: p.img ? "11px 14px 6px" : "14px 14px 6px", fontSize: "0.93rem", lineHeight: 1.65, color: T.subText, whiteSpace: "pre-wrap", wordBreak: "break-word", fontFamily: T.bodyFont }}>
                {p.text}
              </p>
            )}
          </>
        )}
        <div style={{ padding: "5px 14px 8px", fontSize: "0.69rem", color: T.dim, fontFamily: T.bodyFont }}>
          {p.username || T.postLabel} · {ago(p.ts)}
        </div>
        <PostActions post={p} theme={theme} onUpdate={updatePost} myReacted={myReactions[p.id] || []} onReact={toggleReaction} />
      </div>
    </div>
  );
  };

  const feed = (
    <div style={{ maxWidth: 920, margin: "0 auto", padding: T.isXP ? "16px 16px 0" : "20px 16px" }}>
      {!loading && posts.length > 0 && <Leaderboard posts={posts} theme={theme} />}
      {!loading && posts.length > 0 && (
        <FilterTabs filterType={filterType} setFilterType={setFilterType} theme={theme} />
      )}
      {loading ? (
        <p style={{ color: T.loadColor, textAlign: "center", marginTop: 100, fontFamily: T.logoFont, fontSize: "1.4rem", letterSpacing: "2px" }}>
          {T.loadingMsg}
        </p>
      ) : posts.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: 110 }}>
          <div style={{ fontFamily: T.logoFont, fontSize: "2.6rem", color: T.emptyTitle, letterSpacing: "3px" }}>{T.emptyHeading}</div>
          <div style={{ color: T.emptyBody, marginTop: 8, fontSize: "0.9rem", fontFamily: T.bodyFont }}>{T.emptyAction}</div>
          <button onClick={openModal} style={{ marginTop: 24, background: T.accent, color: T.accentText, border: "none", padding: "10px 28px", cursor: "pointer", ...T.dumpBtn, fontSize: theme === "y2k" ? "1rem" : "1.3rem" }}>{T.emptyBtn}</button>
        </div>
      ) : (
        <>
          {visiblePosts.length === 0 ? (
            <div style={{ textAlign: "center", marginTop: 60 }}>
              <div style={{ color: T.emptyBody, fontSize: "0.9rem", fontFamily: T.bodyFont }}>
                nothing in {POST_TYPES.find(t => t.id === filterType)?.label.toLowerCase() || "this section"} yet
              </div>
            </div>
          ) : (
            <div className="masonry">{visiblePosts.map(postCard)}</div>
          )}
          <div ref={sentinelRef} style={{ textAlign: "center", padding: "24px 0 80px" }}>
            {loadingMore && <span style={{ color: T.loadColor, fontFamily: T.logoFont, fontSize: "1rem", letterSpacing: "2px" }}>LOADING MORE...</span>}
            {!hasMore && !loadingMore && <span style={{ color: T.endColor, fontSize: "0.75rem", fontFamily: T.bodyFont }}>{T.endMsg}</span>}
          </div>
        </>
      )}
    </div>
  );

  const modalEl = modal && (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={closeModal}>
      <div style={{ background: T.modalBg, padding: 0, width: "100%", maxWidth: 460, border: T.modalBorder, ...(T.isXP ? { borderRadius: "8px 8px 4px 4px", overflow: "hidden" } : { borderRadius: T.cardRadius }) }} onClick={e => e.stopPropagation()}>
        {T.isXP && (
          <div style={{ background: "linear-gradient(to bottom,#1B6FCC 0%,#3D9BF0 8%,#0D5DB0 100%)", padding: "4px 6px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "white", fontFamily: "'Tahoma',sans-serif", fontSize: 12, fontWeight: "bold" }}>✏️ {T.modalTitle}</div>
            <div onClick={closeModal} style={{ width: 21, height: 21, borderRadius: 3, border: "1px solid rgba(0,0,0,0.4)", background: "linear-gradient(to bottom,#e05050,#b02020)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, cursor: "pointer" }}>✕</div>
          </div>
        )}
        <div style={{ padding: 28 }}>
          {!T.isXP && (
            <h2 style={{ fontFamily: T.logoFont, fontSize: theme === "y2k" ? "1.7rem" : "1.9rem", color: T.accent, margin: "0 0 16px", letterSpacing: "1px", ...(theme === "y2k" ? T.logoGlow : {}) }}>{T.modalTitle}</h2>
          )}
          {/* post type selector */}
          <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
            {POST_TYPES.map(pt => {
              const active = postType === pt.id;
              return (
                <button key={pt.id} onClick={() => setPostType(pt.id)} style={{
                  flex: 1, padding: "7px 6px", fontSize: "0.8rem", cursor: "pointer",
                  fontFamily: T.bodyFont, borderRadius: T.cardRadius,
                  border: active ? `1px solid ${T.accent}` : `1px solid ${T.inputBorder}`,
                  background: active ? T.accent : "transparent",
                  color: active ? T.accentText : T.muted,
                  transition: "all 0.15s",
                }}>
                  {pt.icon} {pt.label}
                </button>
              );
            })}
          </div>
          {/* username row */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              maxLength={32}
              placeholder="your handle"
              style={{
                flex: 1, background: T.inputBg, border: `1px solid ${T.inputBorder}`,
                borderRadius: T.cardRadius, color: T.text, fontFamily: T.bodyFont,
                fontSize: "0.82rem", padding: "7px 10px", outline: "none",
              }}
            />
            <button
              onClick={() => setUsername(genUsername())}
              title="Random username"
              style={{
                padding: "7px 10px", background: T.accent, color: T.accentText,
                border: "none", borderRadius: T.cardRadius, cursor: "pointer",
                fontFamily: T.bodyFont, fontSize: "0.8rem", flexShrink: 0,
              }}
            >🎲</button>
          </div>
          {/* code language picker */}
          {postType === "code" && (
            <select value={codeLang} onChange={e => setCodeLang(e.target.value)} style={{
              width: "100%", marginBottom: 10, background: T.inputBg, border: `1px solid ${T.inputBorder}`,
              borderRadius: T.cardRadius, color: T.text, fontFamily: T.bodyFont,
              fontSize: "0.85rem", padding: "8px 10px", outline: "none",
            }}>
              {CODE_LANGS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          )}
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            rows={postType === "code" ? 8 : 4}
            placeholder={
              postType === "quote" ? "drop the quote here..." :
              postType === "code" ? "paste your code/snippet here..." :
              T.placeholder
            }
            style={{
              width: "100%", background: T.inputBg, border: `1px solid ${T.inputBorder}`,
              borderRadius: T.cardRadius, color: T.text,
              fontFamily: postType === "code" ? "'Fira Code', 'Consolas', monospace" : T.bodyFont,
              fontSize: postType === "code" ? "0.82rem" : "0.93rem",
              padding: "11px 12px", resize: "vertical", outline: "none",
            }}
          />
          {postType === "code" && (
            <div style={{ marginTop: 6, fontSize: "0.7rem", color: T.muted, fontFamily: T.bodyFont, textAlign: "right" }}>
              {formatSize(text)}
            </div>
          )}
          {postType === "quote" && (
            <input
              value={quoteAuthor}
              onChange={e => setQuoteAuthor(e.target.value)}
              maxLength={64}
              placeholder="— source / author (optional)"
              style={{
                width: "100%", marginTop: 10, background: T.inputBg, border: `1px solid ${T.inputBorder}`,
                borderRadius: T.cardRadius, color: T.text, fontFamily: T.bodyFont,
                fontSize: "0.85rem", padding: "8px 10px", outline: "none",
              }}
            />
          )}
          {postType === "meme" && (
          <div style={{ marginTop: 12 }}>
            {img ? (
              <div style={{ position: "relative" }}>
                <img src={img} alt="preview" style={{ width: "100%", borderRadius: T.cardRadius, display: "block" }} />
                <button onClick={() => setImg(null)} style={{ position: "absolute", top: 8, right: 8, background: T.err, border: "none", color: "#fff", width: 28, height: 28, borderRadius: theme === "dark" ? "50%" : 0, cursor: "pointer", fontSize: 18, lineHeight: "28px", padding: 0 }}>×</button>
              </div>
            ) : (
              <button onClick={() => fileRef.current.click()} style={{ width: "100%", padding: 11, background: "transparent", border: `1px dashed ${T.inputBorder}`, borderRadius: T.cardRadius, color: T.muted, cursor: "pointer", fontFamily: T.bodyFont, fontSize: "0.9rem" }}>+ add image (optional)</button>
            )}
            <input ref={fileRef} type="file" accept="image/*" onChange={async e => { const f = e.target.files[0]; if (f) setImg(await compressImage(f)); e.target.value = ""; }} style={{ display: "none" }} />
          </div>
          )}
          {error && <p style={{ color: T.err, fontSize: "0.8rem", margin: "10px 0 0", fontFamily: T.bodyFont }}>{error}</p>}
          {onCooldown && (
            <p style={{ color: T.muted, fontSize: "0.8rem", margin: "10px 0 0", fontFamily: T.bodyFont }}>
              ⏳ posting too fast — chill for {cooldownSecs}s before your next post.
            </p>
          )}
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button onClick={closeModal} style={{ flex: 1, padding: 11, background: "transparent", border: T.cancelBorder, color: T.cancelColor, borderRadius: T.cardRadius, cursor: "pointer", fontFamily: T.bodyFont, fontSize: "0.9rem" }}>cancel</button>
            <button onClick={submit} disabled={!canSubmit} style={{ flex: 2, padding: 11, background: canSubmit ? T.accent : T.inputBg, color: canSubmit ? T.accentText : T.dim, border: "none", borderRadius: T.cardRadius, cursor: canSubmit ? "pointer" : "not-allowed", ...T.dumpBtn, fontSize: theme === "y2k" ? "1rem" : "1.2rem" }}>
              {busy ? "POSTING..." : onCooldown ? `WAIT ${cooldownSecs}s` : T.submitLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const pageBg = theme === "dark"
    ? (customBgVideo
        ? { backgroundColor: "transparent" }
        : customBg
          ? { backgroundColor: DARK_BGS[bgIndex].bg, backgroundImage: `url(${customBg})`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" }
          : { backgroundColor: DARK_BGS[bgIndex].bg })
    : { backgroundColor: T.pageBg };

  const videoBg = (theme === "dark" && customBgVideo) ? (
    <video
      key={customBgVideo}
      ref={videoBgRef}
      src={customBgVideo}
      autoPlay loop muted playsInline
      onLoadedData={() => setVideoBgError("")}
      onError={(e) => {
        const code = e.target?.error?.code;
        const messages = {
          1: "loading was aborted",
          2: "network error while loading the video",
          3: "the video couldn't be decoded — try re-encoding to H.264 (e.g. ffmpeg -c:v libx264)",
          4: "this video's format/codec isn't supported here — try re-encoding to .mp4 with H.264 video (e.g. ffmpeg -c:v libx264 -c:a aac)",
        };
        setVideoBgError(`video background failed: ${messages[code] || "unknown error"} (code ${code ?? "?"})`);
      }}
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0, pointerEvents: "none" }}
    />
  ) : null;

  if (T.isXP) {
    return (
      <div style={{ minHeight: "100vh", ...pageBg, color: T.text, fontFamily: T.bodyFont, transition: "background 0.25s" }}>
        {videoBg}
        {customBgVideo && <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1, pointerEvents: "none" }} />}
        <div style={{ position: "relative", zIndex: 2 }}>
        <XPWindow>
          <div style={{ padding: "8px 16px", display: "flex", justifyContent: "flex-end", background: "#ECE9D8", borderBottom: "1px solid #ACA899" }}>
            <button onClick={openModal} style={{ background: T.accent, color: T.accentText, border: "none", padding: "5px 14px", cursor: "pointer", ...T.dumpBtn }}>New Post</button>
          </div>
          {feed}
        </XPWindow>
        {modalEl}
        <FloatingThemeSwitcher theme={theme} setTheme={setTheme} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", ...pageBg, ...T.pageExtra, color: T.text, fontFamily: T.bodyFont, transition: "background 0.25s" }}>
      {videoBg}
      {customBgVideo && <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1, pointerEvents: "none" }} />}
      <div style={{ position: "relative", zIndex: 2 }}>
      <nav style={{ padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, borderBottom: T.navBorder, background: (theme === "dark" && customBgVideo) ? "rgba(10,10,10,0.55)" : T.navBg, backdropFilter: (theme === "dark" && customBgVideo) ? "blur(6px)" : "none", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ minWidth: 0, display: "flex", alignItems: "baseline", gap: 10, overflow: "hidden", whiteSpace: "nowrap" }}>
          <span style={{ fontFamily: T.logoFont, fontSize: T.logoSize, letterSpacing: T.logoSpacing, color: T.logoColor, flexShrink: 0, ...T.logoGlow }}>SLOP ZONE</span>
          <span style={{ fontSize: "clamp(0.35rem, 1.6vw, 0.75rem)", color: T.muted, flexShrink: 1, minWidth: 0, whiteSpace: "nowrap" }}>{theme === "y2k" ? "★ anonymous guestbook ★" : "anonymous · post anything"}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <BgSwitcher bgIndex={bgIndex} setBgIndex={setBgIndex} customBg={customBg} customBgVideo={customBgVideo} onUpload={handleBgUpload} onUploadVideo={handleBgVideoUpload} onClearCustom={clearCustomBg} bgFileRef={bgFileRef} bgVideoFileRef={bgVideoFileRef} theme={theme} />
          <button onClick={openModal} style={{ background: T.accent, color: T.accentText, border: "none", padding: "8px 18px", cursor: "pointer", flexShrink: 0, ...T.dumpBtn }}>+ DUMP IT</button>
        </div>
      </nav>
      {T.marquee && (
        <div style={{ background: "#000060", borderBottom: "2px solid #FF00FF", padding: "5px 0", overflow: "hidden" }}>
          <span className="marquee" style={{ color: "#FFFF00", fontFamily: "'Comic Sans MS', cursive", fontSize: "0.82rem" }}>{T.marquee}</span>
        </div>
      )}
      {feed}
      {modalEl}
      <FloatingThemeSwitcher theme={theme} setTheme={setTheme} />
      {theme === "dark" && customBgVideo && videoBgNeedsTap && (
        <button
          onClick={() => {
            const v = videoBgRef.current;
            if (!v) return;
            v.muted = true;
            v.play().then(() => setVideoBgNeedsTap(false)).catch(() => {});
          }}
          style={{
            position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 999,
            background: "rgba(0,0,0,0.5)", border: "none", color: "#fff",
            fontFamily: T.bodyFont, fontSize: "1rem", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          }}
        >
          ▶ tap to start the background video
        </button>
      )}
      {theme === "dark" && videoBgError && (
        <div style={{
          position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)", zIndex: 999,
          background: "rgba(20,0,0,0.92)", border: `1px solid ${T.err}`, borderRadius: T.cardRadius,
          color: "#fff", fontFamily: T.bodyFont, fontSize: "0.8rem", padding: "10px 16px",
          maxWidth: "90vw", textAlign: "center", display: "flex", alignItems: "center", gap: 10,
        }}>
          ⚠️ {videoBgError}
          <button onClick={() => clearCustomBg()} style={{ background: "transparent", border: `1px solid ${T.dim}`, color: "#fff", borderRadius: 20, padding: "2px 9px", cursor: "pointer", fontFamily: T.bodyFont, fontSize: "0.75rem" }}>dismiss</button>
        </div>
      )}
      </div>
    </div>
  );
}