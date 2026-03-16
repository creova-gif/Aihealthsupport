import { useState, useEffect } from "react";

const COLORS = {
  primary: "#0F3D56",
  teal: "#1B998B",
  tealLight: "#E8F5F3",
  tealMid: "#0D7A6E",
  red: "#C84B31",
  redLight: "#FDF0ED",
  amber: "#E8A020",
  amberLight: "#FDF6E8",
  green: "#2E7D32",
  greenLight: "#EDF7EE",
  blue: "#1565C0",
  blueLight: "#E8F0FB",
  neutral50: "#F7F9FC",
  neutral100: "#EEF1F6",
  neutral200: "#D8DDE8",
  neutral400: "#8A93A8",
  neutral600: "#4A5568",
  neutral800: "#1E2433",
  white: "#FFFFFF",
};

const PATIENTS = [
  { id: "P-0012", name: "Amina Juma", age: 28, sex: "F", risk: "high", complaint: "Severe headache, blurred vision", arrival: "08:14", status: "Waiting", dept: "OPD", bp: "165/110", hr: 98, temp: 37.2, spo2: 98, pregnant: true, weeks: 32 },
  { id: "P-0013", name: "Joseph Mwangi", age: 52, sex: "M", risk: "medium", complaint: "Chest tightness, shortness of breath", arrival: "08:31", status: "In Consultation", dept: "Emergency", bp: "148/92", hr: 88, temp: 36.8, spo2: 96, pregnant: false, weeks: null },
  { id: "P-0014", name: "Fatuma Said", age: 7, sex: "F", risk: "medium", complaint: "Fever 3 days, vomiting", arrival: "08:45", status: "Waiting", dept: "Paediatrics", bp: "—", hr: 112, temp: 38.9, spo2: 99, pregnant: false, weeks: null },
  { id: "P-0015", name: "David Ochieng", age: 34, sex: "M", risk: "low", complaint: "Follow-up, diabetes management", arrival: "09:02", status: "Waiting", dept: "OPD", bp: "122/78", hr: 74, temp: 36.5, spo2: 99, pregnant: false, weeks: null },
  { id: "P-0016", name: "Neema Kirabo", age: 23, sex: "F", risk: "high", complaint: "Labour pains, waters broken", arrival: "09:15", status: "Waiting", dept: "Maternity", bp: "120/80", hr: 102, temp: 37.0, spo2: 98, pregnant: true, weeks: 39 },
  { id: "P-0017", name: "Hassan Bakari", age: 68, sex: "M", risk: "medium", complaint: "Persistent cough, weight loss 3mo", arrival: "09:28", status: "Waiting", dept: "OPD", bp: "138/85", hr: 80, temp: 37.4, spo2: 94, pregnant: false, weeks: null },
];

const STATS = [
  { label: "Patients today", value: 47, delta: "+6 vs yesterday", color: COLORS.primary },
  { label: "Waiting now", value: 12, delta: "Avg wait 28 min", color: COLORS.amber },
  { label: "In consultation", value: 8, delta: "3 providers active", color: COLORS.teal },
  { label: "Emergency alerts", value: 2, delta: "Immediate attention", color: COLORS.red },
];

const LABS_PENDING = [
  { patient: "Amina Juma", test: "Full blood count + urine protein", priority: "Urgent", ordered: "08:20", status: "Processing" },
  { patient: "Hassan Bakari", test: "Chest X-ray + sputum AFB", priority: "Routine", ordered: "09:35", status: "Ordered" },
  { patient: "David Ochieng", test: "HbA1c + fasting glucose", priority: "Routine", ordered: "09:10", status: "Processing" },
];

const MEDICATIONS_PENDING = [
  { patient: "Joseph Mwangi", drug: "Aspirin 300mg stat", status: "Verify", dispense: "1 tablet" },
  { patient: "Fatuma Said", drug: "Paracetamol suspension 250mg/5ml", status: "Ready", dispense: "10ml q6h" },
  { patient: "Neema Kirabo", drug: "Oxytocin 5IU IM", status: "Verify", dispense: "1 amp" },
];

