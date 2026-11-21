import './TabBar.css'

const ICONS = {
  today: <path d="M12 3c3.5 4.6 6 8 6 11a6 6 0 0 1-12 0c0-3 2.5-6.4 6-11z" />,
  calendar: (
    <>
      <rect x="4" y="5" width="16" height="15" rx="3" />
      <path d="M4 10h16M9 3v4M15 3v4" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
    </>
  ),
}

export default function TabBar({ tabs, current, onChange }) {
  return (
    <nav className="tabs">
      {tabs.map((tab) => (
        <button key={tab.id} className={tab.id === current ? 'tab tab-current' : 'tab'} onClick={() => onChange(tab.id)} aria-current={tab.id === current ? 'page' : undefined}>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {ICONS[tab.id]}
          </svg>
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}
