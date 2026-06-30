import { useState, useMemo, useEffect, useRef } from "react";

const axes = [
  {
    id: "strat", icon: "\u{1F3AF}", label: "Stratégie digitale",
    desc: "Évalue la présence d’une vision digitale, d’une roadmap et d’une gouvernance.",
    questions: [
      { q: "Avez-vous une vision digitale formalisée et partagée ?", levels: ["Aucune vision", "Émergente informelle", "Document écrit", "Roadmap + KPIs", "Revue trimestrielle"] },
      { q: "Qui porte la transformation digitale ? Y a-t-il un sponsor COMEX ?", levels: ["Personne", "Un passionné isolé", "Responsable dédié", "Sponsor COMEX", "Le CEO lui-même"] },
      { q: "Quel % du budget annuel est alloué au digital ?", levels: ["< 1%", "1-3%", "3-5%", "5-10%", "> 10%"] },
      { q: "Comment priorisez-vous vos projets digitaux ?", levels: ["Au feeling", "Liste non priorisée", "Critères informels", "Matrice formalisée", "Portfolio management"] },
      { q: "Mesurez-vous le ROI de vos initiatives digitales ?", levels: ["Jamais", "Rarement", "Sur certains projets", "Systématiquement", "Dashboard temps réel"] },
    ]
  },
  {
    id: "data", icon: "\u{1F4CA}", label: "Data & analytics",
    desc: "Évalue la capacité à collecter, structurer et exploiter les données.",
    questions: [
      { q: "Où vivent vos données ? Combien de sources différentes ?", levels: ["Excel/email", "3-5 outils silotés", "Centralisé partiellement", "Référentiel unique", "Data warehouse"] },
      { q: "Quel % de vos décisions est basé sur la data vs l’intuition ?", levels: ["0% data", "20/80", "50/50", "80/20", "Data-driven natif"] },
      { q: "Combien de temps pour produire un reporting mensuel ?", levels: ["> 5 jours", "2-5 jours", "1 jour", "Automatisé quotidien", "Temps réel self-service"] },
      { q: "Avez-vous une gouvernance data ? Qui est responsable de la qualité ?", levels: ["Aucune", "Informelle", "1 référent", "Data stewards", "CDO + politique formelle"] },
      { q: "Utilisez-vous de l’analytics avancé ou du prédictif ?", levels: ["Aucun", "Tableaux basiques", "Dashboards BI", "Modèles ponctuels", "IA/ML en production"] },
    ]
  },
  {
    id: "process", icon: "⚙️", label: "Processus & automatisation",
    desc: "Évalue le niveau de digitalisation et d’automatisation des workflows.",
    questions: [
      { q: "Vos 3 processus les plus chronophages sont-ils automatisés ?", levels: ["100% manuels", "Quelques macros", "Partiellement auto.", "Majoritairement auto.", "Fully automated"] },
      { q: "Combien de ressaisies manuelles par jour entre vos outils ?", levels: ["> 20/jour", "10-20", "5-10", "< 5", "Zéro"] },
      { q: "Utilisez-vous des outils d’automatisation (n8n, Zapier, Make) ?", levels: ["Jamais entendu parler", "Connaît mais non", "Quelques-uns", "Workflows structurés", "Orchestration complète"] },
      { q: "Comment gérez-vous les validations internes ?", levels: ["Email + relances", "Email + Excel", "Outil basique", "Workflow dédié", "Automatisé avec SLA"] },
      { q: "Si un employé clé part, ses processus sont-ils documentés ?", levels: ["Rien", "Dans les têtes", "Doc partielle", "Processus doc.", "Doc. + automatisés"] },
    ]
  },
  {
    id: "techno", icon: "\u{1F5A5}️", label: "Infrastructure & outils",
    desc: "Évalue la modernité du SI, l’intégration des outils et la capacité à évoluer.",
    questions: [
      { q: "Vos 5 outils principaux sont-ils connectés ou en silos ?", levels: ["Isolés", "Exports manuels", "Intégrations ponctuelles", "API connectées", "Plateforme intégrée"] },
      { q: "Votre infra est-elle on-premise, cloud ou hybride ?", levels: ["On-premise legacy", "On-premise modernisé", "Hybride", "Cloud-first", "Cloud-native"] },
      { q: "Quel est l’âge moyen de vos logiciels métiers ?", levels: ["> 10 ans", "5-10 ans", "< 5 ans", "Mis à jour régulièrement", "SaaS evergreen"] },
      { q: "Avez-vous une politique de cybersécurité ?", levels: ["Aucune", "Antivirus basique", "Backup non testé", "Politique + backup", "SOC + PRA testé"] },
      { q: "Vos équipes peuvent-elles travailler à distance ?", levels: ["Impossible", "VPN bricolé", "Cloud partiel", "Tout accessible", "Full remote natif"] },
    ]
  },
  {
    id: "people", icon: "\u{1F465}", label: "Culture & compétences",
    desc: "Évalue l’adoption du digital par les équipes et la culture d’innovation.",
    questions: [
      { q: "Comment réagissent vos équipes à un nouvel outil ?", levels: ["Résistance forte", "Scepticisme", "Attente prudente", "Curiosité active", "Demande proactive"] },
      { q: "Avez-vous des champions digitaux identifiés ?", levels: ["Aucun", "1-2 non identifiés", "Quelques informels", "Identifiés et soutenus", "Réseau de champions"] },
      { q: "Budget et temps consacrés à la formation digitale ?", levels: ["Aucun", "< 1 jour/an", "1-2 jours", "Programme structuré", "> 5 jours + certif."] },
      { q: "Vos managers utilisent-ils les outils digitaux ?", levels: ["Délèguent tout", "Minimum", "Partiellement", "Utilisateurs actifs", "Power users"] },
      { q: "Comment gérez-vous les idées d’amélioration des équipes ?", levels: ["Aucun canal", "Boîte à idées ignorée", "Remontée informelle", "Canal + suivi", "Intrapreneuriat"] },
    ]
  },
  {
    id: "client", icon: "❤️", label: "Expérience client",
    desc: "Évalue la qualité de l’expérience digitale offerte aux clients.",
    questions: [
      { q: "Délai moyen de réponse à un client ?", levels: ["> 48h, tél seul", "24-48h, multi-canal", "< 24h", "< 4h omnicanal", "Temps réel + chatbot"] },
      { q: "Utilisez-vous un CRM rempli et utilisé par tous ?", levels: ["Pas de CRM", "Acheté mais vide", "Utilisé partiellement", "Utilisé par tous", "CRM enrichi par IA"] },
      { q: "Le parcours client est-il cartographié ?", levels: ["Non", "Intuitivement", "Partiellement doc.", "Cartographié", "Optimisé + personnalisé"] },
      { q: "Comment collectez-vous le feedback client ?", levels: ["Jamais", "Quand problème", "Enquête annuelle", "Feedback régulier", "NPS continu + analyse"] },
      { q: "Personnalisez-vous vos communications par client ?", levels: ["Zéro", "Segmentation basique", "Par segment", "Individuelle", "Prédictif et proactif"] },
    ]
  },
];

