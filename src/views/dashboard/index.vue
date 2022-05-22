<template>
  <div class="dashboard-container">
    <!-- <div class="dashboard-text">用户名: {{ username }}</div>
    <div class="dashboard-text">身份: <span v-for="role in roles" :key="role">{{ role }}</span></div> -->
    <el-row :gutter="20" style="margin-top:30px;">
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <svg-icon icon-class="people" /> <span>今日使用人次</span>
          </div>
          <div class="component-item">
            <div class="amount"><span>{{ chartData.today_people }}</span></div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <svg-icon icon-class="peoples" /> <span>总注册人数</span>
          </div>
          <div class="component-item">
            <div class="amount"><span>{{ chartData.all_register }}</span></div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <i class="el-icon-magic-stick" /> <span>今日采集新闻数量</span>
          </div>
          <div class="component-item">
            <div class="amount"><span>{{ chartData.collect_news_today }}</span></div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <i class="el-icon-reading" /> <span>今日阅读次数</span>
          </div>
          <div class="component-item">
            <div class="amount"><span>{{ chartData.read_today }}</span></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top:20px;">
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <i class="el-icon-data-line" /> <span>过去15天使用人数</span>
          </div>
          <div class="component-item">
            <div id="chart1" style="width: 100%; height: 350px;"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <i class="el-icon-reading" /> <span>阅读榜</span>
          </div>
          <div class="component-item">
            <div id="chart2" style="width: 100%; height: 350px;"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top:20px;">
      <el-col :span="12">
        <el-card class="box-card">

          <div slot="header" class="clearfix">
            <i class="el-icon-reading" /> <span>最近15天文章采集数量</span>
          </div>
          <div class="component-item">
            <div id="chart3" style="width: 100%; height: 350px;"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">

          <div slot="header" class="clearfix">
            <i class="el-icon-data-analysis" /> <span>接口调用数量</span>
          </div>
          <div class="component-item">
            <div id="chart4" style="width: 100%; height: 350px;"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top:20px;">
      <el-col :span="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <i class="el-icon-receiving" /> <span>文章分布</span>
          </div>
          <div class="component-item">
            <div id="chart5" style="width: 100%; height: 380px;"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import echarts from 'echarts';
import { fetchChartData } from '@/api/home'
let echarts = require('echarts')
const colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83'];
export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'username',
      'roles'
    ])
  },
  data() {
    return {
      chartData: {},
      haveGetData: false,
    }
  },
  watch: {
    haveGetData() {
      this.draw()
    }
  },
  methods: {
    getChartData() {
      fetchChartData().then(response => {
        this.chartData = response['data']
        this.haveGetData = true
      })
    },
    drawChart1() {
      let myChart = echarts.init(document.getElementById('chart1'))
      // 绘制图表

      let data = this.chartData['past_days_people']
      let x = []
      let y = []
      for (let i = 0; i < data.length; i++) {
        x.push(data[i]['date'])
        y.push(data[i]['count'])
      }
      myChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: {
          type: 'category',
          data: x
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '使用人数',
            data: y,
            type: 'line',
            smooth: true
          }
        ],
        grid: {
          left: '5%',
          right: '4%',
          bottom: '3%',
          top: '4%',
          containLabel: true
        },
      });
    },
    drawChart2() {
      let data = this.chartData['most_readings']
      let x = []
      let y = []
      for (let i = 0; i < data.length; i++) {
        x.push(data[i]['title'])
        y.push(data[i]['count'])
      }
      let myChart = echarts.init(document.getElementById('chart2'))
      // 绘制图表
      myChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '5%',
          right: '4%',
          bottom: '3%',
          top: '0%',
          containLabel: true
        },
        yAxis: [
          {
            type: 'category',
            axisLine: { show: false },
            axisLabel: { show: false },
            axisTick: { show: false },
            splitLine: { show: false },
            data: x,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        xAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '阅读数',
            type: 'bar',
            barWidth: 20,
            colorBy: colors,
            label: {
              show: true,
              formatter: '{b}'
            },
            data: y
          }
        ]
      });
    },
    drawChart3() {
      let myChart = echarts.init(document.getElementById('chart3'))
      // 绘制图表

      let data = this.chartData['past_collect']
      let x = []
      let y = []
      for (let i = 0; i < data.length; i++) {
        x.push(data[i]['date'])
        y.push(data[i]['count'])
      }
      myChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: {
          type: 'category',
          data: x
        },
        yAxis: {
          type: 'value'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '4%',
          containLabel: true
        },
        series: [
          {
            name: '采集文章数',
            data: y,
            type: 'line',
            smooth: true
          }
        ]
      });
    },
    drawChart4() {
      let data1 = this.chartData['t2v_use']
      let x = []
      let y1 = []
      for (let i = 0; i < data1.length; i++) {
        x.push(data1[i]['date'])
        y1.push(data1[i]['count'])
      }
      let data2 = this.chartData['v2t_use']
      let y2 = []
      for (let i = 0; i < data2.length; i++) {
        y2.push(data2[i]['count'])
      }
      let data3 = this.chartData['ocr_api']
      let y3 = []
      for (let i = 0; i < data3.length; i++) {
        y3.push(data3[i]['count'])
      }
      let myChart = echarts.init(document.getElementById('chart4'))
      // 绘制图表
      myChart.setOption({
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['文字转语音', '语音转文字', 'OCR图片转文字']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        // toolbox: {
        //   feature: {
        //     saveAsImage: {}
        //   }
        // },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: x
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '文字转语音',
            type: 'line',
            // stack: 'Total',
            data: y1,
          },
          {
            name: '语音转文字',
            type: 'line',
            // stack: 'Total',
            data: y2,
          },
          {
            name: 'OCR图片转文字',
            type: 'line',
            // stack: 'Total',
            data: y3,
          }
        ]
      })
    },
    drawChart5() {
      let myChart = echarts.init(document.getElementById('chart5'))
      let data = this.chartData['arc_cates']
      let x = []
      let y = []
      for (let i = 0; i < data.length; i++) {
        x.push(data[i]['category__name'])
        y.push(data[i]['count'])
      }
      // 绘制图表
      myChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: {
          data: x
        },
        yAxis: {},
        series: [{
          name: '文章数量',
          colorBy: colors,
          type: 'bar',
          data: y
        }],
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '4%',
          containLabel: true
        },
      });
    },
    draw() {
      this.drawChart1();
      this.drawChart2();
      this.drawChart3();
      this.drawChart4();
      this.drawChart5();
    }
  },
  created() {
    this.getChartData()
  },

}
</script>

<style lang="scss" scoped>
.amount {
  text-align: center;
  font-size: 2rem;
}

.dashboard {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
