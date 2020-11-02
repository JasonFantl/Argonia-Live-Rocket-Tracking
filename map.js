let popups = [];

var displayMap = L.map('mapid').setView([37.17, -97.74], 14);

var southWest = L.latLng(37.108313, -97.822266),
    northEast = L.latLng(37.224314, -97.654037),
    bounds = L.latLngBounds(southWest, northEast);

L.tileLayer('tiles/{z}/{x}/{y}.png', {
    attribution: 'Tiles by Atlas',
    bounds: bounds,
    maxZoom: 15,
    minZoom: 4
}).addTo(displayMap);

function updateMap(users) {

    // reset all
    for (let i = 0; i < popups.length; i++) {
        popups[i].setLatLng([0, 0]);
    }

    // update all the entries
    for (let i = 0; i < users.length; i++) {
        user = users[i];
        console.log(user);
        // if this is a new entry
        if (!popups[user.name]) {
            console.log("adding new popup: " + user.name + " with cords " + user.lat + "," + user.lon);
            let newMarker = L.marker([user.lat, user.lon]).bindPopup('<p>' + user.name + '<br /> Lat: ' + user.lat + ', Lon: ' + user.lon + '</p>');
            popups[user.name] = newMarker.addTo(displayMap);
        }
        popups[user.name].setLatLng([user.lat, user.lon]);
    }

    // remove any entries that wern't sent
    for (let i = popups.length - 1; i >= 0; i--) {
        if (popups[i].getLatLng()[0] == 0) {
            popups.splice(i, 1);
        }
    }
}


function moveMapTo(name) {
    if (!(typeof popups[name] === 'undefined')) {
        displayMap.setView(popups[name].getLatLng(), 15);
    }
}