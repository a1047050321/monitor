<template>
    <div id="main">
    <div class="nav-wrapper">
			<!-- 面包屑导航路径 -->
			<el-breadcrumb separator=">">
			  <el-breadcrumb-item>操作记录</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
        <div class="search-bar">
            <div class="search-box">
                        操作人：<el-input v-model="searcher" style="width:200px;margin-top:16px;" @keyup.enter.native="search"></el-input>
                        <div class="searchButton">
                            <el-date-picker
                            v-model="value1"
                            type="datetime"
                            placeholder="选择日期时间">
                            </el-date-picker>
                            -
                            <el-date-picker
                            v-model="value2"
                            type="datetime"
                            placeholder="选择日期时间">
                            </el-date-picker>
                        <el-button type="primary" @click="search" style="margin-left:32px;">查找</el-button>
                        <el-button @click="reset">重置</el-button>
                    </div>
            </div>
        </div>
         <el-table ref="multipleTable" class="tablePos" height="40px" :data="tableData" @selection-change="handleSelectionChange">
            <el-table-column label="序号" width="80" type="index">
            </el-table-column>
            <el-table-column prop="createBy" label="操作人" width="200">
            </el-table-column>
            <el-table-column prop="operationName" label="操作名称" width="200">
            </el-table-column>
            <el-table-column prop="operationType" label="操作属性" width="200">
            </el-table-column>
            
            <el-table-column prop="createDate" label="操作时间" width="250">
            </el-table-column>   
            <el-table-column prop="result" label="操作结果">
            </el-table-column>
            </el-table-column>
        </el-table>
        <div class="block">
            <el-pagination
            style="margin-left:200px;"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[20,50,100, 200, 300]"
            :page-size="pagenum"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination>
        </div>    
</div>
</template>
<script>
    import axios from 'axios'

    export default{
        data(){
            return {
                alert: true,
                input: '',
                total:1,
                pageidx:1,
                currentPage: 1,
                pagenum:20,
                tableData: [],
                multipleSelection: [],
                value1:"",
                value2:"",
                searcher:"",
                endTime:"",
                startTime:""

            }
        },
        mounted(){
            this.getData();
        },
        methods:{
            //获取数据
            getData(){
                var self = this;
                var url = this.$iHomed("api", "opeator_log");
                var table= {};
                self.tableData = [];
                if(self.value1){
                  self.startTime= self.dateTranslate(self.value1);
                }
                else if(self.value2){
                  self.endTime = self.dateTranslate(self.value2);
                }
                self.axios.get(url,{
                    params:{
                         currentPage:this.pageidx,
                         pageSize:this.pagenum,
                         search:this.searcher,
                         endTime:self.endTime,
                         beginTime:self.startTime,
                    }
                }).then(function(res){
                    var datalist = res.data.data;
                    console.log(datalist);
                        self.total = Number(datalist.total);
                        self.tableData = datalist.data;
                })
            },
             //选择显示数量
             handleSizeChange(val) {
                 //看接口最大能获取多少
                console.log(`每页 ${val} 条`);
                this.pagenum = val;
                this.getData();
            },
            //点击第几页
            handleCurrentChange(val) {
                this.pageidx = val;
                this.getData();
            },
            //多选框
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            search(){
                this.getData();
            },
            reset(){
                this.searcher = "";
                this.value1 = "";
                this.value2 = "";
                this.getData();
            }
        }
    }
</script>
<style lang="" scoped>
    .nav-wrapper span{
         font-size:15px;
    }
    #main{
        font-size:14px;
    }
    .el-input{
        width:200px;
    }
    .block{
        position:absolute;
        bottom:2px;
        left:300px;
        height:30px;
    }
    .tablePos.el-table{
        position:fixed;
        top:105px;
        bottom:70px;
        font-size:12px;
        width:80%;
        overflow-y:scroll;
    }
    .el-button{
        width:88px;
        height:28px;
        line-height:8px;
    }
    .searchButton{
        position:fixed;
        top:58px;
        right:1.3%;
        width:650px;
    }
</style>