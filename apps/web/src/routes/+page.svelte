<script lang="ts">
	import {isQuestionVisible, QUESTION_SECTIONS} from '$lib/questionnaire'
	import type {Answers} from '$lib/types'
	import {buildDeliverables} from '$lib/deliverables'
	import {buildMarkdown, buildPrintableHtml} from '$lib/exports'
	import AppHeader from '$lib/components/AppHeader.svelte'
	import SideNav from '$lib/components/SideNav.svelte'
	import MobileNav from '$lib/components/MobileNav.svelte'
	import ProgressBar from '$lib/components/ProgressBar.svelte'
	import QuestionField from '$lib/components/QuestionField.svelte'
	import SectionSummary from '$lib/components/SectionSummary.svelte'

	const STORAGE_KEY = 'moscow_questionnaire_answers_v1'

	let currentSectionIndex = $state(0)
	let answers = $state<Answers>({})
	let submissionStatus = $state('')
	let isSubmitting = $state(false)

	const sections = QUESTION_SECTIONS

	const currentSection = $derived(sections[currentSectionIndex])
	const visibleQuestions = $derived(currentSection.questions.filter((question) => isQuestionVisible(question, answers)))
	const visibleSections = $derived(
		sections
			.map((section) => ({
				...section,
				questions: section.questions.filter((question) => isQuestionVisible(question, answers)),
			}))
			.filter((section) => section.questions.length > 0)
	)
	const isFirstSection = $derived(currentSectionIndex === 0)
	const isLastSection = $derived(currentSectionIndex === sections.length - 1)
	const generated = $derived(buildDeliverables(answers))
	const markdown = $derived(buildMarkdown(visibleSections, answers, generated))
	const printableHtml = $derived(buildPrintableHtml(visibleSections, answers, generated))

	$effect(() => {
		if (typeof window === 'undefined') {
			return
		}

		const raw = window.localStorage.getItem(STORAGE_KEY)
		if (raw) {
			try {
				answers = JSON.parse(raw) as Answers
			} catch {
				answers = {}
			}
		}
	})

	$effect(() => {
		if (typeof window === 'undefined') {
			return
		}

		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(answers))
	})

	function sectionIsValid(index: number): boolean {
		const section = sections[index]
		return section.questions.every((question) => {
			if (!isQuestionVisible(question, answers)) {
				return true
			}

			if (!question.required) {
				return true
			}

			const value = answers[question.key]
			if (typeof value === 'boolean') {
				return true
			}

			if (Array.isArray(value)) {
				return value.length > 0
			}

			return typeof value === 'string' && value.trim().length > 0
		})
	}

	function nextSection(): void {
		if (!sectionIsValid(currentSectionIndex)) {
			submissionStatus = 'Merci de remplir les champs requis avant de continuer.'
			return
		}

		submissionStatus = ''
		currentSectionIndex = Math.min(currentSectionIndex + 1, sections.length - 1)
	}

	function previousSection(): void {
		submissionStatus = ''
		currentSectionIndex = Math.max(currentSectionIndex - 1, 0)
	}

	function goToSection(index: number): void {
		submissionStatus = ''
		currentSectionIndex = Math.max(0, Math.min(index, sections.length - 1))
		if (typeof window !== 'undefined') {
			window.scrollTo({top: 0, behavior: 'smooth'})
		}
	}

	async function submitToSanity(): Promise<void> {
		isSubmitting = true
		submissionStatus = ''

		try {
			const response = await fetch('/api/submissions', {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					answers,
					generated,
					exportMarkdown: markdown,
					exportHtml: printableHtml,
				}),
			})

			if (!response.ok) {
				throw new Error('Erreur serveur')
			}

			submissionStatus = 'Merci, votre demande a bien été envoyée. Nous revenons vers vous rapidement.'
			window.localStorage.removeItem(STORAGE_KEY)
		} catch {
			submissionStatus = 'Échec de sauvegarde Sanity. Vérifie la configuration des variables serveur.'
		} finally {
			isSubmitting = false
		}
	}

</script>

<svelte:head>
	<title>MoSCoW - Questionnaire client</title>
</svelte:head>

<AppHeader />
<SideNav {currentSectionIndex} onnavigate={goToSection} />
<MobileNav {currentSectionIndex} onnavigate={goToSection} />

<!-- Decorative background gradient -->
<div class="fixed bottom-0 right-0 w-1/3 h-2/3 pointer-events-none z-[-1] opacity-20 bg-gradient-to-tl from-orange-900/30 to-transparent blur-3xl"></div>

