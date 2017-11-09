<template>
	<div>
		<el-popover ref="nav-exit" placement="top" title="" trigger="hover">
		  <ul class="exit-list">
				<li @click="changePsd">修改密码</li>
		    <li @click="toIndexPage">切换账户</li>
		    <li @click="exit">退出</li>
		  </ul>
		</el-popover>  
		<div  v-show="psdDialog">
		<div class="mask"></div>
			<div class="changepsd">
					<div  class="title" style="text-align:center;color:#fff;">修改密码</div>
					<div><span>原始密码</span>
						<el-input type="password" v-model="oldPwd"></el-input>
					</div>
						<div><span>新密码</span>
						<el-input type="password" v-model="newPwd"></el-input>
					</div>
						<div><span>确认新密码</span>
						<el-input type="password" v-model="newPwd1"></el-input>
					</div>
					<div class="buttonPsd" style="margin-left:15px;">
						<el-button type="primary" @click="confirm">确定</el-button>
						<el-button @click="cancel">取消</el-button>
					</div>
			</div>
		</div> 
		<el-row class="app-footer">
		  <el-col :span="4">
		    <div class="nav-exit" v-popover:nav-exit>
		      <i class="icon icon-single"></i>
		      <span>{{ footerParam.username }}</span>          
		    </div>        
		  </el-col>
		  <el-col :span="20" style="background:#fff;">
		    <p>版权所有 © 1999-{{ nowYear }} 深圳市茁壮网络股份有限公司　粤ICP备12069260</p>
		    <p>Copyright © 1999-{{ nowYear }} iPanel.TV Inc. All Rights Reserved</p>
		  </el-col>
		</el-row>
	</div>	
</template>

<script>
import bus from "../../assets/js/bus"
	export default {
		props:["footerParam"],
		data () {
		  return {
					psdDialog:false,
					oldPwd:"",
					newPwd:"",
					newPwd1:"",
		  };
		},
		computed: {
			nowYear() {
			  return new Date().getFullYear();
			}
		},
		mounted(){
			// this.username = this.$iHomed.getCookie("username");
		},
		methods: {
			//回到登陆页
		  toIndexPage() {
							this.$confirm('是否确定切换账号?', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							bus.$emit("user",true);
							this.$iHomed('logout');
						}).catch(() => {
								this.$message({
									type: 'info',
									message: '已取消操作'
								});          
					})
			},
			changePsd(){
				this.psdDialog= true;
				// $(".content-wrapper").css("opacity","0.5");
			},
			confirm(){
				var self = this;
				console.log()
				if(self.oldPwd == self.newPwd){
					self.$alert("新旧密码一致，请重新输入！");
					return false;
				}
				else if(self.newPwd1 != self.newPwd){
					self.$alert("两次输入的新密码不一致，请重新输入");
					return false;
				}
				self.axios({
						method:"put",
						data:{
							"newPwd": self.newPwd,
  						"oldPwd": self.oldPwd
								},
						url:self.$iHomed("api","change_guest")+"pwd/"+localStorage.getItem('user_id'),
					})
						.then((res)=>{
						console.log(res);
						if(res.data.code != 0){
							self.$alert(res.data.msg);
							return false;
						}
						else{
							$(".content-wrapper").css("opacity","1");
							self.psdDialog = false;
								// 修改密码接口
							self.$message({
								type: 'success',
								message: '密码修改成功！'
							}); 
							 	self.oldPwd = "";
								self.newPwd = "";
								self.newPwd1 = "";
						}
						})
			
			},
			cancel(){
				this.psdDialog = false;
				$(".content-wrapper").css("opacity","1");
				this.$message({
            type: 'info',
            message: '已取消操作'
         });       
			},
			exit(){
				this.$confirm('是否确定退出系统?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
					bus.$emit("user",true);
					this.$iHomed('logout');
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });          
        });

			}
		}
	}
</script>

<style>
	.exit-list a{
		color:#000;
	}
	.mask{
        position:fixed;
        top:0;
        bottom:0;
        left:0;
        right:0;
        background:#000;
        opacity:0.3;
				z-index:10;
    }
	.changepsd{
		position:absolute;
		top:200px;
		left:600px;
		width:300px;
		height:250px;
		background:#fff;
		z-index:20;
	}
	.changepsd .title{
		height:40px;
		width:100%;
		line-height:40px;
		background:#20A0FF;
	}
	.changepsd div{
		width:100%;
		height:40px;
		line-height:40px;
	}
	.changepsd div span{
		display:inline-block;
		margin-left:10px;
		margin-top:5px;
		width:80px;
		}
	.changepsd div .el-input{
		display:inline-block;
		width:60%;
	}
	.changepsd .buttonPsd{
		position:absolute;
		bottom:10px;
	}
</style>