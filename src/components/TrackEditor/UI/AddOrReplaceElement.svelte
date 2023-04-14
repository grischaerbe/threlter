<script lang="ts">
	import { c } from '$lib/utils/classes'
	import {
		type TrackElementCategory,
		type TrackElementPrototypeType,
		trackElementPrototypes
	} from '$components/TrackElements/elements'
	import Button from '$components/UI/components/Button.svelte'
	import { useTrackEditor } from '../context'

	const { trackData, currentlySelectedElement } = useTrackEditor()
	const validated = trackData.validated

	type Category = {
		name: TrackElementCategory
		previewImage: string
		elements: TrackElementPrototypeType[]
	}

	let selectedCategory: Category | undefined = undefined

	const categories: Category[] = []

	Object.entries(trackElementPrototypes).forEach(([key, value]) => {
		const category = categories.find((category) => category.name === value.category)

		if (category) {
			category.elements.push(key as any)
		} else {
			categories.push({
				name: value.category,
				previewImage: `/TrackElements/images/${key}.png`,
				elements: [key as any]
			})
		}
	})
</script>

<div class={c('flex flex-row items-end gap-[2px]', $validated && 'opacity-50')}>
	{#each categories as category, index}
		<div class="flex flex-col gap-[2px]">
			{#if selectedCategory === category && !$validated}
				{#each category.elements as element, index}
					<Button
						class="!px-0"
						disabled={$validated}
						forceFocusOnMount={index === category.elements.length - 1 && !$validated}
						on:click={() => {
							if ($currentlySelectedElement) {
								trackData.setTrackElementType($currentlySelectedElement.id, element)
							} else {
								const newTrackElement = trackData.addTrackElement(element)
								currentlySelectedElement.set(newTrackElement)
							}
						}}
					>
						<img
							src="/TrackElements/images/{element}.png"
							alt={element}
							class="!h-[60px] !w-[60px]"
						/>
					</Button>
				{/each}
			{/if}

			<Button
				on:click={() => {
					if (selectedCategory === category) {
						selectedCategory = undefined
					} else {
						selectedCategory = category
					}
				}}
				forceFocusOnMount={index === 0 && !$validated}
				class="!px-0"
				disabled={$validated}
			>
				<img src={category.previewImage} alt={category.name} class="!h-[60px] !w-[60px]" />
			</Button>
		</div>
	{/each}
</div>
