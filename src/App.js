import { useState, useEffect, useCallback } from "react";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const PEOPLE = ["Weasley", "Amy", "Joanne", "Yume"];

const TRIP_DAYS = [
  {
    id: "day1",
    dayNum: "Day 1",
    date: "Wed 17 Jun",
    name: "Arrival",
    meta: "Queenstown",
    driveVal: "3:40",
    driveUnit: "PM Land",
    dotsTotal: 5,
    dotsDone: 3,
    activities: [
      { id: "d1a1", time: "3:40 PM", name: "Arrive Queenstown", badge: "Done", badgeType: "done", defaultDone: true },
      { id: "d1a2", time: "4:00 PM", name: "Pick up rental car", badge: "Done", badgeType: "done", defaultDone: true },
      { id: "d1a3", time: "6:30 PM", name: "Fergburger", badge: "$15–20", badgeType: "opt", defaultDone: false },
      { id: "d1a4", time: "8:00 PM", name: "Grocery shopping", badge: "Essential", badgeType: "warn", defaultDone: false },
    ],
  },
  {
    id: "day2",
    dayNum: "Day 2",
    date: "Thu 18 Jun",
    name: "Wānaka",
    meta: "82 km",
    driveVal: "1h 19",
    driveUnit: "Drive",
    dotsTotal: 5,
    dotsDone: 0,
    warn: "Crown Range — chains likely required",
    preview: ["Arrowtown", "Crown Range", "Cardrona", "#ThatTree", "+ 4 more"],
    activities: [
      { id: "d2a1", time: "9:00 AM", name: "Drive Crown Range", badge: "Scenic", badgeType: "purple", defaultDone: false },
      { id: "d2a2", time: "10:30 AM", name: "Stop at Arrowtown", badge: "30 min", badgeType: "opt", defaultDone: false },
      { id: "d2a3", time: "12:00 PM", name: "Photo at #ThatWānakaTree", badge: "Iconic", badgeType: "purple", defaultDone: false },
      { id: "d2a4", time: "1:00 PM", name: "Lunch at Wānaka waterfront", badge: "$15–25", badgeType: "opt", defaultDone: false },
      { id: "d2a5", time: "3:00 PM", name: "Check in accommodation", badge: "Essential", badgeType: "warn", defaultDone: false },
      { id: "d2a6", time: "5:00 PM", name: "Wānaka walk & sunset", badge: "Free", badgeType: "done", defaultDone: false },
    ],
  },
  {
    id: "day3",
    dayNum: "Day 3",
    date: "Fri 19 Jun",
    name: "Fox Glacier",
    meta: "220 km",
    driveVal: "3h 10",
    driveUnit: "Drive",
    dotsTotal: 5,
    dotsDone: 0,
    activities: [
      { id: "d3a1", time: "8:00 AM", name: "Early departure Wānaka", badge: "Essential", badgeType: "warn", defaultDone: false },
      { id: "d3a2", time: "10:00 AM", name: "Haast Pass scenic drive", badge: "UNESCO", badgeType: "purple", defaultDone: false },
      { id: "d3a3", time: "12:00 PM", name: "Lunch at Fox township", badge: "$15–20", badgeType: "opt", defaultDone: false },
      { id: "d3a4", time: "2:00 PM", name: "Check in Fox Glacier Lodge", badge: "Booked", badgeType: "done", defaultDone: false },
      { id: "d3a5", time: "4:00 PM", name: "Franz Josef glacier walk", badge: "Free", badgeType: "done", defaultDone: false },
    ],
  },
  {
    id: "day4",
    dayNum: "Day 4",
    date: "Sat 20 Jun",
    name: "Glacier Hike",
    meta: "Fox Glacier",
    driveVal: "6:00",
    driveUnit: "AM Meet",
    dotsTotal: 5,
    dotsDone: 0,
    activities: [
      { id: "d4a1", time: "6:00 AM", name: "Meet guide at helipad", badge: "Booked", badgeType: "done", defaultDone: false },
      { id: "d4a2", time: "6:30 AM", name: "Helicopter to glacier", badge: "$752 pp", badgeType: "warn", defaultDone: false },
      { id: "d4a3", time: "7:00–11:00 AM", name: "Ice hike — Fox Glacier", badge: "4 hrs", badgeType: "purple", defaultDone: false },
      { id: "d4a4", time: "12:00 PM", name: "Debrief lunch + dry off", badge: "$20–30", badgeType: "opt", defaultDone: false },
      { id: "d4a5", time: "2:00 PM", name: "Afternoon free / relax", badge: "Optional", badgeType: "opt", defaultDone: false },
    ],
  },
  {
    id: "day5",
    dayNum: "Day 5",
    date: "Sun 21 Jun",
    name: "Hokitika",
    meta: "145 km",
    driveVal: "2h 00",
    driveUnit: "Drive",
    dotsTotal: 5,
    dotsDone: 0,
    activities: [
      { id: "d5a1", time: "9:00 AM", name: "Hokitika Gorge walk", badge: "Turquoise", badgeType: "purple", defaultDone: false },
      { id: "d5a2", time: "11:30 AM", name: "Hokitika town & greenstone", badge: "Shopping", badgeType: "opt", defaultDone: false },
      { id: "d5a3", time: "1:30 PM", name: "Lunch at Stumbles", badge: "$20–35", badgeType: "opt", defaultDone: false },
      { id: "d5a4", time: "3:30 PM", name: "Check in Hokitika accommodation", badge: "Booked", badgeType: "done", defaultDone: false },
      { id: "d5a5", time: "8:00 PM", name: "Glowworm Dell — free!!", badge: "Free", badgeType: "done", defaultDone: false },
    ],
  },
  {
    id: "day6",
    dayNum: "Day 6",
    date: "Mon 22 Jun",
    name: "Waitomo",
    meta: "340 km",
    driveVal: "4h 30",
    driveUnit: "Drive",
    dotsTotal: 5,
    dotsDone: 0,
    activities: [
      { id: "d6a1", time: "8:00 AM", name: "Early start — long drive north", badge: "Essential", badgeType: "warn", defaultDone: false },
      { id: "d6a2", time: "12:00 PM", name: "Lunch stop — Otorohanga", badge: "$15–20", badgeType: "opt", defaultDone: false },
      { id: "d6a3", time: "2:00 PM", name: "Waitomo Glowworm Caves", badge: "Booked", badgeType: "done", defaultDone: false },
      { id: "d6a4", time: "4:30 PM", name: "Check in Waitomo accommodation", badge: "Booked", badgeType: "done", defaultDone: false },
      { id: "d6a5", time: "7:00 PM", name: "Dinner in Hamilton / local", badge: "$25–40", badgeType: "opt", defaultDone: false },
    ],
  },
  {
    id: "day7",
    dayNum: "Day 7",
    date: "Tue 23 Jun",
    name: "Fly Home",
    meta: "Auckland",
    driveVal: "2h 00",
    driveUnit: "To AKL",
    dotsTotal: 5,
    dotsDone: 0,
    activities: [
      { id: "d7a1", time: "8:00 AM", name: "Check out & drive to Auckland", badge: "Essential", badgeType: "warn", defaultDone: false },
      { id: "d7a2", time: "11:00 AM", name: "Return rental car at AKL", badge: "Required", badgeType: "warn", defaultDone: false },
      { id: "d7a3", time: "12:00 PM", name: "Lunch near airport", badge: "$15–25", badgeType: "opt", defaultDone: false },
      { id: "d7a4", time: "2:30 PM", name: "AKL airport check-in", badge: "VA 120", badgeType: "purple", defaultDone: false },
      { id: "d7a5", time: "5:30 PM", name: "Depart Auckland → Brisbane", badge: "Fly home", badgeType: "done", defaultDone: false },
    ],
  },
];

