<script>
	// Importing all of the functions, variables, and components to be used..
	import { onMount } from 'svelte';
	import { retrieveUserInfo, retrieveCollectionInfo } from '$lib/cache';
	import {
		Popover,
		Card,
		Button,
		ButtonGroup,
		Spinner,
		Avatar,
		Toast,
		P,
		A,
		CardPlaceholder,
		Modal,
		Dropdown,
		Checkbox,
		Heading,
		DropdownItem,
		Badge,
		Span,
		Label
	} from 'flowbite-svelte';
	import MultiSelect from 'svelte-multiselect';
	import { ArrowRightOutline, ListMusicOutline } from 'flowbite-svelte-icons';
	import { getCollection, getBackendCache } from '$lib/api';
	import { user } from '../../stores/auth';
	import { getUserDocData, toggleClub, fetchUserInfo } from '../../lib/user';
	import { writable } from 'svelte/store';
	import { PenOutline } from 'flowbite-svelte-icons';
	import RegisterForm from '../becomeamentor/RegisterForm.svelte';
	import { TableHeader } from 'flowbite-svelte-blocks';
	import { Search } from 'flowbite-svelte';
	import { retrieveDemographics } from '../../lib/mentor';
	import { ChevronRightOutline, BookOpenOutline } from 'flowbite-svelte-icons';

	// Declaring variables to be used:
	let wholeReady = writable(false); // The "writable" syntax initialized the wholeReady boolean variable as a store. Stores allow us to make the site more dynamic, changing variables and states without having to reload the page.
	let showEditModal = writable(false); // boolean store
	let filters = writable([]); // list store
	let showLogsModal = writable(false);

	let ready = false;
	let mentors = [];
	let list_mentees = [];
	let selected_mentees = [];
	let email = '';
	let userInfo;
	let view = 'Edit';
	let showVals = true;
	let currMentor;
	let searching = '';

	let listAcademics = [];
	let listRaces = [];
	let listReligions = [];
	let listGenders = [];
	let listLanguages = [];

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
	$: filteredMentors = mentors.filter((obj) => {
		// Only apply filters to fields that have values in the arrays
		return $filters.every((filter) => {
			return (
				(obj.academics.length > 0 && obj.academics.includes(filter)) ||
				(obj.races.length > 0 && obj.races.includes(filter)) ||
				(obj.languages.length > 0 && obj.languages.includes(filter)) ||
				(obj.religions.length > 0 && obj.religions.includes(filter)) ||
				(obj.gender.length > 0 && obj.gender.includes(filter))
			);
		});
	});

	// Checks if the searching term is in a defined label.
	function labelIncludesSearchTerm(label, searchTerm) {
		// Makes sure both are strings
		if (typeof label === 'string' && typeof searchTerm === 'string') {
			// Is not case-sensitive.
			return label.toLowerCase().includes(searchTerm.toLowerCase());
		}
		return false;
	}

	// This function isn't currently being used.
    function filtersIncluded(mentor) {
        console.log(mentor);
        let all_info = [];
        if (mentor.academics.length > 0) { all_info.push(mentor.academics); }
        if (mentor.gender.length > 0) { all_info.push(mentor.gender); }
        if (mentor.languages.length > 0) { all_info.push(mentor.languages); }
        if (mentor.races.length > 0) { all_info.push(mentor.races); }
        if (mentor.religions.length > 0) { all_info.push(mentor.religions); }
        console.log(all_info);
        console.log($filters.length);        
        // if any of these are in filters, then return true.
        for (let i = 0; i < all_info.length; i++) {
            for (let j = 0; j < $filters.length; j++) {
                if (all_info[i].localeCompare($filters[j]) === 0) {return true};
            }
        }
        return false;
    }

	function setListMentors(mentors) {
		for (let i = 0; i < mentors.length; i++) {
			const new_mentor = mentors[i];
			new_mentor["label"] = new_mentor.firstname + " " + new_mentor.lastname;
			list_mentees.push(new_mentor);
		}
		return list_mentees;
	}

	// onMount function run whenever the page reloads (is an async function because we call await functions in the function).
  	onMount(async () => {
		// By default wholeReady is false, and therefore no data is rendered onto the page.
		wholeReady.set(false);
		// Whole thing in try-catch block:
		try {
			// GOOD CODE:
			// Checks if userInfo is not in the localStorage
			if (!localStorage.getItem('userInfo')) {
				console.log('userinfo not in storage');
				// If userInfo is not in localStorage calls the retrieveUserInfo function from cache.js, which will store the current user's information in the localStorage for future use and caching. This function is used with await because it is an async function
				userInfo = await retrieveUserInfo();
				// email = userInfo.email;
				console.log(userInfo);
			} else {
				// If we reach here, that means userInfo is in localStorage
				console.log('userinfo already in storage');
				try {
					// Retrieves the correct userInfo from the localStorage (we know that it must be there!)
					userInfo = localStorage.getItem('userInfo'); // This will return a STRING.
					userInfo = JSON.parse(userInfo); // JSON.parse is IMPERATIVE because it turns the string that is returned into a JSON dictionary, allowing us to access data from that dictionary, like the user's email, etc.
					// console.log(userInfo);
					email = userInfo['email'];
					// console.log(email);
				} catch (error) {
					// Prints the error that to the console, if one exists.
					console.log("couldn't fetchuserinfo: " + error);
				} finally {
					console.log('finished');
				}
			}

			// GREAT WORKS: (uncomment to see in action): The reason we don't use this function now, even though it significantly speeds up the loading time, is because it is not done yet - we have to make sure the mentor data in localStorage is updated when the mentor updates their information, which hasn't been done yet. (That is a TO-DO! - see ClubCard handleClick() function for an example of how to do that, it's not too hard.)

			// if (!localStorage.getItem('mentorsInfo')) {
			// 	console.log('mentors not in locstor!');
			// 	mentors = await retrieveCollectionInfo('Mentors');
			// 	// mentors = J(mentors);
			// } else {
			// 	console.log('mentors in locstor!');
			// 	mentors = JSON.parse(localStorage.getItem('mentorsInfo'));
			// }

			mentors = await getCollection("Mentors");
			list_mentees = setListMentors(mentors);
			// mentors = await getBackendCache("Mentors");
			// const mentors_url = "http://127.0.0.1:8000/cache/Mentors";
			// const res = await fetch(mentors_url);
			// if (!res.ok) {
			// 	throw new Error('Failure to delete id');
			// }
			// const resData = await res.json();
			// mentors = JSON.parse(resData);

			// For now we do it the old fashioned way. The getCollection function is a function from the api.js file in the lib folder, that just returns a specific colelction. A collection is what our databse (Google Firestore) calls each table of data. In this case we call the collection of Mentors to get the data of each mentor who is signed up. The reason we had to optimize this was because it is calling static data, meaning the data doesn't change on the page reload, but is still being requested. But why should we constantly request data that we know doesn't change? That slows down the site, and the above localStorage implementation fixes that and only calls this data once.
			// mentors = await getCollection('Mentors');

			// if (!localStorage.getItem('demographicsInfo')) {
			// 	console.log('demographics not in locstor!');
			// 	const demographics = await retrieveDemographics();

			// 	listReligions = demographics.religions;
			// 	listAcademics = demographics.acedemics;
			// 	listRaces = demographics.races;
			// 	listLanguages = demographics.languages;
			// 	listGenders = demographics.genders;

			// 	localStorage.setItem('demographicsInfo', JSON.stringify(demographics));
			// } else {
			// 	console.log('demographics in locstor!');
			// 	demographics = JSON.parse(localStorage.getItem('demographicsInfo'));

			// 	listReligions = demographics.religions;
			// 	listAcademics = demographics.acedemics;
			// 	listRaces = demographics.races;
			// 	listLanguages = demographics.languages;
			// 	listGenders = demographics.genders;
			// }

			const demographics = await retrieveDemographics();

			console.log(demographics);

			listReligions = demographics.religions;
			listAcademics = demographics.academics;
			listRaces = demographics.races;
			listLanguages = demographics.languages;
			listGenders = demographics.genders;

			console.log(listReligions, listAcademics, listRaces, listLanguages, listGenders);

		} catch (error) {
			console.log('Onmount failed: ' + error);
		} finally {
			// At the end, we will set wholeReady to true, indicating that the data can be rendered to the screen. We don't want to render data that hasn't been requested yet, because that will result in an error. This is also the loading screen that you see while we impatiently wait for the data to come in.
			wholeReady.set(true);
		}
	});

	// These functions (yes, functions, not variables, even though intializing with const!) determine if we can see or not see each modal. A modal is the popup. For example, when you become a mentor you can edit your profile, and a modal will show. These functions control that, but you don't have to worry about that now.
	const openshowEditModal = () => showEditModal.set(true);
	const closeshowEditModal = () => showEditModal.set(false);

	const openshowLogsModal = () => showLogsModal.set(true);
	const closeshowLogsModal = () => showLogsModal.set(false);
	
