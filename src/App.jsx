import { useCallback, useEffect, useMemo, useState } from 'react'
import { Activity, ArrowDown, ArrowDownUp, ArrowRight, ArrowUp, ArrowUpRight, Building2, Check, ChevronDown, CircleHelp, Clock3, Command, Download, Ellipsis, LayoutDashboard, LoaderCircle, LogOut, Mail, MoreHorizontal, Plus, Search, Settings2, ShieldCheck, SlidersHorizontal, Sparkles, Users, X } from 'lucide-react'
import { hasSupabaseConfig, supabase } from './supabase.js'

const CLIENT_ACCESS_EMAIL = 'richardgereholliwod@gmail.com'

function Avatar({ name, index = 0, small = false }) {
  const colors = ['blue', 'peach', 'lavender', 'mint', 'rose']
  const initials = name?.trim().split(/\s+/).slice(0, 2).map(word => word[0]).join('').toUpperCase() || '?'
  return <span className={`avatar avatar--${colors[index % colors.length]}${small ? ' avatar--small' : ''}`}>{initials}</span>
}

function App() {
  const [session, setSession] = useState(undefined), [authEmail, setAuthEmail] = useState(CLIENT_ACCESS_EMAIL), [emailSent, setEmailSent] = useState(false), [authBusy, setAuthBusy] = useState(false), [authError, setAuthError] = useState('')
  const [clients, setClients] = useState([]), [loading, setLoading] = useState(true), [error, setError] = useState('')
  const [query, setQuery] = useState(''), [sort, setSort] = useState('id'), [ascending, setAscending] = useState(true), [copied, setCopied] = useState(null)
  const loadClients = useCallback(async () => {
    if (!hasSupabaseConfig) { setError('Configura VITE_SUPABASE_URL y VITE_SUPABASE_PUBLISHABLE_KEY en .env.local.'); setLoading(false); return }
    if (!session) { setLoading(false); return }
    setLoading(true); setError('')
    const { data, error: queryError } = await supabase.from('cliente').select('id, nombre').order('id', { ascending: true })
    if (queryError) { setError(queryError.message); setClients([]) } else setClients(data ?? [])
    setLoading(false)
  }, [session])
  useEffect(() => {
    if (!hasSupabaseConfig) { setSession(null); return }
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession))
    return () => subscription.unsubscribe()
  }, [])
  useEffect(() => { if (session) loadClients() }, [loadClients, session])
  const visible = useMemo(() => {
    const term = query.trim().toLocaleLowerCase('es')
    return [...clients].filter(c => String(c.nombre ?? '').toLocaleLowerCase('es').includes(term) || String(c.id).includes(term)).sort((a, b) => {
      const x = a[sort] ?? '', y = b[sort] ?? ''
      return (typeof x === 'number' ? x - y : String(x).localeCompare(String(y), 'es')) * (ascending ? 1 : -1)
    })
  }, [clients, query, sort, ascending])
  function sortBy(key) { if (sort === key) setAscending(value => !value); else { setSort(key); setAscending(true) } }
  function exportCsv() {
    const csv = ['id,nombre', ...visible.map(c => `${c.id},"${String(c.nombre ?? '').replaceAll('"', '""')}"`)].join('\n')
    const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8' })); link.download = 'clientes.csv'; link.click(); URL.revokeObjectURL(link.href)
  }
  const sortIcon = key => sort === key ? ascending ? <ArrowUp size={12}/> : <ArrowDown size={12}/> : <ArrowDownUp size={12}/>
  async function sendSignInLink(event) {
    event.preventDefault()
    setAuthError('')
    const email = authEmail.trim().toLocaleLowerCase('en')
    if (!hasSupabaseConfig || !supabase) {
      setAuthError('Falta configurar la conexión a Supabase. Revisa las variables VITE_SUPABASE_URL y VITE_SUPABASE_PUBLISHABLE_KEY.')
      return
    }
    if (email !== CLIENT_ACCESS_EMAIL) {
      setAuthError(`El acceso está reservado para ${CLIENT_ACCESS_EMAIL}.`)
      return
    }
    setAuthBusy(true)
    try {
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: true, emailRedirectTo: window.location.href },
      })
      if (signInError) setAuthError(signInError.message)
      else setEmailSent(true)
    } catch (signInError) {
      setAuthError(signInError instanceof Error ? signInError.message : 'No se pudo solicitar el enlace de acceso.')
    } finally {
      setAuthBusy(false)
    }
  }
  if (session === undefined) return <div className="auth-screen"><LoaderCircle size={22} className="spin"/></div>
  if (!session) return <main className="auth-screen"><section className="auth-card"><a className="brand auth-brand" href="#inicio"><span className="brand-mark"><i/><i/><i/><i/></span><span>lumen<span className="accent">.</span></span></a><span className="auth-symbol"><ShieldCheck size={22}/></span><h1>Accede a tus clientes<span className="accent">.</span></h1><p>Usa el correo autorizado. En el primer acceso crearemos tu cuenta al confirmar el enlace.</p>{emailSent ? <div className="auth-success"><Mail size={19}/><strong>Revisa tu correo</strong><span>Enviamos un enlace de acceso a {authEmail.trim()}. Confírmalo para entrar a tu directorio.</span></div> : <form onSubmit={sendSignIn}><label htmlFor="access-email">CORREO ELECTRÓNICO</label><input id="access-email" type="email" autoComplete="email" placeholder="tu@correo.com" value={authEmail} onChange={event => setAuthEmail(event.target.value)} required/><button className="button button-primary auth-submit" type="submit" disabled={authBusy}>{authBusy ? <LoaderCircle size={15} className="spin"/> : <Mail size={15}/>}Enviar enlace de acceso</button>{authError && <p className="auth-error">{authError}</p>}</form>}<div className="auth-foot"><ShieldCheck size={13}/> Acceso protegido por Supabase</div></section></main>
  return <div className="app-shell">
    <aside className="sidebar">
      <a className="brand" href="#inicio"><span className="brand-mark"><i/><i/><i/><i/></span><span>lumen<span className="accent">.</span></span></a>
      <button className="workspace"><span className="workspace-icon">A</span><span className="workspace-copy"><strong>Acme Studio</strong><small>Espacio de trabajo</small></span><ChevronDown size={15}/></button>
      <p className="nav-label">ESPACIO DE TRABAJO</p>
      <nav className="nav-list" aria-label="Navegación"><a className="nav-link" href="#resumen"><LayoutDashboard/><span>Resumen</span></a><a className="nav-link active" href="#clientes" aria-current="page"><Users/><span>Clientes</span><small className="nav-count">{clients.length}</small></a><a className="nav-link" href="#actividad"><Activity/><span>Actividad</span><i className="nav-dot"/></a><a className="nav-link" href="#empresas"><Building2/><span>Empresas</span></a></nav>
      <p className="nav-label preferences">PREFERENCIAS</p><nav className="nav-list"><a className="nav-link" href="#ajustes"><Settings2/><span>Ajustes</span></a><a className="nav-link" href="#ayuda"><CircleHelp/><span>Centro de ayuda</span></a></nav>
      <div className="sidebar-spacer"/><div className="connection-card"><span className="connection-icon"><Sparkles size={16}/></span><strong>Todo en orden ✨</strong><p>Tu espacio está conectado y al día.</p><small><i/>Conectado a Supabase</small></div>
      <button className="profile"><Avatar name="Richard Gere" index={2} small/><span className="profile-copy"><strong>Richard Gere</strong><small>Administrador</small></span><MoreHorizontal size={17}/></button>
    </aside>
    <main className="main-content"><header className="topbar"><div className="breadcrumbs"><span>Espacio de trabajo</span><b>/</b><strong>Clientes</strong></div><div className="topbar-right"><span className="sync-status"><i/>{loading ? 'Consultando datos' : error ? 'Error de conexión' : 'Supabase conectado'}</span><span className="divider"/><button className="help-link"><CircleHelp size={16}/>Ayuda</button></div></header>
      <div className="page"><section className="page-heading"><div><div className="eyebrow"><span><Users size={13}/></span>TU RED, EN UN SOLO LUGAR</div><h1>Clientes<span className="accent">.</span></h1><p>Conoce, organiza y cuida cada una de tus relaciones.</p></div><div className="heading-buttons"><button className="button button-soft" onClick={loadClients} disabled={loading}><LoaderCircle className={loading ? 'spin' : ''} size={15}/>{loading ? 'Actualizando' : 'Actualizar'}</button><button className="button button-soft" onClick={() => supabase.auth.signOut()}><LogOut size={15}/>Cerrar sesión</button></div></section>
        <section className="stats" aria-label="Resumen de clientes"><article className="stat-card"><div className="stat-top"><span className="stat-icon indigo"><Users size={17}/></span><span className="stat-label">DIRECTORIO</span><Ellipsis className="stat-more" size={18}/></div><div className="stat-value">{loading ? '···' : clients.length}<span> contactos</span></div><div className="stat-note"><span className="note-icon"><ArrowUpRight size={13}/></span>Personas en tu cartera</div><svg className="sparkline" viewBox="0 0 152 28" fill="none" aria-hidden="true"><path d="M1 23C13 23 14 19 26 20S41 24 52 17s12-9 23-7 15 5 25-1S117 6 126 11s13 1 25-9" stroke="#8496f7" strokeWidth="1.7"/></svg></article>
          <article className="stat-card"><div className="stat-top"><span className="stat-icon green"><ShieldCheck size={17}/></span><span className="stat-label">ESTADO DE LA BASE</span><Ellipsis className="stat-more" size={18}/></div><div className="stat-value text-value">{error ? 'Revisar' : 'En orden'}<span className="verified"><Check size={13}/></span></div><div className="stat-note"><i className="online-dot"/>{error ? 'Comprueba tu conexión' : 'Sesión autenticada'}</div><div className="progress"><i/></div></article>
          <article className="stat-card"><div className="stat-top"><span className="stat-icon lilac"><Clock3 size={17}/></span><span className="stat-label">ORIGEN DE LOS DATOS</span><Ellipsis size={18} className="stat-more"/></div><div className="stat-value text-value">Supabase <Activity size={15} className="lilac-text"/></div><div className="stat-note"><span className="note-icon lilac-bg"><ArrowDown size={12}/></span>Consulta segura de la tabla cliente</div></article></section>
        <section className="directory"><div className="directory-head"><div><div className="title-line"><h2>Directorio</h2><span className="total-pill">{clients.length}</span></div><p>Todos tus contactos, con su información al día.</p></div><button className="icon-button" aria-label="Filtros"><SlidersHorizontal size={16}/></button></div>
          <div className="toolbar"><label className="search"><Search size={16}/><input aria-label="Buscar clientes" placeholder="Buscar por nombre o ID…" value={query} onChange={e => setQuery(e.target.value)}/>{query && <button aria-label="Limpiar búsqueda" onClick={() => setQuery('')}><X size={14}/></button>}<span className="shortcut"><Command size={11}/> K</span></label><div className="toolbar-actions"><span>{query ? <><strong>{visible.length}</strong> resultado{visible.length === 1 ? '' : 's'}</> : <>Mostrando <strong>{clients.length ? 'todos' : '0'}</strong> los clientes</>}</span><button className="export-button" onClick={exportCsv}><Download size={14}/>Exportar</button></div></div>
          <div className="table-wrap"><table><thead><tr><th className="check-cell"><input type="checkbox" disabled aria-label="Seleccionar todos"/></th><th><button className="sort" onClick={() => sortBy('nombre')}>CLIENTE {sortIcon('nombre')}</button></th><th><button className="sort" onClick={() => sortBy('id')}>ID {sortIcon('id')}</button></th><th className="status-head">ESTADO</th><th className="action-cell"/></tr></thead><tbody>
            {loading ? <tr><td colSpan="5"><div className="table-message"><LoaderCircle className="spin" size={21}/>Cargando tu directorio…</div></td></tr> : error ? <tr><td colSpan="5"><div className="empty"><span className="empty-icon"><CircleHelp size={21}/></span><strong>No pudimos cargar los clientes</strong><p>{error} Comprueba también los permisos de lectura de la tabla <code>cliente</code> en Supabase.</p><button className="button button-soft" onClick={loadClients}>Reintentar</button></div></td></tr> : visible.length === 0 ? <tr><td colSpan="5"><div className="empty"><span className="empty-icon"><Users size={21}/></span><strong>{query ? 'No encontramos coincidencias' : 'Tu directorio está listo'}</strong><p>{query ? 'Prueba con otro nombre o ID.' : 'Los clientes de tu tabla aparecerán aquí.'}</p>{query && <button className="button button-soft" onClick={() => setQuery('')}>Limpiar búsqueda</button>}</div></td></tr> : visible.map((client, index) => <tr className="client-row" key={client.id}><td className="check-cell"><input type="checkbox" aria-label={`Seleccionar a ${client.nombre}`}/></td><td><div className="client"><Avatar name={client.nombre} index={index}/><span className="client-copy"><strong>{client.nombre}</strong><small>Cliente registrado</small></span></div></td><td><button className="id-chip" title="Copiar ID" onClick={async () => { try { await navigator.clipboard.writeText(String(client.id)); setCopied(client.id); setTimeout(() => setCopied(null), 1400) } catch {} }}><span>#</span>{client.id}{copied === client.id && <Check size={12}/>}</button></td><td><span className="badge">Registrado</span></td><td className="action-cell"><button className="row-more" aria-label={`Más opciones para ${client.nombre}`}><Ellipsis size={18}/></button></td></tr>)}</tbody></table></div>
          <div className="table-footer"><span><i className="footer-check"><Check size={11}/></i>{loading ? 'Sincronizando datos' : error ? 'Revisa la conexión' : `Mostrando ${query ? `${visible.length} de ` : 'los '}${clients.length} ${clients.length === 1 ? 'cliente' : 'clientes'}`}<span className="footer-divider">·</span><ShieldCheck size={13} className="security-icon"/>Datos protegidos</span><div className="pagination"><button disabled aria-label="Página anterior"><ArrowRight className="previous" size={14}/></button><span>1</span><button disabled aria-label="Página siguiente"><ArrowRight size={14}/></button></div></div>
        </section><footer className="page-footer"><span>© 2026 Lumen Studio</span><span>·</span><span>Hecho para construir mejores relaciones.</span><a href="#privacidad">Privacidad <ArrowUpRight size={11}/></a></footer>
      </div>
    </main>
  </div>
}

export default App
