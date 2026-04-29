'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  Plus, Search, FileText, Clock, CheckCircle2, Calendar,
  Bold, Italic, Heading1, Heading2, List, ListOrdered, Link2, Image as ImageIcon,
  Eye, Monitor, Smartphone, Save, Send, Trash2, X,
} from 'lucide-react';
import { articles as initialArticles, categories, type Article, type ArticleStatus } from '@/lib/mock-data/articles';
import { formatDate, slugify, truncate } from '@/lib/utils';

const statusConfig: Record<ArticleStatus, { label: string; icon: React.ReactNode; badge: string }> = {
  draft: { label: 'Draft', icon: <FileText size={16} />, badge: 'badge-neutral' },
  published: { label: 'Published', icon: <CheckCircle2 size={16} />, badge: 'badge-success' },
  scheduled: { label: 'Scheduled', icon: <Clock size={16} />, badge: 'badge-info' },
};

export default function CMSPage() {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [selectedId, setSelectedId] = useState<string>(initialArticles[0].id);
  const [filterStatus, setFilterStatus] = useState<ArticleStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'idle'>('idle');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile' | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const selected = articles.find((a) => a.id === selectedId) || articles[0];

  const filteredArticles = articles.filter((a) => {
    if (filterStatus !== 'all' && a.status !== filterStatus) return false;
    if (searchQuery && !a.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Autosave simulation
  const autoSaveTimeout = useRef<NodeJS.Timeout | null>(null);
  const handleFieldChange = useCallback((field: keyof Article, value: string | string[]) => {
    setArticles((prev) =>
      prev.map((a) =>
        a.id === selectedId
          ? { ...a, [field]: value, updatedAt: new Date().toISOString() }
          : a
      )
    );
    setAutoSaveStatus('saving');
    if (autoSaveTimeout.current) clearTimeout(autoSaveTimeout.current);
    autoSaveTimeout.current = setTimeout(() => setAutoSaveStatus('saved'), 1200);
  }, [selectedId]);

  const handleContentChange = useCallback(() => {
    if (editorRef.current) {
      handleFieldChange('content', editorRef.current.innerHTML);
    }
  }, [handleFieldChange]);

  // Sync editor content when article changes
  useEffect(() => {
    if (editorRef.current && selected) {
      editorRef.current.innerHTML = selected.content;
    }
  }, [selectedId]); // eslint-disable-line react-hooks/exhaustive-deps

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleContentChange();
  };

  const handlePublish = () => {
    handleFieldChange('status', 'published');
    handleFieldChange('publishedAt', new Date().toISOString());
  };

  const handleDelete = () => {
    setArticles((prev) => prev.filter((a) => a.id !== selectedId));
    setSelectedId(articles[0].id === selectedId ? articles[1]?.id || '' : articles[0].id);
  };

  const handleNewArticle = () => {
    const newArticle: Article = {
      id: Date.now().toString(),
      title: 'Untitled Article',
      slug: 'untitled-article',
      content: '<p>Start writing your article here...</p>',
      excerpt: '',
      status: 'draft',
      category: categories[0],
      tags: [],
      seoTitle: '',
      metaDescription: '',
      featuredImage: '',
      author: 'Emily Rodriguez',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: null,
      scheduledAt: null,
    };
    setArticles((prev) => [newArticle, ...prev]);
    setSelectedId(newArticle.id);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 4 }}>Insights CMS</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            Create, edit, and publish articles
            {autoSaveStatus === 'saving' && <span style={{ color: 'var(--warning)', marginLeft: 12 }}>● Saving...</span>}
            {autoSaveStatus === 'saved' && <span style={{ color: 'var(--brand-cyan)', marginLeft: 12 }}>✓ Saved</span>}
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleNewArticle}>
          <Plus size={18} /> New Article
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr 300px', gap: 0, border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--bg-secondary)', minHeight: 'calc(100vh - 200px)' }}>
        {/* Left: Article List */}
        <div style={{ borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
          {/* Search */}
          <div style={{ padding: 12, borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
              <input
                className="input"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: 32, fontSize: 13, height: 36 }}
              />
            </div>
          </div>

          {/* Status Filters */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)' }}>
            {(['all', 'draft', 'published', 'scheduled'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                style={{
                  flex: 1, padding: '10px 0', fontSize: 12, fontWeight: 500,
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  color: filterStatus === status ? 'var(--brand-cyan)' : 'var(--text-tertiary)',
                  borderBottom: filterStatus === status ? '2px solid var(--brand-cyan)' : '2px solid transparent',
                  transition: 'all var(--transition-fast)',
                  fontFamily: 'inherit',
                  textTransform: 'capitalize',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <span style={{ textTransform: 'capitalize' }}>{status === 'all' ? 'All' : status}</span>
                  <span style={{ 
                    fontSize: 10, 
                    fontWeight: 500, 
                    color: filterStatus === status ? 'var(--brand-cyan)' : 'var(--text-tertiary)',
                    opacity: filterStatus === status ? 1 : 0.6
                  }}>
                    {status === 'all' ? articles.length : articles.filter(a => a.status === status).length}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Article List */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filteredArticles.length === 0 ? (
              <div style={{ padding: 24, textAlign: 'center' }}>
                <FileText size={32} style={{ color: 'var(--text-tertiary)', marginBottom: 8 }} />
                <div style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>No articles found</div>
              </div>
            ) : (
              filteredArticles.map((article) => (
                <button
                  key={article.id}
                  onClick={() => setSelectedId(article.id)}
                  style={{
                    display: 'block', width: '100%', padding: '14px 16px', textAlign: 'left',
                    background: article.id === selectedId ? 'var(--bg-tertiary)' : 'transparent',
                    border: 'none', borderBottom: '1px solid var(--border-color)',
                    cursor: 'pointer', transition: 'background var(--transition-fast)',
                    borderLeft: article.id === selectedId ? '3px solid var(--brand-cyan)' : '3px solid transparent',
                    fontFamily: 'inherit',
                  }}
                  onMouseEnter={(e) => {
                    if (article.id !== selectedId) e.currentTarget.style.background = 'var(--bg-tertiary)';
                  }}
                  onMouseLeave={(e) => {
                    if (article.id !== selectedId) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 4, lineHeight: 1.3, letterSpacing: '-0.04em' }}>
                    {truncate(article.title, 50)}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className={`badge ${statusConfig[article.status].badge}`} style={{ fontSize: 11 }}>
                      {statusConfig[article.status].label}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
                      {formatDate(article.updatedAt)}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Center: Editor */}
        <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border-color)' }}>
          {/* Title */}
          <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-color)' }}>
            <input
              type="text"
              value={selected.title}
              onChange={(e) => {
                handleFieldChange('title', e.target.value);
                handleFieldChange('slug', slugify(e.target.value));
              }}
              style={{
                width: '100%', background: 'transparent', border: 'none', outline: 'none',
                fontSize: 20, fontWeight: 500, color: 'var(--text-primary)', fontFamily: 'inherit',
              }}
              placeholder="Article title..."
            />
          </div>

          {/* Toolbar */}
          <div style={{ display: 'flex', gap: 2, padding: '8px 16px', borderBottom: '1px solid var(--border-color)', flexWrap: 'wrap' }}>
            {[
              { icon: <Bold size={16} />, cmd: 'bold' },
              { icon: <Italic size={16} />, cmd: 'italic' },
              { icon: <Heading1 size={16} />, cmd: 'formatBlock', val: 'h1' },
              { icon: <Heading2 size={16} />, cmd: 'formatBlock', val: 'h2' },
              { icon: <List size={16} />, cmd: 'insertUnorderedList' },
              { icon: <ListOrdered size={16} />, cmd: 'insertOrderedList' },
              { icon: <Link2 size={16} />, cmd: 'createLink', val: 'https://' },
            ].map((tool, i) => (
              <button
                key={i}
                onClick={() => execCommand(tool.cmd, tool.val)}
                className="btn btn-ghost btn-sm"
                style={{ padding: '6px 8px' }}
              >
                {tool.icon}
              </button>
            ))}
            <div style={{ flex: 1 }} />
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setPreviewMode(previewMode ? null : 'desktop')}
              style={{ display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <Eye size={16} />
              Preview
            </button>
          </div>

          {/* Editor */}
          <div style={{ flex: 1, overflow: 'auto' }}>
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              onInput={handleContentChange}
              style={{
                minHeight: '100%',
                padding: '24px 28px',
                fontSize: 15,
                lineHeight: 1.7,
                color: 'var(--text-primary)',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Right: SEO & Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          {/* Status */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
              Publish Controls
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => handleFieldChange('status', 'draft')}>
                <Save size={14} /> Draft
              </button>
              <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={handlePublish}>
                <Send size={14} /> Publish
              </button>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => handleFieldChange('status', 'scheduled')}>
                <Calendar size={14} /> Schedule
              </button>
              <button className="btn btn-danger btn-sm" style={{ flex: 1 }} onClick={handleDelete}>
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>

          {/* SEO */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
              SEO
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>SEO Title</label>
              <input className="input" value={selected.seoTitle} onChange={(e) => handleFieldChange('seoTitle', e.target.value)} style={{ fontSize: 13, height: 36 }} placeholder="SEO title..." />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Meta Description</label>
              <textarea className="textarea" value={selected.metaDescription} onChange={(e) => handleFieldChange('metaDescription', e.target.value)} style={{ fontSize: 13, minHeight: 60 }} placeholder="Meta description..." />
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Slug</label>
              <input className="input" value={selected.slug} onChange={(e) => handleFieldChange('slug', e.target.value)} style={{ fontSize: 13, height: 36, fontFamily: 'monospace' }} />
            </div>
          </div>

          {/* Category & Tags */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
              Taxonomy
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Category</label>
              <select className="select" value={selected.category} onChange={(e) => handleFieldChange('category', e.target.value)} style={{ width: '100%', fontSize: 13, height: 36 }}>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Tags</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                {selected.tags.map((tag) => (
                  <span key={tag} className="badge badge-neutral" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                    {tag}
                    <X
                      size={12}
                      onClick={() => handleFieldChange('tags', selected.tags.filter((t) => t !== tag))}
                    />
                  </span>
                ))}
              </div>
              <input
                className="input"
                placeholder="Add tag and press Enter..."
                style={{ fontSize: 13, height: 36 }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    handleFieldChange('tags', [...selected.tags, e.currentTarget.value.trim()]);
                    e.currentTarget.value = '';
                  }
                }}
              />
            </div>
          </div>

          {/* Featured Image */}
          <div style={{ padding: '16px 20px' }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
              Featured Image
            </div>
            <div
              style={{
                height: 120,
                borderRadius: 'var(--radius-md)',
                border: '2px dashed var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: 8,
                cursor: 'pointer',
                transition: 'border-color var(--transition-fast)',
                background: 'var(--bg-tertiary)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--brand-cyan)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; }}
            >
              <ImageIcon size={24} style={{ color: 'var(--text-tertiary)' }} />
              <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Click to upload</span>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {previewMode && (
        <div className="overlay" onClick={() => setPreviewMode(null)}>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-xl)', width: previewMode === 'mobile' ? 400 : '80%',
              maxWidth: previewMode === 'mobile' ? 400 : 900, maxHeight: '85vh',
              overflow: 'auto', animation: 'fadeInScale 0.3s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: 15, fontWeight: 500, color: 'var(--text-primary)' }}>Preview</h3>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className={`btn btn-sm ${previewMode === 'desktop' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setPreviewMode('desktop')}>
                  <Monitor size={16} />
                </button>
                <button className={`btn btn-sm ${previewMode === 'mobile' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setPreviewMode('mobile')}>
                  <Smartphone size={16} />
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => setPreviewMode(null)}>
                  <X size={16} />
                </button>
              </div>
            </div>
            <div style={{ padding: '32px 40px' }}>
              <h1 style={{ fontSize: 28, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 16 }}>{selected.title}</h1>
              <div style={{ display: 'flex', gap: 12, marginBottom: 24, fontSize: 13, color: 'var(--text-secondary)' }}>
                <span>{selected.author}</span>
                <span>•</span>
                <span>{formatDate(selected.updatedAt)}</span>
                <span>•</span>
                <span className={`badge ${statusConfig[selected.status].badge}`}>{statusConfig[selected.status].label}</span>
              </div>
              <div
                dangerouslySetInnerHTML={{ __html: selected.content }}
                style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--text-primary)' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
