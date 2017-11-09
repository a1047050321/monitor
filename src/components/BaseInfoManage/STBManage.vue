<template>
<div>
    <div class="nav-wrapper">
        <!-- 面包屑导航路径 -->
        <el-breadcrumb separator=">">
            <el-breadcrumb-item>
                <router-link to="/baseInfoManage">基本信息管理</router-link>
            </el-breadcrumb-item>
            <el-breadcrumb-item>机顶盒用户管理</el-breadcrumb-item>

        </el-breadcrumb>
    </div>
    <div class="baseInfo" @contextmenu.prevent="">
        <div class="tree">
            <my-tree
            :data="data"
            :props="defaultProps"
            node-key="id"
            default-expand-all
            @node-click = "leftClick"
            :expand-on-click-node="false"
            :default-expanded-keys="array"
            >
            </my-tree>
        </div>
        <!-- 右侧显示信息 -->
        <div class="infoContent">
        <div class="infoText">
                <div class="communityLabel">{{region}}名称:<span @dblclick="dbClick">{{first.label}}</span>
                    </div>
                    <div class="communityId">管理单位:<span @dblclick="dbClick">{{first.unit}}</span>
                    </div>
                    <div class="communityId">单位电话:<span @dblclick="dbClick">{{first.unitTel}}</span>
                    </div>
                    <div class="communityId">单位地址:<span  @dblclick="dbClick">{{first.unitAddress}}</span>
                    </div>
            </div>
            <div class="infoButton" style="margin:10px 0;">
                <el-button type="primary" @click="addUser" :disabled="quyuClick">新增</el-button>
                <el-button type="primary" :disabled="multi" @click="reviseUser">修改</el-button>
                <el-button type="primary" :disabled="length" @click="delStbUser">删除</el-button>
                <el-button type="primary" @click='importData' :loading="quyuClick1" :disabled="quyuClick">导入</el-button>
                 <div class="searchButton">
                    <el-input icon="search" class="search" v-model="search_value" @keyup.enter.native="search" placeholder="输入机顶盒序列号、卡号、用户名搜索"></el-input>
                    <el-button type="primary" @click="search" style="margin-left:10px;">查找</el-button>
                    <el-button @click="reset">重置</el-button>
                </div>
            </div>
            
            <div class="infoTable" >
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
                    show-overflow-tooltip
                    width="40">
                    </el-table-column>
                    <el-table-column
                    type="index"
                    label="序号"
                    show-overflow-tooltip
                    width="65">
                    </el-table-column>
                    <el-table-column
                    property="areaName"
                    label="所属社区"
                    show-overflow-tooltip
                    width="130">
                    </el-table-column>
                    <el-table-column
                    property="name"
                    label="用户名"
                    show-overflow-tooltip
                    width="100">
                    </el-table-column>
                    <el-table-column
                    property="tel"
                    width="140"
                    show-overflow-tooltip
                    label="用户电话">
                    </el-table-column>
                    <el-table-column
                    property="CA"
                    label="机顶盒序列号"
                    show-overflow-tooltip
                    width="140">
                    </el-table-column>
                     <el-table-column
                    property="terminalId"
                    label="CA卡号"
                    show-overflow-tooltip
                    width="120">
                    </el-table-column>
                     <el-table-column
                    property="address"
                    show-overflow-tooltip
                    label="地址">
                    </el-table-column>
                </el-table>
            </div>
           <div class="block">
                 <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[ 20, 30, 40]"
                :page-size="pagenum"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
            </div>
        </div>
       <right-menu @rightMenu="change" :rightMenu="rightMenu" :left="left" :top="top" :node="node" :treeData="treeData"></right-menu>
       <add-dialog @addSon="cancelAddSon" :parentLabel="parentLabel" :parentId="parentId" v-if="addSon" :mode="mode" :multipleSelection="stbUser" :treeData="treeData" :addName="addName"></add-dialog>
    </div>
    <div style="width:100%;height:100%;" v-if="importDialog">
    <form>
            <div class="mask"></div>
            <div class="import">
            <div class="title">导入用户信息</div>
                <div class="button">
                    <el-button type="primary" @click="download">下载模版</el-button>
                    <br/>
                    <input type="file"  name="fileField" @change="getFile($event)" style="opacity:0;z-index:999;position:absolute;top:115px;left:100px;">
                    <el-button type="primary" style="position:absolute;top:110px;">点击上传</el-button>
                    <div style="width:100%;height:50px;"></div>
                </div>
                <div style="font-size:12px;margin-left:60px;">只能上传由模版填写的excel文件</div>
                <div class="button" style="margin-left:50px;margin-top:30px;">
                    <el-button type="submit"  @click="submit($event)">确定</el-button>
                    <el-button @click="cancel">取消</el-button>
                </div>
            </div>
        </form>
    </div>
