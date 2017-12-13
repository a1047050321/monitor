<template>
	<div>
		<!-- 头部导航路径区 -->
		<div class="nav-wrapper">
			<!-- 面包屑导航路径 -->
			<el-breadcrumb separator=">">
			  <el-breadcrumb-item>模块一</el-breadcrumb-item>
			</el-breadcrumb>
			<!-- TAB切换 -->
			<el-tabs size="mini" v-model="pData.source" @tab-click="handleChangeTab">
			   <el-tab-pane label="TAB1" name="2"></el-tab-pane>
			   <el-tab-pane label="TAB2" name="1"></el-tab-pane>
			</el-tabs>
		</div>
		
		<!-- 搜索区 -->
		<search-list :search-param="searchParam" ref="search-contain" :is-search-mode.sync="isSearchMode" @search-callback="handleSearchCb">
		</search-list>

		<!-- 工具区 -->
		<!-- 工具区确认操作提示的小气泡提示框 -->
		<el-popover ref="popdelete" placement="bottom" title="是否删除所选项？" width="200" trigger="click" v-model="toolData.popDeleteVisiable" >
			<div style="text-align: right;">
				<el-button type="primary" size="small" @click="handleDeleteDialog">确定</el-button>
				<el-button size="small" @click="toolData.popDeleteVisiable=false">取消</el-button>
			</div>
		</el-popover>

		<div class="tool-wrapper">
			<el-button type="primary" icon="plus" size="small" v-show="pData.source==='2'" @click="handleAddDialog">创建</el-button>

			<el-button type="primary" icon="close" size="small" v-popover:popdelete :disabled="toolData.disabledDelete" >删除</el-button>

			<el-button type="primary" icon="upload2" size="small" @click="handleSubmitDialog" :disabled="toolData.disabledSubmit" v-show="pData.source==='2'">提交审核</el-button>
		</div>

		<!-- 表格展示区 -->
		<div class="table-wrapper">
			<el-table ref="multipleTable" :data="tData.playList" border tooltip-effect="dark" :height="tData.tHeight" @select="handleSelRow" @select-all="handleSelRowAll">
				<el-table-column type="selection"></el-table-column>
				<el-table-column label="序号" prop="index" width="80"></el-table-column>				
				<el-table-column label="名称" min-width="200">
					<template scope="scope">
						<router-link :to="{path: '/library/programs', query: { id: scope.row.playlistid, name: scope.row.name }}">{{ scope.row.name }}</router-link>
					</template>
				</el-table-column>
				<el-table-column label="媒资个数" prop="programNum"></el-table-column>
				<el-table-column label="类型" prop="contentType"></el-table-column>
				<el-table-column label="审核状态" prop="status"></el-table-column>
				<el-table-column label="创建者" prop="createrName"></el-table-column>
				<el-table-column label="创建时间" prop="createTime"></el-table-column>				
				<el-table-column label="操作">
					<template scope="scope">				       
				        <el-button size="mini" @click="handleEditDialog(scope.$index, scope.row)">编辑</el-button>
				        <el-button size="mini" @click="handlePosterDialog(scope.$index, scope.row)">海报</el-button>
				    </template>
				</el-table-column>
			</el-table>
		</div>
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
		
		<!-- 添加或编辑弹窗 -->
		<add-edit-list-dialog :adit-param="aditParam" @refresh-page-data="refreshPageData"></add-edit-list-dialog>
		
		<!-- 编辑海报弹窗 -->
		<edit-poster-dialog :poster-param="posterParam"></edit-poster-dialog>		
	</div>
	
</template>

