<template>
<div class="content">
    <div class="nav-wrapper">
        <!-- 面包屑导航路径 -->
        <el-breadcrumb separator=">">
            <el-breadcrumb-item>
                首页
            </el-breadcrumb-item>
            <el-breadcrumb-item >{{status}}</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <el-menu theme="white" :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
     <router-link to="/index/bMap">
        <el-menu-item index="1" @click="itemClick">
               报警地图
        </el-menu-item>
        </router-link>
        <router-link to="/index/echarts">
        <el-menu-item index="2" @click="itemClick1">
        趋势统计
        </el-menu-item>
        </router-link>
    </el-menu>
    <keep-alive>
        <router-view :alarmType="alarmType" :areaId="areaId" @areaId="getAeraId"></router-view>
    </keep-alive>
</div>
</template>
<script>
    export default{
        props:["alarmType"],
        data(){
            return {
                pending:0,
                processed:0,
                activeIndex:"1",
                tableData: [],
                length:1,
                status:"报警地图",
                areaId:0,
            }
        },
        methods:{
            //获取待处理，已处理的length
            itemClick(){
                    this.status = "报警地图";
                },
                itemClick1(){
                    this.status = "趋势统计";
                },
                getUntreated(a){
                    this.pending = a;
                },
                getTreated(a){
                    this.processed = a;
                },
                getAeraId(a){
                    this.areaId = a;
                }
        },
    }
</script>
<style lang="" scoped>
    .nav-wrapper{
        padding-bottom:5px;
        margin-top:5px;
    }
    .nav-wrapper span{
         font-size:15px;
    }
    .router-link-active{
        color:orange
    }
     .content div:not(.nav-wrapper){
        margin-top:10px;
    }
     .content div.el-badge{
        margin-top:0;
    }
     .content div.nav-wrapper{
        padding-top:0;
    }
    ul.el-menu{
        position:fixed;
        top:0;
        right:0;
        width:230px;
    }
    ul.el-menu li{
        height:40px;
        line-height:40px;
    }
    .badge{
        height:24px;
        line-height:24px;
    }
div.name-wrapper i{
    color:#20A0ff;
}
.el-button{
        width:88px;
        height:28px;
        line-height:8px;
    }
</style>