<template>
<div>
    <div class="buttonRight" v-show="rightMenu" @mouseleave="mouseleave">
         <el-button icon="plus" @click="add">增加类型</el-button>
        <br/>
        <el-button icon="delete2" @click="deleteTree">删除</el-button>
        <br/>
        <el-button icon="edit" @click="edit">编辑</el-button>
    </div>
    <el-input v-show="editClick"></el-input>
</div>
</template>
<script>
    export default{
        props:["rightMenu","top","left","node","treeData"],
        data(){
            return{
               _rightMenu :this.rightMenu,
               editClick:false,
               newNode:{}
            }
        },

         watch: {
             top:function(newT){
                var top = newT+"px";
                $(".buttonRight").css("top",top);
                console.log($(".buttonRight").css("top"));
             },
             left:function(newL){
                 var left = newL+"px";
            $(".buttonRight").css("left",left);
             }
         },
         methods:{
             add(){
                //  this.treeData.children.push(this.newNode); 
                this.newNode={ id: this.baseId++, label:"aaa", children: [] };
                //  this.node.store.append({ id: this.baseId++, label:"aaa", children: [] }, this.treeData);
                 this._rightMenu=false;
                  this.$emit("rightMenu",this._rightMenu,this.newNode, 1);
             },
             edit(){
                 var e = window.event;
                this.editClick=true;
                //获取当前选择节点的id值
                this._rightMenu=false;
                  this.$emit("rightMenu",this._rightMenu,"编辑",3);
             },
             deleteTree(){
                //  this.node.store.remove(this.treeData);
                 this._rightMenu=false;
                  this.$emit("rightMenu",this._rightMenu,this.treeData,4);
             },
             mouseleave(){
                 this._rightMenu=false;
                  this.$emit("rightMenu",this._rightMenu);
             }
         }
    }
</script>
<style lang="" >
    .buttonRight{
        position:fixed;
        width:122px;
        height:110px;
        background:red;
        border:1px solid #ccc;

    }
    .buttonRight .el-button{
        width:120px;
        border-radius:0;
        border-bottom:1px solid #ccc;
    }
</style>