<template>
  <div>
    <!--  -->
    <div :id="chartId" class="chart" ref="chart" :style="{ width: width, height }" v-if="isShoW"></div>
  </div>
</template>

<script>
// import AMapLoader from "@amap/amap-jsapi-loader";

import geoJson from "../../../assets/json/national.json";
import icon1 from "../../../assets/images/numIntelligence/icon24.png";
import icon2 from "../../../assets/images/numIntelligence/icon22.png";
import icon3 from "../../../assets/images/numIntelligence/icon21.png";
import icon4 from "../../../assets/images/numIntelligence/icon23.png";
export default {
  name: "mapJson",
  data() {
    return {
      isShoW: true,
    };
  },
  props: {
    chartId: {
      type: String,
      required: true,
    },
    chartOption: {
      type: Object,
      required: true,
    },
    width: {
      type: String,
      required: false,
    },
    height: {
      type: String,
      required: false,
    },
    zoom: {
      type: Number,
      required: false,
    },
    type: {
      type: Number,
      required: false,
    },
  },
  watch: {
    chartOption: {
      handler(newVal, oldVal) {
        //监听info对象变化
        // this.init();
        if (window.map && newVal.data) {
          // console.log(this.$refs.chart,this.isShoW)

          window.map.clearMap();
          // window.labelsLayer.setMap(null)
          this.getLoca(window.map);
        } else {
          this.init();
        }

        //do same things...
      },
      deep: true, //深度监听
      // immediate: true,
    },
  },
  mounted() {
    this.init();
  },
  destroyed() {
    this.isShoW = false;

  },
  methods: {
    init() {
      AMap.plugin(
        [
          "AMap.Scale",
          "AMap.ToolBar",
          "AMap.ControlBar",
          "AMap.Geocoder",
          "AMap.Marker",
          "AMap.AutoComplete",
          "AMap.DistrictSearch",
        ],
        () => {
          if (localStorage.getItem("mask")) {
            let mask = JSON.parse(localStorage.getItem("mask"))
            window.map = new AMap.Map(this.chartId, {
              mask: mask,
              center: [105.166417, 33.798078],
              disableSocket: true,
              viewMode: "2D",
              showLabel: true,
              labelzIndex: 130,
              pitch: 40,
              zoom: this.zoom ? this.zoom : 4,
              zooms: [4, 30],
              mapStyle: "amap://styles/darkblue",
              backgroundColor: "transparent",
            });
            for (var i = 0; i < mask.length; i += 1) {
              new AMap.Polyline({
                path: mask[i],
                strokeColor: "#99ffff",
                strokeWeight: 1,
                map: window.map,
              });
            }

            this.getLoca(window.map);
          } else {
            this.coverup();
          }
        }
      );
    },
    coverup() {
      var opts = {
        subdistrict: 0,
        extensions: "all",
        level: "city",
      };
      var district = new AMap.DistrictSearch(opts);
      district.search("中国", (status, result) => {
        var bounds = result.districtList[0].boundaries;
        var mask = [];

        for (var i = 0; i < bounds.length; i += 1) {
          mask.push([bounds[i]]);
        }
        localStorage.setItem("mask", JSON.stringify(mask));
        window.map = new AMap.Map(this.chartId, {
          mask: mask,
          center: [105.166417, 33.798078],
          disableSocket: true,
          viewMode: "2D",
          showLabel: true,
          labelzIndex: 130,
          pitch: 40,
          zoom: this.zoom ? this.zoom : 4,
          zooms: [4, 30],
          mapStyle: "amap://styles/darkblue",
          backgroundColor: "transparent",
        });

        //添加描边
        for (var i = 0; i < mask.length; i += 1) {
          new AMap.Polyline({
            path: mask[i],
            strokeColor: "#99ffff",
            strokeWeight: 1,
            map: window.map,
          });
        }

        this.getLoca(window.map);
      });
    },
    getLoca(map) {
      var loca = new Loca.Container({
        map,
      });
      var geo = new Loca.GeoJSONSource({
        data: {
          type: "FeatureCollection",
          features: this.chartOption.data,
        },
      });
      // if (this.type == 1) {
      //   var labelsLayer = (window.labelsLayer = new Loca.ScatterLayer({
      //     zIndex: 10,
      //     // blend: 'lighter',
      //   }));
      //   var style = {
      //     // radius: 3.5,
      //     unit: 'px',
      //     unit: 'px',
      //     size: [50, 50],
      //     texture: 'https://a.amap.com/Loca/static/loca-v2/demos/images/breath_red.png',
      //     animate: true,
      //     duration: 1000,
      //     // color: (index, feat) => {
      //     //   return feat.properties.type == 0
      //     //     ? '#2EEFB5'
      //     //     : feat.properties.type == 1
      //     //       ? "#29ABE5"
      //     //       : feat.properties.type == 2
      //     //         ? '#F1792F'
      //     //         : '#2A1CE6'
      //     // },
      //     borderWidth: 1,
      //     blurWidth: 3.5,
      //     extData: (index, feat) => {
      //       return feat.properties;
      //     },
      //   }
      //   labelsLayer.setSource(geo);
      //   labelsLayer.setStyle(style);



      // } else {
      console.log(555,this.chartOption.data)
        var labelsLayer = (window.labelsLayer = new Loca.LabelsLayer({
          zooms: [4,5],
          zIndex :1000000,
          visible: true,
    collision: true,
    allowCollision: true,
          // collision: true, //该层内标注是否避让
          // allowCollision: true, //不同标注层之间是否避让
        }));
        labelsLayer.setSource(geo);
        labelsLayer.setStyle({
          icon: {
            type: "image",
            image: (index, feat) => {
              return feat.properties.type == 0
                ? icon1
                : feat.properties.type == 1
                  ? icon2
                  : feat.properties.type == 2
                    ? icon3
                    : icon4;
            },
            size: [15, 15],
         
            
          },
          offset: [0, 0],
          extData: (index, feat) => {
            return feat.properties;
          },
        });
      // }
    





      loca.add(labelsLayer);

      console.log(555,labelsLayer)
      labelsLayer.on("complete", () => {
        var normalMarker = new AMap.Marker({
          offset: [0, 0],
        });
        console.log(5555,labelsLayer)
        var labelMarkers = labelsLayer.getLabelsLayer().getAllOverlays();
        for (let marker of labelMarkers) {
          // console.log(555,marker.getExtData(),this.chartOption.data)
          marker.on("mouseover", (e) => {
            var position = e.data.data && e.data.data.position;
            if (position) {
              normalMarker.setContent(
                '<div class="amap-info-window" style="display:inline-block;line-height:30px;color:#26FDF0;text-align:center">公司：' +
                marker.getExtData().name +
                "</div>"
              );
              normalMarker.setPosition(position);
              map.add(normalMarker);
            }
          });
        }
      });
    },
  },
};
</script>

<style>
.amap-info-window {
  display: inline-block;

  min-width: 200px;
  font-family: YouSheBiaoTiHei, YouSheBiaoTiHei;
  font-weight: 400;
  font-size: 18px;
  color: #26fdf0;
  line-height: 28px;
  text-align: center;
  position: relative;
}
.amap-info-window::before {
  content: "";
  display: block;
  width: 5px;
  height: 100%;
  background: url(../../../assets/images/numIntelligence/left.png) no-repeat 0 0;
  background-size: 100% 100%;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
}
.amap-info-window::after {
  content: "";
  display: block;
  width: 5px;
  height: 100%;
  background: url(../../../assets/images/numIntelligence/right.png) no-repeat 0
    0;
  background-size: 100% 100%;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}
</style>
<style scoped>
.chart {
  width: 100%;
  height: 100%;
}
.amap-container {
  background-image: none;
  display: inline-block;
}
</style>
