<template>
<div>
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
        <el-input class="search" icon="search" @keyup.enter="search" placeholder="输入机顶盒序列号、卡号、用户名、社区搜索"></el-input>
        <el-button  type="primary">搜索</el-button>
    </div>
    <div class="table-wrapper">
        <el-table
            ref="singleTable"
            :data="tableData"
            height="40px"
            highlight-current-row
            @cell-click="edital"
            @row-dblclick="dblClick"
            @cell-mouse-leave="mouseRemove"
            @selection-change="handleSelectionChange"
            style="width:1150px;text-align
            :left;">
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
            label="报警时间"
            width="180">
            {{tableData[i]}}
            </el-table-column>
            <el-table-column
            prop="alarmTypeName"
            label="报警类型"
            width="150">
            <template scope="scope">
                <span @dblclick="dblClick" v-if="editeFlag">{{scope.row.alarmTypeName}}</span>
                  <el-select v-model="scope.row.alarmTypeId" @change="keyDown" v-if="!editeFlag" :value="scope.row.alarmTypeId"  @blur="save" placeholder="选择报警类型" style="width:80%;margin-left:0;">
                    <el-option
                    v-for="item in alarmType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
            </el-select>  
            </template>
            </el-table-column>
            <el-table-column
            prop="name"
            label="报警人"
            width="120">
            <template scope="scope">
                <span @dblclick="dblClick" v-if="editeFlag">{{scope.row.name}}</span>
                <el-input v-model="scope.row.name" :value="scope.row.name" @change="keyDown" v-if="!editeFlag" @blur="save" ref="input"></el-input>
             </template>
            </el-table-column>
            <el-table-column
            prop="address"
            label="报警地址"
            width="180">
            </el-table-column>
             <el-table-column
             prop="terminalType"
            label="报警终端类型"
            width="150">
            </el-table-column>
             <el-table-column
            label="监控"
            width="70">
             <template scope="scope">
                        <div slot="reference" class="name-wrapper" v-show="scope.row.monitor!=1">
                            <router-link :to="{path:'/handlePending',query:{row:JSON.stringify(scope.row),type:1}}"><div class="icon_monitor" style="width:21px;height:21px;"></div></router-link>
                        </div>
                    </template>
            </el-table-column>
            <el-table-column
            label="详情"
            width="70">
                <template scope="scope">
                 <div slot="reference" class="name-wrapper">
                    <i class="el-icon-information"></i>
                </div>
            </template>
            </el-table-column>
            <el-table-column
            label="处理">
                <template scope="scope">
                        <div slot="reference" class="name-wrapper" v-show="scope.row.monitor!=1">
                            <router-link :to="{path:'/handlePending',query:{row:JSON.stringify(scope.row)}}"><i class="el-icon-edit" ></i></router-link>
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
    <monitor-info :moniInfoShow="moniInfoShow" :multipleSelection="clickRow" :alarmType="alarmType"></monitor-info>
    <edital-info v-show="editalInfo" @editalInfo="editalInfoReturn" :row="row" :monitor="monitor" :alarmType="alarmType"></edital-info>
