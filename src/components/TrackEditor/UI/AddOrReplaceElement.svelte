<script lang="ts">
	import { c } from '$lib/utils/classes'
	import {
		type TrackElementCategory,
		type TrackElementPrototypeType,
		trackElementPrototypes
	} from '$components/TrackElements/elements'
	import Button from '$components/UI/components/Button.svelte'
	import { useTrackEditor } from '../context'
	import PlainButton from '../../UI/components/PlainButton.svelte'

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

<div class={c('flex flex-row items-end gap-[5px]', $validated && 'opacity-50')}>
	{#each categories as category, index}
		{@const isSelected = selectedCategory === category}
		<div class="flex flex-col gap-[0px]">
			{#if isSelected && !$validated}
				{#each category.elements as element, index}
					{@const isFirst = index === 0}
					{@const isLast = index === category.elements.length - 1}
					<PlainButton
						class={c(
							'border-orange border-x-2 border-b-2 p-[6px] bg-blue-950',
							isFirst && 'rounded-t-md border-t-2'
						)}
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
							class="!h-[56px] !w-[56px]"
						/>
					</PlainButton>
				{/each}
			{/if}

			<PlainButton
				on:click={() => {
					if (selectedCategory === category) {
						selectedCategory = undefined
					} else {
						selectedCategory = category
					}
				}}
				forceFocusOnMount={index === 0 && !$validated}
				class={c(
					'border-orange p-[6px]',
					isSelected
						? 'border-x-2 border-b-2 rounded-b-md bg-blue-900'
						: 'border-2 rounded-md bg-blue-950'
				)}
				disabled={$validated}
			>
				<img src={category.previewImage} alt={category.name} class="!h-[56px] !w-[56px]" />
			</PlainButton>
		</div>
	{/each}
</div>
