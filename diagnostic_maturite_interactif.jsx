import { useState, useMemo, useEffect, useRef } from "react";

const axes = [
  {
    id: "strat", icon: "\u{1F3AF}", label: "Strat\u00e9gie digitale",
    desc: "\u00c9value la pr\u00e9sence d\u2019une vision digitale, d\u2019une roadmap et d\u2019une gouvernance.",
    questions: [
      { q: "Avez-vous une vision digitale formalis\u00e9e et partag\u00e9e ?", levels: ["Aucune vision", "\u00c9mergente informelle", "Document \u00e9crit", "Roadmap + KPIs", "Revue trimestrielle"] },
      { q: "Qui porte la transformation digitale ? Y a-t-il un sponsor COMEX ?", levels: ["Personne", "Un passionn\u00e9 isol\u00e9", "Responsable d\u00e9di\u00e9", "Sponsor COMEX", "Le CEO lui-m\u00eame"] },
      { q: "Quel % du budget annuel est allou\u00e9 au digital ?", levels: ["< 1%", "1-3%", "3-5%", "5-10%", "> 10%"] },
      { q: "Comment priorisez-vous vos projets digitaux ?", levels: ["Au feeling", "Liste non prioris\u00e9e", "Crit\u00e8res informels", "Matrice formalis\u00e9e", "Portfolio management"] },
      { q: "Mesurez-vous le ROI de vos initiatives digitales ?", levels: ["Jamais", "Rarement", "Sur certains projets", "Syst\u00e9matiquement", "Dashboard temps r\u00e9el"] },
    ]
  },
  {
    id: "data", icon: "\u{1F4CA}", label: "Data & analytics",
    desc: "\u00c9value la capacit\u00e9 \u00e0 collecter, structurer et exploiter les donn\u00e9es.",
    questions: [
      { q: "O\u00f9 vivent vos donn\u00e9es ? Combien de sources diff\u00e9rentes ?", levels: ["Excel/email", "3-5 outils silot\u00e9s", "Centralis\u00e9 partiellement", "R\u00e9f\u00e9rentiel unique", "Data warehouse"] },
      { q: "Quel % de vos d\u00e9cisions est bas\u00e9 sur la data vs l\u2019intuition ?", levels: ["0% data", "20/80", "50/50", "80/20", "Data-driven natif"] },
      { q: "Combien de temps pour produire un reporting mensuel ?", levels: ["> 5 jours", "2-5 jours", "1 jour", "Automatis\u00e9 quotidien", "Temps r\u00e9el self-service"] },
      { q: "Avez-vous une gouvernance data ? Qui est responsable de la qualit\u00e9 ?", levels: ["Aucune", "Informelle", "1 r\u00e9f\u00e9rent", "Data stewards", "CDO + politique formelle"] },
      { q: "Utilisez-vous de l\u2019analytics avanc\u00e9 ou du pr\u00e9dictif ?", levels: ["Aucun", "Tableaux basiques", "Dashboards BI", "Mod\u00e8les ponctuels", "IA/ML en production"] },
    ]
  },
  {
    id: "process", icon: "\u2699\uFE0F", label: "Processus & automatisation",
    desc: "\u00c9value le niveau de digitalisation et d\u2019automatisation des workflows.",
    questions: [
      { q: "Vos 3 processus les plus chronophages sont-ils automatis\u00e9s ?", levels: ["100% manuels", "Quelques macros", "Partiellement auto.", "Majoritairement auto.", "Fully automated"] },
      { q: "Combien de ressaisies manuelles par jour entre vos outils ?", levels: ["> 20/jour", "10-20", "5-10", "< 5", "Z\u00e9ro"] },
      { q: "Utilisez-vous des outils d\u2019automatisation (n8n, Zapier, Make) ?", levels: ["Jamais entendu parler", "Conna\u00eet mais non", "Quelques-uns", "Workflows structur\u00e9s", "Orchestration compl\u00e8te"] },
      { q: "Comment g\u00e9rez-vous les validations internes ?", levels: ["Email + relances", "Email + Excel", "Outil basique", "Workflow d\u00e9di\u00e9", "Automatis\u00e9 avec SLA"] },
      { q: "Si un employ\u00e9 cl\u00e9 part, ses processus sont-ils document\u00e9s ?", levels: ["Rien", "Dans les t\u00eates", "Doc partielle", "Processus doc.", "Doc. + automatis\u00e9s"] },
    ]
  },
  {
    id: "techno", icon: "\u{1F5A5}\uFE0F", label: "Infrastructure & outils",
    desc: "\u00c9value la modernit\u00e9 du SI, l\u2019int\u00e9gration des outils et la capacit\u00e9 \u00e0 \u00e9voluer.",
    questions: [
      { q: "Vos 5 outils principaux sont-ils connect\u00e9s ou en silos ?", levels: ["Isol\u00e9s", "Exports manuels", "Int\u00e9grations ponctuelles", "API connect\u00e9es", "Plateforme int\u00e9gr\u00e9e"] },
      { q: "Votre infra est-elle on-premise, cloud ou hybride ?", levels: ["On-premise legacy", "On-premise modernis\u00e9", "Hybride", "Cloud-first", "Cloud-native"] },
      { q: "Quel est l\u2019\u00e2ge moyen de vos logiciels m\u00e9tiers ?", levels: ["> 10 ans", "5-10 ans", "< 5 ans", "Mis \u00e0 jour r\u00e9guli\u00e8rement", "SaaS evergreen"] },
      { q: "Avez-vous une politique de cybers\u00e9curit\u00e9 ?", levels: ["Aucune", "Antivirus basique", "Backup non test\u00e9", "Politique + backup", "SOC + PRA test\u00e9"] },
      { q: "Vos \u00e9quipes peuvent-elles travailler \u00e0 distance ?", levels: ["Impossible", "VPN bricol\u00e9", "Cloud partiel", "Tout accessible", "Full remote natif"] },
    ]
  },
  {
    id: "people", icon: "\u{1F465}", label: "Culture & comp\u00e9tences",
    desc: "\u00c9value l\u2019adoption du digital par les \u00e9quipes et la culture d\u2019innovation.",
    questions: [
      { q: "Comment r\u00e9agissent vos \u00e9quipes \u00e0 un nouvel outil ?", levels: ["R\u00e9sistance forte", "Scepticisme", "Attente prudente", "Curiosit\u00e9 active", "Demande proactive"] },
      { q: "Avez-vous des champions digitaux identifi\u00e9s ?", levels: ["Aucun", "1-2 non identifi\u00e9s", "Quelques informels", "Identifi\u00e9s et soutenus", "R\u00e9seau de champions"] },
      { q: "Budget et temps consacr\u00e9s \u00e0 la formation digitale ?", levels: ["Aucun", "< 1 jour/an", "1-2 jours", "Programme structur\u00e9", "> 5 jours + certif."] },
      { q: "Vos managers utilisent-ils les outils digitaux ?", levels: ["D\u00e9l\u00e8guent tout", "Minimum", "Partiellement", "Utilisateurs actifs", "Power users"] },
      { q: "Comment g\u00e9rez-vous les id\u00e9es d\u2019am\u00e9lioration des \u00e9quipes ?", levels: ["Aucun canal", "Bo\u00eete \u00e0 id\u00e9es ignor\u00e9e", "Remont\u00e9e informelle", "Canal + suivi", "Intrapreneuriat"] },
    ]
  },
  {
    id: "client", icon: "\u2764\uFE0F", label: "Exp\u00e9rience client",
    desc: "\u00c9value la qualit\u00e9 de l\u2019exp\u00e9rience digitale offerte aux clients.",
    questions: [
      { q: "D\u00e9lai moyen de r\u00e9ponse \u00e0 un client ?", levels: ["> 48h, t\u00e9l seul", "24-48h, multi-canal", "< 24h", "< 4h omnicanal", "Temps r\u00e9el + chatbot"] },
      { q: "Utilisez-vous un CRM rempli et utilis\u00e9 par tous ?", levels: ["Pas de CRM", "Achet\u00e9 mais vide", "Utilis\u00e9 partiellement", "Utilis\u00e9 par tous", "CRM enrichi par IA"] },
      { q: "Le parcours client est-il cartographi\u00e9 ?", levels: ["Non", "Intuitivement", "Partiellement doc.", "Cartographi\u00e9", "Optimis\u00e9 + personnalis\u00e9"] },
      { q: "Comment collectez-vous le feedback client ?", levels: ["Jamais", "Quand probl\u00e8me", "Enqu\u00eate annuelle", "Feedback r\u00e9gulier", "NPS continu + analyse"] },
      { q: "Personnalisez-vous vos communications par client ?", levels: ["Z\u00e9ro", "Segmentation basique", "Par segment", "Individuelle", "Pr\u00e9dictif et proactif"] },
    ]
  },
];

