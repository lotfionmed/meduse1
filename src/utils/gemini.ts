import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyCBXl8IKYW6NkRQIfnNYpCBMcJvTrX7jdM');

// Fonction pour nettoyer et formater la réponse
const formatResponse = (text: string): string => {
  return text
    // Remplace les marqueurs markdown par du texte formaté HTML
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Nettoie les sauts de ligne multiples
    .replace(/\n{3,}/g, '\n\n')
    // Formate les listes
    .replace(/^\s*[-*]\s+/gm, '• ')
    // Formate les numéros de liste
    .replace(/^\s*(\d+)\.\s+/gm, '$1. ')
    // Nettoie les espaces multiples
    .replace(/\s{2,}/g, ' ')
    .trim();
};

// Détermine si la question nécessite une réponse détaillée
const needsDetailedResponse = (question: string): boolean => {
  const detailedQuestionPatterns = [
    /différence|difference/i,
    /expliquer?|explique/i,
    /comment/i,
    /pourquoi/i,
    /quelles? sont/i,
    /décris|decris|décrire|decrire/i,
    /détails?|details?/i
  ];
  
  return detailedQuestionPatterns.some(pattern => pattern.test(question));
};

const validateMedicalQuestion = async (question: string): Promise<boolean> => {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  const validationPrompt = `En tant qu'expert médical, évalue si la question suivante est liée au domaine médical ou de la santé.
Réponds uniquement par "OUI" si c'est une question médicale, ou "NON" si ce n'est pas une question médicale.

Question à évaluer : "${question}"

Critères d'évaluation :
- La question concerne-t-elle la santé, la médecine, l'anatomie, les maladies, les traitements, ou tout autre aspect médical ?
- La question nécessite-t-elle une expertise ou des connaissances médicales pour y répondre ?
- La question est-elle en rapport avec le bien-être physique ou mental d'un point de vue médical ?

Réponse (uniquement OUI ou NON):`;

  try {
    const result = await model.generateContent(validationPrompt);
    const response = await result.response;
    const answer = response.text().trim().toUpperCase();
    return answer === 'OUI';
  } catch (error) {
    console.error('Error validating medical question:', error);
    return false;
  }
};

const getSystemPrompt = (question: string): string => {
  const isDetailed = needsDetailedResponse(question);
  
  const basePrompt = `Tu es un assistant médical professionnel. Ton rôle est de fournir des informations médicales précises et ${isDetailed ? 'détaillées' : 'concises'}.

Directives de réponse :
${isDetailed ? `1. Structure ta réponse en 2-3 paragraphes maximum
2. Utilise des puces pour les points importants
3. Fournis des explications claires mais concises` 
: `1. Réponds en 1-2 phrases maximum
2. Va droit à l'essentiel
3. Évite les détails non essentiels`}

Règles importantes :
• Ne fais jamais de diagnostic
• Ne prescris jamais de traitement
• Reste factuel et précis
• Utilise un langage simple
${isDetailed ? '• Organise l\'information de manière logique' : '• Donne uniquement l\'information principale'}`;

  return basePrompt;
};

export const getGeminiResponse = async (prompt: string) => {
  try {
    const isMedical = await validateMedicalQuestion(prompt);
    
    if (!isMedical) {
      return formatResponse("Je suis spécialisé dans le domaine médical et de la santé. Je ne peux pas répondre à cette question car elle ne relève pas de mon domaine d'expertise. N'hésitez pas à me poser une question en lien avec la santé ou la médecine.");
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const systemPrompt = getSystemPrompt(prompt);
    const fullPrompt = `${systemPrompt}\n\nQuestion : ${prompt}\n\nRéponse courte et précise :`;
    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    
    const formattedResponse = formatResponse(response.text());
    return formattedResponse + "\n\n<em>Note : Cette information est fournie à titre éducatif uniquement et ne remplace pas l'avis d'un professionnel de santé.</em>";
  } catch (error) {
    console.error('Error with Gemini API:', error);
    return formatResponse('Désolé, je ne peux pas répondre pour le moment. Veuillez réessayer plus tard.');
  }
};
