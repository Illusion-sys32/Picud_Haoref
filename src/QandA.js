document.querySelectorAll('details').forEach(detail => {
    detail.addEventListener('toggle', function() {
        if (this.open) {
            this.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Getting all relevant elements
const adication_activitis = document.getElementById('adication-activitis');
const work_places = document.getElementById('work-places');
const crowding_and_servise = document.getElementById('crowding-and-servise');
const rockets_atack = document.getElementById('rockets-atack');
const select_safe_place = document.getElementById('select-safe-place');
const time_to_get_to_safe_place = document.getElementById('time-to-get-to-safe-place');
const safe_place_policy = document.getElementById('safe-place-policy');
const shered_safe_palce = document.getElementById('shered-safe-palce');
const public_safe_place = document.getElementById('public-safe-place');
const picod_haoref_phone = document.getElementById('picod-haoref-phone');
const maarach_chofarim = document.getElementById('maarach-chofarim');
const amchaa_alerts = document.getElementById('amchaa-alerts');
const alert_area = document.getElementById('alert-area');
const pepule_with_disabilitis = document.getElementById('pepule-with-disabilitis');
const picod_haoref_computer = document.getElementById('picod-haoref-computer');

// Object of all the elements
const all = {
    adication_activitis,
    work_places,
    crowding_and_servise,
    rockets_atack,
    select_safe_place,
    time_to_get_to_safe_place,
    safe_place_policy,
    shered_safe_palce,
    public_safe_place,
    picod_haoref_phone,
    maarach_chofarim,
    amchaa_alerts,
    alert_area,
    pepule_with_disabilitis,
    picod_haoref_computer
};
const what_to_do_on_roket_atack_btn = document.getElementById('what_to_do_on_roket_atack_btn')
const adication_activitis_btn = document.getElementById('adication_activitis_btn')
const work_places_btn = document.getElementById('work_places_btn');
const crowding_and_servise_btn = document.getElementById('crowding_and_servise_btn');
const picod_haoref_computer_btn = document.getElementById('picod_haoref_computer_btn');
const select_safe_place_btn = document.getElementById('select_safe_place_btn')
const time_to_get_to_safe_place_btn = document.getElementById('time_to_get_to_safe_place_btn');
const safe_place_policy_btn = document.getElementById('safe_place_policy_btn');
const shered_safe_palce_btn = document.getElementById('shered_safe_palce_btn');
const picod_haoref_phone_btn = document.getElementById('picod_haoref_phone_btn');
const maarach_chofarim_btn = document.getElementById('maarach_chofarim_btn');
const amchaa_alerts_btn = document.getElementById('amchaa_alerts_btn');
const public_safe_place_btn = document.getElementById('public_safe_place_btn');
const alert_area_btn = document.getElementById('alert_area_btn');
const pepule_with_disabilitis_btn = document.getElementById('pepule_with_disabilitis_btn');

const allBtn = {
    what_to_do_on_roket_atack_btn,
    adication_activitis_btn,
    work_places_btn,
    crowding_and_servise_btn,
    picod_haoref_computer_btn,
    select_safe_place_btn,
    time_to_get_to_safe_place_btn,
    safe_place_policy_btn,
    shered_safe_palce_btn,
    picod_haoref_phone_btn,
    maarach_chofarim_btn,
    amchaa_alerts_btn,
    public_safe_place_btn,
    alert_area_btn,
    pepule_with_disabilitis_btn
}
console.log(all);
console.log(allBtn);
// Show function to manage visibility
function show(item) {
    Object.values(all).forEach(element => {
        if (element.classList.contains('visible')) {
            element.classList.remove('visible');
            element.classList.add('unVisible');
        }
    });
    item.classList.remove('unVisible');
    item.classList.add('visible');
}

// Example of how to show a specific item
show(adication_activitis);

const mapping = {
    what_to_do_on_roket_atack_btn: 'rockets_atack',
    adication_activitis_btn: 'adication_activitis',
    work_places_btn: 'work_places',
    crowding_and_servise_btn: 'crowding_and_servise',
    picod_haoref_computer_btn: 'picod_haoref_computer',
    select_safe_place_btn: 'select_safe_place', //doens work
    time_to_get_to_safe_place_btn: 'time_to_get_to_safe_place', //dosent work
    safe_place_policy_btn: 'safe_place_policy',//doesnt work
    shered_safe_palce_btn: 'shered_safe_palce',
    picod_haoref_phone_btn: 'picod_haoref_phone',
    maarach_chofarim_btn: 'maarach_chofarim',
    amchaa_alerts_btn: 'amchaa_alerts',
    public_safe_place_btn: 'public_safe_place',
    alert_area_btn: 'alert_area',
    pepule_with_disabilitis_btn: 'pepule_with_disabilitis'
};
console.log(mapping)
// Show the appropriate content based on the clicked button
Object.values(allBtn).forEach(button => {
    button.addEventListener('click', function () {
        // Get the corresponding content item
        const contentId = mapping[button.id];
        const contentToShow = all[contentId];

        // Show the content
        show(contentToShow);

        // Update button classes
        Object.values(allBtn).forEach(btn => {
            if (btn === button) {
                btn.classList.remove('noPress');
                btn.classList.add('press');
            } else {
                btn.classList.remove('press');
                btn.classList.add('noPress');
            }
        });
    });
});
//press
//noPress