const TODO_GROUPS = [
  {
    id: "today",
    label: "Do Today",
    emoji: "🔴",
    sublabel: "Urgent",
    items: [
      { id: "t1", cat: "Critical", name: "Apply NZeTA — all 4 people", badge: "Urgent", badgeType: "warn", defaultDone: false },
      { id: "t2", cat: "Critical", name: "Book Milford Sound cruise", badge: "Urgent", badgeType: "warn", defaultDone: false },
      { id: "t3", cat: "Critical", name: "Book glowworm caves", badge: "Urgent", badgeType: "warn", defaultDone: false },
      { id: "t4", cat: "Done", name: "Book glacier hike", badge: "Done", badgeType: "done", defaultDone: true },
    ],
  },
  {
    id: "thisweek",
    label: "This Week",
    emoji: "🟡",
    sublabel: "Prep",
    items: [
      { id: "t5", cat: "Insurance", name: "Verify HSBC travel cover", badge: "Done", badgeType: "done", defaultDone: true },
      { id: "t6", cat: "Insurance", name: "Buy rental car excess cover", badge: "Done", badgeType: "done", defaultDone: true },
      { id: "t7", cat: "Phone", name: "Download offline maps", badge: "All 4", badgeType: "opt", defaultDone: false },
      { id: "t8", cat: "Phone", name: "Enable international roaming", badge: "All 4 phones", badgeType: "opt", defaultDone: false },
      { id: "t9", cat: "Money", name: "Exchange AUD → NZD", badge: "$200–300 ea", badgeType: "opt", defaultDone: false },
      { id: "t10", cat: "Rental", name: "Confirm rental car details", badge: "Budget Cars", badgeType: "opt", defaultDone: false },
    ],
  },
  {
    id: "beforeyougo",
    label: "Before You Go",
    emoji: "🟢",
    sublabel: "Packing",
    subNote: "3–5 days before",
    items: [
      { id: "t11", cat: "Gear", name: "Pack winter layers + waterproofs", badge: "Essential", badgeType: "warn", defaultDone: false },
      { id: "t12", cat: "Gear", name: "Clean hiking boots", badge: "Biosecurity", badgeType: "warn", defaultDone: false },
      { id: "t13", cat: "Tech", name: "Charge all power banks", badge: "All 4", badgeType: "opt", defaultDone: false },
      { id: "t14", cat: "Flight", name: "Online check-in VA 119", badge: "Opens 48h", badgeType: "opt", defaultDone: false },
    ],
  },
  {
    id: "duringtrip",
    label: "During Trip",
    emoji: "📍",
    sublabel: "Reminders",
    items: [
      { id: "t15", cat: "Daily", name: "Check weather + road conditions", badge: "MetService", badgeType: "purple", defaultDone: false },
      { id: "t16", cat: "Safety", name: "Share location with family back home", badge: "All 4", badgeType: "opt", defaultDone: false },
      { id: "t17", cat: "Log", name: "Add expenses to Budget tab", badge: "Daily", badgeType: "opt", defaultDone: false },
    ],
  },
];