<script>
	import SearchList from "@/components/SearchList";
	import AddEditListDialog from "@/components/AddEditListDialog";
	import EditPosterDialog from "@/components/EditPosterDialog";

	export default {
		components: {
			SearchList,
			AddEditListDialog,
			EditPosterDialog
		},
		data(){
			return {
				// loading加载提示
				Loading: null,
				// 导航数据
				nData: {
				},
				// 搜索传参数据
				searchParam: {
					isNeedStatus: true
				},
				// 工具栏数据
				toolData: {
					disabledDelete: true,
					disabledSubmit: true,
					popDeleteVisiable: false
				},
				// 搜索数据
				sData: null,
				// 表格数据
				tData: {
					playList: [],
					tHeight: 0,
					selectedRows: []
				},
				// 分页数据
				pData: {
					total: 0,
					currentPage: 1,
					pageSize: 30,
					pageSizes: null,
					source: "2"
				},
				// add or edit data 添加或编辑数据
				aditParam: {
					flag: 0,
					dialogVisible: false,
					playlistid: 0
				},
				// 编辑海报
				posterParam: {
					dialogVisible: false,
					playlistid: 0
				},
				// 是否搜索
				isSearchMode: false
			}
		},

		created() {
			let _this = this;
			
			this.loading();

			// 指定加载TAB1还是TAB2的列表	
			this.pData.source = this.$route.meta.source;

			this.pData.pageSizes = this.$iHomed("config", "PAGE_SIZES");

			// 获取列表
			this.getPageData();
		},

		computed: {

		},

		mounted() {
			// 自动调整表格区高度
			let _this = this,
				searchWrapper = this.$refs["search-contain"].$el;

			autoResize();

			window.onresize = autoResize;

			function autoResize() {
				let wh = +window.innerHeight,
					sh = +searchWrapper.offsetHeight,

					tHeight = wh -sh - 180;
			
				_this.tData.tHeight = tHeight;						

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
				this.$nextTick(() => {
					this.Loading.close();
				});				
			},

			// 切换TAB1和TAB2
			handleChangeTab(tab, event) {
				// 切换后同步
				this.pData.source = this.$route.meta.source = tab.name;

				this.toolData.disabledDelete = this.toolData.disabledSubmit = true;

				this.pData.currentPage = 1;

				this.loading();

				this.getPageData();

			},

			searchList() {

			},

			/**
			 * [handleAddDialog 添加弹出窗口]
			 */
			handleAddDialog() {		

				this.aditParam = {
					flag: 0,
					dialogVisible: true
				}
			},
			/**
			 * [handleEditDialog 编辑弹出窗口]
			 * @param  {[Int]} index [索引]
			 * @param  {[Object]} row   [当前行数据]
			 */
			handleEditDialog(index, row) {
				this.aditParam = {
					flag: 1,
					dialogVisible: true,
					playlistid: row.playlistid
				}				
			},

			/**
			 * [refreshPageData 刷新获取数据]
			 */
			refreshPageData() {
				this.getPageData();
			},

			/**
			 * [handlePosterDialog 海报编辑弹窗]
			 * @param  {[type]} index [索引]
			 * @param  {[type]} row   [当前编辑]
			 */
			handlePosterDialog(index, row) {

				this.posterParam = {
					dialogVisible: true,
					playlistid: row.playlistid
				}
			},

			/**
			 * [handleDeleteDialog 删除气泡框]
			 */
			handleDeleteDialog() {				
				this.toolData.popDeleteVisiable = false;
				this.handleDelete();
			},

			/**
			 * [handleSubmitDialog 提交审核对话框]
			 */
			handleSubmitDialog() {
				this.handleSubmit();
			},

			/**
			 * [handleDelete 删除]
			 */
			handleDelete() {
				
			},

			/**
			 * [handleSubmit 提交审核]
			 */
			handleSubmit() {				
				
			},

			/**
			 * [handleSelRow 勾选表格数据行checkbox]
			 * @param  {[Int]} slist [已勾选的数据数组]
			 * @param  {[Object]} row   [当前勾选行的数据]
			 */
			handleSelRow(slist, row) {

				this.disabledToolBtn(slist);
			},

			/**
			 * [handleSelRowAll 勾选表格全选checkbox]
			 * @param  {[Int]} slist [已勾选的数据数组]
			 */
			handleSelRowAll(slist) {
				this.disabledToolBtn(slist);
			},

			/**
			 * [disabledToolBtn 禁用或激活工具栏按钮]
			 * @param  {[type]} slist [已勾选列表]
			 */
			disabledToolBtn(slist) {
				let submitFlag = false,
					deleteFlag = false;

				// 没有勾选
				if(!slist.length) {
					deleteFlag = submitFlag = true;
				}
				else {
					deleteFlag = submitFlag = false;
				}

				this.tData.selectedRows = slist;

				this.toolData.disabledDelete = deleteFlag;

				this.toolData.disabledSubmit = submitFlag;
			},

			/**
			 * [handleSearchCb 搜索组建回调]
			 * @param  {[Object]} data [搜索条件相关参数]
			 */
			handleSearchCb(data) {
				
				this.sData = data;

				this.pData.currentPage = 1;

				this.getPageData();
			},

			// 获取分页数据
			getPageData() {

				let isSearchMode = this.isSearchMode,

					// url = this.$iHomed("api", isSearchMode ? "search_program" : "playlist_list"),
					url = this.$iHomed("api", "playlist_list"),
					param = {
						pageidx: this.pData.currentPage,
						pagenum: this.pData.pageSize
					};

				// 搜索和列表接口入参不同
				if(isSearchMode) {
					Object.assign(param, this.sData);
				}
				else {
					Object.assign(param, { sortby: 2 });
				}

				Object.assign(param, {source: this.pData.source});

				this.$http({
					url: url,
					type: isSearchMode ? "POST" : "GET",
					data: param
				})
				.then((res) => {
					if(res.ret == 0) {						
						let list = res.list ? res.list : [],							
							filtList = []; // 过滤列表
						
						list.forEach((val, index) => {
							filtList.push({
								index: this.$iHomed.addZero(index + 1, 2),
								playlistid: val.playlistid,
								name: val.name,
								programNum: val.programnum,
								contentType: val.contenttype,
								status: val.status,
								createrName: val.creatername,
								public: val.public,
								poster: val.postercommonlist,
								abstract: val.abstract,
								nstatus: val.status,
								createTime: this.$iHomed.timeFormat(val.createtime)
							});
						});

						this.tData.playList = filtList;

						this.pData.total = res.total;

						this.closeLoading();

					}
					// 搜索结果为空
					else if(isSearchMode && res.ret == 1) {
						this.tData.playList = [];
						this.closeLoading();
						this.$message(res.retmsg);
					}
					else {
						this.closeLoading();
						this.$alert(res.retmsg);
					}
				})
				.catch((error) => {
					this.closeLoading();
					this.$alert((isSearchMode ? "搜索" : "获取") + "列表失败！");
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

	.tool-wrapper {
		margin-top: 10px;
	}

	.table-wrapper {
		margin-top: 10px;
	}
</style>
