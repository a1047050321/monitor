<template>
	<el-menu default-active="$route.path" :router="true" :default-openeds="['0','1','2','3']">
		<template v-for="(menu, index) in menuList" :keys="index">
			<el-submenu :index="index.toString()" v-if="menu.children">
				<template slot="title">
					<i :class="['icon', menu.iconClass]"></i>
					<el-badge class="item" is-dot v-if="menu.name == '报警管理'&& length!= 0"><span>{{ menu.name }}</span></el-badge>
					<span v-if="menu.name != '报警管理'||(menu.name == '报警管理'&& length == 0)">{{ menu.name}}</span>
				</template>
				<el-menu-item-group >
					<router-link class="el-menu-item" :index="index.toString() + '-' + cindex.toString()" :to="cmenu.to.toString()" tag="li" v-for="(cmenu, cindex) in menu.children" :key="cindex">
						<el-badge is-dot class="item" v-if="cmenu.name == '报警信息'&& length!= 0"><span>{{ cmenu.name}}</span></el-badge>
						<span v-if="cmenu.name != '报警信息'||(cmenu.name == '报警信息'&& length == 0)">{{ cmenu.name}}</span>
					</router-link>
				</el-menu-item-group>
			</el-submenu>
			<router-link class="el-menu-item" :index="index.toString()" v-else :to="menu.to" tag="li">
				<i :class="['icon', menu.iconClass]"></i>
				<span>{{ menu.name }}</span>
			</router-link>			
		</template>
	</el-menu>	
</template>
<script>
import bus from "./../../assets/js/bus.js"
	export default {
		props: ["contentParam"],
		data () {
		  return {
			  length:0,
		  };
		},
		mounted(){
			this.getData();
		},
		computed: {
			menuList() {
				let list = this.$iHomed("config", "menuList");
				if(this.contentParam.role == 10){
				list = list.concat({
						name: "系统管理",
						to: "/systemManage",
						iconClass: "icon-setting",
						children: [{
								name: "管理员管理",
								to: "/systemManage/manager",
							}, {
								name: "系统日志",
								to: "/systemManage/operate",
							},
						]
					});
				}
				else{
					if(localStorage.getItem("username") != "admin"){
							list = list.concat({
							name: "系统管理",
							to: "/systemManage",
							iconClass: "icon-setting",
							children: [{
									name: "管理员管理",
									to: "/systemManage/manager",
								}, {
									name: "系统日志",
									to: "/systemManage/operate",
								},
								{
									name: "接入应用",
									to: "/systemManage/accessApp",
								}
							]
						});
					}else{
						list = list.concat({
							name: "系统管理",
							to: "/systemManage",
							iconClass: "icon-setting",
							children: [{
									name: "管理员管理",
									to: "/systemManage/manager",
								}, {
									name: "系统日志",
									to: "/systemManage/operate",
								},
								{
									name: "配置管理",
									to: "/configManage",
									iconClass: "el-icon-question",
								},
								{
									name: "接入应用",
									to: "/systemManage/accessApp",
								}
							]
						});
					}
				}
				// 系统管理员与超级管理员
				return list;
			}
		},
		methods:{
			getData(){
                var self = this;
                self.axios({
                    url:self.$iHomed("api","get_untreated"),
                    method:"get",
                    params:{
                        currentPage: self.pageIdx,
                        pageSize:self.pageNum
                    }
                })
                .then((res)=>{
                    if(res.data.data.data){
                    	self.length = res.data.data.total;
					}
                })
                .catch((error)=>{
                    //地址错误
                    console.log(error);
                })
            },
		}
	}
</script>