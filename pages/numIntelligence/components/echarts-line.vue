<template>
  <div :id="chartId" :option="chartOption" style="width: 100%;height:100%" ></div>
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
    };
  },
  mounted() {
    this.chartInstance = echarts.init(document.getElementById(this.chartId));
    this.chartInstance.setOption(this.chartOption);

    const debounce = (fun, delay) => {
      let timer;
      return function () {
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          fun();
        }, delay);
      };
    };
    const cancalDebounce = debounce(resizeHandler, 50);
    window.addEventListener("resize", cancalDebounce);
    //重绘图表函数
    const resizeHandler = () => {
      chartInstance.resize();
    };
  },
  watch: {
    chartOption: {
      handler(newOption) {
        if (this.chartInstance) {
          this.chartInstance.setOption(newOption);
        }
      },
      deep: true,
    },
  },
};
</script>
