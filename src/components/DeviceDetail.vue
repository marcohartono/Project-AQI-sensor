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
        <Chart 
      :label="chartLabel"
      :data="chartData"
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
            devicePayloads: []

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
            return this.devicePayloads.map(items => items.datetime);
            
        },
        chartData() {
            if(this.devicePayloads.length==0){
                return [];
            }
            return [
                {
                    label: 'CO 2',
                    backgroundColor: '#41B883',
                    data: this.devicePayloads.map(item => item.CO2)
                }, {
                    label: 'Humidity',
                    backgroundColor: '#E46651',
                    data: this.devicePayloads.map(item => item.Humidity)
                }, {
                    label: 'Temperature',
                    backgroundColor: '#00D8FF',
                    data: this.devicePayloads.map(item => item.Temperature)
                },
                {
                    label: 'PM25',
                    backgroundColor: '#00D8FF',
                    data: this.devicePayloads.map(item => item.PM25)
                }
            ]
        }
    },

    mounted () {
        this.getUplink();
    },
    methods: {
        async getUplink() {
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
        }
    },
}
</script>