</div>
</template>
<script>
import EditalInfo from "./EditalInfo"
import MonitorInfo from "./MonitorInfo"
import bus from "../../assets/js/bus"

    export default{
        props:["alarmType","showType"],
        data(){
            return {
                total:1,
                pageIdx:1,
                currentPage: 1,
                pageNum:20,
                key:1,
                //monitor:0 有监控 1 是没监控
                tableData: [],
                cols:[],
                multipleSelection: [],
                startTime:"",
                endTime:"",
                editalInfo:false,
                row:[],
                moniInfoShow:true,
                i:0,
                monitor:2,
                clickRow:[],
                newAlarm:{},
                playtoken:null,
                editeFlag:true,
                changeRow:{},
                flag:false,
                temp:false
            }
        },
        methods:{
            getData(){
                var self = this;
                var chnllist = [],
                    playlist = [];
                    self.axios({
                    url:self.$iHomed("api","get_untreated"),
                    method:"get",
                    params:{
                        currentPage: self.pageIdx,
                        pageSize:self.pageNum
                    }
                })
                .then((res)=>{
                    console.log(res);
                     for(let i = 0;i < res.data.data.data.length;i++){
                         var datalist = res.data.data.data;
                        datalist[i].createDate  = new Date(datalist[i].createDate).toLocaleDateString()+" "+new Date(datalist[i].createDate).toLocaleTimeString();
                        datalist[i].reportDate  = new Date(datalist[i].reportDate).toLocaleDateString()+" "+new Date(datalist[i].reportDate).toLocaleTimeString();
                         //获取playtoken
                    self.$http({
                        url:self.$iHomed("api","monitor_channel"),
                        type:"get",
                        data:{
                            "accesstoken":"TOKEN50304500",
                            }
                    }).then((resp)=>{
                        chnllist = resp.chnllist;
                        // console.log(chnllist);
                        self.axios({
                            method:"get",
                            url:self.$iHomed("api","paly_token"),
                            params:{
                                programid:chnllist[i].chnlid
                            },
                            withCredentials:false
                        }).then((response)=>{
                            if(chnllist[i].demandurl[0]){
                                var url = chnllist[i].demandurl[0]+"?accesstoken=R59BF1B8DU5095D023KB2D06C01I6E11A8C0P0MF442CWDB1B92433D1&protocol=hls&playtype=live&programid="+chnllist[i].chnlid+"&playtoken="+response.data.play_token;
                                datalist[i].demandurl = url;
                            }
                        })
                    })
                }
                    self.tableData =datalist;
                    console.log( datalist );
                    self.total = res.data.data.total;
                    self.$emit("total",self.total);
                })
                .catch((error)=>{
                    //地址错误
                    console.log(error);
                })
                
            },
            //鼠标已出单元格 取消编辑模式
            mouseRemove(row, column, cell, event){
                this.editeFlag = true;
            },
             keyDown(){
                this.flag = true;
            },
             //表双击可编辑
            dblClick(row,event){
                console.log(row);
                 this.editeFlag = false;
                 this.changRow = row;
            },
            //失去焦点
            save: function (row) {
                this.editing = false;
                this.editeFlag= true;
                var self = this;
                if(self.flag){
                    self.flag = false;
                    self.axios({
                        method:"put",
                        url:self.$iHomed("api","change_untreated")+this.changRow.id+"/detail",
                        data:{
                                "alarmTypeId": self.changRow.alarmTypeId,
                                "name": self.changRow.name
                            }
                        })
                        .then((res)=>{
                            console.log(res);
                            var ret = res.data.data;
                            if(ret){
                                self.$message({
                                    message: '修改成功',
                                    type: 'success'
                                });  
                            }
                            else{
                                self.$alert(res.data.msg);
                            }
                            self.getData();
                        }) 
                 } 
            },
            //显示详情框消息变化
            editalInfoReturn(a,b){
                this.editalInfo = a;
                if(b){
                this.getData();
                bus.$emit("change",true);
                }
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
                this.multipleSelection = val;
                console.log(this.multipleSelection);
                     var length = this.multipleSelection.length;
                    this.clickRow = this.multipleSelection[length-1];
                   
             },
              edital(row, column, cell, event){
                   if(column.label == "详情"){
                        this.monitor=row.monitor;
                        this.editalInfo = true;
                        this.row = row;
                    }
             },
             //回车搜索
             search(){
                 alert("1");
             }
        },
         mounted(){
            this.row =this.tableData[this.i];
            this.getData();
            bus.$on("temp",(a)=>{
                this.temp = a;
                this.getData();
            })
        },
        components:{
            "monitor-info":MonitorInfo,
            "edital-info":EditalInfo
        }
    }
</script>
<style lang="" scoped>
    body,html{
        height:100%;
        overflow:hidden;
    }
    div.block{
        height:40px;
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
        overflow-y:scroll;
    }
    .block{
        position:fixed;
        left:350px;
        bottom:40px;
    }
    .el-badge.item{
        margin-top:0;
    }
    .el-badge__content.is-fixed {
        position: absolute;
        top: 20px;
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