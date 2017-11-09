<template>
<div>
    <div class="nav-wrapper">
        <!-- 面包屑导航路径 -->
        <el-breadcrumb separator=">">
            <el-breadcrumb-item>
                <router-link to="/callManage">报警管理</router-link>
            </el-breadcrumb-item>
            <el-breadcrumb-item>通知消息</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="buttonAll">
        <el-button type="primary" @click="addInfo">新增</el-button>
        <el-button type="primary">刷新</el-button>
    </div>
        <el-table
                    ref="singleTable"
                    :data="tableData"
                    height="40px"                    
                    highlight-current-row
                    @selection-change="handleSelectionChange"
                    >
                    <el-table-column
                    type="selection"
                    label="全选"
                    width="55">
                    </el-table-column>
                    <el-table-column
                    type="index"
                    label="序号"
                    width="70">
                    </el-table-column>
                    <el-table-column
                    property="content"
                    label="通知消息"
                    width="270">
                    </el-table-column>
                    <el-table-column
                    property="areaName"
                    label="接受区域"
                    width="180">
                    </el-table-column>
                    <el-table-column
                    property="receivers"
                    width="150"
                    label="接收方式">
                    </el-table-column>
                    <el-table-column
                    property="publishTime"
                    label="发布时间"
                    width="170">
                    </el-table-column>
                     <el-table-column
                    property="username"
                    label="操作人">
                    </el-table-column>
                </el-table>
                 <div class="block">
                 <el-pagination
                 style="margin-left:200px;"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[20, 30, 40]"
                :page-size="pageNum"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
    </el-pagination>
            </div>
        <add-callType v-if="addType" :mode="mode" @addType="typeChange" @newInfo="AddInfo"></add-callType>

</div>
</template>
<script>
import AddCallType from './AddCallType'
export default{
        data(){
            return {
                tableData:[],
                addType:false,
                mode:2,
                multipleSelection:[],
                pageNum:20,
                pageIdx:1,
                currentPage:1,
                total:null,
            }
        },
        mounted(){
            this.getData();
        },
        methods:{
            //通知消息列表
            getData(){
                var self = this;
                self.axios({
                    method:"get",
                    url:self.$iHomed("api","edit_notify"),
                    params:{
                        currentPage:self.pageIdx,
                        pageSize:self.pageNum
                    }
                    }).then((res)=>{
                        console.log(res.data);
                        if(res.data.code == 0){
                            var datalist = res.data.data;
                            for(let i = 0;i <datalist.data.length;i++){
                                datalist.data[i].publishTime  = new Date(datalist.data[i].publishTime).toLocaleDateString()+" "+new Date(datalist.data[i].publishTime).toLocaleTimeString();
                            }
                            self.total = datalist.total;
                            self.tableData = datalist.data;
                        }
                    })
            },
            //新增通知消息
            AddInfo(a){
                console.log(a);
                var self = this;
                self.axios({
                    method:"post",
                    url:self.$iHomed("api","edit_notify"),
                    data:a
                }).then((res)=>{
                    console.log(res.data.data);
                    if(res.data.data){
                        self.addType = false;
                        self.$alert("新增成功！");
                        self.getData();
                    }
                    else{
                        self.$alert(res.data.msg);

                    }
                })
            },
             //选择显示数量
             handleSizeChange(val) {
                 //看接口最大能获取多少
                this.pageNum = val;
                this.getData();
            },
            //点击第几页
            handleCurrentChange(val) {
                this.pageIdx = val;
                this.getData();
            },
            //多选框
             handleSelectionChange(val) {
                this.multipleSelection = val;
             },
             //新增消息
             addInfo(){
                this.addType=true;

             },
             //消息弹框状态改变
             typeChange(a){
                 this.addType = a;
             },
             getArea(){

             }

        },
        components:{
            "add-callType":AddCallType
        }
    }
</script>
<style scoped>
    .nav-wrapper{
        padding-bottom:5px;
        margin-top:5px;
    }
    .nav-wrapper span{
         font-size:15px;
    }
    .el-table{
        margin-top:10px;
        position:fixed;
        top:72px;
        bottom:80px;
        font-size:12px;
        width:80%;
        overflow-y:scroll;
    }
    .block{
        position:fixed;
        left:350px;
        bottom:40px;
    }
    .el-button{
        width:88px;
        height:28px;
        line-height:8px;
        margin-top:7px;
    }
</style>