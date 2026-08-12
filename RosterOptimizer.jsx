import React, { useState, useMemo, useEffect, createContext, useContext, useRef } from "react";
import {
  LayoutDashboard, Users, CalendarClock, ClipboardList, Settings as SettingsIcon,
  LogOut, Plus, Pencil, Trash2, X, Check, ChevronLeft, ChevronRight, AlertTriangle,
  Copy, Share2, Sparkles, Clock, DollarSign, TrendingUp, UserCheck, Search,
  RefreshCw, Lock, Unlock, Eye, ChevronDown, Coffee, UtensilsCrossed, Sun, Moon,
  Calendar, ListChecks, User, ShieldCheck, CircleCheck, CircleX, CircleAlert,
  ArrowRight, Info, Briefcase, BadgeDollarSign, Loader2, ExternalLink
} from "lucide-react";

/* =========================================================================
   FONTS + GLOBAL STYLE
   ========================================================================= */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');
    .ro-root { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
    .ro-display { font-family: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif; }
    .ro-scroll::-webkit-scrollbar { height: 6px; width: 6px; }
    .ro-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 999px; }
    .ro-scroll::-webkit-scrollbar-track { background: transparent; }
    @keyframes ro-fade-in { from { opacity:0; transform: translateY(4px);} to {opacity:1; transform:translateY(0);} }
    .ro-fade-in { animation: ro-fade-in .25s ease-out; }
    .ro-tnum { font-variant-numeric: tabular-nums; }
  `}</style>
);

/* =========================================================================
   TIME / DATE UTILITIES
   ========================================================================= */
const DAY_DEFS = [
  ["mon", "Monday", "Mon"], ["tue", "Tuesday", "Tue"], ["wed", "Wednesday", "Wed"],
  ["thu", "Thursday", "Thu"], ["fri", "Friday", "Fri"], ["sat", "Saturday", "Sat"],
  ["sun", "Sunday", "Sun"],
];
const DAY_ORDER = Object.fromEntries(DAY_DEFS.map(([k], i) => [k, i]));
const DAY_LABEL = Object.fromEntries(DAY_DEFS.map(([k, l]) => [k, l]));
const DAY_SHORT = Object.fromEntries(DAY_DEFS.map(([k, , s]) => [k, s]));

function timeToMinutes(t) { const [h, m] = t.split(":").map(Number); return h * 60 + m; }
function durationHours(start, end) { return (timeToMinutes(end) - timeToMinutes(start)) / 60; }
function fmtMoney(n) { return "$" + Math.round(n).toLocaleString("en-AU"); }
function fmtHours(n) { const r = Math.round(n * 10) / 10; return (r % 1 === 0 ? r.toFixed(0) : r.toFixed(1)) + "h"; }
function overlaps(aS, aE, bS, bE) { return timeToMinutes(aS) < timeToMinutes(bE) && timeToMinutes(bS) < timeToMinutes(aE); }

function dateForDay(weekStart, dayKey) {
  const idx = DAY_ORDER[dayKey];
  const d = new Date(weekStart + "T00:00:00");
  d.setDate(d.getDate() + idx);
  return d;
}
function isoDate(d) { return d.toISOString().slice(0, 10); }
function fmtDateShort(d) { return d.toLocaleDateString("en-AU", { day: "2-digit", month: "short" }); }
function addDaysToWeekStart(weekStart, days) {
  const d = new Date(weekStart + "T00:00:00");
  d.setDate(d.getDate() + days);
  return isoDate(d);
}
function weekLabel(weekStart) {
  const start = new Date(weekStart + "T00:00:00");
  const end = new Date(start); end.setDate(end.getDate() + 6);
  const sameMonth = start.getMonth() === end.getMonth();
  const startStr = start.getDate();
  const endStr = end.toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });
  if (sameMonth) return `${startStr}\u2013${endStr}`;
  const startStrFull = start.toLocaleDateString("en-AU", { day: "numeric", month: "short" });
  return `${startStrFull} \u2013 ${endStr}`;
}
function nowStamp() {
  return new Date().toLocaleString("en-AU", { day: "2-digit", month: "short", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true });
}
function randomShareId() { return Math.random().toString(36).slice(2, 8); }

/* =========================================================================
   SEED DATA
   ========================================================================= */
const BUSINESS = { id: "biz_1", name: "Lucy Cafe", timezone: "Australia/Adelaide" };

const SKILLS_SEED = [
  { id: "mgr", name: "Manager", active: true },
  { id: "bar", name: "Barista", active: true },
  { id: "foh", name: "FOH", active: true },
  { id: "kit", name: "Kitchen", active: true },
];

const EMPLOYEES_SEED = [
  { id: "e1", name: "John Smith", email: "john@lucycafe.com", skills: ["mgr", "foh"], hourlyRate: 36, maxWeeklyHours: 38, priority: 1, status: "ACTIVE" },
  { id: "e2", name: "Anna Nguyen", email: "anna@lucycafe.com", skills: ["bar", "foh"], hourlyRate: 32, maxWeeklyHours: 25, priority: 2, status: "ACTIVE" },
  { id: "e3", name: "Lucy Tran", email: "lucy@lucycafe.com", skills: ["foh"], hourlyRate: 28, maxWeeklyHours: 20, priority: 2, status: "ACTIVE" },
  { id: "e4", name: "Sarah Lee", email: "sarah@lucycafe.com", skills: ["bar", "foh"], hourlyRate: 30, maxWeeklyHours: 24, priority: 3, status: "ACTIVE" },
  { id: "e5", name: "Tom Wilson", email: "tom@lucycafe.com", skills: ["kit"], hourlyRate: 34, maxWeeklyHours: 30, priority: 2, status: "ACTIVE" },
  { id: "e6", name: "Mia Chen", email: "mia@lucycafe.com", skills: ["bar"], hourlyRate: 29, maxWeeklyHours: 20, priority: 3, status: "ACTIVE" },
  { id: "e7", name: "Jake Butler", email: "jake@lucycafe.com", skills: ["foh", "kit"], hourlyRate: 31, maxWeeklyHours: 28, priority: 2, status: "ACTIVE" },
  { id: "e8", name: "Olivia Ward", email: "olivia@lucycafe.com", skills: ["mgr", "foh"], hourlyRate: 37, maxWeeklyHours: 35, priority: 1, status: "ACTIVE" },
  { id: "e9", name: "Noah Baxter", email: "noah@lucycafe.com", skills: ["kit"], hourlyRate: 33, maxWeeklyHours: 25, priority: 3, status: "ACTIVE" },
  { id: "e10", name: "Grace Kelly", email: "grace@lucycafe.com", skills: ["bar", "foh"], hourlyRate: 30, maxWeeklyHours: 22, priority: 2, status: "ACTIVE" },
  { id: "e11", name: "Ethan Brooks", email: "ethan@lucycafe.com", skills: ["foh"], hourlyRate: 27, maxWeeklyHours: 18, priority: 3, status: "ACTIVE" },
  { id: "e12", name: "Ruby Simmons", email: "ruby@lucycafe.com", skills: ["kit", "foh"], hourlyRate: 32, maxWeeklyHours: 26, priority: 2, status: "ACTIVE" },
];

function buildShiftTemplates() {
  const templates = [];
  DAY_DEFS.forEach(([key, label]) => {
    templates.push({
      id: `${key}-breakfast`, day: key, dayLabel: label, name: "Breakfast",
      start: "08:00", end: "12:00", active: true,
      requirements: [{ skillId: "bar", count: 1 }, { skillId: "foh", count: 2 }],
    });
    templates.push({
      id: `${key}-dinner`, day: key, dayLabel: label, name: "Dinner",
      start: "17:00", end: "22:00", active: true,
      requirements: [{ skillId: "mgr", count: 1 }, { skillId: "foh", count: 2 }, { skillId: "kit", count: 1 }],
    });
  });
  templates.push({
    id: "sat-lunch", day: "sat", dayLabel: "Saturday", name: "Lunch",
    start: "12:00", end: "16:00", active: true,
    requirements: [{ skillId: "bar", count: 1 }, { skillId: "foh", count: 2 }, { skillId: "kit", count: 1 }],
  });
  return templates.sort((a, b) => DAY_ORDER[a.day] - DAY_ORDER[b.day] || timeToMinutes(a.start) - timeToMinutes(b.start));
}
const SHIFT_TEMPLATES_SEED = buildShiftTemplates();

// [employeeId, templateId] pairs where the employee is NOT available (base/regular availability)
const BASE_UNAVAILABLE_SEED = [
  ["e3", "mon-dinner"], ["e3", "sat-dinner"],
  ["e1", "sat-dinner"], ["e1", "sun-dinner"],
  ["e8", "wed-dinner"],
  ["e5", "sun-breakfast"], ["e5", "sun-dinner"],
  ["e9", "mon-breakfast"],
  ["e7", "sat-breakfast"], ["e7", "sat-dinner"],
  ["e12", "fri-dinner"], ["e12", "sat-dinner"],
  ["e11", "thu-breakfast"],
  ["e10", "sat-dinner"],
  ["e2", "sat-dinner"],
  ["e4", "sat-dinner"],
  ["e6", "sun-breakfast"],
];

const DEMO_WEEK = "2026-08-17"; // Monday 17 Aug 2026
const NEXT_WEEK = addDaysToWeekStart(DEMO_WEEK, 7);

const WEEKLY_EXCEPTIONS_SEED = [
  { id: "ex1", employeeId: "e2", weekStart: DEMO_WEEK, templateId: "wed-breakfast", status: "UNAVAILABLE", createdAt: "2026-08-10T09:12:00" },
];

const WEEKLY_OVERRIDES_SEED = {
  [`${NEXT_WEEK}|mon-breakfast`]: [{ skillId: "bar", count: 1 }, { skillId: "foh", count: 3 }],
};

/* =========================================================================
   APP CONTEXT
   ========================================================================= */
const AppCtx = createContext(null);
const useApp = () => useContext(AppCtx);

/* =========================================================================
   DOMAIN HELPERS (pure functions operating on context-shaped data)
   ========================================================================= */
function getShiftInstances(weekStart, shiftTemplates, weeklyOverrides) {
  return shiftTemplates
    .filter((t) => t.active)
    .map((t) => {
      const date = dateForDay(weekStart, t.day);
      const key = `${weekStart}|${t.id}`;
      const overridden = weeklyOverrides[key];
      return {
        id: `${weekStart}_${t.id}`,
        templateId: t.id,
        weekStart,
        day: t.day,
        dayLabel: t.dayLabel,
        date: isoDate(date),
        dateLabel: fmtDateShort(date),
        name: t.name,
        start: t.start,
        end: t.end,
        duration: durationHours(t.start, t.end),
        requirements: overridden || t.requirements,
        isOverridden: !!overridden,
      };
    })
    .sort((a, b) => DAY_ORDER[a.day] - DAY_ORDER[b.day] || timeToMinutes(a.start) - timeToMinutes(b.start));
}

function getEffectiveAvailability(employeeId, weekStart, templateId, baseUnavailableSet, exceptions) {
  const ex = exceptions.find((e) => e.employeeId === employeeId && e.weekStart === weekStart && e.templateId === templateId);
  if (ex) return { status: ex.status, source: "exception" };
  const key = `${employeeId}|${templateId}`;
  return { status: baseUnavailableSet.has(key) ? "UNAVAILABLE" : "AVAILABLE", source: "base" };
}

function skillName(skills, id) { const s = skills.find((s) => s.id === id); return s ? s.name : id; }

/* --- ROSTER OPTIMIZER ENGINE --- */
function generateRoster({ weekStart, employees, shiftTemplates, weeklyOverrides, baseUnavailableSet, exceptions, keepManualLocked, existingAssignments }) {
  const shifts = getShiftInstances(weekStart, shiftTemplates, weeklyOverrides);
  const activeEmployees = employees.filter((e) => e.status === "ACTIVE");

  const hoursByEmp = {};
  const shiftsByEmp = {}; // employeeId -> array of {date, start, end}
  const assignments = [];

  if (keepManualLocked) {
    existingAssignments.filter((a) => a.source === "MANUAL").forEach((a) => {
      const shift = shifts.find((s) => s.id === a.shiftId);
      if (!shift) return;
      assignments.push({ ...a });
      hoursByEmp[a.employeeId] = (hoursByEmp[a.employeeId] || 0) + shift.duration;
      shiftsByEmp[a.employeeId] = shiftsByEmp[a.employeeId] || [];
      shiftsByEmp[a.employeeId].push({ date: shift.date, start: shift.start, end: shift.end });
    });
  }

  const unfilled = [];

  for (const shift of shifts) {
    for (const req of shift.requirements) {
      const already = assignments.filter((a) => a.shiftId === shift.id && a.skillId === req.skillId).length;
      const need = req.count - already;
      if (need <= 0) continue;

      let candidates = activeEmployees.filter((emp) => {
        if (!emp.skills.includes(req.skillId)) return false;
        if (assignments.some((a) => a.shiftId === shift.id && a.employeeId === emp.id)) return false;
        const avail = getEffectiveAvailability(emp.id, weekStart, shift.templateId, baseUnavailableSet, exceptions);
        if (avail.status !== "AVAILABLE") return false;
        const projectedHours = (hoursByEmp[emp.id] || 0) + shift.duration;
        if (projectedHours > emp.maxWeeklyHours) return false;
        const existing = shiftsByEmp[emp.id] || [];
        if (existing.some((s) => s.date === shift.date && overlaps(s.start, s.end, shift.start, shift.end))) return false;
        return true;
      });

      candidates.sort((a, b) => {
        if (a.priority !== b.priority) return a.priority - b.priority;
        const aSameDay = (shiftsByEmp[a.id] || []).some((s) => s.date === shift.date) ? 1 : 0;
        const bSameDay = (shiftsByEmp[b.id] || []).some((s) => s.date === shift.date) ? 1 : 0;
        if (aSameDay !== bSameDay) return aSameDay - bSameDay;
        if (a.hourlyRate !== b.hourlyRate) return a.hourlyRate - b.hourlyRate;
        return (hoursByEmp[a.id] || 0) - (hoursByEmp[b.id] || 0);
      });

      const picked = candidates.slice(0, need);
      picked.forEach((emp) => {
        const cost = shift.duration * emp.hourlyRate;
        assignments.push({
          id: `a_${shift.id}_${req.skillId}_${emp.id}`,
          shiftId: shift.id, skillId: req.skillId, employeeId: emp.id,
          cost, source: "OPTIMIZER",
        });
        hoursByEmp[emp.id] = (hoursByEmp[emp.id] || 0) + shift.duration;
        shiftsByEmp[emp.id] = shiftsByEmp[emp.id] || [];
        shiftsByEmp[emp.id].push({ date: shift.date, start: shift.start, end: shift.end });
      });

      if (picked.length < need) {
        unfilled.push({
          shiftId: shift.id, skillId: req.skillId,
          required: req.count, assigned: already + picked.length,
          shortfall: need - picked.length,
        });
      }
    }
  }

  // Soft warnings
  const softWarnings = [];
  Object.entries(shiftsByEmp).forEach(([empId, list]) => {
    const emp = employees.find((e) => e.id === empId);
    if (!emp) return;
    const byDate = {};
    list.forEach((s) => { byDate[s.date] = (byDate[s.date] || 0) + 1; });
    Object.entries(byDate).forEach(([date, count]) => {
      if (count > 1) softWarnings.push({ type: "split_shift", employeeId: empId, message: `${emp.name} has ${count} separate shifts on ${fmtDateShort(new Date(date + "T00:00:00"))}.` });
    });
    const dates = [...new Set(list.map((s) => s.date))].sort();
    let streak = 1, maxStreak = 1;
    for (let i = 1; i < dates.length; i++) {
      const prev = new Date(dates[i - 1] + "T00:00:00"); const cur = new Date(dates[i] + "T00:00:00");
      const diff = (cur - prev) / 86400000;
      streak = diff === 1 ? streak + 1 : 1;
      maxStreak = Math.max(maxStreak, streak);
    }
    if (maxStreak >= 5) softWarnings.push({ type: "consecutive_days", employeeId: empId, message: `${emp.name} has worked ${maxStreak} consecutive days.` });
  });

  const totalRequiredSlots = shifts.reduce((sum, s) => sum + s.requirements.reduce((a, r) => a + r.count, 0), 0);
  const totalFilledSlots = assignments.length;
  const totalLabourCost = assignments.reduce((sum, a) => sum + a.cost, 0);
  const scheduledHours = Object.values(hoursByEmp).reduce((a, b) => a + b, 0);
  const employeesScheduled = Object.keys(hoursByEmp).filter((id) => (hoursByEmp[id] || 0) > 0).length;
  const coverage = totalRequiredSlots === 0 ? 100 : Math.round((totalFilledSlots / totalRequiredSlots) * 100);

  return {
    status: "GENERATED",
    assignments, unfilled, softWarnings,
    totals: {
      totalLabourCost, coverage, scheduledHours, employeesScheduled,
      totalRequiredSlots, totalFilledSlots, totalActiveEmployees: activeEmployees.length,
    },
    generatedAt: nowStamp(),
    publishedAt: null,
    shareId: null,
  };
}

function canAssignEmployee({ employee, shift, skillId, weekStart, baseUnavailableSet, exceptions, currentAssignments, excludeAssignmentId }) {
  const reasons = [];
  const avail = getEffectiveAvailability(employee.id, weekStart, shift.templateId, baseUnavailableSet, exceptions);
  if (avail.status !== "AVAILABLE") reasons.push("Employee unavailable");
  if (!employee.skills.includes(skillId)) reasons.push(`Missing required ${skillId ? "" : ""}skill`);
  const otherAssignments = currentAssignments.filter((a) => a.id !== excludeAssignmentId && a.employeeId === employee.id);
  const hoursElsewhere = otherAssignments.reduce((sum, a) => sum + (a.shiftDuration || 0), 0);
  if (hoursElsewhere + shift.duration > employee.maxWeeklyHours) reasons.push("Would exceed maximum weekly hours");
  const conflict = otherAssignments.find((a) => a.shiftDate === shift.date && a.shiftId !== shift.id && overlaps(a.shiftStart, a.shiftEnd, shift.start, shift.end));
  if (conflict) reasons.push(`Conflicts with ${conflict.shiftLabel || "another shift"}`);
  return { ok: reasons.length === 0, reasons };
}

/* =========================================================================
   SMALL UI PRIMITIVES
   ========================================================================= */
const TONE = {
  green: "bg-emerald-50 text-emerald-700 border-emerald-200",
  red: "bg-rose-50 text-rose-700 border-rose-200",
  grey: "bg-slate-100 text-slate-600 border-slate-200",
  orange: "bg-amber-50 text-amber-700 border-amber-200",
  blue: "bg-sky-50 text-sky-700 border-sky-200",
  violet: "bg-violet-50 text-violet-700 border-violet-200",
  slate: "bg-slate-800 text-white border-slate-800",
};
function Badge({ tone = "grey", children, className = "" }) {
  return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium whitespace-nowrap ${TONE[tone]} ${className}`}>{children}</span>;
}

