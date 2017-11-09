<template>
    <div class="handlePending">
        <div class="nav-wrapper">
            <!-- 面包屑导航路径 -->
            <el-breadcrumb separator=">">
                <el-breadcrumb-item>监控查看</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="buttonHandle" style="margin-bottom:10px;">
           <ul class="handleOpeator">
            <li class="call">
                <div><el-button type="primary" @click="ulbtnClick">致电</el-button></div>
            </li>
            <li class="send">
                <div><el-button type="primary" @click="ulbtnClick">上报</el-button></div>
            </li>
            <li class="commit">
                <div><el-button type="primary" @click="ulbtnClick">提交</el-button></div>
            </li>
            <li class="end">
                <div><el-button type="primary" @click="ulbtnClick">解除</el-button></div>
            </li>
            <li class="detail">
                <div><el-button type="primary" @click="ulbtnClick">详情</el-button></div>
            </li>
        </ul>
        </div>
        <div class="player">
            <div class="info">报警人信息:{{row.name +"  "+ row.createDate +"  "+ row.alarmTypeName}}</div>
            <!--<div class="mp4">
                <video-player  class="video-player-box"
                    ref="videoPlayer"
                    :options="playerOptions"
                    :playsinline="true"
                    customEventName="customstatechangedeventname"
                    @play="onPlayerPlay($event)"
                    @pause="onPlayerPause($event)"
                    @ended="onPlayerEnded($event)"
                    @statechanged="playerStateChanged($event)"
                    @ready="playerReadied">
                </video-player>
            </div>
            -->
            <div id="myPlayer" :data-programid="getProgramID"></div>
            <div class="monitorInfo" v-if="!buttonShow">
                <span class="icon-success" style="position:absolute;left:80px;top:60px;"></span>
                <div class="destription">
                {{}}报警已解除</div>
                <div style="text-align:center;">
                    <el-button type="primary" @click="removeConfirm">确定</el-button>
                </div>
            </div>
        </div>
        <edital-info v-if="editalInfo" @editalInfo="editalInfoReturn" :row="row" :alarmType="alarmType"></edital-info>
        <no-monitor :mode="mode" :row="row" v-if="liClick" :monitor="monitor" @liClick="opeator" @buttonShow="infoChange"></no-monitor>
    </div>