const EXPENSE_CATS = ["Activity", "Food", "Transport", "Accommodation", "Other"];
const CAT_STYLE = {
  Activity:      { bg: "rgba(83,74,183,0.1)",   color: "#262626", dot: "#262626", bar: "#262626", emoji: "⛰" },
  Food:          { bg: "rgba(234,88,12,0.1)",   color: "#9A3412", dot: "#EA580C", bar: "#EA580C", emoji: "🍔" },
  Transport:     { bg: "rgba(30,130,90,0.1)",   color: "#0F5235", dot: "#1E8259", bar: "#1E8259", emoji: "⛽" },
  Accommodation: { bg: "rgba(38,38,38,0.08)",   color: "#262626", dot: "#262626", bar: "rgba(38,38,38,0.35)", emoji: "🏠" },
  Other:         { bg: "rgba(186,117,23,0.1)",  color: "#633806", dot: "#BA7517", bar: "#BA7517", emoji: "📦" },
};

const BADGE_STYLE = {
  done:   { background: "rgba(30,130,90,0.11)",  color: "#0F5235" },
  warn:   { background: "rgba(186,117,23,0.11)", color: "#633806" },
  opt:    { background: "rgba(38,38,38,0.07)",   color: "#262626" },
  purple: { background: "rgba(83,74,183,0.11)",  color: "#262626" },
};

const INITIAL_EXPENSES = [
  { id: "e1", cat: "Activity", name: "Glacier Hike × 4", amount: 3008, paidBy: "Weasley", note: "$752 pp · 4 people", date: "Sat 20 Jun" },
  { id: "e2", cat: "Food", name: "New World Queenstown", amount: 94, paidBy: "Amy", note: "Groceries for Days 1–3", date: "Wed 17 Jun" },
  { id: "e3", cat: "Food", name: "Fergburger × 4", amount: 72, paidBy: "Joanne", note: "$18 pp · 4 people", date: "Wed 17 Jun" },
  { id: "e4", cat: "Transport", name: "Fuel — Queenstown BP", amount: 68, paidBy: "Yume", note: "$17 pp · 4 people", date: "Thu 18 Jun" },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function getLS(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
}
function setLS(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }

function buildDefaultChecked() {
  const map = {};
  TRIP_DAYS.forEach(d => d.activities.forEach(a => { map[a.id] = a.defaultDone; }));
  TODO_GROUPS.forEach(g => g.items.forEach(i => { map[i.id] = i.defaultDone; }));
  return map;
}

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

const S = {
  bg: "#E7E6ED",
  card: "#FFFFFF",
  dark: "#262626",
  text: "#262626",
  muted: "rgba(38,38,38,0.35)",
  faint: "rgba(38,38,38,0.08)",
  lightBg: "#F7F7F9",
};

function Notch({ left, top, size = 20 }) {
  return (
    <div style={{
      position: "absolute",
      width: size, height: size,
      background: S.bg, borderRadius: "50%",
      zIndex: 10,
      [left ? "left" : "right"]: -(size / 2),
      top,
    }} />
  );
}

function Badge({ type, children }) {
  const st = BADGE_STYLE[type] || BADGE_STYLE.opt;
  return (
    <span style={{
      fontSize: 8, fontWeight: 600, padding: "3px 8px",
      borderRadius: 8, flexShrink: 0,
      background: st.background, color: st.color,
      opacity: type === "opt" ? 0.7 : 1,
    }}>{children}</span>
  );
}

function Checkbox({ checked, onToggle }) {
  return (
    <div
      onClick={onToggle}
      style={{
        width: 18, height: 18, borderRadius: "50%",
        border: checked ? "1.5px solid " + S.dark : "1.5px solid rgba(38,38,38,0.15)",
        background: checked ? S.dark : "transparent",
        flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer",
      }}
    >
      {checked && (
        <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
          <path d="M1 3L3 5L7 1" stroke="#E7E6ED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </div>
  );
}

function ActivityRow({ id, time, name, badge, badgeType, checked, onToggle }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "8px 0",
      borderBottom: "0.5px solid rgba(38,38,38,0.06)",
    }}>
      <Checkbox checked={checked} onToggle={onToggle} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 8, fontWeight: 500, color: S.text, opacity: 0.25, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 1 }}>{time}</div>
        <div style={{
          fontSize: 12, fontWeight: 500, color: S.text,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          textDecoration: checked ? "line-through" : "none",
          opacity: checked ? 0.22 : 1,
        }}>{name}</div>
      </div>
      <Badge type={badgeType}>{badge}</Badge>
    </div>
  );
}

