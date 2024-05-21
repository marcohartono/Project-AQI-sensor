<template>
    <div>
        Device Detail Page for Device {{ deviceId }}
    </div>
</template>

<script>
export default {
    computed: {
        deviceId() {
            return this.$route.params.deviceId
        }
    },
}
</script>

<style lang="scss" scoped>

</style>