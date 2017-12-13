<template>
<div class="background-image">
  <el-form :model="loginData" :rules="rules" ref="loginData" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <el-form-item prop="name">
      <span>登录名</span><el-input type="text" ref="input" autofocus @change="userName" v-model="loginData.name" @keyup.enter.native="handleSubmit" auto-complete="off" placeholder="请输入账号"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <span>登陆密码</span><el-input type="password" v-model="loginData.password" @keyup.enter.native="handleSubmit" auto-complete="off" placeholder="请输入密码"></el-input>
    </el-form-item>
    <!--<el-form-item prop="rememberMe">
     <span>记住密码</span><el-switch v-model="loginData.rememberMe" on-text="" off-text="" style="margin-left:20px;"></el-switch>
        </el-form-item> -->
  <el-form-item style="width:100%;">
      <el-button type="primary" @click.native.prevent="handleSubmit" :loading="logining">登录</el-button>
      <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
    </el-form-item>
  </el-form>
  </div>
</template>
<script>
  import md5 from "js-md5"
  export default {
    data() {
      return {
        logining: false,
        loginData: {
          name: '',
          password: '',
          rememberMe:false,
        },
        rules: {
          name: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            // { validator: validaePass }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            //{ validator: validaePass2 }
          ]
        },
        checked: true
      };
    },
    mounted(){
      // console.log(this.$refs['input'].$el.childNodes[2].focus());
    },
    methods: {
        userName(a){
          var partern = /^[0-9a-zA_Z]+$/g;
          if(!partern.test(a)){
            if(a){
              this.$alert("只能输入英文字母或数字哦！");
              this.loginData.name ="";
              this.$refs['input'].$el.childNodes[2].focus();
            }
          }
        },
        handleReset2() {
          this.$refs.ruleForm2.resetFields();
        },
        handleSubmit() {
          var self = this;
          //登录验证
          if(!this.loginData.name){
            this.$alert("登录名不能为空！");
            
            return false;
            }else if(!this.loginData.password){
            this.$alert("密码不能为空！");
            return false;
            }
          var url = this.$iHomed("api","auto_login");
          this.loginData.password = md5(this.loginData.password);
          self.axios({
            url:url,
            method:"post",
            data:this.loginData
          }).then((res)=>{
            console.log(res.data);
            if(res.data.msg == "success"){
                // 保存用户名称、用户角色
                var arr = [];
                for(let i = 0; i < res.data.data.alarmType.length;i++){
                  arr.push(res.data.data.alarmType[i].code);
                }
                localStorage.setItem('user_id', res.data.data.id);
                localStorage.setItem('role', res.data.data.type);
                localStorage.setItem('fid', res.data.data.fid);
                localStorage.setItem('codes', arr.join());
                localStorage.setItem('username', res.data.data.userName);
                localStorage.setItem('areaId', res.data.data.areaId);
                localStorage.setItem('tel', res.data.data.tel);
                localStorage.setItem('CA', res.data.data.ca);
                var queue = res.data.data.userName+"."+res.data.data.loginTime;
                localStorage.setItem('queue', queue);
                // self.$store.state.role = res.data.data.type;
                self.$message({
                  message: '登陆成功',
                  type: 'success'
                });
              self.$router.push({path: '/index/bMap', replace: true});    
            }
            else{
              self.$alert(res.data.msg);
            }           
            }).catch((err) => {
                    console.log(err);
                    self.$alert("登陆失败！");
          })
        }
  }
  }
</script>

<style  scoped>

.title {
      position:absolute;
      top:100px;
      left:600px;
      text-align: center;
      font-size:50px;
      font-weight:900;
    }
  .login-container {
    /* box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02); */
    position: fixed;
    top: 300px;
    left: 630px;
    border-radius: 5px;
    background-clip: padding-box;
    width: 366px;
    height: 200px;
    padding: 35px 30px 0 0;
    background: #fff;
  }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  .el-input{
    display:inline-block;
    width:250px;
    margin-left:20px;
  }
  .el-button{
    margin-left:73%;
    margin-top:18px;
      width:88px;
  }
  .el-form-item__content{
    margin-bottom:22px;
  }
  span{
      display:inline-block;
      width:64px;
  }
  .background-image {
    width: 100%;
    height: 100%;
    background: url("http://ww4.sinaimg.cn/large/0060lm7Tly1fm08355rx3j31400nmaaa.jpg");
}

</style>