'use client';

import React, { useState, useEffect } from 'react';
import { mockService } from '@/lib/mock/mockService';
import { JournalEntry, JournalPrivacy } from '@/types';
import { REFLECTION_PROMPTS, COMMON_EMOTIONS } from '@/lib/mock/constants';
import { SharePermissionDialog } from '@/components/common/SharePermissionDialog';
import { Modal } from '@/components/ui/Modal';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import {
  BookOpen,
  Plus,
  Search,
  Lock,
  Eye,
  Trash2,
  Sparkles,
  Check,
  Calendar,
  Tag,
  Shield,
  Clock,
} from 'lucide-react';

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [search, setSearch] = useState('');
  const [privacyFilter, setPrivacyFilter] = useState<'ALL' | 'PRIVATE' | 'SHARED_WITH_COUNSELLOR'>('ALL');

  // Active entry being edited
  const [editingEntry, setEditingEntry] = useState<Partial<JournalEntry> | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [lastAutoSaveTime, setLastAutoSaveTime] = useState<string | null>(null);

  // Sharing dialog state
  const [sharingEntry, setSharingEntry] = useState<JournalEntry | null>(null);

  // Delete modal state
  const [deletingEntry, setDeletingEntry] = useState<JournalEntry | null>(null);

  // Load journals
  const loadJournals = () => {
    const list = mockService.getJournals(search, privacyFilter);
    setEntries(list);
  };

  useEffect(() => {
    loadJournals();
  }, [search, privacyFilter]);

  const handleCreateNew = () => {
    setEditingEntry({
      title: '',
      content: '',
      moodTags: ['Grounded'],
      privacy: 'PRIVATE',
      isDraft: false,
    });
    setIsEditorOpen(true);
    setLastAutoSaveTime(null);
  };

  const handleEdit = (entry: JournalEntry) => {
    setEditingEntry({ ...entry });
    setIsEditorOpen(true);
    setLastAutoSaveTime(null);
  };

  // Simulated auto-save draft
  useEffect(() => {
    if (!isEditorOpen || !editingEntry || !editingEntry.content) return;

    const timer = setTimeout(() => {
      setLastAutoSaveTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 2000);

    return () => clearTimeout(timer);
  }, [editingEntry?.content, editingEntry?.title, isEditorOpen]);

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEntry || !editingEntry.title?.trim() || !editingEntry.content?.trim()) return;

    mockService.saveJournal({
      id: editingEntry.id,
      title: editingEntry.title,
      content: editingEntry.content,
      moodTags: editingEntry.moodTags || [],
      privacy: editingEntry.privacy || 'PRIVATE',
      isDraft: false,
    });

    setIsEditorOpen(false);
    setEditingEntry(null);
    loadJournals();
  };

  const handleDeleteConfirm = () => {
    if (deletingEntry) {
      mockService.deleteJournal(deletingEntry.id);
      setDeletingEntry(null);
      if (editingEntry?.id === deletingEntry.id) {
        setIsEditorOpen(false);
        setEditingEntry(null);
      }
      loadJournals();
    }
  };

  const handleShareConfirmed = () => {
    if (sharingEntry) {
      mockService.saveJournal({
        ...sharingEntry,
        privacy: 'SHARED_WITH_COUNSELLOR',
      });
      setSharingEntry(null);
      loadJournals();
    }
  };

  const insertPrompt = (prompt: string) => {
    if (!editingEntry) return;
    const currentText = editingEntry.content || '';
    const newText = currentText ? `${currentText}\n\nPrompt: ${prompt}\n` : `Prompt: ${prompt}\n`;
    setEditingEntry({ ...editingEntry, content: newText });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-border/70">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Private Wellness Journal</h1>
          <p className="text-xs md:text-sm text-foreground-secondary mt-0.5">
            Encrypted, reflective thoughts. Private by default unless you choose to share.
          </p>
        </div>

        <Button
          variant="sage"
          size="md"
          onClick={handleCreateNew}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          New Reflection
        </Button>
      </div>

      {/* Search & Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
          <input
            type="text"
            placeholder="Search titles, tags, or notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-surface border border-border rounded-lg text-xs md:text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-sage transition-colors"
          />
        </div>

        {/* Privacy Pills */}
        <div className="flex items-center gap-1.5 bg-surface p-1 rounded-lg border border-border w-full sm:w-auto">
          {[
            { id: 'ALL', label: 'All Entries' },
            { id: 'PRIVATE', label: 'Private Only' },
            { id: 'SHARED_WITH_COUNSELLOR', label: 'Shared' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setPrivacyFilter(tab.id as any)}
              className={`px-3 py-1.5 text-xs rounded-md transition-all ${
                privacyFilter === tab.id
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'text-foreground-secondary hover:text-foreground hover:bg-surface-elevated'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Entries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {entries.length === 0 ? (
          <div className="col-span-full py-12 text-center p-8 bg-surface rounded-xl border border-border space-y-3">
            <BookOpen className="w-8 h-8 text-foreground-muted mx-auto opacity-60" />
            <h3 className="text-base font-semibold text-foreground">No entries found</h3>
            <p className="text-xs text-foreground-secondary max-w-sm mx-auto">
              You haven't written any reflections matching this filter. Writing helps quiet busy minds.
            </p>
            <Button variant="sage" size="sm" onClick={handleCreateNew}>
              Create your first entry
            </Button>
          </div>
        ) : (
          entries.map((entry) => {
            const isShared = entry.privacy === 'SHARED_WITH_COUNSELLOR';

            return (
              <Card
                key={entry.id}
                variant="interactive"
                onClick={() => handleEdit(entry)}
                className="flex flex-col justify-between space-y-4 group"
              >
                <div>
                  {/* Card Header: Privacy Badge & Date */}
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-border/50">
                    <span className="flex items-center gap-1 text-[11px] text-foreground-muted">
                      <Calendar className="w-3 h-3" />
                      {new Date(entry.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border ${
                        isShared
                          ? 'bg-sage-tint text-sage border-sage/40 font-medium'
                          : 'bg-surface-elevated text-foreground-secondary border-border'
                      }`}
                    >
                      {isShared ? <Eye className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                      <span>{isShared ? 'Shared with Counsellor' : 'Private'}</span>
                    </span>
                  </div>

                  {/* Title & Excerpt */}
                  <div className="mt-3 space-y-1.5">
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-sage transition-colors line-clamp-1">
                      {entry.title}
                    </h3>
                    <p className="text-xs text-foreground-secondary line-clamp-3 leading-relaxed">
                      {entry.content}
                    </p>
                  </div>
                </div>

                {/* Footer: Tags & Actions */}
                <div className="pt-2 border-t border-border/50 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {entry.moodTags.map((tag) => (
                      <Chip key={tag} size="sm" variant="secondary">
                        {tag}
                      </Chip>
                    ))}
                  </div>

                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    {!isShared && (
                      <button
                        type="button"
                        onClick={() => setSharingEntry(entry)}
                        title="Share with Ms. Henderson"
                        className="p-1.5 text-foreground-secondary hover:text-sage transition-colors rounded hover:bg-surface-elevated"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setDeletingEntry(entry)}
                      title="Delete entry"
                      className="p-1.5 text-foreground-secondary hover:text-coral transition-colors rounded hover:bg-surface-elevated"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Journal Entry Editor Modal */}
      <Modal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        maxWidth="2xl"
        title={
          <div className="flex items-center justify-between w-full pr-6">
            <span>{editingEntry?.id ? 'Edit Reflection' : 'New Journal Reflection'}</span>
            {lastAutoSaveTime && (
              <span className="text-[11px] text-foreground-muted font-normal flex items-center gap-1">
                <Check className="w-3 h-3 text-sage" /> Auto-saved {lastAutoSaveTime}
              </span>
            )}
          </div>
        }
      >
        {editingEntry && (
          <form onSubmit={handleSaveEntry} className="space-y-4">
            {/* Title */}
            <div>
              <label className="text-xs uppercase tracking-wider text-foreground-secondary font-semibold block mb-1">
                Title
              </label>
              <input
                type="text"
                required
                value={editingEntry.title || ''}
                onChange={(e) => setEditingEntry({ ...editingEntry, title: e.target.value })}
                placeholder="Give this reflection a gentle title..."
                className="w-full px-3.5 py-2.5 bg-surface-elevated border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-sage"
              />
            </div>

            {/* Reflection Prompts Bar */}
            <div className="p-3 bg-surface-elevated/50 rounded-lg border border-border space-y-1.5">
              <span className="text-[11px] font-semibold text-foreground-secondary flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-calm-amber" /> Optional Prompts for Inspiration:
              </span>
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {REFLECTION_PROMPTS.slice(0, 3).map((p, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => insertPrompt(p)}
                    className="shrink-0 text-[11px] bg-surface border border-border px-2.5 py-1 rounded text-foreground-secondary hover:text-foreground hover:border-sage transition-colors text-left"
                  >
                    + "{p.slice(0, 48)}..."
                  </button>
                ))}
              </div>
            </div>

            {/* Content Textarea */}
            <div>
              <label className="text-xs uppercase tracking-wider text-foreground-secondary font-semibold block mb-1">
                Your Thoughts
              </label>
              <textarea
                required
                rows={9}
                value={editingEntry.content || ''}
                onChange={(e) => setEditingEntry({ ...editingEntry, content: e.target.value })}
                placeholder="Write freely. No one else can read this unless you explicitly choose to share."
                className="w-full p-3.5 bg-surface-elevated border border-border rounded-lg text-xs md:text-sm text-foreground focus:outline-none focus:border-sage resize-none leading-relaxed"
              />
            </div>

            {/* Privacy Setting & Mood Tags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground-secondary block">
                  Privacy Level
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingEntry({ ...editingEntry, privacy: 'PRIVATE' })}
                    className={`flex-1 p-2 rounded-lg border text-xs flex items-center justify-center gap-1.5 transition-all ${
                      editingEntry.privacy === 'PRIVATE'
                        ? 'bg-surface-elevated border-sage text-foreground font-semibold shadow-soft'
                        : 'border-border text-foreground-secondary hover:text-foreground'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5 text-sage" />
                    <span>Private to me</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingEntry({ ...editingEntry, privacy: 'SHARED_WITH_COUNSELLOR' })}
                    className={`flex-1 p-2 rounded-lg border text-xs flex items-center justify-center gap-1.5 transition-all ${
                      editingEntry.privacy === 'SHARED_WITH_COUNSELLOR'
                        ? 'bg-sage-tint border-sage text-sage font-semibold shadow-soft'
                        : 'border-border text-foreground-secondary hover:text-foreground'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5 text-sage" />
                    <span>Share with Counsellor</span>
                  </button>
                </div>
              </div>

              {/* Quick Tags */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground-secondary block">
                  Tags (Optional)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {['Calm', 'Anxious', 'Hopeful', 'Art', 'School', 'Family'].map((tag) => {
                    const selected = editingEntry.moodTags?.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          const currentTags = editingEntry.moodTags || [];
                          const updated = selected
                            ? currentTags.filter((t) => t !== tag)
                            : [...currentTags, tag];
                          setEditingEntry({ ...editingEntry, moodTags: updated });
                        }}
                        className={`text-[11px] px-2.5 py-1 rounded-full border transition-all ${
                          selected
                            ? 'bg-slate-900 text-white border-slate-900 font-semibold shadow-xs'
                            : 'bg-surface border-border text-foreground-secondary hover:text-foreground'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-4 border-t border-border flex items-center justify-between">
              {editingEntry.id ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeletingEntry(editingEntry as JournalEntry)}
                  leftIcon={<Trash2 className="w-4 h-4 text-coral" />}
                  className="text-coral hover:bg-coral-tint"
                >
                  Delete Entry
                </Button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setIsEditorOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="sage" size="md">
                  Save Reflection
                </Button>
              </div>
            </div>
          </form>
        )}
      </Modal>

      {/* Share Permission Dialog */}
      {sharingEntry && (
        <SharePermissionDialog
          isOpen={true}
          entryTitle={sharingEntry.title}
          onClose={() => setSharingEntry(null)}
          onConfirmShare={handleShareConfirmed}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingEntry && (
        <Modal
          isOpen={true}
          onClose={() => setDeletingEntry(null)}
          maxWidth="sm"
          title="Delete reflection permanently?"
          description="Are you sure you want to delete this journal entry? This action cannot be undone."
        >
          <div className="space-y-4">
            <p className="text-xs text-foreground-secondary">
              Entry: <strong className="text-foreground">"{deletingEntry.title}"</strong>
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <Button variant="ghost" size="sm" onClick={() => setDeletingEntry(null)}>
                Cancel
              </Button>
              <Button variant="coral" size="sm" onClick={handleDeleteConfirm}>
                Yes, Delete Reflection
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
