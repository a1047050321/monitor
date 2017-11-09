<template>
<div>
<div class="mask"></div>
    <div class="addCallType" v-if="mode==1">
        <div class="title">新增报警类型</div>
         <div>
            <div><span class="icon-must"></span>报警类型编号</div>
            <el-input v-model="newArea.code" autofocus></el-input>
        </div>
         <div>
            <div><span class="icon-must"></span>报警类型</div>
            <el-input v-model="newArea.name"></el-input>
        </div>
         <div>
            <div><span class="icon-must"></span>自动上报时间<span style="font-size:12px;color:red;">(单位：秒/S)</span></div>
            <el-input v-model="newArea.reportTime"></el-input>
        </div>
         <div>
            <div><span class="icon-must"></span>不重复报警</div>
            <el-select v-model="newArea.repeat" placeholder="请选择" style="width:95%;">
                <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
        </div>
         <div>
            <div><span class="icon-must"></span>不重复报警时间<span style="font-size:12px;color:red;">(单位：秒/S)</span></div>
                <el-input v-model="newArea.intervalTime"  :disabled="repeatFlag"></el-input>
            </div>
         <div>
            <div><span class="icon-must"></span>提醒文字</div>
            <el-input v-model="newArea.tipText"></el-input>
        </div>
        <div style="text-align:center;">
         <el-button type="primary" @click="ok">确定</el-button>
         <el-button type="primary" @click="cancel">取消</el-button>
        </div>
    </div>
    <div class="addCallType" v-if="mode==4">
        <div class="title">修改报警类型</div>
         <div>
            <div>报警类型编号</div>
            <el-input v-model="multipleSelection.code" disabled></el-input>
        </div>
         <div>
            <div>报警类型</div>
            <el-input v-model="multipleSelection.name" autofocus></el-input>
        </div>
         <div>
            <div>自动上报时间<span style="font-size:12px;color:red;">(单位：秒/S)</span></div>
            <el-input v-model="multipleSelection.reportTime"></el-input>
        </div>
         <div>
            <div>不重复报警</div>
            <el-select v-model="multipleSelection.repeat" placeholder="请选择" style="width:95%;">
                <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
        </div>
         <div>
            <div>不重复报警时间<span style="font-size:12px;color:red;">(单位：秒/S)</span></div>
            <el-input v-model="multipleSelection.intervalTime"  :disabled="repeatFlag"></el-input>
        </div>
         <div>
            <div>提醒文字</div>
            <el-input v-model="multipleSelection.tipText"></el-input>
        </div>
        <div style="text-align:center;">
         <el-button type="primary" @click="ok">确定</el-button>
         <el-button type="primary" @click="cancel">取消</el-button>
        </div>
    </div>
     <div class="addCallType" v-if="mode==2 &&!multipleSelection">
        <div class="title">新增消息</div>
         <div>
            <div><span class="icon-must"></span>信息</div>
            <el-input type="textarea" style="width:95%;" autofocus v-model="newInfo.content" placeholder="消息内容"></el-input>
        </div>
         <div>
            <div><span class="icon-must"></span>操作人</div>
            <el-input type="input" style="width:95%;" v-model="newInfo.username" disabled></el-input>
        </div>
         <div>
            <div><span class="icon-must"></span>接受区域</div>
             <el-select v-model="province" placeholder="选择区域" filterable @change="provinceChange" :class="{allWidth:!width,halfWidth:width}">
                <el-option-group
                    v-for="group in provinceOptions"
                    :key="group.label"
                    :label="group.label">
                    <el-option
                        v-for="item in group.options"
                        :key="item.id"
                        :label="item.label"
                        :value="item.id">
                </el-option>
            </el-option-group>
            </el-select>
            <el-select v-model="city" placeholder="请选择" @change="cityChange" filterable class="halfWidth" style="margin-left:10px;" v-if=" province">
                <el-option
                    v-for="item in cityOptions"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id">
                </el-option>
            </el-select>
             <el-select v-model="county" placeholder="请选择"  @change="countyChange" filterable class="halfWidth" style="margin-left:10px;" v-if="city">
                <el-option
                    v-for="item in countyOptions"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id">
                </el-option>
            </el-select>
             <el-select v-model="countySide" placeholder="请选择" filterable class="halfWidth" style="margin-left:10px;" v-if="county">
                <el-option
                    v-for="item in countySideOptions"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id">
                </el-option>
            </el-select>
        </div>
         <div>
            <div><span class="icon-must"></span>接收方式</div>
            <el-select v-model="newInfo.receives" multiple placeholder="选择接受方式" style="width:95%;">
                <el-option
                    v-for="item in optionMethods"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>        
            </div>
         <div>
            <div><span class="icon-must"></span>发布时间</div>
            <div class="block">
                <el-date-picker
                v-model="newInfo.publishTime"
                type="datetime"
                placeholder="选择日期时间">
                </el-date-picker>
            </div>        
        </div>
        <div class="button" style="text-align:center;">
         <el-button type="primary" @click="ok">确定</el-button>
         <el-button type="primary" @click="cancel">取消</el-button>
        </div>
    </div>
