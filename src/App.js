import { useState, useEffect, useCallback, useRef } from "react";

const PEOPLE = ["Weasley", "Amy", "Joanne", "Yume"];
const TABS = ["Trip", "To-do", "Budget"];

const TRIP_DAYS = [
  { id: "day1", accom: "14 Hall Street, Queenstown", accomUrl: "https://maps.google.com/?q=14+Hall+Street+Queenstown+New+Zealand", dayNum: "Day 1", date: "Wed 17 Jun", name: "Arrival", meta: "Queenstown", driveVal: "3:40", driveUnit: "PM Land", dotsTotal: 5, dotsDone: 0,
    activities: [
      { id: "d1a1", time: "10:10 AM", name: "Depart Brisbane — VA 119", badge: "Flight", badgeType: "purple", defaultDone: false },
      { id: "d1a2", time: "3:40 PM", name: "Arrive Queenstown Airport (ZQN)", badge: "Land", badgeType: "done", defaultDone: false },
      { id: "d1a3", time: "4:00 PM", name: "Rental car pickup at airport", badge: "Essential", badgeType: "warn", defaultDone: false },
      { id: "d1a4", time: "5:30 PM", name: "Check in — 14 Hall Street, Queenstown", badge: "Booked", badgeType: "done", defaultDone: false },
      { id: "d1a5", time: "6:30 PM", name: "Dinner at Fergburger", badge: "$15–20", badgeType: "opt", defaultDone: false },
      { id: "d1a6", time: "8:00 PM", name: "Grocery shopping — New World Queenstown", badge: "Essential", badgeType: "warn", defaultDone: false },
      { id: "d1a7", time: "9:00 PM", name: "Optional: Below Zero Ice Bar", badge: "$25 pp", badgeType: "opt", defaultDone: false },
    ],
  },
  { id: "day2", accom: "14 Hall Street, Wānaka", accomUrl: "https://maps.google.com/?q=14+Hall+Street+Wanaka+New+Zealand", dayNum: "Day 2", date: "Thu 18 Jun", name: "Arrowtown & Wānaka", meta: "82 km · 1h 19 drive", driveVal: "1h 19", driveUnit: "Drive",
    dotsTotal: 5, dotsDone: 0, warn: "Crown Range — 13% grade, chains likely required",
    preview: ["Arrowtown", "Crown Range", "Cardrona Hotel", "#ThatWānakaTree", "Lake Walk"],
    activities: [
      { id: "d2a1", time: "7:00 AM", name: "Breakfast at accommodation", badge: "Groceries", badgeType: "opt", defaultDone: false },
      { id: "d2a2", time: "8:00 AM", name: "Drive to Arrowtown (12.5 km)", badge: "11 min", badgeType: "opt", defaultDone: false },
      { id: "d2a3", time: "8:15 AM", name: "Explore Buckingham Street", badge: "Free", badgeType: "done", defaultDone: false },
      { id: "d2a4", time: "9:30 AM", name: "Lakes District Museum", badge: "$10 pp", badgeType: "opt", defaultDone: false },
      { id: "d2a5", time: "10:30 AM", name: "Chinese Settlement ruins", badge: "Free", badgeType: "done", defaultDone: false },
      { id: "d2a6", time: "12:00 PM", name: "Drive Crown Range → Wānaka", badge: "Scenic", badgeType: "purple", defaultDone: false },
      { id: "d2a7", time: "1:30 PM", name: "Cardrona Hotel photo stop (est. 1863)", badge: "Photo", badgeType: "opt", defaultDone: false },
      { id: "d2a8", time: "2:00 PM", name: "Check in — 14 Hall Street, Wānaka", badge: "Booked", badgeType: "done", defaultDone: false },
      { id: "d2a9", time: "3:00 PM", name: "Photo at #ThatWānakaTree", badge: "Iconic", badgeType: "purple", defaultDone: false },
      { id: "d2a10", time: "3:30 PM", name: "Lake Wānaka boardwalk", badge: "Free", badgeType: "done", defaultDone: false },
      { id: "d2a11", time: "5:30 PM", name: "Dinner in Wānaka", badge: "$18–48", badgeType: "opt", defaultDone: false },
    ],
  },
  { id: "day3", accom: "13 Coulson Lane, Lake Tekapo", accomUrl: "https://maps.google.com/?q=13+Coulson+Lane+Lake+Tekapo+New+Zealand", dayNum: "Day 3", date: "Fri 19 Jun", name: "Lake Tekapo", meta: "258 km · 3h+ drive", driveVal: "3h+", driveUnit: "Drive",
    dotsTotal: 5, dotsDone: 0, warn: "Lindis Pass — chains likely required (971m elevation)",
    preview: ["Lindis Pass", "Lake Pukaki", "Church of Good Shepherd", "Kohan Lunch", "Stargazing ⭐"],
    activities: [
      { id: "d3a1", time: "7:00 AM", name: "Breakfast + pack lunch sandwiches", badge: "Essential", badgeType: "warn", defaultDone: false },
      { id: "d3a2", time: "8:00 AM", name: "Depart Wānaka — SH6 → SH8", badge: "Early", badgeType: "warn", defaultDone: false },
      { id: "d3a3", time: "9:00 AM", name: "Cromwell stop — fuel + fruit", badge: "15 min", badgeType: "opt", defaultDone: false },
      { id: "d3a4", time: "10:00 AM", name: "Church of the Good Shepherd, Lake Tekapo", badge: "Iconic", badgeType: "purple", defaultDone: false },
      { id: "d3a5", time: "10:30 AM", name: "Lake Tekapo waterfront walk", badge: "Free", badgeType: "done", defaultDone: false },
      { id: "d3a6", time: "12:30 PM", name: "Lunch at Kohan Restaurant, Lake Pukaki", badge: "$24–38", badgeType: "opt", defaultDone: false },
      { id: "d3a7", time: "1:30 PM", name: "Lake Pukaki viewpoint", badge: "Turquoise!", badgeType: "purple", defaultDone: false },
      { id: "d3a8", time: "3:30 PM", name: "Check in — 13 Coulson Lane, Lake Tekapo", badge: "Booked", badgeType: "done", defaultDone: false },
      { id: "d3a9", time: "4:00 PM", name: "Tekapo Springs Hot Pools", badge: "Recommended", badgeType: "purple", defaultDone: false },
      { id: "d3a10", time: "7:00 PM", name: "Dinner in Lake Tekapo", badge: "$22–38", badgeType: "opt", defaultDone: false },
      { id: "d3a11", time: "8:30 PM", name: "Stargazing — Dark Sky Reserve ⭐", badge: "Free / $129", badgeType: "done", defaultDone: false },
    ],
  },
  { id: "day4", accom: "13 Coulson Lane, Lake Tekapo", accomUrl: "https://maps.google.com/?q=13+Coulson+Lane+Lake+Tekapo+New+Zealand", dayNum: "Day 4", date: "Sat 20 Jun", name: "Glacier Hike", meta: "Mt Cook · 62 km from Tekapo", driveVal: "6:30", driveUnit: "AM Wake",
    dotsTotal: 5, dotsDone: 0, warn: "SH80 to Mt Cook — chains required. Leave 7 AM sharp",
    activities: [
      { id: "d4a1", time: "6:30 AM", name: "Wake up — NON-NEGOTIABLE ⏰", badge: "Alarm", badgeType: "warn", defaultDone: false },
      { id: "d4a2", time: "7:00 AM", name: "Depart Lake Tekapo → Mt Cook", badge: "On time!", badgeType: "warn", defaultDone: false },
      { id: "d4a3", time: "8:20 AM", name: "Arrive Mt Cook Village", badge: "62.5 km", badgeType: "opt", defaultDone: false },
      { id: "d4a4", time: "8:45 AM", name: "Safety briefing + gear fitting", badge: "Booked", badgeType: "done", defaultDone: false },
      { id: "d4a5", time: "9:00 AM", name: "Helicopter flight over Tasman Glacier", badge: "Spectacular", badgeType: "purple", defaultDone: false },
      { id: "d4a6", time: "9:15 AM", name: "Glacier hike on Tasman Glacier ⛏️", badge: "3.5 hrs", badgeType: "purple", defaultDone: false },
      { id: "d4a7", time: "12:45 PM", name: "Helicopter return to village", badge: "Done!", badgeType: "done", defaultDone: false },
      { id: "d4a8", time: "1:00 PM", name: "Lunch — Old Mountaineers' Cafe or packed", badge: "$22–35", badgeType: "opt", defaultDone: false },
      { id: "d4a9", time: "2:00 PM", name: "Optional: Hooker Valley Track (10 km)", badge: "3 hrs", badgeType: "opt", defaultDone: false },
      { id: "d4a10", time: "4:30 PM", name: "Drive back to Lake Tekapo", badge: "1h 20", badgeType: "opt", defaultDone: false },
      { id: "d4a11", time: "6:30 PM", name: "Dinner — Mackenzie's or Kohan", badge: "$22–38", badgeType: "opt", defaultDone: false },
    ],
  },
  { id: "day5", accom: "19A Takirirau Ave, Te Anau", accomUrl: "https://maps.google.com/?q=19A+Takirirau+Avenue+Te+Anau+New+Zealand", dayNum: "Day 5", date: "Sun 21 Jun", name: "Te Anau", meta: "364 km · 5h+ drive", driveVal: "5h+", driveUnit: "Drive",
    dotsTotal: 5, dotsDone: 0, warn: "Longest driving day — 6:30 AM departure is essential",
    preview: ["Lindis Pass", "Cromwell fuel stop", "Queenstown brunch", "Te Anau", "Glowworm Caves"],
    activities: [
      { id: "d5a1", time: "6:30 AM", name: "Wake up + fast breakfast", badge: "Early!", badgeType: "warn", defaultDone: false },
      { id: "d5a2", time: "7:00 AM", name: "Depart Lake Tekapo", badge: "On time!", badgeType: "warn", defaultDone: false },
      { id: "d5a3", time: "9:00 AM", name: "Cromwell — MANDATORY fuel + fruit", badge: "15 min", badgeType: "warn", defaultDone: false },
      { id: "d5a4", time: "10:00 AM", name: "Queenstown — brunch break (2 hrs)", badge: "Break", badgeType: "opt", defaultDone: false },
      { id: "d5a5", time: "12:00 PM", name: "Depart Queenstown → Te Anau", badge: "2h 12", badgeType: "opt", defaultDone: false },
      { id: "d5a6", time: "2:30 PM", name: "Check in — 19A Takirirau Ave, Te Anau", badge: "Booked", badgeType: "done", defaultDone: false },
      { id: "d5a7", time: "3:30 PM", name: "Groceries — Fresh Choice Te Anau", badge: "Essential", badgeType: "warn", defaultDone: false },
      { id: "d5a8", time: "4:00 PM", name: "Te Anau lakefront walk", badge: "Free", badgeType: "done", defaultDone: false },
      { id: "d5a9", time: "5:30 PM", name: "Dinner in Te Anau", badge: "$6–35", badgeType: "opt", defaultDone: false },
      { id: "d5a10", time: "7:30 PM", name: "Te Anau Glowworm Caves tour ⭐⭐⭐", badge: "BOOK!", badgeType: "warn", defaultDone: false },
      { id: "d5a11", time: "9:30 PM", name: "Return + pack lunch for Milford", badge: "Prep", badgeType: "warn", defaultDone: false },
    ],
  },
  { id: "day6", accom: "19A Takirirau Ave, Te Anau", accomUrl: "https://maps.google.com/?q=19A+Takirirau+Avenue+Te+Anau+New+Zealand", dayNum: "Day 6", date: "Mon 22 Jun", name: "Milford Sound", meta: "Te Anau base · coach day", driveVal: "6:00", driveUnit: "AM Check",
    dotsTotal: 5, dotsDone: 0, warn: "Check milfordroad.co.nz FIRST at 6 AM — may be closed",
    preview: ["Coach 7:45 AM", "Mirror Lakes", "The Chasm", "Homer Tunnel", "Milford Cruise ⭐⭐⭐⭐⭐"],
    activities: [
      { id: "d6a1", time: "6:00 AM", name: "Wake + check milfordroad.co.nz", badge: "Critical", badgeType: "warn", defaultDone: false },
      { id: "d6a2", time: "6:30 AM", name: "Breakfast + pack day bag", badge: "Essential", badgeType: "warn", defaultDone: false },
      { id: "d6a3", time: "6:45 AM", name: "Walk to RealNZ Visitor Centre", badge: "85 Lakefront Dr", badgeType: "opt", defaultDone: false },
      { id: "d6a4", time: "7:45 AM", name: "Board glass-roof coach to Milford", badge: "Departs", badgeType: "done", defaultDone: false },
      { id: "d6a5", time: "8:30 AM", name: "Coach stop — Mirror Lakes", badge: "Photo!", badgeType: "purple", defaultDone: false },
      { id: "d6a6", time: "9:00 AM", name: "Coach stop — The Chasm walk", badge: "15 min", badgeType: "opt", defaultDone: false },
      { id: "d6a7", time: "9:15 AM", name: "Homer Tunnel (1.2 km raw rock)", badge: "Wow", badgeType: "purple", defaultDone: false },
      { id: "d6a8", time: "11:00 AM", name: "Milford Sound cruise ⭐⭐⭐⭐⭐", badge: "2.5 hrs", badgeType: "purple", defaultDone: false },
      { id: "d6a9", time: "1:30 PM", name: "Lunch at Milford — packed or cafe", badge: "$15–38", badgeType: "opt", defaultDone: false },
      { id: "d6a10", time: "3:00 PM", name: "Board return coach", badge: "Homeward", badgeType: "done", defaultDone: false },
      { id: "d6a11", time: "6:00 PM", name: "Arrive back Te Anau", badge: "Done!", badgeType: "done", defaultDone: false },
      { id: "d6a12", time: "6:30 PM", name: "Celebration dinner 🎉", badge: "You earned it", badgeType: "purple", defaultDone: false },
    ],
  },
  { id: "day7", accom: "", accomUrl: "", dayNum: "Day 7", date: "Tue 23 Jun", name: "Fly Home", meta: "Te Anau → Queenstown → Brisbane", driveVal: "4:35", driveUnit: "PM Fly",
    dotsTotal: 5, dotsDone: 0,
    activities: [
      { id: "d7a1", time: "7:30 AM", name: "Final breakfast + pack all luggage", badge: "Check room!", badgeType: "warn", defaultDone: false },
      { id: "d7a2", time: "8:30 AM", name: "Check out + drive Te Anau → Queenstown", badge: "2h 12", badgeType: "opt", defaultDone: false },
      { id: "d7a3", time: "10:30 AM", name: "Arrive Queenstown — final 3 hrs", badge: "Free time", badgeType: "opt", defaultDone: false },
      { id: "d7a4", time: "12:30 PM", name: "Light lunch in Queenstown", badge: "Last NZ meal!", badgeType: "opt", defaultDone: false },
      { id: "d7a5", time: "1:00 PM", name: "Refuel car — Z Energy / BP Frankton Rd", badge: "Mandatory", badgeType: "warn", defaultDone: false },
      { id: "d7a6", time: "1:15 PM", name: "Return rental car at airport", badge: "Follow signs", badgeType: "warn", defaultDone: false },
      { id: "d7a7", time: "1:30 PM", name: "Airport check-in — Virgin Australia", badge: "2 hrs ahead", badgeType: "warn", defaultDone: false },
      { id: "d7a8", time: "2:00 PM", name: "NZ Biosecurity + customs — declare all!", badge: "Strict!", badgeType: "warn", defaultDone: false },
      { id: "d7a9", time: "4:35 PM", name: "Depart Queenstown — VA 118 ✈️", badge: "Fly home", badgeType: "done", defaultDone: false },
      { id: "d7a10", time: "6:30 PM", name: "Arrive Brisbane (BNE) 🏠", badge: "Welcome home", badgeType: "done", defaultDone: false },
    ],
  },
];

