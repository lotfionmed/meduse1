import jsPDF from 'jspdf';
import { Module } from '../types';
import { addMeduseLogo } from './pdfLogo';

export const generateModuleContentPDF = (module: Module, isDarkMode: boolean) => {
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

  // Couleurs professionnelles
  const colors = {
    primary: '#2563eb',
    secondary: '#3b82f6',
    text: '#1f2937',
    lightGray: '#e5e7eb',
    white: '#ffffff',
    background: '#eff6ff'
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

  const addSectionTitle = (title: string, y: number, level: 1 | 2 | 3 = 1) => {
    if (y > pageHeight - 40) {
      pdf.addPage();
      y = margin;
    }

    // Fond coloré pour les titres
    pdf.setFillColor(colors.primary);
    pdf.setGState(new pdf.GState({ opacity: 0.05 }));
    const titleHeight = level === 1 ? 20 : level === 2 ? 16 : 14;
    pdf.roundedRect(margin - 5, y - titleHeight + 4, contentWidth + 10, titleHeight, 3, 3, 'F');
    pdf.setGState(new pdf.GState({ opacity: 1 }));

    // Titre
    pdf.setTextColor(colors.primary);
    pdf.setFontSize(level === 1 ? 24 : level === 2 ? 18 : 14);
    pdf.setFont('helvetica', 'bold');
    pdf.text(title, margin, y);

    return y + titleHeight + (level === 1 ? 15 : 10);
  };

  // Page de couverture
  pdf.setFillColor(colors.primary);
  pdf.setGState(new pdf.GState({ opacity: 0.1 }));
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');
  pdf.setGState(new pdf.GState({ opacity: 1 }));

  // Logo et titre sur la couverture
  addMeduseLogo(pdf, pageWidth/2 - 20, pageHeight/3 - 40, 40);

  pdf.setTextColor(colors.primary);
  pdf.setFontSize(40);
  pdf.setFont('helvetica', 'bold');
  const titleY = pageHeight / 2 - 20;
  pdf.text('MEDUSE', pageWidth / 2, titleY, { align: 'center' });

  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'normal');
  pdf.text(module.title, pageWidth / 2, titleY + 20, { align: 'center' });

  // Date sur la couverture
  const date = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  pdf.setFontSize(12);
  pdf.text(date, pageWidth / 2, pageHeight - 30, { align: 'center' });

  // Nouvelle page pour la table des matières
  pdf.addPage();
  yPosition = margin;

  // Table des matières
  yPosition = addSectionTitle('Table des matières', yPosition);
  yPosition += 10;

  module.chapters.forEach((chapter, chapterIndex) => {
    pdf.setTextColor(colors.text);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    const chapterTitle = `Chapitre ${chapterIndex + 1}: ${chapter.title}`;
    pdf.text(chapterTitle, margin, yPosition);
    yPosition += 10;

    chapter.courses.forEach((course, courseIndex) => {
      pdf.setFont('helvetica', 'normal');
      const courseTitle = `   ${courseIndex + 1}. ${course.title}`;
      pdf.text(courseTitle, margin, yPosition);
      yPosition += 8;
    });

    yPosition += 5;
  });

  // Contenu principal
  module.chapters.forEach((chapter, chapterIndex) => {
    pdf.addPage();
    yPosition = margin;

    // Titre du chapitre
    yPosition = addSectionTitle(`Chapitre ${chapterIndex + 1}: ${chapter.title}`, yPosition, 1);

    // Parcourir les cours
    chapter.courses.forEach((course, courseIndex) => {
      if (yPosition > pageHeight - 60) {
        pdf.addPage();
        yPosition = margin;
      }

      // Titre du cours
      yPosition = addSectionTitle(`${courseIndex + 1}. ${course.title}`, yPosition, 2);

      // Définition
      if (course.content?.definition) {
        pdf.setFillColor(colors.background);
        pdf.setGState(new pdf.GState({ opacity: 0.2 }));
        const defLines = pdf.splitTextToSize(course.content.definition, contentWidth - 20);
        const defHeight = defLines.length * lineHeight + 10;
        pdf.roundedRect(margin - 5, yPosition - 5, contentWidth + 10, defHeight, 3, 3, 'F');
        pdf.setGState(new pdf.GState({ opacity: 1 }));

        pdf.setTextColor(colors.text);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');
        yPosition = addWrappedText(course.content.definition, yPosition) + 15;
      }

      // Points clés
      if (course.content?.normalMode?.questions) {
        yPosition = addSectionTitle('Points clés', yPosition, 3);

        course.content.normalMode.questions.forEach((qa, qaIndex) => {
          // Question
          pdf.setTextColor(colors.primary);
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          pdf.text(`${qaIndex + 1}.`, margin, yPosition);
          yPosition = addWrappedText(qa.question, yPosition + 5, contentWidth - 15) + 5;

          // Réponse
          pdf.setFillColor(colors.background);
          pdf.setGState(new pdf.GState({ opacity: 0.2 }));
          const answerLines = pdf.splitTextToSize(qa.answer, contentWidth - 20);
          const answerHeight = answerLines.length * lineHeight + 10;
          pdf.roundedRect(margin - 5, yPosition - 5, contentWidth + 10, answerHeight, 3, 3, 'F');
          pdf.setGState(new pdf.GState({ opacity: 1 }));

          pdf.setTextColor(colors.text);
          pdf.setFont('helvetica', 'normal');
          yPosition = addWrappedText(qa.answer, yPosition) + 15;
        });
      }

      yPosition += 10;
    });
  });

  // Numéros de page et en-têtes
  const pageCount = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);

    if (i > 1) { // Skip the cover page
      // En-tête discret
      pdf.setFillColor(colors.primary);
      pdf.setGState(new pdf.GState({ opacity: 0.05 }));
      pdf.rect(0, 0, 15, pageHeight, 'F');
      pdf.setGState(new pdf.GState({ opacity: 1 }));
      
      // Logo miniature dans l'en-tête
      addMeduseLogo(pdf, margin, 5, 8);
      
      pdf.setTextColor(colors.primary);
      pdf.setFontSize(10);
      pdf.text('MEDUSE', margin + 12, 10);
      pdf.text(module.title, pageWidth - margin, 10, { align: 'right' });

      // Pied de page
      pdf.setDrawColor(colors.lightGray);
      pdf.setLineWidth(0.5);
      pdf.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);

      pdf.setTextColor(colors.text);
      pdf.text(`Page ${i} sur ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    }
  }

  return pdf;
};