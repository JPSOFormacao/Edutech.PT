import { Course, User, UserRole } from "./types";

export const MOCK_ADMIN_EMAIL = 'jpsoliveira.formacao@hotmail.com';

// Logótipo em formato SVG Data URI (Barrete de Graduação branco em fundo Azul)
export const APP_LOGO = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiI+PHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iOCIgZmlsbD0iIzI1NjNFQiIvPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQsNCkiPjxwYXRoIGQ9Ik0yMiAxMHY2TTIgMTBsMTAtNSAxMCA1LTEwIDUtMTAgNXoiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTYgMTJ2NWMzIDMgOSAzIDEyIDB2LTUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBmaWxsPSJub25lIi8+PC9nPjwvc3ZnPg==";

export const INITIAL_USERS: User[] = [
  {
    id: 'u1',
    name: 'João Oliveira',
    email: MOCK_ADMIN_EMAIL,
    role: UserRole.ADMIN,
    approved: true,
    coursesEnrolled: []
  },
  {
    id: 'u2',
    name: 'Maria Formadora',
    email: 'maria@edutech.pt',
    role: UserRole.EDITOR,
    approved: true,
    coursesEnrolled: []
  },
  {
    id: 'u3',
    name: 'Carlos Aluno',
    email: 'carlos@email.com',
    role: UserRole.STUDENT,
    approved: true,
    coursesEnrolled: ['c1']
  },
  {
    id: 'u4',
    name: 'Ana Pendente',
    email: 'ana@email.com',
    role: UserRole.STUDENT,
    approved: false,
    coursesEnrolled: []
  }
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'c1',
    title: 'Introdução à Inteligência Artificial',
    description: 'Aprenda os fundamentos da IA e como aplicar no dia-a-dia empresarial.',
    price: 150.00,
    imageUrl: 'https://picsum.photos/400/250?random=1',
    published: true,
    category: 'Tecnologia',
    materials: [
      { id: 'm1', title: 'Ficha de Diagnóstico Inicial', type: 'QUIZ', description: 'Avaliação de conhecimentos prévios.' },
      { id: 'm2', title: 'Manual do Formando (PDF)', type: 'PDF', description: 'Documentação completa do módulo 1.' }
    ]
  },
  {
    id: 'c2',
    title: 'Web Development com React',
    description: 'Curso intensivo para criar aplicações web modernas.',
    price: 300.00,
    imageUrl: 'https://picsum.photos/400/250?random=2',
    published: true,
    category: 'Programação',
    materials: []
  }
];