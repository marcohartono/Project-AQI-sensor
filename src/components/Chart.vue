<template>
    <div style="height:600px;width: 600px; display: flex;flex-direction:column;">
      <vue3-chart-js
        type="line"
        :data="chartData"
      ></vue3-chart-js>
    </div>
  </template>
  
  <script>
  import Vue3ChartJs from '@j-t-mcc/vue3-chartjs'
  
  export default {
    name: 'App',
    components: {
      Vue3ChartJs,
    },
    props: {
        data: {
            type: Array,
            default() {
                return []
            }
        },
        label: {
            type: Array,
            default() {
                return []
            }
        },
        color: {
            type: Array,
            default() {
                return []
            }
        },
    },
    computed: {
        chartData() {
            return {
                labels: this.label,
                datasets: this.data,
            }
        }
    },
  }
  </script>