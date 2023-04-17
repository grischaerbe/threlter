<script lang="ts">
	import { goto } from '$app/navigation'
	import UiWrapper from '$components/UI/UiWrapper.svelte'
	import TopBarLayout from '$components/UI/layouts/TopBarLayout.svelte'
	import TrackSelection from '$components/UI/layouts/TrackSelection.svelte'
	import { TrackData } from '$lib/TrackData/TrackData'
	import { appState } from '$stores/app'
	import JSZip from 'jszip'
	import SpecialButton from '../../../../../components/UI/components/SpecialButton.svelte'
	import TopMenu from '../../../../../components/UI/layouts/TopMenu.svelte'

	let trackSelected = false

	const localStorageTrackIds = TrackData.localStorageTrackIds

	const createDemoTrack = () => {
		const trackData = TrackData.createEmpty()
		trackData.trackName.set(`Demo Track`)
		trackData.authorName.set(appState.options.player.name.current)
		trackData.addTrackElement('Box')
	}

	$: if ($localStorageTrackIds.length === 0) {
		createDemoTrack()
		TrackData.updateLocalStorageTrackIds()
	}

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
		<TopMenu slot="topbar-center" />

		<TrackSelection
			bind:trackSelected
			{trackDatas}
			tracksCanBeEdited
			tracksCanBeDeleted
			tracksCanBeDuplicated
			tracksCanBeValidated
			tracksCanBeExported
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
			on:validatetrack={(e) => {
				goto(`/user/${e.detail.trackId}/validate`)
			}}
			on:exporttrack={(e) => {
				const trackData = TrackData.fromLocalStorage(e.detail.trackId)
				if (!trackData) return
				trackData.saveTrackToDisk()
			}}
		>
			<div
				class="bottom-0 pb-[15px] bg-gradient-to-t from-blue-950 to-transparent pt-[60px] left-0 w-full justify-center absolute flex flex-row gap-[15px] text-[0.8em]"
			>
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
				<SpecialButton
					style="inverted"
					on:click={() => {
						if (!fileInputEl) return
						fileInputEl.click()
					}}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="60"
						height="60"
						fill="#000000"
						viewBox="0 0 256 256"
					>
						<path
							d="M213.66,202.34A8,8,0,0,1,208,216H48a8,8,0,0,1-5.66-13.66L108.69,136H48a8,8,0,0,1-5.66-13.66l80-80a8,8,0,0,1,11.32,0l80,80A8,8,0,0,1,208,136H147.31Z"
						/>
					</svg>
					IMPORT
				</SpecialButton>
				<SpecialButton
					style="inverted"
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
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="60"
						height="60"
						fill="#000000"
						viewBox="0 0 256 256"
					>
						<path
							d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM184,136H136v48a8,8,0,0,1-16,0V136H72a8,8,0,0,1,0-16h48V72a8,8,0,0,1,16,0v48h48a8,8,0,0,1,0,16Z"
						/>
					</svg>
					CREATE
				</SpecialButton>
			</div>
		</TrackSelection>
	</TopBarLayout>
</UiWrapper>
