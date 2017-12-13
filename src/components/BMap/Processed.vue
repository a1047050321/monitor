<template>
<div>
    <div class="content">
        <div class="button">
    <span style="margin-right:8px;">报警时间</span>
      <el-date-picker
        v-model="startTime"
        size="medium"
        type="datetime"
        style="margin-right:4px;
        width:164px;"
        placeholder="选择日期时间">
        </el-date-picker>
        -
        <el-date-picker
        v-model="endTime"
       size="medium"
       style="margin-left:4px;
       width:164px;"
        type="datetime"
        placeholder="选择日期时间">
      </el-date-picker>
      <div class="searchButton">
          <el-input class="search" size="medium"  prefix-icon="el-icon-search" v-model="search_value" @change="valueChange" @keyup.enter.native="search"  placeholder="输入机顶盒序列号、卡号、用户名、社区搜索"></el-input>
          <div style="margin-left:16px;float:right;">
          <el-button  type="primary" size="medium" style="width:90px;"  @click.prevent="search">搜索</el-button>
          </div>
      </div>
    </div>
        <div class="table-wrapper">
            <el-table
                ref="singleTable"
                :data="tableData"
                height="40px"
                size="mini"
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
                width="70"
                >
                </el-table-column>
                <el-table-column
                prop="createDateTran"
                show-overflow-tooltip
                label="报警时间"
                >
                </el-table-column>
                <el-table-column
                prop="alarmTypeName"
                show-overflow-tooltip
                label="报警类型"
                >
                </el-table-column>
                <el-table-column
                prop="name"
                label="报警人"
                align="center"
                header-align="center"
                width="100"
                show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                prop="address"
                show-overflow-tooltip
                label="报警地址"
                >
                </el-table-column>
                <el-table-column
                prop="terminalType"
                show-overflow-tooltip
                label="报警终端类型"
                width="140"
                header-align="center"
                align="center"
                >
                </el-table-column>
                <el-table-column
                prop="pendDate"
                show-overflow-tooltip
                label="处理时间"
                >
                </el-table-column>
                <el-table-column
                show-overflow-tooltip
                 width="70"
                label="监控"
                header-align="center"
                align="center"
                >
                    <template  slot-scope="scope">
                        <div slot="reference" class="name-wrapper" v-show="scope.row.monitor" style="text-align:center;">
                            <router-link :to="{path:'/handlePending',query:{row:JSON.stringify(scope.row),btnS:true,type:1,status:'已处理'}}"><i class="el-icon-view" ></i></router-link>
                        </div>
                        <div v-show="!scope.row.monitor" style="text-align:center;">-</div> 
                    </template>
                </el-table-column>
                <el-table-column
                 width="70"
                 header-align="center"
                align="center"
                label="详情">
                    <template  slot-scope="scope">
                        <div slot="reference" class="name-wrapper" style="text-align:center;">
                            <a href="javascript:void(0)"><i class="el-icon-document"></i></a>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="block">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageIdx"
                :page-sizes="[20, 30, 40]"
                :page-size="pageNum"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>
        <edital-info v-show="editalInfo" @editalInfo="editalInfoReturn" :editSetting="editSetting" :row="row" :alarmType="alarmType"></edital-info>
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
                monitor:1,
                search_value:"",
                editSetting:true
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
                    // console.log(datalist.data);
                    for(let i = 0;i < datalist.data.length;i++){
                        datalist.data[i].createDateTran  = new Date(datalist.data[i].createDate).toLocaleDateString()+" "+new Date(datalist.data[i].createDate).toLocaleTimeString();
                        datalist.data[i].reportDate  = new Date(datalist.data[i].reportDate).toLocaleDateString()+" "+new Date(datalist.data[i].reportDate).toLocaleTimeString();
                        datalist.data[i].pendDate  = new Date(datalist.data[i].pendDate).toLocaleDateString()+" "+new Date(datalist.data[i].pendDate).toLocaleTimeString();
                        // if(datalist.data[i].monitor){
                        //     self.axios({
                        //         method:"get",
                        //         url:self.$iHomed("api","paly_token"),
                        //         params:{
                        //             accesstoken:localStorage.getItem("token"),
                        //             programid:datalist.data[i].monitor
                        //         },
                        //         withCredentials:false
                        //     }).then((response)=>{
                        //         console.log(response.data);
                        //         if(response.data.ret == 0){
                        //             // src = "http://httpdvb.slave.homed.me:13164/playurl?accesstoken="+localStorage.getItem("token")+"&protocol=hls&playtype=live&programid="+sele.row.chnlid+"&playtoken="+res.data.play_token;
                        //             datalist.data[i].monitorUrl = "http://httpdvb.slave.homed.me:13164/playurl?accesstoken="+localStorage.getItem("token")+"&protocol=hls&playtype=live&programid="+datalist.data[i].monitor+"&playtoken="+response.data.play_token;
                        //         }
                        //     })
                        // }
                    }
                    self.tableData = datalist.data;
                     console.log(datalist.data);
                    self.total = datalist.total;
                    self.$emit("processed",self.total);
                })
             },
             valueChange(val){
                if(!val){
                    this.pageIdx = 1;
                    this.getData();
                }
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
                    this.editSetting = true;
                    this.monitor = row.monitor;
                }
             },
             //回车搜索
            search(){
                var self = this;
                self.pageIdx = 1;
                self.tableData = [];
                self.axios({
                    url:self.$iHomed("api","get_untreated"),
                    method:"get",
                    params:{
                        currentPage: self.pageIdx,
                        pageSize:self.pageNum,
                        beginTime:self.dateTranslate(self.startTime),
                        endTime:self.dateTranslate(self.endTime),
                        search:self.search_value
                    }
                })
                .then((res)=>{
                    if(res.data.data.data){
                     for(let i = 0;i < res.data.data.data.length;i++){
                         var datalist = res.data.data.data;
                         console.log(datalist);
                         if(! datalist[i].terminalType){
                             datalist[i].terminalType = "无";
                         }
                        datalist[i].createDateTran  = new Date(datalist[i].createDate).toLocaleDateString()+" "+new Date(datalist[i].createDate).toLocaleTimeString();
                        datalist[i].pendDate  = new Date(datalist[i].pendDate).toLocaleDateString()+" "+new Date(datalist[i].pendDate).toLocaleTimeString();
                        datalist[i].reportDate  = new Date(datalist[i].reportDate).toLocaleDateString()+" "+new Date(datalist[i].reportDate).toLocaleTimeString();
                    }
                    self.tableData =datalist;
                    console.log(self.tableData);
                    }
                    else{
                    self.total = res.data.data.total;
                    self.$emit("processed",self.total);
                    }
                })
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
.button{
        margin:24px 0;
    }
    .button .el-input.search{
        display:inline-block;
        height:30px;
        width:328px;
        margin-left:150px;
    }
    .el-table{
        font-size:12px;
        border:1px solid #dfe6ec;
        border-bottom:none;
        position:absolute;
        top:148px;
        bottom:140px;
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
    .searchButton{
        position:fixed;
        top:88px;
        right:24px;
    }
    table th{
        height:42px;
    }
</style>