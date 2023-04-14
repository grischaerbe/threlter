<script lang="ts">
	import { goto } from '$app/navigation'
	import UiWrapper from '$components/UI/UiWrapper.svelte'
	import BackButton from '$components/UI/components/BackButton.svelte'
	import Button from '$components/UI/components/Button.svelte'
	import TopBar from '$components/UI/components/TopBar.svelte'
	import TrackSelection from '$components/UI/layouts/TrackSelection.svelte'
	import { TrackData } from '$lib/TrackData/TrackData'
	import { appState } from '$stores/app'
	import JSZip from 'jszip'
	import TopBarLayout from '$components/UI/layouts/TopBarLayout.svelte'

	let trackSelected = false

	const localStorageTrackIds = TrackData.localStorageTrackIds

	const filterUndefined = <T>(value: T | undefined): value is T => {
		return !!value
	}

	$: trackDatas = $localStorageTrackIds
		.map((trackId) => {
			const trackData = TrackData.fromLocalStorage(trackId)
			return trackData
		})
		.filter(filterUndefined)

	let fileInputEl: HTMLInputElement

	$: userHasTracks = trackDatas.length > 0

	const handleImport = async (file: File) => {
		const zip = await JSZip.loadAsync(file)
		zip.forEach((path, file) => {
			if (path === 'track.json') {
				file.async('string').then((content) => {
					const trackData = TrackData.fromString(content)
					trackData?.toLocalStorage(0)
					TrackData.updateLocalStorageTrackIds()
				})
			}
		})
	}
</script>

<UiWrapper>
	<TopBarLayout>
		<BackButton slot="topbar-left" href="/menu/main">Back</BackButton>

		<p slot="topbar-center">USER TRACKS</p>

		<div slot="topbar-right" class="flex flex-row gap-[2px]">
			<input
				bind:this={fileInputEl}
				class="hidden"
				type="file"
				on:change={() => {
					if (!fileInputEl) return
					const selectedFile = fileInputEl.files?.[0]
					if (!selectedFile || !selectedFile?.name.endsWith('.zip')) {
						alert('Please select a .zip file')
						return
					}
					handleImport(selectedFile)
				}}
			/>
			<Button
				on:click={() => {
					if (!fileInputEl) return
					fileInputEl.click()
				}}
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 256 256">
					<path
						d="M216.49,199.51a12,12,0,0,1-17,17L128,145,56.49,216.49a12,12,0,0,1-17-17l80-80a12,12,0,0,1,17,0Zm-160-63L128,65l71.51,71.52a12,12,0,0,0,17-17l-80-80a12,12,0,0,0-17,0l-80,80a12,12,0,0,0,17,17Z"
					/>
				</svg>
				IMPORT
			</Button>
			<Button
				forceFocusOnMount={!userHasTracks}
				on:click={() => {
					const trackDatas = $localStorageTrackIds
						.map((userTrackId) => {
							return TrackData.fromLocalStorage(userTrackId)
						})
						.filter(filterUndefined)
					const trackNamesStartingWithUnnamed = trackDatas.filter((trackData) => {
						return trackData.trackName.current.startsWith('Unnamed Track')
					}).length

					const trackData = TrackData.createEmpty()
					trackData.trackName.set(`Unnamed Track ${trackNamesStartingWithUnnamed + 1}`)
					trackData.authorName.set(appState.options.player.name.current)
					trackData.addTrackElement('Box')

					goto(`/user/${trackData.trackId}/edit`)
				}}
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 256 256">
					<path
						d="M228,128a12,12,0,0,1-12,12H140v76a12,12,0,0,1-24,0V140H40a12,12,0,0,1,0-24h76V40a12,12,0,0,1,24,0v76h76A12,12,0,0,1,228,128Z"
					/>
				</svg>
				CREATE
			</Button>
		</div>

		<TrackSelection
			bind:trackSelected
			{trackDatas}
			tracksCanBeEdited
			tracksCanBeDeleted
			tracksCanBeDuplicated
			showAuthor
			on:playtrack={(e) => {
				goto(`/user/${e.detail.trackId}/time-attack`)
			}}
			on:deletetrack={(e) => {
				TrackData.removeFromLocalStorage(e.detail.trackId)
				TrackData.updateLocalStorageTrackIds()
			}}
			on:edittrack={(e) => {
				goto(`/user/${e.detail.trackId}/edit`)
			}}
			on:duplicatetrack={(e) => {
				const trackData = TrackData.fromLocalStorage(e.detail.trackId)
				if (!trackData) return
				trackData.clone().toLocalStorage(0)
				TrackData.updateLocalStorageTrackIds()
			}}
		/>
	</TopBarLayout>
</UiWrapper>