<main class="lg:ml-64 pt-16 pb-24 md:pb-12 min-h-screen flex flex-col items-center relative">
	<!-- Noise texture overlay -->
	<div class="fixed inset-0 noise-overlay pointer-events-none z-0"></div>

	<div class="max-w-container-max w-full px-gutter relative z-10">
		<!-- Section header -->
		<section class="mb-12 pt-8 border-l-4 border-primary-container pl-6">
			<p class="font-label-sm text-label-sm text-secondary tracking-[0.2em] uppercase mb-2">
				Étape {currentSectionIndex + 1} sur {sections.length}
			</p>
			<h1 class="font-h1 text-h1 text-on-surface leading-tight">{currentSection.title}</h1>
		</section>

		<!-- Heat-treatment progress gauge -->
		<ProgressBar progress={Math.round((currentSectionIndex / (sections.length - 1)) * 100)} />

		<!-- Questions grid: 8-col main + 4-col guidance sidebar -->
		<div class="grid grid-cols-1 md:grid-cols-12 gap-gutter">
			<!-- Main questions column -->
			<div class="md:col-span-8 space-y-6">
				{#each visibleQuestions as question}
					<div class="bg-surface-container rounded-lg border border-outline-variant p-8 shadow-xl relative overflow-visible group">
						<div class="absolute top-0 left-0 w-full h-1 bg-primary-container/20 group-hover:bg-primary-container transition-colors duration-500"></div>

						<h3 class="font-h3 text-h3 text-on-surface mb-6 flex items-center gap-3">
							<span class="material-symbols-outlined text-primary-container">edit_note</span>
							{question.label}
							{#if question.help}
								<span class="relative inline-flex items-center group/help">
									<span class="material-symbols-outlined text-sm text-secondary cursor-help">help</span>
									<span class="pointer-events-none absolute left-0 top-full z-20 mt-2 w-72 rounded-md border border-outline-variant bg-surface-container-high p-3 text-xs font-normal normal-case tracking-normal leading-relaxed text-on-surface-variant opacity-0 translate-y-1 transition-all duration-200 group-hover/help:opacity-100 group-hover/help:translate-y-0 group-focus-within/help:opacity-100 group-focus-within/help:translate-y-0">
										{question.help}
									</span>
								</span>
							{/if}
							{#if question.required}
								<span class="text-error text-xs ml-1">*</span>
							{/if}
						</h3>

						<QuestionField
							{question}
							value={answers[question.key]}
							onchange={(val) => {
								answers = { ...answers, [question.key]: val }
							}}
						/>

					</div>
				{/each}
			</div>

			<!-- Guidance sidebar -->
			<div class="md:col-span-4 flex flex-col gap-gutter">
				<!-- Conseil d'artisan -->
				<div class="bg-surface-container-low border border-outline-variant p-6 rounded-lg">
					<h4 class="font-label-sm text-primary mb-4 flex items-center gap-2">
						<span class="material-symbols-outlined text-sm">lightbulb</span>
						CONSEIL D'ARTISAN
					</h4>
					<div class="hammered-hr mb-4"></div>
					<p class="text-sm text-on-surface-variant leading-relaxed italic">
						"La clarté est le marteau qui façonne le succès. Répondez honnêtement pour obtenir un devis précis et adapté à votre projet."
					</p>
				</div>

				<!-- MoSCoW chips or summary on last section -->
				{#if isLastSection}
					<SectionSummary {generated} />
				{:else}
					<div class="bg-surface-container-high border border-outline-variant p-6 rounded-lg relative overflow-hidden">
						<div class="absolute -right-4 -bottom-4 opacity-10">
							<span class="material-symbols-outlined text-8xl">local_fire_department</span>
						</div>
						<h4 class="font-label-sm text-secondary-fixed mb-2">MÉTHODE MOSCOW</h4>
						<div class="flex flex-wrap gap-2 mt-4">
							<span class="px-3 py-1 bg-primary text-on-primary font-label-sm rounded-full text-[10px] uppercase">Must: Clarté</span>
							<span class="px-3 py-1 border border-secondary text-secondary font-label-sm rounded-full text-[10px] uppercase">Should: Précision</span>
							<span class="px-3 py-1 border border-outline text-outline font-label-sm rounded-full text-[10px] uppercase">Could: Détails</span>
							<span class="px-3 py-1 border border-slate-700 text-slate-500 font-label-sm rounded-full text-[10px] uppercase opacity-60">Won't: Hors périmètre</span>
						</div>
					</div>
				{/if}
			</div>
		</div>

		<!-- Navigation actions -->
		<div class="mt-16 flex justify-between items-center border-t border-outline-variant pt-8">
			{#if !isFirstSection}
				<button
					onclick={previousSection}
					class="px-8 py-3 border border-outline-variant text-on-surface font-label-sm uppercase tracking-widest hover:bg-surface-bright transition-all active:scale-95 flex items-center gap-2"
				>
					<span class="material-symbols-outlined text-sm">arrow_back</span>
					Précédent
				</button>
			{:else}
				<div></div>
			{/if}

			{#if !isLastSection}
				<button
					onclick={nextSection}
					class="px-10 py-4 bg-primary-container text-on-primary-fixed font-bold uppercase tracking-widest hot-glow transition-all active:scale-95 flex items-center gap-2 shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
				>
					Suivant
					<span class="material-symbols-outlined text-sm">arrow_forward</span>
				</button>
			{:else}
				<div class="flex flex-wrap gap-3">
					<button
						onclick={submitToSanity}
						disabled={isSubmitting}
						class="px-10 py-4 bg-orange-600 text-white font-bold uppercase tracking-widest text-sm incandescent-glow transition-all active:scale-95 flex items-center gap-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isSubmitting ? 'Envoi...' : 'Finaliser'}
						<span class="material-symbols-outlined text-sm">send</span>
					</button>
				</div>
			{/if}
		</div>

		<!-- Status / error message -->
		{#if submissionStatus}
			<div class="mt-8 p-4 bg-surface-container border border-outline flex items-center gap-3">
				<span class="material-symbols-outlined text-primary">info</span>
				<p class="text-sm text-on-surface">{submissionStatus}</p>
			</div>
		{/if}
	</div>
</main>