</template>
<script>
import NoMonitor from './NoMonitor'
import EditalInfo from "./EditalInfo"
    export default{
        props:["moniInfoShow","alarmType"],
        data(){
            return {
                row:{},
                liClick:false,
                monitor:1,
                editalInfo:false,
                buttonShow:true,
                mode:1,
                initFlag: false,
                // playerOptions: {
                // // videojs options
                // muted: true,
                // language: 'en',
                // playbackRates: [2.0, 4.0, 6.0],
                // sources: [
                //     // {
                // //     type: "video/mp4",
                // //     src: "https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm"
                // // },
                // {
                //         type: "application/x-mpegURL",
                //         src: "http://httpdvb.slave.homed.me:13164/playurl?accesstoken=R59A3E95FU508C6023KB2D06C01I6F18A8C0P0MF430AWDAD92CC0EF1&programid=4202006972&playtype=live&playtoken=ABCDEFG&protocol=hls"
                // }],
                // poster: "",
                // }
            }
        },
        components:{
            "no-monitor":NoMonitor,
            "edital-info":EditalInfo
        },
        methods:{
            //显示详情框
             editalInfoReturn(a){
                this.editalInfo = a;
            },
            //选中相应按钮
            opeator(a){
                this.liClick=a;
            },
            //显示解除框
            infoChange(a){
                this.buttonShow = a;
            },
            //解除确定按钮
            removeConfirm(){
                this.buttonShow=true;
                this.liClick=false;     
            },
            getPlayUrl: function () {
                var src = "http://httpdvb.slave.homed.me:13164/playurl?accesstoken=R59F7DD4DU50960067KB2D625FDI6E11A8C0P0MF44AEWDBA62348FD1&programid=4202001712&playtype=live&playtoken=ABCDEFG&protocol=hls";
                var self = this;
                console.log(self.row);
                if(self.row.monitorUrl){
                    src = self.row.monitorUrl;
                }
                console.log(src);
                return src;
            },
            // popover(){
            //     $(".el-popover").css("display","none");
            // },
            //  // listen event
            // onPlayerPlay(player) {
            //     // console.log('player play!', player)
            // },
            // onPlayerPause(player) {
            //     // console.log('player pause!', player)
            // },
            // // ...player event
        
            // // or listen state event
            // playerStateChanged(playerCurrentState) {
            //     // console.log('player current update state', playerCurrentState)
            // },
        
            // // player is ready
            // playerReadied(player) {
            //     console.log('the player is readied', player)
            //     // you can use it to do something...
            //     // player.[methods]
            // },
            //6个按钮点击事件
            ulbtnClick(){
                var self = this;
                $("ul.handleOpeator").click(function(e){
                    var e = e||window.event,
                        target = e.target ||e.srcElement;
                    switch(target.textContent){
                        case "致电":
                        self.mode =1;
                        self.liClick = true;
                        break;
                        case "上报":
                        self.mode =2;
                        self.liClick = true;
                        break;
                        case "提交":
                        self.mode =3;
                        self.liClick = true;
                        break;
                        case "解除":
                        self.mode =4;
                        self.liClick = true;
                        self.monitor = self.row.monitor;
                        break;
                        case "详情":
                        self.editalInfo = true;
                        self.monitor = self.row.monitor;
                        break;
                        case "下一条":
                        self.mode =6;
                        self.liClick = true;
                        break;
                    }
                })
            },
        },
         computed: {
            // player() {
            //     return this.$refs.videoPlayer.player
            // },
            getProgramID: function () {
                if (this._isMounted) {// 触发播放路径更新
                    SewisePlayer.toPlay(this.getPlayUrl(), "视频会议", 0, true);
                    SewisePlayer.toFullScreen();                
                }
                return this.pid;
            }
        },
        mounted(){
            var row = this.$route.query.row;
            var type =this.$route.query.type;
            if(type){
                var myPlayer = document.getElementById("myPlayer");
                // myPlayer.webkitRequestFullScreen(); 
                if (myPlayer.requestFullscreen) { 
                    myPlayer.requestFullscreen(); 
                    }
                    //FireFox 
                else if (myPlayer.mozRequestFullScreen) { 
                    myPlayer.mozRequestFullScreen(); 
                    }
                    //Chrome等 
                else if (myPlayer.webkitRequestFullScreen) { 
                    myPlayer.webkitRequestFullScreen(); 
                    }
                    //IE11
                else if (myPlayer.msRequestFullscreen) {
                    myPlayer.msRequestFullscreen();
                    }
                }
            //row是点击的信息
            if(row){
                this.row = JSON.parse(row);
                console.log(this.row);
            }
           
            // this.playerOptions.sources = [{}];
            this.ulbtnClick();
            SewisePlayer.setup({
            server: "vod",
            type: "m3u8",
            videourl: this.getPlayUrl(),
            skin: "vodWhite",
            title: "视频监控",
            lang: 'zh_CN',
            claritybutton: 'disable',
            draggable: "true",
            topbardisplay: 'disable'
        }, "myPlayer");

        SewisePlayer.onPlayTime(function(time, id){
            // console.log(id + " onPlayTime : " + time);
        });
        }
    }
</script>
<style lang="" scoped>
    #myPlayer{
        width:100%;
        height:100%;
    }
    .player{
        width:95%;
        height:600px;
    }
    .info{
        width:100%;
        height:50px;
        line-height:50px;
        background:#f0f0f0;
    }
    
    .buttonHandle{
        width:100%;
        height:30px;
        margin-top:10px;
    }
    .handle{
        position:fixed;
        top:95px;
        left:250px;
    }
    .el-button:first-child{
        margin-left:10px;
    }
    .el-button{
        width:88px;
        height:28px;
        line-height:8px;
    }
    .el-popover{
        box-shadow:none;
        border:0;
        padding:0;
        margin-left:24px;
        margin-top:6px;
    }
    .handleOpeator li{
        float:left;
    }
    .video-player.video-player-box >div{
        width:1100px;
        height:550px;
    }
    .monitorInfo {
        width: 510px;
        height: 200px;
        position: fixed;
        bottom: 40px;
        right: 0;
        background: #fff;
    }
.destription{
    width:300px;
    height:100px;
    line-height:100px;
    text-align:center;
    margin-top:40px;
    margin-left:60px;
}
</style>