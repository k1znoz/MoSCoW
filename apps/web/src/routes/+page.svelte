<script lang="ts">
	import {QUESTION_SECTIONS} from '$lib/questionnaire'
	import type {Answers} from '$lib/types'
	import {buildDeliverables} from '$lib/deliverables'
	import {buildMarkdown, buildPrintableHtml} from '$lib/exports'

	const STORAGE_KEY = 'moscow_questionnaire_answers_v1'

	let currentSectionIndex = $state(0)
	let answers = $state<Answers>({})
	let submissionStatus = $state('')
	let isSubmitting = $state(false)

	const sections = QUESTION_SECTIONS

	const currentSection = $derived(sections[currentSectionIndex])
	const isFirstSection = $derived(currentSectionIndex === 0)
	const isLastSection = $derived(currentSectionIndex === sections.length - 1)
	const generated = $derived(buildDeliverables(answers))
	const markdown = $derived(buildMarkdown(sections, answers, generated))
	const printableHtml = $derived(buildPrintableHtml(sections, answers, generated))

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

	function answerAsString(key: string): string {
		const value = answers[key]
		return typeof value === 'string' ? value : ''
	}

	function answerAsBoolean(key: string): boolean {
		return answers[key] === true
	}

	function answerAsArray(key: string): string[] {
		const value = answers[key]
		return Array.isArray(value) ? value : []
	}

	function updateString(key: string, value: string): void {
		answers = {...answers, [key]: value}
	}

	function updateBoolean(key: string, value: boolean): void {
		answers = {...answers, [key]: value}
	}

	function toggleOption(key: string, option: string): void {
		const current = new Set(answerAsArray(key))
		if (current.has(option)) {
			current.delete(option)
		} else {
			current.add(option)
		}

		answers = {...answers, [key]: [...current]}
	}

	function sectionIsValid(index: number): boolean {
		const section = sections[index]
		return section.questions.every((question) => {
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

	function downloadMarkdown(): void {
		const blob = new Blob([markdown], {type: 'text/markdown;charset=utf-8'})
		const url = URL.createObjectURL(blob)
		const anchor = document.createElement('a')
		anchor.href = url
		anchor.download = `${answerAsString('project_name') || 'moscow-projet'}.md`
		anchor.click()
		URL.revokeObjectURL(url)
	}

	function openPrintableExport(): void {
		const popup = window.open('', '_blank', 'noopener,noreferrer')
		if (!popup) {
			submissionStatus = 'Impossible d ouvrir la fenetre d impression. Autorise les popups puis reessaie.'
			return
		}

		popup.document.open()
		popup.document.write(printableHtml)
		popup.document.close()
		popup.focus()
		popup.print()
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

			submissionStatus =
				'Submission enregistree dans Sanity. Tu peux maintenant traiter et supprimer depuis le Studio.'
			window.localStorage.removeItem(STORAGE_KEY)
		} catch {
			submissionStatus = 'Echec de sauvegarde Sanity. Verifie la configuration des variables serveur.'
		} finally {
			isSubmitting = false
		}
	}
</script>

<svelte:head>
	<title>MoSCoW - Questionnaire client</title>
</svelte:head>

<main class="page">
	<header class="hero">
		<p class="eyebrow">MoSCoW Intake</p>
		<h1>Questionnaire client complet</h1>
		<p>
			Ce formulaire te permet de produire un dossier projet en Markdown + PDF et d envoyer une copie
			exploitable dans Sanity Studio.
		</p>
	</header>

	<section class="progress">
		<span>Etape {currentSectionIndex + 1} / {sections.length}</span>
		<strong>{currentSection.title}</strong>
	</section>

	<section class="card">
		{#each currentSection.questions as question}
			<div class="field">
				<label for={question.key}>
					{question.label}
					{#if question.required}
						<span class="required">*</span>
					{/if}
				</label>

				{#if question.inputType === 'text' || question.inputType === 'date'}
					<input
						id={question.key}
						type={question.inputType === 'date' ? 'date' : 'text'}
						value={answerAsString(question.key)}
						oninput={(event) => updateString(question.key, (event.currentTarget as HTMLInputElement).value)}
					/>
				{:else if question.inputType === 'textarea'}
					<textarea
						id={question.key}
						rows="4"
						oninput={(event) => updateString(question.key, (event.currentTarget as HTMLTextAreaElement).value)}
					>{answerAsString(question.key)}</textarea>
				{:else if question.inputType === 'select'}
					<select
						id={question.key}
						value={answerAsString(question.key)}
						onchange={(event) => updateString(question.key, (event.currentTarget as HTMLSelectElement).value)}
					>
						<option value="">Selectionner...</option>
						{#each question.options ?? [] as option}
							<option value={option}>{option}</option>
						{/each}
					</select>
				{:else if question.inputType === 'boolean'}
					<label class="boolean">
						<input
							type="checkbox"
							checked={answerAsBoolean(question.key)}
							onchange={(event) => updateBoolean(question.key, (event.currentTarget as HTMLInputElement).checked)}
						/>
						<span>Oui</span>
					</label>
				{:else if question.inputType === 'multiselect'}
					<div class="choices">
						{#each question.options ?? [] as option}
							<label>
								<input
									type="checkbox"
									checked={answerAsArray(question.key).includes(option)}
									onchange={() => toggleOption(question.key, option)}
								/>
								<span>{option}</span>
							</label>
						{/each}
					</div>
				{/if}

				{#if question.help}
					<small>{question.help}</small>
				{/if}
			</div>
		{/each}
	</section>

	<section class="actions">
		<button onclick={previousSection} disabled={isFirstSection}>Precedent</button>
		{#if !isLastSection}
			<button class="primary" onclick={nextSection}>Suivant</button>
		{:else}
			<button class="primary" onclick={downloadMarkdown}>Telecharger MD</button>
			<button class="secondary" onclick={openPrintableExport}>Imprimer en PDF</button>
			<button class="primary" onclick={submitToSanity} disabled={isSubmitting}>
				{isSubmitting ? 'Envoi en cours...' : 'Finaliser et envoyer dans Sanity'}
			</button>
		{/if}
	</section>

	{#if isLastSection}
		<section class="summary">
			<h2>Synthese automatique</h2>
			<p><strong>Sitemap:</strong> {generated.sitemap.join(' | ')}</p>
			<p><strong>Must:</strong> {generated.moscow.must.length} items</p>
			<p><strong>Risques:</strong> {generated.risks.length} points</p>
		</section>
	{/if}

	{#if submissionStatus}
		<p class="status">{submissionStatus}</p>
	{/if}
</main>

<style>
	:global(body) {
		margin: 0;
		background: radial-gradient(circle at top right, #fef2d6, #f4f7ec 40%, #f2f2f2 100%);
		color: #222;
		font-family: 'Trebuchet MS', 'Segoe UI', sans-serif;
	}

	.page {
		max-width: 900px;
		margin: 0 auto;
		padding: 2rem 1rem 4rem;
	}

	.hero {
		margin-bottom: 1.25rem;
	}

	.eyebrow {
		text-transform: uppercase;
		letter-spacing: 0.08em;
		font-size: 0.78rem;
		color: #9a5b11;
		margin-bottom: 0.25rem;
	}

	.hero h1 {
		margin: 0;
		font-size: 2rem;
	}

	.progress {
		background: white;
		border: 1px solid #e2e7e0;
		border-radius: 10px;
		padding: 0.75rem 1rem;
		display: flex;
		justify-content: space-between;
		margin-bottom: 0.8rem;
	}

	.card {
		background: white;
		border-radius: 14px;
		border: 1px solid #dfe5db;
		padding: 1rem;
	}

	.field {
		margin-bottom: 0.95rem;
	}

	label {
		display: block;
		font-weight: 600;
		margin-bottom: 0.4rem;
	}

	input,
	textarea,
	select {
		width: 100%;
		box-sizing: border-box;
		padding: 0.65rem;
		border-radius: 8px;
		border: 1px solid #c6d0c4;
		font: inherit;
		background: #fff;
	}

	.required {
		color: #b41f00;
	}

	.boolean {
		display: inline-flex;
		gap: 0.5rem;
		align-items: center;
		font-weight: 500;
	}

	.choices {
		display: grid;
		gap: 0.4rem;
	}

	.choices label {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-weight: 500;
		margin: 0;
	}

	.actions {
		margin-top: 1rem;
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem;
	}

	button {
		border: 0;
		border-radius: 999px;
		padding: 0.65rem 1rem;
		font-weight: 700;
		cursor: pointer;
		background: #d9dfd7;
	}

	button.primary {
		background: #0f766e;
		color: white;
	}

	button.secondary {
		background: #d97706;
		color: white;
	}

	button:disabled {
		opacity: 0.65;
		cursor: not-allowed;
	}

	.summary {
		margin-top: 1rem;
		background: #f6faf4;
		border: 1px solid #d8e6d2;
		border-radius: 10px;
		padding: 0.9rem;
	}

	.status {
		margin-top: 1rem;
		font-weight: 600;
	}

	@media (max-width: 640px) {
		.progress {
			display: grid;
			gap: 0.25rem;
		}

		.actions button {
			width: 100%;
		}
	}
</style>
