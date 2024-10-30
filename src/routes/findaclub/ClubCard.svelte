<script>
    import { onMount } from 'svelte';
    import { Card, Button, ButtonGroup, Spinner, Toast, P, CardPlaceholder, Search, Popover } from 'flowbite-svelte';
    import { TableHeader } from 'flowbite-svelte-blocks';
    import { ArrowRightOutline } from 'flowbite-svelte-icons';
    import { getCollection } from "$lib/api";
    import { user } from "../../stores/auth";
    import { getUserDocData, toggleClub } from "../../lib/user";
    import { writable } from 'svelte/store';
    import { fly } from 'svelte/transition';
    import { Badge } from 'flowbite-svelte';

	let wholeReady = writable(false);
	let inClubs = writable([]);
	let isLoading = writable(null);
	let showToast = writable(false);

	let ready = false;

	let clubs = [];

	let myClubs = [];

	let email;

	let currClick = '';

	let searching = '';

	let userInfo;

	function labelIncludesSearchTerm(label, searchTerm) {
		if (typeof label === 'string' && typeof searchTerm === 'string') {
			return label.toLowerCase().includes(searchTerm.toLowerCase());
		}
		return false;
	}

	function handleDescription(desc) {
		if (desc.length > 100) {
			return desc.substring(0, 100) + ' ... ';
		}
		return desc;
	}

	const handleClick = async (clubId) => {
		try {
			isLoading.set(true);
			const res = await toggleClub(email, clubId);
		} catch (error) {
			console.log('Failed to toggle club! ' + error);
		} finally {
			isLoading.set(false);
			userInfo = await getUserDocData(email);
			myClubs = userInfo.joined_clubs;
			inClubs.set(myClubs);
			clubs = await getCollection('Clubs');
			setTimeout(() => {
				showToast.set(false);
			}, 3000);
			showToast.set(true);
		}
	};

    onMount(async () => {
        // IDEAL: Check if local storage is full, bring in data if not (getCollection), if full then bring in from localStorage.
        wholeReady.set(false);
        console.log("test print");
        try {
            user.subscribe(async value => {
                if (value) {
                    email = value.email;
                    userInfo = await getUserDocData(email);
                    console.log(userInfo);
                    myClubs = userInfo.joined_clubs;
                    inClubs.set(myClubs);
                    console.log(myClubs);
                }
            });
            clubs = await getCollection("Clubs");
        } catch (error) {
            console.log("Onmount failed: " + error);
        } finally {
            wholeReady.set(true);
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

<div class="wholeclubwrapper" style="height:100vh;">
	{#if $wholeReady}
		<div class="searchwrapper" style="margin-right:3rem;margin-left:3rem;margin-top:1rem;">
			<TableHeader headerType="search">
				<Search
					bind:value={searching}
					slot="search"
					placeholder="Search {clubs.length} clubs"
					size="md"
				/>
				<div class=""></div>
			</TableHeader>
		</div>

		<div class="card-container">
			{#each clubs as club}
				{#if club.status == 'Approved' && labelIncludesSearchTerm(club.club_name, searching)}
					<div class="space-y-4 clubcard">
						<Card img={club.club_img}>
							<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900">{club.club_name}</h5>
							<p class="mb-3 font-normal text-gray-700 leading-tight">
								{handleDescription(club.club_description)}
							</p>
							<ButtonGroup>
								<Button pill color="yellow">
									<a href="/findaclub/{club.id}">View Club</a>
								</Button>
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

									<Button disabled pill color="green" id="disabledjoinclubbutton">
										Join Club
									</Button>

									<Popover class="w-64 text-sm font-light " title="Make an account first!" triggeredBy="#disabledjoinclubbutton">
										<p class="text-gray-800">
											You can only join clubs when you have an account!
											<br><br>
											<u><a href="/auth/login">Log in</a></u> or <u><a href="/auth/signup">Sign up</a></u>
										</p>
									</Popover>
									
								{/if}
							</ButtonGroup>
							<br/> <br/>
							<Badge color="dark">{club.members.length} members</Badge>
						</Card>
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

		<div class="card-container">
			<CardPlaceholder />
			<CardPlaceholder />
			<CardPlaceholder />
			<CardPlaceholder />
			<CardPlaceholder />
		</div>
	{/if}
</div>

<style>
	.card-container {
		padding: 3rem;
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(3, minmax(100px, 1fr));
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
		.card-container {
			grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		}
	}
</style>
