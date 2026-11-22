import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
    () => localStorage.getItem('sidebar_collapsed') === 'true'
  );

  const handleSidebarToggle = () => {
    if (window.matchMedia('(min-width: 768px)').matches) {
      setIsSidebarCollapsed((collapsed) => {
        const nextCollapsed = !collapsed;
        localStorage.setItem('sidebar_collapsed', String(nextCollapsed));
        return nextCollapsed;
      });
      return;
    }

    setIsSidebarOpen((open) => !open);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isSidebarCollapsed ? 'md:pl-20' : 'md:pl-64'
        }`}
      >
        <Header onMenuClick={handleSidebarToggle} isSidebarCollapsed={isSidebarCollapsed} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

