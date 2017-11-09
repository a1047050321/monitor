<template>
<div>
    <div class="content">
        <div class="button">
            <span>报警时间</span>
            <el-time-select
            placeholder="起始时间"
            v-model="startTime"
            :picker-options="{
            start: '08:30',
            step: '00:15',
            end: '18:30'
            }">
            </el-time-select>
            <el-time-select
                placeholder="结束时间"
                v-model="endTime"
                :picker-options="{
                start: '08:30',
                step: '00:15',
                end: '18:30',
                minTime: startTime
                }">
            </el-time-select>
                <el-input class="search" icon="search" placeholder="输入机顶盒序列号、卡号、用户名、社区搜索"></el-input>
                <el-button  type="primary">搜索</el-button>
        </div>
        <div class="table-wrapper">
            <el-table
                ref="singleTable"
                :data="tableData"
                height="40px"
                highlight-current-row
                @cell-click="edital"
                >
                <el-table-column
                type="selection"
                label="全选"
                width="55">
                </el-table-column>
                <el-table-column
                type="index"
                label="序号"
                width="70">
                </el-table-column>
                <el-table-column
                prop="createDate"
                show-overflow-tooltip
                label="报警时间"
                width="170">
                </el-table-column>
                <el-table-column
                prop="alarmTypeName"
                show-overflow-tooltip
                label="报警类型"
                width="120">
                </el-table-column>
                <el-table-column
                prop="name"
                label="报警人"
                show-overflow-tooltip
                width="100">
                </el-table-column>
                <el-table-column
                prop="address"
                show-overflow-tooltip
                label="报警地址"
                width="150">
                </el-table-column>
                <el-table-column
                prop="terminalType"
                show-overflow-tooltip
                label="报警终端类型"
                width="140">
                </el-table-column>
                <el-table-column
                prop="pendDate"
                show-overflow-tooltip
                label="处理时间"
                width="170">
                </el-table-column>
                <el-table-column
                show-overflow-tooltip
                label="监控"
                width="70">
                     <template scope="scope">
                        <div slot="reference" class="name-wrapper" v-show="scope.row.monitor">
                            <router-link :to="{path:'/handlePending',query:{row:JSON.stringify(scope.row)}}"><div class="icon_monitor" style="width:21px;height:21px;"></div></router-link>
                        </div>
                        <div v-show="!scope.row.monitor" style="margin-left:5px;">无</div> 
                    </template>
                </el-table-column>
                <el-table-column
                label="详情">
                    <template scope="scope">
                    <div slot="reference" class="name-wrapper">
                        <i class="el-icon-information"></i>
                    </div>
                </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="block">
                 <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[20, 30, 40]"
                :page-size="pageNum"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
    </el-pagination>
            </div>
        <edital-info v-show="editalInfo" @editalInfo="editalInfoReturn" :row="row" :alarmType="alarmType"></edital-info>
    </div>
</div>
</template>
<script>
import EditalInfo from "./EditalInfo"
    export default{
         props:["alarmType","showType"],
        data(){
            return {
                pageIdx:1,
                currentPage: 1,
                total:1,
                pageNum:20,
                key:1,
                tableData: [],
                cols:[],
                multipleSelection: [],
                startTime:"",
                endTime:"",
                editalInfo:false,
                row:{},
                monitor:1
            }
        },
        methods:{
             getData(){
                var self = this;
                var chnllist = [],
                    playlist = [];
                    self.axios({
                    url:self.$iHomed("api","get_treated"),
                    method:"get",
                    params:{
                        currentPage: self.pageIdx,
                        pageSize:self.pageNum
                    }
                })
                .then((res)=>{
                    var datalist = res.data.data;
                    console.log(datalist.data);
                    for(let i = 0;i < datalist.data.length;i++){
                        datalist.data[i].createDate  = new Date(datalist.data[i].createDate).toLocaleDateString()+" "+new Date(datalist.data[i].createDate).toLocaleTimeString();
                        datalist.data[i].reportDate  = new Date(datalist.data[i].reportDate).toLocaleDateString()+" "+new Date(datalist.data[i].reportDate).toLocaleTimeString();
                        datalist.data[i].pendDate  = new Date(datalist.data[i].pendDate).toLocaleDateString()+" "+new Date(datalist.data[i].pendDate).toLocaleTimeString();
                        if(datalist.data[i].monitor){
                            self.axios({
                                method:"get",
                                url:self.$iHomed("api","paly_token"),
                                params:{
                                    accesstoken:localStorage.getItem("token"),
                                    programid:datalist.data[i].monitor
                                },
                                withCredentials:false
                            }).then((response)=>{
                                console.log(response.data);
                                if(response.data.ret == 0){
                                    // src = "http://httpdvb.slave.homed.me:13164/playurl?accesstoken="+localStorage.getItem("token")+"&protocol=hls&playtype=live&programid="+sele.row.chnlid+"&playtoken="+res.data.play_token;
                                    datalist.data[i].monitorUrl = "http://httpdvb.slave.homed.me:13164/playurl?accesstoken="+localStorage.getItem("token")+"&protocol=hls&playtype=live&programid="+datalist.data[i].monitor+"&playtoken="+response.data.play_token;
                                }
                            })
                        }
                    }
                    self.tableData = datalist.data;
                     console.log(datalist.data);
                    self.total = datalist.total;
                    self.$emit("processed",self.total);
                })
             },
            //显示详情框消息变化
            editalInfoReturn(a){
                this.editalInfo = a;
            },
            //选择显示数量
             handleSizeChange(val) {
                 //看接口最大能获取多少
                this.pageNum = val;
                this.getData();
            },
            //点击第几页
            handleCurrentChange(val) {
                this.pageIdx = val;
                this.getData();
            },
            //多选框
             handleSelectionChange(val) {

             },
             edital(row, column, cell, event){
                if(column.label == "详情"){
                    //弹出详情框 row是当前所在行
                    this.editalInfo = true;
                    this.row = row;
                    this.monitor = row.monitor;
                }
             },
        },
        mounted(){
            this.total = this.tableData.length;
            this.getData();
        },
        components:{
            "edital-info":EditalInfo
        }
    }
</script>
<style scoped>
    
    .el-table,.button{
        margin-top:10px;
    }
     .button .el-input.search{
        display:inline-block;
        height:30px;
        width:400px;
        margin-left:150px;
    }
    .el-table{
        margin-top:10px;
        font-size:12px;
        position:absolute;
        top:90px;
        bottom:40px;
        width:80%;
        overflow-y:scroll;
    }
    .block{
        position:fixed;
        left:350px;
        bottom:40px;
    }
     .el-badge__content.is-fixed {
        position: fixed;
        top: 10px;
        right: 160px;
    -ms-transform: translateY(-50%) translateX(100%);
    transform: translateY(-50%) translateX(100%);
}
div.name-wrapper i{
    color:#20A0ff;
}
.el-select .el-input{
    margin-top:0;
}
.el-button{
        width:88px;
        height:28px;
        line-height:8px;
    }
</style>