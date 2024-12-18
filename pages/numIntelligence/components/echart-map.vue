<template>
  <div>
    <div id="map" class="chart" :style="{ width: width, height }"></div>
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
  },
  watch: {
    chartOption: {
      handler(newVal, oldVal) {
        //监听info对象变化
        this.init();
        //do same things...
      },
      deep: true, //深度监听
      immediate: true,
    },
  },
  mounted() {
    this.init();
    map.destroy( );
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
          // "AMap.CitySearch",
          // "AMap.Geolocation",
          "AMap.AutoComplete",
          // "AMap.InfoWindow",
          "AMap.DistrictSearch",
          // "AMap.Object3DLayer",
          // "AMap.PlaceSearch",
          // "AMap.OverView",
          // "AMap.MapType",
          // "AMap.PolyEditor",
          // "AMap.CircleEditor",
   
          // "AMap.HawkEye",
          // "AMap.MouseTool",
        ],
        () => {
          this.coverup();
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

        var map = new AMap.Map("map", {
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
        for (var i = 0; i < bounds.length; i += 1) {
          new AMap.Polyline({
            path: bounds[i],
            strokeColor: "#99ffff",
            strokeWeight: 1,
            map: map,
          });
        }

        this.getLoca(map);
      });
    },
    getLoca(map) {
      var loca = new Loca.Container({
        map,
      });

      var labelsLayer = (window.labelsLayer = new Loca.LabelsLayer({
        zooms: [4, 30],
      }));

      
      var geo = new Loca.GeoJSONSource({
        data: {
          type: "FeatureCollection",
          features: this.chartOption.data,
        },
      });

      console.log(888,this.chartOption.data)

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
          // offset: [0, 0],
        },

        // extData: (index, feat) => {
        //   return feat.properties;
        // },
      });
      loca.add(labelsLayer);
      // labelsLayer.on("complete", () => {
      //   var normalMarker = new AMap.Marker({
      //     offset: [0, 0],
      //   });
      //   var labelMarkers = labelsLayer.getLabelsLayer().getAllOverlays();
      //   for (let marker of labelMarkers) {
      //     marker.on("mouseover", (e) => {
      //       var position = e.data.data && e.data.data.position;
      //       if (position) {
      //         normalMarker.setContent(
      //           '<div class="amap-info-window" style="display:inline-block;line-height:30px;color:#26FDF0;text-align:center">公司：' +
      //             marker.getExtData().name +
      //             "</div>"
      //         );
      //         normalMarker.setPosition(position);
      //         map.add(normalMarker);
      //       }
      //     });
      
      //   }
      // });
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