const RISK_CONFIG = {
  high: { label: "High risk", bg: COLORS.redLight, text: COLORS.red, dot: COLORS.red },
  medium: { label: "Moderate", bg: COLORS.amberLight, text: "#9A6200", dot: COLORS.amber },
  low: { label: "Low risk", bg: COLORS.greenLight, text: COLORS.green, dot: COLORS.green },
};

function RiskBadge({ risk }) {
  const cfg = RISK_CONFIG[risk];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 8px", borderRadius: 20,
      background: cfg.bg, color: cfg.text,
      fontSize: 11, fontWeight: 500, letterSpacing: 0.2
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot, display: "inline-block" }} />
      {cfg.label}
    </span>
  );
}

function StatusBadge({ status }) {
  const configs = {
    "Waiting": { bg: "#EEF1F6", text: COLORS.neutral600 },
    "In Consultation": { bg: COLORS.blueLight, text: COLORS.blue },
    "Completed": { bg: COLORS.greenLight, text: COLORS.green },
  };
  const c = configs[status] || configs["Waiting"];
  return (
    <span style={{
      padding: "3px 8px", borderRadius: 20,
      background: c.bg, color: c.text,
      fontSize: 11, fontWeight: 500
    }}>{status}</span>
  );
}

function Vitals({ patient }) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
      {[
        { label: "BP", value: patient.bp, alert: patient.bp !== "—" && parseInt(patient.bp) > 140 },
        { label: "HR", value: `${patient.hr} bpm`, alert: patient.hr > 100 },
        { label: "Temp", value: `${patient.temp}°C`, alert: patient.temp > 38 },
        { label: "SpO₂", value: `${patient.spo2}%`, alert: patient.spo2 < 95 },
      ].map(v => (
        <span key={v.label} style={{
          padding: "2px 8px", borderRadius: 6,
          background: v.alert ? COLORS.redLight : COLORS.neutral100,
          color: v.alert ? COLORS.red : COLORS.neutral600,
          fontSize: 11, fontFamily: "monospace"
        }}>
          <span style={{ color: COLORS.neutral400, marginRight: 3 }}>{v.label}</span>
          {v.value}
        </span>
      ))}
      {patient.pregnant && (
        <span style={{
          padding: "2px 8px", borderRadius: 6,
          background: "#F3E8FF", color: "#6B21A8",
          fontSize: 11, fontWeight: 500
        }}>
          Pregnant · {patient.weeks}w
        </span>
      )}
    </div>
  );
}

function NavItem({ icon, label, active, badge, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "10px 14px", width: "100%",
      background: active ? COLORS.tealLight : "transparent",
      border: "none", borderRadius: 8,
      color: active ? COLORS.tealMid : COLORS.neutral600,
      fontWeight: active ? 500 : 400, fontSize: 13,
      cursor: "pointer", textAlign: "left",
      borderLeft: active ? `3px solid ${COLORS.teal}` : "3px solid transparent",
      transition: "all 0.15s"
    }}>
      <span style={{ fontSize: 15 }}>{icon}</span>
      <span style={{ flex: 1 }}>{label}</span>
      {badge > 0 && (
        <span style={{
          background: COLORS.red, color: "#fff",
          borderRadius: 10, padding: "1px 7px", fontSize: 10, fontWeight: 600
        }}>{badge}</span>
      )}
    </button>
  );
}

