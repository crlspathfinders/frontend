<script>
	import { onMount } from 'svelte';
	import {
		Card,
		Button,
		ButtonGroup,
		Spinner,
		Toast,
		P,
		CardPlaceholder,
		Search,
		Popover,
		Heading,
		Dropdown,
		Checkbox,
		DropdownItem,
		Span
	} from 'flowbite-svelte';
	import { TableHeader } from 'flowbite-svelte-blocks';
	import { ArrowRightOutline } from 'flowbite-svelte-icons';
	import { getCollection, sendOneEmail } from '$lib/api';
	import { user } from '../../stores/auth';
	import { getUserDocData, toggleClub } from '../../lib/user';
	import { writable } from 'svelte/store';
	import { fly } from 'svelte/transition';
	import { Badge } from 'flowbite-svelte';
	import Calendar from './Calendar.svelte';
	import { wholeWebsiteData, updateWholeWebsiteData } from '$lib/api';
	import { retrieveUserInfo, retrieveCollectionInfo, updateCache } from '$lib/cache';
	import { ChevronRightOutline, BookOpenOutline } from 'flowbite-svelte-icons';
	const SEND_URL = import.meta.env.VITE_URL;

	let wholeReady = writable(false);
	let inClubs = writable([]);
	let isLoading = writable(null);
	let showToast = writable(false);
	let filters = writable([]);

	let listDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
	let listTimes = ['Morning', 'Afternoon'];

	let ready = false;

	let clubs = [];

	let myClubs = [];

	let email;

	let currClick = '';

	let searching = '';

	let userInfo;

	let info;

	let windowWidth;
	let columns;

	// Filter functionality
	function toggleFilters(item) {
		console.log(filters);
		filters.update((currentItems) => {
			// Check if the item exists in the array
			if (currentItems.includes(item)) {
				// Remove the item if it exists
				return currentItems.filter((i) => i !== item);
			} else {
				// Add the item if it doesn't exist
				return [...currentItems, item];
			}
		});
	}

	// Dollar sign ($:) syntax is used for reactivity. Whenever any variables that are used after the $:, the whole function is rerun. For example, whenever the mentors variable changes, the filteredMentors variable also changes its data based on the lines in the second return statement (the specifics for how this work isn't really too important).
	$: filteredClubs = clubs.filter((obj) => {
		// If no filters are selected, include the club.
		if ($filters.length === 0) return true;
		// Include the club if it passes at least one filter
		return $filters.some((filter) =>
			Array.isArray(obj.club_days) && obj.club_days.includes(filter) ||
			parseInt(obj.start_time) < 12 && filter === 'Morning' ||
			parseInt(obj.start_time) > 12 && filter === 'Afternoon'
		);
	});

	function labelIncludesSearchTerm(label, searchTerm) {
		if (typeof label === 'string' && typeof searchTerm === 'string') {
			return label.toLowerCase().includes(searchTerm.toLowerCase());
		}
		return false;
	}

	// Only shows the first 100 characters of the description
	function handleDescription(desc) {
		if (desc.length > 100) {
			return desc.substring(0, 100) + ' ... ';
		}
		return desc;
	}

	// This function is used to join / leave a club. It takes the club's unique id as a parameter.
	const handleClick = async (clubId) => {
		try {
			isLoading.set(true);
			// Calls the toggleClub function that is defined in the api/user file, not api/club file, because it's really the user leaving the club, not the other way around.
			const res = await toggleClub(email, clubId);
			// Brings in the current user's information.
			userInfo = await getUserDocData(email);
			// Calls the updateCache function from lib/cache.js to update the userInfo whenever they join/leave a club.
		} catch (error) {
			console.log('Failed to toggle club! ' + error);
		} finally {
			isLoading.set(false);
			userInfo = await getUserDocData(email);
			myClubs = userInfo.joined_clubs;
			inClubs.set(myClubs);
			clubs = await getCollection('Clubs'); // TO-DO: Change into caching, etc.
		}
	};

	if (typeof window !== 'undefined') {
		windowWidth = Math.min(screen.width, window.innerWidth);
		console.log(windowWidth);
		columns = Math.max(1, Math.floor((windowWidth - 100) / 384));

		window.addEventListener('resize', () => {
			windowWidth = Math.min(screen.width, window.innerWidth);
			console.log(windowWidth);
			columns = Math.max(1, Math.floor((windowWidth - 100) / 384));
		});
	}

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

