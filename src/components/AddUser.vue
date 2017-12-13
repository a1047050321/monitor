<template>
<div>
 <div class="nav-wrapper">
                <!-- 面包屑导航路径 -->
                <el-breadcrumb separator=">">
                <el-breadcrumb-item>
                            <router-link to="/userManage">用户管理</router-link>
 / 添加用户</el-breadcrumb-item>
                </el-breadcrumb>
        </div>
<div class="content">
<h1 style="text-align:center;">添加用户</h1>
<el-form :label-position="labelPosition" label-width="80px" :model="form">
  <el-form-item label="开户人">
    <el-input v-model="form.name"></el-input>
  </el-form-item>
  <el-form-item label="账户ID">
    <el-input v-model="form.user_id"></el-input>

  </el-form-item>
  <el-form-item label="用户昵称">
    <el-input v-model="form.nickname"></el-input>
  </el-form-item>
  <el-form-item label="性别">
    <el-input v-model="form.sex"></el-input>
  </el-form-item>
  <el-form-item label="手机号">
    <el-input v-model="form.phone"></el-input>
  </el-form-item>
  <el-form-item label="证件号">
    <el-input v-model="form.cardNum"></el-input>
  </el-form-item>
  <el-form-item label="开户时间">
 <el-date-picker v-model="form.agentTime" type="date" placeholder="选择日期" style="width:300px;">
    </el-date-picker>  
</el-form-item>
   <el-form-item label="总空间">
    <el-select v-model="form.totalSpace" placeholder="请选择空间容量">
      <el-option label="2.0G" value="2.0G"></el-option>
      <el-option label="5.0G" value="5.0G"></el-option>
      <el-option label="10.0G" value="10.0G"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item style="margin-left:180px;">
  <el-button type="primary" style="width:100px;" @click="sumbit">提交</el-button>
  <el-button style="width:100px;" @click="reset">重置</el-button>
<el-button  style="width:100px;">
<router-link to="/userManage">取消</router-link>
</el-button>
</el-form-item>
</el-form>
</div>
</div>
</template>
<script>
    export default {
        props:["addUser"],
        data() {
            return {
                labelPosition: 'right',
                form: {
                name: '',
                user_id: '',
                nickname: '',
                sex:'',
                phone:'',
                cardNum:'',
                agentTime:"",
                totalSpace:"",
                usedSpace:"0G"         
                },
            }
        },
    mounted(){
    },
    methods:{
        //表单提交
        sumbit(){
            let form = this.form,
         	    url = this.$iHomed("api", "user_add"),
                params = form;
                for(let p in form){
                    if(!form[p]){
                        this.$message('信息没有补全哦');
                        return false;
                    }
                }
                this.$http({
                            url:url,
                            type: "POST",
                            data: params
                        })
                        .then((res)=>{
                            console.log(res);
                        })
            
        },
        reset(){
            let form = this.form;
            for(let p in form){
                form[p] = "";
            }
        }
    }
  }
</script>
<style>
    .content{
        position:fixed;
        top:80px;
        left:400px;
        width:800px;
        height:550px;
        margin:0 auto;
        background:#fff;
    }
    .el-input{
        width:300px;
    }
    .el-form-item__label{
        margin-left:200px;
    }
</style>