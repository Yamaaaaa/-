 <template>
  <div class="animated fadeIn">
      <el-row v-for="(topicPaperData, index) in topicsPaperData" :key="topicPaperData.topicId" :gutter="20">
          <el-row>
            <el-col :span="18">
                <el-row>
                    <el-table
                        :data="topicsPaperDataPage[index].pageData"
                        :default-sort = "{prop: 'id', order: 'ascending'}"
                        >
                        <el-table-column
                            v-if="false"
                            prop="paperID"
                            label="论文ID"
                            sortable
                            width="100">
                        </el-table-column>
                        <el-table-column
                            prop="paperTitle"
                            label="相关论文标题"
                            width="120"
                            show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column
                            prop="paperBrowse"
                            label="阅读量"
                            sortable
                            width="100">
                        </el-table-column>
                        <el-table-column
                            prop="paperHot"
                            label="热度"
                            sortable
                            width="100">
                        </el-table-column>
                        <el-table-column
                            prop="relateValue"
                            label="相关性"
                            sortable
                            width="100">
                        </el-table-column>
                        <el-table-column
                            prop="paperTopics"
                            label="主题"
                            :filters="topicPaperData.topicSet"
                            :filter-method="filterTag"
                            filter-placement="bottom-end">
                            <template slot-scope="scope">
                                <el-tag v-for="(topic, index) in scope.row.paperTopics" :key="index"
                                    :type="color[topic.paperTopicID]"
                                    disable-transitions>
                                    {{topic.paperTopicName}}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="paperTags"
                            label="标签"
                            :filters="topicPaperData.tagSet"
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
                </el-row>
                    <el-pagination
                        @current-change="setInitPage($event,index)"
                        :current-page="topicsPaperDataPage[index].pageIndex"
                        :page-size = "7"
                        :page-sizes="[7]"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="topicPaperData.paperData.length"
                        style="text-align:right;margin-top:20px">
                    </el-pagination>
            </el-col>
            <el-col :span="6">
                <div :id="topicsTagRelateData[index].topicName" :style="{width: '250px', height: '550px'}" >
                </div>
            </el-col>
          </el-row>
            <el-row>
                <el-divider></el-divider>
            </el-row>
      </el-row>

  </div>
