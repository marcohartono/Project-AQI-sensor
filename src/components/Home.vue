<template>
    <main>
  
  <div class="container" id="device-list" >
    <nav>
      <ul> 
        <li v-for="(device) in devices" :key="device_id">
          <a href="#" @click="selectDevice(device)">{{ device.name }}</a>
        </li>
      </ul>
    </nav>
  </div>
  
  
  <section id="sensor" v-if="selectedDevice">
  <h2>{{ selectedDevice.name }}</h2>
  <div class="sensor-graphic">
    <p>CO2 PPM: {{ selectedDevice.latest_payload.CO2 }}</p>
    <p>Humidity Percent: {{ selectedDevice.latest_payload.Humidity }}</p>
    <p>Temperature: {{ selectedDevice.latest_payload.Temperature }}°C</p>
    <p>Dust PPM: {{ selectedDevice.latest_payload.PM25 }}</p>
  </div>
  </section>
        
  
  <!-- <h2>Historical Data for {{ selectedDevice.name }}</h2>
        <table>
          <thead>
            <tr>
              <th>Collected Datetime</th>
              <th>PM2.5</th>
              <th>CO2</th>
              <th>Temperature</th>
              <th>Humidity</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in deviceHistory" :key="device_id">
              <td>{{ record.date }}</td>
              <td>{{ record.payloads.co2_ppm }}</td>
              <td>{{ record.CO2 }}</td>
              <td>{{ record.Temperature }}</td>
              <td>{{ record.Humidity }}</td>
            </tr>
          </tbody>
        </table> -->
  
    </main>
  
  
  
  
  
  
  
  
  
  </template>
  
  <script lang="ts">
  import axios from 'axios'
  import { defineComponent } from 'vue'
  import Pusher from 'pusher-js'
  import emitter from './eventBus';
  
  export default defineComponent({
  name: 'SensorPage',
  data() {
    return {
      devices: [],
      selectedDevice: null,
      deviceHistory: '',
  
  
  
    }
    },
    mounted() {
        // emitter.on('switch-sensor', (payload) => {
        //     this.switchSensor(payload.name, payload.data);
      
        // });
        this.getData();
    },
  
  methods: {
    selectDevice(device) {
      this.selectedDevice = device; // Set the selected device to the clicked device
      this.getHistoricalData(device.device_id);
    },
    startWebSocket() {
      // Initialize Pusher
      const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
        cluster: 'ap1',
      })
      // Subscribe ke channel setiap device
      console.log("suscribed")
      this.devices.forEach((device) =>
        pusher
          .subscribe(`device.${device.device_id}`)
          .bind('App\\Events\\UplinkReceived', function (data) {
            // Listen Event Uplink Received
            device.latest_payload = data.payload // Saat ada data yang masuk ganti latest payload device dengan yang baru
            console.log("update", data)
          }),
      )
    },
    
  
    async getData() {
      const instanceAxios = axios.create({
        baseURL: import.meta.env.VITE_API_URL,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
        },
      })
      await instanceAxios
        .get('/api/devices?field_id') // ubah URL sesuai data yang dibutuhkan
        .then((response) => (this.devices = response.data.data))
        this.startWebSocket()
    },async getHistoricalData() {
      const instanceAxios = axios.create({
        baseURL: import.meta.env.VITE_API_URL,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
        },
      })
      instanceAxios
        .get('/api/uplinks?start_date=2024-01-01&load_payloads=1&device_id=Node_SCD30&per_page=15&page=1') // ubah URL sesuai data yang dibutuhkan
        .then((response) => (this.deviceHistory = response.data.data))
    },
  
  },
  });
  
  
  
  </script>
  
  