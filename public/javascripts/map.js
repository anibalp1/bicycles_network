var map = L.map('main_map').setView([18.48847, -69.85707], 13);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1Ijoic2FtdWVscGVuYTIxIiwiYSI6ImNraGNocmNyYzA1OHMzMm1mMnhleThzaHcifQ.fmWJgBoGeDibdBGtFln6hw'
}).addTo(map);

L.marker([18.480289, -69.853922]).addTo(map);
L.marker([18.496195, -69.955696]).addTo(map);