import { jsPDF } from 'jspdf';

export const addMeduseLogo = (pdf: jsPDF, x: number, y: number, size: number = 10) => {
  // Sauvegarder l'état actuel
  pdf.saveGraphicsState();

  // Définir la couleur en noir et l'épaisseur du trait
  pdf.setFillColor(0, 0, 0);
  pdf.setDrawColor(0, 0, 0);
  pdf.setLineWidth(size/10);

  // Calculer le centre et le rayon du cercle extérieur
  const centerX = x + size/2;
  const centerY = y + size/2;
  const radiusOuter = size/2;

  // Dessiner le cercle extérieur
  pdf.circle(centerX, centerY, radiusOuter, 'S');

  // Calculer le centre et le rayon du cercle intérieur
  const radiusInner = radiusOuter * 0.55; // Augmentation légère du rayon
  
  // Calculer l'angle pour la position 14h (environ 60 degrés)
  const angle = 60 * Math.PI / 180; // Conversion degrés en radians
  
  // Calculer la position du centre du cercle intérieur
  const distance = radiusOuter - radiusInner; // Distance entre les centres
  const innerCenterX = centerX + distance * Math.sin(angle);
  const innerCenterY = centerY - distance * Math.cos(angle);

  // Dessiner le cercle intérieur
  pdf.circle(innerCenterX, innerCenterY, radiusInner, 'S');

  // Restaurer l'état précédent
  pdf.restoreGraphicsState();

  return pdf;
};