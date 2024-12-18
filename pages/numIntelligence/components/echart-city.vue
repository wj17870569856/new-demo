<template>
  <div>
    <div id="map" class="chart"></div>
  </div>
</template>

<script>
import icon1 from "../../../assets/images/numIntelligence/icon24.png";
import icon2 from "../../../assets/images/numIntelligence/icon22.png";
import icon3 from "../../../assets/images/numIntelligence/icon21.png";
import icon4 from "../../../assets/images/numIntelligence/icon23.png";
export default {
  name: "mapJson",
  data(){return{
    isShoW:true
  }},
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
  watch: {
    chartOption:{
      handler(newVal, oldVal) {
        //监听info对象变化
        console.log("newVal",newVal)
        this.init()
        //do same things...
      },
      deep: true, //深度监听
      immediate: true 
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
    //   AMap.plugin(
    //   ["AMap.Scale", "AMap.ToolBar", "AMap.ControlBar", 'AMap.Geocoder', 'AMap.Marker', 'AMap.CitySearch', 'AMap.Geolocation', 'AMap.AutoComplete', 'AMap.InfoWindow', 'AMap.DistrictSearch', 'AMap.Object3DLayer', 'AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.OverView', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor', , "AMap.HawkEye", "AMap.MouseTool"],
    //   () => {
       
       

       
    //   }

      
    // );
    this.coverup();
    },
    coverup() {
      // JSAPI 2.0 输入提示插件名称由 AMap.Autocomplete 变更为 AMap.AutoComplete 啦！

      // var opts = {
      //   level: "country", //关键字对应的行政区级别，country 表示国家
      //   subdistrict: 1, //显示下级行政区级数，1表示返回下一级行政区
      //   extensions: "all", //返回行政区边界坐标组等具体信息
      // };
      var opts = {
        subdistrict: 0,
    extensions: 'all',
    level: 'city'

      };
      //利用行政区查询获取边界构建mask路径
      //也可以直接通过经纬度构建mask路径

      var district = new AMap.DistrictSearch(opts);
      console.log("map2", district);
      district.search("赣州市", (status, result) => {
        console.log(111, status,result);
        // return;
        var bounds = result.districtList[0].boundaries;
        // var bounds = geoJson.features;

        var mask = [];
        for (var i = 0; i < bounds.length; i += 1) {
          mask.push([bounds[i]]);
        }
      

         //给地图绘制wall
        //  var object3Dlayer = new AMap.Object3DLayer({ zIndex: 100 });
        // map.add(object3Dlayer);
        // var height = -80000;
        // var color = "#051B3D";
        // var wall = new AMap.Object3D.Wall({
        //   path: bounds,
        //   height: height,
        //   color: color,
        // });
        // wall.transparent = true;
        // object3Dlayer.add(wall);

        // var maskerIn = new AMap.Marker({
        //   position: [116.501415, 39.926055],
        //   map: map,
        // });
        // var maskerOut = new AMap.Marker({
        //   //区域外的不会显示
        //   position: [117.001415, 39.926055],
        //   map: map,
        // });
        //添加高度面
        // var object3Dlayer = new AMap.Object3DLayer({ zIndex: 1 });
        // map.add(object3Dlayer);
        // var height = 30000;
        // var color = "#0088ffcc"; //rgba
        // var wall = new AMap.Object3D.Wall({
        //   path: bounds,
        //   height: height,
        //   color: color,
        // });
        // wall.transparent = true;
        // wall.backOrFront = "both";
        // object3Dlayer.add(wall);
     
        // var imageLayer = new AMap.ImageLayer({
        //   zooms: [6, 20],
        //   // bounds:new AMap.Bounds(bounds),
        //   url:'',
        //   bounds: new AMap.Bounds(
        //     [71.36618,17.363011],
        //     [
        //       137.108368,54.808156]
        //   ),
        //   visible: true
        // });

        var map = new AMap.Map("map", {
          mask: mask,
          center: [105.166417, 33.798078],
          disableSocket: true,
          viewMode: "2D",
          showLabel: true,
          labelzIndex: 130,
          pitch: 40,
          zoom: 9,
          mapStyle: "amap://styles/darkblue",
          backgroundColor: 'transparent',
          // layers:[AMap.createDefaultLayer(), imageLayer]
          // mapStyle: 'amap://styles/grey',
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


        // this.getLoca(map)
      });
    },
    getLoca(map){
      var loca = new Loca.Container({
          map,
        });

        var labelsLayer = (window.labelsLayer = new Loca.LabelsLayer({
          zooms: [6, 20],
        }));
        var geo = new Loca.GeoJSONSource({
          // url: 'https://a.amap.com/Loca/static/loca-v2/demos/mock_data/charging_pile.json',
          data: {
            type: "FeatureCollection",
            features: this.chartOption.data,
          },
        });
     
        labelsLayer.setSource(geo);

        // labelsLayer.setStyle的配置项即AMap.LabelMarker的配置项
        labelsLayer.setStyle({
          icon: {
            type: "image",
            image: (index, feat) => {
                console.log(index,feat.properties.type                )
                return feat.properties.type==0?icon1:feat.properties.type==1?icon2:feat.properties.type==2?icon3:icon4
            },
            size: [15, 15],
            // anchor: "top",
            // offset: [0, 0],
          },
          // text: {
          //   // 每项配置都可使用回调函数来动态配置
          //   content: (index, feat) => {
          //     return feat.properties.name;
          //   },
          //   style: {
          //     fontSize: 8,
          //     fontWeight: "normal",
          //     fillColor: "#26FDF0",
          //     // strokeColor: "#26FDF0",
          //     // strokeWidth: 2,

          //     direction: "bottom",
          //     // offset: [100, -10],
          //   },
          // },
          extData: (index, feat) => {
            return feat.properties;
          },
        });
        loca.add(labelsLayer);
        labelsLayer.on("complete", () => {
          var normalMarker = new AMap.Marker({
            offset: [0, 0],
          });
          var labelMarkers = labelsLayer.getLabelsLayer().getAllOverlays();
          for (let marker of labelMarkers) {
            marker.on("mouseover", (e) => {
              var position = e.data.data && e.data.data.position;
              if (position) {
                normalMarker.setContent(
                  '<div class="amap-info-window" style="width:200px;line-height:30px;background:#fff;color:#333;text-align:center">公司：' +
                    marker.getExtData().name +
                    "</div>"
                );
                normalMarker.setPosition(position);
                map.add(normalMarker);
              }
            });
            // marker.on("mouseout", () => {
            //   map.remove(normalMarker);
            // });
          }
        });
    }
  },
};
</script>

<style scoped>
.chart {
  width: 65.3125rem;
  height: 47.8125rem;
}
.amap-container {
   background-image: none;
}
.amap-info-window{
  width: 300px;
  line-height: 35px;
  background: #fff;
  color: aqua;
  text-align: center;;
}
</style>
