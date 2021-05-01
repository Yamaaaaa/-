<template>
    <div>
        <el-row type="flex" justify="center" margin-bottom="20px">
            <el-col :span="12"><el-input align="right" v-model="searchText" autocomplete="off" minlength="1"></el-input></el-col>
            <el-col :span="4"><el-button @click="search" type="primary" icon="el-icon-search">搜索</el-button></el-col>
        </el-row>
        <br>
        <el-row>
            <el-table
                :data="paperDataPage"
                :default-sort = "{prop: 'id', order: 'ascending'}"
                >
                <el-table-column
                    prop="paperId"
                    label="论文ID"
                    sortable
                    width="100">
                </el-table-column>
                <el-table-column
                    prop="paperTitle"
                    label="相关论文标题"
                    width="250"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="paperBrowse"
                    label="阅读量"
                    sortable
                    width="150">
                </el-table-column>
                <el-table-column
                    prop="paperHot"
                    label="热度"
                    sortable
                    width="150">
                </el-table-column>
                <el-table-column
                    prop="addTagNum"
                    label="标注次数"
                    width="150">
                </el-table-column>
                <el-table-column
                    prop="paperTopics"
                    label="主题"
                    :filters="paperManageData.topicSet"
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
                    :filters="paperManageData.tagSet"
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
                <el-table-column
                        prop="action"
                        label="操作"
                        width="80"
                        >
                            <template slot-scope="scope">
                            <el-button
                            size="mini"
                            @click="
                            show(scope.row)">查看</el-button>
                        </template>
                    </el-table-column>
            </el-table>
            <el-pagination
                @current-change="setInitPage"
                :current-page="pageIndex"
                :page-size ="7"
                :page-sizes="[7]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="paperManageData.paperManageItemData.length"
                style="text-align:right;margin-top:20px">
            </el-pagination>
        </el-row>
        <el-row>
            <div id="browseChart" :style="{width: '100%', height: '400px'}">

            </div>
        </el-row>
    </div>
</template>

<script>
import axios from 'axios'
  export default {
      
    data() {
      return {
        searchText:"", 
        color:["", "success", "info", "warning", "danger"],
        paperManageData:{
            topicSet:[],
            tagSet:[],
            paperManageItemData:[
            ],
        },
        allPaperData:{
            topicSet:[],
            tagSet:[],
            paperManageItemData:[
            ],
        },
        searchResult:{
            topicSet:[],
            tagSet:[],
            paperManageItemData:[
            ],
        },
        paperDataPage:[],
        pageIndex: 1,
        xData:[],
        browseData:[],
        hotData: [],
      }
    },
    mounted(){
        axios.get('http://localhost:50002/getPaperManageData') .then((res)=>{
            this.allPaperData = res.data;
            this.paperManageData = this.allPaperData;
            this.setInitPage(1);
            this.chart();
        });

    },
    methods: {
      chart(){
        var chartDom = document.getElementById("browseChart");
        var myChart = this.$echarts.init(chartDom);
        var option;

        option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                data: ['总浏览量', '热度']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: this.xData
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: '总浏览量',
                    type: 'bar',
                    stack: '点击量',
                    emphasis: {
                        focus: 'series'
                    },
                    data: this.browseData
                },
                {
                    name: '热度',
                    type: 'bar',
                    stack: '点击量',
                    emphasis: {
                        focus: 'series'
                    },
                    data: this.hotData
                },
            ]
        };

        option && myChart.setOption(option);

      },
      setInitPage(val){
        var pageData=[];
        this.pageIndex=val;
        let paperList=this.paperManageData.paperManageItemData;
        console.log("paperList", this.paperManageData.paperManageItemData.length);
        for(let i=(val-1)*7;i<val*7;i++)
        {
            if(i<paperList.length)
            {
                pageData.push(paperList[i]);
                this.xData.push(paperList[i].paperTitle);
                this.browseData.push(paperList[i].paperBrowse);
                this.hotData.push(paperList[i].paperHot);
            }
        }
        this.paperDataPage = pageData;
      },

      filterTag(value, row) {
        var result = false;
        for(let i=0; i<row.paperTags.length; i++){
            console.log("tag", row.paperTags[i].tagName);
            console.log("same", (row.paperTags[i].tagName === value));
            result = result||(row.paperTags[i].tagName === value);
        }
        return result;
      }, 
      search(){
        var arr = this;
        axios.post('http://localhost:50002/searchPaperForManager', {searchText: this.searchText}) .then((res)=>{
            console.log('paperSearchResult:', res);
            this.searchResult = {},
            this.searchResult=res.data;
            this.paperManageData = this.searchResult;
            arr.setInitPage(1);
        });
      },
      show(row){
            console.log("paper", row);
            this.$router.push({path: "PaperInfo", query:{paperId: row.paperId}});
        }
    }
  }
</script>