<script lang="ts">
	const NAV_ITEMS = [
		{ label: 'Intro', icon: 'chef_hat', fromIndex: 0, toIndex: 1 },
		{ label: 'Objectifs', icon: 'target', fromIndex: 2, toIndex: 3 },
		{ label: 'Fonctions', icon: 'construction', fromIndex: 4, toIndex: 5 },
		{ label: 'Contenu', icon: 'description', fromIndex: 6, toIndex: 7 },
		{ label: 'Budget', icon: 'payments', fromIndex: 8, toIndex: 8 },
	]

	interface Props {
		currentSectionIndex: number
		onnavigate: (index: number) => void
	}

	let { currentSectionIndex, onnavigate }: Props = $props()

	function isActive(item: { fromIndex: number; toIndex: number }): boolean {
		return currentSectionIndex >= item.fromIndex && currentSectionIndex <= item.toIndex
	}
</script>

<footer class="md:hidden fixed bottom-0 left-0 w-full bg-zinc-950 border-t border-slate-800 z-50 flex justify-around items-center h-16 px-4">
	{#each NAV_ITEMS as item}
		<button
			type="button"
			onclick={() => onnavigate(item.fromIndex)}
			class="flex flex-col items-center {isActive(item) ? 'text-amber-500' : 'text-slate-400'}"
		>
			<span class="material-symbols-outlined" style={isActive(item) ? "font-variation-settings: 'FILL' 1;" : ''}>{item.icon}</span>
			<span class="text-[10px] mt-1">{item.label}</span>
		</button>
	{/each}
</footer>