const maturityLabel = (avg) => {
  if (avg < 1) return { label: "Initial", color: "#C62828" };
  if (avg < 2) return { label: "\u00c9mergent", color: "#E65100" };
  if (avg < 3) return { label: "Structur\u00e9", color: "#2E75B6" };
  if (avg < 3.7) return { label: "Avanc\u00e9", color: "#2E7D32" };
  return { label: "Leader", color: "#1B5E20" };
};

const recommendations = {
  strat: { title: "D\u00e9finir une roadmap digitale", text: "Atelier de cadrage : vision 12 mois, priorisation par matrice impact/faisabilit\u00e9, KPIs." },
  data: { title: "Structurer la fondation data", text: "Consolider les sources dans un r\u00e9f\u00e9rentiel unique, dashboards d\u00e9cisionnels, premiers mod\u00e8les analytiques." },
  process: { title: "Automatiser les processus critiques", text: "Cartographie des workflows manuels, quick wins d\u2019automatisation (n8n, scripts), d\u00e9ploiement en 30-60 jours." },
  techno: { title: "Moderniser l\u2019infrastructure", text: "Migration cloud progressive, APIs pour connecter les outils, \u00e9limination des silos techniques." },
  people: { title: "Acc\u00e9l\u00e9rer l\u2019adoption", text: "Champions internes, programme de formation, accompagnement au changement avec quick wins visibles." },
  client: { title: "Digitaliser l\u2019exp\u00e9rience client", text: "CRM, canaux unifi\u00e9s, feedback structur\u00e9, personnalisation bas\u00e9e sur la data client." },
};