<div class="outer-container">
	<div class="wholeclubwrapper bg-gray-100" style="height:100%;">
		{#if $wholeReady}
			<div class="titleinfowrapper" style="margin-left: 3rem; margin-right: 3rem;">
				<br />
				<Heading
					><Span underline decorationClass="decoration-8 decoration-red-800 dark:decoration-red-600"
						>Find</Span
					> a Club</Heading
				>
				<br />
				{#each info as inf, i}
					{#if i == 0}
						<P size="xl">{inf}</P>
					{:else if i == 1}
						<P size="lg">{inf}</P>
					{:else}
						<P size="sm">{inf}</P>
					{/if}
				{/each}
				<!-- <P size="xl">
			Scroll through the available clubs within CRLS! You can look at when clubs meet, who else is
			in the club, what their mission statement is, and so much more!
		</P> -->
				<P size="lg">
					Interested in <u><a href="/registeryourclub">registering</a></u> your club? Please follow
					the steps
					<u
						><a
							target="_blank"
							href="https://docs.google.com/document/d/1KE2f7uTJbHAJTiiC_QR9EC_LPuOrgRl2xr2qtWoNaeo/edit?tab=t.0"
							>here</a
						></u
					>!
				</P>
			</div>

			<Calendar />

			<div class="searchwrapper" style="margin-right:3rem;margin-left:3rem;margin-top:1rem;">
				<TableHeader headerType="search">
					<Search
						bind:value={searching}
						slot="search"
						placeholder="Search {clubs.length} clubs"
						size="md"
					/>
					<div class=""></div>
					<Button outline color="blue">Filters</Button>
					<Dropdown class="w-48 p-3 space-y-2 text-sm">
						<DropdownItem class="flex items-center justify-between">
							Meeting Days<ChevronRightOutline class="w-6 h-6 ms-2 text-primary-700 dark:text-white" />
						</DropdownItem>
						<Dropdown placement="right-start">
							{#each listDays as r}
								<DropdownItem>
									{#if $filters.includes(r)}
										<Checkbox
											checked
											on:change={() => {
												toggleFilters(r);
												console.log($filters);
											}}><li>{r}</li></Checkbox
										>
									{:else}
										<Checkbox
											on:change={() => {
												toggleFilters(r);
												console.log($filters);
											}}><li>{r}</li></Checkbox
										>
									{/if}
								</DropdownItem>
							{/each}
						</Dropdown>
						<DropdownItem class="flex items-center justify-between">
							Time<ChevronRightOutline class="w-6 h-6 ms-2 text-primary-700 dark:text-white" />
						</DropdownItem>
						<Dropdown placement="right-start">
							{#each listTimes as r}
								<DropdownItem>
									{#if $filters.includes(r)}
										<Checkbox
											checked
											on:change={() => {
												toggleFilters(r);
												console.log($filters);
											}}><li>{r}</li></Checkbox
										>
									{:else}
										<Checkbox
											on:change={() => {
												toggleFilters(r);
												console.log($filters);
											}}><li>{r}</li></Checkbox
										>
									{/if}
								</DropdownItem>
							{/each}
						</Dropdown>
					</Dropdown>
					<Button
						outline
						color="dark"
						on:click={() => {
							filters.set([]);
						}}>Reset filters</Button
					>
				</TableHeader>
				<!-- This just lists out the different filters that are currently selected: -->
				{#if $filters.length > 0}
					<br />
					{#if $filters.length > 0}
						{#each $filters as f}
							<Badge color="blue" style="margin-right:.2rem;">{f}</Badge>
						{/each}
					{/if}
				{/if}
			</div>

			<div class="flex card-container">
				{#each Array(columns) as _, colIndex}
					{#if filteredClubs
						.filter((club) => club.status === 'Approved' && labelIncludesSearchTerm(club.club_name, searching))
						.filter((_, i) => i % columns === colIndex).length > 0}
						<div class="masonry-column" style="flex: 1;">
							{#each filteredClubs
								.filter((club) => club.status === 'Approved' && labelIncludesSearchTerm(club.club_name, searching))
								.filter((_, i) => i % columns === colIndex) as club}
								<div class="space-y-4 clubcard">
									<a href="/findaclub/{club.id}">
										<Card img={club.club_img}>
											<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900">
												{club.club_name}
											</h5>
											<p class="mb-3 font-normal text-gray-700 leading-tight">
												{handleDescription(club.club_description)}
											</p>
											<ButtonGroup>
												<!-- <Button pill color="yellow">
													<a href="/findaclub/{club.id}">View Club</a>
												</Button> -->
												{#if $user}
													{#if myClubs.includes(club.id)}
														<Button
															pill
															color="red"
															on:click={() => {
																currClick = club.id;
																handleClick(club.id);
															}}
														>
															Leave Club
															{#if $isLoading}
																{#if currClick == club.id}
																	<Spinner size={4} color="red" />
																{/if}
															{/if}
														</Button>
													{:else}
														<Button
															pill
															color="green"
															on:click={() => {
																currClick = club.id;
																handleClick(club.id);
															}}
														>
															Join Club
															{#if $isLoading}
																{#if currClick == club.id}
																	<Spinner size={4} color="green" />
																{/if}
															{/if}
														</Button>
													{/if}
												{:else}
													<Button disabled pill color="green" id="disabledjoinclubbutton"
														>Join Club</Button
													>

													<Popover
														class="w-64 text-sm font-light "
														title="Make an account first!"
														triggeredBy="#disabledjoinclubbutton"
													>
														<p class="text-gray-800">
															You can only join clubs when you have an account!
															<br /><br />
															<u><a href="/auth/login">Log in</a></u> or
															<u><a href="/auth/signup">Sign up</a></u>
														</p>
													</Popover>
												{/if}
											</ButtonGroup>
											<br /> <br />
											<Badge color="dark">{club.members.length} members</Badge>
											<Badge color="blue">{club.club_days}</Badge>
										</Card>
									</a>
								</div>
							{/each}
						</div>
					{/if}
				{/each}
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
		padding-bottom: 3rem;
		width: fit-content;
	}

	.placeholder-card-container {
		display: flex;
		gap: 1rem;
	}
	.card-container {
		padding: 0 3rem;
		overflow: hidden;
		width: fit-content;
		gap: 1rem;
		align-self: center;
		/* display: grid;
            gap: 1rem;
            grid-template-columns: repeat(3, minmax(100px, 1fr)); */
	}

	.masonry-column {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		align-items: center;
		width: 1fr;
	}

	.clubcard:hover {
		transform: scale(1.02);
		transition: all ease-in-out 0.08s;
		box-shadow: inset;
	}

	@media (max-width: 1200px) {
		.card-container {
			grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		}
	}

	@media (max-width: 800px) {
		.card-container {
			grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		}
	}

	@media (max-width: 500px) {
		.wholeclubwrapper {
			padding: 1rem;
		}

		.card-container {
			padding: 0 1rem;
		}

		.titleinfowrapper {
			margin-left: 1rem !important;
			margin-right: 1rem !important;
		}
		.searchwrapper {
			margin-right: 1rem !important;
			margin-left: 1rem !important;
		}
	}
</style>
