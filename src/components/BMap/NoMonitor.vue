<template>
<div class="body">    
    <div class="mask"></div>
     <!--li点击后显示的框-->
        <div class="opeatorLi">
        <!--致电-->
        <div class="callLi" v-if="mode==1">
            <h2 class="title">核实报警</h2>
            <p>报警人:{{row.name}}</p>
            <p>电话:{{row.mobileId}}</p>
            <div class="button" style="text-align:center;margin-top:20px;">
                <el-button type="primary"  @click="cancel">确定</el-button>
            </div>
        </div>
        <!--上报-->
        <div class="callLi" v-if="mode==2">
            <h2 class="title">上报理由</h2>
        <el-input type="textarea" placeholder="上报理由(必填)" v-model="remark"></el-input>
            <div class="button" style="text-align:center;magin-top:20px;">
                <el-button type="primary"  @click="confirm">确定</el-button>
                <el-button @click="cancel">取消</el-button>
            </div>
        </div>
        <!--提交-->
        <div class="callLi" v-if="mode==3">
            <h2 class="title">提交确认</h2>
            <el-input type="textarea" placeholder="备注（选填）"></el-input>
            <div class="button" style="text-align:center;magin-top:20px;">
                <el-button type="primary"  @click="confirm">提交</el-button>
                <el-button @click="cancel">取消</el-button>
                </div>
        </div>
        <!--结束-->
        <div class="callLi" v-if="mode==4">
         <h2 class="title">解除确认</h2>
         <div v-if="!row.monitor">
            <p>报警人:{{row.name}}</p>
            <p>电话:{{row.mobileId}}</p>
         </div>
         <div v-if="row.monitor">
            <p>请截图监控画面，确认证明无警情</p>
         </div>
            <div class="button" style="text-align:center;margin-top:40px;">
                <el-button type="primary" @click="confirm">确定</el-button>
                <el-button @click="cancel">取消</el-button>
            </div>
        </div>
        </div>
    </div>
</template>
<script>
    export default{
        props:["mode","row"],
        data(){
            return {
                liClick:false,
                buttonShow:false,
                reportReason:"",
                remark:"",
                pictureUrl:""
            }
        },
        methods:{
            cancel(){
                this.$emit("liClick",this.liClick);
            },
            confirm(){
                var self = this;
                switch(self.mode){
                    case 2:
                    if(!self.remark){
                        self.$alert("请填写上报理由");
                    }
                    else{
                         self.axios({
                            method:"put",
                            url:self.$iHomed("api","put_remark")+self.row.id+"/report",
                            data:{
                                    "alarmId": self.row.id,
                                    "remark": self.remark
                                }
                            })
                            .then((res)=>{
                                var ret = res.data.data;
                                if(ret){
                                    self.$message({
                                        message: '上报成功',
                                        type: 'success'
                                    });
                                    
                                }
                                else{
                                    self.$alert(res.data.msg);
                                }
                            }) 
                        self.$emit("liClick",self.liClick);
                    }
                    break;
                    case 3:
                        self.axios({
                            method:"put",
                            url:self.$iHomed("api","put_remark")+self.row.id+"/submit",
                            })
                            .then((res)=>{
                                var ret = res.data.data;
                                if(ret){
                                    self.$message({
                                        message: '提交成功',
                                        type: 'success'
                                    });
                                    
                                }
                                else{
                                    self.$alert(res.data.msg);
                                }
                            }) 
                        self.$emit("liClick",self.liClick);
                    break;
                    case 4:
                    alert(self.row.monitor);
                        if(!self.row.monitor){

                        }
                        self.$emit("liClick",self.liClick);
                        self.axios({
                            method:"get",
                            url:self.$iHomed("api","get_url"),
                            headers:{
                                "Content-Type": "application/x-www-form-urlencoded"
                            },
                            params:{
                                // accesstoken:localStorage.getItem("token"),
                                accesstoken:"TOKEN50000533",
                                eventid:"4202000807",
                                // eventid:self.row.id,
                                time:self.dateTranslate(new Date(),60)/1000
                            },
                            withCredentials:false
                        }).then((res)=>{
                            if(res.data.ret == 0){
                                self.pictureUrl = res.data.poster_url;
                            }
                            self.axios({
                                method:"put",
                                url:self.$iHomed("api","put_remark")+self.row.id+"/relieve",
                                data:{
                                    "alarmId": self.row.id,
                                    "image": self.pictureUrl
                                    }
                                }).then((response)=>{
                                console.log(response);
                                self.$emit("buttonShow",self.buttonShow);
                            })
                        }).catch((err)=>{
                            console.log(err);
                        })
                    break;
                }
            }
        }
    }
</script>
<style scoped>
.opeatorLi{
    position:fixed;
    top:200px;
    left:600px;
    width:300px;
    height:180px;
    z-index:99;    
    background:#fff;
}
.callLi p{
    text-align:center;
    margin-top:10px;
    color:#666;
}
.callLi .el-textarea{
    margin-bottom:20px;
    width:90%;
    margin-left:5%;
}
.title{
     width:100%;
        height:40px;
        margin-bottom:10px;
        line-height:40px;
        text-align:center;
        background:#20A0FF;
        color:#fff;
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
    .el-button{
        width:88px;
        height:28px;
        line-height:8px;
    }
</style>