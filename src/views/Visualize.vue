<template>
  <div>
    <navbar />
    <div class="container" id="echarts-container" style="min-height: 100vh"></div>
  </div>
</template>

<script>
import { getTree } from "@/api/api";
import navbar from "./Navbar.vue";
import * as echarts from "echarts";
export default {
  data() {
    return {
      myChart: "",
      option: {
        tooltip: {
          trigger: "item",
          enterable:true,
          triggerOn: "mousemove",
          show:true,
          formatter: function (params) {
            console.log(params);
            if(params.data.level == 1){
              return `<div style="text-align:left; ">
                <div >Doc Name:<span style="margin-left: 4px;font-weight: bold;">${params.data.name}</span> </div>
                <div><a style="margin-top:8px;" href="${params.data.value}">link</a></div>
                </div>`;
            } else if(params.data.level == 2){
              return `<div style="text-align:left; ">
                <div >Section Name:<span style="margin-left: 4px;font-weight: bold;">${params.data.name}</span> </div>
                <div><a style="margin-top:8px;" href="${params.data.value}">link</a></div>
                </div>`;
            }
          }
        },
        series: [
          {
            type: "tree",
            data: [],
            top: "1%",
            left: "7%",
            bottom: "1%",
            right: "20%",
            symbolSize: 7,
            label: {
              position: "left",
              verticalAlign: "middle",
              align: "right",
              fontSize: 9,
            },
            leaves: {
              label: {
                position: "right",
                verticalAlign: "middle",
                align: "left",
              },
            },
            emphasis: {
              focus: "descendant",
            },
            expandAndCollapse: true,
            animationDuration: 550,
            animationDurationUpdate: 750,
          },
        ],
      },
    };
  },
  components: {
    navbar,
  },
  async mounted() {
    let chartDom = document.getElementById("echarts-container");
    this.myChart = echarts.init(chartDom);
    this.loadData();
  },
  beforeDestroy() { },
  methods: {
    loadData: function () {
      this.myChart.showLoading();
      getTree().then(res => {
        try {
          let treeData = JSON.parse(res.data);
          treeData.children.forEach(function (item, index) {
            item.collapsed = index != 0;
            item.level = 1;
            index !== 0 && (item.collapsed = true);
            if (item.children) {
              item.children.forEach(function (datum, index) {
                datum.level = 2;
              });
            }
          });
          this.option.series[0].data = [treeData];
          this.myChart.setOption(this.option);
          this.myChart.hideLoading();
        } catch (error) {
          console.error(error);
          this.$Message.error("parse tree data failed");
          this.myChart.hideLoading();
        }

      }).catch(e => {
        console.error(e);
        this.$Message.error("get tree data failed");
        this.myChart.hideLoading();
      })
    },
  },
};
</script>

<style scoped>
/* @import "@/assets/style.css"; */
</style>
