import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { CourseManagement } from './components/CourseManagement';
import { CourseDetail } from './components/CourseDetail';
import { UserManagement } from './components/UserManagement';
import { AppState, User, UserRole, Course, Material, ViewState } from './types';
import { INITIAL_COURSES, INITIAL_USERS, MOCK_ADMIN_EMAIL, APP_LOGO } from './constants';
import { Mail, Lock, UserPlus } from 'lucide-react';

const App = () => {
  // --- State ---
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  
  const [state, setState] = useState<AppState>({
    currentUser: null,
    currentView: 'LOGIN',
    selectedCourseId: null
  });

  // --- Auth & Registration State ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // Mock password
  const [name, setName] = useState('');
  const [authError, setAuthError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  // --- Actions ---

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (user) {
      if (!user.approved) {
        setAuthError('A sua conta aguarda aprovação do administrador.');
        return;
      }
      setState({ ...state, currentUser: user, currentView: 'DASHBOARD' });
    } else {
      setAuthError('Email não encontrado. Registe-se primeiro.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      setAuthError('Preencha todos os campos.');
      return;
    }

    const exists = users.find(u => u.email === email);
    if (exists) {
      setAuthError('Este email já está registado.');
      return;
    }

    // Hardcode admin role for the specific email requested
    const role = email.toLowerCase() === MOCK_ADMIN_EMAIL.toLowerCase() 
      ? UserRole.ADMIN 
      : UserRole.STUDENT;

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role,
      approved: role === UserRole.ADMIN, // Auto approve admin
      coursesEnrolled: []
    };

    setUsers([...users, newUser]);
    setIsRegistering(false);
    setAuthError('Registo efetuado! Aguarde aprovação do administrador (se não for Admin).');
    setEmail(''); 
    setPassword('');
  };

  const handleLogout = () => {
    setState({ currentUser: null, currentView: 'LOGIN', selectedCourseId: null });
    setEmail('');
    setPassword('');
    setAuthError('');
  };

  const handleNavigate = (view: ViewState) => {
    setState(prev => ({ ...prev, currentView: view, selectedCourseId: null }));
  };

  // --- Course Actions ---

  const handleAddCourse = (course: Course) => {
    setCourses([...courses, course]);
  };

  const handleUpdateCourse = (updatedCourse: Course) => {
    setCourses(courses.map(c => c.id === updatedCourse.id ? updatedCourse : c));
  };

  const handleDeleteCourse = (id: string) => {
    if (confirm('Tem a certeza?')) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const handleViewCourse = (id: string) => {
    setState(prev => ({ ...prev, currentView: 'COURSE_DETAIL', selectedCourseId: id }));
  };

  const handleAddMaterial = (courseId: string, material: Material) => {
    const course = courses.find(c => c.id === courseId);
    if (course) {
      const updated = { ...course, materials: [...course.materials, material] };
      handleUpdateCourse(updated);
    }
  };

  const handleDeleteMaterial = (courseId: string, materialId: string) => {
     const course = courses.find(c => c.id === courseId);
    if (course) {
      const updated = { ...course, materials: course.materials.filter(m => m.id !== materialId) };
      handleUpdateCourse(updated);
    }
  }

  // --- User Management Actions ---

  const handleApproveUser = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, approved: true } : u));
  };

  const handleUpdateUserRole = (id: string, role: UserRole) => {
    setUsers(users.map(u => u.id === id ? { ...u, role } : u));
  };

  const handleDeleteUser = (id: string) => {
      setUsers(users.filter(u => u.id !== id));
  }

  // --- Render ---

  if (!state.currentUser) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="bg-blue-600 p-8 text-center flex flex-col items-center">
             <img src={APP_LOGO} alt="EduTech Logo" className="w-16 h-16 mb-4 rounded-xl shadow-md" />
             <h1 className="text-3xl font-bold text-white mb-2">EduTech PT</h1>
             <p className="text-blue-100">Portal de Formação e Gestão</p>
          </div>
          
          <div className="p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">
              {isRegistering ? 'Pedido de Acesso' : 'Entrar na Plataforma'}
            </h2>
            
            {authError && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                {authError}
              </div>
            )}

            <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-4">
              {isRegistering && (
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
                   <div className="relative">
                     <UserPlus className="absolute left-3 top-3 text-slate-400" size={18} />
                     <input 
                      type="text" 
                      className="pl-10 w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" 
                      placeholder="O seu nome"
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                   </div>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input 
                    type="email" 
                    className="pl-10 w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" 
                    placeholder="email@exemplo.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input 
                    type="password" 
                    className="pl-10 w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" 
                    placeholder="********"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md">
                {isRegistering ? 'Pedir Acesso' : 'Entrar'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button 
                onClick={() => { setIsRegistering(!isRegistering); setAuthError(''); }}
                className="text-sm text-blue-600 hover:underline font-medium"
              >
                {isRegistering ? 'Já tem conta? Entrar' : 'Não tem conta? Pedir Acesso'}
              </button>
            </div>
            
            <div className="mt-8 pt-4 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-400">
                Admin Demo: <br/> {MOCK_ADMIN_EMAIL}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Main App Views ---
  
  const renderView = () => {
    switch (state.currentView) {
      case 'DASHBOARD':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-slate-500 text-sm font-medium">Os Meus Cursos</h3>
              <p className="text-3xl font-bold text-slate-800 mt-2">
                {state.currentUser?.role === UserRole.STUDENT 
                 ? state.currentUser.coursesEnrolled.length 
                 : courses.length}
              </p>
            </div>
            {state.currentUser?.role !== UserRole.STUDENT && (
              <>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <h3 className="text-slate-500 text-sm font-medium">Alunos Registados</h3>
                  <p className="text-3xl font-bold text-slate-800 mt-2">
                    {users.filter(u => u.role === UserRole.STUDENT).length}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <h3 className="text-slate-500 text-sm font-medium">Pedidos Pendentes</h3>
                  <p className="text-3xl font-bold text-yellow-600 mt-2">
                    {users.filter(u => !u.approved).length}
                  </p>
                </div>
              </>
            )}
             <div className="col-span-1 md:col-span-3 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg">
                <h2 className="text-2xl font-bold mb-2">Bem-vindo, {state.currentUser?.name}!</h2>
                <p className="opacity-90">Gestão de formações EduTech PT. Continue a sua jornada de aprendizagem.</p>
                <button 
                  onClick={() => handleNavigate('COURSES')}
                  className="mt-6 bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition"
                >
                  Ver Catálogo
                </button>
             </div>
          </div>
        );
      case 'COURSES':
        return (
          <CourseManagement 
            courses={courses} 
            userRole={state.currentUser.role}
            onAddCourse={handleAddCourse}
            onUpdateCourse={handleUpdateCourse}
            onDeleteCourse={handleDeleteCourse}
            onViewCourse={handleViewCourse}
          />
        );
      case 'COURSE_DETAIL':
        const selectedCourse = courses.find(c => c.id === state.selectedCourseId);
        if (!selectedCourse) return <div>Curso não encontrado</div>;
        return (
          <CourseDetail 
            course={selectedCourse}
            userRole={state.currentUser.role}
            onBack={() => handleNavigate('COURSES')}
            onAddMaterial={handleAddMaterial}
            onDeleteMaterial={handleDeleteMaterial}
          />
        );
      case 'USERS':
        return (
           <UserManagement 
             users={users}
             onApproveUser={handleApproveUser}
             onUpdateUserRole={handleUpdateUserRole}
             onDeleteUser={handleDeleteUser}
           />
        );
      default:
        return <div>Vista não encontrada</div>;
    }
  };

  return (
    <Layout 
      currentUser={state.currentUser} 
      currentView={state.currentView}
      onNavigate={handleNavigate}
      onLogout={handleLogout}
    >
      {renderView()}
    </Layout>
  );
};

export default App;