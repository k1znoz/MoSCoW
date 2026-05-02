<script lang="ts">
	interface NavPhase {
		id: string
		label: string
		icon: string
		fromIndex: number
		toIndex: number
	}

	const NAV_PHASES: NavPhase[] = [
		{ id: 'intro', label: 'Introduction', icon: 'chef_hat', fromIndex: 0, toIndex: 1 },
		{ id: 'goals', label: 'Objectifs', icon: 'target', fromIndex: 2, toIndex: 3 },
		{ id: 'features', label: 'Fonctionnalites', icon: 'construction', fromIndex: 4, toIndex: 5 },
		{ id: 'content', label: 'Contenu', icon: 'description', fromIndex: 6, toIndex: 7 },
		{ id: 'budget', label: 'Budget & Delais', icon: 'payments', fromIndex: 8, toIndex: 8 },
	]

	interface Props {
		currentSectionIndex: number
		onnavigate: (index: number) => void
	}

	let { currentSectionIndex, onnavigate }: Props = $props()

	function activePhase(index: number): NavPhase | undefined {
		return NAV_PHASES.find((p) => index >= p.fromIndex && index <= p.toIndex)
	}

	const current = $derived(activePhase(currentSectionIndex))
</script>

<aside class="fixed left-0 top-0 h-full flex flex-col pt-20 bg-zinc-950 font-serif text-sm uppercase tracking-widest border-r border-slate-800 w-64 z-40 hidden lg:flex">
	<div class="px-6 mb-8">
		<h2 class="text-xl font-black text-orange-600">Project Forge</h2>
		<p class="text-[10px] text-slate-500 mt-1">Phase de cadrage</p>
	</div>

	<nav class="flex flex-col flex-1">
		{#each NAV_PHASES as phase}
			{#if current?.id === phase.id}
				<button
					type="button"
					onclick={() => onnavigate(phase.fromIndex)}
					class="text-amber-500 border-r-2 border-amber-500 pr-4 bg-zinc-900/50 px-4 py-3 flex items-center gap-3 text-left"
				>
					<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">{phase.icon}</span>
					<span>{phase.label}</span>
				</button>
			{:else}
				<button
					type="button"
					onclick={() => onnavigate(phase.fromIndex)}
					class="text-slate-500 px-4 py-3 hover:bg-zinc-900 hover:text-orange-400 transition-all flex items-center gap-3 text-left"
				>
					<span class="material-symbols-outlined">{phase.icon}</span>
					<span>{phase.label}</span>
				</button>
			{/if}
		{/each}
	</nav>

	<div class="p-6 border-t border-slate-800">
		<div class="flex items-center gap-3 bg-surface-container-low p-3 rounded-lg border border-outline-variant">
			<div class="w-10 h-10 rounded-full bg-surface-bright flex items-center justify-center border border-outline-variant overflow-hidden shrink-0">
				<span class="material-symbols-outlined text-outline text-xl">person</span>
			</div>
			<div>
				<p class="text-[10px] font-bold text-on-surface normal-case tracking-normal">Maitre Artisan</p>
				<p class="text-[9px] text-slate-500 normal-case tracking-normal">Prêt pour la forge</p>
			</div>
		</div>
	</div>
</aside>
