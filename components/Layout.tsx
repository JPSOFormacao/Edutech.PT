import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { APP_LOGO } from '../constants';
import { 
  LogOut, 
  BookOpen, 
  Users, 
  LayoutDashboard, 
  Menu, 
  X
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentUser: User;
  currentView: string;
  onNavigate: (view: any) => void;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  currentUser, 
  currentView, 
  onNavigate, 
  onLogout 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAdmin = currentUser.role === UserRole.ADMIN;
  const isEditor = currentUser.role === UserRole.EDITOR || isAdmin;

  const NavItem = ({ view, icon: Icon, label }: { view: string, icon: any, label: string }) => (
    <button
      onClick={() => {
        onNavigate(view);
        setIsMobileMenuOpen(false);
      }}
      className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-colors duration-200 ${
        currentView === view 
          ? 'bg-blue-600 text-white shadow-md' 
          : 'text-slate-600 hover:bg-slate-100 hover:text-blue-600'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-full">
        <div className="p-6 border-b border-slate-100 flex items-center space-x-3">
          <img src={APP_LOGO} alt="EduTech Logo" className="h-10 w-10" />
          <div>
            <h1 className="text-lg font-bold text-slate-800 leading-tight">EduTech PT</h1>
            <p className="text-xs text-slate-500">Gestão de Formações</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <NavItem view="DASHBOARD" icon={LayoutDashboard} label="Painel Principal" />
          <NavItem view="COURSES" icon={BookOpen} label="Cursos e Materiais" />
          
          {isAdmin && (
            <>
              <div className="pt-4 pb-1 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Administração
              </div>
              <NavItem view="USERS" icon={Users} label="Gestão de Utilizadores" />
            </>
          )}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center space-x-3 mb-4 px-2">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
              {currentUser.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{currentUser.name}</p>
              <p className="text-xs text-slate-500 truncate capitalize">{currentUser.role.toLowerCase()}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="flex items-center justify-center space-x-2 w-full px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-red-600 transition-colors text-sm"
          >
            <LogOut size={16} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-50 flex items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <img src={APP_LOGO} alt="Logo" className="h-8 w-8" />
          <span className="font-bold text-slate-800">EduTech PT</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-slate-800 bg-opacity-50 pt-16">
          <div className="bg-white h-full w-3/4 p-4 shadow-xl">
             <nav className="space-y-2">
              <NavItem view="DASHBOARD" icon={LayoutDashboard} label="Painel Principal" />
              <NavItem view="COURSES" icon={BookOpen} label="Cursos" />
              {isAdmin && <NavItem view="USERS" icon={Users} label="Utilizadores" />}
              <hr className="my-4"/>
              <button onClick={onLogout} className="flex items-center space-x-3 w-full px-4 py-3 text-red-600">
                <LogOut size={20} />
                <span>Sair</span>
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-slate-50 w-full pt-16 md:pt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
};