</div>
</template>
<script>
    let id = 1000;
    import RightMenu from "./RightMenu.vue"
    import AddDialog from "./AddDialog.vue"
    import Tree from "./../tree/src/tree.vue"
    export default {
        data() {
        return {
            data:[],
            defaultProps: {
            children: 'children',
            label: 'label'
            },
            rightMenu:false,
            left:240,
            top:459,
            node:{},
            addSon:false,
            importDialog:false,
            treeData:{},
            community:"",
            total:1,
            page:1,
            radio:"1",
            currentPage: 1,
            pagenum:20,
            areaId:null,
            tableData: [],
            multipleSelection: [],
            stbUser:{},
            editing: false,
            newNode:{},
            parentLabel:"",
            parentId:1,
            mode:1,
            addName:"",
            length:true,
            multi:true,
            first:{},
            quyuClick:true,
            quyuClick1:false,
            all:{},
            file:"",
            region:"区域",
            flag:false,
            firstData:{},
            search_value:"",
            array:[],
            }
        },
        watch:{
            areaId:function(newArea){
                this.getTableData();
            },
            search_value(search_value){
                if(!search_value){
                    this.getTableData();
                }
            },
            first(first){
                this.array = [first.id];
            }
        },
    mounted(){
            this.getTreeData();
        },
        methods: {
            //获取区域树data
            getTreeData(){
                //type = 0 区域 type = 1 社区
                var self = this;
                self.data = [];
                self.axios({
                    method:"get",
                    url:self.$iHomed("api","get_treeList")+localStorage.getItem("areaId"),
                }).then((res)=>{
                    res = res.data.data;
                    // self.nodeType([res]);//显示区域下第一个社区
                    //  if(!self.first.id){
                    //        self.areaId = res.id;
                    //    }
                    //    else{
                    //    self.areaId = self.first.id;  
                    //    }
                    if(res.type == 1){
                        self.region = "社区";
                    }
                    if(!self.first.id){
                        self.first = Object.assign({},res);
                        if(self.first.type==1){
                            self.quyuClick = false;
                        }
                    }
                    self.all = Object.assign({},res);
                    self.areaId = res.id;
                    self.data =[res];
                })
            },
            //获取用户列表
            getTableData(){
                var self = this;
                self.tableData = [];
                self.axios({
                    method:"get",
                    url:self.$iHomed("api","edit_stbUser"),                
                    params:{
                        areaId:self.areaId,
                        currentPage:self.page,
                        pageSize:self.pagenum
                    }
                }).then((res)=>{
                    self.flag = true;
                    var data = res.data.data.data;
                    self.tableData = data;
                    self.total = res.data.data.total;
                })
            },
            //父子通信传值 c=1添加子节点 c=2 添加同级节点 c=4删除节点
            change(a,b,c){
                this.rightMenu = a;
                if(b){
                    switch(c){
                        case 1 :
                        this.addName = b;
                        this.$nextTick(()=>{
                            if(this.node){
                                this.parentLabel = this.node.parent.data.label;
                                this.parentId = this.node.data.id;
                            }
                            this.mode = c;
                        });
                        //显示添加区域框
                        this.addSon = true;
                        break;
                        case 2 :
                        this.addName = b;
                        this.$nextTick(()=>{
                            this.parentLabel = this.node.parent.data.label;
                            this.parentId = this.node.data.id;
                            this.mode = c;
                        });
                        //显示添加区域框
                        this.addSon = true;
                        break;
                        case 4:
                        this.newNode = b;
                        this.node.store.remove(this.newNode);
                        break;
                    }
                }
            },
        //添加区域隐藏
        cancelAddSon(a,b){
            var self = this;
                this.addSon = a;
                if(b){
                    switch(this.mode){
                        //新建STB用户
                        case 3:
                        var putData = b;
                        for(let p in putData){
                            if(putData[p] == ""){
                                self.$alert("请补全信息!");
                                return false;
                            }
                        }
                        self.axios({
                            method:"post",
                            url:self.$iHomed("api","edit_stbUser"),
                            data:putData
                            })
                            .then((res)=>{
                                console.log(res);
                                var ret = res.data.data;
                                if(ret){
                                    self.$message({
                                        message: '新增成功',
                                        type: 'success'
                                    });
                                    self.getTableData();
                                }
                                else{
                                    self.$alert(res.data.msg);
                                }
                            })           
                        break;
                        //修改用户信息
                        case 4:
                        var putData = b;
                        for(let p in putData){
                            if(!putData[p]){
                                self.$alert("请补全信息!");
                                return false;
                            }
                        }
                        self.axios({
                            method:"put",
                            url:self.$iHomed("api","change_stbUser")+b.id,
                            data:b
                            }).then((res)=>{
                                var ret = res.data.data;
                                if(ret){
                                    self.$message({
                                        message: '修改成功',
                                        type: 'success'
                                    });
                                self.getTableData();
                                }
                                else{
                                    self.$alert(res.data.msg);
                                }
                            })               
                        break;
                    }    
                }      
            },
            //鼠标单击显示
            leftClick(data,node,store,e){
                console.log(data);
                var self = this;
                    $(".el-tree-node__content .el-tree-node__label").css("color","#000");
                    e.target.style.color="#20A0FF";
                    if(e.target.children[1]){
                        e.target.children[1].style.color="#20A0FF";
                    }
                    if(data.type == 0){
                        self.region = "区域";
                        self.quyuClick = true;
                        if(data.id == localStorage.getItem("areaId")){
                            self.first = self.all;
             
                            self.getTreeData();
                            return false;
                        }else{
                            self.first =  Object.assign({},data);
                            console.log(self.first);
                            self.areaId= self.first.id;
                        }
                        if(data.children.length != 0){
                            data.children = [];
                        }else{
                            for(let i = 0;i < node.parent.data.children.length;i++){
                                node.parent.data.children[i].children = [];
                                }
                                //点击哪个节点显示相应的社区
                                self.axios({
                                    method:"get",
                                    url:self.$iHomed("api","get_treeList")+data.id,
                                }).then((res)=>{
                                    res = res.data.data;
                                    if(res.children){
                                        data.children = res.children;
                                    }
                                    else{
                                        self.$alert("当前无权限访问！");
                                    }
                                })
                            }
                            
                        }else if(data.type == 1){
                                self.region = "社区";
                                self.quyuClick = false;
                                self.first = Object.assign({},data);
                                self.areaId= data.id;
                            }
            },
            //选择显示数量
            handleSizeChange(val) {
                //看接口最大能获取多少
                this.pagenum = val;
                this.getTableData();
            },
            //点击第几页
            handleCurrentChange(val) {
                this.page = val;
                this.getTableData();
            },
            //多选框
            handleSelectionChange(val) {
                this.multipleSelection = val;
                console.log(val);
                this.stbUser = $.extend({},this.multipleSelection[0]);
                if(this.multipleSelection.length == 1){
                    this.multi = false;
                }
                else{
                this.multi = true;
                }
                if(this.multipleSelection.length >= 1){
                    this.length = false;
                }
                else{
                    this.length = true;
                }
            },
            //双击可编辑
            dbClick(){
            var self = this;
                self.mode = 5;
                self.addSon = true;
                self.parentLabel=self.first.parentLabel;
                if(self.first.type== 0){
                    self.addName="修改区域";
                }else{
                    self.addName="修改社区";
                }
                self.treeData=$.extend({},self.first);
            },
            save: function (row) {
                this.editing = false;
                this.editeFlag= true;
                var self = this;
                var first = self.first;
                self.first.name = self.first.label;
                var pattern = /^\d+$/;
                if(!pattern.test(self.first.unitTel)){
                    self.$alert("电话要为数字并且符合规范哦！");
                    self.areaId = self.first.id;
                    self.first.unitTel = null;
                    return false;
                }
                self.axios({
                    method:"put",
                    url:self.$iHomed("api","change_tree")+self.first.id,
                    data:self.first
                    })
                    .then((res)=>{
                        var ret = res.data.data;
                        if(ret){
                            self.$message({
                                message: '修改成功',
                                type: 'success'
                            });
                            self.getTreeData();
                            self.axios({
                            method:"get",
                            url:self.$iHomed("api","change_tree")+self.first.id,
                            data:self.first
                            })
                            .then((res)=>{
                                self.first = $.extend({},res.data.data);
                                self.first.label = self.first.name;
                            })
                        }
                        else{
                            self.$alert(res.data.msg);
                        }
                    })  
            },
            //新增用户
            addUser(){
                this.$nextTick(()=>{
                    this.mode = 3;
                    this.addSon = true;
                    this.addName = "新增用户";
                    this.parentLabel = this.first.parentLabel;
                    this.nodeType([this.first]);
                    this.treeData = $.extend({},this.first);
                })
            },
            //修改用户
            reviseUser(){
                this.mode = 4;
                this.addSon = true;
                this.parentLabel = this.first.parentLabel;
                this.addName = "修改用户信息";
            },
            //删除stb USer
            delStbUser(){
                var self = this;
                self.$confirm('确定删除选中用户信息吗', ' ', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        }).then(() => {
                        //同步信息代码
                        var arr = [];
                        for(let i = 0;i<self.multipleSelection.length;i++){
                            arr.push(self.multipleSelection[i].id);
                        }
                        self.axios({
                            method:"delete",
                            url:self.$iHomed("api","edit_stbUser"),
                            data:{
                                "longIds": arr,
                            }
                        })
                        .then((res)=>{
                            var ret = res.data.data;
                            if(ret){
                                self.$message({
                                    message: '删除成功',
                                    type: 'success'
                                });
                            }
                            else{
                                self.$alert(res.data.msg);
                            }
                            self.getTableData();
                        })    
                    }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消同步操作'
                    });          
                });
            },
            
            //按钮事件
            //导入
            importData(){
                this.importDialog = true;
            },
            download(){
                window.location = "http://192.168.18.100:18181/AlarmManage/import_customer.xlsx";
            },
            //上传文件
            getFile(event) {
                this.file = event.target.files[0];
                console.log(this.file);
            },
            submit(e){
                var self = this;
                self.quyuClick1 = true;
                self.importDialog = false;
                e.preventDefault();
                let formData = new FormData();
                formData.append('file', this.file);
                //提交表格的url
                self.axios({
                    url:self.$iHomed("api","user_import")+self.first.id,
                    headers: {
                        "Content-Type": "multipart/form-data"
                    },
                    method:"post",
                    data:formData,
                }).then((res)=>{
                    if(res.data.code == 0){
                        var sReturn = window.open(res.data.data);
                            if (sReturn == null){
                            self.$alert("本站弹出窗口被屏蔽,如需查看请修改浏览器相关配置!");
                        }
                        else{
                            self.quyuClick1 = false;
                            self.$notify({
                                title: '',
                                message: '用户信息导入成功！',
                                type: 'info',
                                onClick:function(){ 
                                    self.$router.push({path: '/STBManage', replace: true});   
                                }
                            });
                            self.areaId = self.first.id;
                            self.getTableData();
                        }
                    }
                    else{
                            self.$alert(res.data.msg);
                    }
                })        
            },
            //导入取消
            cancel(){
                this.importDialog = false;
                this.$message({
                        type: 'info',
                        message: '已取消操作'
                    });       
            },
            //搜索用户
            search(){
                var self = this;
                self.axios({
                    method:"get",
                    url:self.$iHomed("api","search_user"),
                    params:{
                        currentPage:self.page,
                        pageSize:self.pagenum,
                        search:self.search_value
                    }
                }).then((res)=>{
                    var data = res.data.data.data;
                    console.log(data);
                    self.tableData = data;
                    self.total = res.data.data.total;
                })
            },
            reset(){
                this.search_value = "";
                this.getTableData();
            }
        },
        components:{
            "right-menu":RightMenu,
            "add-dialog":AddDialog,
            "my-tree":Tree
        }
    }
