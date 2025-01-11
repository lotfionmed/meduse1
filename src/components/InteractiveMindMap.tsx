import React, { useCallback, useState } from 'react';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  ConnectionMode,
  addEdge,
  Node
} from 'reactflow';
import 'reactflow/dist/style.css';
import { MindMap } from '../modules/mindmaps/types';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface InteractiveMindMapProps {
  isDarkMode: boolean;
  mindMap: MindMap;
}

const InteractiveMindMap: React.FC<InteractiveMindMapProps> = ({ isDarkMode, mindMap }) => {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  if (!mindMap?.nodes || !mindMap?.edges) {
    return null;
  }

  const initialNodes = mindMap.nodes.map(node => ({
    ...node,
    className: `p-4 rounded-lg shadow-lg ${isDarkMode ? node.style.dark : node.style.light}`,
  }));

  const initialEdges = mindMap.edges.map(edge => ({
    ...edge,
    style: { stroke: isDarkMode ? edge.style.dark : edge.style.light }
  }));

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params: any) => {
    setEdges((eds) => addEdge(params, eds));
  }, [setEdges]);

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  };

  return (
    <div className="relative w-full h-[600px]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        connectionMode={ConnectionMode.Loose}
        fitView
        attributionPosition="bottom-right"
      >
        <Background 
          color={isDarkMode ? '#374151' : '#e5e7eb'} 
          gap={16} 
          size={1}
        />
        <Controls />
      </ReactFlow>

      <AnimatePresence>
        {selectedNode && selectedNode.data.content && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`absolute top-4 right-4 w-96 p-6 rounded-xl shadow-2xl backdrop-blur-sm ${
              isDarkMode 
                ? 'bg-gray-800/95 text-white border border-gray-700' 
                : 'bg-white/95 text-gray-900 border border-gray-200'
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                {selectedNode.data.label}
              </h3>
              <button
                onClick={() => setSelectedNode(null)}
                className={`p-1.5 rounded-lg transition-colors duration-300 ${
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className={`prose ${isDarkMode ? 'prose-invert' : ''} max-w-none`}>
              <div className={`text-base leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {selectedNode.data.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-3">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
            {selectedNode.data.examples && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-medium mb-2 text-blue-500">Exemples :</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {selectedNode.data.examples.map((example: string, index: number) => (
                    <li key={index} className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {example}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InteractiveMindMap;