</div>
</template>
<script>
    export default{
        props:["mode","multipleSelection"],
        data(){
            return {
                newInfo:{
                    content:"",
                    areaName:"",
                    receives:[],
                    publishTime:"",
                    username:""
                },
                value:"",
                newArea:{
                    code:"",
                    name:"",
                    reportTime:"",
                    repeat:"",
                    tipText:"",
                    intervalTime:null,
                },
               optionMethods: [{
                    value: '1',
                    label: '机顶盒'
                    }, {
                    value: '2',
                    label: '短信'
                },{
                
                    value: '3',
                    label: 'APP'
                }],
                options:[{
                    value: 'true',
                    label: '是'
                    }, {
                    value: 'false',
                    label: '否'
                }],
                province: "",
                city:"",
                county:"",
                countySide:"",
                provinceOptions: [],
                cityOptions:[],
                countyOptions:[],
                countySideOptions:[],
                root:"",
                width:false,
                repeatFlag:false
            }
        },
        watch:{
            province(province){
                if(!province){
                    this.width = false;
                }else if(province){
                    this.width = true;
                }
            },
            newArea:{
                handler(newValue, oldValue) {
                    console.log(newValue);
        　　　　　　if(newValue.repeat == "false"){
                        this.repeatFlag = true;
                    }else{
                        this.repeatFlag = false;
                    }
                },   
            　　deep: true
            },
            multipleSelection:{
                handler(newValue, oldValue) {
                    console.log(newValue);
        　　　　　　if(newValue.repeat == "false"){
                        this.repeatFlag = true;
                    }else{
                        this.repeatFlag = false;
                    }
                },   
            　　deep: true
            }
        },
        mounted(){
        this.getProv();
        this.newInfo.username = localStorage.getItem("username");
        if(this.multipleSelection){
            if(this.multipleSelection.repeat == "false"){
                this.repeatFlag = true;
            }else{
                this.repeatFlag = false;
            }
        }
      },
        methods:{
            ok(){
                var self = this;
                var month = "";
                var day = "";
                //修改报警类型
                if(self.mode == 4){
                    self.$emit("editType",self.multipleSelection);
                }
                //新增报警类型
                else if(self.mode == 1){
                    for( let p in self.newArea){
                        if(!self.newArea[p]){
                            self.$alert("请补充信息");
                            return;
                        }
                    }
                    self.$emit("editType",self.newArea);
                    self.newArea = {
                        code:"",
                        name:"",
                        reportTime:"",
                        repeat:"",
                        tipText:""
                    };
                }
                //新增通知消息
                else if(self.mode ==2){
                    if(self.countySide){
                        self.newInfo.areaId = self.countySide;
                    }else if(self.county){
                        self.newInfo.areaId = self.county;
                    }else if(self.city){
                        self.newInfo.areaId = self.city;
                    }else if(self.province){
                        self.newInfo.areaId = self.province;
                    }
                    if(!self.newInfo.areaId ||!self.newInfo.content ||!self.newInfo.publishTime ||
                        !self.newInfo.receives){
                            self.$alert("请补充信息");
                            return;
                        }
                    self.newInfo.publishTime = self.dateTranslate(self.newInfo.publishTime);
                    self.$emit("newInfo",self.newInfo);
                }
            },
            cancel(){
                var self = this;
                self.newArea = {
                    code:"",
                    name:"",
                    reportTime:"",
                    repeat:"",
                    tipText:""
                };
                self.$emit("addType",self.addType);
            },
              getProv(){
                var self = this;
                self.axios({
                    method:"get",
                    url:self.$iHomed("api","get_treeList")+localStorage.getItem("areaId"),
                }).then((res)=>{
                    res = res.data.data;
                    console.log(res.children);
                    self.root = res.id;
                    self.provinceOptions = [{
                        label:"下级区域",
                        options:res.children
                        }];
                    self.provinceOptions.unshift({
                        label:"跟区域",
                        options:[{
                            areaId:res.id,
                            label:res.label
                        }]
                    })
                })
            },
            provinceChange(val){
            //val 为id
            var self = this;
            self.city = "";
            self.cityOptions = [];
             if(!isNaN(Number(val))){
                self.axios({
                    method:"get",
                    url:self.$iHomed("api","get_treeList")+val,
                }).then((res)=>{
                    res = res.data.data;
                    self.cityOptions = res.children;
                })    
             }        
            },
            cityChange(val){
            //val 为id
            var self = this;
            self.county = "";
            self.countyOptions = [];
                self.axios({
                method:"get",
                url:self.$iHomed("api","get_treeList")+val,
                }).then((res)=>{
                    res = res.data.data;
                    if(res.children.length > 0){
                        self.countyOptions = res.children;
                    }
                })      
            },
            countyChange(val){
            //val 为id
            var self = this;
            self.countySide = "";
            self.countySideOptions = [];
                self.axios({
                method:"get",
                url:self.$iHomed("api","get_treeList")+val,
                }).then((res)=>{
                    res = res.data.data;
                    if(res.children.length > 0){
                        self.countySideOptions = res.children;
                    }
                })      
            },
        }
    }
</script>
<style scoped>
    .title{
        width:100%;
        height:40px;
        margin-bottom:10px;
        line-height:40px;
        text-align:center;
        background:#20A0FF;
        color:#fff;
    }
    .addCallType{
        position:fixed;
        top:120px;
        left:35%;
        width:450px;
        height:520px;
        background:#fff;
        z-index:99;
        opacity:1;
    }
    .addCallType div:not(.title){
        margin-bottom:5px;
        margin-left:8px;
    }
    .el-input{
        width:95%;
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
    .el-date-editor.el-input.el-date-editor--datetime{
       margin-left:0;
       width:97%;
    }
    div.button{
        position:absolute;
        bottom:20px;
        left:120px;
    }
    .el-button{
        width:88px;
        height:28px;
        line-height:8px;
    }
    .allWidth{
        width:95%;
    }
    .halfWidth{
        width:21.5%;
    }
</style>