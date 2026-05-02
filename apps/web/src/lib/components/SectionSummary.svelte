<script lang="ts">
	import type { GeneratedDeliverables } from '$lib/types'

	interface Props {
		generated: GeneratedDeliverables
	}

	let { generated }: Props = $props()
</script>

<div class="bg-surface-container border border-outline-variant rounded-lg overflow-hidden">
	<div class="p-4 border-b border-outline-variant bg-surface-container-low flex items-center gap-2">
		<span class="material-symbols-outlined text-primary text-sm">auto_awesome</span>
		<h4 class="font-label-sm text-primary uppercase tracking-widest">Synthèse MoSCoW</h4>
	</div>
	<div class="p-5 space-y-4">
		<div>
			<p class="font-label-sm text-label-sm text-outline uppercase tracking-widest mb-2">Sitemap</p>
			<p class="text-sm text-on-surface-variant leading-relaxed">{generated.sitemap.join(' · ') || '—'}</p>
		</div>
		<div class="hammered-hr"></div>
		<div class="flex flex-wrap gap-2">
			{#if generated.moscow.must.length}
				<span class="px-3 py-1 bg-primary text-on-primary font-label-sm rounded-full text-[10px] uppercase">
					Must: {generated.moscow.must.length}
				</span>
			{/if}
			{#if generated.moscow.should.length}
				<span class="px-3 py-1 border border-secondary text-secondary font-label-sm rounded-full text-[10px] uppercase">
					Should: {generated.moscow.should.length}
				</span>
			{/if}
			{#if generated.moscow.could.length}
				<span class="px-3 py-1 border border-outline text-outline font-label-sm rounded-full text-[10px] uppercase">
					Could: {generated.moscow.could.length}
				</span>
			{/if}
			{#if generated.moscow.wont.length}
				<span class="px-3 py-1 border border-slate-700 text-slate-500 font-label-sm rounded-full text-[10px] uppercase opacity-60">
					Won't: {generated.moscow.wont.length}
				</span>
			{/if}
		</div>
		{#if generated.uxRecommendations.length}
			<div class="hammered-hr"></div>
			<div class="space-y-2">
				<div class="flex items-start gap-2">
					<span class="material-symbols-outlined text-primary text-sm mt-0.5">checklist</span>
					<p class="text-xs text-on-surface-variant">{generated.uxRecommendations.length} recommandation(s) UX</p>
				</div>
				<ul class="space-y-1 pl-5 list-disc marker:text-primary">
					{#each generated.uxRecommendations as recommendation}
						<li class="text-xs text-on-surface-variant leading-relaxed">{recommendation}</li>
					{/each}
				</ul>
			</div>
		{/if}
		{#if generated.risks.length}
			<div class="hammered-hr"></div>
			<div class="space-y-2">
				<div class="flex items-start gap-2">
					<span class="material-symbols-outlined text-error text-sm mt-0.5">warning</span>
					<p class="text-xs text-on-surface-variant">{generated.risks.length} risque(s) identifié(s)</p>
				</div>
				<ul class="space-y-1 pl-5 list-disc marker:text-error">
					{#each generated.risks as risk}
						<li class="text-xs text-on-surface-variant leading-relaxed">{risk}</li>
					{/each}
				</ul>
			</div>
		{/if}
	</div>
</div>