const DEFAULT_TODO_GROUPS = [
  { id: "today", label: "Do Today", emoji: "🔴", sublabel: "Urgent",
    items: [
      { id: "t1", cat: "Critical", name: "Apply NZeTA online — all 4 people", badge: "Urgent", badgeType: "warn", defaultDone: false },
      { id: "t2", cat: "Critical", name: "Book Te Anau Glowworm Caves — realnz.com", badge: "ASAP", badgeType: "warn", defaultDone: false },
      { id: "t3", cat: "Critical", name: "Book Milford Sound cruise — RealNZ", badge: "ASAP", badgeType: "warn", defaultDone: false },
      { id: "t4", cat: "Booked", name: "Glacier hike — Mt Cook #349831078", badge: "", badgeType: "done", defaultDone: true },
    ],
  },
  { id: "thisweek", label: "This Week", emoji: "🟡", sublabel: "Prep",
    items: [
      { id: "t5", cat: "Insurance", name: "Verify HSBC covers glacier hiking + helicopter", badge: "", badgeType: "done", defaultDone: true },
      { id: "t6", cat: "Insurance", name: "Buy rental car excess cover", badge: "", badgeType: "done", defaultDone: true },
      { id: "t7", cat: "Phone", name: "Download offline maps — Google Maps + Maps.me", badge: "All 4", badgeType: "opt", defaultDone: false },
      { id: "t8", cat: "Phone", name: "Enable NZ roaming OR buy Spark NZ SIM at ZQN", badge: "Essential", badgeType: "warn", defaultDone: false },
      { id: "t9", cat: "Money", name: "Exchange AUD → NZD (cards mostly fine)", badge: "$100–200 ea", badgeType: "opt", defaultDone: false },
      { id: "t10", cat: "Car", name: "Request snow chains at car rental pickup", badge: "Essential", badgeType: "warn", defaultDone: false },
      { id: "t11", cat: "Car", name: "Watch: 'How to fit snow chains' on YouTube", badge: "10 min", badgeType: "opt", defaultDone: false },
    ],
  },
  { id: "beforeyougo", label: "Before You Go", emoji: "🟢", subNote: "3–5 days before",
    items: [
      { id: "t12", cat: "Gear", name: "Pack winter layers — multiple thermals", badge: "Essential", badgeType: "warn", defaultDone: false },
      { id: "t13", cat: "Gear", name: "Waterproof jacket + pants", badge: "Essential", badgeType: "warn", defaultDone: false },
      { id: "t14", cat: "Gear", name: "Clean hiking boots — NZ biosecurity strict", badge: "Required", badgeType: "warn", defaultDone: false },
      { id: "t15", cat: "Tech", name: "Charge all devices + power banks", badge: "All 4", badgeType: "opt", defaultDone: false },
      { id: "t16", cat: "Docs", name: "Print/download glacier hike + Milford confirmations", badge: "In bag", badgeType: "opt", defaultDone: false },
      { id: "t17", cat: "Flight", name: "Online check-in VA 119 (opens 48h before)", badge: "Opens 48h", badgeType: "opt", defaultDone: false },
    ],
  },
  { id: "duringtrip", label: "During Trip", emoji: "📍", sublabel: "Daily reminders",
    items: [
      { id: "t18", cat: "Daily", name: "Check MetService NZ + road conditions each morning", badge: "metservice.com", badgeType: "purple", defaultDone: false },
      { id: "t19", cat: "Day 6", name: "Check milfordroad.co.nz at 6:00 AM sharp", badge: "Critical", badgeType: "warn", defaultDone: false },
      { id: "t20", cat: "Safety", name: "Share live location with family back home", badge: "All 4", badgeType: "opt", defaultDone: false },
      { id: "t21", cat: "Money", name: "Log expenses in Budget tab daily", badge: "Daily", badgeType: "opt", defaultDone: false },
      { id: "t22", cat: "Car", name: "Refuel BEFORE Te Anau (fuel 10–15% more expensive)", badge: "Save $", badgeType: "warn", defaultDone: false },
    ],
  },
];

