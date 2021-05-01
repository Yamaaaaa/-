<template>
  <div>
      <el-row>
        <el-container>
            <el-aside width="200px">
                <el-menu :default-openeds="['1']">
                    <!-- <el-submenu index="1">
                        <template slot="title"><i class="el-icon-s-flag"></i>相关主题</template>
                        <el-submenu  v-for="(topic) in relateTopic" :key="topic.topicName" v-bind:item="topic" :index="topic.topicName">
                            <template slot="title">{{topic.topicName}}</template>
                            
                            <el-menu-item v-for="tag in topic.tagOfTopic" :key="tag.tagName">{{tag.tagName}}</el-menu-item>
                        </el-submenu>
                    </el-submenu> -->
                    <el-submenu index="1">
                        <template slot="title"><i class="el-icon-menu"></i>同义词</template>
                        <el-menu-item v-for="tag in tagManageData.sameTag" :key="tag" :index="tag">{{tag}}</el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-container>
                <!-- <el-header>
                    <el-row type="flex" justify="center">
                        <el-col :span="12"><el-input align="right" v-model="searchText" autocomplete="off" minlength="1"></el-input></el-col>
                        <el-col :span="4"><el-button @click="search" type="primary" icon="el-icon-search">搜索</el-button></el-col>
                    </el-row>
                </el-header> -->
                <el-main>
                    <el-row>
                        <el-table
                        :data="tagPaperPage"
                        >
                            <el-table-column
                                v-if="false"
                                prop="paperId"
                                label="论文ID"
                                width="80">
                            </el-table-column>
                            <el-table-column
                                prop="paperTitle"
                                label="相关论文标题"
                                show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                                prop="browseNum"
                                label="阅读量"
                                width="100">
                            </el-table-column>
                            <el-table-column
                                prop="paperHot"
                                label="热度"
                                width="100">
                            </el-table-column>
                            <el-table-column
                                prop="paperTopics"
                                label="主题"
                                :filters="tagManageData.paperManageData.topicSet"
                                :filter-method="filterTag"
                                filter-placement="bottom-end">
                                <template slot-scope="scope">
                                    <el-tag v-for="(topic, index) in scope.row.paperTopics" :key="index"
                                        :type="color[index]"
                                        disable-transitions>
                                        {{topic.paperTopicName}}
                                    </el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="paperTags"
                                label="标签"
                                :filters="tagManageData.paperManageData.tagSet"
                                :filter-method="filterTag"
                                filter-placement="bottom-end">
                                <template slot-scope="scope">
                                    <el-tag v-for="tag in scope.row.paperTags" :key="tag.tagName"
                                    :type="color[tag.topicID]"
                                    disable-transitions>
                                    {{tag.tagName}}
                                    </el-tag>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-row>
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="setInitPage"
                        :current-page="pageindex"
                        :page-sizes="[5, 7, 10]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="tagManageData.paperManageData.paperManageItemData.length"
                        style="text-align:right;margin-top:20px">
                    </el-pagination>
                </el-main>
            </el-container>
        </el-container>
      </el-row>
            <el-row type="flex" justify="center" align="center">
        <el-col>
            <div id="activeChart" :style="{width: '100%', height: '300px'}">
            </div>
        </el-col>
    </el-row>
  </div>
</template>

<style>
  .el-header, .el-footer {
    text-align: center;
    line-height: 60px;
  }
  /* .el-main{
    line-height: 100vh;
  } */
  .el-aside {
    text-align: center;
  }
</style>

<script>
import axios from 'axios'
    export default {
        data () {
            return {
                color:["", "success", "info", "warning", "danger"],
                tagName: this.$route.query.tagName,
                pageindex:1,
                pageSize:7,
                searchText:"",
                tagManageData:{
                    sameTag:[],
                    tagUsedData:{
                        lastCalender:[],
                        lastUsedNum:[]
                    },
                    paperManageData:{
                        topicSet:[],
                        tagSet:[],
                        paperManageItemData:[
                        ],
                    }
                },
                tagPaperPage:[],
                maxUsedNum:100,
        　　}
        },
        mounted() {
            var arr = this;
            axios.post('http://localhost:50002/getTagManageData?',{tagName: this.tagName}) .then((res)=>{
                console.log('tagData:', res.data);
                this.tagManageData=res.data;
                arr.setInitPage(1);
                this.generateActiveChart();
            })
        },
        methods: {
            generateActiveChart() {
                var chartDom = document.getElementById('activeChart');
                var myChart = this.$echarts.init(chartDom);
                var option;
                option = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            crossStyle: {
                                color: '#999'
                            }
                        }
                    },
                    toolbox: {
                        feature: {
                            dataView: {show: true, readOnly: false},
                            magicType: {show: true, type: ['line', 'bar']},
                            restore: {show: true},
                            saveAsImage: {show: true}
                        }
                    },
                    // legend: {
                    //     data: ['蒸发量', '降水量', '平均温度']
                    // },
                    xAxis: [
                        {
                            type: 'category',
                            data: this.tagManageData.tagUsedData.lastCalender,
                            axisPointer: {
                                type: 'shadow'
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name: '使用次数',
                            interval: 50,
                            axisLabel: {
                                formatter: '{value} 次'
                            }
                        },
                    ],
                    series: [
                        {
                            name: '使用次数',
                            type: 'bar',
                            data: this.tagManageData.tagUsedData.lastUsedNum,
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
                        {
                            name: '使用次数',
                            type: 'line',
                            data: this.tagManageData.tagUsedData.lastUsedNum,
                            itemStyle: {
                                normal: {
                                    color: '#61a0a8',//设置柱子颜色
                                    label: {
                                        show: true,//柱子上显示值
                                        position: 'top',//值在柱子上方显示
                                        textStyle: {
                                            color: '#FD6B71'//值得颜色
                                        }
                                    }
                                }
                            },
                        }
                    ]
                };
                option && myChart.setOption(option);
                window.onresize = function(){
                    myChart.resize();
                    //myChart1.resize();    //若有多个图表变动，可多写
                }
            },
            setInitPage(val)
            {
                this.tagPaperPage=[];
                this.pageindex=val;
                for(let i=(this.pageindex-1)*this.pageSize;i<this.pageindex*this.pageSize;i++)
                {
                    if(i<this.tagManageData.paperManageData.paperManageItemData.length)
                    {
                        this.tagPaperPage.push(this.tagManageData.paperManageData.paperManageItemData[i]);
                    }
                }
            },
            handleSizeChange(val){
                this.pageSize = val;
                this.setInitPage(this.pageindex);
            },
            search(){
                var arr = this;
                axios.get('http://localhost:50003/searchTag?searchText='+this.searchText) .then((res)=>{
                    console.log('tagSearchResult:', res);
                    this.tagList=res.data;
                    arr.setInitPage(1);
                });
            },
            filterTag(value, row) {
                console.log("selectTag", value);
                
                var result = false;
                for(let i=0; i<row.paperTags.length; i++){
                    console.log("tag", row.paperTags[i].tagName);
                    console.log("same", (row.paperTags[i].tagName === value));
                    result = result||(row.paperTags[i].tagName === value);
                }
                return result;
            },
        }
    }
</script>