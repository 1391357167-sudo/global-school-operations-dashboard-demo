type IconName =
  | 'overview'
  | 'users'
  | 'teach'
  | 'student'
  | 'course'
  | 'growth'
  | 'finance'
  | 'database'
  | 'report'
  | 'bell'
  | 'settings'
  | 'refresh'
  | 'send'
  | 'spark'
  | 'filter'
  | 'download'

const paths: Record<IconName, React.ReactNode> = {
  overview: <><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10.5V20h13v-9.5"/><path d="M9.5 20v-6h5v6"/></>,
  users: <><circle cx="9" cy="8" r="3"/><path d="M3.5 20v-2.5A4.5 4.5 0 0 1 8 13h2a4.5 4.5 0 0 1 4.5 4.5V20"/><path d="M16 5.5a3 3 0 0 1 0 5.5M17 13.5a4 4 0 0 1 3.5 4V20"/></>,
  teach: <><path d="M4 6h16v11H4z"/><path d="M8 21h8M12 17v4"/><path d="m8 12 2-2 2 1 4-3"/></>,
  student: <><circle cx="12" cy="8" r="3.5"/><path d="M5 21a7 7 0 0 1 14 0"/></>,
  course: <><path d="M5 3h12a2 2 0 0 1 2 2v15H7a2 2 0 0 1-2-2z"/><path d="M7 16h12M9 7h6M9 11h5"/></>,
  growth: <><path d="M4 19V5M4 19h16"/><path d="m7 15 4-4 3 2 5-7"/></>,
  finance: <><circle cx="12" cy="12" r="9"/><path d="M8.5 9.5h7M8.5 14.5h7M12 7v10"/></>,
  database: <><ellipse cx="12" cy="5" rx="7" ry="3"/><path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5"/><path d="M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/></>,
  report: <><path d="M6 3h9l3 3v15H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/></>,
  bell: <><path d="M6 17h12l-1.5-2v-4a4.5 4.5 0 0 0-9 0v4z"/><path d="M10 20h4"/></>,
  settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z"/></>,
  refresh: <><path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/></>,
  send: <><path d="m3 11 18-8-8 18-2-8z"/><path d="m11 13 5-5"/></>,
  spark: <><path d="m12 2 1.7 5.3L19 9l-5.3 1.7L12 16l-1.7-5.3L5 9l5.3-1.7z"/><path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7z"/></>,
  filter: <><path d="M4 5h16l-6 7v6l-4 2v-8z"/></>,
  download: <><path d="M12 3v12M7.5 10.5 12 15l4.5-4.5M4 20h16"/></>,
}

export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}