const EXPENSE_CATS = ["Activity", "Food", "Transport", "Accommodation", "Other"];
const CAT_STYLE = {
  Activity:      { bg: "#F0EFFF", color: "#3D3A8C", dot: "#3D3A8C", bar: "#3D3A8C", emoji: "⛰" },
  Food:          { bg: "#FFF0EB", color: "#8C3410", dot: "#C45A2A", bar: "#C45A2A", emoji: "🍔" },
  Transport:     { bg: "#EDFAF3", color: "#0D4A2A", dot: "#1A7A4A", bar: "#1A7A4A", emoji: "⛽" },
  Accommodation: { bg: "#F5F5F5", color: "#333333", dot: "#555555", bar: "#555555", emoji: "🏠" },
  Other:         { bg: "#FFF8EB", color: "#6B4000", dot: "#B87A00", bar: "#B87A00", emoji: "📦" },
};
function getLS(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
}
function setLS(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }
function buildDefaultChecked() {
  const map = {};
  TRIP_DAYS.forEach(d => d.activities.forEach(a => { map[a.id] = a.defaultDone; }));
  DEFAULT_TODO_GROUPS.forEach(g => g.items.forEach(i => { map[i.id] = i.defaultDone; }));
  return map;
}

const S = {
  bg: "#F0F0F0",
  card: "#FFFFFF",
  dark: "#1A1A1A",
  text: "#1A1A1A",
  muted: "rgba(26,26,26,0.4)",
  faint: "rgba(26,26,26,0.07)",
  lightBg: "#F7F7F7",
};

