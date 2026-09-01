"use client";

import { CalendarDays } from "lucide-react";
import { useState, type ReactNode } from "react";

type DateRangePickerProps = { label: string; value: string; onChange: (value: string) => void; onPresentChange?: (present: boolean) => void; present?: boolean; required?: boolean };
type MonthPickerProps = { label: string; value: string; onChange: (value: string) => void; required?: boolean };
type YearPickerProps = { label: string; value: string; onChange: (value: string) => void };

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const weekdayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function yearOptions(value?: number) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1979 + 7 }, (_, index) => 1980 + index);
  return value && !years.includes(value) ? [value, ...years] : years;
}

function formatMonth(value: string) {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(value)) return "";
  const [year, month] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(new Date(year, month - 1, 1));
}

function parseMonth(value: string) {
  if (/^\d{4}-(0[1-9]|1[0-2])$/.test(value)) return value;
  if (!/^(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+\d{4}$/i.test(value.trim())) return "";
  const parsed = new Date(`${value} 1`);
  return Number.isNaN(parsed.getTime()) ? "" : `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}`;
}

function parseRange(value: string) {
  const [start = "", end = ""] = value.split(/\s+[—–-]\s+/, 2);
  return { start: parseMonth(start), end: /^(present|current)$/i.test(end.trim()) ? "" : parseMonth(end), present: /^(present|current)$/i.test(end.trim()) };
}

function CalendarPanel({ children, onClear }: { children: ReactNode; onClear: () => void }) {
  return <div className="studio-calendar-popover" role="dialog" aria-label="Calendar picker"><div className="studio-calendar-heading"><span>Select a date</span><button type="button" onClick={onClear}>Clear</button></div>{children}</div>;
}

function CalendarButton({ value, label, disabled, children }: { value: string; label: string; disabled?: boolean; children: (setOpen: (open: boolean) => void) => ReactNode }) {
  const [open, setOpen] = useState(false);
  return <div className="studio-calendar-input"><button type="button" disabled={disabled} onClick={() => setOpen(!open)} className="studio-calendar-value" aria-haspopup="dialog" aria-expanded={open}><span>{value || `Choose ${label}`}</span><CalendarDays size={17} /></button>{open ? children(setOpen) : null}</div>;
}

function MonthInput({ value, onChange, required, disabled, label }: { value: string; onChange: (value: string) => void; required?: boolean; disabled?: boolean; label: string }) {
  const initial = value ? value.split("-").map(Number) : [new Date().getFullYear(), new Date().getMonth() + 1];
  const [year, setYear] = useState(initial[0]);
  const [month, setMonth] = useState(initial[1]);
  return <CalendarButton value={formatMonth(value)} label={label} disabled={disabled}>{(setOpen) => <CalendarPanel onClear={() => { onChange(""); setOpen(false); }}><div className="studio-calendar-selects"><select value={year} onChange={(event) => setYear(Number(event.target.value))}>{yearOptions(year).map((option) => <option key={option}>{option}</option>)}</select></div><div className="studio-month-grid">{monthNames.map((name, index) => <button key={name} type="button" className={month === index + 1 ? "is-selected" : ""} onClick={() => { setMonth(index + 1); onChange(`${year}-${String(index + 1).padStart(2, "0")}`); setOpen(false); }}>{name.slice(0, 3)}</button>)}</div>{required && !value ? <input className="sr-only" required aria-label={label} /> : null}</CalendarPanel>}</CalendarButton>;
}

export function CalendarDateInput({ value, onChange, disabled, label }: { value: string; onChange: (value: string) => void; disabled?: boolean; label: string }) {
  const selected = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T00:00:00`) : null;
  const initial = selected ?? new Date();
  const [year, setYear] = useState(initial.getFullYear());
  const [month, setMonth] = useState(initial.getMonth());
  const displayValue = selected ? new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" }).format(selected) : "";
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return <CalendarButton value={displayValue} label={label} disabled={disabled}>{(setOpen) => <CalendarPanel onClear={() => { onChange(""); setOpen(false); }}><div className="studio-calendar-selects"><select value={month} onChange={(event) => setMonth(Number(event.target.value))}>{monthNames.map((name, index) => <option key={name} value={index}>{name}</option>)}</select><select value={year} onChange={(event) => setYear(Number(event.target.value))}>{yearOptions(year).map((option) => <option key={option}>{option}</option>)}</select></div><div className="studio-day-grid">{weekdayNames.map((day) => <span key={day}>{day}</span>)}{Array.from({ length: firstDay }, (_, index) => <span key={`blank-${index}`} />)}{Array.from({ length: daysInMonth }, (_, index) => { const day = index + 1; const isoDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`; return <button key={day} type="button" className={value === isoDate ? "is-selected" : ""} onClick={() => { onChange(isoDate); setOpen(false); }}>{day}</button>; })}</div></CalendarPanel>}</CalendarButton>;
}

export function MonthPicker({ label, value, onChange, required }: MonthPickerProps) {
  const [month, setMonth] = useState(() => parseMonth(value));
  return <label className="studio-field"><span className="studio-form-label">{label}{required ? " *" : ""}</span><MonthInput label={label} required={required} value={month} onChange={(nextMonth) => { setMonth(nextMonth); onChange(formatMonth(nextMonth)); }} /><span className="studio-help-text">Use the calendar button to choose a month and year.</span></label>;
}

export function YearPicker({ label, value, onChange }: YearPickerProps) {
  const options = yearOptions(Number(value));
  return <label className="studio-field"><span className="studio-form-label">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="studio-form-select"><option value="">Choose a year</option>{options.map((year) => <option key={year} value={year}>{year}</option>)}</select><span className="studio-help-text">Choose the project year from the list.</span></label>;
}

export function DateRangePicker({ label, value, onChange, onPresentChange, present: controlledPresent, required }: DateRangePickerProps) {
  const initial = parseRange(value);
  const [start, setStart] = useState(initial.start);
  const [end, setEnd] = useState(initial.end);
  const [present, setPresent] = useState(initial.present);
  const isPresent = controlledPresent ?? present;
  function publish(nextStart: string, nextEnd: string, nextPresent: boolean) { onChange([formatMonth(nextStart), nextPresent ? "Present" : formatMonth(nextEnd)].filter(Boolean).join(" – ")); }
  return <div className="studio-field studio-field-wide"><span className="studio-form-label">{label}{required ? " *" : ""}</span>{value && !start && !end ? <span className="studio-help-text">Current saved value: {value}. Choose dates below to replace it.</span> : null}<div className="studio-date-range-picker"><label><span>Start month</span><MonthInput label="start month" required={required && (!value || Boolean(start))} value={start} onChange={(nextStart) => { setStart(nextStart); publish(nextStart, end, isPresent); }} /></label><label><span>End month</span><MonthInput label="end month" disabled={isPresent} value={end} onChange={(nextEnd) => { setEnd(nextEnd); publish(start, nextEnd, isPresent); }} /></label><label className="studio-checkbox-field"><input type="checkbox" checked={isPresent} onChange={(event) => { setPresent(event.target.checked); onPresentChange?.(event.target.checked); publish(start, end, event.target.checked); }} /><span>Present</span></label></div><span className="studio-help-text">Choose months and years from the calendar. Use Present for an ongoing role or chapter.</span></div>;
}
