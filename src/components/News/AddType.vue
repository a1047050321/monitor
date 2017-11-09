<template>
    <div class="add">
        <div style="margin-top:50px;" v-if="mode ==1">
            <div>类型名称</div>
            <el-input v-model="typeName"></el-input>
        </div>
         <div v-if="mode ==1">
            <div>子类型名称</div>
            <el-input v-model="sonTypeName"></el-input>
        </div>
         <div v-if="mode ==1">
            <div>电视端模版</div>
            <ul>
            <li>1</li>
            <li>2</li>
            <li>3</li>
            </ul>
           </div>
           <div style="clear:both;"  v-if="mode ==1">
            <div style="padding-top:20px;">手机端模版</div>
            <ul>
            <li>1</li>
            <li>2</li>
            <li>3</li>
            </ul>
           </div>
            <div style="margin-top:50px;" v-if=" mode == 3">
            <el-input v-model="label"></el-input>
            </div>
        <div class="button">
            <el-button type="primary" @click="submit">提交</el-button>
            <el-button @click="cancel">取消</el-button>
        </div>
        <div class="cancel" @click="cancel">&times;</div>
    </div>
</template>
<script>
    export default{
        props:["mode","label"],
        data(){
            return {
                typeName:"",
                sonTypeName:"",
                _label:""
            }
        },
        methods:{
            cancel(){
                this.addType = false;
                this.$emit("addType",this.addType);
            },
            submit(){
                this.addType = false;
                if(this.mode == 1){
                    this.$emit("addType",this.addType,this.typeName,this.sonTypeName);
                }
                else if(this.mode == 3){
                    this.$emit("addType",this.addType,this.label,this.mode);
                }
            }
        }
    }
</script>
<style lang="" scoped>
    .add{
        position:fixed;
        top:150px;
        left:500px;
        width:400px;
        height:520px;
        background:#f0f0f0;
        z-index:99;
    }
    .add div{
        margin-left:10px;
    }
    .el-input,.el-textarea{
        width:95%;
        margin:10px 2.5%;
    }
    .button{
        position:absolute;
        bottom:10px;
        left:80px;
        text-align:center;
        margin-top:20px;
    }
    .el-button{
        width:100px;
    }
    .cancel{
        position:absolute;
        top:10px;
        right:10px;
        width:30px;
        height:30px;
        line-height:30px;
        text-align:center;
        background:#ccc;
    }
    ul li{
        width:100px;
        height:60px;
        list-style:none;
        float:left;
        border:1px solid #ccc;
        margin-left:20px;
    }
</style>