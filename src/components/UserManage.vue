<template>
<div>        
<div class="userManage">
        <div class="nav-wrapper">
                <!-- 面包屑导航路径 -->
                <el-breadcrumb separator=">">
                <el-breadcrumb-item>用户管理</el-breadcrumb-item>
                </el-breadcrumb>
        </div>
		<div id="buttonAll">
			<el-button size="mini" class="button">
            <router-link to="/userManage/addUser"> 添加</router-link>
           </el-button>
			<el-button size="mini" class="button">
                <router-link to="/userManage/userImport">导入</router-link>
            </el-button>
			<el-button size="mini" class="button" @click="export2Excel" :disabled="true">导出</el-button>
            <span class="conconent"></span>
			<el-button size="mini" class="button" @click="dilatation" :disabled="multi" style="margin-left:10px;">扩容</el-button>
			<el-input placeholder="请输入" icon="search" 
			v-model="input"  class="search"  @click="search"  @keyup="search">
			</el-input>		
		</div>
        <el-table ref="multipleTable" :data="tableData" style="width:1000px;" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="35" scope="scope">
            </el-table-column>
            <el-table-column prop="name" label="开户人" width="100">
            </el-table-column>
            <el-table-column prop="user_id" label="帐号ID" width="100">
            </el-table-column>
            <el-table-column prop="nickname" label="用户昵称" width="100">
            </el-table-column>
            <el-table-column prop="sex" label="性别" width="80">
            </el-table-column>
            <el-table-column prop="phone" label="手机号" width="120">
            </el-table-column>
            <el-table-column prop="cardNum" label="证件号" width="170">
            </el-table-column>
            <el-table-column prop="agentTime" label="开户时间" width="120">
            </el-table-column>
            <el-table-column prop="totalSpace" label="总空间" width="80">
            </el-table-column>
            <el-table-column prop="usedSpace" label="已用空间" width="93">
            </el-table-column>
        </el-table>
    </div>
    <div class="block">
    <el-pagination
    style="margin-left:300px;"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-sizes="[20,30,50]"
      :page-size="maxResult"
      layout="sizes, prev, pager, next"
      :total="total">
    </el-pagination>
    </div>
    <!--组件注册 /-->
    <!--<add-user :addUser="addUser"></add-user> /-->
    <v-dialog @dialog="change" :multipleSelection = "multipleSelection[0]" :dialog="dialog"></v-dialog>
</div>
	
</template>
<script>
    import axios from 'axios'
    import AddUser from '@/components/AddUser'
    import Dialog from '@/components/Dialog'
    var rows = [];
    export default {
        data() {
            return {
                row: {},
                alert: true,
                input: '',
                multi:false,
                dialog:false,
                total:1,
                page:1,
                currentPage: 1,
                maxResult:20,
                tableData: [],
                multipleSelection: []

            }
        },
        mounted(){
            if(this.multipleSelection.length == 0 ){
                    this.multi = true;              
                }
                 this.getData();    
        },
        methods: {
            change(a){
                this.dialog = a;
            },
             getData(){
                var url = "http://route.showapi.com/341-1";
                axios.get(url,{
                    params:{'showapi_appid':42089,
                            'showapi_sign':"745124d1951c476d9699918b5cc313e7",
                            'page':this.page,
                            'maxResult':this.maxResult
                    }
                }).then(function(res){
                    var dataList = res.data.showapi_res_body.contentlist;
                    $.each(dataList,function(index,val){
                        if(!val["sex"]){
                            val["sex"] = Math.random() >0.5?"男":"女";
                        }
                    })
                    this.tableData = dataList;
                    this.total = res.data.showapi_res_body.allNum;
                    return this.tableData;
                    }.bind(this))
            },
            //选择显示数量
             handleSizeChange(val) {
                 //看接口最大能获取多少
                console.log(`每页 ${val} 条`);
                this.maxResult = val;
                this.getData();
            },
            //点击第几页
            handleCurrentChange(val) {
                console.log(val);
                this.page = val;
                this.getData();
                console.log('当前页: ${val}');
            },
            //多选框
            handleSelectionChange(val) {
                this.multipleSelection = val;
                 if(this.multipleSelection.length >1 || this.multipleSelection.length ==0){
                    this.multi = true;              
                }
                else{
                    this.multi = false;              
                }
            },
            //搜索框 搜索用户输入
            search(){
				let	url = this.$iHomed("api", "manager_user_search"),
                params = {
                    name:this.input
                };
               this.$http({
					url: url,
					type: "GET",
					data: params
				})
				.then((res) => {
                    console.log(res);
                })
            },
            // 扩容
            dilatation() {
               if($(".is-checked").length ==1){
                 this.dialog = true;
                    $(".userManage").css("opacity", "0.5");
               }
                // $(".dialogBtn.close").click(function() {
                //     $(".pop").css("display", "none");
                //     $("#app").css("opacity", "1");
                // })
               
            },
            //导出表格 只能获取当前页的全部数据
            export2Excel(){
                    var dataList = [];
                    var self = this;
                    setTimeout(function() {
                        var dataHeader = ['名字', 'ID', '昵称', '性别', '手机号','证件号','开户时间','总空间','已用空间'];
                        dataList = self.multipleSelection;
                        console.log(dataList);
                        $('.conconent').tableExport({ type: 'excel', escape: 'false', dataList: dataList, dataHeader: dataHeader });
                }, 600);
            }
        },
        components:{
            "add-user":AddUser,
            "v-dialog":Dialog
        }
    }
</script>
<style lang="">
    #buttonAll {
        width: 1000px;
        height: 35px;
        line-height: 35px;
        background: #fff;
    }

    .button:first-child{
        margin-left: 10px;
    }

    .button.el-button {
        border-radius: 0;
        margin-top:0;
    }
    
    .search {
        width: 200px;
        position: absolute;
        top: 40px;
        right: 240px;
    }
    .search .el-input__inner{
        height:24px;
        font-size:12px;
    }
    .el-input__inner {
        height: 35px;
    }
    .el-table__body-wrapper{
        height:601px;
        overflow-y:scroll;
        overflow-x:hidden;
    }
    table {
        background-color: #f0f0f0;
        font-size: 12px;
    }
    .el-table td{
        height:30px;

    }
    .el-table__row {
        height: 30px;
    }
    
    .input {
        width: 36px;
    }
    
    .dialogBtn {
        width: 40%;
        height: 35px;
        border: 1px solid #000;
    }
    ul li{
        list-style:none;
    }
</style>