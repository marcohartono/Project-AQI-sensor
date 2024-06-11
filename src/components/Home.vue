<template>
  <main>
    <b-row class="segmentIntro">
      <b-col>
        <div class="bg-success rounded mt=400">
          <h1>Jakarta Air Quality Index</h1>
          <p>Real-time updates on the air you breathe</p>
        </div>
      </b-col>
      <b-col>
        <l-map
          ref="map"
          v-model:zoom="zoom"
          :center="[-6.2088, 106.8456]"
        >
          <l-tile-layer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            layer-type="base"
            name="OpenStreetMap"
          />
          <l-marker
            :lat-lng="[-6.287368036269573, 106.6392436226691]"
            draggable
            @click="handleClick()"
          />
        </l-map>
      </b-col>
    </b-row>

    <div>
      <b-row>
        <b-col>
          <div id="device-list">
            <nav>
              <ul> 
                <li
                  v-for="(device, index) in devices"
                  :key="index"
                >
                  <a
                    href="#"
                    @click="selectDevice(index)"
                  >{{ device.name }}</a>
                </li>
              </ul>
            </nav>
          </div>
        </b-col>
      </b-row>
      <b-row>
        <b-col ld="4">
          <VueSpeedometer
            :value="Number(devices[selectedDevice]?.latest_payload?.CO2 ?? 0)"
            :min-value="400"
            :max-value="3100"
            :segments="3"
            start-color="#00FF00"
            end-color="#FFFF00"
          />
        </b-col>
        <b-col md="8">
          <section
            v-if="devices[selectedDevice]"
            id="sensor"
          >
            <h2 class="bg-primary text-white p-3 rounded">
              {{ devices[selectedDevice].name }}
            </h2>
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
    <div
      v-for="(device, index) in devices"
      :key="index"
    >
      <router-link :to="`/detail/${device.device_id}`">
        {{ device.name }}
      </router-link>
    </div>
  </main>
</template>
<script lang="ts">
  import axios from 'axios'
  import { defineComponent } from 'vue'
  import Pusher from 'pusher-js'
  import VueSpeedometer from "vue-speedometer"
  import "leaflet/dist/leaflet.css";
  import { LMap, LTileLayer, LCircleMarker, LMarker } from "@vue-leaflet/vue-leaflet";
  
  export default defineComponent({
    name: 'SensorPage',
    components:{
      VueSpeedometer,
      LMap,
      LTileLayer,
      LCircleMarker,
      LMarker,
    },
    data() {
      return {
        devices: [],
        selectedDevice: null,
        deviceHistory: '',
        zoom: 12,
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
      handleClick(deviceName = 'ESP32-AQS') {
        const routeData = this.$router.resolve({name: 'Device Detail', params: {deviceId: deviceName}});
        window.open(routeData.href, '_blank')
      },
      async getData() {
        try {
          const response = await this.$api.getDevices()
          this.devices = response.data.data
          this.startWebSocket()
        } catch (error) {
          console.log(error)
        }
      },
      async getHistoricalData() {
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