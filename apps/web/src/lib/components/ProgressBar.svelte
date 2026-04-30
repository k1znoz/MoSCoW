<script lang="ts">
	interface Props {
		progress: number
	}

	let { progress }: Props = $props()
</script>

<div class="w-full max-w-2xl mx-auto lg:mx-0 mb-16">
	<div class="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
		<span>Progression</span>
		<span class="text-primary">{progress}%</span>
	</div>
	<div class="w-full h-3 bg-surface-container-lowest rounded-full overflow-hidden border border-outline-variant">
		<div
			class="h-full bg-gradient-to-r from-primary-container to-secondary-container shadow-[0_0_10px_rgba(223,115,40,0.5)] transition-all duration-500"
			style="width: {progress}%"
		></div>
	</div>
</div>
