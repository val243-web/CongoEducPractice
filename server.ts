import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize GenAI
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY non configurée dans process.env');
  }
  return new GoogleGenAI({
    apiKey: apiKey || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}
// 1. API: Générer des questions diagnostiques sur la compétence
app.post('/api/generate-questions', async (req, res) => {
  try {
    const { skillName } = req.body;
    if (!skillName || typeof skillName !== 'string') {
      return res.status(400).json({ error: 'Le nom de la compétence est requis.' });
    }

    const ai = getGenAI();
    const prompt = `L'utilisateur souhaite apprendre la compétence pratique suivante : "${skillName}".
Afin de lui concevoir une feuille de route ultra-personnalisée, un emploi du temps sur mesure avec YouTube et la liste des matériels nécessaires, génère exactement 3 questions diagnostiques en français pour cerner :
1. Son niveau actuel ou son expérience préalable liée (Débutant total, intermédiaire...).
2. Sa disponibilité hebdomadaire exacte (ex: 3h par semaine, 1h par jour le soir, weekends uniquement).
3. Ses contraintes matérielles ou son objectif final concret (ex: budget maxi, projet final visé).

Réponds exclusivement en format JSON valide respectant ce schéma.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              questionText: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ['id', 'questionText', 'options'],
          },
        },
      },
    });

    const text = response.text || '[]';
    const questions = JSON.parse(text);
    return res.json({ questions });
  } catch (error: any) {
    console.error('Erreur generate-questions:', error);
    return res.status(500).json({
      error: error?.message || 'Erreur lors de la génération des questions diagnostiques.',
    });
  }
});

// 1.b API: Régénérer une question en cas d'échec (Question dynamique)
app.post('/api/regenerate-question', async (req, res) => {
  try {
    const { skillName, phaseTitle, failedQuestionText } = req.body;
    if (!skillName) {
      return res.status(400).json({ error: 'Le nom de la compétence est requis.' });
    }

    const ai = getGenAI();
    const isDevSkill = /dev|programmation|code|javascript|react|python|web|html|css|informatique/i.test(skillName);

    const prompt = `Tu es l'assistant pédagogique Gemma 4 pour la compétence "${skillName}", phase "${phaseTitle || 'Pratique'}".
L'utilisateur a échoué à la question suivante : "${failedQuestionText || ''}".
Génère une TOUTE NOUVELLE QUESTION PÉDAGOGIQUE DIFFÉRENTE (ne répète PAS la même question).
La nouvelle question doit porter sur le même sujet mais aborder un angle ou un cas pratique différent.
${isDevSkill ? 'S\'il s\'agit de développement informatique, tu peux proposer soit un QCM soit un exercice pratique de code avec "type": "code", "initialCode" et "codeInstructions".' : ''}

Format JSON requis :
{
  "questionText": "Texte de la nouvelle question...",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctOptionIndex": 0,
  "explanation": "Explication claire de la bonne réponse...",
  "type": "${isDevSkill ? 'code' : 'mcq'}",
  "initialCode": "${isDevSkill ? '// Tapez votre code ici' : ''}",
  "codeInstructions": "${isDevSkill ? 'Instructions pour l\'exercice de code' : ''}"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    const newQuestionData = JSON.parse(text);

    return res.json({
      question: {
        id: 'quiz-regen-' + Date.now(),
        questionText: newQuestionData.questionText || 'Nouvelle question pratique :',
        options: newQuestionData.options || ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        correctOptionIndex: newQuestionData.correctOptionIndex ?? 0,
        explanation: newQuestionData.explanation || 'Explication de Gemma.',
        type: newQuestionData.type || 'mcq',
        initialCode: newQuestionData.initialCode,
        codeInstructions: newQuestionData.codeInstructions,
      },
    });
  } catch (error: any) {
    console.error('Erreur regenerate-question:', error);
    return res.status(500).json({ error: error?.message || 'Erreur régénération question.' });
  }
});

// 1.c API: Évaluer du code dans l'IDE pour les questions informatiques
app.post('/api/evaluate-code', async (req, res) => {
  try {
    const { skillName, questionText, userCode, expectedKeywords } = req.body;
    if (!userCode) {
      return res.status(400).json({ error: 'Le code est requis.' });
    }

    const ai = getGenAI();
    const prompt = `Tu es un compilateur & tuteur informatique Gemma 4 pour la compétence "${skillName || 'Dev'}".
Évalue le code écrit par l'étudiant pour répondre au problème suivant :
Problème / Consigne : "${questionText}"
Code de l'étudiant :
\`\`\`
${userCode}
\`\`\`

Analyse la syntaxe, la logique, et détermine si le code fonctionne et résout la consigne.
Réponds exclusivement sous forme d'un JSON valide :
{
  "passed": true / false,
  "simulatedOutput": "Sortie console estimée (ex: 'Bonjour Valery' ou 'Erreur de syntaxe à la ligne 2')",
  "feedback": "Commentaire pédagogique détaillé et bienveillant expliquant ce qui est bon ou à corriger.",
  "improvedCode": "Code corrigé si nécessaire"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    const evaluation = JSON.parse(text);

    return res.json({ evaluation });
  } catch (error: any) {
    console.error('Erreur evaluate-code:', error);
    return res.status(500).json({ error: error?.message || 'Erreur lors de l\'évaluation du code.' });
  }
});

// 1.d API: Générer des illustrations visuelles pédagogiques
app.post('/api/generate-illustration', async (req, res) => {
  try {
    const { prompt, skillName } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Le prompt visuel est requis.' });
    }

    const ai = getGenAI();
    // Demander à Gemini de fournir un schéma explicatif SVG ou une description visuelle enrichie
    const fullPrompt = `Crée un schéma explicatif ou une illustration pédagogique en code SVG valide pour le concept : "${prompt}" dans le contexte de "${skillName || 'Apprentissage'}".
Le SVG doit être propre, coloré, moderne, lisible et autonome (largeur 500px, hauteur 350px).
Retourne uniquement le code SVG sans balises markdown ni texte autour.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: fullPrompt,
    });

    const svgText = (response.text || '').replace(/```xml|```svg|```/gi, '').trim();

    return res.json({ svgContent: svgText });
  } catch (error: any) {
    console.error('Erreur generate-illustration:', error);
    return res.status(500).json({ error: error?.message || 'Erreur génération illustration.' });
  }
});

// 2. API: Générer le plan d'apprentissage complet (Feuille de route, Matériels, Emploi du Temps YouTube)
app.post('/api/generate-plan', async (req, res) => {
  try {
    const { skillName, level, answers, availability, extraGoal } = req.body;
    if (!skillName) {
      return res.status(400).json({ error: 'Le nom de la compétence est requis.' });
    }

    const ai = getGenAI();

    const isDevSkill = /dev|programmation|code|javascript|react|python|web|html|css|informatique/i.test(skillName);

    const prompt = `Tu es l'agent IA "Gemma 4", tuteur pédagogique expert mondial sur CongoPraticEduc.
Conçois un plan de formation complet et ultra-pratique en français pour apprendre : "${skillName}".

Informations utilisateur :
- Niveau auto-évalué : ${level || 'Débutant'}
- Réponses au diagnostic : ${JSON.stringify(answers || {})}
- Disponibilité spécifiée : ${availability || '4 à 6 heures par semaine'}
- Objectif / Précisions : ${extraGoal || 'Maîtrise pratique autonome'}

IMPORTANT SUR LES QUIZ : Pour CHAQUE PHASE, tu DOIS générer AU MOINS 4 QUESTIONS de vérification combinant théorique ET cas pratiques réels (ou exercices de code avec "type": "code", "initialCode" et "codeInstructions" si c'est du développement web/informatique).

Tu dois retourner un objet JSON complet contenant :
1. "summary": un résumé motivant et clair du parcours (2-3 phrases).
2. "skillLevel": "${level || 'debutant'}".
3. "totalEstimatedWeeks": nombre de semaines estimé (ex: 4, 6, 8, 12).
4. "totalHoursPerWeek": heures par semaine prévues (ex: 5).
5. "materials": liste détaillée de TOUS les équipements, outils, logiciels ou fournitures physiques/numériques nécessaires.
6. "phases": 3 à 4 phases d'apprentissage progressives. Chaque phase a:
   - phaseNumber: 1, 2, 3...
   - title: titre accrocheur
   - durationWeeks: durée en semaines
   - objective: objectif d'apprentissage mesurable
   - steps: 2 à 4 étapes concrètes par phase.
   - quiz: EXACTEMENT 4 questions de validation par phase (questionText, options [4 choix], correctOptionIndex (0..3), explanation, type ("mcq" ou "code"), initialCode si type=code, codeInstructions si type=code).
7. "weeklySchedule": un emploi du temps hebdomadaire type sur 1 à 2 semaines adaptées à sa disponibilité.
8. "youtubeResources": guide des requêtes YouTube ciblées pour les moments clés.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            skillLevel: { type: Type.STRING },
            totalEstimatedWeeks: { type: Type.INTEGER },
            totalHoursPerWeek: { type: Type.INTEGER },
            materials: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  category: { type: Type.STRING },
                  estimatedCost: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
                required: ['name', 'category', 'estimatedCost', 'description'],
              },
            },
            phases: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phaseNumber: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  durationWeeks: { type: Type.INTEGER },
                  objective: { type: Type.STRING },
                  steps: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        estimatedHours: { type: Type.INTEGER },
                        outputDeliverable: { type: Type.STRING },
                      },
                      required: ['title', 'description', 'estimatedHours', 'outputDeliverable'],
                    },
                  },
                  quiz: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        questionText: { type: Type.STRING },
                        options: {
                          type: Type.ARRAY,
                          items: { type: Type.STRING },
                        },
                        correctOptionIndex: { type: Type.INTEGER },
                        explanation: { type: Type.STRING },
                        type: { type: Type.STRING },
                        initialCode: { type: Type.STRING },
                        codeInstructions: { type: Type.STRING },
                      },
                      required: ['questionText', 'options', 'correctOptionIndex', 'explanation'],
                    },
                  },
                },
                required: ['phaseNumber', 'title', 'durationWeeks', 'objective', 'steps', 'quiz'],
              },
            },
            weeklySchedule: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  weekNumber: { type: Type.INTEGER },
                  theme: { type: Type.STRING },
                  days: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        dayName: { type: Type.STRING },
                        timeSlot: { type: Type.STRING },
                        topic: { type: Type.STRING },
                        activityDescription: { type: Type.STRING },
                        youtubeQuery: { type: Type.STRING },
                        keyChannelIdeas: {
                          type: Type.ARRAY,
                          items: { type: Type.STRING },
                        },
                      },
                      required: [
                        'dayName',
                        'timeSlot',
                        'topic',
                        'activityDescription',
                        'youtubeQuery',
                      ],
                    },
                  },
                },
                required: ['weekNumber', 'theme', 'days'],
              },
            },
            youtubeResources: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  topicTitle: { type: Type.STRING },
                  searchQuery: { type: Type.STRING },
                  recommendedDuration: { type: Type.STRING },
                  targetContentDescription: { type: Type.STRING },
                  suggestedKeywords: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ['topicTitle', 'searchQuery', 'recommendedDuration', 'targetContentDescription'],
              },
            },
          },
          required: [
            'summary',
            'skillLevel',
            'totalEstimatedWeeks',
            'totalHoursPerWeek',
            'materials',
            'phases',
            'weeklySchedule',
            'youtubeResources',
          ],
        },
      },
    });

    const text = response.text || '{}';
    const parsedData = JSON.parse(text);

    // Formater et ajouter des IDs uniques
    const generatedPlan = {
      id: 'plan-' + Date.now(),
      skillName,
      summary: parsedData.summary,
      skillLevel: level || 'debutant',
      totalEstimatedWeeks: parsedData.totalEstimatedWeeks || 6,
      totalHoursPerWeek: parsedData.totalHoursPerWeek || 5,
      createdAt: new Date().toISOString(),
      userAvailabilityNote: availability,
      imageUrl: isDevSkill
        ? 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80'
        : 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
      category: isDevSkill ? 'Informatique & Web' : 'Savoir-Faire Pratique',
      materials: (parsedData.materials || []).map((m: any, idx: number) => ({
        id: `mat-${idx}-${Date.now()}`,
        name: m.name,
        category: m.category || 'Indispensable',
        estimatedCost: m.estimatedCost || 'N/A',
        description: m.description || '',
        isAcquired: false,
      })),
      phases: (parsedData.phases || []).map((p: any, pIdx: number) => ({
        id: `phase-${pIdx}-${Date.now()}`,
        phaseNumber: p.phaseNumber || pIdx + 1,
        title: p.title,
        durationWeeks: p.durationWeeks || 2,
        objective: p.objective || '',
        isUnlocked: pIdx === 0,
        isCompleted: false,
        steps: (p.steps || []).map((s: any, sIdx: number) => ({
          id: `step-${pIdx}-${sIdx}-${Date.now()}`,
          title: s.title,
          description: s.description,
          estimatedHours: s.estimatedHours || 2,
          outputDeliverable: s.outputDeliverable || 'Pratique effectuée',
          isCompleted: false,
        })),
        quiz: (p.quiz || []).map((q: any, qIdx: number) => ({
          id: `quiz-${pIdx}-${qIdx}-${Date.now()}`,
          questionText: q.questionText,
          options: q.options || [],
          correctOptionIndex: q.correctOptionIndex ?? 0,
          explanation: q.explanation || '',
          type: q.type || (q.initialCode ? 'code' : 'mcq'),
          initialCode: q.initialCode,
          codeInstructions: q.codeInstructions,
        })),
      })),
      weeklySchedule: (parsedData.weeklySchedule || []).map((w: any) => ({
        weekNumber: w.weekNumber || 1,
        theme: w.theme || 'Plan de travail',
        days: (w.days || []).map((d: any, dIdx: number) => ({
          id: `day-${dIdx}-${Date.now()}`,
          dayName: d.dayName,
          timeSlot: d.timeSlot,
          topic: d.topic,
          activityDescription: d.activityDescription,
          youtubeQuery: d.youtubeQuery,
          keyChannelIdeas: d.keyChannelIdeas || [],
          isDone: false,
        })),
      })),
      youtubeResources: (parsedData.youtubeResources || []).map((y: any, yIdx: number) => ({
        id: `yt-${yIdx}-${Date.now()}`,
        topicTitle: y.topicTitle,
        searchQuery: y.searchQuery,
        recommendedDuration: y.recommendedDuration || '10-20 min',
        targetContentDescription: y.targetContentDescription,
        suggestedKeywords: y.suggestedKeywords || [],
      })),
    };

    return res.json({ plan: generatedPlan });
  } catch (error: any) {
    console.error('Erreur generate-plan:', error);
    return res.status(500).json({
      error: error?.message || 'Erreur lors de la création de la feuille de route.',
    });
  }
});