// ─── TRIP PAGE ────────────────────────────────────────────────────────────────

function TripPage({ checked, onToggle }) {
  const [expanded, setExpanded] = useState({ day1: true });

  const totalActs = TRIP_DAYS.reduce((n, d) => n + d.activities.length, 0);
  const doneActs = TRIP_DAYS.reduce((n, d) => n + d.activities.filter(a => checked[a.id]).length, 0);
  const pct = Math.round((doneActs / totalActs) * 100);
  const segs = 7;
  const segsOn = Math.round((pct / 100) * segs);

  return (
    <div style={{ padding: "12px 18px 48px" }}>
      {/* Hero ticket */}
      <div style={{ position: "relative", marginBottom: 10 }}>
        <div style={{ background: S.card, borderRadius: 18, overflow: "hidden" }}>
          {/* Top */}
          <div style={{ padding: "18px 20px" }}>
            <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: S.text, opacity: 0.35, marginBottom: 12 }}>Jun 17–23 · 2026</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 0 }}>
              <div>
                <div style={{ fontSize: 34, fontWeight: 800, color: S.text, letterSpacing: -2, lineHeight: 1, marginBottom: 3 }}>BNE</div>
                <div style={{ fontSize: 10, color: S.text, opacity: 0.4 }}>Brisbane, AU</div>
              </div>
              <div style={{ padding: "0 10px" }}>
                <svg width="16" height="10" viewBox="0 0 24 16" fill="none">
                  <path d="M2 8h20M14 2l8 6-8 6" stroke={S.dark} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.25"/>
                </svg>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 34, fontWeight: 800, color: S.text, letterSpacing: -2, lineHeight: 1, marginBottom: 3 }}>ZQN</div>
                <div style={{ fontSize: 10, color: S.text, opacity: 0.4 }}>Queenstown, NZ</div>
              </div>
            </div>
          </div>
          {/* Dashed divider */}
          <div style={{ position: "relative", height: 1 }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, borderTop: "1.5px dashed rgba(38,38,38,0.15)" }} />
          </div>
          {/* Bottom */}
          <div style={{ padding: "16px 20px 18px", background: S.lightBg }}>
            <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: S.text, opacity: 0.3, marginBottom: 2 }}>Trip Progress</div>
            <div style={{ fontSize: 11, color: S.text, opacity: 0.4, marginBottom: 12 }}>{doneActs} of {totalActs} activities completed</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ fontSize: 34, fontWeight: 700, color: S.text, letterSpacing: -2, lineHeight: 1, flexShrink: 0 }}>{pct}%</div>
              <div style={{ display: "flex", gap: 2, flex: 1 }}>
                {Array.from({ length: segs }).map((_, i) => (
                  <div key={i} style={{ flex: 1, height: 18, borderRadius: 3, background: i < segsOn ? S.dark : "rgba(38,38,38,0.09)" }} />
                ))}
              </div>
            </div>
          </div>
        </div>
        <Notch left top={130} />
        <Notch top={130} />
      </div>

      <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: S.text, opacity: 0.25, padding: "4px 4px 10px" }}>Your Days</div>

      {TRIP_DAYS.map((day) => {
        const isOpen = expanded[day.id];
        const dayDone = day.activities.filter(a => checked[a.id]).length;
        return (
          <div key={day.id} style={{ position: "relative", marginBottom: 10 }}>
            <div style={{ borderRadius: 18, overflow: "hidden" }}>
              {/* Dark header */}
              <div
                style={{ background: S.dark, padding: "16px 20px 18px", cursor: "pointer" }}
                onClick={() => setExpanded(e => ({ ...e, [day.id]: !e[day.id] }))}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 8, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "#E7E6ED", opacity: 0.35, marginBottom: 4 }}>{day.dayNum} · {day.date}</div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: "#E7E6ED", letterSpacing: -1, lineHeight: 1, marginBottom: 4 }}>{day.name}</div>
                    <div style={{ fontSize: 10, color: "#E7E6ED", opacity: 0.38 }}>{day.meta}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: "#E7E6ED", letterSpacing: -1, lineHeight: 1 }}>{day.driveVal}</div>
                    <div style={{ fontSize: 8, fontWeight: 500, color: "#E7E6ED", opacity: 0.28, letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 2 }}>{day.driveUnit}</div>
                    <div style={{ fontSize: 9, color: "#E7E6ED", opacity: 0.4, marginTop: 6 }}>{dayDone}/{day.activities.length} done</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 2 }}>
                  {Array.from({ length: day.dotsTotal }).map((_, i) => (
                    <div key={i} style={{ flex: 1, height: 2, borderRadius: 2, background: i < day.dotsDone ? "rgba(231,230,237,0.55)" : "rgba(231,230,237,0.15)" }} />
                  ))}
                </div>
              </div>
              {/* Dashed divider */}
              <div style={{ position: "relative", height: 1 }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, borderTop: "1.5px dashed rgba(231,230,237,0.22)" }} />
              </div>
              {/* White body */}
              <div style={{ background: S.card }}>
                {day.warn && !isOpen && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 9, fontWeight: 500, color: "#854F0B", background: "rgba(186,117,23,0.08)", borderRadius: 7, padding: "6px 9px", margin: "10px 20px 2px" }}>
                    <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#BA7517", flexShrink: 0 }} />
                    {day.warn}
                  </div>
                )}
                {!isOpen && day.preview && (
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap", padding: "8px 20px 14px" }}>
                    {day.preview.map(p => (
                      <span key={p} style={{ fontSize: 9, fontWeight: 500, background: "rgba(38,38,38,0.06)", color: S.text, opacity: 0.55, borderRadius: 7, padding: "3px 8px" }}>{p}</span>
                    ))}
                  </div>
                )}
                {isOpen && (
                  <div style={{ padding: "4px 20px 4px" }}>
                    {day.warn && (
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 9, fontWeight: 500, color: "#854F0B", background: "rgba(186,117,23,0.08)", borderRadius: 7, padding: "6px 9px", margin: "6px 0 4px" }}>
                        <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#BA7517", flexShrink: 0 }} />
                        {day.warn}
                      </div>
                    )}
                    {day.activities.map((act, idx) => (
                      <div key={act.id} style={{ borderBottom: idx < day.activities.length - 1 ? "0.5px solid rgba(38,38,38,0.06)" : "none", paddingBottom: idx === day.activities.length - 1 ? 10 : 0 }}>
                        <ActivityRow
                          {...act}
                          checked={!!checked[act.id]}
                          onToggle={() => onToggle(act.id)}
                        />
                      </div>
                    ))}
                  </div>
                )}
                {!isOpen && !day.preview && (
                  <div style={{ padding: "10px 20px 14px" }}>
                    <div style={{ fontSize: 10, color: S.text, opacity: 0.3, fontStyle: "italic" }}>Tap to expand {day.activities.length} activities</div>
                  </div>
                )}
              </div>
            </div>
            <Notch left top={95} />
            <Notch top={95} />
          </div>
        );
      })}
    </div>
  );
}

