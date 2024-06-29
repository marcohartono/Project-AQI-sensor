<template>
   
</template>

<script>
import Chart from '@/components/Chart.vue';
export default {
    components: {
        Chart,
    },
    data() {
        return {
            items: [
                {age: 18,
                    name: 'test'
                },
                {age: 20,
                    name: 'test2'
                },
                {age: 19,
                    name: 'test3'
                },
            ],
            sampleData: [
                {
                    label: 'CO 2',
                    backgroundColor: '#41B883',
                    data: [10, 30, 90]
                }, {
                    label: 'Humidity',
                    backgroundColor: '#E46651',
                    data: [20, 40, 15]
                }, {
                    label: 'Temperature',
                    backgroundColor: '#00D8FF',
                    data: [60, 5, 55]
                },
            ]
        }
    },
};
</script>
