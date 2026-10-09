'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/components/providers/AppProvider';
import { mockService } from '@/lib/mock/mockService';
import { ChatConversation, ChatMessage, SafetyEvent } from '@/types';
import { SafetyPanel } from '@/components/ui/SafetyPanel';
import { BottomSheet } from '@/components/ui/BottomSheet';
import {
  Shield,
  ShieldCheck,
  Send,
  Plus,
  Clock,
  AlertTriangle,
  Sparkles,
  X,
  MessageSquare,
  Activity,
  PanelLeftClose,
  PanelLeft,
  Copy,
  Check,
  Lock,
  ChevronRight,
  Heart,
  Wind,
  Smile,
  BookOpen,
} from 'lucide-react';

type PipelinePhase = 'IDLE' | 'INPUT_SCREENING' | 'LLM_REASONING' | 'OUTPUT_SCREENING' | 'DELIVERY';

const PROMPT_SUGGESTIONS = [
  { label: 'Chemistry test anxiety', query: 'Chemistry test anxiety' },
  { label: 'Feeling left out by friends', query: 'Feeling left out by friends' },
  { label: '4-4-4 Grounding breath', query: 'Can you guide me through a 4-4-4 grounding breathing exercise?' },
  { label: 'Medication question', query: 'How many mg of pills should I take?' },
  { label: 'Test fallback state', query: 'Test offline fallback state' },
];

const STARTER_CARDS = [
  {
    icon: Wind,
    title: 'Grounding breath',
    desc: 'Guide me through a calming 4-4-4 breathing cycle',
    query: 'Can you guide me through a 4-4-4 grounding breathing exercise?',
    color: 'text-teal-600 bg-teal-50 border-teal-100',
  },
  {
    icon: BookOpen,
    title: 'Study & exam stress',
    desc: 'Untangle feeling overwhelmed about tests and deadlines',
    query: 'I have intense anxiety about my chemistry lab midterm tomorrow.',
    color: 'text-blue-600 bg-blue-50 border-blue-100',
  },
  {
    icon: Smile,
    title: 'Social & friendship friction',
    desc: 'Process feeling left out or disconnected from friends',
    query: 'I feel left out by my group of friends and do not know how to handle it.',
    color: 'text-purple-600 bg-purple-50 border-purple-100',
  },
  {
    icon: Heart,
    title: 'Night reflection',
    desc: 'Quiet busy thoughts and wind down for healthy sleep',
    query: 'Help me wind down my racing thoughts so I can sleep better.',
    color: 'text-amber-600 bg-amber-50 border-amber-100',
  },
];