</template>

   
<script>
import axios from 'axios'
    export default {
        data () {
            return {
                color:["", "success", "info", "warning", "danger"],   //调色板
                effect:["dark", "light", "plain"],
                topicsPaperData: [
                    {   
                        topicID:"1",
                        topicName: "topic1", 
                        topicSet:[
                            {text:"topic1", value:"topic1"},
                            {text:"topic2", value:"topic2"},
                            {text:"topic3", value:"topic3"},
                        ],
                        tagSet:[
                            {text:"tag1", value:"tag1"},
                            {text:"tag2", value:"tag2"},
                            {text:"tag3", value:"tag3"},
                        ],                       
                        paperData:[
                            {
                                paperID: 1,
                                paperTitle: "paper1",
                                paperBrowse:1,
                                paperHot: 2,
                                relateValue: 2,
                                paperTopics:[
                                    {paperTopicID: 1, paperTopicName: "topic1"},
                                    {paperTopicID: 2, paperTopicName: "topic1"},
                                    {paperTopicID: 3, paperTopicName: "topic1"},
                                ],
                                paperTags:[
                                    {topicID: 1, tagName: "tag1"},
                                    {topicID: 2, tagName: "tag2"},
                                    {topicID: 3, tagName: "tag3"},
                                ]
                            },{
                                paperID: 2,
                                paperTitle: "paper1",
                                paperBrowse:1,
                                paperHot: 2,
                                relateValue: 2,
                                paperTopics:[
                                    {paperTopicID: 1, paperTopicName: "topic1"},
                                    {paperTopicID: 2, paperTopicName: "topic1"},
                                ],
                                paperTags:[
                                    {topicID: 1, tagName: "tag1"},
                                    {topicID: 2, tagName: "tag2"},
                                    {topicID: 3, tagName: "tag3"},
                                ]
                            },{
                                paperID: 3,
                                paperTitle: "paper1",
                                paperBrowse:1,
                                paperHot: 2,
                                relateValue: 2,
                                paperTopics:[
                                    {paperTopicID: 1, paperTopicName: "topic1"},
                                    {paperTopicID: 2, paperTopicName: "topic1"},
                                    {paperTopicID: 3, paperTopicName: "topic1"},
                                ],
                                paperTags:[
                                    {topicID: 1, tagName: "tag1"},
                                    {topicID: 2, tagName: "tag2"},
                                    {topicID: 3, tagName: "tag3"},
                                ]
                            },{
                                paperID: 3,
                                paperTitle: "paper1",
                                paperBrowse:1,
                                paperHot: 2,
                                relateValue: 2,
                                paperTopics:[
                                    {paperTopicID: 1, paperTopicName: "topic1"},
                                    {paperTopicID: 2, paperTopicName: "topic1"},
                                    {paperTopicID: 3, paperTopicName: "topic1"},
                                ],
                                paperTags:[
                                    {topicID: 1, tagName: "tag1"},
                                    {topicID: 2, tagName: "tag2"},
                                    {topicID: 3, tagName: "tag3"},
                                ]
                            },{
                                paperID: 3,
                                paperTitle: "paper1",
                                paperBrowse:1,
                                paperHot: 2,
                                relateValue: 2,
                                paperTopics:[
                                    {paperTopicID: 1, paperTopicName: "topic1"},
                                    {paperTopicID: 2, paperTopicName: "topic1"},
                                    {paperTopicID: 3, paperTopicName: "topic1"},
                                ],
                                paperTags:[
                                    {topicID: 1, tagName: "tag1"},
                                    {topicID: 2, tagName: "tag2"},
                                    {topicID: 3, tagName: "tag3"},
                                ]
                            },
                        ],                    
                    },
                ],
                topicsPaperDataPage: [
                    {
                        pageIndex: 1,
                        pageData:[],
                        topicFilter:[],
                        tagFilter:[]
                    },
                ],
                topicsTagRelateData:[
                    {
                        topicId: 1,
                        topicName: "topic1",
                        tag: ["tag1", "tag2", "tag3","tag4", "tag5", "tag6"],
                        value: [1, 2, 3, 4, 5,6]
                    },
                ]
        　　}
        },
        mounted(){
            var arr = this;
            
            axios.get('http://localhost:50002/getTopicPaperData') .then((res)=>{
                console.log('topicPaperData:', res);
                this.topicsPaperData=res.data;

                axios.get('http://localhost:50002/getTopicTagData') .then((res)=>{
                    console.log('topicTagData:', res);
                    this.topicsTagRelateData=res.data;
                    this.$nextTick(function () {
                        console.log("topicTagRelateData", this.topicsTagRelateData);
                        this.generateRelateChart();
                    });
                    for(let i=0; i<this.topicsPaperData.length; i++){
                        //生成主题与标签过滤器
                        this.topicsPaperDataPage = [];
                        for(let i=0; i<this.topicsPaperData.length; i++){
                            var pageIndex = 1;
                            var pageData = [];
                            var topicFilter = [];
                            var tagFilter = [];
                            var topicSet = this.topicsPaperData[i].topicSet;
                            for(let j=0; j<topicSet.length; j++){
                                topicFilter.push({text: topicSet[j], value: topicSet[j]})
                            }
                            var tagSet = this.topicsPaperData[i].tagSet;
                            for(let j=0; j<tagSet.length; j++){
                                tagFilter.push({text: tagSet[j], value: tagSet[j]})
                            }
                            this.topicsPaperDataPage.push({
                                pageIndex, pageData, topicFilter, tagFilter
                            });
                            this.setInitPage(1, i);
                            console.log("topicsPaperDataPage: ", this.topicsPaperDataPage);
                        }
                    }
                });

            });
        },
        methods:{
            setInitPage(val, index){
                var pageData=[];
                this.topicsPaperDataPage[index].pageIndex=val;
                let paperList=this.topicsPaperData[index].paperData;
                console.log("value", val);
                console.log("index", index);
                console.log("paperList", paperList);
                for(let i=(val-1)*7;i<val*7;i++)
                {
                    if(i<paperList.length)
                    {
                        console.log("i: ", i);
                        pageData.push(paperList[i]);

                    }
                }
                this.topicsPaperDataPage[index].pageData = pageData;
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
            generateRelateChart(){
                for(let i=0; i<this.topicsTagRelateData.length; i++){
                    console.log("topicName", this.topicsTagRelateData[i].topicName);
                    var chartDom = document.getElementById(this.topicsTagRelateData[i].topicName);
                    var myChart = this.$echarts.init(chartDom);
                    var option;

                    option = {
                        title: {
                            text: this.topicsTagRelateData[i].topicName
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
                            data: this.topicsTagRelateData[i].tag
                        },
                        series: [
                            {
                                name: '2011年',
                                type: 'bar',
                                data: this.topicsTagRelateData[i].value,
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
                }
            },
            show(row){
                console.log("paper", row);
                this.$router.push({path: "PaperInfo", query:{paperId: row.paperId}});
            }
        }
    }
</script>