const inputStyle = {
  width: "100%", background: "rgba(26,26,26,0.05)", border: "none", borderRadius: 12,
  padding: "11px 14px", fontSize: 15, fontWeight: 500, color: "#1A1A1A",
  marginBottom: 10, outline: "none", fontFamily: "inherit",
};

function Notch({ left, top, size = 22 }) {
  return (
    <div style={{
      position: "absolute", width: size, height: size,
      background: S.bg, borderRadius: "50%", zIndex: 10,
      [left ? "left" : "right"]: -(size / 2), top,
    }} />
  );
}

function Badge({ type, children }) {
  const styles = {
    done:   { border: "1.5px solid #1A7A4A", color: "#0D4A2A", bg: "transparent" },
    warn:   { border: "1.5px solid #B87A00", color: "#6B4000", bg: "transparent" },
    opt:    { border: "1px solid rgba(26,26,26,0.2)", color: "rgba(26,26,26,0.4)", bg: "transparent" },
    purple: { border: "1.5px solid #3D3A8C", color: "#3D3A8C", bg: "transparent" },
  };
  const st = styles[type] || styles.opt;
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 20, flexShrink: 0,
      border: st.border, color: st.color, background: st.bg, whiteSpace: "nowrap",
    }}>{children}</span>
  );
}

function Checkbox({ checked, onToggle }) {
  return (
    <div onClick={onToggle} style={{
      width: 22, height: 22, borderRadius: "50%", flexShrink: 0, cursor: "pointer",
      border: checked ? "2px solid #1A1A1A" : "1.5px solid rgba(26,26,26,0.2)",
      background: checked ? "#1A1A1A" : "transparent",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      {checked && (
        <svg width="10" height="7" viewBox="0 0 10 7" fill="none">
          <path d="M1 3.5L4 6.5L9 1" stroke="#F0F0F0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </div>
  );
}

function Overline({ children }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: S.text, opacity: 0.35, padding: "8px 2px 12px" }}>
      {children}
    </div>
  );
}

function ActivityRow({ time, name, badge, badgeType, checked, onToggle }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 0" }}>
      <Checkbox checked={checked} onToggle={onToggle} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: S.text, opacity: 0.32, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 3 }}>{time}</div>
        <div style={{
          fontSize: 15, fontWeight: 500, color: S.text,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          textDecoration: checked ? "line-through" : "none", opacity: checked ? 0.22 : 1,
        }}>{name}</div>
      </div>
      {badge ? <Badge type={badgeType}>{badge}</Badge> : null}
    </div>
  );
}