function RadarChart({ scores, size = 280 }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, size, size);

    const cx = size / 2, cy = size / 2, r = size / 2 - 40;
    const labels = axes.map(a => a.label);
    const vals = axes.map(a => scores[a.id] || 0);
    const n = labels.length;
    const angleStep = (2 * Math.PI) / n;
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    for (let ring = 1; ring <= 4; ring++) {
      ctx.beginPath();
      for (let i = 0; i <= n; i++) {
        const angle = -Math.PI / 2 + i * angleStep;
        const x = cx + (r * ring / 4) * Math.cos(angle);
        const y = cy + (r * ring / 4) * Math.sin(angle);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    for (let i = 0; i < n; i++) {
      const angle = -Math.PI / 2 + i * angleStep;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
      ctx.strokeStyle = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
      ctx.stroke();

      const lx = cx + (r + 28) * Math.cos(angle);
      const ly = cy + (r + 28) * Math.sin(angle);
      ctx.font = "500 10px system-ui, sans-serif";
      ctx.fillStyle = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.45)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const words = labels[i].split(" ");
      words.forEach((w, wi) => ctx.fillText(w, lx, ly + (wi - (words.length - 1) / 2) * 12));
    }

    ctx.beginPath();
    for (let i = 0; i <= n; i++) {
      const idx = i % n;
      const angle = -Math.PI / 2 + idx * angleStep;
      const v = vals[idx] / 4;
      const x = cx + r * v * Math.cos(angle);
      const y = cy + r * v * Math.sin(angle);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.fillStyle = "rgba(46,117,182,0.15)";
    ctx.fill();
    ctx.strokeStyle = "#2E75B6";
    ctx.lineWidth = 2;
    ctx.stroke();

    for (let i = 0; i < n; i++) {
      const angle = -Math.PI / 2 + i * angleStep;
      const v = vals[i] / 4;
      const x = cx + r * v * Math.cos(angle);
      const y = cy + r * v * Math.sin(angle);
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#2E75B6";
      ctx.fill();
      ctx.font = "bold 11px system-ui, sans-serif";
      ctx.fillStyle = isDark ? "#E2E8F0" : "#1B2A4A";
      ctx.fillText(vals[i].toFixed(1), x + 8, y - 8);
    }
  }, [scores, size]);

  return <canvas ref={canvasRef} style={{ width: size, height: size, display: "block", margin: "0 auto" }} />;
}

