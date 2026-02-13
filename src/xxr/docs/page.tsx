import { useState, useEffect, useMemo, useCallback } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const docModules = import.meta.glob('/src/xxr/docs/**/*.md', { query: '?raw', import: 'default' }) as Record<string, () => Promise<string>>
const rootReadme = () => import('/README.md?raw').then((m) => m.default as string)

const slugFromPath = (path: string): string =>
  path.replace('/src/xxr/docs/', '').replace(/\.md$/, '')

const docEntries = Object.keys(docModules).map((path) => ({
  slug: slugFromPath(path),
  loader: docModules[path],
}))

const sidebarSections = [
  { heading: 'Getting Started', items: ['getting-started', 'concepts', 'architecture'] },
  { heading: 'Core', items: ['xxr', 'scene', 'assets'] },
  { heading: '3D Content', items: ['model', 'hero', 'floor'] },
  { heading: 'UI & Interactions', items: ['panel', 'interactions', 'navigation'] },
  {
    heading: 'Advanced',
    items: ['background-types', 'error-handling', 'performance', 'devtools', 'stress-test', 'plugins', 'lifecycle'],
  },
  { heading: 'Reference', items: ['api-reference', 'examples', 'known-issues'] },
]

const labelFromSlug = (slug: string): string =>
  slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

const useIsMobile = (breakpoint = 768) => {
  const [mobile, setMobile] = useState(() => window.innerWidth < breakpoint)
  useEffect(() => {
    const onResize = () => setMobile(window.innerWidth < breakpoint)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [breakpoint])
  return mobile
}

const styles = {
  layout: {
    display: 'flex',
    height: '100%',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    color: '#e0e0e0',
    background: '#0d0d1a',
    position: 'relative',
  } as React.CSSProperties,
  sidebar: (open: boolean, mobile: boolean) =>
    ({
      width: mobile ? '100%' : 260,
      minWidth: mobile ? undefined : 260,
      maxWidth: mobile ? 300 : undefined,
      borderRight: mobile ? 'none' : '1px solid rgba(255,255,255,0.08)',
      padding: '24px 0',
      overflowY: 'auto',
      background: mobile ? '#0a0a16' : 'rgba(0,0,0,0.2)',
      ...(mobile
        ? {
            position: 'fixed' as const,
            top: 0,
            left: 0,
            bottom: 0,
            zIndex: 100,
            transform: open ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.25s ease',
            boxShadow: open ? '4px 0 24px rgba(0,0,0,0.5)' : 'none',
          }
        : {}),
    }) as React.CSSProperties,
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    zIndex: 99,
  } as React.CSSProperties,
  scrollArea: {
    flex: 1,
    overflowY: 'auto',
    minWidth: 0,
  } as React.CSSProperties,
  article: (mobile: boolean) =>
    ({
      maxWidth: 860,
      margin: '0 auto',
      padding: mobile ? '20px 20px 48px' : '32px 48px 48px',
      width: '100%',
    }) as React.CSSProperties,
  sidebarHeading: {
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
    color: 'rgba(255,255,255,0.35)',
    padding: '16px 24px 6px',
    margin: 0,
  } as React.CSSProperties,
  sidebarLink: (active: boolean) =>
    ({
      display: 'block',
      padding: '6px 24px 6px 32px',
      fontSize: 14,
      color: active ? '#4fc3f7' : 'rgba(255,255,255,0.65)',
      background: active ? 'rgba(79,195,247,0.08)' : 'transparent',
      textDecoration: 'none',
      borderLeft: active ? '2px solid #4fc3f7' : '2px solid transparent',
      transition: 'all 0.15s',
    }) as React.CSSProperties,
  topBar: (mobile: boolean) =>
    ({
      display: 'flex',
      alignItems: 'center',
      gap: mobile ? 10 : 16,
      marginBottom: mobile ? 20 : 32,
      paddingBottom: 16,
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      flexWrap: 'wrap',
    }) as React.CSSProperties,
  backLink: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    textDecoration: 'none',
    padding: '4px 12px',
    borderRadius: 6,
    border: '1px solid rgba(255,255,255,0.12)',
    transition: 'all 0.15s',
  } as React.CSSProperties,
  menuBtn: {
    padding: '4px 10px',
    borderRadius: 6,
    border: '1px solid rgba(255,255,255,0.15)',
    background: 'transparent',
    color: '#e0e0e0',
    fontSize: 18,
    cursor: 'pointer',
    lineHeight: 1,
  } as React.CSSProperties,
}

