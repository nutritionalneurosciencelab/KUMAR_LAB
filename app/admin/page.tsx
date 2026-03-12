'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Tab = 'team' | 'publications' | 'news';

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('team');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);

  const isConfigured = !!supabase;

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setSessionEmail(data.session?.user?.email ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSessionEmail(sess?.user?.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const signedIn = !!sessionEmail;

  const tabs = useMemo(
    () =>
      [
        { id: 'team' as const, label: 'Team' },
        { id: 'publications' as const, label: 'Publications' },
        { id: 'news' as const, label: 'News' }
      ] as const,
    []
  );

  const signIn = async () => {
    if (!supabase) return;
    setStatus(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setStatus(error.message);
    else setStatus('Signed in.');
  };

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  };

  return (
    <main className="page" style={{ paddingTop: 40, paddingBottom: 80 }}>
      <div className="section" style={{ borderBottom: 'none', paddingTop: 20 }}>
        <div className="section-eyebrow">Admin</div>
        <div className="section-heading">Content editor</div>

        {!isConfigured ? (
          <div className="section-body">
            <p style={{ color: 'crimson' }}>
              Supabase is not configured. Set{' '}
              <code>NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
              <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.
            </p>
          </div>
        ) : !signedIn ? (
          <div className="section-body" style={{ maxWidth: 520 }}>
            <p style={{ marginBottom: 14, color: 'var(--muted)' }}>
              Sign in with your admin account (Supabase Auth). Writes are protected by RLS
              and require <code>app_metadata.role = &quot;admin&quot;</code>.
            </p>
            <div style={{ display: 'grid', gap: 10 }}>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                style={{
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: '1px solid var(--border)'
                }}
              />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                type="password"
                style={{
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: '1px solid var(--border)'
                }}
              />
              <button
                onClick={signIn}
                style={{
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: '1px solid var(--navy)',
                  background: 'var(--navy)',
                  color: 'white',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Sign in
              </button>
              {status ? <div style={{ fontSize: 13, color: 'var(--muted)' }}>{status}</div> : null}
            </div>
          </div>
        ) : (
          <>
            <div className="section-body" style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ color: 'var(--muted)', fontSize: 14 }}>
                  Signed in as <strong>{sessionEmail}</strong>
                </span>
                <button
                  onClick={signOut}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 8,
                    border: '1px solid var(--border)',
                    background: 'white',
                    cursor: 'pointer'
                  }}
                >
                  Sign out
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 999,
                    border: '1px solid var(--border)',
                    background: tab === t.id ? 'var(--navy)' : 'white',
                    color: tab === t.id ? 'white' : 'var(--muted)',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    fontSize: 11,
                    cursor: 'pointer'
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {tab === 'team' ? <TeamAdmin /> : null}
            {tab === 'publications' ? <PublicationsAdmin /> : null}
            {tab === 'news' ? <NewsAdmin /> : null}
          </>
        )}
      </div>
    </main>
  );
}

