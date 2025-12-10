<script lang="ts">
    import { onMount } from 'svelte';
    import { writable, type Writable } from 'svelte/store';
    import Map from 'ol/Map';
    import View from 'ol/View';
    import TileLayer from 'ol/layer/Tile';
    import OSM from 'ol/source/OSM';
    import { fromLonLat } from 'ol/proj';
    import Feature from 'ol/Feature';
    import Point from 'ol/geom/Point';
    import VectorSource from 'ol/source/Vector';
    import VectorLayer from 'ol/layer/Vector';
    import Style from 'ol/style/Style';
    import Icon from 'ol/style/Icon';
    import { Modal, Card, Avatar } from 'flowbite-svelte';
    import { getCollection } from '$lib/api';

    // Raw document from your AlumniNetwork collection
    type AlumRaw = {
        Accepted: string;
        Rejected: string;
        Waitlisted: string;
        GPA: string;
        Major: string;
        SAT: string;
        Awards: string;
        APs: string;
        Results: string;
        Hooks: string;
        YOG: number;
        Uni: string;
        ECs: string;
        Notes: string;
    };

    // Normalized alum used in the UI
    type Alum = {
        yog: number;
        gpa: string;
        intendedMajor: string;
        extracurriculars: string;
        awards: string;
        aps: string;
        results: string;
        raceHooks: string;
        schools: string[]; // parsed from Uni
    };

    type School = {
        fullName: string;
        shortName: string;
        coords: [number, number];
        logo: string;
        students: Alum[];
    };

    // Add whatever schools you want to show on the map.
    let schools: School[] = [
  {
    fullName: 'UCLA',
    shortName: 'UCLA',
    coords: [-118.4452, 34.0689],
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/The_University_of_California_UCLA.svg/960px-The_University_of_California_UCLA.svg.png',
    students: []
  },
  {
    fullName: 'Salem State University',
    shortName: 'Salem State',
    coords: [-70.8967, 42.5195],
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4c/Salem_State_University_logo.svg/960px-Salem_State_University_logo.svg.png',
    students: []
  },
  {
    fullName: 'Massachusetts Institute of Technology',
    shortName: 'MIT',
    coords: [-71.0921, 42.3601],
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/44/MIT_Seal.svg/960px-MIT_Seal.svg.png',
    students: []
  },
  {
    fullName: 'Northeastern University',
    shortName: 'Northeastern',
    coords: [-71.0882, 42.3398],
    logo: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/NU_RGB_seal_R.png',
    students: []
  },
  {
    fullName: 'University of Massachusetts Lowell',
    shortName: 'UMass Lowell',
    coords: [-71.3345, 42.6427],
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/6/6a/University_of_Massachusetts_Lowell_logo.svg/640px-University_of_Massachusetts_Lowell_logo.svg.png',
    students: []
  },
  {
    fullName: 'Amherst College',
    shortName: 'Amherst',
    coords: [-72.515, 42.3729],
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/6/65/Amherst_College_Seal.svg/960px-Amherst_College_Seal.svg.png',
    students: []
  },
  {
    fullName: 'Boston University',
    shortName: 'BU',
    coords: [-71.106, 42.3505],
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Boston_University_seal.svg/960px-Boston_University_seal.svg.png',
    students: []
  },
  {
    fullName: 'Tufts University',
    shortName: 'Tufts',
    coords: [-71.1198, 42.4069],
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b1/Tufts_official_seal.svg/960px-Tufts_official_seal.svg.png',
    students: []
  },
  {
    fullName: 'Cornell University',
    shortName: 'Cornell',
    coords: [-76.4753, 42.4534],
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Cornell_University_seal.svg/960px-Cornell_University_seal.svg.png',
    students: []
  },
    {
        fullName: 'Carnegie Mellon University',
        shortName: 'Carnegie Mellon',
        coords: [-79.9433, 40.4425],
        logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/bb/Carnegie_Mellon_University_seal.svg/960px-Carnegie_Mellon_University_seal.svg.png',
        students: []
    }];


    let alums: Alum[] = [];

    const activeSchool: Writable<School | null> = writable<School | null>(null);
    const selectedStudent: Writable<Alum | null> = writable<Alum | null>(null);

    function showSchool(school: School) {
        activeSchool.set(school);
        selectedStudent.set(null);
    }

    function hideSchool() {
        activeSchool.set(null);
        selectedStudent.set(null);
    }

    function openStudent(student: Alum) {
        selectedStudent.set(student);
    }

    let mapInitialized = false;

    onMount(async () => {
        try {
            // const raw = (await getCollection('AlumniNetwork')) as AlumRaw[];
            const raw: AlumRaw[] = [
  {
    Accepted: 'Northeastern, Purdue, UMass Amherst, UMaryland, UMich, MIT',
    Rejected: 'None',
    Waitlisted: 'Case Western',
    GPA: '97.96',
    Major: 'Computer Science',
    SAT: '1570 (800 Math, 770 English)',
    Awards: 'Hebrew seal of biliteracy, AP Scholar with Distinction, NHS member',
    APs: 'CSP, Physics 1, Stats, Chem, CSA, Bio, Physc, Calc BC, Lang, Physics C (both), Comp Gov',
    Results: 'Accepted to all except Case Western (deferred), committed MIT',
    Hooks: 'White/Middle Eastern, immigrant',
    YOG: 2025,
    Uni: 'MIT',
    ECs: 'Debate Club leadership, SRMP program, founder of Association of Widefield Astrophotographers, varsity swim, astrophorography (hobby), MIT InvenTeam, astronomy club president, intern at Green Cambridge, intern at Lemelson/MIT, intern at Innovators for Change',
    Notes: 'I did not submit any of my regular applications (all reaches) as I was accepted to MIT before the due dates.'
  },
  {
    Accepted: 'Wentworth Institute of Technology, Suffolk University, UMass Boston, Emmanuel College, Northeastern University',
    Rejected: 'None',
    Waitlisted: 'College of the Holy Cross',
    GPA: '92.836/100 (unweighted)',
    Major: 'Computer Science',
    SAT: 'Test-optional (no SAT/ACT submitted; PSAT 890 then 970)',
    Awards: 'Harvard SYEP certificate, NHS member, First Honors',
    APs: 'APUSH (1, not sent), AP World (1, not sent), APCSP (1, not sent), APAAS, AP Psych, AP Chinese, APES',
    Results: 'Committed Northeastern University (Computer Science and Linguistics)',
    Hooks: 'Asian, first-generation, low-income',
    YOG: 2025,
    Uni: 'Northeastern University',
    ECs: 'Lemelson-MIT communications team, independent dancer (multiple groups), digital marketing/product intern (Harvard Online / edX / GetSmarter), co-president Cultural Exchange Club, JV/Varsity rowing coxswain and team leader, Breakthrough Greater Boston student/intern/volunteer, family caregiver, HR assistant at Harvard FCU, AASA/PAC member and volunteer, Model UN delegate',
    Notes: 'Shares detailed advice on essays, recommendations, touring, demonstrated interest, feedback, and Early Decision.'
  },
  {
    Accepted: 'UMass Boston, Pace, Penn State, Howard, UC Santa Cruz, University of Southern California, Northwestern, UCLA',
    Rejected: 'UC San Diego',
    Waitlisted: 'Barnard, NYU, UC Santa Barbara, Duke',
    GPA: '96 unweighted',
    Major: 'Neuroscience',
    SAT: 'No SAT/ACT',
    Awards: 'Creative Youth Changemaker (mayor), Christian Herter Recipient (state), School Committee Peacemaker (mayor), AP Scholar',
    APs: 'APAFAM, AP Chemistry, AP Biology, AP Psychology, APUSH, APES, AP Stats',
    Results: 'Multiple acceptances including USC, Northwestern, UCLA',
    Hooks: 'Black (Caribbean), first-generation, lower middle class',
    YOG: 2025,
    Uni: 'Not explicitly stated (offers from many schools including UCLA and Northwestern)',
    ECs: 'BSU President, NHS Vice President, teen artist, girls basketball team manager, freshmen mentor, chemistry tutor, diversity & integration advocate, volunteer at MFNH, internships at MGH and Beth Israel',
    Notes: 'Encourages future applicants and wishes good luck.'
  },
  {
    Accepted: 'Salem State, Bridgewater State, Worcester State, Westfield State, Lesley University',
    Rejected: 'None',
    Waitlisted: 'None',
    GPA: '87–91',
    Major: 'Social work',
    SAT: 'No SAT/ACT',
    Awards: 'None',
    APs: 'AP African American Studies',
    Results: 'Got into all schools on list, committed to Salem State',
    Hooks: 'Black and Hispanic',
    YOG: 2025,
    Uni: 'Salem State',
    ECs: 'Basketball, art club',
    Notes: 'Started applications senior year with no recs and no essay; emphasizes that everyone’s process is different and late starts can still work.'
  },
  {
    Accepted: 'Boston College, Boston University, Babson College, UMichigan, others (not fully listed)',
    Rejected: 'N/A',
    Waitlisted: 'N/A',
    GPA: 93.5,
    Major: 'Economics and Computer Science',
    SAT: '1420',
    Awards: 'NHS, UMich Math and Science Scholars',
    APs: 'AP Calc BC, APCSP, APCSA, APAfAm, AP Physics',
    Results: 'Will be attending Boston University',
    Hooks: 'First gen, lower middle class',
    YOG: 2025,
    Uni: 'Boston University',
    ECs: 'Software engineer intern at Audible, co-president Club 4, co-founder Doorstep Detail, co-founder East African Association, MIT Beaver Works Challenge, soccer, neighborhood service project, intern at Sasaki Foundation, UMich Math and Science Scholars student, mentor/assistant teacher at Breakthrough Greater Boston',
    Notes: 'Notes in-state aid advantages, underrepresentation of lower middle class in aid, and recommends scholarships for out-of-state.'
  },
  {
    Accepted: 'Amherst, Bates, Bowdoin, Carleton, Colby, Middlebury, Northwestern, NYU, Pomona, Swarthmore, UMich, WashU, Wesleyan, Williams (ED), Case Western, Macalester, UIUC, UMass Amherst',
    Rejected: 'Harvard, Harvey Mudd',
    Waitlisted: 'Middlebury',
    GPA: '96.15/100',
    Major: 'Statistics (math where no stats major)',
    SAT: '1510 (740 English, 770 Math)',
    Awards: 'AP Scholar with Distinction, National Merit Letter of Commendation',
    APs: 'Calc BC, Comp Gov, CSP, CSA, Stats, Psych (2024/25), Physics Mechanics (2024/25), English Lang & Comp (2024/25)',
    Results: 'Attending Amherst College',
    Hooks: 'None',
    YOG: 2025,
    Uni: 'Amherst College',
    ECs: 'Varsity rowing captain, president Jewish Heritage Club, Lemelson-MIT InvenTeams grant winner, NHS junior/senior rep, residential summer camp counselor, consent workshop facilitator, Charles River Cleanup volunteer, Christmas tree sales, middle school basketball coach',
    Notes: 'Long advice section emphasizing supplements, letters, interviews, optional videos, and early interview signups.'
  },
  {
    Accepted: 'MIT',
    Rejected: 'Withdrew everywhere else early; did not apply regular',
    Waitlisted: 'None',
    GPA: 98.3,
    Major: 'Chemistry/Computational Biology',
    SAT: '1550',
    Awards: 'Varsity crew captain awards, NHS, AP Scholar with Distinction, Seal of Biliteracy with Distinction',
    APs: '15 total: CSP, Spanish Lang, Physics 1, Spanish Lit, CSA, Chemistry, Statistics, Biology, Calc BC, APUSH, Comp Gov, both Physics C, English Lang, Macroeconomics',
    Results: 'Just MIT',
    Hooks: 'White, “recruited” athlete to MIT',
    YOG: 2025,
    Uni: 'MIT',
    ECs: 'Varsity crew 4 years, summer crew, Lemelson MIT grant winners, Biogen MIT biotech program, sustainable development club president, Science Olympiad team, camp CIT, other activities',
    Notes: 'Stresses personality and passion over just stats; encourages doing what you love.'
  },
  {
    Accepted: 'Rutgers, USC, Virginia Tech, UMass Amherst, UCI, UCSC, Loyola, Lehigh, RIT, University of Minnesota',
    Rejected: 'UIUC, Georgia Tech, Northwestern, UCLA, Harvey Mudd, Johns Hopkins, Yale, UPenn, Harvard',
    Waitlisted: 'Purdue, UCSD, Carnegie Mellon',
    GPA: 4.0,
    Major: 'Computational Linguistics',
    SAT: '1450',
    Awards: 'Youth Create! challenge 3rd place, Seal of Biliteracy with Distinction (Chinese), Model UN Best Delegate, Harvard x Polkadot Hackathon 2nd place, AP Scholar with Honors',
    APs: 'CSA, Biology, Chinese, Comp Gov, US Gov, Physics C Mech, Physics C E&M, Calculus, Lang',
    Results: 'Multiple admits including USC, UMich, Virginia Tech, etc.',
    Hooks: 'n/a',
    YOG: 2025,
    Uni: 'Not clearly specified',
    ECs: 'Cambridge Youth Council, Drone Club, CRLS PathFinders, Debate Club, BosDroneWorks, City of Cambridge work, hackathons, Model UN, jobs at New City Microcreamery and Za/EVOO',
    Notes: 'n/a'
  },
  {
    Accepted: 'Johnson and Wales, Drexel, Emerson, UMass Amherst, UVM, Northeastern, CIA, UConn, UC Irvine, UC San Diego, Columbia, Cornell',
    Rejected: 'UPenn, UNC Chapel Hill, UT Austin, Stanford, UC Berkeley, Harvard',
    Waitlisted: 'Boston University, NYU, Rice, UCLA',
    GPA: 97,
    Major: 'Hotel administration and food science/nutrition',
    SAT: '1440',
    Awards: 'Vocational Student of the Year, ProStart MA culinary gold/silver medalist, SkillsUSA culinary silver medalist',
    APs: 'Physics 1, Chemistry, US History, Calc BC, English Lang, French, Statistics, Physics C Mech, Physics C E&M, Spanish Lit/Lang, Biology',
    Results: 'Attending Cornell University for hotel administration and food science',
    Hooks: 'Hispanic/white, immigrant, moved to US only for high school, very diverse background',
    YOG: 2025,
    Uni: 'Cornell University',
    ECs: 'Varsity volleyball 4 years/captain, boys varsity volleyball manager, local bakery job, long-term piano, culinary internships (Cambridge, Peru, Dubai)',
    Notes: 'Encourages applying broadly and not self-rejecting after rejections from dream schools.'
  },
  {
    Accepted: 'UMass Lowell',
    Rejected: 'Brown, CMU, Columbia, Dartmouth, Duke, Georgia Tech, Harvard, MIT, Northeastern, Northwestern, NYU, Stanford, Tufts, UIUC, UChicago, Yale, WPI, UPenn',
    Waitlisted: 'UMass Amherst',
    GPA: '92 unweighted',
    Major: 'Computer Science / Statistics',
    SAT: '1480 (770 Math, 710 English)',
    Awards: 'Scholarship to take classes at a college, ~$800 scholarship, AP Scholar, distinction in physics, NHS',
    APs: 'Physics 1, Physics 2, Physics C Mech, Calc BC, CSA, CSP, US History, World History, Stats, English Lang, Comp Gov & Politics',
    Results: 'UMass Lowell accepted (final choice undecided in response)',
    Hooks: 'White, no hooks',
    YOG: 2025,
    Uni: 'Undecided (at time of form)',
    ECs: 'CS/Stats research at Harvard/Dana-Farber, SWE intern at nonprofit, ~500 hours youth sports coaching volunteer, IT intern at city hall, open-source CS/meteorology projects, varsity ice hockey, AP class TA, cartography/mapping competitions, finance intern at small nonprofit, niche foreign language, major family responsibilities',
    Notes: 'None'
  },
  {
    Accepted: 'Tufts, Northeastern, UMass Amherst, Wesleyan',
    Rejected: 'Amherst College, WashU, UC Berkeley, UCLA',
    Waitlisted: 'Bowdoin, Harvard',
    GPA: 94.5,
    Major: 'Brain and Cognitive Science',
    SAT: 'ACT: 36 English, 30 Math, 36 Reading, 32 Science',
    Awards: 'GSC Scholar, NHS',
    APs: 'CSP, Biology, Psychology, Calc BC, Physics 1, Physics 2, Lang',
    Results: 'Committed Tufts',
    Hooks: 'Asian American, worked all 4 years of high school',
    YOG: 2025,
    Uni: 'Tufts University',
    ECs: 'Medical research intern/volunteer on abortion care access, Harvard Med intern on anemia medicines, research volunteer mapping fly brain, creator of consent curriculum, Prison Book Program volunteer, 4-year varsity diving (captain, state finalist, awards), Taekwondo instructor, national champion and academy member, etc.',
    Notes: '“nothin much see ya”'
  },
  {
    Accepted: 'Carnegie Mellon',
    Rejected: 'N/A',
    Waitlisted: 'N/A',
    GPA: '3.8 (4.2 weighted)',
    Major: 'Civil engineering and public policy',
    SAT: '1450',
    Awards: 'Top 11 speaker at Yale national debate tournament, top 6 speaker in Massachusetts, MA student achievement award, Seal of Biliteracy, FAA licensed drone pilot',
    APs: '11 APs (not itemized)',
    Results: 'Attending Carnegie Mellon',
    Hooks: 'Low income, Black',
    YOG: 2025,
    Uni: 'Carnegie Mellon',
    ECs: 'Common-Home founder/president, Pathfinders cofounder/copresident, Drone Club cofounder/copresident, BSU leadership, Interact Club leadership, Harvard engineering/data internship, Harvard astrophysics internship, Cambridge Youth Council co-chair, varsity fencing, track, debate 4 years',
    Notes: 'Emphasizes that essays are the most important part.'
  },
  {
    Accepted: 'Colorado-Boulder (Honors), Oregon (Honors, $80k), Vermont (Honors, $100k), Utah (Honors), Cal Poly SLO, Case Western (scholarship), Colorado College, UCSD, UCLA',
    Rejected: 'Johns Hopkins',
    Waitlisted: 'UW Seattle, UMich, Emory, WashU, Pomona, Dartmouth',
    GPA: 96.1,
    Major: 'Physics',
    SAT: '1560 (770 E, 790 M)',
    Awards: 'Honor Roll 4 years, NHS, AP Scholar with Distinction, Physics distinction, National Merit commended',
    APs: 'Physics 1, Chem, Stats, Physics C Mech, Calc BC, US Gov, CSA, Lang, Physics C E&M',
    Results: 'Committed to UCLA',
    Hooks: 'None',
    YOG: 2025,
    Uni: 'UCLA',
    ECs: 'Science Team captain, Ski Club president, peer tutor, baseball, Jewish Heritage Club president, MIT SPLASH, youth baseball coach, Chess Club, Math Club, seasonal work, founded Trivia Club, golf',
    Notes: 'Gives essay and AP course advice and recommends writing essays in summer and casting a wide net.'
  },
  {
    Accepted: 'Northeastern (ED1), Simmons, Johnson & Wales, UMass Dartmouth, Lesley',
    Rejected: 'N/A',
    Waitlisted: 'N/A',
    GPA: '98/4.0',
    Major: 'Design / Graphic Design',
    SAT: '1480 superscore (710 Math, 770 Reading)',
    Awards: 'National Merit commended scholar, Seal of Biliteracy with Distinction, Scholastic Art Award Silver Key',
    APs: 'AP Physics 1, APCSP, AP Spanish Lang & Culture',
    Results: 'Accepted ED1 to Northeastern',
    Hooks: 'Asian/white, not first gen or low income',
    YOG: 2025,
    Uni: 'Northeastern',
    ECs: 'Theater (primary extracurricular)',
    Notes: ''
  }
];


            console.log('Raw alumni data length:', raw.length);

            alums = raw.map((doc) => {
                const schoolsList = [doc.Uni];

                return {
                    yog: doc.YOG,
                    gpa: doc.GPA,
                    intendedMajor: doc.Major,
                    extracurriculars: doc.ECs,
                    awards: doc.Awards,
                    aps: doc.APs,
                    results: doc.Results,
                    accepted: doc.Accepted,
                    waitlisted: doc.Waitlisted,
                    Rejected: doc.Rejected,
                    raceHooks: doc.Hooks,
                    schools: schoolsList
                };
            });

            // Clear current students
            for (const school of schools) {
                school.students = [];
            }

            // Attach each alum to their uni
            for (const alum of alums) {
                for (const schoolName of alum.schools) {
                    const school = schools.find(
                        (s) =>
                            s.fullName === schoolName ||
                            s.shortName === schoolName
                    );
                    if (school) {
                        school.students.push(alum);
                    } else {
                        console.warn('No matching school for', schoolName);
                    }
                }
            }
        } catch (err) {
            console.error('Error loading alumni:', err);
        }

        if (mapInitialized) return;
        mapInitialized = true;

        try {
            const features = schools.map((school) => {
                const feature = new Feature({
                    geometry: new Point(fromLonLat(school.coords))
                });

                const pinStyle = new Style({
                    image: new Icon({
                        anchor: [0.5, 1],
                        src: school.logo,
                        scale: 0.05
                    })
                });

                feature.setStyle(pinStyle);
                feature.set('school', school);
                return feature;
            });

            const vectorSource = new VectorSource({
                features
            });

            const vectorLayer = new VectorLayer({
                source: vectorSource
            });

            const mapElement = document.getElementById('map');
            if (!mapElement) {
                console.error('Map container not found');
                return;
            }

            const map = new Map({
                target: mapElement,
                layers: [
                    new TileLayer({
                        source: new OSM()
                    }),
                    vectorLayer
                ],
                view: new View({
                    center: fromLonLat([-97.5795, 35.8283]),
                    zoom: 4
                }),
                controls: []
            });

            map.on('singleclick', (evt) => {
                map.forEachFeatureAtPixel(evt.pixel, (feature) => {
                    const school = feature.get('school') as School | undefined;
                    if (school) {
                        showSchool(school);
                    }
                });
            });
        } catch (error) {
            console.error('Error initializing map:', error);
        }
    });
