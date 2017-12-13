<template>
	<el-dialog title="编辑海报" :visible.sync="posterParam.dialogVisible" :close-on-click-modal="false" size="large" top="5%">
			<!-- 防止全局数据污染，海报插件用iframe引入使用 -->
			<iframe :src="iframeUrl" style="width:1100px;height:600px;" v-loading.body="loading" element-loading-text="玩命加载中"></iframe>
	</el-dialog>
</template>

<script>
	export default {
		props: ["posterParam"],
		data() {
			return {
				// loading加载提示
				loading: false,
				iframeUrl: ""				
			}
		},
		watch: {
			posterParam() {
				let posterParam = this.posterParam,
					playlistid = posterParam.playlistid;

				this.loading = true;

				this.$http({
					url: this.$iHomed("api", "playlist_info"),
					type: "GET",
					data: {
						id: playlistid
					}
				})
				.then((res) => {
					if(res.ret == 0) {

						let poster = res.postercommonlist,
							posterDir = poster.dir,
							posterList = poster.list;						

						//传递给H5图片编辑器的参数
						var options = [

					        "systemType=playlist",

					        "posterDir=" + posterDir,

					        "index=" + 1,

					        "postUrl=" + posterDir + posterList["41x41"],

					        "accesstoken=" + this.$iHomed("config", "token"),

					        "mediaId=" + playlistid

					    ];	

					    this.iframeUrl = "./static/poster/index.html?" + options.join("&");			    
					    this.loading = false;
					}
					else {
						this.loading = false;
						this.iframeUrl = ""
						this.$alert(res.retmsg);
					}
				})
				.catch((error) => {
					this.loading = false;
					this.iframeUrl = ""
					this.$alert("获取播单详细信息失败！");
				});
				
			}
		},
		created() {
			
		},
		methods: {
			// 数据加载提示
			/*loading(param) {
				
				param = Object.assign({
							target: "#poster",
							text: "玩命加载中，请稍候..."
						}, param || {});
				
				this.Loading = this.$loading(param);
			},
			// 关闭数据加载提示
			closeLoading() {
				this.$nextTick(() => {
					this.Loading.close();
				});				
			}		*/	
		}
	}
</script>

<style scoped>
	
</style>

<style>
	.el-dialog__wrapper .el-dialog--large {
		width: auto;
	}
</style>