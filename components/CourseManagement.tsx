import React, { useState } from 'react';
import { Course, Material, UserRole } from '../types';
import { Plus, Edit3, Trash2, FileText, Video, Link as LinkIcon, Sparkles, Euro, BookOpenCheck } from 'lucide-react';
import { generateCourseOutline } from '../services/geminiService';

interface CourseManagementProps {
  courses: Course[];
  userRole: UserRole;
  onAddCourse: (course: Course) => void;
  onUpdateCourse: (course: Course) => void;
  onDeleteCourse: (id: string) => void;
  onViewCourse: (id: string) => void;
}

export const CourseManagement: React.FC<CourseManagementProps> = ({
  courses,
  userRole,
  onAddCourse,
  onUpdateCourse,
  onDeleteCourse,
  onViewCourse
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Partial<Course>>({});
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const canEdit = userRole === UserRole.ADMIN || userRole === UserRole.EDITOR;

  const handleSave = () => {
    if (!currentCourse.title || !currentCourse.price) return;

    const newCourse: Course = {
      id: currentCourse.id || Date.now().toString(),
      title: currentCourse.title || '',
      description: currentCourse.description || '',
      price: Number(currentCourse.price) || 0,
      imageUrl: currentCourse.imageUrl || `https://picsum.photos/400/250?random=${Date.now()}`,
      materials: currentCourse.materials || [],
      published: currentCourse.published || false,
      category: currentCourse.category || 'Geral'
    };

    if (currentCourse.id) {
      onUpdateCourse(newCourse);
    } else {
      onAddCourse(newCourse);
    }
    setIsEditing(false);
    setCurrentCourse({});
    setAiPrompt('');
  };

  const handleGenerateAi = async () => {
    if (!aiPrompt) return;
    setIsGenerating(true);
    const outline = await generateCourseOutline(aiPrompt);
    setCurrentCourse(prev => ({
      ...prev,
      description: prev.description ? prev.description + '\n\n' + outline : outline,
      title: prev.title || aiPrompt
    }));
    setIsGenerating(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">
            {currentCourse.id ? 'Editar Curso' : 'Novo Curso'}
          </h2>
          <button onClick={() => setIsEditing(false)} className="text-slate-500 hover:text-slate-700">Cancelar</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Título do Curso</label>
              <input
                type="text"
                className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                value={currentCourse.title || ''}
                onChange={e => setCurrentCourse({...currentCourse, title: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Preço (€)</label>
                <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <span className="text-slate-500">€</span>
                   </div>
                  <input
                    type="number"
                    className="w-full pl-8 rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                    value={currentCourse.price || ''}
                    onChange={e => setCurrentCourse({...currentCourse, price: Number(e.target.value)})}
                  />
                </div>
              </div>
              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Categoria</label>
                 <select 
                    className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                    value={currentCourse.category || 'Geral'}
                    onChange={e => setCurrentCourse({...currentCourse, category: e.target.value})}
                 >
                    <option value="Tecnologia">Tecnologia</option>
                    <option value="Programação">Programação</option>
                    <option value="Design">Design</option>
                    <option value="Gestão">Gestão</option>
                    <option value="Geral">Geral</option>
                 </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Estado</label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="published"
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                  checked={currentCourse.published || false}
                  onChange={e => setCurrentCourse({...currentCourse, published: e.target.checked})}
                />
                <label htmlFor="published" className="text-sm text-slate-600">Publicado (Visível para alunos)</label>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
             <div className="flex items-center space-x-2 mb-2 text-purple-700">
                <Sparkles size={18} />
                <span className="font-semibold text-sm">Assistente IA (Gemini)</span>
             </div>
             <p className="text-xs text-slate-500 mb-3">Introduza o tema para gerar um esboço do curso automaticamente.</p>
             <div className="flex space-x-2">
                <input 
                  type="text" 
                  placeholder="Ex: Cibersegurança Avançada"
                  className="flex-1 rounded-md border-slate-300 border p-2 text-sm"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                />
                <button 
                  onClick={handleGenerateAi}
                  disabled={isGenerating}
                  className="bg-purple-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-700 disabled:opacity-50"
                >
                  {isGenerating ? '...' : 'Gerar'}
                </button>
             </div>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-slate-700 mb-1">Descrição / Conteúdo Programático</label>
          <textarea
            className="w-full h-64 rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 font-mono text-sm"
            value={currentCourse.description || ''}
            onChange={e => setCurrentCourse({...currentCourse, description: e.target.value})}
            placeholder="Conteúdo do curso em formato texto ou Markdown..."
          />
        </div>

        <div className="mt-8 flex justify-end space-x-3">
          <button onClick={() => setIsEditing(false)} className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50">Cancelar</button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Gravar Curso</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Catálogo de Formações</h2>
          <p className="text-slate-500">Explore e gira as suas formações tecnológicas.</p>
        </div>
        {canEdit && (
          <button 
            onClick={() => { setCurrentCourse({}); setIsEditing(true); }}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm"
          >
            <Plus size={18} />
            <span>Novo Curso</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <div key={course.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
            <div className="h-40 bg-slate-200 relative">
               <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover" />
               <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-slate-700">
                 {course.category}
               </div>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-slate-800 line-clamp-2">{course.title}</h3>
              </div>
              <p className="text-slate-500 text-sm line-clamp-3 mb-4 flex-1">{course.description}</p>
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                <span className="text-lg font-bold text-blue-600">{course.price.toFixed(2)} €</span>
                <span className={`text-xs px-2 py-1 rounded-full ${course.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {course.published ? 'Publicado' : 'Rascunho'}
                </span>
              </div>
            </div>
            
            <div className="bg-slate-50 p-3 flex justify-between items-center border-t border-slate-100">
               <button 
                onClick={() => onViewCourse(course.id)}
                className="flex items-center space-x-1 text-sm font-medium text-blue-600 hover:text-blue-800"
               >
                 <BookOpenCheck size={16} />
                 <span>Ver Materiais</span>
               </button>

               {canEdit && (
                 <div className="flex space-x-2">
                    <button 
                      onClick={() => { setCurrentCourse(course); setIsEditing(true); }}
                      className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                      title="Editar"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button 
                      onClick={() => onDeleteCourse(course.id)}
                      className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded"
                      title="Apagar"
                    >
                      <Trash2 size={16} />
                    </button>
                 </div>
               )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};