// ─── TODO PAGE ────────────────────────────────────────────────────────────────

function TodoPage({ checked, onToggle }) {
  return (
    <div style={{ padding: "12px 18px 48px" }}>
      {TODO_GROUPS.map((group) => {
        const total = group.items.length;
        const done = group.items.filter(i => checked[i.id]).length;
        return (
          <div key={group.id}>
            <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: S.text, opacity: 0.25, padding: "4px 4px 10px" }}>
              {group.label}
            </div>
            <div style={{ position: "relative", marginBottom: 10 }}>
              <div style={{ borderRadius: 18, overflow: "hidden" }}>
                <div style={{ background: S.dark, padding: "14px 20px 16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontSize: 8, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "#E7E6ED", opacity: 0.35, marginBottom: 3 }}>
                        {group.emoji} {group.subNote || group.sublabel} — {total} items
                      </div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: "#E7E6ED", letterSpacing: -1, lineHeight: 1 }}>{group.label}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 18, fontWeight: 700, color: "#E7E6ED", letterSpacing: -1 }}>{done}/{total}</div>
                      <div style={{ fontSize: 8, fontWeight: 500, color: "#E7E6ED", opacity: 0.28, letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 2 }}>done</div>
                    </div>
                  </div>
                </div>
                <div style={{ position: "relative", height: 1 }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, borderTop: "1.5px dashed rgba(231,230,237,0.22)" }} />
                </div>
                <div style={{ background: S.card, padding: "4px 20px 4px" }}>
                  {group.items.map((item, idx) => (
                    <div key={item.id} style={{ borderBottom: idx < group.items.length - 1 ? "0.5px solid rgba(38,38,38,0.06)" : "none", paddingBottom: idx === group.items.length - 1 ? 10 : 0 }}>
                      <ActivityRow
                        id={item.id}
                        time={item.cat}
                        name={item.name}
                        badge={item.badge}
                        badgeType={item.badgeType}
                        checked={!!checked[item.id]}
                        onToggle={() => onToggle(item.id)}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <Notch left top={72} />
              <Notch top={72} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── BUDGET PAGE ──────────────────────────────────────────────────────────────

function BudgetPage({ expenses, onAdd, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", cat: "Activity", amount: "", paidBy: "Weasley", note: "" });

  const total = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const perPerson = Math.round(total / 4);
  const budget = 4000;
  const remaining = budget - total;
  const spentPct = Math.min(100, Math.round((total / budget) * 100));
  const segs = 7;
  const segsOn = Math.round((spentPct / 100) * segs);

  const catTotals = {};
  EXPENSE_CATS.forEach(c => { catTotals[c] = 0; });
  expenses.forEach(e => { catTotals[e.cat] = (catTotals[e.cat] || 0) + Number(e.amount); });
  const maxCat = Math.max(...Object.values(catTotals), 1);

  const handleAdd = () => {
    if (!form.name || !form.amount) return;
    const today = new Date();
    const dateStr = today.toLocaleDateString("en-NZ", { weekday: "short", day: "numeric", month: "short" });
    onAdd({ ...form, amount: Number(form.amount), date: dateStr, id: "e" + Date.now() });
    setForm({ name: "", cat: "Activity", amount: "", paidBy: "Weasley", note: "" });
    setShowForm(false);
  };

  return (
    <div style={{ padding: "12px 18px 48px" }}>
      {/* Summary ticket */}
      <div style={{ position: "relative", marginBottom: 10 }}>
        <div style={{ background: S.card, borderRadius: 18, overflow: "hidden" }}>
          <div style={{ padding: "18px 20px" }}>
            <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: S.text, opacity: 0.35, marginBottom: 12 }}>Jun 17–23 · 4 people</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 11, color: S.text, opacity: 0.4, marginBottom: 4 }}>Total spent</div>
                <div style={{ fontSize: 34, fontWeight: 700, color: S.text, letterSpacing: -2, lineHeight: 1 }}>
                  <span style={{ fontSize: 16, fontWeight: 500, opacity: 0.4 }}>NZD </span>{total.toLocaleString()}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 9, fontWeight: 500, color: S.text, opacity: 0.3, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 3 }}>Per person</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: S.text, letterSpacing: -0.8 }}>${perPerson.toLocaleString()}</div>
              </div>
            </div>
            {EXPENSE_CATS.filter(c => catTotals[c] > 0).map(c => {
              const st = CAT_STYLE[c];
              const pct = Math.round((catTotals[c] / maxCat) * 100);
              return (
                <div key={c} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: st.dot, flexShrink: 0 }} />
                  <div style={{ fontSize: 11, fontWeight: 500, color: S.text, flex: 1 }}>{c}</div>
                  <div style={{ flex: 2, height: 4, background: "rgba(38,38,38,0.08)", borderRadius: 2 }}>
                    <div style={{ width: pct + "%", height: "100%", background: st.bar, borderRadius: 2 }} />
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: S.text, textAlign: "right", width: 52, letterSpacing: -0.3 }}>${catTotals[c]}</div>
                </div>
              );
            })}
          </div>
          <div style={{ position: "relative", height: 1 }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, borderTop: "1.5px dashed rgba(38,38,38,0.15)" }} />
          </div>
          <div style={{ padding: "16px 20px 18px", background: S.lightBg }}>
            <div style={{ fontSize: 10, fontWeight: 500, color: S.text, opacity: 0.3, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Remaining budget</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: remaining < 0 ? "#9A3412" : S.text, letterSpacing: -1.5, lineHeight: 1, flexShrink: 0 }}>
                {remaining < 0 ? "-" : ""}${Math.abs(remaining).toLocaleString()}
              </div>
              <div style={{ display: "flex", gap: 2, flex: 1 }}>
                {Array.from({ length: segs }).map((_, i) => (
                  <div key={i} style={{ flex: 1, height: 18, borderRadius: 3, background: i < (segs - segsOn) ? S.dark : "rgba(38,38,38,0.09)" }} />
                ))}
              </div>
            </div>
          </div>
        </div>
        <Notch left top={220} />
        <Notch top={220} />
      </div>

      {/* Add expense button / form */}
      {!showForm ? (
        <div
          onClick={() => setShowForm(true)}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: S.dark, color: "#E7E6ED", borderRadius: 14, padding: 12, fontSize: 12, fontWeight: 600, marginBottom: 10, cursor: "pointer", letterSpacing: -0.1 }}
        >
          <div style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(231,230,237,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, lineHeight: 1 }}>+</div>
          Add Expense
        </div>
      ) : (
        <div style={{ background: S.card, borderRadius: 18, padding: "16px 18px", marginBottom: 10, overflow: "hidden" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: S.text, marginBottom: 12, letterSpacing: -0.3 }}>New Expense</div>
          <input
            placeholder="Description"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            style={inputStyle}
          />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
            <input
              placeholder="Amount (NZD)"
              type="number"
              value={form.amount}
              onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
              style={inputStyle}
            />
            <select value={form.cat} onChange={e => setForm(f => ({ ...f, cat: e.target.value }))} style={inputStyle}>
              {EXPENSE_CATS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 9, fontWeight: 500, color: S.text, opacity: 0.4, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Paid by</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {PEOPLE.map(p => (
                <div
                  key={p}
                  onClick={() => setForm(f => ({ ...f, paidBy: p }))}
                  style={{
                    fontSize: 11, fontWeight: 600, padding: "5px 12px", borderRadius: 10, cursor: "pointer",
                    background: form.paidBy === p ? S.dark : "rgba(38,38,38,0.07)",
                    color: form.paidBy === p ? "#E7E6ED" : S.text,
                    opacity: form.paidBy === p ? 1 : 0.5,
                  }}
                >{p}</div>
              ))}
            </div>
          </div>
          <input
            placeholder="Note (optional)"
            value={form.note}
            onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
            style={{ ...inputStyle, marginBottom: 12 }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <div onClick={handleAdd} style={{ flex: 1, background: S.dark, color: "#E7E6ED", borderRadius: 10, padding: "9px 0", textAlign: "center", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Save</div>
            <div onClick={() => setShowForm(false)} style={{ flex: 1, background: "rgba(38,38,38,0.07)", color: S.text, borderRadius: 10, padding: "9px 0", textAlign: "center", fontSize: 12, fontWeight: 600, cursor: "pointer", opacity: 0.6 }}>Cancel</div>
          </div>
        </div>
      )}

      {/* Split calculator */}
      <SplitCalculator expenses={expenses} />

      <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: S.text, opacity: 0.25, padding: "4px 4px 10px" }}>Expense Log</div>

      {expenses.map((exp) => {
        const st = CAT_STYLE[exp.cat] || CAT_STYLE.Other;
        const pp = Math.round(Number(exp.amount) / 4);
        return (
          <div key={exp.id} style={{ position: "relative", marginBottom: 8 }}>
            <div style={{ background: S.card, borderRadius: 14, overflow: "hidden" }}>
              <div style={{ padding: "12px 16px 14px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1, minWidth: 0, marginRight: 12 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 8, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 6, marginBottom: 6, background: st.bg, color: st.color }}>
                    {st.emoji} {exp.cat}
                  </span>
                  <div style={{ fontSize: 14, fontWeight: 600, color: S.text, letterSpacing: -0.3, marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{exp.name}</div>
                  <div style={{ fontSize: 10, color: S.text, opacity: 0.35 }}>{exp.date} · Paid by {exp.paidBy}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 500, opacity: 0.4, color: S.text }}>NZD</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: S.text, letterSpacing: -1, lineHeight: 1 }}>{Number(exp.amount).toLocaleString()}</div>
                </div>
              </div>
              <div style={{ position: "relative", height: 1 }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, borderTop: "1.5px dashed rgba(38,38,38,0.12)" }} />
              </div>
              <div style={{ padding: "10px 16px 12px", background: "#FAFAFA", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 10, fontWeight: 500, color: S.text, opacity: 0.4 }}>{exp.note || `$${pp} pp · 4 people`}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 9, fontWeight: 600, padding: "3px 8px", borderRadius: 7, background: "rgba(38,38,38,0.06)", color: S.text, opacity: 0.5 }}>Split equally</span>
                  <span
                    onClick={() => onDelete(exp.id)}
                    style={{ fontSize: 9, fontWeight: 600, padding: "3px 8px", borderRadius: 7, background: "rgba(186,117,23,0.1)", color: "#633806", cursor: "pointer" }}
                  >✕</span>
                </div>
              </div>
            </div>
            <Notch left top={56} size={16} />
            <Notch top={56} size={16} />
          </div>
        );
      })}
    </div>
  );
}

