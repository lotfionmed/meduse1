import jsPDF from 'jspdf';
import { addMeduseLogo } from './pdfLogo';

interface CourseContent {
  title: string;
  definition?: string;
  questions?: Array<{
    question: string;
    answer: string;
  }>;
  keywords?: Array<{
    term: string;
    definition: string;
  }>;
}

export const generateCoursePDF = (content: CourseContent, isDarkMode: boolean) => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Configuration
  const pageWidth = pdf.internal.pageSize.width;
  const pageHeight = pdf.internal.pageSize.height;
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  const lineHeight = 7;
  let yPosition = margin;

  // Couleurs
  const colors = {
    primary: '#7e22ce',
    secondary: '#9333ea',
    text: '#1f2937',
    lightGray: '#e5e7eb',
    white: '#ffffff',
    background: '#f3e8ff'
  };

  // Fonctions utilitaires
  const addWrappedText = (text: string, y: number, maxWidth: number = contentWidth, fontSize: number = 12) => {
    pdf.setFontSize(fontSize);
    const lines = pdf.splitTextToSize(text, maxWidth);
    let currentY = y;
    
    lines.forEach((line: string) => {
      if (currentY > pageHeight - margin) {
        pdf.addPage();
        currentY = margin;
      }
      pdf.text(line, margin, currentY);
      currentY += lineHeight * (fontSize / 12);
    });
    
    return currentY;
  };

  const addSectionTitle = (title: string, y: number) => {
    if (y > pageHeight - 40) {
      pdf.addPage();
      y = margin;
    }

    // Fond coloré pour le titre
    pdf.setFillColor(colors.primary);
    pdf.setGState(new pdf.GState({ opacity: 0.1 }));
    pdf.roundedRect(margin - 5, y - 12, contentWidth + 10, 20, 3, 3, 'F');
    pdf.setGState(new pdf.GState({ opacity: 1 }));

    // Titre
    pdf.setTextColor(colors.primary);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text(title, margin, y);

    return y + 20;
  };

  // En-tête
  pdf.setFillColor(colors.primary);
  pdf.rect(0, 0, pageWidth, 40, 'F');

  // Logo et titre
  addMeduseLogo(pdf, margin, 12, 12);
  
  pdf.setTextColor(colors.white);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('MEDUSE', margin + 16, 28);

  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Plateforme d\'apprentissage médical', margin + 16, 35);

  // Date
  const date = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  pdf.setFontSize(10);
  pdf.text(date, pageWidth - margin - pdf.getTextWidth(date), 35);

  // Titre du cours
  yPosition = 60;
  pdf.setTextColor(colors.primary);
  pdf.setFontSize(22);
  pdf.setFont('helvetica', 'bold');
  yPosition = addWrappedText(content.title, yPosition, contentWidth, 22) + 10;

  // Définition
  if (content.definition) {
    yPosition = addSectionTitle('Définition', yPosition);
    pdf.setTextColor(colors.text);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    yPosition = addWrappedText(content.definition, yPosition) + 15;
  }

  // Questions et réponses
  if (content.questions && content.questions.length > 0) {
    yPosition = addSectionTitle('Points clés du cours', yPosition);

    content.questions.forEach((qa, index) => {
      if (yPosition > pageHeight - 60) {
        pdf.addPage();
        yPosition = margin;
      }

      // Question
      pdf.setTextColor(colors.primary);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      yPosition = addWrappedText(qa.question, yPosition + 5, contentWidth - 20, 14) + 5;

      // Réponse
      pdf.setFillColor(colors.background);
      pdf.setGState(new pdf.GState({ opacity: 0.3 }));
      const responseLines = pdf.splitTextToSize(qa.answer, contentWidth - 20);
      const responseHeight = responseLines.length * lineHeight + 10;
      pdf.roundedRect(margin - 5, yPosition - 5, contentWidth + 10, responseHeight, 3, 3, 'F');
      pdf.setGState(new pdf.GState({ opacity: 1 }));

      pdf.setTextColor(colors.text);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      yPosition = addWrappedText(qa.answer, yPosition, contentWidth - 20) + 15;

      // Séparateur
      if (index < content.questions.length - 1) {
        pdf.setDrawColor(colors.lightGray);
        pdf.setLineWidth(0.5);
        pdf.line(margin, yPosition - 5, pageWidth - margin, yPosition - 5);
        yPosition += 10;
      }
    });
  }

  // Lexique
  if (content.keywords && content.keywords.length > 0) {
    pdf.addPage();
    yPosition = margin;

    // En-tête du lexique
    pdf.setFillColor(colors.primary);
    pdf.rect(0, 0, pageWidth, 40, 'F');
    
    // Logo dans l'en-tête du lexique
    addMeduseLogo(pdf, margin, 12, 12);
    
    pdf.setTextColor(colors.white);
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Lexique', margin + 16, 28);

    yPosition = 60;
    content.keywords.forEach((keyword, index) => {
      if (yPosition > pageHeight - 60) {
        pdf.addPage();
        yPosition = margin;
      }

      // Terme
      pdf.setFillColor(colors.background);
      pdf.setGState(new pdf.GState({ opacity: 0.3 }));
      pdf.roundedRect(margin - 5, yPosition - 8, contentWidth + 10, 35, 3, 3, 'F');
      pdf.setGState(new pdf.GState({ opacity: 1 }));

      pdf.setTextColor(colors.primary);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      yPosition = addWrappedText(keyword.term, yPosition, contentWidth, 14) + 5;

      // Définition
      pdf.setTextColor(colors.text);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      yPosition = addWrappedText(keyword.definition, yPosition) + 15;
    });
  }

  // Pied de page sur chaque page
  const pageCount = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    
    // Ligne de séparation
    pdf.setDrawColor(colors.lightGray);
    pdf.setLineWidth(0.5);
    pdf.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);

    // Logo miniature dans le pied de page
    addMeduseLogo(pdf, margin, pageHeight - 13, 8);

    // Numéro de page
    pdf.setTextColor(colors.text);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    const pageText = `Page ${i} sur ${pageCount}`;
    pdf.text(pageText, pageWidth / 2, pageHeight - 10, { align: 'center' });

    // Filigrane
    pdf.setTextColor(colors.lightGray);
    pdf.setFontSize(60);
    pdf.setFont('helvetica', 'bold');
    pdf.setGState(new pdf.GState({ opacity: 0.03 }));
    pdf.text('MEDUSE', pageWidth / 2, pageHeight / 2, { align: 'center' });
    pdf.setGState(new pdf.GState({ opacity: 1 }));
  }

  return pdf;
};