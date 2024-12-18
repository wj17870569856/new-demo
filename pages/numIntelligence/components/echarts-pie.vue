<template>
  <div :id="chartId" :option="option" style="width: 100%; height:13.75rem"></div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "LineChart",
  props: {
    chartId: {
      type: String,
      required: true,
    },
    chartOption: {
      type: Object,
      required: true,
    },
   
  },
  data() {
    return {
      chartInstance: null,
      option: {},
    };
  },
  mounted() {
    this.chartInstance = echarts.init(document.getElementById(this.chartId));

    this.init();
  },
  methods: {
    init() {
      let index = 0;
      var colorList = [
        "#21BC72",
        "#26FDF0",
        "#12ACFA",
        "#257FF8",
        "#FD866A",
        "#9E87FF",
        "#58D5FF",
      ];
      this.option = {
        tooltip: {
          trigger: "item",
        },
        legend: {
          icon: "circle",
          left: "0%",
          bottom: "0",
          align: "left",
          itemWidth: 4,
          itemHeight: 4,
          textStyle: {
            color: "#fff",
            fontSize: "12px",
          },
        },
        grad: {
          top: 0,
        },
        series: [
          {
            type: "pie",
            center: this.chartOption.center,
            radius: this.chartOption.radius,
            clockwise: true,
            avoidLabelOverlap: true,
            hoverOffset: 15,
            itemStyle: {
              normal: {
                color: function (params) {
                  return colorList[params.dataIndex];
                },
              },
            },
            label: {
              show: this.chartOption.label,
              position: "outside",
              color: "#fff",
              fontSize: "1rem",
              formatter: "{d}%",
              rich: {
                a: {
                  padding: [-20, 10, -10, 15],
                },
              },
            },
            labelLine: {
              normal: {
                length: 20,
                length2: 30,
                color: "#fff",
                lineStyle: {
                  width: 1,
                },
              },
            },
            data: this.chartOption.data,
          },
        ],
      };
      this.chartInstance.setOption(this.option);
    },
  },
  watch: {
    // chartOption: {
    //   handler(newOption) {
    //     if (this.chartInstance) {
    //       this.chartInstance.setOption(newOption);
    //     }
    //   },
    //   deep: true,
    // },
  },
};
</script>
