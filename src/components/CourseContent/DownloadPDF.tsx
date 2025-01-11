import React from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { generateCoursePDF } from '../../utils/pdfGenerator';
import { generateClinicalCasePDF } from '../../utils/clinicalPdfGenerator';

interface DownloadPDFProps {
  courseTitle: string;
  isDarkMode: boolean;
  contentRef: React.RefObject<HTMLDivElement>;
  course: any;
  isClinicalMode: boolean;
}

const DownloadPDF: React.FC<DownloadPDFProps> = ({ 
  courseTitle, 
  isDarkMode, 
  course,
  isClinicalMode
}) => {
  const [isGenerating, setIsGenerating] = React.useState(false);

  const generatePDF = async () => {
    setIsGenerating(true);
    
    try {
      if (isClinicalMode && course.content?.clinicalMode?.cases?.[0]) {
        // Générer le PDF du cas clinique
        const clinicalCase = course.content.clinicalMode.cases[0];
        const pdf = generateClinicalCasePDF(clinicalCase, isDarkMode);
        pdf.save(`cas-clinique-${courseTitle.toLowerCase().replace(/\s+/g, '-')}.pdf`);
      } else {
        // Générer le PDF du cours normal
        const content = {
          title: courseTitle,
          definition: course.content?.definition,
          questions: course.content?.normalMode?.questions,
          keywords: course.content?.normalMode?.keywords
        };
        const pdf = generateCoursePDF(content, isDarkMode);
        pdf.save(`${courseTitle.toLowerCase().replace(/\s+/g, '-')}.pdf`);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-center mt-8 mb-4"
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={generatePDF}
        disabled={isGenerating}
        className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors duration-300 ${
          isDarkMode
            ? isClinicalMode
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
              : 'bg-primary-600 hover:bg-primary-500 text-white'
            : isClinicalMode
              ? 'bg-emerald-500 hover:bg-emerald-400 text-white'
              : 'bg-primary-500 hover:bg-primary-400 text-white'
        } ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <Download className="h-5 w-5" />
        <span>{isGenerating ? 'Génération du PDF...' : 'Télécharger en PDF'}</span>
      </motion.button>
    </motion.div>
  );
};

export default DownloadPDF;