// ─── TRIP PAGE ────────────────────────────────────────────────────────────────
function TripPage({ checked, onToggle }) {
  const [expanded, setExpanded] = useState({ day1: true });
  const totalActs = TRIP_DAYS.reduce((n, d) => n + d.activities.length, 0);
  const doneActs = TRIP_DAYS.reduce((n, d) => n + d.activities.filter(a => checked[a.id]).length, 0);
  const pct = Math.round((doneActs / totalActs) * 100);
  const segsOn = Math.round((pct / 100) * 7);

  return (
    <div style={{ padding: "14px 18px 56px" }}>
      <div style={{ position: "relative", marginBottom: 12 }}>
        <div style={{ background: S.card, borderRadius: 20, overflow: "hidden" }}>
          <div style={{ padding: "20px 22px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: S.text, opacity: 0.3, marginBottom: 18 }}>Jun 17–23 · 2026</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 40, fontWeight: 800, color: S.text, letterSpacing: -2, lineHeight: 1, marginBottom: 4 }}>BNE</div>
                <div style={{ fontSize: 13, color: S.text, opacity: 0.4 }}>Brisbane, AU</div>
              </div>
              <svg width="20" height="12" viewBox="0 0 24 14" fill="none">
                <path d="M2 7h20M15 1l7 6-7 6" stroke={S.dark} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.2"/>
              </svg>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 40, fontWeight: 800, color: S.text, letterSpacing: -2, lineHeight: 1, marginBottom: 4 }}>ZQN</div>
                <div style={{ fontSize: 13, color: S.text, opacity: 0.4 }}>Queenstown, NZ</div>
              </div>
            </div>
          </div>
          <div style={{ padding: "18px 22px 20px", background: S.lightBg, borderTop: "1.5px dashed rgba(26,26,26,0.12)" }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: S.text, opacity: 0.3, marginBottom: 4 }}>Trip Progress</div>
            <div style={{ fontSize: 13, color: S.text, opacity: 0.4, marginBottom: 14 }}>{doneActs} of {totalActs} activities completed</div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ fontSize: 40, fontWeight: 700, color: S.text, letterSpacing: -2, lineHeight: 1, flexShrink: 0 }}>{pct}%</div>
              <div style={{ display: "flex", gap: 3, flex: 1 }}>
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} style={{ flex: 1, height: 20, borderRadius: 4, background: i < segsOn ? S.dark : "rgba(26,26,26,0.1)" }} />
                ))}
              </div>
            </div>
          </div>
        </div>
        <Notch left top={120} /><Notch top={120} />
      </div>

      <Overline>Your Days</Overline>

      {TRIP_DAYS.map((day) => {
        const isOpen = expanded[day.id];
        const dayDone = day.activities.filter(a => checked[a.id]).length;
        return (
          <div key={day.id} style={{ position: "relative", marginBottom: 12 }}>
            <div style={{ borderRadius: 20, overflow: "hidden", background: S.dark }}
              onClick={() => setExpanded(e => ({ ...e, [day.id]: !e[day.id] }))}>
              <div style={{ padding: "18px 22px 20px", cursor: "pointer" }}>
                <div style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#F0F0F0", opacity: 0.35 }}>{day.dayNum} · {day.date}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#F0F0F0", opacity: 0.35 }}>{dayDone}/{day.activities.length} done</div>
                  </div>
                  <div style={{ fontSize: 26, fontWeight: 700, color: "#F0F0F0", letterSpacing: -1, lineHeight: 1, marginBottom: 5 }}>{day.name}</div>
                  <div style={{ fontSize: 13, color: "#F0F0F0", opacity: 0.4 }}>{day.meta}</div>
                  {day.accom && (
                    <a href={day.accomUrl} target="_blank" rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 8, fontSize: 11, fontWeight: 500, color: "#F0F0F0", opacity: 0.45, textDecoration: "none", background: "rgba(240,240,240,0.1)", borderRadius: 20, padding: "3px 10px" }}>
                      📍 {day.accom}
                    </a>
                  )}
                </div>
                <div style={{ display: "flex", gap: 3 }}>
                  {Array.from({ length: day.dotsTotal }).map((_, i) => (
                    <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i < day.dotsDone ? "rgba(240,240,240,0.6)" : "rgba(240,240,240,0.15)" }} />
                  ))}
                </div>
              </div>
              <div style={{ background: S.card, cursor: "pointer", borderTop: "1.5px dashed rgba(240,240,240,0.15)" }}>
                {!isOpen && day.warn && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "12px 22px 4px", padding: "9px 12px", background: "#FFF8EB", borderRadius: 10 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#B87A00", flexShrink: 0 }} />
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#6B4000" }}>{day.warn}</div>
                  </div>
                )}
                {!isOpen && day.preview && (
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", padding: "10px 22px 16px" }}>
                    {day.preview.map(p => (
                      <span key={p} style={{ fontSize: 11, fontWeight: 600, background: S.faint, color: S.text, opacity: 0.6, borderRadius: 20, padding: "5px 12px" }}>{p}</span>
                    ))}
                  </div>
                )}
                {!isOpen && (
                  <div style={{ padding: "6px 22px 14px" }}>
                    <div style={{ fontSize: 12, color: S.text, opacity: 0.28, fontStyle: "italic" }}>Tap to expand {day.activities.length} activities</div>
                  </div>
                )}
                {isOpen && (
                  <div style={{ padding: "0 22px" }} onClick={e => e.stopPropagation()}>
                    {day.warn && (
                      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "12px 0 6px", padding: "9px 12px", background: "#FFF8EB", borderRadius: 10 }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#B87A00", flexShrink: 0 }} />
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#6B4000" }}>{day.warn}</div>
                      </div>
                    )}
                    {day.activities.map((act, idx) => (
                      <div key={act.id} style={{ borderBottom: idx < day.activities.length - 1 ? "1px solid rgba(26,26,26,0.07)" : "none" }}>
                        <ActivityRow {...act} checked={!!checked[act.id]} onToggle={() => onToggle(act.id)} />
                      </div>
                    ))}
                    <div style={{ height: 10 }} />
                  </div>
                )}
              </div>
            </div>
            <Notch left top={100} /><Notch top={100} />
          </div>
        );
      })}
    </div>
  );
}

