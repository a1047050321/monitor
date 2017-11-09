<template>
<div>
    <div v-show="contentShow">
    <div class="nav-wrapper">
        <!-- 面包屑导航路径 -->
        <el-breadcrumb separator=">">
            <el-breadcrumb-item>
            资讯管理
            </el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="baseInfo">
        <div class="tree" @contextmenu.prevent="rightClick">
            <el-tree
            :data="data2"
            :props="defaultProps"
            node-key="id"
            default-expand-all
            :expand-on-click-node="false"
            @node-click="nodeClick"
            :render-content="renderContent"
            >
            </el-tree>
        </div>
        <!-- 右侧显示信息 -->
        <div class="infoContent" >
            <div class="infoButton" style="margin-top:10px;">
                <el-button>刷新</el-button>
                <el-button @click="addNews">新增</el-button>
                <el-button>编辑</el-button>
                <el-button>删除</el-button>
            </div>
            <div class="infoTable">
                <el-table
                    ref="singleTable"
                    :data="tableData"
                    height="40px"
                    highlight-current-row
                    @cell-click="edital"
                    @current-change="handleCurrentChange"
                    style="width: 95%">
                    <el-table-column
                    type="index"
                    label="序号"
                    width="80">
                    </el-table-column>
                     <el-table-column
                    type="selection"
                    label="全选"
                    width="55">
                    </el-table-column>
                    <el-table-column
                    property="date"
                    label="题目"
                    width="200">
                     <template scope="scope">
                        <span @dblclick="handleEdit(scope.row)" v-if="scope.row.editeFlag">{{scope.row.name}}</span>
                        <el-input v-model="scope.row.name" v-if="!scope.row.editeFlag" :value="scope.row.name"  @blur="save(scope.row)"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                    property="name"
                    label="类型"
                    width="120">
                    </el-table-column>
                    <el-table-column
                    property="date"
                    width="180"
                    label="发送时间">
                     <template scope="scope">
                        <span @dblclick="handleEdit(scope.row)" v-if="scope.row.editeFlag">{{scope.row.name}}</span>
                        <el-input v-model="scope.row.name" v-if="!scope.row.editeFlag" :value="scope.row.name"  @blur="save(scope.row)"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                    property="name"
                    label="编辑人员"
                    width="150">
                    </el-table-column>
                     <el-table-column
                    property="name"
                    label="浏览量"
                    width="120">
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
        </div>
        <right-menu @rightMenu="change" :rightMenu="rightMenu" :left="left" :top="top" :node="node" :treeData="treeData"></right-menu>
        <add-type @addType="cancel" v-show="addType" :mode="mode" :label="label"></add-type>
    </div>
</div>
<div v-show="!contentShow">
     <div class="nav-wrapper">
        <!-- 面包屑导航路径 -->
        <el-breadcrumb separator=">">
            <el-breadcrumb-item>
            资讯管理
            </el-breadcrumb-item>
            <el-breadcrumb-item>
            安全知识
            </el-breadcrumb-item>
            <el-breadcrumb-item>
            新增
            </el-breadcrumb-item>
        </el-breadcrumb>
    </div>
        <div class="block">
         <el-time-picker
                v-model="value2"
                 class="dataSel"
                :picker-options="{
                selectableRange: '18:30:00 - 20:30:00'
                }"
                placeholder="选择发布时间">
            </el-time-picker> 
            <el-button @click="getUEContent" type="primary">定时发布</el-button>
            <el-button @click="getUEContent" type="primary">立即发布</el-button>
            <el-button @click="notAdd">取消</el-button>
            <div style="clear:both;"></div>

            <div class="content-box">
                <div>题目</div>
                <el-input class="title" placeholder="题目"></el-input>
            </div>
         <div class="content-box">
            <div>来源/作者</div>
            <el-input class="author" placeholder="来源/作者"></el-input>
            </div>
            <div style="clear:both;">
            <div>
                <div>内容</div>
                <el-input type="textarea" :rows="5"></el-input>
            </div>
            <div class="picture">
                <div>图片</div>

            </div>
        </div>
    </div>
    </div>
