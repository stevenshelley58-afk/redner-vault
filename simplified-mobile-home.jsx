import { useState } from 'react';

// Icons as simple components
function FolderIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
    </svg>
  );
}

function PlusIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

function UserIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  );
}

function ChatIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
    </svg>
  );
}

function ChevronRight({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  );
}

function ArrowLeft({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
  );
}

function ImageIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  );
}

// Menu item component
function MenuItem({ icon: Icon, label, onClick, badge, description }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 bg-white rounded-2xl border border-[var(--border-ghost)] shadow-[0_16px_40px_rgba(0,0,0,0.06)] text-left active:translate-y-[1px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--bg-surface)] text-[var(--text-ink)]">
        <Icon className="h-6 w-6" />
      </div>
      <div className="flex-1 space-y-1">
        <h3 className="text-lg font-semibold text-[var(--text-ink)] tracking-tight">{label}</h3>
        {description && (
          <p className="text-sm text-[var(--text-subtle)] leading-relaxed">{description}</p>
        )}
      </div>
      {badge && (
        <span className="text-xs font-semibold text-[var(--accent)] bg-[rgba(0,113,227,0.12)] px-3 py-1 rounded-full">
          {badge}
        </span>
      )}
    </button>
  );
}

// Status pill
const STATUS_CONFIG = {
  draft: { label: 'Draft', bg: 'bg-slate-100', text: 'text-slate-700' },
  in_progress: { label: 'In progress', bg: 'bg-blue-100', text: 'text-blue-800' },
  awaiting_client: { label: 'Awaiting you', bg: 'bg-pink-100', text: 'text-pink-800' },
  completed: { label: 'Completed', bg: 'bg-emerald-100', text: 'text-emerald-800' },
};

function StatusPill({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.draft;
  return (
    <span className={`${config.bg} ${config.text} px-2.5 py-1 rounded-full text-xs font-medium`}>
      {config.label}
    </span>
  );
}

// Project card for the projects list
function ProjectCard({ project, onClick }) {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-start gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100 text-left active:scale-[0.98] transition-transform"
    >
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
        <ImageIcon className="h-7 w-7" />
      </div>
      <div className="flex flex-1 flex-col gap-2 py-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-lg font-semibold leading-tight text-gray-900">{project.name}</h3>
          <StatusPill status={project.status} />
        </div>
        {project.brief ? (
          <p className="text-sm leading-relaxed text-gray-600 line-clamp-2">{project.brief}</p>
        ) : (
          <p className="text-sm text-gray-400">No brief yet.</p>
        )}
      </div>
    </button>
  );
}

// Sample data
const PROJECT_SEED = [
  {
    id: 'proj_001',
    name: 'Teak Dining Collection',
    status: 'in_progress',
    brief: 'Hero images for the new teak dining collection. Warm natural light, lifestyle props.',
  },
  {
    id: 'proj_002',
    name: 'Rajasthan Artisan Series',
    status: 'awaiting_client',
    brief: 'Close-up craftsmanship shots with patina detail.',
  },
  {
    id: 'proj_003',
    name: 'Summer Campaign 2025',
    status: 'draft',
    brief: '',
  },
  {
    id: 'proj_004',
    name: 'Outdoor Furniture Launch',
    status: 'completed',
    brief: 'Launch imagery for new outdoor teak line. Poolside and garden settings.',
  },
];

// Home Screen
function HomeScreen({ onNavigate }) {
  const activeProjects = PROJECT_SEED.filter((p) =>
    ['in_progress', 'awaiting_client'].includes(p.status)
  );
  const activeCount = activeProjects.length;
  const nextProject = activeProjects[0];

  return (
    <div className="p-6 space-y-5">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-[var(--accent)] text-white text-xl font-bold shadow-md">
            <img src="/logo.svg" alt="Render Vault" className="h-10 w-auto" />
          </div>
        <div className="space-y-1">
          <h1 className="text-[22px] font-semibold text-[var(--text-ink)] tracking-tight">
            Render Vault
          </h1>
          <p className="text-base text-[var(--text-subtle)]">
            Three clear actions. Big tap targets. Built for focus.
          </p>
        </div>
        <button
          onClick={() => onNavigate('account')}
          className="text-sm font-semibold text-[var(--accent)] underline underline-offset-4"
        >
          Manage account
        </button>
      </div>

      <div className="space-y-3">
        <MenuItem
          icon={FolderIcon}
          label="Continue project"
          badge={activeCount > 0 ? `${activeCount} active` : 'No projects yet'}
          description={
            nextProject
              ? `${nextProject.name} - ${STATUS_CONFIG[nextProject.status]?.label || 'In progress'}`
              : 'Start by creating your first brief.'
          }
          onClick={() => onNavigate('projects')}
        />
        <MenuItem
          icon={PlusIcon}
          label="Start new project"
          description="Short form. Takes about a minute."
          onClick={() => onNavigate('new')}
        />
        <MenuItem
          icon={ChatIcon}
          label="Help & contact"
          description="Call or message us for quick help."
          onClick={() => onNavigate('contact')}
        />
      </div>
    </div>
  );
}