</script>

<!-- This is the modal that edits each mentor's profile. -->
<Modal class="min-w-full" open={$showEditModal} on:close={closeshowEditModal}>
	<!-- The <RegisterForm> is a component (components in Svelte are files, so you can see the code for this components in the becomeamentor folder!) that controls the editing view. The {data} in brackets are parameters that I pass to indicate *editing*, and not *creating* a mentor. -->
	<RegisterForm {view} {currMentor} {showVals}></RegisterForm>
</Modal>

<!-- Mentor Logging Modal: -->

<Modal class="min-w-full" open={$showLogsModal} on:close={closeshowLogsModal}>
	<P size="xl">Log Mentor-Mentee hours</P>
	<form on:submit={() => alert("OK works")}>
		<Label>
			Which mentee emailed you?
			<MultiSelect
				id="mentees"
				options={list_mentees}
				placeholder="Select the mentee"
				bind:value={selected_mentees}
			></MultiSelect>
		</Label>
		<Button type="submit" color="green" outline>
			Submit
		</Button>
	</form>
</Modal>

<!-- This div holds all of the information. -->
<div class="wholementorwrapper bg-gray-100" style="height:100%;">
	<!-- The data is only shown when wholeReady is true (which means all of the data has been successfully requested). Remember that the wholeReady is a boolean store variable. To access the value of a store variable, we put the dollar sign $ before the name of the variable, indicating reactivity. -->
	{#if $wholeReady}
		<div class="infowrapper" style="margin-left:3rem;margin-right:3rem;margin-top:1rem;">
			<!-- This is all data that should NOT be hard-coded, but we will fix this later once the more pressing issues are solved. -->
			<Heading tag="h4" customSize="text-4xl font-extrabold" class="dark:text-red-900">
				<Span underline decorationClass="decoration-8 decoration-red-800 dark:decoration-red-600"
					>Find</Span
				> a Mentor
			</Heading>
			<br />
			<P class="mb-2" weight="light" color="text-gray-600 dark:text-gray-200">
				Below you can search for and filter juniors and seniors who you believe can best support
				your academic interests.
			</P>
			<P class="mb-2" weight="light" color="text-gray-600 dark:text-gray-200">
				Through one-on-one support, you can learn about opportunities in Cambridge and CRLS, which
				classes to take, and how to best find success in highschool.
			</P>
			<P class="mb-2" weight="light" color="text-gray-600 dark:text-gray-200">
				Simply click "message" for whichever mentor you believe can best help you achieve your
				goals. Send them an email and start your journey today.
			</P>
			<P class="mb-2" weight="light" color="text-gray-600 dark:text-gray-200">
				Interested in becoming a mentor?
				{#if $user}
					<u><a href="/becomeamentor">Register here</a></u>
				{:else}
					<u><a href="/auth/login">Login first</a></u>
				{/if}
			</P>
		</div>

		<!-- This is the search box - All of the components here are imported from the Flowbite Svelte UI Library, which you can find links to in the doc I emailed you. -->
		<div class="searchwrapper" style="margin-right:3rem;margin-left:3rem;margin-top:1rem;">
			<TableHeader headerType="search">
				<!-- The syntax bin:value={searching} is unique to svelte. It tells svelte to update the variable searching (that we declared above) everything the <Search> input component changes. -->
				<Search
					bind:value={searching}
					slot="search"
					placeholder="Search {mentors.length} mentors"
					size="md"
				/>
				<div class=""></div>
				<Button outline color="blue">Filters</Button>
				<Dropdown class="w-48 p-3 space-y-2 text-sm">
					<DropdownItem class="flex items-center justify-between">
						<!-- This shouldn't be hard-coded -->
						Academics<ChevronRightOutline class="w-6 h-6 ms-2 text-primary-700 dark:text-white" />
					</DropdownItem>
					<Dropdown placement="right-start">
						<!-- Loops through the list of available academics. The {#each} syntax in Svelte is the same as < for (int i, i < listAcademics.length; i++) {} >, etc. This list of academics is also hard coded in the api/mentor.js file, but again we will fix this later on. -->
						{#each listAcademics as r}
							<DropdownItem>
								<!-- Notice the user of $ before filters, because filters is a store variable. -->
								<!-- $fiters.includes(r) checks if the current academic is in the filters array. -->
								{#if $filters.includes(r)}
									<!-- on:change={()} means everytime you select or deselect this checkbox input, it calls the toggleFilters function that we defined above, which just updates the contents of the filters array. -->
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
								<!-- The only different between the two check boxes is that it is "checked," meaning the checkbox input is selected if the item is in the filters array, and not checked if it is not. -->
							</DropdownItem>
						{/each}
					</Dropdown>
					<!-- We repeat the same for all the rest of the demographic info: -->
					<DropdownItem class="flex items-center justify-between">
						Races<ChevronRightOutline class="w-6 h-6 ms-2 text-primary-700 dark:text-white" />
					</DropdownItem>
					<Dropdown placement="right-start">
						{#each listRaces as r}
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
						Religion<ChevronRightOutline class="w-6 h-6 ms-2 text-primary-700 dark:text-white" />
					</DropdownItem>
					<Dropdown placement="right-start">
						{#each listReligions as r}
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
						Language<ChevronRightOutline class="w-6 h-6 ms-2 text-primary-700 dark:text-white" />
					</DropdownItem>
					<Dropdown placement="right-start">
						{#each listLanguages as r}
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
						Genders<ChevronRightOutline class="w-6 h-6 ms-2 text-primary-700 dark:text-white" />
					</DropdownItem>
					<Dropdown placement="right-start">
						{#each listGenders as r}
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
						<div class="badge" style="margin-right:.2rem;">
							<Badge color="blue">{f}</Badge>
						</div>
					{/each}
				{/if}
			{/if}
		</div>

		<!-- This div holds all of the mentor cards. Each mentor is its own card, with their own informatino, etc. -->
		<div class="card-container">
			<!-- Iterates over the filteredMentors array, which we had defined up above with the $: syntax. -->
			{#each filteredMentors as m}
				<!-- Checks first if either the mentor's first name, last name, anything in bio, is what is in the search box. The search box is "" by default, and every mentor has that string, so every mentor is listed out first. -->
				{#if labelIncludesSearchTerm(m.firstname, searching) || labelIncludesSearchTerm(m.lastname, searching) || labelIncludesSearchTerm(m.bio, searching) || labelIncludesSearchTerm(m.firstname + ' ' + m.lastname, searching)}
					<!-- The <Card> component is another component defined by the Flowbite Svelte UI Library that we use for convenience. -->
					<Card padding="md">
						<div class="flex flex-col items-center pb-4">
							<!-- The profile pic of each mentor shown first. -->
							{#if m.email == email}
								<Avatar size="xl" src={m.profile_pic} border class="ring-yellow-400" />
							{:else}
								<Avatar size="xl" src={m.profile_pic} border class="ring-blue-400" />
							{/if}
							<h5 class="mb-1 text-xl font-medium text-gray-900">
								<!-- The information of each mentor listed out. -->
								<!-- To show the value of a mentor in svelte, you enclose the variable in {brackets}. -->
								<!-- {#if m.email == email}
									<Button size="xs" pill outline color="red" on:click={openshowLogsModal}>
										<BookOpenOutline size="md"></BookOpenOutline>
									</Button>
								{/if} -->
								{m.firstname}
								{m.lastname}
								<!-- This checks if this mentor is the current logged in user. If it is, it adds the pencil icon, which when clicked allows the user to edit or change their information. -->
								{#if m.email == email}
									<Button
										size="md"
										pill
										outline
										color="dark"
										on:click={() => {
											console.log('clicked');
											currMentor = m;
											console.log(currMentor);
											openshowEditModal();
										}}><PenOutline size="xs"></PenOutline></Button
									>
								{/if}
							</h5>
							<span class="text-sm text-gray-700">
								<!-- the .join(", ") function takes the list and turns it into a string separated by ", ". -->
								<center>Academic Interests: <b>{m.academics.join(', ')}</b></center>
							</span>
							<span class="text-sm text-gray-500">
								{#if m.languages.length > 0}
									<center><i>Language I Speak:</i> {m.languages.join(', ')}</center>
								{/if}
							</span>
							<!-- Displays the rest of the information: -->
							<span class="text-sm text-gray-500">
								<center>{m.races}</center>
							</span>
							<span class="text-sm text-gray-500">
								<center>{m.religions}</center>
							</span>
							<span class="text-sm text-gray-500">
								<center>{m.gender}</center>
							</span>
							<span style="border-top: 1px solid black;" class="text-sm text-gray-800">
								<center>{m.bio}</center>
							</span>
							<div class="flex mt-4 space-x-3 rtl:space-x-reverse lg:mt-6">
								<!-- < if $user > checks if the current user is logged in. If they are, then they can message any mentor.-->
								{#if $user}
									<Button outline color="blue" class="">
										<A
											target="_blank"
											href="https://mail.google.com/mail/?view=cm&fs=1&to={m.email}&su=CRLS%20PathFinders%20Mentee"
											class="font-medium hover:underline">Message</A
										>
									</Button>
									<!-- If the current user is not logged in, they will not be able to message anyone, and instead will be prompted to make an account or sign in when they try to click on "Message." -->
								{:else}
									<Button disabled outline color="blue" id="disabledmessagebutton" class="">
										Message
									</Button>
									<Popover class="w-64 text-sm font-light " title="Make an account first!" triggeredBy="#disabledmessagebutton">
										<p class="text-gray-800">
											You can only message mentors when you have an account!
											<br><br>
											<u><a href="/auth/login">Log in</a></u> or <u><a href="/auth/signup">Sign up</a></u>
										</p>
									</Popover>
								{/if}
							</div>
						</div>
					</Card>
				{/if}
			{/each}
		</div>
	{:else}
		<!-- This else refers to if $wholeReady is false, in which case a loading message will show. -->
		<center>
			<div class="loadingwrapper" style="font-size:large; margin-top:1rem;">
				Loading Mentors ... <Spinner color="blue" />
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
	/* Here are some styling. */
	.card-container {
		padding: 3rem;
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(3, minmax(100px, 1fr));
	}

	/* .mentorcard:hover {
    transform: scale(1.02);
    transition: all ease-in-out .08s;
    box-shadow: inset;
   } */

	/* Making each mentor card dynamic to the width of the screen or page. */

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
