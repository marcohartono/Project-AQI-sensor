<template>
  <main>
    <b-row class="segmentIntro" id="Hero-section">
      <b-col>
        <div>
          <h1>Project Clarity</h1>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta placeat dignissimos maiores. Laudantium expedita id tempore labore enim totam, in natus, dolor odit excepturi sint eos animi culpa ratione illo?</p>
        </div>
      </b-col>
      <b-col>
        <l-map ref="map" v-model:zoom="zoom" :center="[-6.2088, 106.8456]">
          <l-tile-layer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            layer-type="base"
            name="OpenStreetMap"
          ></l-tile-layer>
          <l-marker 
            v-for="(device, index) in devices" :key="index" 
            :lat-lng="[device.latitude, device.longitude]" draggable="" icon=""
          >
            {{ device.name }}
          </l-marker>
        </l-map>
      </b-col>
    </b-row>
  
    <div>
      <b-row>
        <b-col>
          <div id="device-list">
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
        <b-col md="4">
          <VueSpeedometer 
            :value="Number(devices[selectedDevice]?.latest_payload?.CO2 ?? 0)" 
            :minValue="400" 
            :maxValue="3100" 
            :segments="3" 
            startColor="#00FF00" 
            endColor="#FFFF00"
          />
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

    <div v-for="(device, index) in devices" :key="index">
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
import "leaflet/dist/leaflet.css"
import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet"

export default defineComponent({
  name: 'SensorPage',
  components: {
    VueSpeedometer,
    LMap,
    LTileLayer,
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
    this.getData()
  },
  methods: {
    selectDevice(index) {
      this.selectedDevice = index
    },
    startWebSocket() {
      const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
        cluster: 'ap1',
      })
      console.log("subscribed")
      this.devices.forEach((device) => 
        pusher
          .subscribe(`device.${device.device_id}`)
          .bind('App\\Events\\UplinkReceived', (data) => {
            device.latest_payload = data.payload
            console.log("update", data)
          })
      )
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
      try {
        const response = await instanceAxios.get('/api/uplinks?start_date=2024-01-01&load_payloads=1&device_id=Node_SCD30&per_page=15&page=1')
        this.deviceHistory = response.data.data
      } catch (error) {
        console.log(error)
      }
    },
  },
})
</script>