const markdownComponents = {
  a: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    if (href?.startsWith('./') && href.endsWith('.md')) {
      const slug = href.replace('./', '').replace(/\.md$/, '')
      return <Link to={`/xxr/docs/${slug}`} {...props}>{children}</Link>
    }
    return <a href={href} {...props}>{children}</a>
  },
  h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 style={{ fontSize: 32, fontWeight: 700, margin: '0 0 16px', color: '#fff' }} {...props}>{children}</h1>
  ),
  h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 style={{ fontSize: 22, fontWeight: 600, margin: '32px 0 12px', color: '#fff' }} {...props}>{children}</h2>
  ),
  h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 style={{ fontSize: 17, fontWeight: 600, margin: '24px 0 8px', color: '#e0e0e0' }} {...props}>{children}</h3>
  ),
  p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p style={{ lineHeight: 1.7, margin: '0 0 16px', color: 'rgba(255,255,255,0.78)' }} {...props}>{children}</p>
  ),
  code: ({ children, className, ...props }: React.HTMLAttributes<HTMLElement>) => {
    const isBlock = className?.startsWith('language-')
    if (isBlock) {
      return (
        <code
          className={className}
          style={{
            display: 'block',
            background: 'rgba(0,0,0,0.4)',
            borderRadius: 8,
            padding: '16px 20px',
            fontSize: 13,
            lineHeight: 1.6,
            overflowX: 'auto',
            margin: '0 0 16px',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
          {...props}
        >
          {children}
        </code>
      )
    }
    return (
      <code
        style={{
          background: 'rgba(79,195,247,0.1)',
          padding: '2px 6px',
          borderRadius: 4,
          fontSize: '0.9em',
          color: '#4fc3f7',
        }}
        {...props}
      >
        {children}
      </code>
    )
  },
  pre: ({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
    <pre style={{ margin: 0 }} {...props}>{children}</pre>
  ),
  table: ({ children, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <table
      style={{
        width: '100%',
        borderCollapse: 'collapse',
        margin: '16px 0',
        fontSize: 14,
      }}
      {...props}
    >
      {children}
    </table>
  ),
  th: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      style={{
        textAlign: 'left',
        padding: '10px 12px',
        borderBottom: '2px solid rgba(255,255,255,0.12)',
        fontWeight: 600,
        color: '#fff',
      }}
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td
      style={{
        padding: '8px 12px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
      {...props}
    >
      {children}
    </td>
  ),
  ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul style={{ margin: '0 0 16px', paddingLeft: 24, lineHeight: 1.7 }} {...props}>{children}</ul>
  ),
  ol: ({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol style={{ margin: '0 0 16px', paddingLeft: 24, lineHeight: 1.7 }} {...props}>{children}</ol>
  ),
  li: ({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li style={{ margin: '4px 0', color: 'rgba(255,255,255,0.78)' }} {...props}>{children}</li>
  ),
  blockquote: ({ children, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      style={{
        borderLeft: '3px solid #4fc3f7',
        margin: '16px 0',
        padding: '8px 16px',
        background: 'rgba(79,195,247,0.05)',
        borderRadius: '0 6px 6px 0',
      }}
      {...props}
    >
      {children}
    </blockquote>
  ),
  hr: (props: React.HTMLAttributes<HTMLHRElement>) => (
    <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)', margin: '24px 0' }} {...props} />
  ),
}

const useDocContent = (slug: string | undefined) => {
  const [content, setContent] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const load = slug
      ? docEntries.find((e) => e.slug === slug)?.loader
      : rootReadme

    if (!load) {
      setContent(null)
      setLoading(false)
      return
    }

    load().then((text) => {
      setContent(text)
      setLoading(false)
    })
  }, [slug])

  return { content, loading }
}

const Sidebar = ({
  activeSlug,
  open,
  mobile,
  onNavigate,
}: {
  activeSlug: string | undefined
  open: boolean
  mobile: boolean
  onNavigate: () => void
}) => (
  <nav style={styles.sidebar(open, mobile)}>
    <Link to="/xxr/docs" style={styles.sidebarLink(!activeSlug)} onClick={onNavigate}>
      Overview
    </Link>
    {sidebarSections.map((section) => (
      <div key={section.heading}>
        <p style={styles.sidebarHeading}>{section.heading}</p>
        {section.items.map((s) => (
          <Link key={s} to={`/xxr/docs/${s}`} style={styles.sidebarLink(activeSlug === s)} onClick={onNavigate}>
            {labelFromSlug(s)}
          </Link>
        ))}
      </div>
    ))}
  </nav>
)

export const DocsPage = () => {
  const { slug } = useParams<{ slug: string }>()
  const { content, loading } = useDocContent(slug)
  const navigate = useNavigate()
  const mobile = useIsMobile()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const closeSidebar = useCallback(() => setSidebarOpen(false), [])

  useEffect(() => {
    setSidebarOpen(false)
  }, [slug])

  const components = useMemo(() => markdownComponents, [])

  const topBarEl = (
    <div style={styles.topBar(mobile)}>
      {mobile && (
        <button style={styles.menuBtn} onClick={() => setSidebarOpen(true)} aria-label="Open menu">
          ☰
        </button>
      )}
      <Link to="/xxr" style={styles.backLink}>
        ← XXR Home
      </Link>
      <Link to="/" style={styles.backLink}>
        ← App Home
      </Link>
      <span style={{ fontSize: 13, opacity: 0.35 }}>XXR Documentation</span>
    </div>
  )

  const inner = loading ? (
    <p style={{ opacity: 0.5 }}>Loading...</p>
  ) : !content ? (
    <>
      <h1 style={{ fontSize: 32, margin: '0 0 16px' }}>404</h1>
      <p style={{ opacity: 0.6, marginBottom: 24 }}>
        Document &ldquo;{slug}&rdquo; not found
      </p>
      <button
        onClick={() => navigate('/xxr/docs')}
        style={{
          padding: '8px 20px',
          borderRadius: 6,
          border: '1px solid rgba(255,255,255,0.2)',
          background: 'transparent',
          color: '#fff',
          cursor: 'pointer',
        }}
      >
        Back to Docs
      </button>
    </>
  ) : (
    <Markdown remarkPlugins={[remarkGfm]} components={components}>
      {content}
    </Markdown>
  )

  return (
    <div style={styles.layout}>
      {mobile && sidebarOpen && <div style={styles.overlay} onClick={closeSidebar} />}
      <Sidebar activeSlug={slug} open={sidebarOpen} mobile={mobile} onNavigate={closeSidebar} />
      <div style={styles.scrollArea}>
        <div style={styles.article(mobile)}>
          {topBarEl}
          {inner}
        </div>
      </div>
    </div>
  )
}