// Projects List Screen
function ProjectsScreen({ onBack, onSelectProject }) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 bg-white border-b">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:bg-gray-200"
        >
          <ArrowLeft className="h-6 w-6 text-gray-600" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Your Projects</h1>
      </div>

      {/* Project List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {PROJECT_SEED.map((project) => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            onClick={() => onSelectProject(project)}
          />
        ))}
      </div>
    </div>
  );
}

// New Project Screen (placeholder)
function NewProjectScreen({ onBack }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 p-4 bg-white border-b">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="h-6 w-6 text-gray-600" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">New Project</h1>
      </div>
      <div className="flex-1 p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
          <input 
            type="text" 
            placeholder="e.g. Summer Collection"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">What do you need?</label>
          <textarea 
            placeholder="Describe what images you're looking for..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>
        <button className="w-full py-4 bg-gradient-to-r from-[#4b6a8e] to-[#6bc6b5] text-white font-semibold rounded-xl shadow-lg active:scale-[0.98] transition-transform">
          Create Project
        </button>
      </div>
    </div>
  );
}

// Account Screen (placeholder)
function AccountScreen({ onBack }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 p-4 bg-white border-b">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="h-6 w-6 text-gray-600" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Your Account</h1>
      </div>
      <div className="flex-1 p-5">
        <div className="text-center py-8">
          <div className="h-20 w-20 rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-gray-500">
            SS
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Steven Shelley</h2>
          <p className="text-gray-500">steven@bhm.com.au</p>
        </div>
        <div className="space-y-2 mt-4">
          <button className="w-full p-4 bg-white rounded-xl border text-left text-gray-700 font-medium">
            Edit Profile
          </button>
          <button className="w-full p-4 bg-white rounded-xl border text-left text-gray-700 font-medium">
            Billing & Credits
          </button>
          <button className="w-full p-4 bg-white rounded-xl border text-left text-red-600 font-medium">
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

// Contact Screen (placeholder)
function ContactScreen({ onBack }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 p-4 bg-white border-b">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="h-6 w-6 text-gray-600" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Contact Us</h1>
      </div>
      <div className="flex-1 p-5 space-y-4">
        <div className="bg-white rounded-2xl p-5 border text-center">
          <div className="h-14 w-14 rounded-full bg-blue-100 mx-auto mb-3 flex items-center justify-center">
            <ChatIcon className="h-7 w-7 text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Chat with us</h2>
          <p className="text-sm text-gray-500 mb-4">We typically respond within a few hours</p>
          <button className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl">
            Start Chat
          </button>
        </div>
        <div className="bg-white rounded-2xl p-5 border text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Email us</h2>
          <a href="mailto:hello@rendervault.studio" className="text-blue-600">
            hello@rendervault.studio
          </a>
        </div>
      </div>
    </div>
  );
}

// Main App
export default function SimplifiedMobileApp() {
  const [screen, setScreen] = useState('home');
  const [selectedProject, setSelectedProject] = useState(null);

  const renderScreen = () => {
    switch (screen) {
      case 'projects':
        return <ProjectsScreen onBack={() => setScreen('home')} onSelectProject={(p) => setSelectedProject(p)} />;
      case 'new':
        return <NewProjectScreen onBack={() => setScreen('home')} />;
      case 'account':
        return <AccountScreen onBack={() => setScreen('home')} />;
      case 'contact':
        return <ContactScreen onBack={() => setScreen('home')} />;
      default:
        return <HomeScreen onNavigate={setScreen} />;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-paper)] p-4">
      <p className="text-center text-sm text-[var(--text-subtle)] mb-4">
        Simplified mobile dashboard
      </p>
      
      {/* Phone Frame */}
      <div className="max-w-sm mx-auto bg-gray-900 rounded-[3rem] p-3 shadow-2xl border border-black/10">
        <div className="bg-gray-50 rounded-[2.5rem] overflow-hidden">
          {/* Status Bar */}
          <div className="bg-white px-6 py-2 flex justify-between items-center text-xs text-gray-600">
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
          <div className="h-[600px] overflow-hidden bg-gray-50">
            {renderScreen()}
          </div>

          {/* Home indicator */}
          <div className="bg-white py-2 flex justify-center">
            <div className="w-32 h-1 bg-gray-900 rounded-full" />
          </div>
        </div>
      </div>

      <p className="text-center text-sm text-[var(--text-subtle)] mt-4">
        Large buttons for easy tapping
      </p>
    </div>
  );
}