</div>
</template>
<script>
  let id = 1000;
  import RightMenu from "./NewsMenu.vue"
  import AddType from './AddType.vue'
      export default {
    data() {
      return {
        data2: [{
          id: 1,
          label: '安全知识'
        }, {
          id: 2,
          label: '三务公开',
          children: [{
            id: 5,
            label: '政务公开'
          }, {
            id: 6,
            label: '财务公开'
          },
          {
            id: 6,
            label: '党务公开'
          }]
        }, {
          id: 3,
          label: '乡村快讯',
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        aaa:"aaa",
        rightMenu:false,
        left:240,
        top:459,
        node:{},
        addType:false,
        typeName:"",
        addSibling:false,
        treeData:{},
        communityLabel:"",
        communityId:1,
        communityAddress:"黑龙江",
        managerPhone:12111,
        communityManager:"刘晴111",
        total:1,
        page:1,
        currentPage: 1,
        maxResult:20,
        contentShow:true,
        tableData: [{
            editeFlag:true,
            name:"aaaa"
        },
        {
            editeFlag:true,
            name:"bbbb"
        }],
        multipleSelection: [],
        editing: false,
        newNode:{},
        parentLabel:"",
        parentId:1,
        mode:1,
        label:"",
        defaultMsg: '',
        config: {
          initialFrameWidth: null,
          initialFrameHeight: 300
        },
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        value1:"",
        value2:""  

        }
    },
        // this.node.parent.store.append(this.newNode, this.node.parent.data);
    methods: {
        //父子通信传值 c=1添加子节点 c=2 添加同级节点 c=4删除节点
        change(a,b,c){
            this.rightMenu = a;
            if(b){
                switch(c){
                    case 1 :
                    this.newNode = b;
                    this.$nextTick(()=>{
                        this.parentLabel = this.node.parent.data.label;
                        this.parentId = this.node.parent.data.id;
                        this.mode = c;
                    });
                    //显示添加区域框
                    this.addType = true;
                    // this.node.store.append(b, this.treeData);
                    break;
                    case 3:
                         this.$nextTick(()=>{
                            this.mode = c;
                    });
                    //显示添加区域框
                    this.addType = true;
                    break;
                    case 4:
                    this.newNode = b;
                    this.node.store.remove(this.newNode);
                    break;
                }
               
                // this.node.parent.store.append({id: 16, label:"新社区", children: [] }, this.node.parent.data);
            }
        },
        //添加区域隐藏 b=新建类型 c=新建自类型
        cancel(a,b,c){
            this.addType = a;
            var self = this;
            //编辑节点名称
            if(c == 3){
                self.label = b;
                self.node.data.label = self.label;
            }else  //添加新类型
            if(b){
                self.newNode.label = b;
                self.node.store.append(self.newNode, self.treeData);
            }

        },
        //节点点击
         nodeClick(data, node, store){
             var e = window.event;
             var self = this;
              console.log(e.target);
              self.rightMenu = true;  
               self.$nextTick(()=>{
                self.top = e.clientY; 
                self.left = e.clientX;   
                self.node = node;
                self.treeData = data;
                //获取选中节点的label
                self.communityLabel =node.data.label;
                self.label = e.target.textContent;
            }) 
            //  node.store.append({ id: self.baseId++, label:  self.aaa, children: [] }, data);
        },
            remove:function(store, data) {
                store.remove(data);
            },
            renderContent:function(createElement, { node, data, store }) {
                // console.log(this.node);
                return createElement('span', [
                    createElement('span', node.label)
                ]);
            },
            //选择显示数量
             handleSizeChange(val) {
                 //看接口最大能获取多少
                console.log(`每页 ${val} 条`);
                this.maxResult = val;
                // this.getData();
            },
            //点击第几页
            handleCurrentChange(val) {
                console.log(val);
                this.page = val;
                // this.getData();
                console.log('当前页: ${val}');
            },
            //多选框
             handleSelectionChange(val) {

             },
              edital(row, column, cell, event){
                    if(column.label == "题目"){
                        //弹出详情框 row是当前所在行
                        console.log("题目按钮");
                    }
             },
             //新增
             addNews(){
                 this.contentShow = false;
             },
             //双击可编辑
             dbClick(){
                this.editing = true;
                this.$nextTick(function () {
                // this.$refs.input.focus();
                })
                },
                save: function (row) {
                this.editing = false;
                row.editeFlag= true;
                },
                //同步信息
                syncInfo(){
                    this.$confirm('开始同步homed监控系统区域及监控信息，操作将更新覆盖已有信息', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                        }).then(() => {
                        //同步信息代码
                        
                        this.$message({
                            type: 'success',
                            message: '同步成功！'
                        });
                        }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消同步操作'
                        });          
                        });
                },
                //表双击可编辑
                 handleEdit:function(row){
                    //遍历数组改变editeFlag
                    console.log(row);
                    row.editeFlag = false;

                },
                 getUEContent() {
                    let content = this.$refs.ue.getUEContent();
                    this.$notify({
                    title: '获取成功，可在控制台查看！',
                    message: content,
                    type: 'success'
                    });
                    console.log(content)
                },
                notAdd(){
                    this.contentShow = true;
                }
        },
        components:{
            "right-menu":RightMenu,
            "add-type":AddType,
        }
      }
</script>
<style lang="" scoped>
    .baseInfo{
        width:100%;
        height:750px;
    }
    .tree{
        width:200px;
        height:100%;
    }
    .el-tree{
        height:100%;
    }
    .infoContent{
        position:absolute;
        top:40px;
        right:0;
        left:480px;
        height:750px;
    }
    .infoText{
        width:95%;
        height:120px;
        border:1px solid #ccc;
    }
    .infoText div{
        display:inline-block;
        margin-right:100px;
        margin-bottom:5px;
    }
    .el-input,.infoText span{
        display:inline-block;
        height:30px;
        width:100px;
        margin-right:100px;

    }
    .el-table{
        font-size:14px;
        margin-top:10px;
    }
    .content div.nav-wrapper{
        margin:0;
    }
    .block div{
        margin-bottom:20px;
    }
   .el-input{
       display:inline-block;
        width:300px;
    }
    .el-input.title,.el-input.author{
        width:400px;
    }
    .content-box{
        float:left;
        margin-bottom:0;
    }
    .el-textarea{
        width:900px;
        height:60px;
    }
    .picture{
        height:100px;
        margin-top:60px;
    }
</style>