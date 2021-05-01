<template>                  
    <div>
        <el-row type="flex" justify="center" :gutter="20">
            <el-col :span="12"><el-input align="right" v-model="searchText" autocomplete="off" minlength="1"></el-input></el-col>
            <el-col :span="2"><el-button @click="search" type="primary" icon="el-icon-search">搜索</el-button></el-col>
            <el-col  align="right" :span="8">
                <el-button style="margin:5px" type="warning" @click="merge">合并</el-button>
                <el-button style="margin-left:5px" type="danger" @click="deleteTag">删除</el-button>
            </el-col>
        </el-row>
        <el-row style="margin-top:30px">
            <el-col> 
                <el-table 
                    :data="pageTagData"
                    @selection-change="handleSelectionChange">
                    <el-table-column
                        type="selection"
                        width="55">
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="名称"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="usedNum"
                        label="使用次数"
                        sortable
                        width="150">
                    </el-table-column>
                    <el-table-column
                        prop="lastActiveTime"
                        label="最近使用时间"
                        sortable
                        >
                        <template slot-scope="scope">
                            <i class="el-icon-time"></i>
                            <span style="margin-left: 10px">{{ scope.row.lastActiveTime.substring(0, 10) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="action"
                        label="操作"
                        width="100"
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
                    @size-change="handleSizeChange"
                    @current-change="setInitPage"
                    :current-page="pageindex"
                    :page-sizes="[5, 7, 10]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="tagList.length"
                    style="text-align:right;margin-top:20px">
                </el-pagination>
            </el-col> 
        </el-row>
        <el-row type="flex" justify="center" align="center">
            <div id="tagInfoChart" :style="{width: '700px', height: '400px'}" >

            </div>
        </el-row>
        <el-dialog title="合并标签" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="目标标签" :label-width="formLabelWidth">
                    <el-input v-model="form.goalTag" autocomplete="off" placeholder="请输入目标标签的名称" minlength="1"></el-input>
                </el-form-item>
                <el-form-item label="操作标签" :label-width="formLabelWidth">
                    <el-input v-model="form.operateTag" autocomplete="off" placeholder="请输入目标标签的名称，标签之间用‘ ’隔开" minlength="1"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="mergeTag">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<style scoped>

</style>

<script>
import axios from 'axios'
export default {
    
    data () {
        return {
            pageindex:1,
            pageSize:7,
            searchText:"",
            multipleSelection: [],    //多选框选择的值
            tagList: [
                {
                    id: 1,
                    name: "tag1",
                    usedNum: 1,
                    lastActiveTime: "2020-01-01"
                },{
                    id: 2,
                    name: "tag2",
                    usedNum: 2,
                    lastActiveTime: "2020-01-02"
                },{
                    id: 3,
                    name: "tag3",
                    usedNum: 3,
                    lastActiveTime: "2020-01-03"
                },{
                    id: 4,
                    name: "tag4",
                    usedNum: 4,
                    lastActiveTime: "2020-01-04"
                },{
                    id: 5,
                    name: "tag5",
                    usedNum: 5,
                    lastActiveTime: "2020-01-05"
                },{
                    id: 6,
                    name: "tag6",
                    usedNum: 6,
                    lastActiveTime: "2020-01-06"
                },{
                    id: 7,
                    name: "tag7",
                    usedNum: 7,
                    lastActiveTime: "2020-01-07"
                },{
                    id: 8,
                    name: "tag8",
                    usedNum: 8,
                    lastActiveTime: "2020-01-08"
                },{
                    id: 9,
                    name: "tag9",
                    usedNum: 9,
                    lastActiveTime: "2020-01-09"
                },{
                    id: 10,
                    name: "tag10",
                    usedNum: 10,
                    lastActiveTime: "2020-01-10"
                },
            ],
            allTagInfo:[],
            pageTagInfo:[],
            pageTagData:[],
            dialogFormVisible: false,
            form: {
                goalTag: '',
                operateTag: '',
                date1: '',
                date2: '',
                delivery: false,
                type: [],
                resource: '',
                desc: ''
            },
            formLabelWidth: '120px',
        
        }
    },
    mounted() {
        var arr = this;
        axios.get('http://localhost:50003/tagPage') .then((res)=>{
            console.log('tagData:', res);
            this.tagList=res.data;
            arr.setInitPage(1);
                    for(let i=0; i<this.tagList.length; ++i){
            var tag = this.tagList[i];
            var temp = [];
            var date = parseInt(tag.lastActiveTime.substring(0,4));
            date += parseInt(tag.lastActiveTime.substring(5,7))/100;
            date += parseInt(tag.lastActiveTime.substring(8,10))/10000;
            temp.push(date);
            temp.push(tag.usedNum);
            this.allTagInfo.push(temp);
        };
        this.setInitPage(1);
        })
    },
    methods: {
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        setInitPage(val)
        {
            this.pageTagData=[];
            this.pageTagInfo=[];
            this.pageindex=val;
            let tagList=this.tagList;
            for(let i=(this.pageindex-1)*this.pageSize;i<this.pageindex*this.pageSize;i++)
            {
                if(i<tagList.length)
                {
                    this.pageTagData.push(this.tagList[i]);
                    this.pageTagInfo.push(this.allTagInfo[i]);
                }
            }
            console.log('pageTagData:', this.pageTagData);
            this.generateTagInfoChart();
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
        merge(){
            if(this.multipleSelection.length<2){
                this.$message('请至少勾选两个标签！');
            }else{
                this.dialogFormVisible = true;
                this.form.goalTag = this.multipleSelection[0].name;
                for (let i = 1; i < this.multipleSelection.length; ++i) {
                    this.form.operateTag += this.multipleSelection[i].name + " ";
                }
                this.form.operateTag = this.form.operateTag.substring(0, this.form.operateTag.length-1);
            }
        },
        mergeTag(){
            this.dialogFormVisible = false;
            var operateTag = this.form.operateTag.split(" ");
            console.log(operateTag);
            let data = {
                goalTag: this.form.goalTag,
                operateTag: operateTag
            };
            axios.post('http://localhost:50003/tag/mergeTag', data, {
                headers: {
                'Content-Type': 'application/json'
                }
            }).then((res)=>{
                var arr = this;
                axios.get('http://localhost:50003/tagPage') .then((res)=>{
                    console.log('tagData:', res);
                    this.tagList=res.data;
                    arr.setInitPage(1);
                    this.$message('合并成功');
                })
            });
            this.form.goalTag = "";
            this.form.operateTag = "";
        },
        deleteTag(){
            console.log('selectionTag:', this.multipleSelection);
            var deleteTagIdList = [];
            this.multipleSelection.forEach(selection => {
                deleteTagIdList.push(selection.id);
            })
            console.log('tagIdList:', deleteTagIdList);
            axios.post('http://localhost:50003/tag/deleteTag',deleteTagIdList,{
                headers: {
                'Content-Type': 'application/json'
                }
            }).then((res)=>{
                var arr = this;
                axios.get('http://localhost:50003/tagPage') .then((res)=>{
                    console.log('tagData:', res);
                    this.tagList=res.data;
                    arr.setInitPage(1);
                })
            });
        },
        generateTagInfoChart(){
            var chartDom = document.getElementById("tagInfoChart");
            var myChart = this.$echarts.init(chartDom);
            var option;

            option = {
    xAxis: {
        scale: true
    },
    yAxis: {
        scale: true
    },
    series: [{
        type: 'effectScatter',
        symbolSize: 20,
        data: this.pageTagInfo,
    }, {
        type: 'scatter',
        data: this.allTagInfo
    }]
};
            
            option && myChart.setOption(option);
        },
        show(row){
            console.log("tag", row);
            this.$router.push({path: "TagInfo", query:{tagName: row.name}});
        }
    }
};
</script>