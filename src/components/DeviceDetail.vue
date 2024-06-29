<template>

<b-row class="p-3 bg-light">
    <h1 class="montserrat-bold">
        Welcome to the detailed data page for device {{ deviceId }}. 
    </h1>
    <div class="montserrat-text">
        <p >
        Here, you can find comprehensive information about the air quality monitored by this device. The table below lists the real-time data collected, including:
    </p>
    <div class="list-unstyled">
        <ul>
            <li>PM2.5: Concentration of particulate matter less than 2.5 micrometers in diameter such as dust and smoke.</li>
            <li>CO2: Carbon dioxide levels measured in parts per million (PPM).</li>
            <li>Temperature: The ambient temperature in degrees Celsius.</li>
            <li>Humidity: The relative humidity percentage.</li>
        </ul>  
    </div>
    </div>
    
</b-row >


  <b-row class="row">
    <b-col class="col-5.8 border bg-light ">
        <h1 class="montserrat-bold">Table:</h1>
        <div>
    
    <br>
    <div>
      <b-table :items="devicePayloads" class="table table-striped bg-light" />
    </div>
  </div>
    </b-col>

    <b-col class="col-5.8 offset-md-0.4 border bg-light">
        <h1 class="montserrat-bold">Charts:</h1>
        <Chart v-if="!isLoading" class="chartData"
      :label="chartLabel"
      :data="CO2Data"
    />
    <Chart v-if="!isLoading" class="chartData"
      :label="chartLabel"
      :data="HumidityData"
    />
    <Chart v-if="!isLoading" class="chartData"
      :label="chartLabel"
      :data="TemperatureData"
    />
    <Chart v-if="!isLoading" class="chartData"
      :label="chartLabel"
      :data="PM25Data"
    />
        
    </b-col>
  </b-row>
</template>

<script>
import { addDays, format } from 'date-fns'; // Import date fns function
import Chart from '@/components/Chart.vue';
export default {
    components: {
        Chart,
    },
    data() {
        return {
            devicePayloads: [],
            isLoading: false
        }

    },
    computed: {
        deviceId() {
            return this.$route.params.deviceId
        },
        chartLabel(){
            if(this.devicePayloads.length==0){
                return [];
            }
            return this.devicePayloads.slice(1, 20).map(items => items.datetime);
            
        },
        CO2Data(){
            if(this.devicePayloads.length==0){
                return [];
            }
            return [
                {
                    label: 'CO2',
                    backgroundColor: '#41B883',
                    data: this.devicePayloads.slice(1, 20).map(item => item.CO2)
                }
            ]
        },
        HumidityData(){
            if(this.devicePayloads.length==0){
                return [];
            }
            return [
                {
                    label: 'Humidity',
                    backgroundColor: '#7da4ff',
                    data: this.devicePayloads.slice(1, 20).map(item => item.Humidty)
                }
            ]
        },
        TemperatureData(){
            if(this.devicePayloads.length==0){
                return [];
            }
            return [
                {
                    label: 'Temperature',
                    backgroundColor: '#ff7dc7',
                    data: this.devicePayloads.slice(1, 20).map(item => item.Temperature)
                }
            ]
        },
        PM25Data(){
            if(this.devicePayloads.length==0){
                return [];
            }
            return [
                {
                    label: 'PM25',
                    backgroundColor: '#ffe77d',
                    data: this.devicePayloads.slice(1, 20).map(item => item.PM25)
                }
            ]
        },
        chartData() {
            if(this.devicePayloads.length==0){
                return [];
            }
            return [
                {
                    label: 'CO 2',
                    backgroundColor: '#41B883',
                    data: this.devicePayloads.slice(1, 20).map(item => item.CO2)
                }, {
                    label: 'Humidity',
                    backgroundColor: '#E46651',
                    data: this.devicePayloads.slice(1, 20).map(item => item.Humidity)
                }, {
                    label: 'Temperature',
                    backgroundColor: '#00D8FF',
                    data: this.devicePayloads.slice(1, 20).map(item => item.Temperature)
                },
                {
                    label: 'PM25',
                    backgroundColor: '#00D8FF',
                    data: this.devicePayloads.slice(1, 20).map(item => item.PM25)
                }
            ]
        }
    },

    mounted () {
        this.getUplink();
    },
    methods: {
        async getUplink() {
            this.isLoading = true
            try {
                const response = await this.$api.getUplinks({
                    start_date: format(addDays(new Date(), -1), 'yyyy-MM-dd'), // Format 3 days ago to yyyy-MM-dd, e.g. 2024-05-26
                    end_date: format(new Date(), 'yyyy-MM-dd'), // Format today to yyyy-MM-dd, e.g. 2024-05-29
                    device_id: this.deviceId,
                    load_payloads: 1,
                    per_page: 20
                })
                const deviceUplinks = response.data.data
                // Bentuk data deviceUplinks kurang lebih sepert ini:
                //  [
                //    { 
                //      device_id: ...,
                //      payloads: [{...}, {...}, {...}] <- data yang akan kita ambil
                //    }
                //  ]

                // Gunakan flatMap untuk mengambil data payloads
                this.devicePayloads = deviceUplinks.flatMap(uplink => uplink.payloads).reverse()
            } catch (error) {
                console.log(error)

            }
            finally{
                this.isLoading = false
            }
        }
    },
}
</script>