export default function CompanionPage() {
  const { openCrisisModal, currentUser } = useApp();

  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string>('conv_today');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [pipelinePhase, setPipelinePhase] = useState<PipelinePhase>('IDLE');
  const [activeSafetyEvent, setActiveSafetyEvent] = useState<SafetyEvent | undefined>(undefined);
  
  // UI states for clean ergonomics
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSafetyDrawerOpen, setIsSafetyDrawerOpen] = useState(false);
  const [showMobileSafetySheet, setShowMobileSafetySheet] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load conversations on mount
  useEffect(() => {
    const convs = mockService.getConversations();
    setConversations(convs);
    if (convs.length > 0) {
      loadConversation(convs[0].id);
    }
  }, []);

  const loadConversation = (id: string) => {
    setActiveConvId(id);
    const msgs = mockService.getMessages(id);
    setMessages(msgs);
    // Sync safety panel to the last assistant message's safety event
    const lastAssistant = [...msgs].reverse().find((m) => m.role === 'assistant' && m.safetyEvent);
    if (lastAssistant && lastAssistant.safetyEvent) {
      setActiveSafetyEvent(lastAssistant.safetyEvent);
    } else {
      setActiveSafetyEvent(undefined);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, pipelinePhase]);

  const handleNewConversation = () => {
    const newConv = mockService.createNewConversation(
      `Reflection ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    );
    setConversations(mockService.getConversations());
    loadConversation(newConv.id);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const handleOpenSafetyForEvent = (event?: SafetyEvent) => {
    if (!event) return;
    setActiveSafetyEvent(event);
    if (window.innerWidth < 1024) {
      setShowMobileSafetySheet(true);
    } else {
      setIsSafetyDrawerOpen(true);
    }
  };

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isTyping) return;

    setInputValue('');

    // 1. Append user message
    const userMsg: ChatMessage = {
      id: `msg_u_${Date.now()}`,
      conversationId: activeConvId,
      role: 'user',
      content: query,
      timestamp: new Date().toISOString(),
    };
    mockService.addMessage(activeConvId, userMsg);
    setMessages((prev) => [...prev, userMsg]);

    // ==============================================================
    // SAFETY PIPELINE STAGE 1: INPUT SCREENING
    // ==============================================================
    setIsTyping(true);
    setPipelinePhase('INPUT_SCREENING');

    const lowerQuery = query.toLowerCase();
    const isUrgent =
      lowerQuery.includes('die') ||
      lowerQuery.includes('hurt myself') ||
      lowerQuery.includes('end it') ||
      lowerQuery.includes('suicide') ||
      lowerQuery.includes('kill myself');

    // Urgent signal detected on input screening -> immediate crisis support modal
    if (isUrgent) {
      openCrisisModal();
    }

    setTimeout(() => {
      // ==============================================================
      // SAFETY PIPELINE STAGE 2: LLM REASONING & GENERATION
      // ==============================================================
      setPipelinePhase('LLM_REASONING');

      const { reply, safetyEvent } = mockService.generateAiResponse(activeConvId, query);

      const assistantMsgId = `msg_a_${Date.now()}`;
      const assistantMsg: ChatMessage = {
        id: assistantMsgId,
        conversationId: activeConvId,
        role: 'assistant',
        content: '',
        timestamp: new Date().toISOString(),
        isStreaming: true,
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // Stream tokens
      const words = reply.split(' ');
      let currentWordIndex = 0;

      const streamInterval = setInterval(() => {
        currentWordIndex += 1;
        const streamedText = words.slice(0, currentWordIndex).join(' ');

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? {
                  ...m,
                  content: streamedText,
                  isStreaming: currentWordIndex < words.length,
                }
              : m
          )
        );

        if (currentWordIndex >= words.length) {
          clearInterval(streamInterval);

          // ==============================================================
          // SAFETY PIPELINE STAGE 3: OUTPUT SCREENING
          // ==============================================================
          setPipelinePhase('OUTPUT_SCREENING');

          setTimeout(() => {
            // ==============================================================
            // SAFETY PIPELINE STAGE 4: DELIVERY & ACTION ENFORCEMENT
            // ==============================================================
            setPipelinePhase('DELIVERY');
            setIsTyping(false);

            const finalMsg: ChatMessage = {
              id: assistantMsgId,
              conversationId: activeConvId,
              role: 'assistant',
              content: reply,
              timestamp: new Date().toISOString(),
              safetyEvent,
              isStreaming: false,
            };

            mockService.addMessage(activeConvId, finalMsg);
            setActiveSafetyEvent(safetyEvent);
            setConversations(mockService.getConversations());

            setTimeout(() => {
              setPipelinePhase('IDLE');
            }, 800);
          }, 300);
        }
      }, 40); // smooth token streaming pace
    }, 380);
  };

  const activeConversation = conversations.find((c) => c.id === activeConvId);

  return (
    <div className="h-[calc(100vh-140px)] min-h-[580px] flex rounded-3xl bg-white border border-slate-200/90 shadow-soft overflow-hidden relative font-sans">
      {/* ============================================================== */}
      {/* 1. COLLAPSIBLE CONVERSATION HISTORY SIDEBAR */}
      {/* ============================================================== */}
      <aside
        className={`transition-all duration-300 ease-in-out border-r border-slate-100 bg-slate-50/60 flex flex-col shrink-0 overflow-hidden ${
          isSidebarOpen ? 'w-72 lg:w-80' : 'w-0 border-r-0 opacity-0 pointer-events-none'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white/70">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-teal-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Conversations
            </span>
          </div>

          <button
            type="button"
            onClick={handleNewConversation}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-black text-white rounded-full text-xs font-medium transition-all shadow-xs hover:shadow-sm active:scale-95"
            title="Start new conversation"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
          {conversations.map((c) => {
            const isActive = c.id === activeConvId;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => loadConversation(c.id)}
                className={`w-full text-left p-3 rounded-2xl text-xs transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-white text-slate-900 font-semibold shadow-xs border border-slate-200/80 ring-1 ring-slate-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/80 border border-transparent'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className={`truncate text-[13px] ${isActive ? 'text-slate-900 font-bold' : 'text-slate-800'}`}>
                    {c.title}
                  </span>
                  <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                    {new Date(c.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                </div>

                {c.lastMessageSnippet && (
                  <p className="text-[11px] text-slate-500 truncate line-clamp-1 mb-1.5 font-normal">
                    {c.lastMessageSnippet}
                  </p>
                )}

                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{c.messageCount} messages</span>
                  </span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Privacy & Client Storage Indicator */}
        <div className="p-3 border-t border-slate-100 bg-white/60 text-[11px] text-slate-500 flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
          <span className="truncate">Client-encrypted & confidential</span>
        </div>
      </aside>

      {/* ============================================================== */}
      {/* 2. MAIN CONVERSATION CANVAS */}
      {/* ============================================================== */}
      <div className="flex-1 flex flex-col min-w-0 bg-white relative overflow-hidden h-full">
        {/* Chat Canvas Header */}
        <header className="h-14 px-4 sm:px-6 border-b border-slate-100 flex items-center justify-between gap-3 bg-white/95 backdrop-blur-md shrink-0 z-10">
          <div className="flex items-center gap-3 min-w-0">
            {/* Sidebar toggle button */}
            <button
              type="button"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              title={isSidebarOpen ? 'Collapse sidebar' : 'Open conversations'}
            >
              {isSidebarOpen ? (
                <PanelLeftClose className="w-4 h-4" />
              ) : (
                <PanelLeft className="w-4 h-4" />
              )}
            </button>

            {/* Active conversation info */}
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-slate-900 truncate">
                {activeConversation?.title || 'MindCare Companion'}
              </h2>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse shrink-0" />
                <span className="truncate">AI Companion • Non-diagnostic & supportive</span>
              </div>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* If sidebar is closed, quick "+ New" shortcut */}
            {!isSidebarOpen && (
              <button
                type="button"
                onClick={handleNewConversation}
                className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-semibold transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New</span>
              </button>
            )}

            {/* Explainable Safety Guardrails Drawer Trigger */}
            <button
              type="button"
              onClick={() => {
                if (window.innerWidth < 1024) {
                  setShowMobileSafetySheet(true);
                } else {
                  setIsSafetyDrawerOpen(!isSafetyDrawerOpen);
                }
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border ${
                isSafetyDrawerOpen
                  ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/90'
              }`}
              title="Inspect explainable safety model guardrails"
            >
              <ShieldCheck className={`w-3.5 h-3.5 ${isSafetyDrawerOpen ? 'text-white' : 'text-teal-600'}`} />
              <span className="hidden sm:inline">Safety Guardrails</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                isSafetyDrawerOpen ? 'bg-teal-700 text-white' : 'bg-slate-200/70 text-slate-600'
              }`}>
                v2.4.1
              </span>
            </button>
          </div>
        </header>

        {/* ============================================================== */}
        {/* MESSAGES SCROLL STREAM */}
        {/* ============================================================== */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 scroll-smooth">
          <div className="max-w-3xl w-full mx-auto space-y-6">
            {/* EMPTY STATE / WELCOME HERO */}
            {messages.length === 0 ? (
              <div className="py-8 sm:py-12 flex flex-col items-center text-center space-y-6 animate-fade-in">
                <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shadow-soft">
                  <Sparkles className="w-7 h-7" />
                </div>

                <div className="max-w-md space-y-2">
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    Hello, {currentUser?.name?.split(' ')[0] || 'there'}.
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    I'm your MindCare Companion — here to listen, help you untangle stressful moments, or practice grounding breathing. Everything is voluntary, calm, and private.
                  </p>
                </div>

                {/* Interactive Starter Prompt Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl text-left pt-2">
                  {STARTER_CARDS.map((item, idx) => {
                    const IconComponent = item.icon;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSendMessage(item.query)}
                        className="p-4 rounded-2xl border border-slate-200/80 bg-white hover:bg-slate-50/80 hover:border-slate-300 transition-all text-left shadow-soft hover:shadow-card-hover group flex flex-col justify-between"
                      >
                        <div className="flex items-center gap-2.5 mb-2">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${item.color}`}>
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <span className="font-bold text-xs text-slate-900 group-hover:text-teal-700 transition-colors">
                            {item.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-normal mb-2">
                          {item.desc}
                        </p>
                        <div className="flex items-center gap-1 text-[11px] text-teal-600 font-semibold group-hover:translate-x-0.5 transition-transform">
                          <span>Begin</span>
                          <ChevronRight className="w-3 h-3" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* MESSAGES LIST */
              messages.map((msg) => {
                const isUser = msg.role === 'user';
                const isUnavailable = msg.safetyEvent?.unavailableState;

                if (isUser) {
                  return (
                    <div key={msg.id} className="flex flex-col items-end space-y-1">
                      <div className="max-w-[82%] sm:max-w-[75%] px-5 py-3.5 bg-slate-900 text-white rounded-2xl rounded-tr-xs text-[14px] leading-relaxed shadow-sm font-normal">
                        <div className="whitespace-pre-line">{msg.content}</div>
                      </div>
                      <span className="text-[10px] text-slate-400 px-1 font-mono">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                }

                // Assistant Message
                return (
                  <div key={msg.id} className="flex items-start gap-3.5 max-w-[92%] sm:max-w-[85%]">
                    {/* Assistant Avatar */}
                    <div className="w-8 h-8 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shrink-0 mt-0.5 shadow-xs">
                      <Sparkles className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">MindCare Companion</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {/* Message Bubble Card */}
                      <div className="p-4 sm:p-5 rounded-2xl rounded-tl-xs bg-slate-50/80 border border-slate-100 text-[14px] leading-relaxed text-slate-800 shadow-xs space-y-3">
                        <div className="whitespace-pre-line text-slate-800">
                          {msg.content}
                          {msg.isStreaming && <span className="streaming-cursor" />}
                        </div>

                        {/* Edge Case: Unavailable Microservice Warning */}
                        {isUnavailable && (
                          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
                            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <div>
                              <strong className="block font-semibold">Safety Screening Unavailable:</strong>
                              <span className="text-amber-800 leading-normal">
                                Automated guardrail checks timed out. This message has not been reviewed against clinical policies. Proceed with caution.
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Message Actions & Subtle Safety Pill */}
                        <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between gap-2 text-xs">
                          {msg.safetyEvent ? (
                            <button
                              type="button"
                              onClick={() => handleOpenSafetyForEvent(msg.safetyEvent)}
                              className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-all ${
                                isUnavailable
                                  ? 'bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200'
                                  : 'bg-white hover:bg-teal-50 text-teal-700 border-teal-200/70 shadow-xs'
                              }`}
                              title="Click to view explainable safety assessment"
                            >
                              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                              <span>
                                {isUnavailable
                                  ? 'Safety Unverified'
                                  : `Audited: ${msg.safetyEvent.actionTaken}`}
                              </span>
                            </button>
                          ) : (
                            <div />
                          )}

                          {/* Quick Copy Message */}
                          <button
                            type="button"
                            onClick={() => handleCopyMessage(msg.id, msg.content)}
                            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-white transition-colors"
                            title="Copy response"
                          >
                            {copiedMsgId === msg.id ? (
                              <Check className="w-3.5 h-3.5 text-teal-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {/* LIVE SAFETY PIPELINE STATUS PILL */}
            {pipelinePhase !== 'IDLE' && (
              <div className="flex items-center justify-center pt-2 pb-1 animate-fade-in">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-soft text-xs text-slate-700">
                  <Activity className="w-3.5 h-3.5 text-teal-600 animate-spin" />
                  <span className="font-medium">
                    {pipelinePhase === 'INPUT_SCREENING' && 'Screening input for student distress signals...'}
                    {pipelinePhase === 'LLM_REASONING' && 'MindCare AI is composing a gentle response...'}
                    {pipelinePhase === 'OUTPUT_SCREENING' && 'Verifying reply against adolescent safety guardrails...'}
                    {pipelinePhase === 'DELIVERY' && 'Safety verified. Delivering message...'}
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* ============================================================== */}
        {/* 3. MODERN FLOATING INPUT DOCK */}
        {/* ============================================================== */}
        <div className="border-t border-slate-100/80 bg-white/90 backdrop-blur-md px-4 sm:px-6 pt-2 pb-4 shrink-0">
          <div className="max-w-3xl w-full mx-auto space-y-2">
            {/* Quick Suggestion Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
              <span className="text-[11px] text-slate-400 font-medium shrink-0">Try:</span>
              {PROMPT_SUGGESTIONS.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(item.query)}
                  className="shrink-0 px-3 py-1 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-full border border-slate-200/70 text-[11px] font-medium transition-all shadow-xs active:scale-95"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Floating Input Container */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="relative flex items-center bg-white border border-slate-200/90 rounded-full pl-4 pr-1.5 py-1.5 shadow-elevated focus-within:border-teal-500 focus-within:ring-4 focus-within:ring-teal-500/10 transition-all"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Share what is on your mind... (or ask for a grounding exercise)"
                disabled={isTyping}
                className="flex-1 bg-transparent border-none text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none pr-3"
              />

              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                aria-label="Send message"
                className="w-9 h-9 rounded-full bg-slate-900 hover:bg-black disabled:opacity-20 text-white flex items-center justify-center transition-all shrink-0 active:scale-95 shadow-xs"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </form>

            {/* Bottom Non-Diagnostic Assurance */}
            <div className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1.5">
              <Shield className="w-3 h-3 text-teal-600" />
              <span>Voluntary, confidential support. AI Companion is non-diagnostic.</span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 4. SLIDE-OVER SAFETY GUARDRAILS INSPECTOR DRAWER (DESKTOP) */}
      {/* ============================================================== */}
      {isSafetyDrawerOpen && (
        <aside className="hidden lg:flex w-96 border-l border-slate-200 bg-white flex-col shrink-0 shadow-elevated z-30 transition-all duration-300 animate-in slide-in-from-right">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Guardrail Inspector
                </h3>
                <span className="text-[10px] text-slate-500 font-mono">Policy Engine v2.4.1</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsSafetyDrawerOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Close inspector"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Every AI message is vetted in real-time through an explainable multi-tier safety pipeline to protect adolescent emotional wellbeing.
            </p>

            <SafetyPanel event={activeSafetyEvent} isLoading={isTyping} />
          </div>
        </aside>
      )}

      {/* Mobile Bottom Sheet for Safety Guardrails */}
      <BottomSheet
        isOpen={showMobileSafetySheet}
        onClose={() => setShowMobileSafetySheet(false)}
        title={
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Response Safety Assessment</span>
          </div>
        }
      >
        <SafetyPanel event={activeSafetyEvent} isLoading={isTyping} />
      </BottomSheet>
    </div>
  );
}
