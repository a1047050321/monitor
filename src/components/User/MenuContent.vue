<template>
	<el-menu default-active="$route.path" :router="true" :default-openeds="['0']">
		<template v-for="(menu, index) in menuList" :keys="index">
			<el-submenu :index="index.toString()" v-if="menu.children">
				<template slot="title">
					<i :class="['icon', menu.iconClass]"></i>
					<span>{{ menu.name }}</span>
				</template>
				<el-menu-item-group >
					<router-link class="el-menu-item" :index="index.toString() + '-' + cindex.toString()" :to="cmenu.to.toString()" tag="li" v-for="(cmenu, cindex) in menu.children" :key="cindex">
						<span>{{ cmenu.name }}</span>
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
	export default {
		props: ["contentParam"],
		data () {
		  return {
		  };
		},
		mounted(){
		},
		computed: {
			menuList() {
				let list = this.$iHomed("config", "menuList");
				if(this.contentParam.role == 0 ||this.contentParam.role == 1){
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
					list = list.concat( {
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
				}
				// 系统管理员与超级管理员
				return list;
			}
		}
	}
</script>

<style>
	.menu-content.el-menu,
	.menu-content .el-submenu .el-menu {
		background-color: #20A0FF;
	}

	.menu-content .el-submenu__title,
	.menu-content .el-menu-item {
		color: #fff;
	}

	.menu-content > li {
		text-align: center;
	}

	.menu-content .el-menu-item:hover {
	    background-color: #58B7FF;
	}

	.menu-content .el-submenu__title span,
	.menu-content > .el-menu-item span {
		font-size: 16px;
	}

	.menu-content .el-submenu__title:hover {
	    background-color: #20A0FF;
	}

	.menu-content .router-link-active {
		background-color: #1D8CE0;
		font-weight: bold;
	}
</style>