</script>

<style>
    #map {
        width: 100%;
        height: 100vh;
    }
</style>

<div>
    <div id="map"></div>

    <Modal
        open={$activeSchool !== null}
        on:close={hideSchool}
        size="xl"
        title={`CRLS Alumni at ${$activeSchool ? $activeSchool.fullName : ''}`}
    >
        {#if $activeSchool}
            <!-- Grid of anonymous students: only college, major, GPA -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {#each $activeSchool.students as student}
                    <Card
                        padding="md"
                        class="cursor-pointer hover:ring-2 hover:ring-blue-300"
                    >
                        <div class="flex flex-col items-center pb-2">
                            <span class="text-sm text-gray-700">
                                <center>College: <b>{$activeSchool.fullName}</b></center>
                            </span>
                            <span class="text-sm text-gray-700">
                                <center>Major: <b>{student.intendedMajor}</b></center>
                            </span>
                            <span class="text-sm text-gray-700">
                                <center>GPA: <b>{student.gpa}</b></center>
                            </span>
                            <span class="text-sm text-gray-700">
                                <center>APs: <b>{student.aps}</b></center>
                            </span>
                            <span class="text-sm text-gray-700">
                                <center>Accepted: <b>{student.accepted}</b></center>
                            </span>
                            <span class="text-sm text-gray-700">
                                <center>Waitlisted: <b>{student.waitlisted}</b></center>
                            </span>
                            <span class="text-sm text-gray-700">
                                <center>Rejected: <b>{student.Rejected}</b></center>
                            </span>
                        </div>
                    </Card>
                {/each}
            </div>
        {/if}
    </Modal>
</div>
