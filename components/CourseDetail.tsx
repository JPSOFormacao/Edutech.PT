import React, { useState } from 'react';
import { Course, Material, UserRole } from '../types';
import { ArrowLeft, FileText, Video, Link as LinkIcon, Download, Lock, Plus, Trash, CheckSquare } from 'lucide-react';
import { generateQuizQuestion } from '../services/geminiService';

interface CourseDetailProps {
  course: Course;
  userRole: UserRole;
  onBack: () => void;
  onAddMaterial: (courseId: string, material: Material) => void;
  onDeleteMaterial: (courseId: string, materialId: string) => void;
}

export const CourseDetail: React.FC<CourseDetailProps> = ({
  course,
  userRole,
  onBack,
  onAddMaterial,
  onDeleteMaterial
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMaterial, setNewMaterial] = useState<Partial<Material>>({ type: 'PDF' });
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const canEdit = userRole === UserRole.ADMIN || userRole === UserRole.EDITOR;

  const handleAdd = () => {
    if (!newMaterial.title) return;
    onAddMaterial(course.id, {
      id: Date.now().toString(),
      title: newMaterial.title!,
      type: newMaterial.type || 'PDF',
      description: newMaterial.description || '',
      contentUrl: newMaterial.contentUrl || ''
    } as Material);
    setShowAddModal(false);
    setNewMaterial({ type: 'PDF' });
  };

  const handleAiQuiz = async () => {
      setIsAiGenerating(true);
      const json = await generateQuizQuestion(course.title + " " + newMaterial.description);
      setNewMaterial(prev => ({
          ...prev, 
          type: 'QUIZ', 
          title: prev.title || 'Quiz Gerado por IA',
          description: prev.description || 'Questão de teste.',
          contentUrl: json // Storing JSON question in contentUrl for this demo
      }));
      setIsAiGenerating(false);
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'PDF': return <FileText className="text-red-500" />;
      case 'VIDEO': return <Video className="text-blue-500" />;
      case 'LINK': return <LinkIcon className="text-green-500" />;
      case 'QUIZ': return <CheckSquare className="text-purple-500" />;
      default: return <FileText className="text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="flex items-center text-slate-500 hover:text-slate-800 transition">
        <ArrowLeft size={20} className="mr-2" /> Voltar aos Cursos
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="h-48 bg-slate-800 relative">
          <img src={course.imageUrl} className="w-full h-full object-cover opacity-50" alt="Cover" />
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <span className="bg-blue-600 text-xs px-2 py-1 rounded mb-2 inline-block">{course.category}</span>
            <h1 className="text-3xl font-bold">{course.title}</h1>
          </div>
        </div>
        <div className="p-6">
           <div className="prose prose-slate max-w-none">
              <h3 className="text-lg font-semibold mb-2">Sobre este curso</h3>
              <p className="whitespace-pre-line text-slate-600">{course.description}</p>
           </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-8 mb-4">
        <h3 className="text-xl font-bold text-slate-800">Materiais de Aprendizagem</h3>
        {canEdit && (
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 text-sm"
          >
            <Plus size={16} /> <span>Adicionar Recurso</span>
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
        {course.materials.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            Ainda não existem materiais disponíveis para este curso.
          </div>
        ) : (
          course.materials.map(mat => (
            <div key={mat.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-slate-100 rounded-lg">
                  {getIcon(mat.type)}
                </div>
                <div>
                  <h4 className="font-medium text-slate-800">{mat.title}</h4>
                  <p className="text-sm text-slate-500">{mat.description}</p>
                  {mat.type === 'QUIZ' && mat.contentUrl && mat.contentUrl.includes('{') && (
                      <span className="text-xs bg-purple-100 text-purple-700 px-1 rounded">IA Generated</span>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Aceder</button>
                {canEdit && (
                  <button onClick={() => onDeleteMaterial(course.id, mat.id)} className="text-red-400 hover:text-red-600 p-2">
                    <Trash size={16} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Material Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold mb-4">Novo Material</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Título</label>
                <input 
                  type="text" 
                  className="w-full border p-2 rounded" 
                  value={newMaterial.title || ''}
                  onChange={e => setNewMaterial({...newMaterial, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tipo</label>
                <select 
                  className="w-full border p-2 rounded"
                  value={newMaterial.type}
                  onChange={e => setNewMaterial({...newMaterial, type: e.target.value as any})}
                >
                  <option value="PDF">Documento PDF</option>
                  <option value="VIDEO">Vídeo</option>
                  <option value="LINK">Link Externo</option>
                  <option value="ASSIGNMENT">Trabalho de Grupo</option>
                  <option value="QUIZ">Ficha / Quiz</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Descrição</label>
                <textarea 
                  className="w-full border p-2 rounded h-20"
                  value={newMaterial.description || ''}
                  onChange={e => setNewMaterial({...newMaterial, description: e.target.value})}
                ></textarea>
              </div>
              
              {newMaterial.type === 'QUIZ' && (
                  <button 
                    onClick={handleAiQuiz}
                    disabled={isAiGenerating}
                    className="w-full py-2 bg-purple-100 text-purple-700 rounded border border-purple-200 hover:bg-purple-200 text-sm flex justify-center items-center"
                  >
                      {isAiGenerating ? 'A Pensar...' : 'Gerar Pergunta com IA'}
                  </button>
              )}

            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-slate-600">Cancelar</button>
              <button onClick={handleAdd} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Adicionar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};