function QueuePanel({ patients, selectedId, onSelect, filter, onFilterChange }) {
  const filtered = patients.filter(p =>
    filter === "All" ? true :
    filter === "High risk" ? p.risk === "high" :
    filter === "Maternity" ? p.dept === "Maternity" :
    p.dept === filter
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "12px 16px", borderBottom: `1px solid ${COLORS.neutral200}` }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {["All", "High risk", "OPD", "Emergency", "Maternity", "Paediatrics"].map(f => (
            <button key={f} onClick={() => onFilterChange(f)} style={{
              padding: "4px 10px", borderRadius: 16,
              background: filter === f ? COLORS.primary : COLORS.neutral100,
              color: filter === f ? "#fff" : COLORS.neutral600,
              border: "none", fontSize: 11, fontWeight: 500, cursor: "pointer"
            }}>{f}</button>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {filtered.map((p, i) => (
          <div key={p.id} onClick={() => onSelect(p)} style={{
            padding: "12px 16px",
            background: selectedId === p.id ? COLORS.tealLight : i % 2 === 0 ? COLORS.white : COLORS.neutral50,
            borderLeft: selectedId === p.id ? `3px solid ${COLORS.teal}` : "3px solid transparent",
            borderBottom: `1px solid ${COLORS.neutral100}`,
            cursor: "pointer", transition: "background 0.1s"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
              <div>
                <span style={{ fontWeight: 500, fontSize: 13, color: COLORS.neutral800 }}>{p.name}</span>
                <span style={{ color: COLORS.neutral400, fontSize: 11, marginLeft: 6 }}>{p.age}{p.sex} · {p.id}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3 }}>
                <RiskBadge risk={p.risk} />
              </div>
            </div>
            <p style={{ margin: 0, fontSize: 12, color: COLORS.neutral600, marginBottom: 4 }}>{p.complaint}</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 11, color: COLORS.neutral400 }}>
                {p.dept} · Arrived {p.arrival}
              </span>
              <StatusBadge status={p.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PatientDetail({ patient, onClose }) {
  const [tab, setTab] = useState("overview");

  if (!patient) return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      color: COLORS.neutral400, gap: 12
    }}>
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={COLORS.neutral200} strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
      <p style={{ fontSize: 13, margin: 0 }}>Select a patient to view details</p>
    </div>
  );

  const tabs = ["Overview", "Vitals", "Documentation", "Labs", "Medications", "Audit"];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: COLORS.white }}>
      {/* Header */}
      <div style={{
        padding: "16px 20px",
        borderBottom: `1px solid ${COLORS.neutral200}`,
        background: patient.risk === "high" ? COLORS.redLight : COLORS.white
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{
              width: 44, height: 44, borderRadius: "50%",
              background: COLORS.tealLight, display: "flex",
              alignItems: "center", justifyContent: "center",
              fontWeight: 600, fontSize: 16, color: COLORS.tealMid
            }}>
              {patient.name.split(" ").map(n => n[0]).join("")}
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: COLORS.neutral800 }}>{patient.name}</h3>
                <RiskBadge risk={patient.risk} />
              </div>
              <p style={{ margin: 0, fontSize: 12, color: COLORS.neutral400, marginTop: 2 }}>
                {patient.age}y · {patient.sex === "F" ? "Female" : "Male"} · {patient.id} · {patient.dept}
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {patient.risk === "high" && (
              <button style={{
                padding: "7px 14px", borderRadius: 8,
                background: COLORS.red, color: "#fff",
                border: "none", fontSize: 12, fontWeight: 500, cursor: "pointer"
              }}>Escalate</button>
            )}
            <button style={{
              padding: "7px 14px", borderRadius: 8,
              background: COLORS.teal, color: "#fff",
              border: "none", fontSize: 12, fontWeight: 500, cursor: "pointer"
            }}>Begin consultation</button>
          </div>
        </div>

        {/* Vitals strip */}
        <div style={{ marginTop: 10 }}>
          <Vitals patient={patient} />
        </div>

        {/* Chief complaint */}
        <div style={{
          marginTop: 10, padding: "8px 12px",
          background: COLORS.neutral50, borderRadius: 8,
          borderLeft: `3px solid ${COLORS.neutral200}`
        }}>
          <span style={{ fontSize: 11, color: COLORS.neutral400, display: "block", marginBottom: 2 }}>Chief complaint</span>
          <p style={{ margin: 0, fontSize: 13, color: COLORS.neutral800 }}>{patient.complaint}</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: `1px solid ${COLORS.neutral200}`, paddingLeft: 20 }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t.toLowerCase())} style={{
            padding: "10px 14px",
            background: "none", border: "none",
            borderBottom: tab === t.toLowerCase() ? `2px solid ${COLORS.teal}` : "2px solid transparent",
            color: tab === t.toLowerCase() ? COLORS.teal : COLORS.neutral400,
            fontSize: 12, fontWeight: 500, cursor: "pointer"
          }}>{t}</button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
        {tab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {patient.risk === "high" && (
              <div style={{
                padding: 12, borderRadius: 8,
                background: COLORS.redLight,
                border: `1px solid ${COLORS.red}30`,
                display: "flex", gap: 10, alignItems: "flex-start"
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={COLORS.red} strokeWidth="2" style={{ marginTop: 1, flexShrink: 0 }}>
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <div>
                  <p style={{ margin: 0, fontWeight: 500, fontSize: 13, color: COLORS.red }}>Immediate clinical attention required</p>
                  <p style={{ margin: "3px 0 0", fontSize: 12, color: COLORS.red }}>
                    {patient.pregnant
                      ? `Elevated BP at ${patient.weeks} weeks gestation — possible pre-eclampsia. Escalate to obstetrician.`
                      : "Elevated vitals detected. Review and escalate if needed."}
                  </p>
                </div>
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { label: "Department", value: patient.dept },
                { label: "Arrival time", value: patient.arrival },
                { label: "Status", value: patient.status },
                { label: "Condition", value: patient.pregnant ? `Pregnant · ${patient.weeks} weeks` : "Not pregnant" },
              ].map(item => (
                <div key={item.label} style={{
                  padding: 12, borderRadius: 8,
                  background: COLORS.neutral50,
                  border: `1px solid ${COLORS.neutral200}`
                }}>
                  <p style={{ margin: 0, fontSize: 11, color: COLORS.neutral400 }}>{item.label}</p>
                  <p style={{ margin: "3px 0 0", fontSize: 13, fontWeight: 500, color: COLORS.neutral800 }}>{item.value}</p>
                </div>
              ))}
            </div>

            <div style={{ borderTop: `1px solid ${COLORS.neutral200}`, paddingTop: 16 }}>
              <p style={{ margin: "0 0 10px", fontSize: 12, fontWeight: 500, color: COLORS.neutral600, textTransform: "uppercase", letterSpacing: 0.5 }}>Previous visits</p>
              {[
                { date: "12 Feb 2026", facility: "Mwananyamala Hospital", summary: "ANC visit — normal findings" },
                { date: "08 Jan 2026", facility: "Amana Regional", summary: "Routine check — BP 130/85, referred to OPD" },
              ].map((v, i) => (
                <div key={i} style={{
                  padding: "10px 12px", borderRadius: 8,
                  background: COLORS.white, border: `1px solid ${COLORS.neutral200}`,
                  marginBottom: 8, display: "flex", gap: 10, alignItems: "flex-start"
                }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: COLORS.teal, marginTop: 4, flexShrink: 0
                  }} />
                  <div>
                    <p style={{ margin: 0, fontSize: 12, fontWeight: 500, color: COLORS.neutral800 }}>{v.date} · {v.facility}</p>
                    <p style={{ margin: "2px 0 0", fontSize: 12, color: COLORS.neutral600 }}>{v.summary}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "documentation" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: COLORS.neutral800 }}>Clinical note — {new Date().toLocaleDateString("en-TZ", { day: "numeric", month: "long", year: "numeric" })}</p>
              <button style={{
                padding: "6px 12px", borderRadius: 8,
                background: COLORS.teal, color: "#fff",
                border: "none", fontSize: 12, fontWeight: 500, cursor: "pointer"
              }}>Save draft</button>
            </div>
            {["Subjective (S)", "Objective (O)", "Assessment (A)", "Plan (P)"].map((section, i) => (
              <div key={section} style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: COLORS.neutral600, display: "block", marginBottom: 6 }}>{section}</label>
                <textarea
                  placeholder={[
                    "Patient's presenting complaint in their own words...",
                    "Clinical findings, vital signs, examination results...",
                    "Clinical assessment, differential diagnoses, ICD-10 codes...",
                    "Treatment plan, investigations ordered, follow-up instructions...",
                  ][i]}
                  style={{
                    width: "100%", minHeight: 72, padding: "10px 12px",
                    borderRadius: 8, border: `1px solid ${COLORS.neutral200}`,
                    fontSize: 13, color: COLORS.neutral800,
                    fontFamily: "inherit", resize: "vertical", boxSizing: "border-box",
                    background: COLORS.neutral50
                  }}
                />
              </div>
            ))}
            <div style={{ display: "flex", gap: 8 }}>
              <input
                placeholder="ICD-10 code (e.g. O14.1 — Pre-eclampsia)"
                style={{
                  flex: 1, padding: "8px 12px",
                  borderRadius: 8, border: `1px solid ${COLORS.neutral200}`,
                  fontSize: 12, color: COLORS.neutral800, fontFamily: "inherit"
                }}
              />
              <button style={{
                padding: "8px 16px", borderRadius: 8,
                background: COLORS.primary, color: "#fff",
                border: "none", fontSize: 12, fontWeight: 500, cursor: "pointer"
              }}>Sign & submit</button>
            </div>
          </div>
        )}

        {tab === "labs" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>Lab orders</p>
              <button style={{
                padding: "6px 12px", borderRadius: 8,
                border: `1px solid ${COLORS.teal}`, color: COLORS.teal,
                background: "none", fontSize: 12, fontWeight: 500, cursor: "pointer"
              }}>+ New order</button>
            </div>
            {LABS_PENDING.filter(l => l.patient === patient.name).length > 0
              ? LABS_PENDING.filter(l => l.patient === patient.name).map((lab, i) => (
                <div key={i} style={{
                  padding: 12, borderRadius: 8,
                  border: `1px solid ${COLORS.neutral200}`,
                  marginBottom: 8
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>{lab.test}</p>
                    <span style={{
                      padding: "2px 8px", borderRadius: 10,
                      background: lab.priority === "Urgent" ? COLORS.redLight : COLORS.neutral100,
                      color: lab.priority === "Urgent" ? COLORS.red : COLORS.neutral600,
                      fontSize: 11
                    }}>{lab.priority}</span>
                  </div>
                  <p style={{ margin: "4px 0 0", fontSize: 12, color: COLORS.neutral400 }}>Ordered {lab.ordered} · {lab.status}</p>
                </div>
              ))
              : <p style={{ fontSize: 13, color: COLORS.neutral400 }}>No lab orders for this patient.</p>
            }
          </div>
        )}

        {tab === "medications" && (
          <div>
            {MEDICATIONS_PENDING.filter(m => m.patient === patient.name).length > 0
              ? MEDICATIONS_PENDING.filter(m => m.patient === patient.name).map((med, i) => (
                <div key={i} style={{
                  padding: 12, borderRadius: 8,
                  border: `1px solid ${COLORS.neutral200}`,
                  marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center"
                }}>
                  <div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>{med.drug}</p>
                    <p style={{ margin: "3px 0 0", fontSize: 12, color: COLORS.neutral400 }}>{med.dispense}</p>
                  </div>
                  <button style={{
                    padding: "6px 14px", borderRadius: 8,
                    background: med.status === "Ready" ? COLORS.green : COLORS.amber,
                    color: "#fff", border: "none", fontSize: 12, fontWeight: 500, cursor: "pointer"
                  }}>{med.status === "Ready" ? "Dispense" : "Verify"}</button>
                </div>
              ))
              : <p style={{ fontSize: 13, color: COLORS.neutral400 }}>No pending medications.</p>
            }
          </div>
        )}

        {tab === "vitals" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { label: "Blood pressure", value: patient.bp, unit: "mmHg", alert: patient.bp !== "—" && parseInt(patient.bp) > 140 },
              { label: "Heart rate", value: `${patient.hr}`, unit: "bpm", alert: patient.hr > 100 },
              { label: "Temperature", value: `${patient.temp}`, unit: "°C", alert: patient.temp > 38 },
              { label: "Oxygen saturation", value: `${patient.spo2}`, unit: "%", alert: patient.spo2 < 95 },
            ].map(v => (
              <div key={v.label} style={{
                padding: 16, borderRadius: 10,
                background: v.alert ? COLORS.redLight : COLORS.neutral50,
                border: `1px solid ${v.alert ? COLORS.red + "40" : COLORS.neutral200}`
              }}>
                <p style={{ margin: 0, fontSize: 11, color: v.alert ? COLORS.red : COLORS.neutral400 }}>{v.label}</p>
                <p style={{ margin: "6px 0 0", fontSize: 24, fontWeight: 600, color: v.alert ? COLORS.red : COLORS.neutral800, fontFamily: "monospace" }}>
                  {v.value}<span style={{ fontSize: 13, fontWeight: 400, marginLeft: 4 }}>{v.unit}</span>
                </p>
                {v.alert && <p style={{ margin: "4px 0 0", fontSize: 11, color: COLORS.red }}>Outside normal range</p>}
              </div>
            ))}
          </div>
        )}

        {tab === "audit" && (
          <div>
            {[
              { time: "09:18", user: "Dr. Kamau", action: "Opened patient record" },
              { time: "08:50", user: "Nurse Aisha", action: "Recorded vitals" },
              { time: "08:32", user: "Receptionist M.", action: "Registered patient" },
            ].map((log, i) => (
              <div key={i} style={{
                display: "flex", gap: 10, padding: "10px 0",
                borderBottom: `1px solid ${COLORS.neutral100}`
              }}>
                <span style={{ fontSize: 11, color: COLORS.neutral400, fontFamily: "monospace", minWidth: 45 }}>{log.time}</span>
                <div>
                  <p style={{ margin: 0, fontSize: 12, fontWeight: 500 }}>{log.user}</p>
                  <p style={{ margin: 0, fontSize: 12, color: COLORS.neutral600 }}>{log.action}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AfyaAIHospital() {
  const [activeNav, setActiveNav] = useState("queue");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [queueFilter, setQueueFilter] = useState("All");
  const [lang, setLang] = useState("EN");
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const highRiskCount = PATIENTS.filter(p => p.risk === "high").length;

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      height: "100vh", background: COLORS.neutral50,
      fontFamily: "'Geist', 'Inter', system-ui, sans-serif",
      fontSize: 13, color: COLORS.neutral800
    }}>
      {/* Top Bar */}
      <header style={{
        height: 52, background: COLORS.primary,
        display: "flex", alignItems: "center", padding: "0 20px",
        gap: 16, flexShrink: 0, zIndex: 10
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 7,
            background: COLORS.teal, display: "flex",
            alignItems: "center", justifyContent: "center"
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <div>
            <span style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>AfyaAI</span>
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, marginLeft: 2 }}>TZA</span>
          </div>
        </div>

        <div style={{
          flex: 1, margin: "0 20px",
          position: "relative"
        }}>
          <svg style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input placeholder="Search patients by name or ID..." style={{
            width: "100%", padding: "7px 12px 7px 32px",
            borderRadius: 8, border: "1px solid rgba(255,255,255,0.2)",
            background: "rgba(255,255,255,0.12)", color: "#fff",
            fontSize: 12, boxSizing: "border-box",
            outline: "none"
          }} />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Offline indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ADE80" }} />
            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>Online</span>
          </div>

          {/* Language */}
          <button onClick={() => setLang(l => l === "EN" ? "SW" : "EN")} style={{
            padding: "4px 10px", borderRadius: 6,
            border: "1px solid rgba(255,255,255,0.3)",
            background: "transparent", color: "#fff",
            fontSize: 11, fontWeight: 500, cursor: "pointer"
          }}>{lang}</button>

          {/* Time */}
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>
            {time.toLocaleTimeString("en-TZ", { hour: "2-digit", minute: "2-digit" })}
          </span>

          {/* User */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 30, height: 30, borderRadius: "50%",
              background: COLORS.teal, display: "flex",
              alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 600, color: "#fff"
            }}>DK</div>
            <div>
              <p style={{ margin: 0, fontSize: 11, color: "#fff", fontWeight: 500 }}>Dr. Kamau</p>
              <p style={{ margin: 0, fontSize: 10, color: "rgba(255,255,255,0.5)" }}>OPD Physician</p>
            </div>
          </div>
        </div>
      </header>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        <aside style={{
          width: 200, background: COLORS.white, flexShrink: 0,
          borderRight: `1px solid ${COLORS.neutral200}`,
          display: "flex", flexDirection: "column", padding: "12px 10px"
        }}>
          <p style={{ margin: "0 0 8px 6px", fontSize: 10, fontWeight: 600, color: COLORS.neutral400, textTransform: "uppercase", letterSpacing: 0.8 }}>Today</p>
          {[
            { id: "queue", icon: "≡", label: "Patient queue", badge: PATIENTS.filter(p => p.status === "Waiting").length },
            { id: "emergency", icon: "!", label: "Emergency", badge: highRiskCount },
            { id: "labs", icon: "⚗", label: "Lab orders", badge: LABS_PENDING.length },
            { id: "pharmacy", icon: "⊕", label: "Pharmacy", badge: MEDICATIONS_PENDING.filter(m => m.status === "Verify").length },
          ].map(item => (
            <NavItem key={item.id} {...item} active={activeNav === item.id} onClick={() => setActiveNav(item.id)} />
          ))}

          <p style={{ margin: "16px 0 8px 6px", fontSize: 10, fontWeight: 600, color: COLORS.neutral400, textTransform: "uppercase", letterSpacing: 0.8 }}>Records</p>
          {[
            { id: "patients", icon: "◎", label: "All patients" },
            { id: "reports", icon: "▤", label: "Reports" },
            { id: "audit", icon: "⊞", label: "Audit log" },
          ].map(item => (
            <NavItem key={item.id} {...item} active={activeNav === item.id} onClick={() => setActiveNav(item.id)} />
          ))}

          <div style={{ flex: 1 }} />
          <div style={{ padding: "10px 8px", borderTop: `1px solid ${COLORS.neutral100}` }}>
            <p style={{ margin: 0, fontSize: 11, color: COLORS.neutral400 }}>
              Muhimbili National · OPD
            </p>
          </div>
        </aside>

        {/* Main content */}
        <main style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {/* Stats row + queue */}
          {(activeNav === "queue" || activeNav === "emergency") && (
            <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
              {/* Left: Stats + Queue */}
              <div style={{ width: 360, flexShrink: 0, display: "flex", flexDirection: "column", borderRight: `1px solid ${COLORS.neutral200}`, background: COLORS.white }}>
                {/* Stats */}
                <div style={{ padding: "14px 16px", borderBottom: `1px solid ${COLORS.neutral200}` }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {STATS.map(s => (
                      <div key={s.label} style={{
                        padding: "10px 12px", borderRadius: 8,
                        background: COLORS.neutral50, border: `1px solid ${COLORS.neutral200}`
                      }}>
                        <p style={{ margin: 0, fontSize: 10, color: COLORS.neutral400 }}>{s.label}</p>
                        <p style={{ margin: "3px 0", fontSize: 20, fontWeight: 600, color: s.color }}>{s.value}</p>
                        <p style={{ margin: 0, fontSize: 10, color: COLORS.neutral400 }}>{s.delta}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Queue header */}
                <div style={{ padding: "12px 16px 8px", borderBottom: `1px solid ${COLORS.neutral100}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h2 style={{ margin: 0, fontSize: 13, fontWeight: 600, color: COLORS.neutral800 }}>
                      Patient queue
                    </h2>
                    <span style={{ fontSize: 11, color: COLORS.neutral400 }}>{PATIENTS.length} patients</span>
                  </div>
                </div>

                <div style={{ flex: 1, overflowY: "auto" }}>
                  <QueuePanel
                    patients={activeNav === "emergency"
                      ? PATIENTS.filter(p => p.risk === "high")
                      : PATIENTS}
                    selectedId={selectedPatient?.id}
                    onSelect={setSelectedPatient}
                    filter={queueFilter}
                    onFilterChange={setQueueFilter}
                  />
                </div>
              </div>

              {/* Right: Patient detail */}
              <div style={{ flex: 1, overflowY: "auto", background: COLORS.white }}>
                <PatientDetail patient={selectedPatient} />
              </div>
            </div>
          )}

          {activeNav === "labs" && (
            <div style={{ flex: 1, padding: 24, overflowY: "auto" }}>
              <h2 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 600 }}>Lab orders</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {LABS_PENDING.map((lab, i) => (
                  <div key={i} style={{
                    padding: 16, borderRadius: 10,
                    background: COLORS.white, border: `1px solid ${COLORS.neutral200}`,
                    display: "flex", justifyContent: "space-between", alignItems: "center"
                  }}>
                    <div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                        <p style={{ margin: 0, fontWeight: 500, fontSize: 13 }}>{lab.test}</p>
                        <span style={{
                          padding: "2px 8px", borderRadius: 10,
                          background: lab.priority === "Urgent" ? COLORS.redLight : COLORS.neutral100,
                          color: lab.priority === "Urgent" ? COLORS.red : COLORS.neutral600,
                          fontSize: 11
                        }}>{lab.priority}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: 12, color: COLORS.neutral400 }}>{lab.patient} · Ordered {lab.ordered}</p>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <span style={{
                        padding: "5px 12px", borderRadius: 8,
                        background: lab.status === "Processing" ? COLORS.blueLight : COLORS.neutral100,
                        color: lab.status === "Processing" ? COLORS.blue : COLORS.neutral600,
                        fontSize: 12
                      }}>{lab.status}</span>
                      <button style={{
                        padding: "5px 12px", borderRadius: 8,
                        background: COLORS.teal, color: "#fff",
                        border: "none", fontSize: 12, cursor: "pointer"
                      }}>Enter results</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeNav === "pharmacy" && (
            <div style={{ flex: 1, padding: 24, overflowY: "auto" }}>
              <h2 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 600 }}>Pharmacy — pending dispense</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {MEDICATIONS_PENDING.map((med, i) => (
                  <div key={i} style={{
                    padding: 16, borderRadius: 10,
                    background: COLORS.white, border: `1px solid ${COLORS.neutral200}`,
                    display: "flex", justifyContent: "space-between", alignItems: "center"
                  }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 500, fontSize: 13 }}>{med.drug}</p>
                      <p style={{ margin: "3px 0 0", fontSize: 12, color: COLORS.neutral400 }}>{med.patient} · {med.dispense}</p>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button style={{
                        padding: "7px 14px", borderRadius: 8,
                        background: med.status === "Ready" ? COLORS.green : COLORS.amber,
                        color: "#fff", border: "none", fontSize: 12, fontWeight: 500, cursor: "pointer"
                      }}>{med.status}</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(activeNav === "patients" || activeNav === "reports" || activeNav === "audit") && (
            <div style={{ flex: 1, padding: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ textAlign: "center", color: COLORS.neutral400 }}>
                <p style={{ fontSize: 15, fontWeight: 500, color: COLORS.neutral600 }}>
                  {activeNav === "patients" ? "All Patients" : activeNav === "reports" ? "Reports" : "Audit Log"}
                </p>
                <p style={{ fontSize: 13 }}>Select a section from the queue to continue</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}