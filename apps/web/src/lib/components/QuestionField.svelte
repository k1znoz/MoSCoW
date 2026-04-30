<script lang="ts">
	import type { Question } from '$lib/types'

	interface Props {
		question: Question
		value: string | string[] | boolean | undefined
		onchange: (value: string | string[] | boolean) => void
	}

	let { question, value, onchange }: Props = $props()

	function asString(): string {
		return typeof value === 'string' ? value : ''
	}

	function asBoolean(): boolean {
		return value === true
	}

	function asArray(): string[] {
		return Array.isArray(value) ? value : []
	}

	function toggleOption(option: string): void {
		const current = new Set(asArray())
		if (current.has(option)) {
			current.delete(option)
		} else {
			current.add(option)
		}
		onchange([...current])
	}
</script>

{#if question.inputType === 'text' || question.inputType === 'date'}
	<input
		id={question.key}
		type={question.inputType === 'date' ? 'date' : 'text'}
		class="w-full bg-surface-container-lowest border-0 border-b-2 border-outline-variant focus:border-secondary transition-all focus:ring-0 p-4 text-on-surface placeholder:text-outline"
		value={asString()}
		oninput={(e) => onchange((e.currentTarget as HTMLInputElement).value)}
	/>
{:else if question.inputType === 'textarea'}
	<textarea
		id={question.key}
		rows="4"
		class="w-full bg-surface-container-lowest border-0 border-b-2 border-outline-variant focus:border-secondary transition-all focus:ring-0 p-4 text-on-surface placeholder:text-outline min-h-[120px] resize-y"
		placeholder="Décrivez en quelques mots..."
		oninput={(e) => onchange((e.currentTarget as HTMLTextAreaElement).value)}
	>{asString()}</textarea>
{:else if question.inputType === 'select'}
	<select
		id={question.key}
		class="w-full bg-surface-container-lowest border-0 border-b-2 border-outline-variant focus:border-secondary transition-all focus:ring-0 p-4 text-on-surface"
		value={asString()}
		onchange={(e) => onchange((e.currentTarget as HTMLSelectElement).value)}
	>
		<option value="">Sélectionner...</option>
		{#each question.options ?? [] as option}
			<option value={option}>{option}</option>
		{/each}
	</select>
{:else if question.inputType === 'boolean'}
	<div class="grid grid-cols-2 gap-4">
		<label class="relative cursor-pointer">
			<input
				type="radio"
				name={question.key}
				class="peer sr-only"
				checked={asBoolean()}
				onchange={() => onchange(true)}
			/>
			<div class="p-4 flex items-center gap-3 bg-surface-container-low border border-outline-variant transition-all peer-checked:border-primary peer-checked:bg-primary-container/10 incandesce">
				<span class="material-symbols-outlined text-secondary">check_circle</span>
				<span class="font-body-md text-on-surface">Oui</span>
			</div>
		</label>
		<label class="relative cursor-pointer">
			<input
				type="radio"
				name={question.key}
				class="peer sr-only"
				checked={value === false}
				onchange={() => onchange(false)}
			/>
			<div class="p-4 flex items-center gap-3 bg-surface-container-low border border-outline-variant transition-all peer-checked:border-outline peer-checked:bg-surface-container-high incandesce">
				<span class="material-symbols-outlined text-outline">cancel</span>
				<span class="font-body-md text-on-surface">Non</span>
			</div>
		</label>
	</div>
{:else if question.inputType === 'multiselect'}
	<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
		{#each question.options ?? [] as option}
			<label class="relative cursor-pointer">
				<input
					type="checkbox"
					class="peer sr-only"
					checked={asArray().includes(option)}
					onchange={() => toggleOption(option)}
				/>
				<div class="p-4 flex items-center gap-3 bg-surface-container-low border border-outline-variant rounded-lg transition-all peer-checked:border-primary-container peer-checked:bg-surface-container-high incandesce">
					<div class="w-5 h-5 border-2 border-outline-variant rounded-sm flex items-center justify-center peer-checked:bg-primary-container peer-checked:border-primary-container transition-all shrink-0">
						<span class="material-symbols-outlined text-xs text-on-primary-container {asArray().includes(option) ? 'opacity-100' : 'opacity-0'} transition-opacity">check</span>
					</div>
					<span class="font-body-md text-on-surface">{option}</span>
				</div>
			</label>
		{/each}
	</div>
{/if}
