import React, { useState } from 'react';
import CourseCard from './CourseCard';
import { AlertCircle } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  image: string;
  content?: {
    definition?: string;
    types?: string[];
    clinicalSigns?: string[];
    diagnosis?: string[];
    treatment?: string;
  };
}

interface Section {
  title: string;
  courses: Course[];
}

interface ModuleProps {
  module: {
    id: number;
    title: string;
    icon: string;
    sections: Section[];
  };
  isDarkMode: boolean;
}

const ModuleSection: React.FC<ModuleProps> = ({ module, isDarkMode }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    console.warn(`Failed to load icon for module: ${module.title}`);
    setImageError(true);
  };

  return (
    <section className="mb-12">
      <div className="flex items-center mb-6">
        {imageError ? (
          <AlertCircle 
            className={`h-8 w-8 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} 
          />
        ) : (
          <img 
            src={module.icon} 
            alt={`${module.title} icon`}
            onError={handleImageError}
            className={`h-8 w-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} 
          />
        )}
        <h2 className={`ml-3 text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {module.title}
        </h2>
      </div>
      {module.sections.map((section, index) => (
        <div key={index} className="mb-8">
          <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            {section.title}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {section.courses.map((course, courseIndex) => (
              <CourseCard 
                key={courseIndex} 
                course={course} 
                isDarkMode={isDarkMode} 
              />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};

export default ModuleSection;