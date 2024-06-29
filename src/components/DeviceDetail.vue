<template>

  <b-row>
    <b-col>
        <div>
    Device Detail Page for Device {{ deviceId }}
    <br>
    <div>
      <b-table :items="devicePayloads" />
    </div>
  </div>
    </b-col>
    <b-col>
        <Chart v-if="!isLoading"
      :label="chartLabel"
      :data="CO2Data"
    />
    <Chart v-if="!isLoading"
      :label="chartLabel"
      :data="HumidityData"
    />
    <Chart v-if="!isLoading"
      :label="chartLabel"
      :data="TemperatureData"
    />
    <Chart v-if="!isLoading"
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
                    backgroundColor: '#41B883',
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
                    backgroundColor: '#41B883',
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
                    backgroundColor: '#41B883',
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