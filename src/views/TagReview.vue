<template>
  <div>
    <el-row>
        <el-container style="padding-right:20px;padding-left:20px;">
          <el-main>
              <el-row>
            <div style="margin-left:100px; margin-right:100px">
              <h1 style="text-align: center;">{{paperReviewData[pageIndex].paperTitle}}</h1>
              <br>
              <p style="margin-left:20px; margin-right:20px"><b>摘要：</b>{{paperReviewData[pageIndex].paperAbstract}}</p>
            </div>
              </el-row>
          </el-main>
          <el-aside width="250px" height="700px" style="padding-right:5px;padding-left:5px;">
              <el-row>
                <el-table
                :data="paperReviewData[pageIndex].uncheckTag"
                @selection-change="handleSelectionChange">
                <el-table-column
                    type="selection"
                    width="50">
                </el-table-column>
                <el-table-column
                    prop="tagName"
                    label="待审核标签"
                    width="150">
                    
                </el-table-column>
                <el-table-column
                    width="40">
                    <template slot="header">
                    <el-row type="flex" justify="end">
                        <el-button  size="mini" @click="check" type="success" icon="el-icon-check" circle></el-button>
                    </el-row>
                    </template>
                </el-table-column>
                </el-table>
              </el-row>
          

          </el-aside>
        </el-container>
    </el-row>
    <el-row type="flex" justify="center" align="center">
        <el-col>
            <div id="tagRankChart" :style="{width: '50%', height: '200px'}" style="padding-right:50px;padding-left:50px;">
            </div>
        </el-col>
        <el-col>
            <div id="topicRankChart" :style="{width: '50%', height: '200px'}" style="padding-right:50px;padding-left:50px;">
            </div>
        </el-col>
    </el-row>
    <el-row type="flex" justify="center" align="center">
        <el-col>
            <div id="relateRankChart" :style="{width: '90%', height: '300px'}">
            </div>
        </el-col>
    </el-row>
    <el-pagination
        @current-change="setInitPage"
        :current-page="pageNum"
        :page-size="1"
        layout="total, prev, pager, next, jumper"
        :total="paperReviewData.length"
        style="text-align:right;margin-top:20px">
    </el-pagination>
  </div>