const maturityLabel = (avg) => {
  if (avg < 1) return { label: "Initial", color: "#C62828" };
  if (avg < 2) return { label: "Émergent", color: "#E65100" };
  if (avg < 3) return { label: "Structuré", color: "#2E75B6" };
  if (avg < 3.7) return { label: "Avancé", color: "#2E7D32" };
  return { label: "Leader", color: "#1B5E20" };
};

const recommendations = {
  strat: { title: "Définir une roadmap digitale", text: "Atelier de cadrage : vision 12 mois, priorisation par matrice impact/faisabilité, KPIs." },
  data: { title: "Structurer la fondation data", text: "Consolider les sources dans un référentiel unique, dashboards décisionnels, premiers modèles analytiques." },
  process: { title: "Automatiser les processus critiques", text: "Cartographie des workflows manuels, quick wins d’automatisation (n8n, scripts), déploiement en 30-60 jours." },
  techno: { title: "Moderniser l’infrastructure", text: "Migration cloud progressive, APIs pour connecter les outils, élimination des silos techniques." },
  people: { title: "Accélérer l’adoption", text: "Champions internes, programme de formation, accompagnement au changement avec quick wins visibles." },
  client: { title: "Digitaliser l’expérience client", text: "CRM, canaux unifiés, feedback structuré, personnalisation basée sur la data client." },
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
      ctx.font = "500 10px Inter, system-ui, sans-serif";
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
    ctx.fillStyle = "rgba(243,148,72,0.15)";
    ctx.fill();
    ctx.strokeStyle = "#F39448";
    ctx.lineWidth = 2;
    ctx.stroke();

    for (let i = 0; i < n; i++) {
      const angle = -Math.PI / 2 + i * angleStep;
      const v = vals[i] / 4;
      const x = cx + r * v * Math.cos(angle);
      const y = cy + r * v * Math.sin(angle);
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#F39448";
      ctx.fill();
      ctx.font = "bold 11px Inter, system-ui, sans-serif";
      ctx.fillStyle = isDark ? "#E2E8F0" : "#1B2A4A";
      ctx.fillText(vals[i].toFixed(1), x + 8, y - 8);
    }
  }, [scores, size]);

  return <canvas ref={canvasRef} style={{ width: size, height: size, display: "block", margin: "0 auto" }} />;
}