function TeamAdmin() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [fellowship, setFellowship] = useState('');
  const [photoPath, setPhotoPath] = useState('');

  const refresh = async () => {
    if (!supabase) return;
    setLoading(true);
    setErr(null);
    const res = await supabase
      .from('team_members')
      .select('*')
      .order('display_order', { ascending: true });
    setLoading(false);
    if (res.error) setErr(res.error.message);
    else setRows(res.data ?? []);
  };

  useEffect(() => {
    void refresh();
  }, []);

  const add = async () => {
    if (!supabase) return;
    setErr(null);
    const { error } = await supabase.from('team_members').insert({
      name,
      role,
      fellowship: fellowship || null,
      photo_path: photoPath || null,
      links: [],
      display_order: rows.length
    });
    if (error) setErr(error.message);
    else {
      setName('');
      setRole('');
      setFellowship('');
      setPhotoPath('');
      await refresh();
    }
  };

  const toggleActive = async (id: string, active: boolean) => {
    if (!supabase) return;
    const { error } = await supabase.from('team_members').update({ active }).eq('id', id);
    if (error) setErr(error.message);
    else await refresh();
  };

  const remove = async (id: string) => {
    if (!supabase) return;
    const { error } = await supabase.from('team_members').delete().eq('id', id);
    if (error) setErr(error.message);
    else await refresh();
  };

  return (
    <div className="section-body">
      <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, marginBottom: 8 }}>
        Add team member
      </h3>
      <div style={{ display: 'grid', gap: 10, maxWidth: 720 }}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Role (e.g., Research Scholar)" />
        <input value={fellowship} onChange={(e) => setFellowship(e.target.value)} placeholder="Fellowship (optional)" />
        <input value={photoPath} onChange={(e) => setPhotoPath(e.target.value)} placeholder="Photo path (e.g., /team_babita.jpeg)" />
        <button onClick={add}>Add</button>
      </div>

      {err ? <p style={{ color: 'crimson', marginTop: 12 }}>{err}</p> : null}
      {loading ? <p style={{ color: 'var(--muted)', marginTop: 12 }}>Loading…</p> : null}

      <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, marginTop: 26, marginBottom: 8 }}>
        Current team
      </h3>
      <div style={{ display: 'grid', gap: 10 }}>
        {rows.map((r) => (
          <div
            key={r.id}
            style={{
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: 12,
              display: 'flex',
              justifyContent: 'space-between',
              gap: 12,
              flexWrap: 'wrap'
            }}
          >
            <div style={{ minWidth: 260 }}>
              <strong>{r.name}</strong> <span style={{ color: 'var(--muted)' }}>— {r.role}</span>
              {r.fellowship ? <div style={{ color: 'var(--muted)', fontSize: 13 }}>{r.fellowship}</div> : null}
              {r.photo_path ? <div style={{ color: 'var(--muted)', fontSize: 13 }}>{r.photo_path}</div> : null}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => toggleActive(r.id, !r.active)}>{r.active ? 'Disable' : 'Enable'}</button>
              <button onClick={() => remove(r.id)} style={{ color: 'crimson' }}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PublicationsAdmin() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [year, setYear] = useState('2026');
  const [title, setTitle] = useState('');
  const [authors, setAuthors] = useState('');
  const [journal, setJournal] = useState('');
  const [details, setDetails] = useState('');
  const [tags, setTags] = useState('');

  const refresh = async () => {
    if (!supabase) return;
    setLoading(true);
    setErr(null);
    const res = await supabase
      .from('publications')
      .select('*')
      .order('year', { ascending: false })
      .order('display_order', { ascending: true });
    setLoading(false);
    if (res.error) setErr(res.error.message);
    else setRows(res.data ?? []);
  };

  useEffect(() => {
    void refresh();
  }, []);

  const add = async () => {
    if (!supabase) return;
    setErr(null);
    const tagsArr = tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    const { error } = await supabase.from('publications').insert({
      year: parseInt(year, 10),
      title,
      authors: authors || null,
      journal: journal || null,
      details: details || null,
      tags: tagsArr,
      display_order: 0
    });
    if (error) setErr(error.message);
    else {
      setTitle('');
      setAuthors('');
      setJournal('');
      setDetails('');
      setTags('');
      await refresh();
    }
  };

  const remove = async (id: string) => {
    if (!supabase) return;
    const { error } = await supabase.from('publications').delete().eq('id', id);
    if (error) setErr(error.message);
    else await refresh();
  };

  return (
    <div className="section-body">
      <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, marginBottom: 8 }}>
        Add publication
      </h3>
      <div style={{ display: 'grid', gap: 10, maxWidth: 720 }}>
        <input value={year} onChange={(e) => setYear(e.target.value)} placeholder="Year (e.g., 2025)" />
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        <input value={authors} onChange={(e) => setAuthors(e.target.value)} placeholder="Authors (optional)" />
        <input value={journal} onChange={(e) => setJournal(e.target.value)} placeholder="Journal (optional)" />
        <input value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Details (PMID/DOI/etc.) (optional)" />
        <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Tags comma-separated (optional)" />
        <button onClick={add}>Add</button>
      </div>

      {err ? <p style={{ color: 'crimson', marginTop: 12 }}>{err}</p> : null}
      {loading ? <p style={{ color: 'var(--muted)', marginTop: 12 }}>Loading…</p> : null}

      <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, marginTop: 26, marginBottom: 8 }}>
        Current publications
      </h3>
      <div style={{ display: 'grid', gap: 10 }}>
        {rows.map((r) => (
          <div key={r.id} style={{ border: '1px solid var(--border)', borderRadius: 10, padding: 12 }}>
            <div>
              <strong>{r.year}</strong> — {r.title}
            </div>
            {Array.isArray(r.tags) && r.tags.length ? (
              <div style={{ color: 'var(--muted)', fontSize: 13 }}>Tags: {r.tags.join(', ')}</div>
            ) : null}
            <div style={{ marginTop: 8 }}>
              <button onClick={() => remove(r.id)} style={{ color: 'crimson' }}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NewsAdmin() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [title, setTitle] = useState('');
  const [badge, setBadge] = useState('');
  const [body, setBody] = useState('');

  const refresh = async () => {
    if (!supabase) return;
    setLoading(true);
    setErr(null);
    const res = await supabase
      .from('news_items')
      .select('*')
      .order('date', { ascending: false })
      .order('display_order', { ascending: true });
    setLoading(false);
    if (res.error) setErr(res.error.message);
    else setRows(res.data ?? []);
  };

  useEffect(() => {
    void refresh();
  }, []);

  const add = async () => {
    if (!supabase) return;
    setErr(null);
    const { error } = await supabase.from('news_items').insert({
      date,
      title,
      badge: badge || null,
      body,
      images: [],
      links: [],
      people: [],
      display_order: 0
    });
    if (error) setErr(error.message);
    else {
      setTitle('');
      setBadge('');
      setBody('');
      await refresh();
    }
  };

  const remove = async (id: string) => {
    if (!supabase) return;
    const { error } = await supabase.from('news_items').delete().eq('id', id);
    if (error) setErr(error.message);
    else await refresh();
  };

  return (
    <div className="section-body">
      <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, marginBottom: 8 }}>
        Add news item
      </h3>
      <div style={{ display: 'grid', gap: 10, maxWidth: 720 }}>
        <input value={date} onChange={(e) => setDate(e.target.value)} placeholder="Date (YYYY-MM-DD)" />
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        <input value={badge} onChange={(e) => setBadge(e.target.value)} placeholder="Badge (optional, e.g., Conference)" />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Body (supports new lines)"
          rows={6}
          style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)' }}
        />
        <button onClick={add}>Add</button>
      </div>

      {err ? <p style={{ color: 'crimson', marginTop: 12 }}>{err}</p> : null}
      {loading ? <p style={{ color: 'var(--muted)', marginTop: 12 }}>Loading…</p> : null}

      <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, marginTop: 26, marginBottom: 8 }}>
        Current news
      </h3>
      <div style={{ display: 'grid', gap: 10 }}>
        {rows.map((r) => (
          <div key={r.id} style={{ border: '1px solid var(--border)', borderRadius: 10, padding: 12 }}>
            <div>
              <strong>{r.date}</strong> — {r.title}
            </div>
            {r.badge ? <div style={{ color: 'var(--muted)', fontSize: 13 }}>Badge: {r.badge}</div> : null}
            <div style={{ marginTop: 8 }}>
              <button onClick={() => remove(r.id)} style={{ color: 'crimson' }}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