function Card({ children, className = "", padded = true }) {
  return <div className={`bg-white border border-slate-200 rounded-xl shadow-sm ${padded ? "p-5" : ""} ${className}`}>{children}</div>;
}

function Button({ children, onClick, variant = "primary", size = "md", icon: Icon, className = "", disabled, type = "button" }) {
  const sizes = { sm: "px-2.5 py-1.5 text-xs", md: "px-3.5 py-2 text-sm", lg: "px-5 py-3 text-sm" };
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm",
    cta: "bg-amber-500 text-slate-900 hover:bg-amber-400 shadow-sm font-semibold",
    secondary: "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50",
    ghost: "text-slate-600 hover:bg-slate-100",
    danger: "bg-white text-rose-600 border border-rose-200 hover:bg-rose-50",
    dangerSolid: "bg-rose-600 text-white hover:bg-rose-700",
  };
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {Icon && <Icon size={size === "lg" ? 18 : 15} strokeWidth={2.25} />}
      {children}
    </button>
  );
}

function IconBtn({ icon: Icon, onClick, title, tone = "default" }) {
  const toneCls = tone === "danger" ? "hover:bg-rose-50 hover:text-rose-600" : "hover:bg-slate-100 hover:text-slate-900";
  return (
    <button title={title} onClick={onClick} className={`p-1.5 rounded-md text-slate-500 transition-colors ${toneCls}`}>
      <Icon size={15} strokeWidth={2.25} />
    </button>
  );
}