// Champ commentaire libre : une ligne visible, hauteur auto-extensible, aucune limite de texte.
function CommentField({ value, onChange }) {
  const ref = useRef(null);
  const autosize = (el) => {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };
  useEffect(() => { autosize(ref.current); }, [value]);
  return (
    <textarea
      ref={ref}
      rows={1}
      value={value}
      placeholder="Commentaire (optionnel)"
      aria-label="Commentaire libre"
      onChange={(e) => { onChange(e.target.value); autosize(e.target); }}
      style={{
        marginTop: 10,
        width: "100%",
        boxSizing: "border-box",
        fontFamily: "inherit",
        fontSize: 13,
        lineHeight: 1.5,
        color: "var(--text-secondary)",
        background: "var(--surface-1)",
        border: "0.5px solid var(--border)",
        borderRadius: "var(--radius)",
        padding: "8px 10px",
        resize: "none",
        overflow: "hidden",
        minHeight: 36,
      }}
    />
  );
}

export default function App() {
  const [answers, setAnswers] = useState({});
  const [comments, setComments] = useState({});
  const [activeAxis, setActiveAxis] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const setAnswer = (axisId, qIdx, value) => {
    setAnswers(prev => ({ ...prev, [`${axisId}-${qIdx}`]: value }));
  };

  const setComment = (axisId, qIdx, value) => {
    setComments(prev => ({ ...prev, [`${axisId}-${qIdx}`]: value }));
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

  // --- Bouton « Générer le rapport PDF » : vrai PDF client-side (jsPDF) ---
  const generatePdf = async () => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();
    const margin = 48;
    let y = margin;

    // En-tête
    doc.setFont("helvetica", "bold");
    doc.setTextColor(31, 42, 99); // navy #1F2A63
    doc.setFontSize(22);
    doc.text("Symbotis", margin, y);
    doc.setTextColor(243, 148, 72); // orange #F39448
    doc.setFontSize(13);
    y += 20;
    doc.text("Diagnostic de maturité digitale", margin, y);

    // Score global + niveau
    y += 36;
    doc.setTextColor(30, 41, 59); // slate-800
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.text(`Score global : ${globalScore.toFixed(1)}/4`, margin, y);
    y += 18;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(71, 85, 105); // slate-600
    doc.text(`Niveau de maturité : ${maturity.label}`, margin, y);

    // Radar rasterisé depuis le <canvas>
    const canvas = typeof document !== "undefined" ? document.querySelector("canvas") : null;
    if (canvas) {
      try {
        const img = canvas.toDataURL("image/png");
        const size = 200;
        doc.addImage(img, "PNG", pageW - margin - size, margin + 4, size, size);
      } catch (e) {
        /* canvas tainted / indisponible : on garde le PDF texte */
      }
    }

    // Scores par axe
    y += 40;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);
    doc.text("Scores par axe", margin, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(71, 85, 105);
    sortedAxes.forEach((ax) => {
      y += 18;
      doc.text(`${ax.label}`, margin, y);
      doc.text(`${axisScores[ax.id].toFixed(1)}/4`, margin + 320, y, { align: "right" });
    });

    // Recommandations prioritaires
    y += 34;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);
    doc.text("Recommandations prioritaires", margin, y);
    sortedAxes.slice(0, 3).forEach((ax, i) => {
      const r = recommendations[ax.id];
      y += 22;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(243, 148, 72);
      doc.text(`Priorité ${i + 1} — ${r.title}`, margin, y);
      y += 15;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(71, 85, 105);
      const wrapped = doc.splitTextToSize(r.text, pageW - margin * 2);
      doc.text(wrapped, margin, y);
      y += wrapped.length * 13;
    });

    // Pied de page
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text(
      "Symbotis — Conseil en transformation digitale par l'IA · ROI garanti 30–90 jours",
      margin,
      doc.internal.pageSize.getHeight() - 28
    );

    doc.save("diagnostic-maturite-symbotis.pdf");
  };

  // --- Bouton « Plan d'action 90 jours » : mailto pré-rempli (capture du lead) ---
  const openActionPlan = () => {
    const top3 = sortedAxes.slice(0, 3);
    const subject = "Plan d'action 90 jours — Diagnostic de maturité digitale";

    // Commentaires libres saisis (le cas échéant)
    const filledComments = [];
    axes.forEach((a) => {
      a.questions.forEach((q, qi) => {
        const c = (comments[`${a.id}-${qi}`] || "").trim();
        if (c) filledComments.push(`- ${a.label} (Q${qi + 1}) : ${c}`);
      });
    });

    const body = [
      "Bonjour,",
      "",
      `Suite à mon diagnostic de maturité digitale (score global ${globalScore.toFixed(1)}/4 — niveau ${maturity.label}), je souhaite échanger sur un plan d'action sur 90 jours.`,
      "",
      "Axes prioritaires :",
      ...top3.map((ax, i) => `${i + 1}. ${ax.label} — ${axisScores[ax.id].toFixed(1)}/4`),
      "",
      "Scores par axe :",
      ...axes.map((a) => `- ${a.label} : ${axisScores[a.id].toFixed(1)}/4`),
      ...(filledComments.length ? ["", "Commentaires :", ...filledComments] : []),
      "",
      "Merci de me recontacter.",
    ].join("\n");
    const mailto = `mailto:contact@symbotis.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  };

  if (showResults) {
    return (
      <div style={{ fontFamily: "Inter, system-ui, sans-serif", maxWidth: 700, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 4 }}>Résultats du diagnostic</div>
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
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Priorité {i + 1}</div>
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
                <span style={{ fontSize: 10, fontWeight: 500, padding: "2px 8px", borderRadius: "var(--radius)", background: colors[i].bg, color: colors[i].text }}>Priorité {i + 1}</span>
                <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)" }}>{r.title}</span>
              </div>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>{r.text}</p>
            </div>
          );
        })}

        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 24 }}>
          <button onClick={generatePdf}>
            Générer le rapport PDF <i className="ti ti-file-text" />
          </button>
          <button onClick={openActionPlan}>
            Plan d'action 90 jours <i className="ti ti-arrow-up-right" />
          </button>
        </div>
      </div>
    );
  }

  const ax = axes[activeAxis];
  const axAnswered = ax.questions.filter((_, qi) => answers[`${ax.id}-${qi}`] !== undefined).length;

  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif", maxWidth: 700, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "var(--text-muted)" }}>Symbotis — diagnostic de maturité digitale</div>
        </div>
        <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{answeredCount}/{totalQuestions} réponses</div>
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
        <strong>{ax.icon} {ax.label}</strong> — {ax.desc}
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
            <CommentField
              value={comments[`${ax.id}-${qi}`] || ""}
              onChange={(v) => setComment(ax.id, qi, v)}
            />
          </div>
        );
      })}

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20, gap: 8 }}>
        <button onClick={() => setActiveAxis(Math.max(0, activeAxis - 1))} disabled={activeAxis === 0}
          style={{ opacity: activeAxis === 0 ? 0.4 : 1 }}>
          <i className="ti ti-arrow-left" style={{ marginRight: 4 }} /> Précédent
        </button>
        {activeAxis < axes.length - 1 ? (
          <button onClick={() => setActiveAxis(activeAxis + 1)}>
            Suivant <i className="ti ti-arrow-right" style={{ marginLeft: 4 }} />
          </button>
        ) : (
          <button
            onClick={() => {
              if (answeredCount === totalQuestions) {
                setShowWarning(false);
                setShowResults(true);
              } else {
                setShowWarning(true);
              }
            }}
            style={{ background: answeredCount === totalQuestions ? "var(--fill-accent)" : undefined,
              color: answeredCount === totalQuestions ? "var(--on-accent)" : undefined,
              border: answeredCount === totalQuestions ? "none" : undefined }}>
            Voir les résultats <i className="ti ti-chart-radar" style={{ marginLeft: 4 }} />
          </button>
        )}
      </div>

      {showWarning && answeredCount < totalQuestions && (
        <div
          role="alert"
          style={{ marginTop: 14, padding: "10px 14px", borderRadius: "var(--radius)",
            background: "var(--bg-warning)", color: "var(--text-warning)", fontSize: 13, fontWeight: 500,
            display: "flex", alignItems: "center", gap: 8 }}>
          <i className="ti ti-alert-triangle" aria-hidden="true" />
          Répondez à toutes les questions pour voir vos résultats — il en reste {totalQuestions - answeredCount} sur {totalQuestions}.
        </div>
      )}
    </div>
  );
}