// ─── TODO PAGE ────────────────────────────────────────────────────────────────
function TodoPage({ checked, onToggle }) {
  const [todoGroups, setTodoGroups] = useState(() => getLS("nz_todo_groups", DEFAULT_TODO_GROUPS));
  const [addingTo, setAddingTo] = useState(null);
  const [newItem, setNewItem] = useState("");
  useEffect(() => { setLS("nz_todo_groups", todoGroups); }, [todoGroups]);
  const handleAdd = (groupId) => {
    if (!newItem.trim()) return;
    const id = "custom_" + Date.now();
    setTodoGroups(prev => prev.map(g =>
      g.id === groupId ? { ...g, items: [...g.items, { id, cat: "Custom", name: newItem.trim(), badge: "Added", badgeType: "opt", defaultDone: false }] } : g
    ));
    setNewItem(""); setAddingTo(null);
  };

  return (
    <div style={{ padding: "14px 18px 56px" }}>
      {todoGroups.map((group) => {
        const total = group.items.length;
        const done = group.items.filter(i => checked[i.id]).length;
        return (
          <div key={group.id} style={{ marginBottom: 20 }}>
            <Overline>{group.label}</Overline>
            <div style={{ position: "relative" }}>
              <div style={{ borderRadius: 20, overflow: "hidden", background: S.dark }}>
                <div style={{ padding: "16px 22px 18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#F0F0F0", opacity: 0.35, marginBottom: 6 }}>
                        {group.emoji} {group.subNote || group.sublabel}
                      </div>
                      <div style={{ fontSize: 22, fontWeight: 700, color: "#F0F0F0", letterSpacing: -0.8 }}>{group.label}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 26, fontWeight: 700, color: "#F0F0F0", letterSpacing: -1 }}>{done}/{total}</div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#F0F0F0", opacity: 0.3, letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 3 }}>done</div>
                    </div>
                  </div>
                </div>
                <div style={{ background: S.card, padding: "0 22px", borderTop: "1.5px dashed rgba(240,240,240,0.15)" }}>
                  {group.items.map((item, idx) => (
                    <div key={item.id} style={{ borderBottom: idx < group.items.length - 1 ? "1px solid rgba(26,26,26,0.07)" : "none" }}>
                      <ActivityRow id={item.id} time={item.cat} name={item.name} badge="" badgeType={item.badgeType} checked={!!checked[item.id]} onToggle={() => onToggle(item.id)} />
                    </div>
                  ))}
                  {addingTo === group.id ? (
                    <div style={{ display: "flex", gap: 8, padding: "12px 0 14px", alignItems: "center" }}>
                      <input autoFocus placeholder="Add item..." value={newItem}
                        onChange={e => setNewItem(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter") handleAdd(group.id); if (e.key === "Escape") setAddingTo(null); }}
                        style={{ ...inputStyle, marginBottom: 0, flex: 1 }} />
                      <div onClick={() => handleAdd(group.id)} style={{ background: S.dark, color: "#F0F0F0", borderRadius: 12, padding: "10px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer", flexShrink: 0 }}>Add</div>
                      <div onClick={() => setAddingTo(null)} style={{ background: S.faint, color: S.text, borderRadius: 12, padding: "10px 12px", fontSize: 13, fontWeight: 700, cursor: "pointer", flexShrink: 0, opacity: 0.5 }}>✕</div>
                    </div>
                  ) : (
                    <div onClick={() => { setAddingTo(group.id); setNewItem(""); }}
                      style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 0 13px", cursor: "pointer" }}>
                      <div style={{ width: 22, height: 22, borderRadius: "50%", border: "1.5px dashed rgba(26,26,26,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 1v8M1 5h8" stroke="rgba(26,26,26,0.35)" strokeWidth="1.5" strokeLinecap="round"/></svg>
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 500, color: S.text, opacity: 0.35 }}>Add item</div>
                    </div>
                  )}
                </div>
              </div>
              <Notch left top={76} /><Notch top={76} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── BUDGET PAGE ──────────────────────────────────────────────────────────────
function SplitCalculator({ expenses }) {
  const [open, setOpen] = useState(false);
  const paid = {};
  PEOPLE.forEach(p => { paid[p] = 0; });
  expenses.forEach(e => { paid[e.paidBy] = (paid[e.paidBy] || 0) + Number(e.amount); });
  const total = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const share = total / 4;
  const balances = {};
  PEOPLE.forEach(p => { balances[p] = (paid[p] || 0) - share; });

  return (
    <div style={{ marginBottom: 10 }}>
      <div onClick={() => setOpen(o => !o)} style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: S.faint, borderRadius: 14, padding: "0 18px",
        height: 52, cursor: "pointer", marginBottom: open ? 8 : 0,
      }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: S.text, opacity: 0.65 }}>💰 Split Calculator</div>
        <div style={{ fontSize: 11, color: S.text, opacity: 0.3 }}>{open ? "▲" : "▼"}</div>
      </div>
      {open && (
        <div style={{ background: S.card, borderRadius: 16, padding: "16px 20px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: S.text, opacity: 0.35, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>Each person's share: NZD {Math.round(share).toLocaleString()}</div>
          {PEOPLE.map(p => {
            const bal = balances[p];
            const isOwed = bal > 0.5;
            const isOwes = bal < -0.5;
            return (
              <div key={p} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: S.text, flex: 1 }}>{p}</div>
                <div style={{ fontSize: 13, color: S.text, opacity: 0.35 }}>paid ${(paid[p] || 0).toLocaleString()}</div>
                <div style={{
                  fontSize: 13, fontWeight: 700, padding: "4px 12px", borderRadius: 20,
                  background: isOwed ? "#EDFAF3" : isOwes ? "#FFF8EB" : S.faint,
                  color: isOwed ? "#0D4A2A" : isOwes ? "#6B4000" : S.text,
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

function BudgetPage({ expenses, onAdd, onDelete, budget, onSetBudget }) {
  const [showForm, setShowForm] = useState(false);
  const [showBudgetEdit, setShowBudgetEdit] = useState(false);
  const [budgetInput, setBudgetInput] = useState(String(budget));
  const [splitMode, setSplitMode] = useState("equal");
  const [customSplits, setCustomSplits] = useState(() => Object.fromEntries(PEOPLE.map(p => [p, ""])));
  const [form, setForm] = useState({ name: "", cat: "Activity", amount: "", paidBy: "Weasley", note: "" });

  const total = expenses.reduce((s, e) => s + Number(e.amount), 0);
    const remaining = budget - total;
  const spentPct = Math.min(100, Math.round((total / budget) * 100));
  const catTotals = {};
  EXPENSE_CATS.forEach(c => { catTotals[c] = 0; });
  expenses.forEach(e => { catTotals[e.cat] = (catTotals[e.cat] || 0) + Number(e.amount); });
  const maxCat = Math.max(...Object.values(catTotals), 1);
  const amountNum = Number(form.amount) || 0;
  const customTotal = Object.values(customSplits).reduce((s, v) => s + (Number(v) || 0), 0);
  const customRemaining = amountNum - customTotal;

  const handleAdd = () => {
    if (!form.name || !form.amount) return;
    const today = new Date();
    const dateStr = today.toLocaleDateString("en-NZ", { weekday: "short", day: "numeric", month: "short" });
    const splitNote = splitMode === "equal"
      ? `$${(amountNum / 4).toFixed(2)} pp · split equally`
      : PEOPLE.map(p => `${p}: $${customSplits[p] || 0}`).join(", ");
    onAdd({ ...form, amount: amountNum, date: dateStr, id: "e" + Date.now(), splitMode, customSplits: { ...customSplits }, note: form.note || splitNote });
    setForm({ name: "", cat: "Activity", amount: "", paidBy: "Weasley", note: "" });
    setSplitMode("equal");
    setCustomSplits(Object.fromEntries(PEOPLE.map(p => [p, ""])));
    setShowForm(false);
  };

  const handleSplitMode = (mode) => {
    setSplitMode(mode);
    if (mode === "custom" && amountNum > 0) {
      const pp = (amountNum / 4).toFixed(2);
      setCustomSplits(Object.fromEntries(PEOPLE.map(p => [p, pp])));
    }
  };

  return (
    <div style={{ padding: "14px 18px 56px" }}>
      {/* Budget card */}
      {showBudgetEdit ? (
        <div style={{ background: S.card, borderRadius: 20, padding: "20px 22px", marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: S.text, opacity: 0.4, marginBottom: 10 }}>Set Total Budget (NZD)</div>
          <div style={{ display: "flex", gap: 10 }}>
            <input type="number" value={budgetInput} onChange={e => setBudgetInput(e.target.value)}
              style={{ ...inputStyle, marginBottom: 0, flex: 1, fontSize: 26, fontWeight: 800, letterSpacing: -1 }} autoFocus />
            <div onClick={() => { const v = Number(budgetInput); if (v > 0) onSetBudget(v); setShowBudgetEdit(false); }}
              style={{ background: S.dark, color: "#F0F0F0", borderRadius: 14, padding: "0 22px", fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center" }}>Save</div>
          </div>
        </div>
      ) : (
        <div style={{ background: S.dark, borderRadius: 20, padding: "20px 22px", marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#F0F0F0", opacity: 0.35, marginBottom: 10 }}>Total Budget</div>
              <div style={{ fontSize: 36, fontWeight: 800, color: "#F0F0F0", letterSpacing: -1.5, lineHeight: 1, marginBottom: 10 }}>NZD {budget.toLocaleString()}</div>
              <div style={{ fontSize: 12, fontWeight: 500, color: "#F0F0F0", opacity: 0.4, marginBottom: 2 }}>Remaining</div>
              <div style={{ fontSize: 20, fontWeight: 500, color: "#F0F0F0", opacity: 0.65, letterSpacing: -0.5 }}>
                {remaining < 0 ? "-" : ""}${Math.abs(remaining).toLocaleString()}
              </div>
            </div>
            <div onClick={(e) => { e.stopPropagation(); setShowBudgetEdit(true); setBudgetInput(String(budget)); }}
              style={{ background: "rgba(240,240,240,0.12)", borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 600, color: "#F0F0F0", opacity: 0.7, cursor: "pointer", flexShrink: 0, marginTop: 2 }}>
              Edit ✎
            </div>
          </div>
          <div style={{ height: 5, background: "rgba(240,240,240,0.12)", borderRadius: 3 }}>
            <div style={{ width: spentPct + "%", height: "100%", background: "rgba(240,240,240,0.55)", borderRadius: 3 }} />
          </div>
        </div>
      )}

      {/* Summary */}
      <div style={{ position: "relative", marginBottom: 12 }}>
        <div style={{ background: S.card, borderRadius: 20, overflow: "hidden" }}>
          <div style={{ padding: "20px 22px" }}>
            
            <div style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 13, color: S.text, opacity: 0.4, marginBottom: 5 }}>Total spent</div>
                <div style={{ fontSize: 38, fontWeight: 800, color: S.text, letterSpacing: -2, lineHeight: 1 }}>
                  <span style={{ fontSize: 18, fontWeight: 500, opacity: 0.4 }}>NZD </span>{total.toLocaleString()}
                </div>
            </div>
            {EXPENSE_CATS.filter(c => catTotals[c] > 0).map(c => {
              const st = CAT_STYLE[c];
              const pct = Math.round((catTotals[c] / maxCat) * 100);
              return (
                <div key={c} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <span style={{ fontSize: 15 }}>{st.emoji}</span>
                  <div style={{ fontSize: 14, fontWeight: 500, color: S.text, flex: 1 }}>{c}</div>
                  <div style={{ flex: 2, height: 5, background: S.faint, borderRadius: 3 }}>
                    <div style={{ width: pct + "%", height: "100%", background: st.bar, borderRadius: 3 }} />
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: S.text, width: 58, textAlign: "right" }}>${catTotals[c]}</div>
                </div>
              );
            })}
            {EXPENSE_CATS.filter(c => catTotals[c] > 0).length === 0 && (
              <div style={{ fontSize: 13, color: S.text, opacity: 0.35, fontStyle: "italic", paddingBottom: 6 }}>No expenses yet</div>
            )}
          </div>
        </div>
        <Notch left top={90} /><Notch top={90} />
      </div>

      {/* Add expense — same height as split calculator */}
      {!showForm ? (
        <div onClick={() => setShowForm(true)} style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          background: S.faint, color: S.text, borderRadius: 14,
          height: 52, fontSize: 14, fontWeight: 600, marginBottom: 10, cursor: "pointer",
        }}>
          <div style={{ width: 24, height: 24, borderRadius: "50%", background: S.dark, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 1v8M1 5h8" stroke="#F0F0F0" strokeWidth="1.8" strokeLinecap="round"/></svg>
        </div>
          Add Expense
        </div>
      ) : (
        <div style={{ background: S.card, borderRadius: 20, padding: "18px 20px", marginBottom: 10 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: S.text, marginBottom: 16 }}>New Expense</div>
          <input placeholder="Description" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <input placeholder="Amount (NZD)" type="number" value={form.amount}
              onChange={e => {
                setForm(f => ({ ...f, amount: e.target.value }));
                if (splitMode === "custom" && Number(e.target.value) > 0) {
                  const pp = (Number(e.target.value) / 4).toFixed(2);
                  setCustomSplits(Object.fromEntries(PEOPLE.map(p => [p, pp])));
                }
              }} style={inputStyle} />
            <select value={form.cat} onChange={e => setForm(f => ({ ...f, cat: e.target.value }))} style={inputStyle}>
              {EXPENSE_CATS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: S.text, opacity: 0.4, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Paid by</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {PEOPLE.map(p => (
                <div key={p} onClick={() => setForm(f => ({ ...f, paidBy: p }))} style={{
                  fontSize: 13, fontWeight: 600, padding: "8px 16px", borderRadius: 20, cursor: "pointer",
                  background: form.paidBy === p ? S.dark : S.faint,
                  color: form.paidBy === p ? "#F0F0F0" : S.text,
                  opacity: form.paidBy === p ? 1 : 0.55,
                }}>{p}</div>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: S.text, opacity: 0.4, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Split</div>
            <div style={{ display: "flex", background: S.faint, borderRadius: 14, padding: 4, gap: 2, marginBottom: splitMode === "custom" ? 12 : 0 }}>
              {["equal", "custom"].map(mode => (
                <div key={mode} onClick={() => handleSplitMode(mode)} style={{
                  flex: 1, textAlign: "center", padding: "9px 0", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 600,
                  background: splitMode === mode ? S.dark : "transparent",
                  color: splitMode === mode ? "#F0F0F0" : S.text,
                  opacity: splitMode === mode ? 1 : 0.45,
                }}>{mode === "equal" ? "Split equally" : "Custom amounts"}</div>
              ))}
            </div>
            {splitMode === "equal" && amountNum > 0 && (
              <div style={{ fontSize: 13, color: S.text, opacity: 0.4, marginTop: 8 }}>
                ${(amountNum / 4).toFixed(2)} each — {PEOPLE.join(", ")}
              </div>
            )}
            {splitMode === "custom" && (
              <div style={{ background: S.faint, borderRadius: 14, padding: "12px 14px" }}>
                {PEOPLE.map(p => (
                  <div key={p} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: S.text, flex: 1 }}>{p}</div>
                    <span style={{ fontSize: 14, color: S.text, opacity: 0.4 }}>$</span>
                    <input type="number" value={customSplits[p]} onChange={e => setCustomSplits(s => ({ ...s, [p]: e.target.value }))}
                      style={{ ...inputStyle, marginBottom: 0, width: 90, textAlign: "right", padding: "8px 12px" }} />
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, borderTop: "1px solid rgba(26,26,26,0.08)" }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: S.text, opacity: 0.4 }}>Remaining to assign</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: Math.abs(customRemaining) < 0.5 ? "#0D4A2A" : "#6B4000" }}>
                    {Math.abs(customRemaining) < 0.5 ? "✓ Balanced" : `$${customRemaining.toFixed(2)} left`}
                  </div>
                </div>
              </div>
            )}
          </div>
          <input placeholder="Note (optional)" value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} style={{ ...inputStyle, marginBottom: 14 }} />
          <div style={{ display: "flex", gap: 10 }}>
            <div onClick={handleAdd} style={{ flex: 1, background: S.dark, color: "#F0F0F0", borderRadius: 12, height: 48, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Save</div>
            <div onClick={() => setShowForm(false)} style={{ flex: 1, background: S.faint, color: S.text, borderRadius: 12, height: 48, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, cursor: "pointer", opacity: 0.6 }}>Cancel</div>
          </div>
        </div>
      )}

      <SplitCalculator expenses={expenses} />

      {expenses.length > 0 && <Overline>Expense Log</Overline>}

      {expenses.map((exp) => {
        const st = CAT_STYLE[exp.cat] || CAT_STYLE.Other;
        return (
          <div key={exp.id} style={{ position: "relative", marginBottom: 10 }}>
            <div style={{ background: S.card, borderRadius: 16, overflow: "hidden" }}>
              <div style={{ padding: "14px 18px 16px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1, minWidth: 0, marginRight: 14 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 10px", borderRadius: 20, marginBottom: 8, background: st.bg, color: st.color }}>
                    {st.emoji} {exp.cat}
                  </span>
                  <div style={{ fontSize: 16, fontWeight: 600, color: S.text, letterSpacing: -0.3, marginBottom: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{exp.name}</div>
                  <div style={{ fontSize: 12, color: S.text, opacity: 0.4 }}>{exp.date} · Paid by {exp.paidBy}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 12, opacity: 0.35, color: S.text, marginBottom: 2 }}>NZD</div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: S.text, letterSpacing: -1, lineHeight: 1 }}>{Number(exp.amount).toLocaleString()}</div>
                </div>
              </div>
              <div style={{ borderTop: "1.5px dashed rgba(26,26,26,0.1)" }} />
              <div style={{ padding: "10px 18px 12px", background: S.lightBg, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 12, color: S.text, opacity: 0.4 }}>{exp.note}</div>
                <div onClick={() => onDelete(exp.id)} style={{ fontSize: 11, fontWeight: 700, padding: "5px 12px", borderRadius: 20, background: "#FFF8EB", color: "#6B4000", cursor: "pointer" }}>✕ Remove</div>
              </div>
            </div>
            <Notch left top={62} size={18} /><Notch top={62} size={18} />
          </div>
        );
      })}
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [tabIndex, setTabIndex] = useState(0);
  const [checked, setChecked] = useState(() => ({ ...buildDefaultChecked(), ...getLS("nz_checked", {}) }));
  const [expenses, setExpenses] = useState(() => getLS("nz_expenses", []));
  const [budget, setBudget] = useState(() => getLS("nz_budget", 4000));

  useEffect(() => { setLS("nz_checked", checked); }, [checked]);
  useEffect(() => { setLS("nz_expenses", expenses); }, [expenses]);
  useEffect(() => { setLS("nz_budget", budget); }, [budget]);

  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; touchStartY.current = e.touches[0].clientY; };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 55) {
      if (dx < 0) setTabIndex(i => Math.min(i + 1, TABS.length - 1));
      if (dx > 0) setTabIndex(i => Math.max(i - 1, 0));
    }
    touchStartX.current = null;
  };

  const toggleCheck = useCallback((id) => { setChecked(c => ({ ...c, [id]: !c[id] })); }, []);
  const addExpense = useCallback((exp) => { setExpenses(prev => [exp, ...prev]); }, []);
  const deleteExpense = useCallback((id) => { setExpenses(prev => prev.filter(e => e.id !== id)); }, []);

  return (
    <div
      style={{ minHeight: "100vh", width: "100%", background: S.bg, fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", display: "flex", flexDirection: "column" }}
      onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}
    >
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: S.bg, borderBottom: "1px solid rgba(26,26,26,0.08)", display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: 480, padding: "0 18px" }}>
        <div style={{ padding: "16px 0 0" }}>
          <div style={{ fontSize: 34, fontWeight: 800, color: S.text, letterSpacing: -1.5, marginBottom: 14 }}>NZ 要幹嘛 🇳🇿</div>
          <div style={{ display: "flex", background: "rgba(26,26,26,0.07)", borderRadius: 22, padding: 4, gap: 2, marginBottom: 12 }}>
            {TABS.map((t, i) => (
              <div key={t} onClick={() => setTabIndex(i)} style={{
                flex: 1, textAlign: "center",
                fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
                padding: "9px 0", borderRadius: 18, cursor: "pointer",
                background: tabIndex === i ? S.dark : "transparent",
                color: tabIndex === i ? "#F0F0F0" : S.text,
                opacity: tabIndex === i ? 1 : 0.35,
                transition: "background 0.15s, color 0.15s",
              }}>{t}</div>
            ))}
          </div>
        </div>
        </div>
      </div>

      <div style={{ width: "100%", flex: 1, display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: 480 }}>
          {tabIndex === 0 && <TripPage checked={checked} onToggle={toggleCheck} />}
          {tabIndex === 1 && <TodoPage checked={checked} onToggle={toggleCheck} />}
          {tabIndex === 2 && <BudgetPage expenses={expenses} onAdd={addExpense} onDelete={deleteExpense} budget={budget} onSetBudget={setBudget} />}
        </div>
      </div>
    </div>
  );
}