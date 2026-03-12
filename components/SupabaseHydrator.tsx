'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

function setHtml(id: string, html: string) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}

function escapeHtml(s: string) {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export default function SupabaseHydrator() {
  useEffect(() => {
    if (!supabase) {
      setHtml(
        'team-content',
        `<p style="color:var(--muted)">Supabase is not configured yet. Set <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.</p>`
      );
      setHtml(
        'pubs-content',
        `<p style="color:var(--muted)">Supabase is not configured yet.</p>`
      );
      setHtml(
        'news-content',
        `<p style="color:var(--muted)">Supabase is not configured yet.</p>`
      );
      return;
    }

    let cancelled = false;
    (async () => {
      setHtml('team-content', `<p style="color:var(--muted)">Loading…</p>`);
      setHtml('pubs-content', `<p style="color:var(--muted)">Loading…</p>`);
      setHtml('news-content', `<p style="color:var(--muted)">Loading…</p>`);

      const [teamRes, pubRes, newsRes] = await Promise.all([
        supabase
          .from('team_members')
          .select('*')
          .eq('active', true)
          .order('display_order', { ascending: true }),
        supabase
          .from('publications')
          .select('*')
          .order('year', { ascending: false })
          .order('display_order', { ascending: true }),
        supabase
          .from('news_items')
          .select('*')
          .order('date', { ascending: false })
          .order('display_order', { ascending: true })
      ]);

      if (cancelled) return;

      if (teamRes.error) {
        setHtml(
          'team-content',
          `<p style="color:crimson">Failed to load team: ${escapeHtml(teamRes.error.message)}</p>`
        );
      } else {
        const cards = (teamRes.data ?? [])
          .map((m: any) => {
            const name = escapeHtml(m.name ?? '');
            const role = escapeHtml(m.role ?? '');
            const fellowship = m.fellowship ? escapeHtml(m.fellowship) : '';
            const photo = m.photo_path ? escapeHtml(m.photo_path) : '';
            const img = photo
              ? `<img src="${photo}" alt="${name}" onerror="this.style.display='none'"/>`
              : '';
            return `
              <div class="mc">
                <div class="mc-photo">${img}<div class="init" style="display:${img ? 'none' : 'flex'}">${escapeHtml(
              name
                .split(' ')
                .map((p: string) => p[0])
                .slice(0, 2)
                .join('')
            )}</div></div>
                <div class="mc-info">
                  <div class="mc-name">${name}</div>
                  <div class="mc-role">${role}</div>
                  ${fellowship ? `<div class="mc-fellowship">${fellowship}</div>` : ''}
                </div>
              </div>
            `;
          })
          .join('');

        setHtml('team-content', `<div class="member-grid">${cards}</div>`);
      }

      if (pubRes.error) {
        setHtml(
          'pubs-content',
          `<p style="color:crimson">Failed to load publications: ${escapeHtml(pubRes.error.message)}</p>`
        );
      } else {
        const pubs = (pubRes.data ?? [])
          .map((p: any) => {
            const year = escapeHtml(String(p.year ?? ''));
            const title = escapeHtml(p.title ?? '');
            const authors = p.authors ? escapeHtml(p.authors) : '';
            const journal = p.journal ? escapeHtml(p.journal) : '';
            const details = p.details ? escapeHtml(p.details) : '';
            const tags = Array.isArray(p.tags)
              ? p.tags.map((t: string) => `<span class="tag">${escapeHtml(t)}</span>`).join('')
              : '';
            return `
              <div class="pub" data-year="${year}">
                <div class="pub-yr">${year}</div>
                <div>
                  <div class="pub-title">${title}</div>
                  ${authors ? `<div class="pub-authors">${authors}</div>` : ''}
                  ${journal ? `<span class="pub-journal">${journal}</span>` : ''}
                  ${details ? `<span class="pub-pmid">${details}</span>` : ''}
                  ${tags ? `<div class="pub-tags">${tags}</div>` : ''}
                </div>
              </div>
            `;
          })
          .join('');
        setHtml('pubs-content', `<div class="pub-list">${pubs}</div>`);
      }

      if (newsRes.error) {
        setHtml(
          'news-content',
          `<p style="color:crimson">Failed to load news: ${escapeHtml(newsRes.error.message)}</p>`
        );
      } else {
        const items = (newsRes.data ?? [])
          .map((n: any) => {
            const date = escapeHtml(String(n.date ?? ''));
            const title = escapeHtml(n.title ?? '');
            const body = escapeHtml(n.body ?? '').replaceAll('\n', '<br/>');
            const badge = n.badge ? escapeHtml(n.badge) : '';
            return `
              <div class="news-card">
                <div class="news-card-body">
                  <div class="news-meta">
                    <span class="news-date">${date}</span>
                    ${badge ? `<span class="news-badge lab">${badge}</span>` : ''}
                  </div>
                  <div class="news-title">${title}</div>
                  <div class="news-body">${body}</div>
                </div>
              </div>
            `;
          })
          .join('');
        setHtml('news-content', `<div class="news-grid">${items}</div>`);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}