function Modal({ open, onClose, title, children, footer, width = "max-w-lg" }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px]" onClick={onClose} />
      <div className={`relative bg-white rounded-2xl shadow-xl w-full ${width} max-h-[88vh] flex flex-col ro-fade-in`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="ro-display font-semibold text-slate-900 text-base">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-700">
            <X size={18} />
          </button>
        </div>
        <div className="px-5 py-4 overflow-y-auto ro-scroll">{children}</div>
        {footer && <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}

function ProgressBar({ value, max, tone = "indigo" }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  const near = pct >= 90;
  const colors = near ? "bg-amber-500" : tone === "indigo" ? "bg-indigo-500" : "bg-emerald-500";
  return (
    <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
      <div className={`h-full rounded-full ${colors}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function Field({ label, children, hint }) {
  return (
    <label className="block mb-3.5">
      <span className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-xs text-slate-400 mt-1">{hint}</span>}
    </label>
  );
}
const inputCls = "w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400";

function EmptyState({ icon: Icon, title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6">
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3.5">
        <Icon size={22} className="text-slate-400" />
      </div>
      <p className="font-semibold text-slate-800 ro-display">{title}</p>
      <p className="text-sm text-slate-500 mt-1 max-w-sm">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

function useToast() {
  const [toast, setToast] = useState(null);
  const timer = useRef(null);
  const show = (msg, tone = "default") => {
    if (timer.current) clearTimeout(timer.current);
    setToast({ msg, tone });
    timer.current = setTimeout(() => setToast(null), 2600);
  };
  const node = toast ? (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[100] ro-fade-in">
      <div className={`px-4 py-2.5 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2 ${toast.tone === "error" ? "bg-rose-600 text-white" : "bg-slate-900 text-white"}`}>
        {toast.tone === "error" ? <CircleAlert size={15} /> : <CircleCheck size={15} className="text-emerald-400" />}
        {toast.msg}
      </div>
    </div>
  ) : null;
  return [show, node];
}

/* =========================================================================
   WEEK SELECTOR
   ========================================================================= */
function WeekSelector({ compact }) {
  const { weekStart, setWeekStart } = useApp();
  return (
    <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-1 py-1">
      <IconBtn icon={ChevronLeft} title="Previous week" onClick={() => setWeekStart(addDaysToWeekStart(weekStart, -7))} />
      <div className="flex items-center gap-1.5 px-1.5">
        <Calendar size={14} className="text-slate-400" />
        <span className={`ro-tnum font-medium text-slate-800 ${compact ? "text-xs" : "text-sm"}`}>Week of {weekLabel(weekStart)}</span>
      </div>
      <IconBtn icon={ChevronRight} title="Next week" onClick={() => setWeekStart(addDaysToWeekStart(weekStart, 7))} />
    </div>
  );
}

/* =========================================================================
   LOGIN PAGE
   ========================================================================= */
function LoginPage() {
  const { setCurrentUser, setTopView } = useApp();
  const loginAs = (role, employeeId) => {
    setCurrentUser({ role, employeeId: employeeId || null });
    setTopView(role === "manager" ? "manager" : "employee");
  };
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 ro-root">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center">
              <CalendarClock size={19} className="text-slate-900" />
            </div>
            <span className="ro-display text-white font-semibold text-lg tracking-tight">Roster Optimizer</span>
          </div>
          <p className="text-slate-400 text-sm">Structured availability in. A valid, low-cost roster out.</p>
        </div>
        <Card className="!bg-white">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Sign in to</p>
          <p className="ro-display font-semibold text-slate-900 mb-4">{BUSINESS.name}</p>

          <div className="space-y-3">
            <button onClick={() => loginAs("manager")} className="w-full text-left border border-slate-200 rounded-xl p-3.5 hover:border-indigo-300 hover:bg-indigo-50/40 transition-colors group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold text-sm">JS</div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Manager Demo</p>
                    <p className="text-xs text-slate-500">manager@lucycafe.com</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">Login <ArrowRight size={13} /></span>
              </div>
            </button>
            <button onClick={() => loginAs("employee", "e2")} className="w-full text-left border border-slate-200 rounded-xl p-3.5 hover:border-indigo-300 hover:bg-indigo-50/40 transition-colors group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-semibold text-sm">AN</div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Employee Demo</p>
                    <p className="text-xs text-slate-500">anna@lucycafe.com</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">Login <ArrowRight size={13} /></span>
              </div>
            </button>
          </div>
        </Card>
        <p className="text-center text-xs text-slate-500 mt-5">Prototype build \u00b7 no real authentication</p>
      </div>
    </div>
  );
}

/* =========================================================================
   MANAGER LAYOUT
   ========================================================================= */
const MANAGER_NAV = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "employees", label: "Employees", icon: Users },
  { key: "availability", label: "Availability", icon: ListChecks },
  { key: "shifts", label: "Shifts", icon: CalendarClock },
  { key: "roster", label: "Roster", icon: ClipboardList },
  { key: "settings", label: "Settings", icon: SettingsIcon },
];

function ManagerLayout({ children }) {
  const { managerPage, setManagerPage, setCurrentUser, setTopView } = useApp();
  return (
    <div className="min-h-screen bg-slate-50 ro-root flex">
      <aside className="w-60 shrink-0 bg-slate-900 text-slate-300 flex flex-col">
        <div className="px-5 py-5 flex items-center gap-2 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center shrink-0">
            <CalendarClock size={17} className="text-slate-900" />
          </div>
          <span className="ro-display text-white font-semibold text-sm tracking-tight leading-tight">Roster<br />Optimizer</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {MANAGER_NAV.map((item) => {
            const active = managerPage === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setManagerPage(item.key)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${active ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"}`}
              >
                <item.icon size={16} strokeWidth={2.25} className={active ? "text-amber-400" : ""} />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="px-3 py-4 border-t border-white/10 space-y-2.5">
          <div className="px-3">
            <p className="text-xs text-slate-500">Business</p>
            <p className="text-sm font-medium text-white">{BUSINESS.name}</p>
          </div>
          <div className="px-3 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-semibold shrink-0">JS</div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">John Smith</p>
              <p className="text-xs text-slate-500">Manager</p>
            </div>
          </div>
          <button onClick={() => { setCurrentUser(null); setTopView("login"); }} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-400 hover:bg-white/5 hover:text-white transition-colors">
            <LogOut size={15} /> Log out
          </button>
        </div>
      </aside>
      <main className="flex-1 min-w-0 overflow-y-auto">{children}</main>
    </div>
  );
}

function PageHeader({ title, subtitle, right }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
      <div>
        <h1 className="ro-display text-xl font-semibold text-slate-900">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {right && <div className="flex items-center gap-2">{right}</div>}
    </div>
  );
}

/* =========================================================================
   DASHBOARD
   ========================================================================= */
