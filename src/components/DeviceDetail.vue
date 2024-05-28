<template>
  <div>
    Device Detail Page for Device {{ deviceId }}
    <br>
    <div>
      <b-table :items="devicePayloads" />
    </div>
  </div>
</template>

<script>
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
                    start_date: '2024-05-20',
                    end_date: '2024-05-21',
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