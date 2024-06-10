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
        map
    </b-col>
  </b-row>
</template>

<script>
import { addDays, format } from 'date-fns'; // Import date fns function
export default {
    data() {
        return {
            devicePayloads: []
        }
    },
    computed: {
        deviceId() {
            return this.$route.params.deviceId
        },
    },
    mounted () {
        this.getUplink();
    },
    methods: {
        async getUplink() {
            try {
                const response = await this.$api.getUplinks({
                    start_date: format(addDays(new Date(), -3), 'yyyy-MM-dd'), // Format 3 days ago to yyyy-MM-dd, e.g. 2024-05-26
                    end_date: format(new Date(), 'yyyy-MM-dd'), // Format today to yyyy-MM-dd, e.g. 2024-05-29
                    device_id: this.deviceId,
                    load_payloads: 1,
                    per_page: 200
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
                this.devicePayloads = deviceUplinks.flatMap(uplink => uplink.payloads) 
            } catch (error) {
                console.log(error)
            }
        }
    },
}
</script>