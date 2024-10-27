<script>
	import { onMount } from 'svelte';
	import PeerMentorLinkTable from './PeerMentorLinkTable.svelte';
	import { Heading, P } from 'flowbite-svelte';
</script>

<div class="infowrapper" style="margin-left:3rem;margin-right:3rem;margin-top:1rem;">
	<Heading tag="h4" customSize="text-4xl font-extrabold" class="dark:text-gray-100"
		>Peer Mentor Support Group</Heading
	>
	<P class="mb-2" weight="light" color="text-gray-600 dark:text-gray-200">
		We are thrilled to be bringing back the Peer Mentor Support Group after a year-long break! We’re
		also excited to announce our partnership with CRLS Pathfinders, which offers a one-on-one
		mentorship program where you’ll be paired with an upperclassman who will guide you through
		everything from classes to social life and anything else you may need support with.
	</P>
	<P class="mb-2" weight="light" color="text-gray-600 dark:text-gray-200">
		We’ll be hosting bi-weekly meetings—twice a month—featuring workshops with guest speakers like
		former Harvard admissions officers, fun activities to getting to know pass alums that have gone
		to IVY leagues and a space for peers to support as you navigate your high school journey. There
		is no expectation, no filter, just sharing stories for the students by the students. We also
		have some exciting shadowing opportunities coming up where you can follow an upperclassman in
		classes you’re interested in to get a sense of the workload and how it feels to be in the class.
	</P>
	<P class="mb-2" weight="light" color="text-gray-600 dark:text-gray-200">
		The Google Classroom and this website will be updated regularly with scholarship information,
		templates for preparing for college, and programs you can apply for.
	</P>
	<!-- <P class="mb-2" weight="light" color="text-gray-600 dark:text-gray-200">
        Search for scholarships in Cambridge below.
    </P> -->
</div>

<PeerMentorLinkTable></PeerMentorLinkTable>
