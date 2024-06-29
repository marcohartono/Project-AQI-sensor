<template>
  <main>
    
    <b-row class="segmentIntro" id="Hero-section">
      <b-col>
        <div>
          <h1>Project Clarity</h1>
          <h3>Be Mindful of Your Workspace: Elevate Productivity and Well-being with Cl(air)ity's Smart Air Quality Sensors. Able to be monitored from anywhere in the world</h3>
        </div>
      </b-col>
      <b-col>
        <spline :scene="scenes.first" style="height: 400px;" />
      </b-col>
    </b-row>

    <b-row style="height: 500px;" class="middleSection">
      <b-col>
        <l-map ref="map" v-model:zoom="zoom" :center="[-6.2088, 106.8456]" style="height: 350px;">
          <l-tile-layer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            layer-type="base"
            name="OpenStreetMap"
          ></l-tile-layer>
          <div v-for="(device, index) in devices" :key="index" >
            <l-marker 
            v-if="device.latitude && device.longitude"
             
            :lat-lng="[device.latitude, device.longitude]" draggable=""  @click="handleClick(device.device_id)" name="2"
          >
    
          </l-marker>
          </div>
          
        </l-map>
      </b-col>
      <b-col>
        <h1>Monitor Air Quality in Real Time</h1>
        <h3>Our interactive map below shows the location of all our Cl(air)ity sensors deployed in various indoor spaces. Each marker represents an active air quality sensor. Click on any marker to view detailed information about the air quality at that specific location, including data on particulate matter (PM2.5), carbon dioxide (CO2), temperature, and humidity levels.</h3>
      </b-col>
      
      

        
    </b-row>
  
      <b-row style="margin-top: 0px;" class="deviceData">
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
          <b-row>
            <VueSpeedometer 
            :value="Number(devices[selectedDevice]?.latest_payload?.CO2 ?? 0)" 
            :minValue="0" 
            :maxValue="2000" 
            :segments="4" 
            startColor="#60cb75" 
            endColor="#e84940"
            style="height: 200px;"
          />
          </b-row>
          
          <b-row>
            <p>Use the navigation above to select different air quality sensors. Each tab represents a different sensor deployed in various locations. By selecting a tab, you can view detailed information about the air quality at that specific location.

            </p>
          </b-row>
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

  </main>
</template>

<script lang="ts">
import axios from 'axios'
import { defineComponent } from 'vue'
import Pusher from 'pusher-js'
import VueSpeedometer from "vue-speedometer"
import "leaflet/dist/leaflet.css"
import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet"
import Spline from "spline-vue/v3";

export default defineComponent({
  name: 'SensorPage',
  components: {
    VueSpeedometer,
    LMap,
    LTileLayer,
    LMarker,
    Spline,
  },
  data() {
    return {
      devices: [],
      selectedDevice: null,
      deviceHistory: '',
      zoom: 12,
      scenes: {
          first: "https://prod.spline.design/Uq6aF3NT8QGE4v13/scene.splinecode"
          }
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    selectDevice(index) {
      this.selectedDevice = index
    },
    handleClick(device_Id) {
        const routeData = this.$router.resolve({name: 'Device Detail', params: {deviceId: device_Id}});
        window.open(routeData.href, '_blank')
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
