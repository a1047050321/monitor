<template>
<div v-if="row">
<div class="mask"></div>
    <div class="editalInfo">
        <div class="title">报警详情</div>
        <div class="table_cell">
            <div><span>报警人：</span><el-input v-model="row.name" style="width:50%;margin-left:25px;" @change="keyDown"></el-input></div>
            <div><span>联系方式：</span><span style="margin-left:20px;">{{row.contact}}</span></div>
            <div><span>报警位置：</span><span style="margin-left:20px;">{{row.address}}</span></div>
            <div><span>报警类型：</span>
                 <el-select v-model="row.alarmTypeId" @change="keyDown" placeholder="选择报警类型" style="width:50%;margin-left:10px;">
                    <el-option
                    v-for="item in alarmType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
            </el-select>  
            </div>
            <div><span>报警时间：</span><span style="margin-left:20px;">{{row.createDate}}</span></div>
            <div><span>报警终端类型：</span><span style="margin-left:20px;">{{row.terminalType}}</span></div>
            <div v-show="!row.monitor"><span>机顶盒序列号：</span><span style="margin-left:20px;">{{row.stbId}}</span></div>
            <div v-show="row.monitor"><span>摄像头序列号：</span>{{row.mobileId}}</span>
                <span class="name-wrapper">
                    <router-link :to="{path:'/handlePending',query:{row:JSON.stringify(row)}}"><div class="icon_monitor" style="width:21px;height:21px;margin-top:15px;margin-left:-5px;"></div></router-link>
                </span>
            </div>
        </div>
         <div class="table_cell">
            <div v-show="row.monitor"><span>机顶盒序列号：</span><span style="margin-left:20px;">{{row.stbId}}</span></div>
            <div><span>处理时间：</span><span style="margin-left:20px;">{{row.pendDate}}</span></div>
            <div><span>资讯栏目id:</span><span style="margin-left:20px;">{{row.pendDate}}</span></div>
            <div><span>处理人：</span><span style="margin-left:20px;">{{row.pendUser}}</span></div>
            <div><span>上报：</span><span style="margin-left:20px;">{{row.state}}</span></div>
            <div><span>上报时间：<span style="margin-left:20px;">{{row.reportDate}}</span></span></div>
            <div><span>解除报警：</span><span style="margin-left:20px;">{{relieve}}</span></div>
         </div>
         <div style="clear:both;"></div>
         <div style="text-align:center;">
         <el-button type="primary" @click="ok">确定</el-button>
         <el-button @click="cancel">取消</el-button>
     </div>
    </div>
</div>
</template>
<script>
    export default{
        props:["row","alarmType"],
        data(){
            return {
                editalInfo:false,
                alarmName:"",
                flag:false,
                _row:{},
                relieve:"否"
            }
        },
        mounted(){
            this._row = $.extend({},this.row);
        },
        watch:{
            row:{
                handler(row,oldRow){
                    if(row){
                        if(!row.relieve){
                            this.relieve = "否";
                        }else{
                            this.relieve = "是";
                        }
                    }
                },
                deep:true
            }
        },
        methods:{
            keyDown(){
                this.flag = true;
            },
            ok(){
                var self = this;
                if(self.flag){
                    self.flag = false;
                    self.axios({
                        method:"put",
                        url:self.$iHomed("api","change_untreated")+this.row.id+"/detail",
                        data:{
                                "alarmTypeId": self.row.alarmTypeId,
                                "name": self.row.name
                            }
                    })
                    .then((res)=>{
                        var ret = res.data.data;
                        if(ret){
                            self.$message({
                                message: '修改成功',
                                type: 'success'
                            });
                            this.$emit("editalInfo",this.editalInfo,true);
                        }
                        else{
                            self.$alert(res.data.msg);
                            this.$emit("editalInfo",this.editalInfo);
                        }
                    }) 
                }
            },
            cancel(){
                this.$emit("editalInfo",this.editalInfo);
            },
        }
    }
</script>
<style scoped>
    .title{
        width:100%;
        height:40px;
        margin-bottom:10px;
        line-height:40px;
        text-align:center;
        background:#20A0FF;
        color:#fff;
    }
    .editalInfo{
        position:fixed;
        top:150px;
        left:500px;
        width:600px;
        height:400px;
        background:#fff;
        z-index:99;
        opacity:1;
    }
    .table_cell{
        float:left;
    }
    .table_cell div:not(.name-wrapper){
        width:250px;
        height:30px;
        line-height:30px;
        margin:0 0 10px 40px;
        font-size:14px;
    }
    .mask{
        position:fixed;
        top:0;
        bottom:0;
        left:0;
        right:0;
        background:#000;
        opacity:0.3;
        z-index:98;
    }
    .name-wrapper{
        width:30px;
    }
    .name-wrapper a{
       display:inline-block;
       width:30px;
       height:30px;
    }
    .el-button{
        width:88px;
        height:28px;
        line-height:8px;
        margin-top:20px;
    }
</style>