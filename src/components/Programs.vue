<template>
	<div>
		<!-- 头部导航路径区 -->
		<div class="nav-wrapper">
			<el-breadcrumb separator=">">
			  <el-breadcrumb-item to="/library">模块一</el-breadcrumb-item>
			  <el-breadcrumb-item>{{ nData.playlistName }}</el-breadcrumb-item>
			</el-breadcrumb>
			<el-button type="text" @click="$router.back()"><i class="el-icon-arrow-left"></i>返回</el-button>
		</div>

		<!-- 工具区 -->
		<!-- 删除节目确定气泡框 -->
		<el-popover ref="popdelete" placement="bottom" title="是否删除所选节目？" width="200" trigger="click" v-model="toolData.popDeleteVisiable" >
			<div style="text-align: right;">
				<el-button type="primary" size="small" @click="handleDeleteDialog">确定</el-button>
				<el-button size="small" @click="toolData.popDeleteVisiable=false">取消</el-button>
			</div>
		</el-popover>
		<!-- 工具按钮 -->
		<div class="tool-wrapper">
			<el-button type="primary" icon="close" v-popover:popdelete size="small" :disabled="toolData.disabledDelete">删除</el-button>
		</div>

		<!-- 表格展示区 -->
		<div class="table-wrapper">
			<el-table ref="multipleTable" :data="tData.programList" border tooltip-effect="dark" :height="tData.tHeight" @select="handleSelRow" @select-all="handleSelRowAll">
				
				<el-table-column type="selection"></el-table-column>
				<el-table-column label="序号" prop="index"></el-table-column>				
				<el-table-column label="节目名称" prop="name" show-overflow-tooltip></el-table-column>
				<el-table-column label="提供商" prop="providerid"></el-table-column>
				<el-table-column label="源类型" prop="type"></el-table-column>
			</el-table>

			<!-- 分页展示区 -->
			<div class="pager-wrapper">
				<el-pagination
				     @size-change="handleSizeChange"
				     @current-change="handleCurrentChange"
				     :current-page="pData.currentPage"
				     :page-sizes="pData.pageSizes"
				     :page-size="pData.pageSize"
				     layout="total, sizes, prev, pager, next, jumper"
				     :total="pData.total">
				</el-pagination>
			</div>			
		</div>
	</div>
	
</template>

<script>	

	export default {
		data(){
			return {
				// loading加载提示
				Loading: null,
				// 导航数据
				nData: {
					playlistName: "",
					id: ""
				},
				toolData: {
					disabledDelete: true,
					popDeleteVisiable: false
				},
				// 表格数据
				tData: {
					provider: null,
					programList: [],
					selectedRows: [],
					tHeight: 0
				},
				// 分页数据
				pData: {
					total: 0,
					currentPage: 1,
					pageSize: 30,
					pageSizes: null,
					source: 1
				}
			}
		},

		created() {
			// 初始化当前的导航
			let _this = this,
				query = this.$route.query;

			this.loading();

			this.nData.playlistName = query.name;		
			this.nData.id = query.id;		

			this.pData.pageSizes = this.$iHomed("config", "PAGE_SIZES");

			this.getPageData();
		},

		mounted() {
			let _this = this;

			autoResize();

			window.onresize = autoResize;

			function autoResize() {
				let wh = +window.innerHeight;
			
				_this.tData.tHeight = wh -178;						

			};
		},

		methods: {
			// 数据加载提示
			loading(param) {

				param = Object.assign({
							target: ".content-wrapper",
							text: "玩命加载中，请稍候..."
						}, param || {});
				
				this.Loading = this.$loading(param);
			},

			// 关闭数据加载提示
			closeLoading() {
				this.Loading.close();
			},

			/**
			 * [handleSelRow 勾选表格数据行checkbox]
			 * @param  {[Int]} slist [已勾选的数据数组]
			 * @param  {[Object]} row   [当前勾选行的数据]
			 */
			handleSelRow(slist, row) {
				this.tData.selectedRows = slist;
				this.toolData.disabledDelete = slist.length ? false : true;
			},

			/**
			 * [handleSelRowAll 勾选表格全选checkbox]
			 * @param  {[Int]} slist [已勾选的数据数组]
			 */
			handleSelRowAll(slist) {
				this.tData.selectedRows = slist;
				this.toolData.disabledDelete = slist.length ? false : true;
			},

			/**
			 * [handleDeleteDialog 删除播单对话框]
			 */
			handleDeleteDialog() {

				this.toolData.popDeleteVisiable = false;
				this.handleDelete();
			},

			/**
			 * [handleDelete 删除播单节目]
			 */
			handleDelete() {
				
			},

			// 获取分页数据
			getPageData() {

				this.$http({
					url: this.$iHomed("api", "program_list"),
					type: "GET",
					data: {
						pageidx: this.pData.currentPage,
						pagenum: this.pData.pageSize,
						id: this.$route.query.id
					}
				})
				.then((res) => {
					if(res.ret == 0) {
						let list = res.list ? res.list : [],
							filtList = []; // 过滤列表;

						list.forEach((val, index) => {
							
							filtList.push({
								id: val.id,
								seriesid: val.seriesid,
								realsingle: val.realsingle,
								index: this.$iHomed.addZero(index + 1, 2),
								name: val.name,
								providerid: val.providerid,
								type: val.type
							});
						});

						this.tData.programList = filtList;

						this.pData.total = res.total;
						this.closeLoading();
					}
					else {
						this.closeLoading();
						this.$alert(res.retmsg);
					}
				})
				.catch((error) => {
					this.closeLoading();
					this.$alert("获取播单节目列表失败！");
				});
			},

			// 页面大小变化
			handleSizeChange(size) {
				this.loading();
				this.pData.pageSize = size;
				this.getPageData();
			},

			// 当前页变化
			handleCurrentChange(currentPage) {
				this.loading();
				this.pData.currentPage = currentPage;
				this.getPageData();
			}
		}
	}
</script>

<style scoped>

	.search-wrapper {
		border-bottom: 1px solid #ccc;
		margin-top: 10px;
	}

	.tool-wrapper {
		margin-top: 10px;
	}

	.table-wrapper {
		margin-top: 10px;
	}
</style>