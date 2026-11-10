import React from 'react';
import { IncidentSeverity, ServiceStatus } from '../types';

export const SEV: Record<IncidentSeverity, { t: string; c: string }> = {
  P1_CRITICAL: { t: 'P1', c: 'bg-down text-black' },
  P2_MAJOR: { t: 'P2', c: 'bg-amber text-black' },
  P3_MINOR: { t: 'P3', c: 'border border-amber text-amber' },
  P4_LOW: { t: 'P4', c: 'border border-mute text-mute' },
};
export const Sev: React.FC<{ s: IncidentSeverity }> = ({ s }) => <span className={`px-1 font-bold text-[11px] ${SEV[s].c}`}>{SEV[s].t}</span>;

export const STAT: Record<ServiceStatus, { t: string; c: string }> = {
  operational: { t: 'UP', c: 'text-up' },
  degraded: { t: 'DEGR', c: 'text-amber' },
  outage: { t: 'DOWN', c: 'text-down' },
  maintenance: { t: 'MAINT', c: 'text-mute' },
};

export const Pane: React.FC<{ title: string; right?: React.ReactNode; className?: string; bodyClass?: string; children: React.ReactNode }> = ({ title, right, className = '', bodyClass = '', children }) => (
  <section className={`pane ${className}`} aria-label={title}>
    <div className="bar"><span className="truncate">{title}</span>{right && <span className="font-normal normal-case text-white/80 shrink-0">{right}</span>}</div>
    <div className={`flex-1 min-h-0 ${bodyClass}`}>{children}</div>
  </section>
);

/** A value with a coloured change arrow, the way a quote board shows a move. */
export const Delta: React.FC<{ now: number; prev?: number; goodWhenDown?: boolean; digits?: number }> = ({ now, prev, goodWhenDown, digits = 1 }) => {
  if (prev === undefined || prev === now) return <span className="text-mute">  —</span>;
  const up = now > prev;
  const good = goodWhenDown ? !up : up;
  return <span className={good ? 'text-up' : 'text-down'}>{up ? '▲' : '▼'}{Math.abs(now - prev).toFixed(digits)}</span>;
};

export const chartAxis = { stroke: '#2a2a2a', tick: { fill: '#8a8a8a', fontSize: 10, fontFamily: 'Martian Mono' } };
export const chartTip = { contentStyle: { background: '#000', border: '1px solid #ffa028', borderRadius: 0, fontFamily: 'Martian Mono', fontSize: 11, color: '#f2f2f2' }, labelStyle: { color: '#ffa028' } };
