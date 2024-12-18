<template>
  <div class="content" style="width: 100%; height: 100%">
    <div id="chinaMap" style="width: 100%; height: 100%"></div>
  </div>
</template>
<script>
/* eslint-disable */
import chinaJson from '@/assets/geojson.json'
export default {
  name: 'MyMap',
  data() {
    return {
      data: [],
      color: [],
    }
  },
  methods: {
    setData() {
      let countArr = [
        1, 2, 3, 4, 1, 6, 7, 8, 9, 10, 31, 12, 73, 214, 15, 4, 17, 218, 519,
        120, 0, 22, 13, 54, 25, 2, 2, 1, 2, 6, 1, 0, 1, 1, 1,
      ]
      chinaJson.features.forEach((item, index) => {
        // let color = ''
        // switch (index % 3) {
        //   case 0:
        //     color = 'rgba(14,148,233,1)'
        //     break
        //   case 1:
        //     color = 'rgba(14,148,233,.6)'
        //     break
        //   case 2:
        //     color = 'rgba(14,148,233,.3)'
        //     break
        //   default:
        //     color = 'rgba(14,148,233,1)'
        //     break
        // }

        this.data.push({
          name: item.properties.name,
          value: countArr[index],
          // itemStyle: {
          //   // areaColor: color,
          //   color: '#fff',
          // },
        })
      })
    },
  },
  mounted() {
    this.setData()
    const options = {
      backgroundColor: '#fff',
      tooltip: {
        trigger: 'item',
        showDelay: 0,
        transitionDuration: 0.2,
        backgroundColor: '#e84a01e5',
        borderColor: '#e84a01e5',
        textStyle: {
          color: '#fff',
          fontSize: '12',
        },
        formatter(params) {
          if (params.name === '南海诸岛') {
            return params.name
          }
          return `${params.name}<br/>${params.value}家合作供应商`
        },
      },
      toolbox: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'top',
        feature: {
          // dataView: { readOnly: false },
          restore: {},
          // saveAsImage: {}
        },
      },
      visualMap: {
        type: 'piecewise',
        backgroundColor: '#f9f9f9',
        bottom: 8,
        left: 8,
        pieces: [
          { min: 0, max: 20, label: '0~20', color: 'rgba(14,148,233,.4)' },
          { min: 21, max: 100, label: '21~100', color: 'rgba(14,148,233,.7)' },
          {
            min: 101,
            max: 1000,
            label: '101~1000',
            color: 'rgba(14,148,233,1)',
          },
        ],
      },
      series: [
        {
          type: 'map',
          map: 'china',
          roam: true,
          zoom: 1.3,
          scaleLimit: {
            min: 1.1,
            max: 5,
          },
          top: '13%',

          select: {
            disabled: true,
          },
          label: {
            show: true,
            color: '#ffffff',
            fontSize: 10,
            fontWeight: 100,
          },
          itemStyle: {
            areaColor: '#fff',
            borderColor: '#0c69ad',
            borderWidth: 1,
          },
          emphasis: {
            label: {
              show: true,
              color: '#ffffff',
            },
            itemStyle: {
              color: '#ffffff',
              areaColor: '#057ad5',
              borderWidth: 0,
              shadowColor: 'rgba(13,51,101, 0.5)',
              shadowOffsetX: -2,
              shadowOffsetY: 8,
              shadowBlur: 10,
            },
          },
          data: this.data,
        },
      ],
    }

    setTimeout(() => {
      this.$echarts.registerMap('china', { geoJSON: chinaJson })
      const chart = this.$echarts.init(document.getElementById('chinaMap'))
      chart.setOption(options)
    }, 0)
  },
}
</script>