function Dashboard() {
  const { employees, weekStart, shiftTemplates, weeklyOverrides, rostersByWeek, baseUnavailableSet, exceptions, setManagerPage } = useApp();
  const shifts = useMemo(() => getShiftInstances(weekStart, shiftTemplates, weeklyOverrides), [weekStart, shiftTemplates, weeklyOverrides]);
  const roster = rostersByWeek[weekStart];
  const activeEmployees = employees.filter((e) => e.status === "ACTIVE");

  const requiredSlots = shifts.reduce((s, sh) => s + sh.requirements.reduce((a, r) => a + r.count, 0), 0);
  const cost = roster ? fmtMoney(roster.totals.totalLabourCost) : "\u2014";
  const coverage = roster ? `${roster.totals.coverage}%` : "\u2014";
  const unfilledCount = roster ? roster.unfilled.reduce((a, u) => a + u.shortfall, 0) : requiredSlots;

  // Availability submission summary (base = "submitted", using presence in base set doesn't map 1:1, so we treat all as submitted except a couple to show variety)
  const availSummary = activeEmployees.map((emp, i) => {
    const hasException = exceptions.some((ex) => ex.employeeId === emp.id && ex.weekStart === weekStart);
    const missing = i === activeEmployees.length - 1; // last employee shown as "missing" for demo realism
    return {
      emp,
      status: missing ? "MISSING" : hasException ? "EXCEPTION" : "COMPLETE",
      updated: missing ? "\u2014" : hasException ? "2 days ago" : "3 weeks ago",
    };
  });
  const completeCount = availSummary.filter((a) => a.status !== "MISSING").length;

  const warnings = [];
  if (roster) {
    roster.unfilled.forEach((u) => {
      const shift = shifts.find((s) => s.id === u.shiftId);
      if (!shift) return;
      warnings.push(`${shift.dayLabel} ${shift.name} requires ${u.required} ${skillName(SKILLS_SEED, u.skillId)} but only ${u.assigned} available/qualified employee${u.assigned === 1 ? "" : "s"} could be assigned.`);
    });
    roster.softWarnings.slice(0, 3).forEach((w) => warnings.push(w.message));
  } else {
    warnings.push("Generate this week's roster to see staffing and constraint warnings here.");
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <PageHeader title="Dashboard" subtitle={`Weekly Roster \u00b7 Week of ${weekLabel(weekStart)}`} right={<WeekSelector />} />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <StatCard icon={Users} label="Employees" value={activeEmployees.length} sub="Active employees" />
        <StatCard icon={CalendarClock} label="Weekly Shifts" value={shifts.length} sub="Scheduled shifts" />
        <StatCard icon={DollarSign} label="Labour Cost" value={cost} sub="This week" />
        <StatCard icon={TrendingUp} label="Coverage" value={coverage} sub="Requirements filled" />
        <StatCard icon={AlertTriangle} label="Unfilled Positions" value={roster ? unfilledCount : "\u2014"} sub="Need attention" warn={roster && unfilledCount > 0} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <Card className="lg:col-span-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Roster Status</p>
          <RosterStatusBadge status={roster ? roster.status : "NOT_GENERATED"} />
          <p className="text-xs text-slate-500 mt-2">
            {roster ? (roster.status === "PUBLISHED" ? `Published ${roster.publishedAt}` : `Last generated: ${roster.generatedAt}`) : "This week's roster hasn't been generated yet."}
          </p>
          <div className="flex items-center gap-2 mt-4">
            <Button variant="cta" icon={Sparkles} onClick={() => setManagerPage("roster")}>{roster ? "View Roster" : "Generate Roster"}</Button>
            {roster && <Button variant="secondary" onClick={() => setManagerPage("roster")}>View Roster</Button>}
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Availability Summary</p>
            <span className="text-xs font-medium text-slate-500 ro-tnum">{completeCount} / {activeEmployees.length} employees submitted</span>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto ro-scroll pr-1">
            {availSummary.map(({ emp, status, updated }) => (
              <div key={emp.id} className="flex items-center justify-between text-sm py-1.5 border-b border-slate-50 last:border-0">
                <span className="text-slate-700 font-medium">{emp.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">{updated}</span>
                  {status === "COMPLETE" && <Badge tone="green">Complete</Badge>}
                  {status === "MISSING" && <Badge tone="red">Missing</Badge>}
                  {status === "EXCEPTION" && <Badge tone="orange">Exception submitted</Badge>}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Scheduling Warnings</p>
        <div className="space-y-2">
          {warnings.map((w, i) => (
            <div key={i} className="flex items-start gap-2.5 text-sm text-slate-700 bg-amber-50/60 border border-amber-100 rounded-lg px-3 py-2.5">
              <AlertTriangle size={15} className="text-amber-500 mt-0.5 shrink-0" />
              <span>{w}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, warn }) {
  return (
    <Card className="!p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-slate-500">{label}</span>
        <Icon size={15} className={warn ? "text-amber-500" : "text-slate-300"} />
      </div>
      <p className={`ro-display text-2xl font-semibold ro-tnum ${warn ? "text-amber-600" : "text-slate-900"}`}>{value}</p>
      <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
    </Card>
  );
}

function RosterStatusBadge({ status }) {
  const map = {
    NOT_GENERATED: ["grey", "Not Generated"],
    DRAFT: ["grey", "Draft"],
    GENERATED: ["blue", "Generated"],
    PUBLISHED: ["green", "Published"],
  };
  const [tone, label] = map[status] || map.NOT_GENERATED;
  return <Badge tone={tone} className="!text-sm !px-2.5 !py-1">{label}</Badge>;
}

/* =========================================================================
   EMPLOYEES PAGE
   ========================================================================= */
function EmployeesPage() {
  const { employees, setEmployees, skills } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toastShow, toastNode] = useToast();
  const [query, setQuery] = useState("");

  const filtered = employees.filter((e) => e.name.toLowerCase().includes(query.toLowerCase()));

  const openAdd = () => { setEditing(null); setShowForm(true); };
  const openEdit = (emp) => { setEditing(emp); setShowForm(true); };

  const saveEmployee = (data) => {
    if (editing) {
      setEmployees((prev) => prev.map((e) => (e.id === editing.id ? { ...e, ...data } : e)));
      toastShow("Employee updated");
    } else {
      const id = "e" + (Math.max(0, ...employees.map((e) => parseInt(e.id.slice(1)) || 0)) + 1);
      setEmployees((prev) => [...prev, { id, status: "ACTIVE", ...data }]);
      toastShow("Employee added");
    }
    setShowForm(false);
  };

  const toggleStatus = (emp) => {
    setEmployees((prev) => prev.map((e) => (e.id === emp.id ? { ...e, status: e.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" } : e)));
    toastShow(emp.status === "ACTIVE" ? "Employee deactivated" : "Employee activated");
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {toastNode}
      <PageHeader
        title="Employees"
        subtitle={`${employees.filter((e) => e.status === "ACTIVE").length} active \u00b7 ${employees.length} total`}
        right={<Button icon={Plus} onClick={openAdd}>Add Employee</Button>}
      />

      <div className="mb-4 relative max-w-xs">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search employees" className={`${inputCls} pl-8`} />
      </div>

      <Card padded={false} className="overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
              <th className="text-left font-semibold px-4 py-3">Employee</th>
              <th className="text-left font-semibold px-4 py-3">Skills</th>
              <th className="text-left font-semibold px-4 py-3">Hourly Rate</th>
              <th className="text-left font-semibold px-4 py-3">Max Hours</th>
              <th className="text-left font-semibold px-4 py-3">Priority</th>
              <th className="text-left font-semibold px-4 py-3">Status</th>
              <th className="text-right font-semibold px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((emp) => (
              <tr key={emp.id} className="border-t border-slate-100 hover:bg-slate-50/60">
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-800">{emp.name}</p>
                  <p className="text-xs text-slate-400">{emp.email}</p>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {emp.skills.map((sid) => <Badge key={sid} tone="grey">{skillName(skills, sid)}</Badge>)}
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-700 ro-tnum">${emp.hourlyRate}/hour</td>
                <td className="px-4 py-3 text-slate-700 ro-tnum">{emp.maxWeeklyHours} hours</td>
                <td className="px-4 py-3 text-slate-700">Priority {emp.priority}</td>
                <td className="px-4 py-3">{emp.status === "ACTIVE" ? <Badge tone="green">Active</Badge> : <Badge tone="grey">Inactive</Badge>}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <IconBtn icon={Pencil} title="Edit" onClick={() => openEdit(emp)} />
                    <IconBtn icon={emp.status === "ACTIVE" ? Trash2 : UserCheck} title={emp.status === "ACTIVE" ? "Deactivate" : "Activate"} tone="danger" onClick={() => toggleStatus(emp)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <EmployeeFormModal open={showForm} onClose={() => setShowForm(false)} onSave={saveEmployee} initial={editing} skills={skills} />
    </div>
  );
}

function EmployeeFormModal({ open, onClose, onSave, initial, skills }) {
  const blank = { name: "", email: "", hourlyRate: 30, maxWeeklyHours: 25, priority: 2, skills: [], status: "ACTIVE" };
  const [form, setForm] = useState(blank);
  const [errors, setErrors] = useState({});

  useEffect(() => { if (open) { setForm(initial ? { ...initial } : blank); setErrors({}); } }, [open, initial]);

  const toggleSkill = (sid) => setForm((f) => ({ ...f, skills: f.skills.includes(sid) ? f.skills.filter((s) => s !== sid) : [...f.skills, sid] }));

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Enter a valid email";
    if (!(form.hourlyRate > 0)) errs.hourlyRate = "Enter a rate greater than $0";
    if (!(form.maxWeeklyHours > 0 && form.maxWeeklyHours <= 80)) errs.maxWeeklyHours = "Enter hours between 1 and 80";
    if (form.skills.length === 0) errs.skills = "Select at least one skill";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  return (
    <Modal
      open={open} onClose={onClose} title={initial ? "Edit Employee" : "Add Employee"}
      footer={<>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button onClick={() => validate() && onSave(form)}>Save Employee</Button>
      </>}
    >
      <Field label="Employee Name">
        <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Priya Patel" />
        {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
      </Field>
      <Field label="Email">
        <input className={inputCls} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="name@business.com" />
        {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Hourly Rate ($)">
          <input type="number" className={inputCls} value={form.hourlyRate} onChange={(e) => setForm({ ...form, hourlyRate: Number(e.target.value) })} />
          {errors.hourlyRate && <p className="text-xs text-rose-600 mt-1">{errors.hourlyRate}</p>}
        </Field>
        <Field label="Maximum Weekly Hours">
          <input type="number" className={inputCls} value={form.maxWeeklyHours} onChange={(e) => setForm({ ...form, maxWeeklyHours: Number(e.target.value) })} />
          {errors.maxWeeklyHours && <p className="text-xs text-rose-600 mt-1">{errors.maxWeeklyHours}</p>}
        </Field>
      </div>
      <Field label="Scheduling Priority" hint="Priority 1 = prefer assigning this employee when possible. Higher numbers = lower scheduling preference.">
        <select className={inputCls} value={form.priority} onChange={(e) => setForm({ ...form, priority: Number(e.target.value) })}>
          {[1, 2, 3, 4].map((p) => <option key={p} value={p}>Priority {p}</option>)}
        </select>
      </Field>
      <Field label="Status">
        <select className={inputCls} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </Field>
      <Field label="Skills">
        <div className="flex flex-wrap gap-2">
          {skills.filter((s) => s.active).map((s) => {
            const on = form.skills.includes(s.id);
            return (
              <button type="button" key={s.id} onClick={() => toggleSkill(s.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${on ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-600 border-slate-300 hover:border-indigo-300"}`}>
                {s.name}
              </button>
            );
          })}
        </div>
        {errors.skills && <p className="text-xs text-rose-600 mt-1">{errors.skills}</p>}
      </Field>
    </Modal>
  );
}

/* =========================================================================
   SETTINGS PAGE (skills management)
   ========================================================================= */
function SettingsPage() {
  const { skills, setSkills } = useApp();
  const [newSkill, setNewSkill] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [toastShow, toastNode] = useToast();

  const addSkill = () => {
    if (!newSkill.trim()) return;
    const id = newSkill.trim().toLowerCase().replace(/\s+/g, "-").slice(0, 12) + "-" + Math.random().toString(36).slice(2, 5);
    setSkills((prev) => [...prev, { id, name: newSkill.trim(), active: true }]);
    setNewSkill("");
    toastShow("Skill created");
  };
  const rename = (id) => {
    setSkills((prev) => prev.map((s) => (s.id === id ? { ...s, name: editValue } : s)));
    setEditingId(null);
    toastShow("Skill renamed");
  };
  const toggle = (id) => {
    setSkills((prev) => prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s)));
    toastShow("Skill status updated");
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {toastNode}
      <PageHeader title="Settings" subtitle="Business configuration and skills / positions" />

      <Card className="mb-5">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Business</p>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Business name</span>
          <span className="font-medium text-slate-800">{BUSINESS.name}</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-slate-500">Timezone</span>
          <span className="font-medium text-slate-800">{BUSINESS.timezone}</span>
        </div>
      </Card>

      <Card>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Skills / Positions</p>
        <div className="space-y-2 mb-4">
          {skills.map((s) => (
            <div key={s.id} className="flex items-center justify-between border border-slate-100 rounded-lg px-3 py-2.5">
              {editingId === s.id ? (
                <input autoFocus className={`${inputCls} !py-1 !text-sm max-w-[220px]`} value={editValue} onChange={(e) => setEditValue(e.target.value)} onKeyDown={(e) => e.key === "Enter" && rename(s.id)} />
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-800">{s.name}</span>
                  {!s.active && <Badge tone="grey">Inactive</Badge>}
                </div>
              )}
              <div className="flex items-center gap-1">
                {editingId === s.id ? (
                  <IconBtn icon={Check} title="Save" onClick={() => rename(s.id)} />
                ) : (
                  <IconBtn icon={Pencil} title="Rename" onClick={() => { setEditingId(s.id); setEditValue(s.name); }} />
                )}
                <IconBtn icon={s.active ? Trash2 : UserCheck} title={s.active ? "Deactivate" : "Activate"} tone="danger" onClick={() => toggle(s.id)} />
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input className={inputCls} placeholder="New skill name" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addSkill()} />
          <Button icon={Plus} onClick={addSkill}>Add</Button>
        </div>
      </Card>
    </div>
  );
}

/* =========================================================================
   SHIFTS PAGE (templates + weekly instances, tabbed)
   ========================================================================= */
function ShiftsPage() {
  const [tab, setTab] = useState("templates");
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <PageHeader title="Shifts" subtitle="Recurring shift templates and this week's shift instances" />
      <div className="inline-flex bg-slate-100 rounded-lg p-1 mb-6">
        {[["templates", "Shift Templates"], ["weekly", "Weekly Shifts"]].map(([k, label]) => (
          <button key={k} onClick={() => setTab(k)} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === k ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700"}`}>{label}</button>
        ))}
      </div>
      {tab === "templates" ? <ShiftTemplatesTab /> : <WeeklyShiftsTab />}
    </div>
  );
}

function ShiftTemplatesTab() {
  const { shiftTemplates, setShiftTemplates, skills } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toastShow, toastNode] = useToast();

  const grouped = DAY_DEFS.map(([key, label]) => ({ key, label, items: shiftTemplates.filter((t) => t.day === key).sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start)) }));

  const save = (data) => {
    if (editing) {
      setShiftTemplates((prev) => prev.map((t) => (t.id === editing.id ? { ...t, ...data } : t)));
      toastShow("Shift template updated");
    } else {
      const id = data.name.toLowerCase().replace(/\s+/g, "-") + "-" + data.day + "-" + Math.random().toString(36).slice(2, 5);
      setShiftTemplates((prev) => [...prev, { id, dayLabel: DAY_LABEL[data.day], ...data }]);
      toastShow("Shift template created");
    }
    setShowForm(false);
  };
  const toggleActive = (t) => setShiftTemplates((prev) => prev.map((x) => (x.id === t.id ? { ...x, active: !x.active } : x)));

  return (
    <div>
      {toastNode}
      <div className="flex justify-end mb-4">
        <Button icon={Plus} onClick={() => { setEditing(null); setShowForm(true); }}>Add Shift Template</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {grouped.map((g) => (
          <Card key={g.key}>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">{g.label}</p>
            <div className="space-y-2">
              {g.items.length === 0 && <p className="text-xs text-slate-400">No shifts configured.</p>}
              {g.items.map((t) => (
                <div key={t.id} className={`border rounded-lg px-3 py-2.5 ${t.active ? "border-slate-100" : "border-slate-100 bg-slate-50 opacity-60"}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {t.name === "Breakfast" ? <Coffee size={13} className="text-amber-500" /> : t.name === "Dinner" ? <Moon size={13} className="text-indigo-500" /> : <Sun size={13} className="text-amber-400" />}
                      <span className="text-sm font-medium text-slate-800">{t.name}</span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <IconBtn icon={Pencil} title="Edit" onClick={() => { setEditing(t); setShowForm(true); }} />
                      <IconBtn icon={t.active ? X : Check} title={t.active ? "Deactivate" : "Activate"} onClick={() => toggleActive(t)} />
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 ro-tnum">{t.start}\u2013{t.end}</p>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {t.requirements.map((r) => <Badge key={r.skillId} tone="grey">{skillName(skills, r.skillId)} \u00d7 {r.count}</Badge>)}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
      <ShiftTemplateFormModal open={showForm} onClose={() => setShowForm(false)} onSave={save} initial={editing} skills={skills} />
    </div>
  );
}

function ShiftTemplateFormModal({ open, onClose, onSave, initial, skills }) {
  const blank = { name: "", day: "mon", start: "08:00", end: "12:00", active: true, requirements: [] };
  const [form, setForm] = useState(blank);
  useEffect(() => { if (open) setForm(initial ? { ...initial, requirements: initial.requirements.map((r) => ({ ...r })) } : blank); }, [open, initial]);

  const addReq = () => setForm((f) => ({ ...f, requirements: [...f.requirements, { skillId: skills[0]?.id || "", count: 1 }] }));
  const updateReq = (i, patch) => setForm((f) => ({ ...f, requirements: f.requirements.map((r, idx) => (idx === i ? { ...r, ...patch } : r)) }));
  const removeReq = (i) => setForm((f) => ({ ...f, requirements: f.requirements.filter((_, idx) => idx !== i) }));

  return (
    <Modal open={open} onClose={onClose} title={initial ? "Edit Shift Template" : "Add Shift Template"}
      footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button onClick={() => onSave(form)}>Save Template</Button></>}>
      <Field label="Shift Name">
        <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Breakfast" />
      </Field>
      <Field label="Day of Week">
        <select className={inputCls} value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })}>
          {DAY_DEFS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
        </select>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Start Time"><input type="time" className={inputCls} value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} /></Field>
        <Field label="End Time"><input type="time" className={inputCls} value={form.end} onChange={(e) => setForm({ ...form, end: e.target.value })} /></Field>
      </div>
      <Field label="Active">
        <select className={inputCls} value={form.active ? "1" : "0"} onChange={(e) => setForm({ ...form, active: e.target.value === "1" })}>
          <option value="1">Active</option>
          <option value="0">Inactive</option>
        </select>
      </Field>
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-600">Staffing Requirements</span>
          <Button size="sm" variant="secondary" icon={Plus} onClick={addReq}>Add Requirement</Button>
        </div>
        <div className="space-y-2">
          {form.requirements.map((r, i) => (
            <div key={i} className="flex items-center gap-2">
              <select className={`${inputCls} flex-1`} value={r.skillId} onChange={(e) => updateReq(i, { skillId: e.target.value })}>
                {skills.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <input type="number" min={1} className={`${inputCls} w-20`} value={r.count} onChange={(e) => updateReq(i, { count: Number(e.target.value) })} />
              <IconBtn icon={Trash2} title="Remove" tone="danger" onClick={() => removeReq(i)} />
            </div>
          ))}
          {form.requirements.length === 0 && <p className="text-xs text-slate-400">No requirements yet. Add at least one.</p>}
        </div>
      </div>
    </Modal>
  );
}

function WeeklyShiftsTab() {
  const { weekStart, shiftTemplates, weeklyOverrides, setWeeklyOverrides, skills } = useApp();
  const shifts = useMemo(() => getShiftInstances(weekStart, shiftTemplates, weeklyOverrides), [weekStart, shiftTemplates, weeklyOverrides]);
  const [overrideTarget, setOverrideTarget] = useState(null);
  const [toastShow, toastNode] = useToast();

  const byDay = DAY_DEFS.map(([key, label]) => ({ key, label, items: shifts.filter((s) => s.day === key) }));

  const saveOverride = (reqs) => {
    const key = `${weekStart}|${overrideTarget.templateId}`;
    setWeeklyOverrides((prev) => ({ ...prev, [key]: reqs }));
    toastShow("Weekly override saved \u2014 applies to this week only");
    setOverrideTarget(null);
  };
  const clearOverride = (shift) => {
    const key = `${weekStart}|${shift.templateId}`;
    setWeeklyOverrides((prev) => { const n = { ...prev }; delete n[key]; return n; });
    toastShow("Override removed");
  };

  return (
    <div>
      {toastNode}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-500">{shifts.length} shift instances for this week, generated from active shift templates.</p>
        <WeekSelector compact />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {byDay.map((d) => (
          <Card key={d.key}>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">{d.label}</p>
            <div className="space-y-2">
              {d.items.length === 0 && <p className="text-xs text-slate-400">No shifts.</p>}
              {d.items.map((s) => (
                <div key={s.id} className="border border-slate-100 rounded-lg px-3 py-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{s.name}</p>
                      <p className="text-xs text-slate-500 ro-tnum">{s.dateLabel} \u00b7 {s.start}\u2013{s.end}</p>
                    </div>
                    <IconBtn icon={Pencil} title="Override requirements for this week" onClick={() => setOverrideTarget(s)} />
                  </div>
                  <div className="flex flex-wrap items-center gap-1 mt-1.5">
                    {s.requirements.map((r) => <Badge key={r.skillId} tone="grey">{skillName(skills, r.skillId)} \u00d7 {r.count}</Badge>)}
                    {s.isOverridden && <Badge tone="orange">Weekly override</Badge>}
                  </div>
                  {s.isOverridden && (
                    <button onClick={() => clearOverride(s)} className="text-xs text-indigo-600 hover:underline mt-1.5">Reset to template</button>
                  )}
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
      <OverrideModal target={overrideTarget} onClose={() => setOverrideTarget(null)} onSave={saveOverride} skills={skills} />
    </div>
  );
}

function OverrideModal({ target, onClose, onSave, skills }) {
  const [reqs, setReqs] = useState([]);
  useEffect(() => { if (target) setReqs(target.requirements.map((r) => ({ ...r }))); }, [target]);
  if (!target) return null;
  const updateReq = (i, patch) => setReqs((r) => r.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));
  const addReq = () => setReqs((r) => [...r, { skillId: skills[0]?.id || "", count: 1 }]);
  const removeReq = (i) => setReqs((r) => r.filter((_, idx) => idx !== i));

  return (
    <Modal open={!!target} onClose={onClose} title={`Override \u2014 ${target.dayLabel} ${target.name}`}
      footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button onClick={() => onSave(reqs)}>Save for This Week</Button></>}>
      <p className="text-xs text-slate-500 mb-3">This changes staffing requirements only for {target.dateLabel}. The original shift template is not affected.</p>
      <div className="space-y-2">
        {reqs.map((r, i) => (
          <div key={i} className="flex items-center gap-2">
            <select className={`${inputCls} flex-1`} value={r.skillId} onChange={(e) => updateReq(i, { skillId: e.target.value })}>
              {skills.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <input type="number" min={0} className={`${inputCls} w-20`} value={r.count} onChange={(e) => updateReq(i, { count: Number(e.target.value) })} />
            <IconBtn icon={Trash2} title="Remove" tone="danger" onClick={() => removeReq(i)} />
          </div>
        ))}
      </div>
      <Button size="sm" variant="secondary" icon={Plus} className="mt-2" onClick={addReq}>Add Requirement</Button>
    </Modal>
  );
}

/* =========================================================================
   MANAGER AVAILABILITY OVERVIEW
   ========================================================================= */
function AvailabilityOverviewPage() {
  const { employees, weekStart, shiftTemplates, weeklyOverrides, baseUnavailableSet, exceptions, skills } = useApp();
  const shifts = useMemo(() => getShiftInstances(weekStart, shiftTemplates, weeklyOverrides), [weekStart, shiftTemplates, weeklyOverrides]);
  const [skillFilter, setSkillFilter] = useState("all");
  const [dayFilter, setDayFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredShifts = shifts.filter((s) => dayFilter === "all" || s.day === dayFilter);
  const activeEmployees = employees.filter((e) => e.status === "ACTIVE" && (skillFilter === "all" || e.skills.includes(skillFilter)));

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <PageHeader title="Availability" subtitle="See who's available for every shift this week" right={<WeekSelector />} />

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <select className={`${inputCls} !w-auto`} value={skillFilter} onChange={(e) => setSkillFilter(e.target.value)}>
          <option value="all">All skills</option>
          {skills.filter((s) => s.active).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select className={`${inputCls} !w-auto`} value={dayFilter} onChange={(e) => setDayFilter(e.target.value)}>
          <option value="all">All days</option>
          {DAY_DEFS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
        </select>
        <select className={`${inputCls} !w-auto`} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">Any availability</option>
          <option value="AVAILABLE">Available</option>
          <option value="UNAVAILABLE">Unavailable</option>
        </select>
        <div className="flex items-center gap-3 ml-auto text-xs text-slate-500">
          <span className="flex items-center gap-1"><CircleCheck size={13} className="text-emerald-500" /> Available</span>
          <span className="flex items-center gap-1"><CircleX size={13} className="text-slate-400" /> Unavailable</span>
          <span className="flex items-center gap-1"><CircleAlert size={13} className="text-amber-500" /> Weekly Exception</span>
        </div>
      </div>

      <Card padded={false} className="overflow-x-auto ro-scroll">
        <table className="text-sm min-w-[900px] w-full">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs">
              <th className="text-left font-semibold px-4 py-3 sticky left-0 bg-slate-50 z-10">Employee</th>
              {filteredShifts.map((s) => (
                <th key={s.id} className="text-center font-medium px-2 py-3 whitespace-nowrap">
                  <div>{DAY_SHORT[s.day]} {s.dateLabel.split(" ")[0]}</div>
                  <div className="text-[10px] text-slate-400 font-normal">{s.name}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {activeEmployees.map((emp) => (
              <tr key={emp.id} className="border-t border-slate-100">
                <td className="px-4 py-2.5 sticky left-0 bg-white z-10 font-medium text-slate-800 whitespace-nowrap">{emp.name}</td>
                {filteredShifts.map((s) => {
                  const avail = getEffectiveAvailability(emp.id, weekStart, s.templateId, baseUnavailableSet, exceptions);
                  if (statusFilter !== "all" && avail.status !== statusFilter) return <td key={s.id} className="text-center px-2 py-2.5 text-slate-200">\u00b7</td>;
                  return (
                    <td key={s.id} className="text-center px-2 py-2.5">
                      {avail.source === "exception" ? (
                        <CircleAlert size={15} className="text-amber-500 inline" />
                      ) : avail.status === "AVAILABLE" ? (
                        <CircleCheck size={15} className="text-emerald-500 inline" />
                      ) : (
                        <CircleX size={15} className="text-slate-300 inline" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* =========================================================================
   ROSTER PAGE (the centerpiece)
   ========================================================================= */
function RosterPage() {
  const {
    employees, weekStart, shiftTemplates, weeklyOverrides, baseUnavailableSet, exceptions,
    rostersByWeek, setRostersByWeek, skills, setTopView,
  } = useApp();
  const [generating, setGenerating] = useState(false);
  const [tab, setTab] = useState("grid");
  const [showRegenModal, setShowRegenModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [editSlot, setEditSlot] = useState(null); // {shift, skillId, currentAssignment|null}
  const [toastShow, toastNode] = useToast();

  const shifts = useMemo(() => getShiftInstances(weekStart, shiftTemplates, weeklyOverrides), [weekStart, shiftTemplates, weeklyOverrides]);
  const roster = rostersByWeek[weekStart];

  const runGenerate = (opts = {}) => {
    setGenerating(true);
    setTimeout(() => {
      const result = generateRoster({
        weekStart, employees, shiftTemplates, weeklyOverrides, baseUnavailableSet, exceptions,
        keepManualLocked: !!opts.keepManualLocked,
        existingAssignments: roster ? roster.assignments : [],
      });
      setRostersByWeek((prev) => ({ ...prev, [weekStart]: { ...result, shareId: roster?.shareId || null } }));
      setGenerating(false);
      toastShow(opts.keepManualLocked ? "Roster regenerated \u2014 manual assignments kept" : "Roster generated");
    }, 900);
  };

  const handlePublish = () => {
    setRostersByWeek((prev) => ({
      ...prev,
      [weekStart]: { ...prev[weekStart], status: "PUBLISHED", publishedAt: nowStamp(), shareId: prev[weekStart].shareId || randomShareId() },
    }));
    setShowPublishModal(false);
    toastShow("Roster published");
  };

  const saveManualAssignment = (shift, skillId, newEmployeeId, replacingAssignmentId) => {
    setRostersByWeek((prev) => {
      const cur = prev[weekStart];
      let assignments = cur.assignments.filter((a) => a.id !== replacingAssignmentId);
      const emp = employees.find((e) => e.id === newEmployeeId);
      const cost = shift.duration * emp.hourlyRate;
      assignments = [...assignments, { id: `a_${shift.id}_${skillId}_${newEmployeeId}_${Date.now()}`, shiftId: shift.id, skillId, employeeId: newEmployeeId, cost, source: "MANUAL" }];

      const unfilled = [];
      shifts.forEach((sh) => {
        sh.requirements.forEach((req) => {
          const count = assignments.filter((a) => a.shiftId === sh.id && a.skillId === req.skillId).length;
          if (count < req.count) unfilled.push({ shiftId: sh.id, skillId: req.skillId, required: req.count, assigned: count, shortfall: req.count - count });
        });
      });
      const totalLabourCost = assignments.reduce((s, a) => s + a.cost, 0);
      const totalRequiredSlots = shifts.reduce((s, sh) => s + sh.requirements.reduce((a, r) => a + r.count, 0), 0);
      const hoursByEmp = {};
      assignments.forEach((a) => { const sh = shifts.find((s) => s.id === a.shiftId); hoursByEmp[a.employeeId] = (hoursByEmp[a.employeeId] || 0) + (sh ? sh.duration : 0); });
      const scheduledHours = Object.values(hoursByEmp).reduce((a, b) => a + b, 0);
      const employeesScheduled = Object.keys(hoursByEmp).length;
      const coverage = totalRequiredSlots === 0 ? 100 : Math.round((assignments.length / totalRequiredSlots) * 100);

      return {
        ...prev,
        [weekStart]: {
          ...cur, assignments, unfilled,
          totals: { ...cur.totals, totalLabourCost, coverage, scheduledHours, employeesScheduled, totalRequiredSlots, totalFilledSlots: assignments.length },
        },
      };
    });
    toastShow("Assignment updated");
    setEditSlot(null);
  };

  const copyShareLink = () => {
    const link = `rosteroptimizer.app/share/${roster.shareId}`;
    try { navigator.clipboard.writeText(`https://${link}`); } catch (e) {}
    toastShow("Link copied to clipboard");
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {toastNode}
      <PageHeader
        title="Roster"
        subtitle={`Week of ${weekLabel(weekStart)}`}
        right={
          <div className="flex items-center gap-2 flex-wrap">
            <WeekSelector compact />
            {roster && <RosterStatusBadge status={roster.status} />}
            {roster && roster.status !== "PUBLISHED" && (
              <Button variant="secondary" icon={RefreshCw} onClick={() => setShowRegenModal(true)}>Regenerate</Button>
            )}
            {roster && roster.status !== "PUBLISHED" && (
              <Button variant="cta" icon={Share2} onClick={() => setShowPublishModal(true)}>Publish Roster</Button>
            )}
          </div>
        }
      />

      {!roster && !generating && (
        <Card className="!py-4">
          <EmptyState
            icon={Sparkles}
            title="No roster generated for this week yet"
            message="Generate Roster reviews every employee's availability, skills, and hour limits, then builds the lowest-cost roster that covers every shift it can."
            action={<Button size="lg" variant="cta" icon={Sparkles} onClick={() => runGenerate()}>Generate Optimized Roster</Button>}
          />
        </Card>
      )}

      {generating && (
        <Card className="!py-14">
          <div className="flex flex-col items-center justify-center text-center">
            <Loader2 size={26} className="text-indigo-500 animate-spin mb-3" />
            <p className="font-medium text-slate-700">Optimizing roster\u2026</p>
            <p className="text-xs text-slate-400 mt-1">Matching availability, skills and hour limits</p>
          </div>
        </Card>
      )}

      {roster && !generating && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <StatCard icon={DollarSign} label="Total Labour Cost" value={fmtMoney(roster.totals.totalLabourCost)} sub="This week" />
            <StatCard icon={TrendingUp} label="Coverage" value={`${roster.totals.coverage}%`} sub="Requirements filled" />
            <StatCard icon={Clock} label="Total Scheduled Hours" value={fmtHours(roster.totals.scheduledHours)} sub="Across all employees" />
            <StatCard icon={AlertTriangle} label="Unfilled Requirements" value={roster.unfilled.reduce((a, u) => a + u.shortfall, 0)} warn={roster.unfilled.length > 0} sub="Positions still open" />
            <StatCard icon={Users} label="Employees Scheduled" value={`${roster.totals.employeesScheduled} / ${roster.totals.totalActiveEmployees}`} sub="Working this week" />
          </div>

          <div className="inline-flex bg-slate-100 rounded-lg p-1 mb-5">
            {[["grid", "Roster Grid"], ["hours", "Employee Hours"]].map(([k, label]) => (
              <button key={k} onClick={() => setTab(k)} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === k ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700"}`}>{label}</button>
            ))}
          </div>

          {(roster.unfilled.length > 0 || roster.softWarnings.length > 0) && (
            <Card className="mb-5">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Scheduling Issues</p>
              <div className="space-y-2">
                {roster.unfilled.map((u, i) => {
                  const shift = shifts.find((s) => s.id === u.shiftId);
                  return (
                    <div key={"u" + i} className="flex items-start gap-2.5 text-sm text-rose-700 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2.5">
                      <AlertTriangle size={15} className="text-rose-500 mt-0.5 shrink-0" />
                      <span><b>{shift?.dayLabel} {shift?.name} \u2014 {skillName(skills, u.skillId)}</b><br />Required: {u.required} &nbsp;\u00b7&nbsp; Assigned: {u.assigned} &nbsp;\u00b7&nbsp; No additional available qualified employees.</span>
                    </div>
                  );
                })}
                {roster.softWarnings.map((w, i) => (
                  <div key={"s" + i} className="flex items-start gap-2.5 text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2.5">
                    <Info size={15} className="text-amber-500 mt-0.5 shrink-0" />
                    <span>{w.message}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {tab === "grid" ? (
            <RosterGrid shifts={shifts} roster={roster} employees={employees} skills={skills} onEditSlot={(shift, skillId, current) => setEditSlot({ shift, skillId, current })} readOnly={false} />
          ) : (
            <EmployeeHoursTable employees={employees} roster={roster} shifts={shifts} />
          )}

          {roster.status === "PUBLISHED" && (
            <Card className="mt-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5"><Share2 size={15} /> Share Full Roster</p>
                  <p className="text-xs text-slate-500 mt-1">Anyone with this link can view the published roster. The shared page is read-only.</p>
                  <p className="text-sm font-mono text-indigo-600 mt-2 ro-tnum">rosteroptimizer.app/share/{roster.shareId}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" icon={Copy} onClick={copyShareLink}>Copy Link</Button>
                  <Button variant="secondary" icon={ExternalLink} onClick={() => setTopView("shared")}>Preview</Button>
                </div>
              </div>
            </Card>
          )}
        </>
      )}

      <RegenerateModal open={showRegenModal} onClose={() => setShowRegenModal(false)} onConfirm={(keep) => { setShowRegenModal(false); runGenerate({ keepManualLocked: keep }); }} />
      {roster && (
        <PublishModal open={showPublishModal} onClose={() => setShowPublishModal(false)} onConfirm={handlePublish} roster={roster} weekStart={weekStart} />
      )}
      {editSlot && (
        <EditAssignmentModal
          slot={editSlot} onClose={() => setEditSlot(null)}
          weekStart={weekStart} employees={employees} skills={skills} roster={roster} shifts={shifts}
          baseUnavailableSet={baseUnavailableSet} exceptions={exceptions}
          onSave={(empId) => saveManualAssignment(editSlot.shift, editSlot.skillId, empId, editSlot.current?.id)}
        />
      )}
    </div>
  );
}

function RosterGrid({ shifts, roster, employees, skills, onEditSlot, readOnly }) {
  const byDay = DAY_DEFS.map(([key, label]) => ({ key, label, items: shifts.filter((s) => s.day === key) }));
  const empById = Object.fromEntries(employees.map((e) => [e.id, e]));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
      {byDay.map((d) => (
        <div key={d.key} className="min-w-0">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2.5 px-0.5">{d.label} <span className="ro-tnum text-slate-400 font-normal">{d.items[0]?.dateLabel || ""}</span></p>
          <div className="space-y-3">
            {d.items.length === 0 && <p className="text-xs text-slate-300 px-0.5">No shifts</p>}
            {d.items.map((shift) => {
              const assigns = roster.assignments.filter((a) => a.shiftId === shift.id);
              const totalReq = shift.requirements.reduce((a, r) => a + r.count, 0);
              const filled = assigns.length;
              const cost = assigns.reduce((s, a) => s + a.cost, 0);
              return (
                <Card key={shift.id} className={`!p-3 border-l-4 ${filled < totalReq ? "border-l-rose-400" : "border-l-emerald-400"}`}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold text-slate-800">{shift.name}</p>
                    <span className="flex gap-0.5">
                      {Array.from({ length: totalReq }).map((_, i) => (
                        <span key={i} className={`w-1.5 h-1.5 rounded-full ${i < filled ? "bg-emerald-500" : "bg-slate-200"}`} />
                      ))}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 ro-tnum mb-2">{shift.start}\u2013{shift.end}</p>
                  <div className="space-y-1.5">
                    {shift.requirements.map((req) => {
                      const reqAssigns = assigns.filter((a) => a.skillId === req.skillId);
                      const shortfall = req.count - reqAssigns.length;
                      return (
                        <div key={req.skillId}>
                          <p className="text-[10px] font-medium text-slate-400 uppercase">{skillName(skills, req.skillId)}</p>
                          <div className="space-y-0.5">
                            {reqAssigns.map((a) => {
                              const emp = empById[a.employeeId];
                              return (
                                <button
                                  key={a.id} disabled={readOnly}
                                  onClick={() => onEditSlot && onEditSlot(shift, req.skillId, a)}
                                  className={`w-full flex items-center justify-between text-xs rounded px-1.5 py-1 ${readOnly ? "" : "hover:bg-slate-50"} text-left`}
                                >
                                  <span className="text-slate-700 truncate">{emp ? emp.name : "Unknown"}</span>
                                  <Badge tone={a.source === "MANUAL" ? "violet" : "grey"} className="!px-1.5 !py-0 !text-[9px] shrink-0 ml-1">{a.source === "MANUAL" ? "MANUAL" : "AUTO"}</Badge>
                                </button>
                              );
                            })}
                            {shortfall > 0 && (
                              <div className="text-xs text-rose-600 flex items-center gap-1 px-1.5 py-1">
                                <AlertTriangle size={11} />
                                {reqAssigns.length} / {req.count} \u2014 {shortfall} position{shortfall > 1 ? "s" : ""} unfilled
                                {!readOnly && (
                                  <button className="text-indigo-600 hover:underline ml-auto shrink-0" onClick={() => onEditSlot && onEditSlot(shift, req.skillId, null)}>+ Assign</button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50">
                    <span className="text-xs text-slate-500">Cost: <b className="text-slate-700 ro-tnum">{fmtMoney(cost)}</b></span>
                    <span className="text-xs text-slate-500 ro-tnum">{filled} / {totalReq}</span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function EmployeeHoursTable({ employees, roster, shifts }) {
  const hoursByEmp = {};
  roster.assignments.forEach((a) => {
    const sh = shifts.find((s) => s.id === a.shiftId);
    hoursByEmp[a.employeeId] = (hoursByEmp[a.employeeId] || 0) + (sh ? sh.duration : 0);
  });
  const scheduled = employees.filter((e) => hoursByEmp[e.id] > 0).sort((a, b) => (hoursByEmp[b.id] || 0) - (hoursByEmp[a.id] || 0));

  return (
    <Card padded={false} className="overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
            <th className="text-left font-semibold px-4 py-3">Employee</th>
            <th className="text-left font-semibold px-4 py-3 w-56">Scheduled Hours</th>
            <th className="text-left font-semibold px-4 py-3">Hourly Rate</th>
            <th className="text-left font-semibold px-4 py-3">Estimated Cost</th>
          </tr>
        </thead>
        <tbody>
          {scheduled.map((emp) => {
            const h = hoursByEmp[emp.id] || 0;
            const pct = Math.round((h / emp.maxWeeklyHours) * 100);
            return (
              <tr key={emp.id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium text-slate-800">{emp.name}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="ro-tnum text-xs text-slate-600 w-20 shrink-0">{fmtHours(h)} / {emp.maxWeeklyHours}h</span>
                    <div className="flex-1"><ProgressBar value={h} max={emp.maxWeeklyHours} /></div>
                    <span className={`text-xs w-9 text-right ro-tnum ${pct >= 90 ? "text-amber-600 font-medium" : "text-slate-400"}`}>{pct}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600 ro-tnum">${emp.hourlyRate}/hr</td>
                <td className="px-4 py-3 text-slate-800 font-medium ro-tnum">{fmtMoney(h * emp.hourlyRate)}</td>
              </tr>
            );
          })}
          {scheduled.length === 0 && (
            <tr><td colSpan={4} className="text-center text-slate-400 text-sm py-8">No employees scheduled.</td></tr>
          )}
        </tbody>
      </table>
    </Card>
  );
}

function RegenerateModal({ open, onClose, onConfirm }) {
  const [keep, setKeep] = useState(true);
  useEffect(() => { if (open) setKeep(true); }, [open]);
  return (
    <Modal open={open} onClose={onClose} title="Regenerate roster?" footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button onClick={() => onConfirm(keep)} icon={RefreshCw}>Regenerate</Button></>}>
      <div className="space-y-2">
        <button onClick={() => setKeep(true)} className={`w-full text-left border rounded-lg px-3.5 py-3 flex items-start gap-3 ${keep ? "border-indigo-400 bg-indigo-50/50" : "border-slate-200"}`}>
          <Lock size={16} className={`mt-0.5 ${keep ? "text-indigo-600" : "text-slate-400"}`} />
          <span>
            <span className="block text-sm font-medium text-slate-800">Keep manual assignments locked</span>
            <span className="block text-xs text-slate-500 mt-0.5">The optimizer recalculates every other assignment but leaves your manual edits in place. Recommended.</span>
          </span>
        </button>
        <button onClick={() => setKeep(false)} className={`w-full text-left border rounded-lg px-3.5 py-3 flex items-start gap-3 ${!keep ? "border-indigo-400 bg-indigo-50/50" : "border-slate-200"}`}>
          <Unlock size={16} className={`mt-0.5 ${!keep ? "text-indigo-600" : "text-slate-400"}`} />
          <span>
            <span className="block text-sm font-medium text-slate-800">Regenerate everything</span>
            <span className="block text-xs text-slate-500 mt-0.5">Discards manual edits and rebuilds the full roster from scratch.</span>
          </span>
        </button>
      </div>
    </Modal>
  );
}

function PublishModal({ open, onClose, onConfirm, roster, weekStart }) {
  return (
    <Modal open={open} onClose={onClose} title="Publish Roster" footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button variant="cta" icon={Share2} onClick={onConfirm}>Publish</Button></>}>
      <div className="space-y-2.5 text-sm">
        <div className="flex justify-between"><span className="text-slate-500">Week</span><span className="font-medium text-slate-800">{weekLabel(weekStart)}</span></div>
        <div className="flex justify-between"><span className="text-slate-500">Coverage</span><span className="font-medium text-slate-800">{roster.totals.coverage}%</span></div>
        <div className="flex justify-between"><span className="text-slate-500">Labour Cost</span><span className="font-medium text-slate-800">{fmtMoney(roster.totals.totalLabourCost)}</span></div>
        <div className="flex justify-between"><span className="text-slate-500">Warnings</span><span className="font-medium text-slate-800">{roster.softWarnings.length} soft scheduling warning{roster.softWarnings.length === 1 ? "" : "s"}{roster.unfilled.length > 0 ? `, ${roster.unfilled.length} unfilled requirement${roster.unfilled.length === 1 ? "" : "s"}` : ""}</span></div>
      </div>
      <p className="text-xs text-slate-400 mt-4">Once published, employees can see their assigned shifts immediately.</p>
    </Modal>
  );
}

function EditAssignmentModal({ slot, onClose, onSave, weekStart, employees, skills, roster, shifts, baseUnavailableSet, exceptions }) {
  const { shift, skillId, current } = slot;
  const currentEmp = current ? employees.find((e) => e.id === current.employeeId) : null;
  const [selected, setSelected] = useState(current?.employeeId || null);

  const hoursByEmp = {};
  roster.assignments.forEach((a) => { if (a.id === current?.id) return; const sh = shifts.find((s) => s.id === a.shiftId); hoursByEmp[a.employeeId] = (hoursByEmp[a.employeeId] || 0) + (sh ? sh.duration : 0); });

  const rows = employees.filter((e) => e.status === "ACTIVE").map((emp) => {
    const avail = getEffectiveAvailability(emp.id, weekStart, shift.templateId, baseUnavailableSet, exceptions);
    const hasSkill = emp.skills.includes(skillId);
    const projected = (hoursByEmp[emp.id] || 0) + shift.duration;
    const overHours = projected > emp.maxWeeklyHours;
    const empAssignsOtherShifts = roster.assignments.filter((a) => a.employeeId === emp.id && a.shiftId !== shift.id && a.id !== current?.id);
    const conflict = empAssignsOtherShifts.map((a) => shifts.find((s) => s.id === a.shiftId)).find((s) => s && s.date === shift.date && overlaps(s.start, s.end, shift.start, shift.end));
    const alreadyThisShift = roster.assignments.some((a) => a.shiftId === shift.id && a.employeeId === emp.id && a.id !== current?.id);
    const reasons = [];
    if (avail.status !== "AVAILABLE") reasons.push("Employee unavailable");
    if (!hasSkill) reasons.push(`Missing required ${skillName(skills, skillId)} skill`);
    if (overHours) reasons.push("Would exceed maximum weekly hours");
    if (conflict) reasons.push(`Conflicts with ${conflict.dayLabel} ${conflict.name}`);
    if (alreadyThisShift) reasons.push("Already assigned to this shift");
    return { emp, avail, hasSkill, projected, overHours, conflict, reasons, eligible: reasons.length === 0 };
  }).sort((a, b) => (b.eligible - a.eligible) || a.emp.name.localeCompare(b.emp.name));

  return (
    <Modal open={true} onClose={onClose} title="Edit Assignment" width="max-w-xl"
      footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button disabled={!selected || selected === current?.employeeId} onClick={() => onSave(selected)}>Save Assignment</Button></>}>
      <div className="mb-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Current</p>
        <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-lg px-3 py-2.5">
          <div>
            <p className="text-xs text-slate-400">{skillName(skills, skillId)}</p>
            <p className="text-sm font-medium text-slate-800">{currentEmp ? currentEmp.name : "Unassigned"}</p>
          </div>
          <p className="text-xs text-slate-400 ro-tnum">{shift.dayLabel} {shift.name} \u00b7 {shift.start}\u2013{shift.end}</p>
        </div>
      </div>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Replace with</p>
      <div className="space-y-1.5 max-h-72 overflow-y-auto ro-scroll pr-1">
        {rows.map(({ emp, hasSkill, projected, reasons, eligible }) => (
          <button
            key={emp.id} disabled={!eligible}
            onClick={() => setSelected(emp.id)}
            className={`w-full text-left border rounded-lg px-3 py-2.5 transition-colors ${!eligible ? "opacity-50 cursor-not-allowed border-slate-100" : selected === emp.id ? "border-indigo-400 bg-indigo-50/50" : "border-slate-200 hover:border-indigo-300"}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-800">{emp.name}</span>
              {eligible ? <Badge tone="green">Available</Badge> : <Badge tone="red">Cannot assign</Badge>}
            </div>
            <div className="flex flex-wrap items-center gap-1 mt-1">
              {emp.skills.map((sid) => <Badge key={sid} tone="grey">{skillName(skills, sid)}</Badge>)}
              <span className="text-xs text-slate-400 ro-tnum ml-1">{fmtHours(projected)} / {emp.maxWeeklyHours}h \u00b7 ${emp.hourlyRate}/hr</span>
            </div>
            {!eligible && (
              <ul className="mt-1.5 space-y-0.5">
                {reasons.map((r, i) => <li key={i} className="text-xs text-rose-600 flex items-center gap-1"><X size={11} /> {r}</li>)}
              </ul>
            )}
          </button>
        ))}
      </div>
    </Modal>
  );
}

/* =========================================================================
   SHARED READ-ONLY ROSTER
   ========================================================================= */
function SharedRosterView() {
  const { weekStart, shiftTemplates, weeklyOverrides, rostersByWeek, employees, skills, setTopView } = useApp();
  const shifts = useMemo(() => getShiftInstances(weekStart, shiftTemplates, weeklyOverrides), [weekStart, shiftTemplates, weeklyOverrides]);
  const roster = rostersByWeek[weekStart];

  return (
    <div className="min-h-screen bg-slate-50 ro-root">
      <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-amber-500 flex items-center justify-center"><CalendarClock size={15} className="text-slate-900" /></div>
          <span className="ro-display font-semibold text-sm">{BUSINESS.name} \u00b7 Roster</span>
        </div>
        <Badge tone="slate" className="!bg-white/10 !text-white !border-white/20"><Eye size={12} /> Read-only shared view</Badge>
      </div>
      <div className="p-8 max-w-7xl mx-auto">
        <PageHeader title={`Week of ${weekLabel(weekStart)}`} subtitle={roster?.status === "PUBLISHED" ? `Published ${roster.publishedAt}` : "This roster has not been published yet."} />
        {roster && roster.status === "PUBLISHED" ? (
          <RosterGrid shifts={shifts} roster={roster} employees={employees} skills={skills} readOnly />
        ) : (
          <Card><EmptyState icon={ClipboardList} title="Nothing to see yet" message="The manager hasn't published this week's roster." /></Card>
        )}
        <div className="text-center mt-8">
          <button onClick={() => setTopView("manager")} className="text-xs text-slate-400 hover:text-slate-600">Exit shared preview</button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   EMPLOYEE LAYOUT + PAGES
   ========================================================================= */
const EMPLOYEE_NAV = [
  { key: "availability", label: "My Availability", icon: ListChecks },
  { key: "weekly", label: "Weekly Changes", icon: CalendarClock },
  { key: "roster", label: "My Roster", icon: ClipboardList },
  { key: "profile", label: "Profile", icon: User },
];

function EmployeeLayout({ children }) {
  const { employeePage, setEmployeePage, setCurrentUser, setTopView, currentEmployee } = useApp();
  return (
    <div className="min-h-screen bg-slate-50 ro-root">
      <header className="bg-white border-b border-slate-200 px-4 py-3.5 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-amber-500 flex items-center justify-center"><CalendarClock size={15} className="text-slate-900" /></div>
          <div>
            <p className="ro-display text-sm font-semibold text-slate-900 leading-none">{BUSINESS.name}</p>
            <p className="text-xs text-slate-400 leading-none mt-0.5">{currentEmployee?.name}</p>
          </div>
        </div>
        <button onClick={() => { setCurrentUser(null); setTopView("login"); }} className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"><LogOut size={16} /></button>
      </header>
      <nav className="bg-white border-b border-slate-200 px-2 flex gap-1 overflow-x-auto ro-scroll sticky top-[57px] z-20">
        {EMPLOYEE_NAV.map((item) => {
          const active = employeePage === item.key;
          return (
            <button key={item.key} onClick={() => setEmployeePage(item.key)}
              className={`flex items-center gap-1.5 px-3.5 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${active ? "border-indigo-600 text-indigo-700" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
              <item.icon size={15} /> {item.label}
            </button>
          );
        })}
      </nav>
      <main className="max-w-2xl mx-auto">{children}</main>
    </div>
  );
}

function EmployeeAvailabilityPage() {
  const { currentEmployee, shiftTemplates, baseUnavailableSet, setBaseUnavailableSet } = useApp();
  const [toastShow, toastNode] = useToast();
  const shiftNames = [...new Set(shiftTemplates.map((t) => t.name))];

  const toggle = (templateId) => {
    const key = `${currentEmployee.id}|${templateId}`;
    setBaseUnavailableSet((prev) => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n; });
  };

  return (
    <div className="p-5">
      {toastNode}
      <h1 className="ro-display text-lg font-semibold text-slate-900 mb-1">My Availability</h1>
      <p className="text-sm text-slate-500 mb-4">Tap a shift to toggle whether you can regularly work it.</p>

      <Card padded={false} className="overflow-x-auto ro-scroll">
        <table className="text-sm min-w-[560px] w-full">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs">
              <th className="text-left font-semibold px-3 py-2.5">Shift</th>
              {DAY_DEFS.map(([k, , s]) => <th key={k} className="text-center font-medium px-2 py-2.5">{s}</th>)}
            </tr>
          </thead>
          <tbody>
            {shiftNames.map((name) => (
              <tr key={name} className="border-t border-slate-100">
                <td className="px-3 py-2.5 font-medium text-slate-700 whitespace-nowrap">{name}</td>
                {DAY_DEFS.map(([k]) => {
                  const tpl = shiftTemplates.find((t) => t.day === k && t.name === name && t.active);
                  if (!tpl) return <td key={k} className="text-center px-2 py-2.5 text-slate-200">\u2014</td>;
                  const key = `${currentEmployee.id}|${tpl.id}`;
                  const available = !baseUnavailableSet.has(key);
                  return (
                    <td key={k} className="text-center px-2 py-2.5">
                      <button onClick={() => toggle(tpl.id)} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${available ? "bg-emerald-100 text-emerald-600 hover:bg-emerald-200" : "bg-slate-100 text-slate-400 hover:bg-slate-200"}`}>
                        {available ? <Check size={15} /> : <X size={15} />}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div className="flex items-center gap-2 mt-4">
        <Button onClick={() => toastShow("Availability saved")}>Save Availability</Button>
      </div>
      <p className="text-xs text-slate-400 bg-slate-100 rounded-lg px-3 py-2.5 mt-4 leading-relaxed">
        Your regular availability will automatically carry forward every week unless you submit a change. You don't need to resubmit it weekly.
      </p>
    </div>
  );
}

function EmployeeWeeklyChangesPage() {
  const { currentEmployee, weekStart, shiftTemplates, weeklyOverrides, baseUnavailableSet, setBaseUnavailableSet, exceptions, setExceptions } = useApp();
  const shifts = useMemo(() => getShiftInstances(weekStart, shiftTemplates, weeklyOverrides), [weekStart, shiftTemplates, weeklyOverrides]);
  const [pending, setPending] = useState(null); // shift being changed, awaiting scope choice
  const [toastShow, toastNode] = useToast();

  const byDay = DAY_DEFS.map(([key, label]) => ({ key, label, items: shifts.filter((s) => s.day === key) }));

  const requestToggle = (shift) => setPending(shift);

  const applyChange = (scope) => {
    const shift = pending;
    const avail = getEffectiveAvailability(currentEmployee.id, weekStart, shift.templateId, baseUnavailableSet, exceptions);
    const newStatus = avail.status === "AVAILABLE" ? "UNAVAILABLE" : "AVAILABLE";
    if (scope === "week") {
      setExceptions((prev) => {
        const without = prev.filter((e) => !(e.employeeId === currentEmployee.id && e.weekStart === weekStart && e.templateId === shift.templateId));
        return [...without, { id: `ex_${Date.now()}`, employeeId: currentEmployee.id, weekStart, templateId: shift.templateId, status: newStatus, createdAt: new Date().toISOString() }];
      });
      toastShow(`This change only applies to the week of ${weekLabel(weekStart)}.`);
    } else {
      const key = `${currentEmployee.id}|${shift.templateId}`;
      setBaseUnavailableSet((prev) => { const n = new Set(prev); newStatus === "UNAVAILABLE" ? n.add(key) : n.delete(key); return n; });
      setExceptions((prev) => prev.filter((e) => !(e.employeeId === currentEmployee.id && e.weekStart === weekStart && e.templateId === shift.templateId)));
      toastShow("This becomes your new regular availability.");
    }
    setPending(null);
  };

  return (
    <div className="p-5">
      {toastNode}
      <h1 className="ro-display text-lg font-semibold text-slate-900 mb-1">Weekly Changes</h1>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-500">Adjust your availability for a specific week.</p>
        <WeekSelector compact />
      </div>

      <div className="space-y-4">
        {byDay.map((d) => (
          <div key={d.key}>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">{d.label}</p>
            <div className="space-y-2">
              {d.items.map((shift) => {
                const avail = getEffectiveAvailability(currentEmployee.id, weekStart, shift.templateId, baseUnavailableSet, exceptions);
                return (
                  <button key={shift.id} onClick={() => requestToggle(shift)} className="w-full flex items-center justify-between bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 hover:border-indigo-300">
                    <div className="text-left">
                      <p className="text-sm font-medium text-slate-800">{shift.name}</p>
                      <p className="text-xs text-slate-400 ro-tnum">{shift.start}\u2013{shift.end}</p>
                    </div>
                    {avail.source === "exception" ? (
                      <Badge tone="orange">{avail.status === "AVAILABLE" ? "Available" : "Unavailable"} \u00b7 Exception</Badge>
                    ) : avail.status === "AVAILABLE" ? (
                      <Badge tone="green">Available</Badge>
                    ) : (
                      <Badge tone="grey">Unavailable</Badge>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <Modal open={!!pending} onClose={() => setPending(null)} title="How should this change apply?">
        {pending && (
          <div className="space-y-2">
            <button onClick={() => applyChange("week")} className="w-full text-left border border-slate-200 rounded-lg px-3.5 py-3 hover:border-indigo-300">
              <p className="text-sm font-medium text-slate-800">This week only</p>
              <p className="text-xs text-slate-500 mt-0.5">This change only applies to the week of {weekLabel(weekStart)}.</p>
            </button>
            <button onClick={() => applyChange("ongoing")} className="w-full text-left border border-slate-200 rounded-lg px-3.5 py-3 hover:border-indigo-300">
              <p className="text-sm font-medium text-slate-800">From now onward</p>
              <p className="text-xs text-slate-500 mt-0.5">This becomes your new regular availability.</p>
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}

function EmployeeMyRosterPage() {
  const { currentEmployee, weekStart, shiftTemplates, weeklyOverrides, rostersByWeek } = useApp();
  const shifts = useMemo(() => getShiftInstances(weekStart, shiftTemplates, weeklyOverrides), [weekStart, shiftTemplates, weeklyOverrides]);
  const roster = rostersByWeek[weekStart];
  const published = roster && roster.status === "PUBLISHED";
  const mine = published ? roster.assignments.filter((a) => a.employeeId === currentEmployee.id).map((a) => shifts.find((s) => s.id === a.shiftId)).filter(Boolean).sort((a, b) => DAY_ORDER[a.day] - DAY_ORDER[b.day]) : [];
  const totalHours = mine.reduce((s, sh) => s + sh.duration, 0);

  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-1">
        <h1 className="ro-display text-lg font-semibold text-slate-900">My Roster</h1>
        <WeekSelector compact />
      </div>
      <p className="text-sm text-slate-500 mb-4">Week of {weekLabel(weekStart)}</p>

      {!published ? (
        <Card><EmptyState icon={ClipboardList} title="Not published yet" message="Your manager hasn't published this week's roster. Check back soon." /></Card>
      ) : mine.length === 0 ? (
        <Card><EmptyState icon={Calendar} title="No shifts this week" message="You aren't rostered on for the week of this schedule." /></Card>
      ) : (
        <>
          <div className="space-y-2.5 mb-4">
            {mine.map((shift) => (
              <Card key={shift.id} className="!p-3.5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-400">{shift.dayLabel}</p>
                  <p className="text-sm font-semibold text-slate-800">{shift.name}</p>
                  <p className="text-xs text-slate-500 ro-tnum mt-0.5">{shift.start}\u2013{shift.end}</p>
                </div>
                <Badge tone="blue">{fmtHours(shift.duration)}</Badge>
              </Card>
            ))}
          </div>
          <Card className="!py-3.5 flex items-center justify-between">
            <span className="text-sm text-slate-600">{mine.length} shift{mine.length > 1 ? "s" : ""} \u00b7 {fmtHours(totalHours)}</span>
            <Badge tone="green">Published</Badge>
          </Card>
        </>
      )}
    </div>
  );
}

function EmployeeProfilePage() {
  const { currentEmployee, skills } = useApp();
  if (!currentEmployee) return null;
  return (
    <div className="p-5">
      <h1 className="ro-display text-lg font-semibold text-slate-900 mb-4">Profile</h1>
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold">{currentEmployee.name.split(" ").map((n) => n[0]).join("")}</div>
          <div>
            <p className="font-semibold text-slate-800">{currentEmployee.name}</p>
            <p className="text-xs text-slate-400">{currentEmployee.email}</p>
          </div>
        </div>
        <div className="space-y-2.5 text-sm">
          <div className="flex justify-between"><span className="text-slate-500">Skills</span><div className="flex gap-1">{currentEmployee.skills.map((sid) => <Badge key={sid} tone="grey">{skillName(skills, sid)}</Badge>)}</div></div>
          <div className="flex justify-between"><span className="text-slate-500">Hourly Rate</span><span className="font-medium text-slate-800 ro-tnum">${currentEmployee.hourlyRate}/hr</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Max Weekly Hours</span><span className="font-medium text-slate-800 ro-tnum">{currentEmployee.maxWeeklyHours}h</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Status</span><Badge tone="green">Active</Badge></div>
        </div>
      </Card>
      <p className="text-xs text-slate-400 mt-4">Contact your manager to update your rate, hours, or skills.</p>
    </div>
  );
}

/* =========================================================================
   ROOT APP
   ========================================================================= */
export default function App() {
  const [topView, setTopView] = useState("login"); // login | manager | employee | shared
  const [currentUser, setCurrentUser] = useState(null); // {role, employeeId}
  const [managerPage, setManagerPage] = useState("dashboard");
  const [employeePage, setEmployeePage] = useState("availability");
  const [weekStart, setWeekStart] = useState(DEMO_WEEK);

  const [employees, setEmployees] = useState(EMPLOYEES_SEED);
  const [skills, setSkills] = useState(SKILLS_SEED);
  const [shiftTemplates, setShiftTemplates] = useState(SHIFT_TEMPLATES_SEED);
  const [weeklyOverrides, setWeeklyOverrides] = useState(WEEKLY_OVERRIDES_SEED);
  const [baseUnavailableSet, setBaseUnavailableSet] = useState(() => new Set(BASE_UNAVAILABLE_SEED.map(([e, t]) => `${e}|${t}`)));
  const [exceptions, setExceptions] = useState(WEEKLY_EXCEPTIONS_SEED);
  const [rostersByWeek, setRostersByWeek] = useState({});

  const currentEmployee = currentUser?.role === "employee" ? employees.find((e) => e.id === currentUser.employeeId) : null;

  const ctx = {
    topView, setTopView, currentUser, setCurrentUser, managerPage, setManagerPage, employeePage, setEmployeePage,
    weekStart, setWeekStart, employees, setEmployees, skills, setSkills, shiftTemplates, setShiftTemplates,
    weeklyOverrides, setWeeklyOverrides, baseUnavailableSet, setBaseUnavailableSet, exceptions, setExceptions,
    rostersByWeek, setRostersByWeek, currentEmployee,
  };

  let body;
  if (topView === "login") body = <LoginPage />;
  else if (topView === "shared") body = <SharedRosterView />;
  else if (topView === "manager") {
    const pages = { dashboard: Dashboard, employees: EmployeesPage, availability: AvailabilityOverviewPage, shifts: ShiftsPage, roster: RosterPage, settings: SettingsPage };
    const Page = pages[managerPage] || Dashboard;
    body = <ManagerLayout><Page /></ManagerLayout>;
  } else if (topView === "employee") {
    const pages = { availability: EmployeeAvailabilityPage, weekly: EmployeeWeeklyChangesPage, roster: EmployeeMyRosterPage, profile: EmployeeProfilePage };
    const Page = pages[employeePage] || EmployeeAvailabilityPage;
    body = <EmployeeLayout><Page /></EmployeeLayout>;
  }

  return (
    <AppCtx.Provider value={ctx}>
      <GlobalStyles />
      {body}
    </AppCtx.Provider>
  );
}