// 3. API: Assistant Tuteur Gemma Chat
app.post('/api/tutor-chat', async (req, res) => {
  try {
    const { skillName, message, chatHistory, planContext } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Le message est requis.' });
    }

    const ai = getGenAI();

    const systemPrompt = `Tu es l'assistant tuteur Gemma 4, spécialisé dans l'accompagnement pédagogique pour la compétence : "${skillName || 'Général'}".
Contexte de l'apprenant :
- Plan actuel : ${planContext ? JSON.stringify(planContext) : 'En cours'}

Ta mission :
- Répondre avec pédagogie, bienveillance et concision aux questions de l'utilisateur.
- Expliquer des concepts techniques difficiles simplement.
- Donner des astuces concrètes pour chercher les meilleures vidéos YouTube sur le sujet.
- Conseiller des alternatives matérielles économiques si nécessaire.
- Proposer des ajustements si l'apprenant rencontre un blocage.`;

    const contents = [
      { role: 'user', parts: [{ text: systemPrompt }] },
      ...(chatHistory || []).map((msg: any) => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      })),
      { role: 'user', parts: [{ text: message }] },
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: contents,
    });

    const replyText = response.text || "Désolé, je n'ai pas réussi à générer une réponse. Posez-moi à nouveau votre question !";
    return res.json({ reply: replyText });
  } catch (error: any) {
    console.error('Erreur tutor-chat:', error);
    return res.status(500).json({ error: error?.message || 'Erreur du tuteur IA Gemma.' });
  }
});

// Serveur Vite en dev ou Fichiers Statiques en prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Serveur GemmaLearn démarré sur http://0.0.0.0:${PORT}`);
  });
}

startServer();
