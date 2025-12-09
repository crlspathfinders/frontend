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
        Schools: string;
        'Intended Major': string;
        GPA: number;
        Extracurriculars: string;
        Awards: string;
        APs: string;
        Results: string;
        Name: string;
        YOG: number;
        'Race + Hooks': string;
        id: string;
    };

    // Normalized alum used in the UI
    type Alum = {
        id: string;
        name: string;
        yog: number;
        gpa: number;
        intendedMajor: string;
        extracurriculars: string;
        awards: string;
        aps: string;
        results: string;
        raceHooks: string;
        schools: string[]; // parsed from Schools
    };

    type School = {
        fullName: string;
        shortName: string;
        coords: [number, number];
        logo: string;
        students: Alum[];
    };

    // Add whatever schools you want to show on the map.
    // Names here must match what's in the "Schools" string (either fullName or shortName).
    let schools: School[] = [
        {
            fullName: 'UCLA',
            shortName: 'UCLA',
            coords: [-118.4452, 34.0689],
            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/UCLA_Bruins_primary_logo.svg/1024px-UCLA_Bruins_primary_logo.svg.png',
            students: []
        },
        {
            fullName: 'Northwestern University',
            shortName: 'Northwestern',
            coords: [-87.6750, 42.0569],
            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Northwestern_Wildcats_logo.svg/1330px-Northwestern_Wildcats_logo.svg.png',
            students: []
        },
        {
            fullName: 'Salem State University',
            shortName: 'Salem State',
            coords: [-70.8967, 42.5195],
            logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4c/Salem_State_University_logo.svg/960px-Salem_State_University_logo.svg.png',
            students: []
        }
        // Add more:
        // UMass Boston, Pace, Penn State, Howard, UC Santa Cruz, USC, Barnard, Columbia, BU, UCSD, JHU, NYU, UCSB, Duke, etc.
    ];

    let alums: Alum[] = [];

    const activeSchool: Writable<School | null> = writable<School | null>(null);

    function showSchool(school: School) {
        activeSchool.set(school);
    }

    function hideSchool() {
        activeSchool.set(null);
    }

    let mapInitialized = false;

    onMount(async () => {
        // 1. Load alumni and normalize
        try {
            const raw = (await getCollection('AlumniNetwork')) as AlumRaw[];

            console.log('Raw alumni data length:', raw.length);

            alums = raw.map((doc) => {
                const schoolsList = doc.Schools
                    ? doc.Schools.split(',').map((s) => s.trim())
                    : [];

                return {
                    id: doc.id,
                    name: doc.Name,
                    yog: doc.YOG,
                    gpa: doc.GPA,
                    intendedMajor: doc['Intended Major'],
                    extracurriculars: doc.Extracurriculars,
                    awards: doc.Awards,
                    aps: doc.APs,
                    results: doc.Results,
                    raceHooks: doc['Race + Hooks'],
                    schools: schoolsList
                };
            });

            // Clear current students
            for (const school of schools) {
                school.students = [];
            }

            // 2. Attach each alum to all their schools
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
                        console.warn('No matching school for', schoolName, alum.name);
                    }
                }
            }
        } catch (err) {
            console.error('Error loading alumni:', err);
        }

        // 3. Initialize map once
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
                        scale: 0.03
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
                target: mapElement, // or 'map'
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
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {#each $activeSchool.students as student}
                    <Card padding="md">
                        <div class="flex flex-col items-center pb-4">
                            <Avatar
                                size="xl"
                                border
                                class="ring-gray-400"
                                style="object-fit: cover;"
                            />
                            <h5 class="mb-1 mt-2 text-xl font-medium text-gray-900">
                                {student.name}
                            </h5>
                            <span class="text-sm text-gray-700">
                                <center>Class of <b>{student.yog}</b></center>
                            </span>
                            <span class="text-sm text-gray-700">
                                <center>Intended major: <b>{student.intendedMajor}</b></center>
                            </span>
                            <span class="text-sm text-gray-700">
                                <center>GPA: <b>{student.gpa}</b></center>
                            </span>
                            <span class="text-xs text-gray-500 mt-1 text-center">
                                {student.raceHooks}
                            </span>
                            <span class="text-xs text-gray-800 mt-2 text-center px-2">
                                <b>Results:</b> {student.results}
                            </span>
                        </div>
                    </Card>
                {/each}
            </div>
        {/if}
    </Modal>
</div>
