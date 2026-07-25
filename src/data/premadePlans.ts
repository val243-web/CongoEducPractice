import { LearningPlan } from '../types';

export const PREMADE_PLANS: LearningPlan[] = [
  {
    id: 'plan-dev-web',
    skillName: 'Développement Web & React (Dev Fullstack)',
    summary: 'Apprenez les bases solides du HTML5, CSS3, JavaScript moderne (ES6+) et React pour concevoir des sites et applications web intéractives.',
    skillLevel: 'debutant',
    totalEstimatedWeeks: 8,
    totalHoursPerWeek: 6,
    createdAt: new Date().toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    category: 'Informatique & Web',
    materials: [
      {
        id: 'mw1',
        name: 'Ordinateur Portable (Windows, Mac ou Linux)',
        category: 'Indispensable',
        estimatedCost: 'Gratuit (existant)',
        description: 'Un ordinateur fonctionnel avec navigateur Google Chrome ou Firefox.',
        isAcquired: true,
      },
      {
        id: 'mw2',
        name: 'Éditeur de Code VS Code',
        category: 'Indispensable',
        estimatedCost: 'Gratuit (Open Source)',
        description: 'L\'environnement de développement standard du marché.',
        isAcquired: true,
      },
      {
        id: 'mw3',
        name: 'Node.js & npm',
        category: 'Indispensable',
        estimatedCost: 'Gratuit',
        description: 'Pour exécuter JavaScript hors navigateur et gérer les paquets.',
        isAcquired: false,
      }
    ],
    phases: [
      {
        id: 'pw1',
        phaseNumber: 1,
        title: 'Bases Fondamentales Web (HTML5 & CSS3 Flexbox)',
        durationWeeks: 2,
        objective: 'Structurer et styliser une page web moderne et responsive.',
        isUnlocked: true,
        steps: [
          {
            id: 'sw1',
            title: 'Anatomie d\'un document HTML5 & sémantique',
            description: 'Créer les balises header, nav, main, section et footer.',
            estimatedHours: 3,
            outputDeliverable: 'Une page HTML sémantique de présentation personnelle.',
            isCompleted: true,
          },
          {
            id: 'sw2',
            title: 'Mise en page CSS Flexbox & Grid',
            description: 'Aligner dynamiquement les éléments et gérer le responsive.',
            estimatedHours: 4,
            outputDeliverable: 'Une carte de profil produit responsive.',
            isCompleted: false,
          }
        ],
        quiz: [
          {
            id: 'qw1',
            questionText: 'Quelle balise HTML5 sémantique est appropriée pour le menu de navigation principal ?',
            options: ['<div id="nav">', '<nav>', '<menu-bar>', '<header-links>'],
            correctOptionIndex: 1,
            explanation: 'La balise <nav> indique aux moteurs de recherche et aux lecteurs d\'écran la section consacrée aux liens de navigation principaux.',
            type: 'mcq',
          },
          {
            id: 'qw2',
            questionText: 'En CSS Flexbox, quelle propriété aligne les éléments sur l\'axe principal (horizontal par défaut) ?',
            options: ['align-items', 'justify-content', 'flex-direction', 'place-self'],
            correctOptionIndex: 1,
            explanation: 'justify-content gère la répartition des enfants sur l\'axe principal, tandis que align-items gère l\'axe secondaire.',
            type: 'mcq',
          },
          {
            id: 'qw3',
            questionText: 'Pratique : Écrivez le code HTML pour créer un bouton stylisé avec la classe CSS "btn-primary".',
            options: ['<button class="btn-primary">Valider</button>', '<btn class="btn-primary">Valider</btn>', '<input type="button-primary">', '<div class="btn">Valider</div>'],
            correctOptionIndex: 0,
            explanation: 'La balise <button> est l\'élément sémantique HTML standard pour un bouton d\'action.',
            type: 'mcq',
          },
          {
            id: 'qw4_code',
            questionText: 'Exercice Pratique IDE : Créez une fonction JavaScript "saluer(nom)" qui retourne "Bonjour " suivi du nom.',
            options: [],
            correctOptionIndex: 0,
            explanation: 'Consultez la solution dans le bac à sable interactif.',
            type: 'code',
            initialCode: '// Écrivez votre fonction saluer ici\nfunction saluer(nom) {\n  return "Bonjour " + nom;\n}\n\n// Test de la fonction\nconsole.log(saluer("Valery"));',
            codeInstructions: 'Complétez la fonction saluer pour qu\'elle renvoie une chaîne de bienvenue personnalisée.',
            expectedCodeKeywords: ['function', 'saluer', 'return']
          }
        ]
      },
      {
        id: 'pw2',
        phaseNumber: 2,
        title: 'JavaScript Moderne (DOM & Asynchrone)',
        durationWeeks: 3,
        objective: 'Créer de l\'interactivité avec le DOM et consommer des API avec fetch.',
        steps: [
          {
            id: 'sw3',
            title: 'Manipulation du DOM et événements click/input',
            description: 'Sélectionner des éléments et écouter les actions de l\'utilisateur.',
            estimatedHours: 5,
            outputDeliverable: 'Une Todo List interactive.',
            isCompleted: false,
          }
        ],
        quiz: [
          {
            id: 'qw2_1',
            questionText: 'Quel mot-clé ES6 déclare une variable dont la référence ne peut pas être réassignée ?',
            options: ['var', 'let', 'const', 'static'],
            correctOptionIndex: 2,
            explanation: 'const crée une référence constante et non réassignable.',
            type: 'mcq',
          },
          {
            id: 'qw2_2',
            questionText: 'Quelle méthode du DOM permet de sélectionner un élément via son sélecteur CSS ?',
            options: ['document.getElementBySelector()', 'document.querySelector()', 'document.find()', 'document.select()'],
            correctOptionIndex: 1,
            explanation: 'document.querySelector() accepte tout sélecteur CSS valide (ex: .ma-classe, #mon-id).',
            type: 'mcq',
          },
          {
            id: 'qw2_3',
            questionText: 'Comment convertit-on une réponse HTTP fetch en objet JSON en JavaScript ?',
            options: ['response.toJson()', 'response.json()', 'JSON.parse(response)', 'response.body.parse()'],
            correctOptionIndex: 1,
            explanation: 'response.json() renvoie une Promesse résolue avec le contenu JSON parsé.',
            type: 'mcq',
          },
          {
            id: 'qw2_4_code',
            questionText: 'Exercice Pratique IDE : Écrivez un script qui calcule la somme d\'un tableau de nombres [10, 20, 30].',
            options: [],
            correctOptionIndex: 0,
            explanation: 'Utilisez une boucle for ou la méthode Array.reduce().',
            type: 'code',
            initialCode: 'const nombres = [10, 20, 30];\n\n// Écrivez le code pour calculer la somme\nlet somme = 0;\nfor (let i = 0; i < nombres.length; i++) {\n  somme += nombres[i];\n}\n\nconsole.log("Somme totale = " + somme);',
            codeInstructions: 'Complétez ou testez le code pour calculer la somme d\'un tableau.',
            expectedCodeKeywords: ['somme', 'length']
          }
        ]
      }
    ],
    weeklySchedule: [
      {
        weekNumber: 1,
        theme: 'Bases HTML5 & CSS3',
        days: [
          {
            id: 'dw1',
            dayName: 'Lundi',
            timeSlot: '1h30 (19h00 - 20h30)',
            topic: 'Structure HTML5 et formulaires',
            activityDescription: 'Créer les balises fondamentales et valider la structure.',
            youtubeQuery: 'tuto html5 debutant structure balises form',
            keyChannelIdeas: ['Grafikart', 'Pierre Giraud', 'Benjamin Code'],
            isDone: true,
          },
          {
            id: 'dw2',
            dayName: 'Mercredi',
            timeSlot: '2h00 (19h00 - 21h00)',
            topic: 'CSS Flexbox & Grilles',
            activityDescription: 'Exercices pratiques sur flex-direction, align-items et justify-content.',
            youtubeQuery: 'comprendre flexbox css facilement tuto',
            keyChannelIdeas: ['Benjamin Code', 'Grafikart'],
            isDone: false,
          }
        ]
      }
    ],
    youtubeResources: [
      {
        id: 'ytw1',
        topicTitle: 'Maîtriser Flexbox en 20 minutes',
        searchQuery: 'tuto flexbox css debutant complet',
        recommendedDuration: '15-20 min',
        targetContentDescription: 'Explications visuelles sur les axes principal et secondaire.',
        suggestedKeywords: ['flexbox', 'css3', 'layout', 'responsive']
      }
    ]
  },

  {
    id: 'plan-menuiserie',
    skillName: 'Menuiserie & Travail du Bois',
    summary: 'Apprenez les bases du travail du bois pour concevoir et fabriquer vos propres meubles en bois massif en toute sécurité.',
    skillLevel: 'debutant',
    totalEstimatedWeeks: 6,
    totalHoursPerWeek: 5,
    createdAt: new Date().toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80',
    category: 'Artisanat & Métiers',
    materials: [
      {
        id: 'm1',
        name: 'Mètre ruban & Équerre de menuisier',
        category: 'Indispensable',
        estimatedCost: '20 €',
        description: 'Instruments de mesure de précision pour des tracés nets.',
        isAcquired: true,
      },
      {
        id: 'm2',
        name: 'Scie à main japonaise (Ryoba)',
        category: 'Indispensable',
        estimatedCost: '35 €',
        description: 'Scie extrêmement précise travaillant en tirant, idéale pour débuter.',
        isAcquired: false,
      },
      {
        id: 'm3',
        name: 'Jeu de 4 ciseaux à bois (6, 12, 18, 24 mm)',
        category: 'Indispensable',
        estimatedCost: '45 €',
        description: 'Pour ajuster les assemblages à mi-bois et tenons-mortaises.',
        isAcquired: false,
      },
      {
        id: 'm4',
        name: 'Lunettes de protection et masque antipoussière P2',
        category: 'Indispensable',
        estimatedCost: '15 €',
        description: 'Équipement de sécurité individuel obligatoire.',
        isAcquired: true,
      }
    ],
    phases: [
      {
        id: 'p1',
        phaseNumber: 1,
        title: 'Sécurité, Bois & Outils à main',
        durationWeeks: 2,
        objective: 'Maîtriser la traçabilité, le sciage droit manuel et l\'utilisation des ciseaux à bois.',
        isUnlocked: true,
        steps: [
          {
            id: 's1',
            title: 'Comprendre les essences de bois',
            description: 'Différencier bois résineux (pin) et bois durs (chêne, hêtre), et connaître le sens des fibres.',
            estimatedHours: 2,
            outputDeliverable: 'Fiche comparative des bois locaux disponibles',
            isCompleted: true,
          },
          {
            id: 's2',
            title: 'Pratique du sciage manuel à la Ryoba',
            description: 'Effectuer 10 coupes parfaitement d’équerre sur un tasseau de pin 40x40mm.',
            estimatedHours: 3,
            outputDeliverable: 'Échantillon de 5 coupes parfaites sans déviation',
            isCompleted: false,
          },
        ],
        quiz: [
          {
            id: 'q1',
            questionText: 'Dans quel sens scie-t-on préférentiellement avec une scie japonaise Ryoba ?',
            options: ['En poussant', 'En tirant', 'Dans les deux sens avec la même pression', 'Uniquement en diagonale'],
            correctOptionIndex: 1,
            explanation: 'La lame d\'une scie japonaise travaille en traction (en tirant), ce qui permet d\'avoir une lame plus fine et plus précise.',
            type: 'mcq'
          },
          {
            id: 'q2',
            questionText: 'Pourquoi est-il crucial de suivre le fil du bois lors du rabotage ?',
            options: ['Pour aller plus vite', 'Pour éviter d\'arracher les fibres du bois', 'Pour ne pas émousser le fer', 'Pour réduire la poussière'],
            correctOptionIndex: 1,
            explanation: 'Raboter contre le fil provoque des arrachements inesthétiques et fragilise la surface.',
            type: 'mcq'
          },
          {
            id: 'q3',
            questionText: 'Pratique : Quel outil utilise-t-on pour tracer une ligne perpendiculaire parfaite par rapport à un chant ?',
            options: ['Un trusquin', 'Une équerre de menuisier', 'Un compas d\'épaisseur', 'Un rabot de paume'],
            correctOptionIndex: 1,
            explanation: 'L\'équerre de menuisier plaquée contre le chant de référence garantit une ligne d\'équerre à 90°.',
            type: 'mcq'
          },
          {
            id: 'q4',
            questionText: 'Quelle est la première règle de sécurité absolue avant d\'utiliser un ciseau à bois ?',
            options: ['Toujours placer les deux mains derrière le tranchant', 'Pousser vers son torse', 'Mettre du solvant', 'Utiliser des gants en fer'],
            correctOptionIndex: 0,
            explanation: 'Garder toujours ses deux mains derrière la lame empêche toute coupure grave en cas de ripage.',
            type: 'mcq'
          }
        ]
      }
    ],
    weeklySchedule: [
      {
        weekNumber: 1,
        theme: 'Prise en main des outils & traçage',
        days: [
          {
            id: 'd1',
            dayName: 'Lundi',
            timeSlot: '1h00 (19h00 - 20h00)',
            topic: 'Sécurité à l’atelier et anatomie du bois',
            activityDescription: 'Visionnez les règles de sécurité indispensables et observez le fil du bois sur vos tasseaux.',
            youtubeQuery: 'débuter la menuiserie sécurité atelier fil du bois',
            keyChannelIdeas: ['ToutEnBois', 'L\'Atelier de Bois', 'Samuel Mamias'],
            isDone: true,
          }
        ]
      }
    ],
    youtubeResources: [
      {
        id: 'yt1',
        topicTitle: 'Maîtriser la Scie Japonaise Ryoba',
        searchQuery: 'tuto scie japonaise ryoba technique de coupe bois',
        recommendedDuration: '10-15 min',
        targetContentDescription: 'Vidéos expliquant la posture de la main, la ligne de vision et la pression d’amorce.',
        suggestedKeywords: ['ryoba', 'scie japonaise', 'coupe droite', 'menuiserie débutant']
      }
    ]
  },

  {
    id: 'plan-couture',
    skillName: 'Couture & Stylisme de Mode',
    summary: 'Apprenez à utiliser la machine à coudre, prendre des mesures exactes et réaliser vos premiers vêtements et accessoires sur mesure.',
    skillLevel: 'debutant',
    totalEstimatedWeeks: 6,
    totalHoursPerWeek: 4,
    createdAt: new Date().toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=800&q=80',
    category: 'Mode & Création',
    materials: [
      {
        id: 'mc1',
        name: 'Machine à coudre familiale',
        category: 'Indispensable',
        estimatedCost: '100-150 €',
        description: 'Machine mécanique simple avec point droit et zigzag.',
        isAcquired: true,
      },
      {
        id: 'mc2',
        name: 'Ciseaux de couturière & Mètre ruban',
        category: 'Indispensable',
        estimatedCost: '15 €',
        description: 'Pour des découpes nettes sans effilocher le tissu.',
        isAcquired: true,
      }
    ],
    phases: [
      {
        id: 'pc1',
        phaseNumber: 1,
        title: 'Prise en main de la machine & Points de base',
        durationWeeks: 2,
        objective: 'Enfiler la machine, maîtriser la tension du fil et réaliser une couture droite régulière.',
        isUnlocked: true,
        steps: [
          {
            id: 'sc1',
            title: 'Enfilage et canette',
            description: 'Remplir la canette et suivre le parcours de fil.',
            estimatedHours: 2,
            outputDeliverable: 'Échantillon de lignes droites et courbes sur chute de coton.',
            isCompleted: true,
          }
        ],
        quiz: [
          {
            id: 'qc1',
            questionText: 'Quel organe de la machine à coudre sert à faire monter les griffes d\'entraînement ?',
            options: ['Le volant', 'Le pied presseur (de biche)', 'Les griffes sous la plaque à aiguille', 'Le régleur de tension'],
            correctOptionIndex: 2,
            explanation: 'Les griffes d\'entraînement font avancer le tissu de manière synchrone pendant la piquage.',
            type: 'mcq'
          },
          {
            id: 'qc2',
            questionText: 'Pourquoi réalise-t-on un "point d\'arrêt" au début et à la fin d\'une couture ?',
            options: ['Pour décorer le vêtement', 'Pour empêcher la couture de se défaire', 'Pour couper le fil automatiquement', 'Pour changer d\'aiguille'],
            correctOptionIndex: 1,
            explanation: 'Quelques points en arrière verrouillent les fils pour éviter que la couture ne s\'ouvre à l\'usage.',
            type: 'mcq'
          },
          {
            id: 'qc3',
            questionText: 'Pratique : Quelle valeur de marge de couture est la plus standard en confection de patron ?',
            options: ['0.5 cm', '1 cm à 1.5 cm', '3 cm', '5 cm'],
            correctOptionIndex: 1,
            explanation: 'Les patrons standards prévoient généralement 1 cm ou 1.5 cm de valeur de couture.',
            type: 'mcq'
          },
          {
            id: 'qc4',
            questionText: 'Que faut-il faire si le fil du dessous forme des boucles sous le tissu ?',
            options: ['Remplacer le tissu', 'Vérifier l\'enfilage du fil du DESSUS', 'Augmenter la vitesse', 'Désactiver la canette'],
            correctOptionIndex: 1,
            explanation: 'Paradoxalement, les boucles en dessous sont presque toujours dues à un problème d\'enfilage ou de tension du fil du dessus !',
            type: 'mcq'
          }
        ]
      }
    ],
    weeklySchedule: [],
    youtubeResources: []
  },

  {
    id: 'plan-patisserie',
    skillName: 'Pâtisserie & Boulangerie Artisanale',
    summary: 'Maîtrisez les pâtes de base (brisée, sablée, feuilletée, à choux) et les crèmes fondamentales de la pâtisserie professionnelle.',
    skillLevel: 'debutant',
    totalEstimatedWeeks: 5,
    totalHoursPerWeek: 4,
    createdAt: new Date().toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    category: 'Gastronomie & Cuisine',
    materials: [
      {
        id: 'mp1',
        name: 'Balance de cuisine de précision (au gramme près)',
        category: 'Indispensable',
        estimatedCost: '15 €',
        description: 'La pâtisserie exige une pesée exacte des ingrédients.',
        isAcquired: true,
      },
      {
        id: 'mp2',
        name: 'Thermomètre de cuisine à sonde',
        category: 'Indispensable',
        estimatedCost: '12 €',
        description: 'Indispensable pour cuire les sirops, crèmes et tempérer le chocolat.',
        isAcquired: false,
      }
    ],
    phases: [
      {
        id: 'pp1',
        phaseNumber: 1,
        title: 'Les Pâtes Friables & Crème Pâtissière',
        durationWeeks: 2,
        objective: 'Réaliser une tarte aux fruits parfaite avec pâte sablée maison et crème diplomate.',
        isUnlocked: true,
        steps: [
          {
            id: 'sp1',
            title: 'Le sablage et le fonçage d\'un cercle à tarte',
            description: 'Technique du sablage à froid sans travailler excessivement le gluten.',
            estimatedHours: 3,
            outputDeliverable: 'Un fond de tarte cuit à blanc doré et croustillant.',
            isCompleted: true,
          }
        ],
        quiz: [
          {
            id: 'qp1',
            questionText: 'Pourquoi faut-il éviter de trop pétrir une pâte sablée ou brisée ?',
            options: ['Pour ne pas chauffer le beurre', 'Pour ne pas développer le gluten qui rendrait la pâte élastique et dure', 'Pour préserver la couleur', 'Pour cuire plus vite'],
            correctOptionIndex: 1,
            explanation: 'Pétrir active les protéines de gluten, rendant la pâte trop élastique, ce qui fait qu\'elle se rétracte à la cuisson.',
            type: 'mcq'
          },
          {
            id: 'qp2',
            questionText: 'À quelle température le jaune d\'œuf commence-t-il à coaguler dans une crème ?',
            options: ['50°C', '82°C - 85°C', '100°C', '120°C'],
            correctOptionIndex: 1,
            explanation: 'Entre 82°C et 85°C, la crème anglaise nappe la cuillère. Au-delà, l\'œuf caille !',
            type: 'mcq'
          },
          {
            id: 'qp3',
            questionText: 'Pratique : Comment appelle-t-on le fait de cuire un fond de tarte vide sans garniture ?',
            options: ['Cuire à blanc', 'Cuire à sec', 'Pocher', 'Dorer à l\'œuf'],
            correctOptionIndex: 0,
            explanation: 'La cuisson à blanc permet de cuire la pâte avant d\'y verser une garniture froide ou liquide.',
            type: 'mcq'
          },
          {
            id: 'qp4',
            questionText: 'Quel est l\'ingrédient clé qui apporte le moelleux et la conservation dans une brioche ?',
            options: ['Le sucre glace', 'Le beurre incorporé en fin de pétrissage', 'L\'eau gazeuse', 'La levure chimique'],
            correctOptionIndex: 1,
            explanation: 'Le beurre emprisonne l\'humidité et donne la texture filante et savoureuse de la brioche.',
            type: 'mcq'
          }
        ]
      }
    ],
    weeklySchedule: [],
    youtubeResources: []
  }
];

