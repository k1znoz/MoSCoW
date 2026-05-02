import type {Answers, Question, QuestionSection} from './types'

export const PROJECT_TYPE_OPTIONS = [
  'Site vitrine',
  'E-commerce',
  'Application web/mobile',
  'Espace client',
  'Autre',
]

export function isQuestionVisible(question: Question, answers: Answers): boolean {
  if (question.visibleWhen) {
    if (answers[question.visibleWhen.key] !== question.visibleWhen.equals) {
      return false
    }
  }

  if (!question.projectTypes?.length) {
    return true
  }

  const projectType = typeof answers.project_type === 'string' ? answers.project_type : ''
  return question.projectTypes.includes(projectType)
}

export const QUESTION_SECTIONS: QuestionSection[] = [
  {
    key: 'context',
    title: 'Contexte et objectifs',
    questions: [
      {key: 'project_name', label: 'Nom du projet', inputType: 'text', required: true},
      {key: 'client_name', label: 'Nom du client', inputType: 'text', required: true},
      {key: 'client_company', label: 'Entreprise (optionnel)', inputType: 'text'},
      {key: 'client_email', label: 'Email de contact', inputType: 'text'},
      {key: 'client_phone', label: 'Téléphone (optionnel)', inputType: 'text'},
      {
        key: 'project_type',
        label: 'Type de projet',
        inputType: 'select',
        required: true,
        options: PROJECT_TYPE_OPTIONS,
      },
      {key: 'main_goal', label: 'Quel est le but principal du projet ?', inputType: 'textarea', required: true},
      {
        key: 'success_criteria',
        label: 'Comment saurez-vous que le projet est réussi ?',
        inputType: 'textarea',
        required: true,
      },
      {key: 'launch_deadline', label: 'Y a-t-il une date limite ?', inputType: 'date'},
      {
        key: 'budget_range',
        label: 'Budget approximatif',
        inputType: 'select',
        options: ['Moins de 2k', '2k à 5k', '5k à 10k', '10k à 25k', '25k et plus', 'À définir'],
      },
    ],
  },
  {
    key: 'audience',
    title: 'Cible et utilisateurs',
    questions: [
      {key: 'audience_primary', label: 'À qui s\'adresse le projet ?', inputType: 'textarea', required: true},
      {key: 'audience_secondary', label: 'Y a-t-il une cible secondaire ?', inputType: 'textarea'},
      {
        key: 'digital_level',
        label: 'Vos utilisateurs sont plutôt à l\'aise avec le numérique ?',
        inputType: 'select',
        options: ['Débutants', 'Intermédiaires', 'À l\'aise', 'Mélange'],
      },
      {key: 'languages', label: 'Langues prévues (ex: fr, en)', inputType: 'text'},
      {
        key: 'competitors',
        label: 'Exemples de sites/apps que vous aimez',
        inputType: 'textarea',
      },
    ],
  },
  {
    key: 'content',
    title: 'Contenu et design',
    questions: [
      {
        key: 'mandatory_pages',
        label: 'Quelles pages ou écrans souhaitez-vous ?',
        inputType: 'textarea',
        required: true,
        help: 'Ex: accueil, services, contact, à propos, boutique...',
      },
      {
        key: 'needs_blog',
        label: 'Souhaitez-vous un blog / actualités ?',
        inputType: 'boolean',
      },
      {
        key: 'has_existing_content',
        label: 'Avez-vous déjà les contenus ? (textes, images, logo...)',
        inputType: 'boolean',
      },
      {
        key: 'needs_content_help',
        label: 'Faut-il vous aider à les créer ?',
        inputType: 'boolean',
        visibleWhen: {key: 'has_existing_content', equals: false},
      },
      {
        key: 'content_owner',
        label: 'Qui sera responsable des mises à jour après livraison ?',
        inputType: 'text',
        required: true,
      },
      {
        key: 'media_assets',
        label: 'Précisions sur les contenus disponibles (optionnel)',
        inputType: 'textarea',
      },
      {
        key: 'style_direction',
        label: 'Style souhaité',
        inputType: 'select',
        options: ['Simple', 'Haut de gamme', 'Chaleureux', 'Moderne', 'Je ne sais pas encore'],
      },
    ],
  },
  {
    key: 'conversion',
    title: 'Fonctionnalités principales',
    questions: [
      {
        key: 'must_features',
        label: 'Quelles sont les fonctionnalités indispensables ?',
        inputType: 'textarea',
        required: true,
      },
      {key: 'bonus_features', label: 'Fonctionnalités bonus (si le budget le permet)', inputType: 'textarea'},
      {key: 'needs_admin', label: 'Avez-vous besoin d un espace admin ?', inputType: 'boolean'},
      {key: 'primary_action', label: 'Action principale attendue des visiteurs', inputType: 'text'},
    ],
  },
  {
    key: 'features',
    title: 'Questions spécifiques selon le projet',
    questions: [
      {key: 'specific_business_needs', label: 'Y a-t-il des besoins métier particuliers ?', inputType: 'textarea'},
      {
        key: 'product_volume',
        label: 'Combien de produits environ ?',
        inputType: 'text',
        projectTypes: ['E-commerce'],
      },
      {
        key: 'payment_methods',
        label: 'Quels moyens de paiement souhaitez-vous ?',
        inputType: 'textarea',
        projectTypes: ['E-commerce'],
      },
      {
        key: 'needs_stock',
        label: 'Avez-vous besoin de gestion des stocks ?',
        inputType: 'boolean',
        projectTypes: ['E-commerce'],
      },
      {
        key: 'needs_booking',
        label: 'Faut-il gérer des réservations de créneaux ?',
        inputType: 'boolean',
        projectTypes: ['Application web/mobile', 'Espace client', 'Autre'],
      },
      {
        key: 'needs_auth',
        label: 'Faut-il gérer des comptes utilisateurs ?',
        inputType: 'boolean',
        projectTypes: ['E-commerce', 'Application web/mobile', 'Espace client'],
      },
      {
        key: 'user_roles',
        label: 'Y a-t-il plusieurs rôles (admin, client...) ?',
        inputType: 'textarea',
        projectTypes: ['Application web/mobile', 'Espace client'],
      },
    ],
  },
  {
    key: 'seo',
    title: 'Visibilité et acquisition',
    questions: [
      {key: 'domain_status', label: 'Nom de domaine déjà acheté ?', inputType: 'text'},
      {key: 'keywords', label: 'Mots-clés ou thèmes importants', inputType: 'textarea'},
      {key: 'tracking_tools', label: 'Souhaitez-vous suivre les visites/conversions ?', inputType: 'boolean'},
      {key: 'ad_campaigns', label: 'Campagnes pub prévues ?', inputType: 'textarea'},
    ],
  },
  {
    key: 'technical',
    title: 'Technique (version simple)',
    questions: [
      {key: 'current_site', label: 'Avez-vous déjà un site/app existant ?', inputType: 'text'},
      {key: 'content_migration', label: 'Faut-il reprendre du contenu existant ?', inputType: 'boolean'},
      {key: 'external_tools', label: 'Outils a connecter (mailing, CRM, paiement...)', inputType: 'textarea'},
      {key: 'security_requirements', label: 'Contraintes techniques connues', inputType: 'textarea'},
    ],
  },
  {
    key: 'legal',
    title: 'Sécurité et légal',
    questions: [
      {key: 'collects_personal_data', label: 'Le projet collecte-t-il des données personnelles ?', inputType: 'boolean'},
      {key: 'sensitive_data', label: 'Y a-t-il des données sensibles (paiement, santé...) ?', inputType: 'boolean'},
      {key: 'needs_gdpr', label: 'Souhaitez-vous être accompagné sur la conformité RGPD ?', inputType: 'boolean'},
      {key: 'legal_pages', label: 'Pages légales à prévoir (mentions, CGV...)', inputType: 'textarea'},
    ],
  },
  {
    key: 'delivery',
    title: 'Validation et collaboration',
    questions: [
      {key: 'decision_makers', label: 'Qui valide le projet de votre côté ?', inputType: 'textarea', required: true},
      {key: 'estimated_timeline', label: 'Préférez-vous un projet en plusieurs phases ?', inputType: 'boolean'},
      {key: 'maintenance_preference', label: 'Après livraison, vous préférez...', inputType: 'select', options: ['Être autonome', 'Avoir une maintenance', 'À définir']},
      {key: 'extra_notes', label: 'Autres infos utiles', inputType: 'textarea'},
    ],
  },
]
