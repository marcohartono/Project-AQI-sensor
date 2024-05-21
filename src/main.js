import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')

var myMap = L.map('map').setView([-6.200000, 106.816666], 13);

        // Add an OpenStreetMap tile layer to the map
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '© OpenStreetMap contributors', 
            
        }).addTo(myMap);

        // Add a marker to the map at the same coordinates as above
var sensor1 = L.marker([-6.200000, 106.816666]).addTo(myMap)
.bindPopup('sensor 1');


import emitter from './eventBus';

// sensor1.on('click', function() {
//     emitter.emit('switch-sensor', {
//     });
//     console.log('Switch to sensor 1');
// });

sensor1.openPopup(); 
