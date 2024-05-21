<template>
    <main>
  
  
  
  
  <div>
    <b-row>
      <div class="bg-success rounded mt=400" >
    <h1>Jakarta Air Quality Index</h1>
    <p>Real-time updates on the air you breathe</p>
  </div>
    </b-row>
    <b-row>
      
      <b-col><div id="device-list" >
    <nav>
      <ul> 
        <li v-for="(device, index) in devices" :key="index">
          <a href="#" @click="selectDevice(index)">{{ device.name }}</a>
        </li>
      </ul>
    </nav>
  </div>
      </b-col>
    </b-row>
    <b-row>
      <b-col ld="4">
        <VueSpeedometer :value="Number(devices[selectedDevice]?.latest_payload?.CO2 ?? 0)" :minValue=400 :maxValue=3100 :segments="3" startColor="#00FF00" endColor="#FFFF00"/>
      </b-col>
      <b-col md="8">
        <section id="sensor" v-if="devices[selectedDevice]">
          <h2 class="bg-primary text-white p-3 rounded">{{ devices[selectedDevice].name }}</h2>
          <div class="sensor-graphic">
              <p>CO2 PPM: {{ devices[selectedDevice].latest_payload?.CO2 }}</p>
               <p>Humidity Percent: {{ devices[selectedDevice].latest_payload?.Humidity }}</p>
                <p>Temperature: {{ devices[selectedDevice].latest_payload?.Temperature }}°C</p>
               <p>Dust PPM: {{ devices[selectedDevice].latest_payload?.PM25 }}</p>
            </div>
        </section>
      </b-col>
    </b-row>
  </div>
  
  
  <b-row>
    <b-col md="4">
        Column 1
    </b-col>
    <b-col md="8">
        Column 2
    </b-col>
  </b-row>
  <b-row class="mt-3">
    <b-col>
        Large Column
    </b-col>
  </b-row>
        

  
    </main>
  
  
  
  
  
  
  
  
  
  </template>
  
  <script lang="ts">
  import axios from 'axios'
  import { defineComponent } from 'vue'
  import Pusher from 'pusher-js'
  import emitter from './eventBus';
  import VueSpeedometer from "vue-speedometer"
  
  export default defineComponent({
  name: 'SensorPage',
  components:{
    VueSpeedometer,
  },
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
    selectDevice(index) {
      this.selectedDevice = index; // Set the selected device to the clicked device
    //   this.getHistoricalData(device.device_id);
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