export default function App() {
  const [answers, setAnswers] = useState({});
  const [activeAxis, setActiveAxis] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const setAnswer = (axisId, qIdx, value) => {
    setAnswers(prev => ({ ...prev, [`${axisId}-${qIdx}`]: value }));
  };

  const axisScores = useMemo(() => {
    const s = {};
    axes.forEach(ax => {
      const vals = ax.questions.map((_, qi) => answers[`${ax.id}-${qi}`]).filter(v => v !== undefined);
      s[ax.id] = vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
    });
    return s;
  }, [answers]);

  const globalScore = useMemo(() => {
    const vals = Object.values(axisScores);
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  }, [axisScores]);

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = axes.reduce((s, a) => s + a.questions.length, 0);
  const progress = Math.round((answeredCount / totalQuestions) * 100);
  const maturity = maturityLabel(globalScore);

  const sortedAxes = useMemo(() =>
    [...axes].sort((a, b) => axisScores[a.id] - axisScores[b.id]), [axisScores]);

  if (showResults) {
    return (
      <div style={{ fontFamily: "system-ui, sans-serif", maxWidth: 700, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 4 }}>R\u00e9sultats du diagnostic</div>
            <div style={{ fontSize: 20, fontWeight: 500, color: "var(--text-primary)" }}>Score global : {globalScore.toFixed(1)}/4</div>
            <div style={{ fontSize: 14, color: maturity.color, fontWeight: 500, marginTop: 2 }}>Niveau {maturity.label}</div>
          </div>
          <button onClick={() => setShowResults(false)} style={{ fontSize: 13 }}>
            <i className="ti ti-arrow-left" style={{ marginRight: 4 }} /> Modifier
          </button>
        </div>

        <RadarChart scores={axisScores} size={300} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, margin: "24px 0" }}>
          {sortedAxes.slice(0, 3).map((ax, i) => (
            <div key={ax.id} style={{ background: "var(--surface-1)", borderRadius: "var(--radius)", padding: "12px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Priorit\u00e9 {i + 1}</div>
              <div style={{ fontSize: 16, fontWeight: 500, color: "var(--text-primary)", margin: "4px 0" }}>{axisScores[ax.id].toFixed(1)}/4</div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{ax.label}</div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "var(--text-muted)", margin: "24px 0 12px" }}>Scores par axe</div>
        {sortedAxes.map(ax => {
          const score = axisScores[ax.id];
          const pct = (score / 4) * 100;
          return (
            <div key={ax.id} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", width: 160, flexShrink: 0 }}>{ax.icon} {ax.label}</div>
              <div style={{ flex: 1, background: "var(--surface-1)", borderRadius: 4, height: 8, overflow: "hidden" }}>
                <div style={{ width: `${pct}%`, height: "100%", background: score < 1.5 ? "#C62828" : score < 2.5 ? "#E65100" : score < 3.5 ? "#2E75B6" : "#2E7D32", borderRadius: 4, transition: "width 0.4s" }} />
              </div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)", minWidth: 36, textAlign: "right" }}>{score.toFixed(1)}</div>
            </div>
          );
        })}

        <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "var(--text-muted)", margin: "28px 0 12px" }}>Recommandations prioritaires</div>
        {sortedAxes.slice(0, 3).map((ax, i) => {
          const r = recommendations[ax.id];
          const colors = [{ bg: "var(--bg-danger)", text: "var(--text-danger)" }, { bg: "var(--bg-warning)", text: "var(--text-warning)" }, { bg: "var(--bg-accent)", text: "var(--text-accent)" }];
          return (
            <div key={ax.id} style={{ background: "var(--surface-2)", border: "0.5px solid var(--border)", borderRadius: 12, padding: "14px 18px", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 10, fontWeight: 500, padding: "2px 8px", borderRadius: "var(--radius)", background: colors[i].bg, color: colors[i].text }}>Priorit\u00e9 {i + 1}</span>
                <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)" }}>{r.title}</span>
              </div>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>{r.text}</p>
            </div>
          );
        })}

        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 24 }}>
          <button onClick={() => sendPrompt(`G\u00e9n\u00e8re un rapport PDF de maturit\u00e9 digitale avec ces scores : ${axes.map(a => `${a.label}: ${axisScores[a.id].toFixed(1)}`).join(', ')}`)}>
            G\u00e9n\u00e9rer le rapport PDF <i className="ti ti-file-text" />
          </button>
          <button onClick={() => sendPrompt(`Propose un plan d'action 90 jours bas\u00e9 sur ces scores : ${sortedAxes.slice(0,3).map(a => `${a.label} (${axisScores[a.id].toFixed(1)}/4)`).join(', ')}`)}>
            Plan d'action 90 jours <i className="ti ti-arrow-up-right" />
          </button>
        </div>
      </div>
    );
  }

  const ax = axes[activeAxis];
  const axAnswered = ax.questions.filter((_, qi) => answers[`${ax.id}-${qi}`] !== undefined).length;

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", maxWidth: 700, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "var(--text-muted)" }}>Symbotis \u2014 diagnostic de maturit\u00e9 digitale</div>
        </div>
        <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{answeredCount}/{totalQuestions} r\u00e9ponses</div>
      </div>

      <div style={{ background: "var(--surface-1)", borderRadius: 4, height: 4, marginBottom: 20, overflow: "hidden" }}>
        <div style={{ width: `${progress}%`, height: "100%", background: "var(--text-accent)", borderRadius: 4, transition: "width 0.3s" }} />
      </div>

      <div style={{ display: "flex", gap: 0, borderBottom: "0.5px solid var(--border)", marginBottom: 20, overflowX: "auto" }}>
        {axes.map((a, i) => {
          const done = a.questions.filter((_, qi) => answers[`${a.id}-${qi}`] !== undefined).length;
          const allDone = done === a.questions.length;
          return (
            <button key={a.id} onClick={() => setActiveAxis(i)}
              style={{ padding: "10px 12px", background: "none", border: "none", borderBottom: activeAxis === i ? "2px solid var(--text-accent)" : "2px solid transparent",
                color: activeAxis === i ? "var(--text-primary)" : "var(--text-muted)", cursor: "pointer", fontSize: 12,
                fontWeight: activeAxis === i ? 500 : 400, whiteSpace: "nowrap", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}>
              {allDone ? <i className="ti ti-circle-check" style={{ color: "var(--text-success)", fontSize: 14 }} /> : <span>{a.icon}</span>}
              <span style={{ display: activeAxis === i ? "inline" : "none" }}>{a.label}</span>
              <span style={{ fontSize: 10, background: "var(--surface-1)", borderRadius: "var(--radius)", padding: "1px 6px" }}>{done}/{a.questions.length}</span>
            </button>
          );
        })}
      </div>

      <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 20, padding: "10px 14px", background: "var(--surface-1)", borderRadius: "var(--radius)" }}>
        <strong>{ax.icon} {ax.label}</strong> \u2014 {ax.desc}
      </div>

      {ax.questions.map((q, qi) => {
        const currentVal = answers[`${ax.id}-${qi}`];
        return (
          <div key={qi} style={{ background: "var(--surface-2)", border: "0.5px solid var(--border)", borderRadius: 12, padding: "14px 18px", marginBottom: 10 }}>
            <div style={{ fontSize: 11, color: "var(--text-accent)", fontWeight: 500, marginBottom: 4 }}>Question {qi + 1}/{ax.questions.length}</div>
            <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)", marginBottom: 10, lineHeight: 1.5 }}>{q.q}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {q.levels.map((level, li) => (
                <button key={li} onClick={() => setAnswer(ax.id, qi, li)}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: "var(--radius)",
                    background: currentVal === li ? "var(--bg-accent)" : "transparent",
                    border: currentVal === li ? "0.5px solid var(--border-accent)" : "0.5px solid var(--border)",
                    cursor: "pointer", textAlign: "left", fontFamily: "inherit", fontSize: 13, color: currentVal === li ? "var(--text-accent)" : "var(--text-secondary)",
                    fontWeight: currentVal === li ? 500 : 400, transition: "all 0.15s" }}>
                  <span style={{ fontSize: 11, fontWeight: 500, minWidth: 16, color: currentVal === li ? "var(--text-accent)" : "var(--text-muted)" }}>{li}</span>
                  {level}
                </button>
              ))}
            </div>
          </div>
        );
      })}

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20, gap: 8 }}>
        <button onClick={() => setActiveAxis(Math.max(0, activeAxis - 1))} disabled={activeAxis === 0}
          style={{ opacity: activeAxis === 0 ? 0.4 : 1 }}>
          <i className="ti ti-arrow-left" style={{ marginRight: 4 }} /> Pr\u00e9c\u00e9dent
        </button>
        {activeAxis < axes.length - 1 ? (
          <button onClick={() => setActiveAxis(activeAxis + 1)}>
            Suivant <i className="ti ti-arrow-right" style={{ marginLeft: 4 }} />
          </button>
        ) : (
          <button onClick={() => setShowResults(true)}
            style={{ background: answeredCount === totalQuestions ? "var(--fill-accent)" : undefined,
              color: answeredCount === totalQuestions ? "var(--on-accent)" : undefined,
              border: answeredCount === totalQuestions ? "none" : undefined }}>
            Voir les r\u00e9sultats <i className="ti ti-chart-radar" style={{ marginLeft: 4 }} />
          </button>
        )}
      </div>
    </div>
  );
}