const inputStyle = {
  width: "100%", background: "rgba(38,38,38,0.05)", border: "none", borderRadius: 10,
  padding: "9px 12px", fontSize: 12, fontWeight: 500, color: "#262626",
  marginBottom: 8, outline: "none", fontFamily: "inherit",
};

function SplitCalculator({ expenses }) {
  const [open, setOpen] = useState(false);
  // Who owes who
  const paid = {};
  PEOPLE.forEach(p => { paid[p] = 0; });
  expenses.forEach(e => { paid[e.paidBy] = (paid[e.paidBy] || 0) + Number(e.amount); });
  const total = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const share = total / 4;
  const balances = {};
  PEOPLE.forEach(p => { balances[p] = (paid[p] || 0) - share; });

  return (
    <div style={{ marginBottom: 10 }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(38,38,38,0.05)", borderRadius: 14, padding: "11px 16px", cursor: "pointer", marginBottom: open ? 6 : 0 }}
      >
        <div style={{ fontSize: 11, fontWeight: 600, color: S.text, opacity: 0.6 }}>💰 Split Calculator</div>
        <div style={{ fontSize: 10, color: S.text, opacity: 0.3 }}>{open ? "▲" : "▼"}</div>
      </div>
      {open && (
        <div style={{ background: S.card, borderRadius: 14, padding: "14px 16px", overflow: "hidden" }}>
          <div style={{ fontSize: 9, fontWeight: 500, color: S.text, opacity: 0.35, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Each person's share: NZD {Math.round(share).toLocaleString()}</div>
          {PEOPLE.map(p => {
            const bal = balances[p];
            const isOwed = bal > 0;
            const isOwes = bal < 0;
            return (
              <div key={p} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: S.text, flex: 1 }}>{p}</div>
                <div style={{ fontSize: 10, color: S.text, opacity: 0.35 }}>paid ${(paid[p] || 0).toLocaleString()}</div>
                <div style={{
                  fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 8,
                  background: isOwed ? "rgba(30,130,90,0.1)" : isOwes ? "rgba(186,117,23,0.1)" : "rgba(38,38,38,0.06)",
                  color: isOwed ? "#0F5235" : isOwes ? "#633806" : S.text,
                }}>
                  {isOwed ? `+$${Math.abs(Math.round(bal))}` : isOwes ? `-$${Math.abs(Math.round(bal))}` : "Even"}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────

export default function App() {
  const [tab, setTab] = useState("Trip");
  const [checked, setChecked] = useState(() => {
    const def = buildDefaultChecked();
    const saved = getLS("nz_checked", {});
    return { ...def, ...saved };
  });
  const [expenses, setExpenses] = useState(() => getLS("nz_expenses", INITIAL_EXPENSES));

  useEffect(() => { setLS("nz_checked", checked); }, [checked]);
  useEffect(() => { setLS("nz_expenses", expenses); }, [expenses]);

  const toggleCheck = useCallback((id) => {
    setChecked(c => {
      const next = { ...c, [id]: !c[id] };
      return next;
    });
  }, []);

  const addExpense = useCallback((exp) => {
    setExpenses(prev => [exp, ...prev]);
  }, []);

  const deleteExpense = useCallback((id) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: S.bg,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Sticky nav */}
      <div style={{
        position: "sticky", top: 0, zIndex: 100,
        background: S.bg,
        padding: "0 18px",
        borderBottom: "0.5px solid rgba(38,38,38,0.08)",
      }}>
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <div style={{ padding: "14px 0 4px" }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: S.text, letterSpacing: -1, marginBottom: 10 }}>NZ 要幹嘛 🇳🇿</div>
            <div style={{ display: "flex", background: "rgba(38,38,38,0.08)", borderRadius: 20, padding: 3, gap: 1, marginBottom: 10 }}>
              {["Trip","To-do","Budget"].map(t => (
                <div
                  key={t}
                  onClick={() => setTab(t)}
                  style={{
                    flex: 1, textAlign: "center",
                    fontSize: 10, fontWeight: 600, letterSpacing: "0.03em", textTransform: "uppercase",
                    padding: "7px 0", borderRadius: 14, cursor: "pointer",
                    background: tab === t ? S.dark : "transparent",
                    color: tab === t ? "#E7E6ED" : S.text,
                    opacity: tab === t ? 1 : 0.35,
                    transition: "background 0.15s, color 0.15s",
                  }}
                >{t}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Page content */}
      <div style={{ maxWidth: 480, margin: "0 auto", width: "100%", flex: 1 }}>
        {tab === "Trip" && <TripPage checked={checked} onToggle={toggleCheck} />}
        {tab === "To-do" && <TodoPage checked={checked} onToggle={toggleCheck} />}
        {tab === "Budget" && <BudgetPage expenses={expenses} onAdd={addExpense} onDelete={deleteExpense} />}
      </div>
    </div>
  );
}
