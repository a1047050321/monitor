<template>
	<!-- 搜索区 -->
	<div class="search-wrapper">		
		<el-form :inline="true" :model="sData">
			<el-form-item label="名称">
				<el-input v-model="sData.name" size="small" placeholder="名称" @keyup.enter.native="handleName"></el-input>				
			</el-form-item>			
			<el-form-item label="创建时间">
				<el-date-picker v-model="sData.uploadStartTime" type="datetime" placeholder="选择开始日期" size="small" @change="handleStartTime"></el-date-picker>
					<span>至</span>
					<el-date-picker v-model="sData.uploadEndTime" type="datetime" placeholder="选择结束日期" size="small" @change="handleEndTime"></el-date-picker>
	    		</el-date-picker>
			</el-form-item>

			<el-form-item>
			    <el-button type="primary" size="small" @click.stop="handleReset()">重置</el-button>
			 </el-form-item>
		</el-form>
	</div>
</template>

<script>
	export default {
		// loading加载提示
		Loading: null,
		props: ["searchParam", "isSearchMode"],		
		created() {
			this.sData = Object.assign({}, this.initSearchData);
		},
		computed: {
			initSearchData() {
				return {
					name: "",
					uploadStartTime: "",
					uploadEndTime: ""
				}
			}
		},
		data() {
			return {
				sData: null
			}
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

			/**
			 * [handleReset 重置搜索]
			 */
			handleReset() {
				this.sData = Object.assign({}, this.initSearchData);
				
				this.$nextTick(() => {					
					this.$emit("update:isSearchMode", false);
					this.$emit("search-callback");
				});				
			},

			/**
			 * [handleName 输入名称]
			 */
			handleName() {
				
				this.$emit("update:isSearchMode", true);

				this.handleSearchProgram();
			},

			/**
			 * [handleStartTime 创建开始时间]
			 * @param  {[String]} time [时间字符串]
			 */
			handleStartTime(time) {

				this.$emit("update:isSearchMode", true);

				this.uploadStartTime = time ? time.replace(/\s+|\:|\-/g, "") : "";

				this.handleSearchProgram();
			},

			/**
			 * [handleEndTime 创建结束时间]
			 * @param  {[String]} time [时间字符串]
			 */
			handleEndTime(time) {
				this.$emit("update:isSearchMode", true);

				this.uploadEndTime = time ? time.replace(/\s+|\:|\-/g, "") : "";

				this.handleSearchProgram();
			},
			
			/**
			 * [handleSearchProgram 搜索传参]
			 */
			handleSearchProgram() {

				// 搜索回调
				this.$emit("search-callback", param);
				
			}
		}
	}
</script>

<style>
	.search-wrapper {
		border-bottom: 1px solid #ccc;
		margin-top: 10px;
	}

	.search-wrapper .el-form-item {
    	margin-bottom: 10px;
	}	

</style>

<style>
	.search-status .el-select__tags,
	.search-contenttype .el-select__tags {
		height: 30px;
		overflow-y: auto;
	}
</style>