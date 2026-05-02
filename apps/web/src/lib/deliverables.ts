import type {Answers, GeneratedDeliverables} from './types'

function asString(value: string | string[] | boolean | undefined): string {
  if (Array.isArray(value)) {
    return value.join(', ')
  }

  if (typeof value === 'boolean') {
    return value ? 'oui' : 'non'
  }

  return value ?? ''
}

function isTrue(value: string | string[] | boolean | undefined): boolean {
  return value === true || value === 'true' || value === 'oui'
}

function lower(value: string): string {
  return value.trim().toLowerCase()
}

function hasText(value: string | string[] | boolean | undefined): boolean {
  return asString(value).trim().length > 0
}

export function buildDeliverables(answers: Answers): GeneratedDeliverables {
  const projectType = lower(asString(answers.project_type))
  const sitemap: string[] = ['Accueil', 'À propos', 'Contact', 'Mentions légales', 'Politique de confidentialité']

  if (projectType === 'e-commerce') {
    sitemap.push('Boutique', 'Catégorie produit', 'Fiche produit', 'Panier', 'Paiement', 'Compte client')
  }

  if (projectType === 'application web/mobile' || projectType === 'espace client' || isTrue(answers.needs_auth)) {
    sitemap.push('Connexion', 'Compte utilisateur')
  }

  if (isTrue(answers.needs_booking)) {
    sitemap.push('Réserver', 'Confirmation réservation', 'Gestion réservation')
  }

  if (projectType === 'site vitrine') {
    sitemap.push('Services', 'Demande de devis')
  }

  if (isTrue(answers.needs_blog)) {
    sitemap.push('Blog', 'Article')
  }

  const must = [
    'Sitemap v1 validé',
    'Pages légales en place',
    'Parcours principal du client clarifié',
    'Compte-rendu de cadrage validé',
  ]

  if (asString(answers.payment_methods).trim().length > 0) {
    must.push('Paiement sécurisé (sandbox + prod)')
  }

  if (isTrue(answers.needs_auth)) {
    must.push('Authentification et gestion de session')
  }

  const should = ['Suivi des performances configuré', 'Contenus prioritaires prêts']
  const could = ['FAQ dynamique', 'Automatisations marketing']
  const wont = ['Refonte complète branding en phase v1']
  const risks: string[] = []
  const uxRecommendations: string[] = []

  const digitalLevel = lower(asString(answers.digital_level))
  if (digitalLevel.includes('début')) {
    uxRecommendations.push('Prévoir une interface très simple avec des parcours courts et guidés.')
    uxRecommendations.push('Ajouter des messages d aide explicites et des confirmations avant les actions sensibles.')
    risks.push('Public peu à l aise avec le numérique : risque d abandon si l interface est trop dense.')
  } else if (digitalLevel.includes('interm')) {
    uxRecommendations.push('Conserver une interface simple, avec quelques options avancées non bloquantes.')
  } else if (digitalLevel.includes('à l') || digitalLevel.includes('a l')) {
    uxRecommendations.push('Prévoir des raccourcis et un parcours plus direct pour les utilisateurs réguliers.')
  } else if (digitalLevel.includes('mélange') || digitalLevel.includes('melange')) {
    uxRecommendations.push('Prévoir un niveau de lecture double : mode guidé pour novices et navigation rapide pour experts.')
  }

  const contentChecklist = [
    'Logo (SVG ou PNG haute résolution)',
    'Textes finaux par page',
    'Images principales et secondaires',
    'Mentions légales / politique de confidentialité',
    'Coordonnées de contact vérifiées',
  ]

  if (!isTrue(answers.has_existing_content)) {
    contentChecklist.push('Collecte des contenus manquants (textes/photos)')
  }

  if (isTrue(answers.needs_blog)) {
    contentChecklist.push('3 articles blog de lancement')
  }

  if (!isTrue(answers.has_existing_content)) {
    risks.push('Contenu non disponible à ce stade : risque de retard sur le planning de production.')
  }

  const decisionMakers = lower(asString(answers.decision_makers))
  if (!hasText(answers.decision_makers)) {
    risks.push('Décideur non identifié : risque de validation tardive.')
  } else if (
    decisionMakers.includes('plusieur') ||
    decisionMakers.includes('equipe') ||
    decisionMakers.includes('équipe') ||
    decisionMakers.includes('on verra')
  ) {
    risks.push('Validation potentiellement partagée : risque d allers-retours et de décisions contradictoires.')
  }

  if (!hasText(answers.must_features) || !hasText(answers.primary_action)) {
    risks.push('Besoin principal encore flou : risque de dérive du périmètre.')
  }

  if (!isTrue(answers.tracking_tools)) {
    risks.push('Tracking non défini : mesure de performance limitée.')
  }

  if (isTrue(answers.sensitive_data)) {
    risks.push('Données sensibles annoncées : revue conformité à faire avant build.')
  }

  if (isTrue(answers.collects_personal_data) && !isTrue(answers.needs_gdpr)) {
    risks.push('Collecte de données personnelles sans accompagnement RGPD : risque juridique à cadrer en amont.')
  }

  return {
    sitemap,
    moscow: {must, should, could, wont},
    uxRecommendations,
    contentChecklist,
    risks,
  }
}
