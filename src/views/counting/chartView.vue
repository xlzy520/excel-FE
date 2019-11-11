<template>
  <div class="chart-container">
    <div id="left" style="width: 1000px;height: 345px"></div>
    <div id="right" style="width: 1000px;height: 345px"></div>
  </div>
</template>

<script>
const echarts = require('echarts/lib/echarts')
// 引入柱状图
require('echarts/lib/chart/bar')
require('echarts/lib/chart/line')
require('echarts/lib/chart/pie')
// 引入提示框和标题组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/legend')
require('echarts/lib/component/title')
export default {
  name: 'ChartView',
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {}
  },
  methods: {
    drawLeft() {
      const myChart = echarts.init(document.getElementById('left'))
      myChart.setOption({
        tooltip: {},
        xAxis: {
          data: this.data.map(v => v.name)
        },
        yAxis: {},
        series: [{
          name: '人数统计',
          type: 'bar',
          data: this.data.map(v => v.total)
        }]
      })
    },
    drawRight() {
      var myChart = echarts.init(document.getElementById('right'))
      myChart.setOption({
        legend: {
          bottom: 10,
          left: 'center',
          data: this.data.map(v => v.name)
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        series: [{
          type: 'pie',
          radius: '65%',
          center: ['50%', '50%'],
          selectedMode: 'single',
          data: this.data.map(v => {
            return {
              value: v.total,
              name: v.name
            }
          })
        }]
      })
    },
    draw() {
      console.log(2);
      this.drawLeft()
      this.drawRight()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
