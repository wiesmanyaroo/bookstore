export default function ResourceSidebar({ resources, activeResource, recordCount, onSelect }) {
  return (
    <aside className="sidebar">
      <a className="wordmark" href="#books" onClick={() => onSelect('books')}>
        <span className="wordmark-mark">P.</span>
        <span>paper &amp; pine<small>BOOKSHOP ADMIN</small></span>
      </a>
      <div className="sidebar-label">CATALOGUE</div>
      <nav className="resource-nav" aria-label="Bookstore data">
        {Object.entries(resources).map(([key, item], index) => (
          <button
            key={key}
            className={activeResource === key ? 'nav-item active' : 'nav-item'}
            onClick={() => onSelect(key)}
          >
            <span className="nav-number">{String(index + 1).padStart(2, '0')}</span>
            <span>{item.label}</span>
            <span className="nav-count">{key === activeResource ? recordCount : ''}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-note">
        <span className="online-dot" />
        <span>Local database<small>SQLite · API connected</small></span>
      </div>
    </aside>
  )
}