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
    },
    total: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {}
  },
  methods: {
    drawLeft() {
      const myChart = echarts.init(document.getElementById('left'))
      myChart.setOption({
        title: {
          text: '总报名人数: ' + this.total
        },
        color: ['#1296db'],
        tooltip: {},
        xAxis: {
          type: 'category',
          axisLabel: {
            formatter: function(val) {
              return val.substring(0, 10) + '\n' + val.substring(10)
            }
          },
          data: this.data.map(v => v.school)
        },
        yAxis: {
          name: '报名人数'
        },
        series: [{
          name: '人数统计',
          type: 'bar',
          barWidth: '15%',
          label: {
            normal: {
              show: true,
              position: 'top',
              distance: 20,
              formatter: function(params) {
                return params.data.value
              },
              textStyle: {
                color: '#8946ff',
                fontSize: 20
              }
            }
          },
          data: this.data.map(v => v.peopleCount)
        }]
      })
    },
    drawRight() {
      var myChart = echarts.init(document.getElementById('right'))
      myChart.setOption({
        legend: {
          bottom: 10,
          left: 'center',
          data: this.data.map(v => v.school)
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} <br/> {c} ({d}%)'
        },
        series: [{
          type: 'pie',
          radius: '65%',
          center: ['50%', '50%'],
          label: {
            normal: {
              formatter: (params) => {
                return '{b| ' + params.name + '}  ' + '{c|' + params.percent.toFixed(0) + '%}'
              },
              rich: {
                b: {
                  fontSize: 12,
                  lineHeight: 20,
                  padding: [0, 0, 5, 0]
                },
                c: {
                  fontSize: 20,
                  lineHeight: 20
                }

              }
            }
          },
          selectedMode: 'single',
          data: this.data.map(v => {
            return {
              value: v.peopleCount,
              name: v.school
            }
          })
        }]
      })
    },
    draw() {
      console.log(2)
      this.drawLeft()
      this.drawRight()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
