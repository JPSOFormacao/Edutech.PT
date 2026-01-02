import React from 'react';
import { User, UserRole } from '../types';
import { Check, X, Shield, ShieldAlert, User as UserIcon } from 'lucide-react';

interface UserManagementProps {
  users: User[];
  onUpdateUserRole: (id: string, role: UserRole) => void;
  onApproveUser: (id: string) => void;
  onDeleteUser: (id: string) => void;
}

export const UserManagement: React.FC<UserManagementProps> = ({ 
  users, 
  onUpdateUserRole, 
  onApproveUser,
  onDeleteUser 
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">Gestão de Utilizadores</h2>
           <p className="text-slate-500">Aprovar acessos e definir permissões.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Nome / Email</th>
                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Estado</th>
                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Cargo</th>
                <th className="px-6 py-4 font-semibold text-slate-700 text-sm text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 mr-3">
                        <span className="font-bold">{user.name.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{user.name}</div>
                        <div className="text-sm text-slate-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {user.approved ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Aprovado
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Pendente
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                     <select 
                      value={user.role}
                      onChange={(e) => onUpdateUserRole(user.id, e.target.value as UserRole)}
                      className="text-sm border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 py-1"
                      disabled={user.email === 'jpsoliveira.formacao@hotmail.com'} // Prevent changing main admin
                     >
                        <option value={UserRole.STUDENT}>Aluno</option>
                        <option value={UserRole.EDITOR}>Formador/Editor</option>
                        <option value={UserRole.ADMIN}>Administrador</option>
                     </select>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {!user.approved && (
                      <button 
                        onClick={() => onApproveUser(user.id)}
                        className="text-green-600 hover:bg-green-50 p-1.5 rounded transition" 
                        title="Aprovar Acesso"
                      >
                        <Check size={18} />
                      </button>
                    )}
                    {user.email !== 'jpsoliveira.formacao@hotmail.com' && (
                        <button 
                            onClick={() => onDeleteUser(user.id)}
                            className="text-red-500 hover:bg-red-50 p-1.5 rounded transition"
                            title="Remover Utilizador"
                        >
                            <X size={18} />
                        </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};