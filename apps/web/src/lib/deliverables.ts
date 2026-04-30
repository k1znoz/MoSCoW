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

export function buildDeliverables(answers: Answers): GeneratedDeliverables {
  const projectType = asString(answers.project_type)
  const sitemap: string[] = ['Accueil', 'A propos', 'Contact', 'Mentions legales', 'Politique de confidentialite']

  if (projectType === 'ecommerce') {
    sitemap.push('Boutique', 'Categorie produit', 'Fiche produit', 'Panier', 'Paiement', 'Compte client')
  }

  if (projectType === 'reservation' || isTrue(answers.needs_booking)) {
    sitemap.push('Reserver', 'Confirmation reservation', 'Gestion reservation')
  }

  if (projectType === 'lead_gen') {
    sitemap.push('Offres', 'Etude de cas', 'Demande de devis')
  }

  if (isTrue(answers.needs_blog)) {
    sitemap.push('Blog', 'Article')
  }

  const must = [
    'Sitemap v1 valide',
    'Pages legales en place',
    'Formulaire de conversion principal',
    'Export final Markdown + PDF',
  ]

  if (isTrue(answers.needs_payment)) {
    must.push('Paiement securise (sandbox + prod)')
  }

  if (isTrue(answers.needs_auth)) {
    must.push('Authentification et gestion de session')
  }

  const should = ['Tracking analytics configure', 'Tableau de bord de leads']
  const could = ['Chat en ligne', 'Scenarios de relance marketing']
  const wont = ['Refonte complete branding en phase v1']

  const contentChecklist = [
    'Logo (SVG ou PNG haute resolution)',
    'Textes finaux par page',
    'Images principales et secondaires',
    'Mentions legales / politique confidentialite',
    'Coordonnees de contact verifiees',
  ]

  if (isTrue(answers.needs_blog)) {
    contentChecklist.push('3 articles blog de lancement')
  }

  const risks = [
    'Retard de livraison contenu client',
    'Decisionnaires multiples sans validation claire',
    'Perimetre fonctionnel qui derive apres cadrage',
  ]

  if (asString(answers.tracking_tools).trim() === '') {
    risks.push('Tracking non defini: mesure de performance limitee')
  }

  if (isTrue(answers.sensitive_data)) {
    risks.push('Donnees sensibles annoncees: revue conformite a faire avant build')
  }

  return {
    sitemap,
    moscow: {must, should, could, wont},
    contentChecklist,
    risks,
  }
}
