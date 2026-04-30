import type {QuestionSection} from './types'

export const QUESTION_SECTIONS: QuestionSection[] = [
  {
    key: 'context',
    title: 'Contexte et objectifs',
    questions: [
      {key: 'project_name', label: 'Nom du projet', inputType: 'text', required: true},
      {key: 'client_name', label: 'Nom du client', inputType: 'text', required: true},
      {key: 'client_company', label: 'Entreprise', inputType: 'text'},
      {key: 'client_email', label: 'Email de contact', inputType: 'text'},
      {key: 'client_phone', label: 'Telephone', inputType: 'text'},
      {
        key: 'project_type',
        label: 'Type de projet',
        inputType: 'select',
        required: true,
        options: ['vitrine', 'lead_gen', 'ecommerce', 'reservation', 'client_space'],
      },
      {key: 'main_goal', label: 'Objectif principal', inputType: 'textarea', required: true},
      {key: 'kpi_1', label: 'KPI 1', inputType: 'text', required: true},
      {key: 'kpi_2', label: 'KPI 2', inputType: 'text'},
      {key: 'launch_deadline', label: 'Date de lancement souhaitee', inputType: 'date'},
      {
        key: 'budget_range',
        label: 'Fourchette budget',
        inputType: 'select',
        options: ['< 2k', '2k-5k', '5k-10k', '10k-25k', '25k+'],
      },
    ],
  },
  {
    key: 'audience',
    title: 'Cible et proposition de valeur',
    questions: [
      {key: 'audience_primary', label: 'Cible principale', inputType: 'textarea', required: true},
      {key: 'audience_secondary', label: 'Cible secondaire', inputType: 'textarea'},
      {key: 'usp', label: 'Proposition de valeur (USP)', inputType: 'textarea', required: true},
      {
        key: 'geo_scope',
        label: 'Zone geographique',
        inputType: 'multiselect',
        options: ['locale', 'nationale', 'europe', 'international'],
      },
      {key: 'languages', label: 'Langues', inputType: 'text', help: 'Ex: fr, en'},
      {
        key: 'competitors',
        label: 'Concurrents references',
        inputType: 'textarea',
      },
    ],
  },
  {
    key: 'content',
    title: 'Contenu et pages',
    questions: [
      {key: 'mandatory_pages', label: 'Pages obligatoires', inputType: 'textarea', required: true},
      {
        key: 'needs_blog',
        label: 'Besoin d un blog',
        inputType: 'boolean',
      },
      {key: 'content_owner', label: 'Qui fournit le contenu', inputType: 'text', required: true},
      {
        key: 'has_brand_assets',
        label: 'Charte graphique disponible',
        inputType: 'boolean',
      },
      {
        key: 'media_assets',
        label: 'Photos/videos existantes',
        inputType: 'textarea',
      },
      {key: 'legal_constraints', label: 'Contraintes legales contenu', inputType: 'textarea'},
    ],
  },
  {
    key: 'conversion',
    title: 'Parcours et conversion',
    questions: [
      {
        key: 'primary_action',
        label: 'Action principale attendue',
        inputType: 'select',
        required: true,
        options: ['devis', 'contact', 'reservation', 'achat', 'appel'],
      },
      {key: 'funnel_steps', label: 'Etapes du parcours ideal', inputType: 'textarea'},
      {key: 'lead_fields', label: 'Champs a collecter', inputType: 'textarea'},
      {key: 'crm_target', label: 'Ou envoyer les leads', inputType: 'text'},
      {key: 'auto_emails', label: 'Emails automatiques necessaires', inputType: 'textarea'},
      {key: 'faq_or_chat', label: 'FAQ ou chat', inputType: 'boolean'},
    ],
  },
  {
    key: 'features',
    title: 'Fonctionnalites',
    questions: [
      {key: 'needs_auth', label: 'Espace client / connexion', inputType: 'boolean'},
      {key: 'needs_payment', label: 'Paiement en ligne', inputType: 'boolean'},
      {key: 'needs_booking', label: 'Reservation de creneaux', inputType: 'boolean'},
      {key: 'needs_catalog', label: 'Catalogue / filtres', inputType: 'boolean'},
      {key: 'needs_pdf_generation', label: 'Generation de documents PDF', inputType: 'boolean'},
      {key: 'integrations', label: 'Integrations souhaites', inputType: 'textarea'},
      {key: 'import_export', label: 'Import / export de donnees', inputType: 'boolean'},
    ],
  },
  {
    key: 'seo',
    title: 'SEO et acquisition',
    questions: [
      {key: 'domain_status', label: 'Domaine existant', inputType: 'text'},
      {key: 'keywords', label: 'Mots-cles cibles', inputType: 'textarea'},
      {key: 'seo_pages', label: 'Pages SEO prioritaires', inputType: 'textarea'},
      {key: 'tracking_tools', label: 'Tracking (GA4, Pixel...)', inputType: 'textarea'},
      {key: 'ad_campaigns', label: 'Campagnes ads prevues', inputType: 'textarea'},
    ],
  },
  {
    key: 'technical',
    title: 'Technique et contraintes',
    questions: [
      {key: 'current_site', label: 'Site actuel', inputType: 'text'},
      {key: 'content_migration', label: 'Migration de contenu', inputType: 'boolean'},
      {key: 'performance_requirements', label: 'Exigences performance', inputType: 'textarea'},
      {key: 'accessibility_requirements', label: 'Exigences accessibilite', inputType: 'textarea'},
      {key: 'security_requirements', label: 'Exigences securite', inputType: 'textarea'},
      {key: 'preferred_stack', label: 'Contraintes techniques connues', inputType: 'textarea'},
    ],
  },
  {
    key: 'legal',
    title: 'Legal et conformite',
    questions: [
      {key: 'legal_pages', label: 'Pages legales necessaires', inputType: 'textarea'},
      {key: 'collects_personal_data', label: 'Collecte de donnees personnelles', inputType: 'boolean'},
      {key: 'sensitive_data', label: 'Donnees sensibles manipulees', inputType: 'boolean'},
      {key: 'contractual_docs', label: 'CGU/CGV attendues', inputType: 'boolean'},
      {key: 'regulatory_notes', label: 'Autres obligations', inputType: 'textarea'},
    ],
  },
  {
    key: 'delivery',
    title: 'Planning et validation',
    questions: [
      {key: 'decision_makers', label: 'Qui valide le projet', inputType: 'textarea', required: true},
      {key: 'review_process', label: 'Process de validation', inputType: 'textarea'},
      {key: 'estimated_timeline', label: 'Planning souhaite', inputType: 'textarea'},
      {key: 'known_risks', label: 'Risques deja identifies', inputType: 'textarea'},
      {key: 'extra_notes', label: 'Notes complementaires', inputType: 'textarea'},
    ],
  },
]
