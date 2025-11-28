import { useState } from 'react';

// ============ ICONS ============
function ArrowLeft({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
  );
}

function CheckIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

function EditIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
    </svg>
  );
}

function DownloadIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
  );
}

function SendIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
  );
}

function XIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

// ============ IMAGE REVIEW SCREEN ============
function ImageReviewScreen({ onBack }) {
  const [mode, setMode] = useState('view'); // 'view' | 'request'
  const [comment, setComment] = useState('');

  const image = {
    name: 'Hero shot - table setting',
    project: 'Teak Dining Collection',
    status: 'Ready for review',
  };

  // Request changes mode
  if (mode === 'request') {
    return (
      <div className="flex flex-col h-full bg-[var(--bg-paper)]">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 bg-white border-b">
          <button 
            onClick={() => setMode('view')} 
            className="p-2 -ml-2 rounded-full hover:bg-gray-100"
          >
            <XIcon className="h-6 w-6 text-gray-500" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Request changes</h1>
        </div>

        {/* Thumbnail reminder */}
        <div className="p-4 bg-[var(--bg-surface)] border-b flex items-center gap-3">
          <div className="h-16 w-16 rounded-xl bg-gray-200 border border-[var(--border-ghost)] shrink-0" />
          <div className="space-y-0.5">
            <p className="text-sm font-semibold text-[var(--text-ink)]">{image.name}</p>
            <p className="text-xs text-[var(--text-subtle)]">{image.project}</p>
          </div>
        </div>

        {/* Comment input */}
        <div className="flex-1 p-4">
          <label className="block text-sm font-semibold text-[var(--text-ink)] mb-2">
            What needs to change?
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Keep it short. e.g. Warmer light, less shadow on the front."
            rows={5}
            className="w-full px-4 py-3 border border-[var(--border-ghost)] rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent resize-none bg-white"
            autoFocus
          />
        </div>

        {/* Submit button */}
        <div className="p-4 border-t bg-white">
          <button 
            className="w-full py-4 bg-[var(--accent)] text-white font-semibold rounded-2xl flex items-center justify-center gap-2 active:opacity-90 disabled:opacity-50 text-base"
            disabled={!comment.trim()}
          >
            <SendIcon className="h-5 w-5" />
            Send request
          </button>
        </div>
      </div>
    );
  }

  // Main view mode
  return (
    <div className="flex flex-col h-full bg-[var(--bg-paper)]">
      {/* Header - minimal */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-b">
        <button 
          onClick={onBack} 
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:bg-gray-200"
        >
          <ArrowLeft className="h-6 w-6 text-gray-600" />
        </button>
        <div className="flex-1 space-y-0.5">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-subtle)]">Image</p>
          <h1 className="text-lg font-semibold text-[var(--text-ink)]">{image.name}</h1>
          <p className="text-sm text-[var(--text-subtle)]">{image.project}</p>
        </div>
      </div>

      {/* Image - takes up most of the space */}
      <div className="flex-1 flex items-center justify-center p-4 bg-gray-100">
        <div className="w-full max-w-[340px] aspect-[4/3] rounded-2xl bg-gray-900 shadow-xl flex items-center justify-center overflow-hidden">
          <div className="relative w-full h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black opacity-90" />
            <div className="absolute inset-[18%] rounded-xl border border-white/6 bg-white/4 backdrop-blur-sm" />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-xs font-medium bg-black/40 px-3 py-1.5 rounded-full border border-white/10">
              Preview image
            </div>
          </div>
        </div>
      </div>

      {/* Status text */}
      <div className="px-4 py-3 bg-white border-t flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-[var(--text-ink)]">{image.status}</p>
          <p className="text-xs text-[var(--text-subtle)]">Download or approve. Request changes if needed.</p>
        </div>
        <button className="px-3 py-1.5 text-xs font-semibold text-[var(--accent)] bg-[rgba(0,113,227,0.08)] rounded-full">
          Need help?
        </button>
      </div>

      {/* Actions - big clear buttons */}
      <div className="p-4 bg-white space-y-3">
        {/* Download */}
        <button className="w-full py-3.5 border border-[var(--border-ghost)] text-[var(--text-ink)] font-medium rounded-2xl flex items-center justify-center gap-2 active:bg-gray-50 text-base">
          <DownloadIcon className="h-5 w-5" />
          Download image
        </button>

        {/* Main actions */}
        <div className="flex gap-3">
          <button 
            onClick={() => setMode('request')}
            className="flex-1 py-4 bg-gray-100 text-gray-800 font-semibold rounded-2xl flex items-center justify-center gap-2 active:bg-gray-200 text-base"
          >
            <EditIcon className="h-5 w-5" />
            Request changes
          </button>
          <button className="flex-1 py-4 bg-emerald-600 text-white font-semibold rounded-2xl flex items-center justify-center gap-2 active:bg-emerald-700 text-base">
            <CheckIcon className="h-5 w-5" />
            Approve image
          </button>
        </div>
      </div>
    </div>
  );
}

// ============ MAIN APP ============
export default function ImageReviewDemo() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return (
      <div className="min-h-screen bg-[var(--bg-paper)] flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-[var(--text-subtle)] mb-4">Image review closed</p>
          <button 
            onClick={() => setDismissed(false)}
            className="px-6 py-3 bg-[var(--accent)] text-white rounded-xl font-medium"
          >
            Open again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-paper)] p-4">
      <p className="text-center text-sm text-[var(--text-subtle)] mb-4 font-medium">Simplified image review</p>
      
      {/* Phone Frame */}
      <div className="max-w-[375px] mx-auto bg-gray-900 rounded-[3rem] p-3 shadow-2xl border border-black/10">
        <div className="bg-white rounded-[2.4rem] overflow-hidden">
          {/* Status area */}
          <div className="bg-white px-6 py-2 flex justify-between items-center text-xs font-medium text-gray-900">
            <span className="font-semibold">9:41</span>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-semibold text-gray-700">LTE</span>
              <div className="flex items-center gap-1">
                <div className="h-3 w-4 rounded-sm border border-gray-500 relative">
                  <div className="absolute inset-[2px] bg-gray-700 rounded-[2px]" />
                </div>
                <span className="text-[11px] font-semibold text-gray-700">100%</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="h-[680px] overflow-hidden">
            <ImageReviewScreen onBack={() => setDismissed(true)} />
          </div>

          {/* Home indicator */}
          <div className="bg-white py-2 flex justify-center">
            <div className="w-32 h-1 bg-gray-900 rounded-full" />
          </div>
        </div>
      </div>

      <p className="text-center text-sm text-[var(--text-subtle)] mt-4">
        Tap "Request changes" to try the flow
      </p>
    </div>
  );
}
