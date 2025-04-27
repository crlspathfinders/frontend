<script lang="ts">
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
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

    const alumni = [
        {
            firstname: 'John',
            lastname: 'Doe',
            gradyear: 2010,
            fullschool: 'Harvard University',
            shortschool: 'Harvard',
            major: 'Computer Science',
            bio: 'Software Engineer at TechCorp, with a decade of experience in developing scalable software architectures, leading cross-functional teams, and innovating cutting-edge technologies to drive business growth.',
            loc: 'Cambridge, MA',
            coords: [-71.1167, 42.377],
            logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Harvard_University_shield.svg/1779px-Harvard_University_shield.svg.png'
        },
        {
            firstname: 'Emily',
            lastname: 'Watson',
            gradyear: 2011,
            fullschool: 'Harvard University',
            shortschool: 'Harvard',
            major: 'Economics',
            bio: 'Experienced economist driving innovative analysis at a major financial institution.',
            loc: 'Cambridge, MA',
            coords: [-71.1167, 42.377],
            logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Harvard_University_shield.svg/1779px-Harvard_University_shield.svg.png'
        },
        {
            firstname: 'James',
            lastname: 'Anderson',
            gradyear: 2012,
            fullschool: 'Harvard University',
            shortschool: 'Harvard',
            major: 'Law',
            bio: 'Corporate lawyer specializing in mergers and acquisitions.',
            loc: 'Cambridge, MA',
            coords: [-71.1167, 42.377],
            logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Harvard_University_shield.svg/1779px-Harvard_University_shield.svg.png'
        },
        {
            firstname: 'Olivia',
            lastname: 'Martinez',
            gradyear: 2013,
            fullschool: 'Harvard University',
            shortschool: 'Harvard',
            major: 'Medicine',
            bio: 'Pediatrician dedicated to improving child healthcare.',
            loc: 'Cambridge, MA',
            coords: [-71.1167, 42.377],
            logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Harvard_University_shield.svg/1779px-Harvard_University_shield.svg.png'
        },
        {
            firstname: 'William',
            lastname: 'Clark',
            gradyear: 2014,
            fullschool: 'Harvard University',
            shortschool: 'Harvard',
            major: 'Physics',
            bio: 'Research scientist exploring quantum mechanics.',
            loc: 'Cambridge, MA',
            coords: [-71.1167, 42.377],
            logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Harvard_University_shield.svg/1779px-Harvard_University_shield.svg.png'
        },
        {
            firstname: 'Henry',
            lastname: 'Taylor',
            gradyear: 2016,
            fullschool: 'University of Miami',
            shortschool: 'U Miami',
            major: 'Marine Biology',
            bio: 'Marine Biologist with over 10 years of experience in conducting groundbreaking research into ocean ecosystems, specializing in marine conservation efforts, and dedicated to uncovering the mysteries of deep-sea life at Oceanic Research, leveraging state-of-the-art technology and innovative methodologies',
            loc: 'Miami, FL',
            coords: [-80.1918, 25.7617],
            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Miami_Hurricanes_logo.svg/2560px-Miami_Hurricanes_logo.svg.png'
        },
        {
            firstname: 'Sophia',
            lastname: 'Rivera',
            gradyear: 2017,
            fullschool: 'University of Miami',
            shortschool: 'U Miami',
            major: 'Environmental Science',
            bio: 'Passionate environmental scientist working on sustainable projects in coastal areas.',
            loc: 'Miami, FL',
            coords: [-80.1918, 25.7617],
            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Miami_Hurricanes_logo.svg/2560px-Miami_Hurricanes_logo.svg.png'
        },
        {
            firstname: 'Alice',
            lastname: 'Smith',
            gradyear: 2012,
            fullschool: 'Stanford University',
            shortschool: 'Stanford',
            major: 'Electrical Engineering',
            bio: 'Innovative engineer passionate about AI and robotics, working on breakthrough technologies at a leading tech company.',
            loc: 'Stanford, CA',
            coords: [-122.1700, 37.4275],
            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Stanford_Cardinal_logo.svg/1341px-Stanford_Cardinal_logo.svg.png'
        },
        {
            firstname: 'Michael',
            lastname: 'Chen',
            gradyear: 2013,
            fullschool: 'Stanford University',
            shortschool: 'Stanford',
            major: 'Software Engineering',
            bio: 'Software engineer dedicated to improving user experiences with modern web technologies.',
            loc: 'Stanford, CA',
            coords: [-122.1700, 37.4275],
            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Stanford_Cardinal_logo.svg/1341px-Stanford_Cardinal_logo.svg.png'
        },
        {
            firstname: 'Sarah',
            lastname: 'Lee',
            gradyear: 2015,
            fullschool: 'Stanford University',
            shortschool: 'Stanford',
            major: 'Data Science',
            bio: 'Data scientist leveraging machine learning to solve real-world problems.',
            loc: 'Stanford, CA',
            coords: [-122.1700, 37.4275],
            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Stanford_Cardinal_logo.svg/1341px-Stanford_Cardinal_logo.svg.png'
        },
        {
            firstname: 'Bob',
            lastname: 'Johnson',
            gradyear: 2014,
            fullschool: 'Northwestern University',
            shortschool: 'Northwestern',
            major: 'Economics',
            bio: 'Economist with a focus on market trends and financial analysis, currently consulting for top firms.',
            loc: 'Evanston, IL',
            coords: [-87.6750, 42.0569],
            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Northwestern_Wildcats_logo.svg/1330px-Northwestern_Wildcats_logo.svg.png'
        },
        {
            firstname: 'Laura',
            lastname: 'Mitchell',
            gradyear: 2015,
            fullschool: 'Northwestern University',
            shortschool: 'Northwestern',
            major: 'Political Science',
            bio: 'Analyst and policy advisor with a strong background in political research and public service.',
            loc: 'Evanston, IL',
            coords: [-87.6750, 42.0569],
            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Northwestern_Wildcats_logo.svg/1330px-Northwestern_Wildcats_logo.svg.png'
        },
        {
            firstname: 'Daniel',
            lastname: 'Evans',
            gradyear: 2016,
            fullschool: 'Northwestern University',
            shortschool: 'Northwestern',
            major: 'Journalism',
            bio: 'Award-winning journalist covering international affairs.',
            loc: 'Evanston, IL',
            coords: [-87.6750, 42.0569],
            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Northwestern_Wildcats_logo.svg/1330px-Northwestern_Wildcats_logo.svg.png'
        },
        {
            firstname: 'Grace',
            lastname: 'Harris',
            gradyear: 2017,
            fullschool: 'Northwestern University',
            shortschool: 'Northwestern',
            major: 'Marketing',
            bio: 'Marketing strategist helping brands connect with their audiences.',
            loc: 'Evanston, IL',
            coords: [-87.6750, 42.0569],
            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Northwestern_Wildcats_logo.svg/1330px-Northwestern_Wildcats_logo.svg.png'
        },
        {
            firstname: 'Charlie',
            lastname: 'Brown',
            gradyear: 2018,
            fullschool: 'Texas A&M University',
            shortschool: 'Texas A&M',
            major: 'Agricultural Engineering',
            bio: 'Specialist in sustainable agriculture and innovative food production methods, bridging traditional practices with modern technology.',
            loc: 'College Station, TX',
            coords: [-96.3400, 30.6100],
            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Texas_A%26M_University_logo.svg/2492px-Texas_A%26M_University_logo.svg.png'
        },
        {
            firstname: 'Ryan',
            lastname: 'Garcia',
            gradyear: 2019,
            fullschool: 'Texas A&M University',
            shortschool: 'Texas A&M',
            major: 'Business Administration',
            bio: 'Driven professional focusing on innovative business strategies and development projects.',
            loc: 'College Station, TX',
            coords: [-96.3400, 30.6100],
            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Texas_A%26M_University_logo.svg/2492px-Texas_A%26M_University_logo.svg.png'
        },
        {
            firstname: 'Ethan',
            lastname: 'Walker',
            gradyear: 2020,
            fullschool: 'Texas A&M University',
            shortschool: 'Texas A&M',
            major: 'Mechanical Engineering',
            bio: 'Mechanical engineer working on renewable energy solutions.',
            loc: 'College Station, TX',
            coords: [-96.3400, 30.6100],
            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Texas_A%26M_University_logo.svg/2492px-Texas_A%26M_University_logo.svg.png'
        },
        {
            firstname: 'Isabella',
            lastname: 'Davis',
            gradyear: 2021,
            fullschool: 'Texas A&M University',
            shortschool: 'Texas A&M',
            major: 'Veterinary Medicine',
            bio: 'Veterinarian passionate about animal welfare and research.',
            loc: 'College Station, TX',
            coords: [-96.3400, 30.6100],
            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Texas_A%26M_University_logo.svg/2492px-Texas_A%26M_University_logo.svg.png'
        },
        {
            firstname: 'Mia',
            lastname: 'Wilson',
            gradyear: 2022,
            fullschool: 'Texas A&M University',
            shortschool: 'Texas A&M',
            major: 'Environmental Engineering',
            bio: 'Environmental engineer focused on sustainable infrastructure projects.',
            loc: 'College Station, TX',
            coords: [-96.3400, 30.6100],
            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Texas_A%26M_University_logo.svg/2492px-Texas_A%26M_University_logo.svg.png'
        }
    ];

    type School = {
        fullschool: string;
        shortschool: string;
        coords: [number, number];
        logo: string;
        students: typeof alumni;
    };

    const schools: School[] = [];
    for (const alum of alumni) {
        let school = schools.find(s => s.fullschool === alum.fullschool);
        if (!school) {
            school = {
                fullschool: alum.fullschool,
                shortschool: alum.shortschool,
                coords: alum.coords as [number, number],
                logo: alum.logo,
                students: []
            };
            schools.push(school);
        }
        school.students.push(alum);
    }

    const activeSchool = writable<School | null>(null);

    function showSchool(school: School) {
        activeSchool.set(school);
    }
    function hideSchool() {
        activeSchool.set(null);
    }

    onMount(() => {
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

        const map = new Map({
            target: 'map',
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

        map.on('singleclick', function (evt) {
            map.forEachFeatureAtPixel(evt.pixel, function (feature) {
                const school = feature.get('school');
                if (school) {
                    showSchool(school);
                }
            });
        });
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
    <Modal open={$activeSchool} on:close={hideSchool} size="xl" title="CRLS Alumni at {$activeSchool?.fullschool}">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {#each $activeSchool.students as student}
                <Card padding="md">
                    <div class="flex flex-col items-center pb-4">
                        <Avatar size="xl" border class="ring-gray-400" style="object-fit: cover;" />
                        <h5 class="mb-1 mt-2 text-xl font-medium text-gray-900">
                            {student.firstname} {student.lastname}
                        </h5>
                        <span class="text-sm text-gray-700">
                            <center>Class of <b>{student.gradyear}</center>
                        </span>
                        <span class="text-sm text-gray-700">
                            <center>Major: <b>{student.major}</b></center>
                        </span>
                        <span class="text-sm text-gray-500">
                            <center>{student.loc}</center>
                        </span>
                        <span class="text-sm text-gray-800 p-2">
                            <center>{student.bio}</center>
                        </span>
                    </div>
                </Card>
            {/each}
        </div>
    </Modal>
</div>
