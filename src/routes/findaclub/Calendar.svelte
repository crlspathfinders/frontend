<script>
	import { onMount } from 'svelte';
	import {
		Spinner,
		Toast,
		CardPlaceholder,
		Modal,
		Button
	} from 'flowbite-svelte';
	import { TableHeader } from 'flowbite-svelte-blocks';
	import { ArrowRightOutline } from 'flowbite-svelte-icons';
	import { getCollection, sendOneEmail } from '$lib/api';
	import { user } from '../../stores/auth';
	import { getUserDocData, toggleClub } from '../../lib/user';
	import { writable } from 'svelte/store';
	import { fly } from 'svelte/transition';
	import { Badge } from 'flowbite-svelte';
	import { wholeWebsiteData, updateWholeWebsiteData } from "$lib/api";
	import { retrieveUserInfo, retrieveCollectionInfo, updateCache } from '$lib/cache';
	const SEND_URL = import.meta.env.VITE_URL;

	let wholeReady = writable(false);
	let inClubs = writable([]);
	let isLoading = writable(null);
	let showToast = writable(false);

	let ready = false;

	let showLogsModal = writable(false);
	const openshowLogsModal = () => showLogsModal.set(true);
	const closeshowLogsModal = () => { showLogsModal.set(false);};

	let clubs;

	let email;

	let info;

	onMount(async () => {
		wholeReady.set(false);
		try {
			// const sendMail = await sendOneEmail("club card on mount", "works!", "crlspathfinders25@gmail.com")
			// console.log(sendMail);
			let targetId = wholeWebsiteData.findIndex((item) => item.id === 'clubs');
			console.log('target id: ', targetId);
			if (targetId > -1) {
				clubs = wholeWebsiteData[targetId].info;
			} else {
				clubs = await getCollection('Clubs');
				updateWholeWebsiteData('clubs', clubs);
			}

			targetId = wholeWebsiteData.findIndex((item) => item.id === 'allinfo');
			if (targetId > -1) {
				const allInfo = wholeWebsiteData[targetId].info;
				for (let i = 0; i < allInfo.length; i++) {
					if (allInfo[i].id == 'findaclub') {
						info = allInfo[i].info;
					}
				}
			} else {
				const allInfo = await getCollection('AllInfo');
				for (let i = 0; i < allInfo.length; i++) {
					if (allInfo[i].id == 'findaclub') {
						info = allInfo[i].info;
					}
				}
				updateWholeWebsiteData('allinfo', allInfo);
			}

			let loggedInUser;
			targetId = wholeWebsiteData.findIndex((item) => item.id === 'loggedInUser');
			if (targetId > -1) {
				loggedInUser = wholeWebsiteData[targetId].info;
				email = loggedInUser.email;
			} else {
				user.subscribe(async (value) => {
					if (value) {
						email = value.email;
						loggedInUser = await getUserDocData(email);
						updateWholeWebsiteData('loggedInUser', loggedInUser);
					} else {
						email = '';
					}
				});
			}
		} catch (error) {
			const sendMail = await sendOneEmail(
				'club card on mount error',
				error,
				'crlspathfinders25@gmail.com'
			);
			console.log(sendMail);
			console.error('Onmount failed: ' + error);
		} finally {
			wholeReady.set(true);
			localStorage.clear();
		}
	});
</script>

{#if $showToast}
	<div class="toastwrapper" style="z-index:10;">
		<Toast transition={fly} params={{ x: 200 }} position="bottom-right" color="green" class="mb-4">
			<!-- <DownloadOutline slot="icon" class="w-6 h-6" /> -->
			Successfully joined / left club
		</Toast>
	</div>
{/if}

<Modal open={$showLogsModal} on:close={closeshowLogsModal} size="xl">
	<div class="outer-container">
		<div class="wholeclubwrapper" style="height:100%;">
			{#if $wholeReady}
				<div class="flex card-container">
					{#if clubs}
						{#each ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as day}
							<div class="masonry-column" style="flex: 1;">
								<h2>{day}</h2>
	
								{#if clubs.filter((c) => c.club_days.includes(day)).length == 0}
									<p class="noclubs-placeholder">No Clubs</p>
								{/if}
	
								{#each clubs.filter((c) => c.club_days.includes(day))
											.sort((a, b) => a.start_time.localeCompare(b.start_time)) as c}
									<a class="calcard" href="/findaclub/{c.id}">
										<h3>{c.club_name}</h3>
										<h2>
											{#if c.start_time[0] == 0}
												{c.start_time.slice(1)}
											{:else if parseInt(c.start_time.substring(0, 2)) > 13}
												{(parseInt(c.start_time.substring(0, 2)) - 12)}:{c.start_time.substring(3)}
											{:else}
												{c.start_time}	
											{/if}
										</h2>
										<!--
											 <h2>{get_average_rgb(c.club_img)}</h2> -->
										
									</a>
								{/each}
							</div>
						{/each}
					{/if}
				</div>
			{:else}
				<center>
					<div class="loadingwrapper" style="font-size:large; margin-top:1rem;">
						Loading Clubs ... <Spinner color="blue" />
					</div>
				</center>
	
				<div class="placeholder-card-container">
					<CardPlaceholder />
					<CardPlaceholder />
					<CardPlaceholder />
					<CardPlaceholder />
					<CardPlaceholder />
				</div>
			{/if}
		</div>
	</div>
</Modal>

<Button on:click={openshowLogsModal} color="dark" size="lg" outline style="margin-left: 3rem; margin-right: 3rem;">
	Show Club Calendar
</Button>

<style>
	.outer-container {
		display: flex;
		justify-content: center;
	}
	.wholeclubwrapper {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		/* align-items: center;
            justify-content: center; */
		padding: 3rem;
		width: fit-content;
		width: 100%;
	}

	.placeholder-card-container {
		display: flex;
		gap: 1rem;
	}

	.card-container {
		padding: 0 3rem;
		overflow: hidden;
		width: 100%;
		gap: 1rem;
		max-width: 1400px;
		align-self: center;
		/* display: grid;
            gap: 1rem;
            grid-template-columns: repeat(3, minmax(100px, 1fr)); */
	}

	.masonry-column {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		width: 1fr;
		border-left: 2px solid #ccc;
		padding-left: 1rem;
	}

	.calcard {
		background-color: white;
		border-radius: 8px;
		padding: 0.8rem;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		transition: all ease-in-out 0.08s;
        color: black;
        cursor: pointer;
		background-color: rgb(220,240,255);
	}

	.calcard:hover {
		transform: scale(1.02);
		transition: all ease-in-out 0.08s;
		box-shadow: inset;
	}

	.noclubs-placeholder {
		color: #ccc;
		font-style: italic;
	}

	@media (max-width: 1200px) {
		.card-container {
			grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		}
	}

	@media (max-width: 1000px) {
		.card-container {
			flex-direction: column;
			max-width: 600px;
		}
	}

	@media (max-width: 500px) {
		.wholeclubwrapper {
			padding: 1rem;
		}

		.card-container {
			padding: 0 1rem;
		}
	}
</style>