</template>

   
<script>
import axios from 'axios'
  export default {
    data () {
      return {
        pageNum:1,
        pageIndex: 0,
        paperReviewData:[
          {
            paperId:1,
            paperTitle:"paperTitle",
            paperAbstract: "paperAbstract",
            uncheckTag:[
              {tagName: "tag1"},
              {tagName: "tag2"},
              {tagName: "tag3"},
            ],
            paperTopicRankData:{
              topicsName:[],
              topicsRelate:[]
            },
            paperTagRankData:{
              topicsName: [],
              topicsRelate:[]
            },
            topicTagRelateData:[
              {
                topics: [],
                tags:[],
                values:[
                  [],

                ]
              },

            ]
          },
        ],

        multipleSelection:[],

    　}
    },
    mounted() {
      axios.get('http://localhost:50002/getPaperReviewData') .then((res)=>{
        this.paperReviewData = res.data;
        
        this.$nextTick(function () {
            console.log("topicTagRelateData", this.paperReviewData);
            this.setInitPage(1);
        });

      });
      //获取论文与主题相关信息

    },
    methods: {
      check(){
        console.log("selectedTag", this.multipleSelection);
        console.log("uncheckTag", this.paperReviewData[this.pageIndex].uncheckTag);
        axios.post('http://localhost:50003/checkTagPaper', {
            paperId: this.paperReviewData[this.pageIndex].paperId,
            tags: this.multipleSelection
        }).then((res)=>{
            if(this.multipleSelection.length == this.paperReviewData[this.pageIndex].uncheckTag.length){
                this.paperReviewData.splice(this.pageIndex, 1);
                //this.setInitPage(this.pageIndex);
            }else{
                for(let i=0; i<this.multipleSelection.length; ++i){
                    let index = this.paperReviewData[this.pageIndex].uncheckTag.indexOf(this.multipleSelection[i]);
                    this.paperReviewData[this.pageIndex].uncheckTag.splice(index, 1);
                }
            }
            let tags = "";
            for(let i=0; i<this.multipleSelection.length; ++i){
                tags = tags + this.multipleSelection[i].tagName + " ";
            }
            this.$message("标签: " + tags + "已审核通过");
        });
      },
      setInitPage(val)
      {
          this.pageNum = val;
          this.pageIndex = val -1;
            this.generateTagRankData();
            this.generateTopicRankData();
            this.generateTopicTagChart();
      },
      generateTopicRankData(){
        //console.log("topicName", this.topicsTagRelateData[i].topicName);
        var chartDom = document.getElementById("topicRankChart");
        var myChart = this.$echarts.init(chartDom);
        var option;
        console.log("topicRankData", this.paperReviewData[this.pageIndex].paperTopicRankData);
        option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                boundaryGap: [0, 0.01]
            },
            yAxis: {
                type: 'category',
                data: this.paperReviewData[this.pageIndex].paperTopicRankData.topicsName
            },
            series: [
                {
                    name: '2011年',
                    type: 'bar',
                    data: this.paperReviewData[this.pageIndex].paperTopicRankData.topicsRelate,
                    itemStyle: {
                        normal: {
                            color: '#FD6B71',//设置柱子颜色
                            label: {
                                textStyle: {
                                    color: '#FD6B71'//值得颜色
                                }
                            }
                        }
                    },
                },
            ]
        };
        
        option && myChart.setOption(option);
      },
      generateTagRankData(){
        //console.log("topicName", this.topicsTagRelateData[i].topicName);
        var chartDom = document.getElementById("tagRankChart");
        var myChart = this.$echarts.init(chartDom);
        var option;
        console.log("tagRankData", this.paperReviewData[this.pageIndex].paperTagRankData);
        option = {
            legend:{
                data:this.paperReviewData[this.pageIndex].paperTagRankData.topicsName
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                boundaryGap: [0, 0.01]
            },
            yAxis: {
                type: 'category',
                data: this.paperReviewData[this.pageIndex].paperTagRankData.topicsName
            },
            series: [
                {
                    name: '2011年',
                    type: 'bar',
                    data: this.paperReviewData[this.pageIndex].paperTagRankData.topicsRelate,
                    itemStyle: {
                        normal: {
                            color: '#FD6B71',//设置柱子颜色
                            label: {
                                textStyle: {
                                    color: '#FD6B71'//值得颜色
                                }
                            }
                        }
                    },
                },
            ]
        };
        
        option && myChart.setOption(option);
      },

      generateTopicTagChart(){
        var chartDom = document.getElementById('relateRankChart');
        var myChart = this.$echarts.init(chartDom);
        var option;
        console.log("tagRankData", this.paperReviewData[this.pageIndex].topicTagRelateData);
        var app = {};
        var posList = [
            'left', 'right', 'top', 'bottom',
            'inside',
            'insideTop', 'insideLeft', 'insideRight', 'insideBottom',
            'insideTopLeft', 'insideTopRight', 'insideBottomLeft', 'insideBottomRight'
        ];

        app.configParameters = {
            rotate: {
                min: -90,
                max: 90
            },
            align: {
                options: {
                    left: 'left',
                    center: 'center',
                    right: 'right'
                }
            },
            verticalAlign: {
                options: {
                    top: 'top',
                    middle: 'middle',
                    bottom: 'bottom'
                }
            },
            position: {
                options: posList.reduce(function (map, pos) {
                    map[pos] = pos;
                    return map;
                }, {})
            },
            distance: {
                min: 0,
                max: 100
            }
        };

        app.config = {
            rotate: 90,
            align: 'left',
            verticalAlign: 'middle',
            position: 'insideBottom',
            distance: 15,
            onChange: function () {
                var labelOption = {
                    normal: {
                        rotate: app.config.rotate,
                        align: app.config.align,
                        verticalAlign: app.config.verticalAlign,
                        position: app.config.position,
                        distance: app.config.distance
                    }
                };
                myChart.setOption({
                    series: [{
                        label: labelOption
                    }, {
                        label: labelOption
                    }, {
                        label: labelOption
                    }, {
                        label: labelOption
                    }]
                });
            }
        };


        var labelOption = {
            show: true,
            position: app.config.position,
            distance: app.config.distance,
            align: app.config.align,
            verticalAlign: app.config.verticalAlign,
            rotate: app.config.rotate,
            formatter: '{c}  {name|{a}}',
            fontSize: 16,
            rich: {
                name: {
                }
            }
        };

        option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: this.paperReviewData[this.pageIndex].topicTagRelateData.tags
            },
            toolbox: {
                show: true,
                orient: 'vertical',
                left: 'right',
                top: 'center',
                feature: {
                    mark: {show: true},
                    dataView: {show: true, readOnly: false},
                    magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                    restore: {show: true},
                    saveAsImage: {show: true}
                }
            },
            xAxis: [
                {
                    type: 'category',
                    axisTick: {show: false},
                    data: this.paperReviewData[this.pageIndex].topicTagRelateData.topics
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
            ]
        };

        for(let i=0; i<this.paperReviewData[this.pageIndex].topicTagRelateData.tags.length; ++i){
            option.series.push({
                name: this.paperReviewData[this.pageIndex].topicTagRelateData.tags[i],
                type: 'bar',
                barGap: 0,
                label: labelOption,
                emphasis: {
                    focus: 'series'
                },
                data:this.paperReviewData[this.pageIndex].topicTagRelateData.values[i]
            });
        }
        console.log("seriesSize", option.series.length);

        
        option && myChart.setOption(option);

      },
      handleSelectionChange(val) {
            this.multipleSelection = val;
      },
    }
  }
</script>