</script>
</script>
<style lang="" scoped>
*{
    font-size:14px;
}
    .el-tree{
        width:16%;
        position:absolute;
        top:40px;
        bottom:0;
        overflow-y:scroll;
        overflow-x:hidden;
    }
   
    .infoContent{
        position:absolute;
        top:30px;
        bottom:0;
        right:0;
        left:35%;
    }
    .infoText{
        width:96.7%;
        height:90px;
        margin-top:20px;
        border:1px solid #ccc;
    }
    .infoText div{
        display:inline-block;
        margin-right:80px;
        height:35px;
        line-height:35px;
        margin-top:7px;
        margin-left:15px;
    }
    .infoButton{
        position:fixed;
        top:140px;
        left:35%;
    }
    .el-input{
        display:inline-block;
        height:30px;
        width:100px;
    }
    .infoText span{
        display:inline-block;
        height:30px;
    }
    .el-table{
        position:fixed;
        top:190px;
        bottom:80px;
        font-size:12px;
        width:63%;
        overflow-y:scroll;
        overflow-x:hidden;
    }
    .block{
        position:fixed;
        left:40%;
        bottom:40px;
    }
    .content div.nav-wrapper{
        margin:0;
    }
    .search{
        width:300px;
    }
    .searchButton{
        position:fixed;
        top:145px;
        right:1%;
        width:520px;
    }
    .el-button{
        width:88px;
        height:28px;
        line-height:8px;
    }
    .import{
        position:fixed;
        top:200px;
        left:45%;
        width:300px;
        height:240px;
        background:#fff;
        z-index:100;
    }
    .import div:not(.title){
        margin-top:10px;
        margin-left:100px;
    }
    .title{
         width:100%;
        height:40px;
        margin-bottom:10px;
        line-height:40px;
        text-align:center;
        background:#20A0FF;
        color:#fff;
    }
    .mask{
        position:absolute;
        top:0;
        bottom:0;
        left:0;
        right:0;
        background:#000;
        opacity:0.3;
        z-index:98;
    }
    a{
        color:#000;
    }
    .el-button{
        width:88px;
        height:28px;
        line-height:8px;
    }
</style>