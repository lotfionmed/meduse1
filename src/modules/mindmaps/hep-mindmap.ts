import { MindMapNode, MindMapEdge } from './types';

export const hepMindMap = {
  interactive: true,
  title: 'Mind Map - Hepatit Viral',
  nodes: [
    {
      id: '1',
      type: 'input',
      data: { 
        label: 'Hepatit Viral',
        content: 'Description détaillée de Hepatit Viral'
      },
      position: { x: 400, y: 0 },
      style: {
        light: 'bg-primary-100 border-2 border-primary-500',
        dark: 'bg-primary-600 text-white'
      }
    },
    {
      id: '2',
      data: { 
        label: 'Définition',
        content: 'Définition complète et détaillée'
      },
      position: { x: 200, y: 100 },
      style: {
        light: 'bg-blue-100',
        dark: 'bg-blue-600 text-white'
      }
    },
    {
      id: '3',
      data: { 
        label: 'Physiopathologie',
        content: 'Mécanismes physiopathologiques'
      },
      position: { x: 600, y: 100 },
      style: {
        light: 'bg-emerald-100',
        dark: 'bg-emerald-600 text-white'
      }
    },
    {
      id: '4',
      data: { 
        label: 'Clinique',
        content: 'Présentation clinique'
      },
      position: { x: 400, y: 300 },
      style: {
        light: 'bg-amber-100',
        dark: 'bg-amber-600 text-white'
      }
    },
    {
      id: '5',
      data: { 
        label: 'Diagnostic',
        content: 'Démarche diagnostique'
      },
      position: { x: 200, y: 400 },
      style: {
        light: 'bg-purple-100',
        dark: 'bg-purple-600 text-white'
      }
    },
    {
      id: '6',
      data: { 
        label: 'Traitement',
        content: 'Approche thérapeutique'
      },
      position: { x: 600, y: 400 },
      style: {
        light: 'bg-rose-100',
        dark: 'bg-rose-600 text-white'
      }
    }
  ],
  edges: [
    {
      id: 'e1-2',
      source: '1',
      target: '2',
      animated: true,
      style: {
        light: '#3b82f6',
        dark: '#818cf8'
      }
    },
    {
      id: 'e1-3',
      source: '1',
      target: '3',
      animated: true,
      style: {
        light: '#10b981',
        dark: '#34d399'
      }
    },
    {
      id: 'e1-4',
      source: '1',
      target: '4',
      animated: true,
      style: {
        light: '#d97706',
        dark: '#fbbf24'
      }
    },
    {
      id: 'e4-5',
      source: '4',
      target: '5',
      style: {
        light: '#8b5cf6',
        dark: '#a78bfa'
      }
    },
    {
      id: 'e4-6',
      source: '4',
      target: '6',
      style: {
        light: '#f43f5e',
        dark: '#fb7185'
      }
    }
  ]
};