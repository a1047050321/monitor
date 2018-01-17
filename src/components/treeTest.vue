<template>
<div>
    <div>测试homed</div>
    <el-input v-model="number" @blur="blur(number)" placeholder="请输入有效手机号"></el-input> 
    <br/>
    <el-input v-model="card"></el-input> 
    <el-button :disabled="right" @click="getNumber">{{timer}}获取验证码</el-button> 
    <br/>
    <el-button type="primary">确定</el-button> 
    <el-button>取消</el-button> 

</div>
</template>
<script>
import md5 from "js-md5"
    export default{
        data(){
            return {
                number:null,
                card:null,
                right:true,
                timer:null,
                interval:{}
            }
        },
        watch:{
            timer(timer){
                if(timer == 0){
                    timer = null;
                }
            }
        },
        mounted(){
            this.getAjax();
        },
        methods:{
            getAjax(){
                var self = this;
                function promiseTest(){
                    var p = new Promise(function(resolve,rejected){
                        self.axios({
                            method:"get",
                            url:self.$iHomed("api","get_treated")
                        }).then((res)=>{
                            var datalist = res.data.data.data,
                            arr = [];
                            for(let i = 0; i < datalist.length;i++){
                                if(datalist[i].monitor){
                                    arr.push(datalist[i].monitor);
                                }else{
                                    arr.push("");
                                }
                            }
                            resolve(arr);
                        })
                    })
                    return p;
                    }
                    promiseTest().then(function(data){
                        console.log(data);
                    })
                },
                blur(e){
                    var pattern = /^1[34578]\d{9}$/;
                    if(pattern.test(e)){
                        this.right = false;
                    }else{
                         this.right = true;
                         this.$alert("输入的手机号不符合标准，请重新输入");
                         this.number = null;
                    }
                },
                getNumber(){
                    this.timer = 60;
                    var that = this;
                    let interval = setInterval(function(){
                        that.timer--;
                        if(that.timer == 0){
                            that.timer = null;
                            this.right = true;
                            window.clearInterval(interval);
                        }
                    },1000)
                }
            },
        }
</script>
<style scoped>
    .el-input{
        width:200px;
        margin-bottom:10px;
        display:inline-block;
    }
</style>