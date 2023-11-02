<script lang="ts">
	import {
		trackElementPrototypes,
		type TrackElementCategory,
		type TrackElementPrototypeType
	} from '$components/TrackElements/elements'
	import { c } from '$lib/utils/classes'
	import { toReadable } from '../../../lib/utils/toStore'
	import PlainButton from '../../UI/components/PlainButton.svelte'
	import { useTrackEditor } from '../context'

	const { track, currentlySelectedElement } = useTrackEditor()

	const validated = toReadable(track, 'validated')

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
					<PlainButton
						class={c(
							'border-orange border-x-2 border-b-2 p-[6px] bg-blue-950',
							isFirst && 'rounded-t-md border-t-2'
						)}
						disabled={$validated}
						forceFocusOnMount={index === category.elements.length - 1 && !$validated}
						on:click={() => {
							if ($currentlySelectedElement) {
								track.setTrackElementType($currentlySelectedElement.id, element)
							} else {
								const newTrackElement = track.addTrackElement(element)
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
