<template>
<div>
<div class="mask"></div>
    <div class="editalInfo"  v-if="buttonClick ==1">
        <div class="title">添加管理员</div>
        <div class="content-box">
            <div><span class="icon-must"></span>登录名</div>
            <el-input v-model="newGuest.username"></el-input>
        </div>
        <div class="content-box">
            <div><span class="icon-must"></span>登录密码</div>
            <el-input type="password" v-model="newGuest.password"></el-input>
        </div>
        <div class="content-box">
            <div><span class="icon-must"></span>管理员类型</div>
            <el-select v-model="newGuest.level" placeholder="选择管理员类型" style="width:75%;" :disabled="quan">
                <el-option
                    v-for="item in guests"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>  
        </div>
        <div class="content-box">
            <div><span class="icon-must"></span>管理报警类型</div>
            <el-select v-model="newGuest.alarmType" multiple  placeholder="选择报警类型" style="width:75%;">
                <el-option
                    v-for="item in alarmType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
            </el-select>        
         </div>
         <div style="clear:both;"></div>
         <div class="content-box1">
            <div>管理区域</div>
             <el-select v-model="province" :disabled="edit" placeholder="选择区域" @change="provinceChange" :class="{allWidth:!width,halfWidth:width}">
                <el-option-group
                    v-for="group in provinceOptions"
                    :key="group.label"
                    :label="group.label">
                    <el-option
                        v-for="item in group.options"
                        :key="item.areaId"
                        :label="item.label"
                        :value="item.areaId">
                </el-option>
             </el-option-group>
            </el-select>
            <el-select v-model="city" placeholder="请选择" @change="cityChange" class="halfWidth" style="margin-left:10px;" v-if=" province && (province != root || province !=multipleSelection.areaName)">
                <el-option
                    v-for="item in cityOptions"
                    :key="item.areaId"
                    :label="item.label"
                    :value="item.areaId">
                </el-option>
            </el-select>
             <el-select v-model="county" placeholder="请选择" class="halfWidth" style="margin-left:10px;" v-if="city">
                <el-option
                    v-for="item in countyOptions"
                    :key="item.areaId"
                    :label="item.label"
                    :value="item.areaId">
                </el-option>
            </el-select>
         </div>
          <div class="content-box1">
            <div><span class="icon-must"></span>姓名</div>
            <el-input v-model="newGuest.name"></el-input>
         </div>
          <div class="content-box1">
            <div><span class="icon-must"></span>电话</div>
            <el-input v-model="newGuest.tel" type="text"></el-input>
         </div>
         <div class="content-box1">
            <div><span class="icon-must"></span>邮箱</div>
            <el-input v-model="newGuest.mail"></el-input>
         </div>
          <div class="confirm" style="text-align:center;margin-top:10px;">
         <el-button type="primary" @click="ok">确定</el-button>
         <el-button type="primary" @click="cancel">取消</el-button>
     </div>
    </div>
    <div class="editalInfo"  v-if="buttonClick ==2 && multipleSelection">
        <div class="title">{{edital}}管理员</div>
        <div class="content-box">
            <div>登录名</div>
            <el-input v-model="multipleSelection.userName" disabled></el-input>
        </div>
        <div class="content-box">
            <div>登录密码</div>
            <el-input v-model="disabled" disabled></el-input>
        </div>
        <div class="content-box">
            <div>管理员类型</div>
            <el-select v-model="multipleSelection.type" placeholder="选择管理员类型" style="width:75%;" :disabled="quan">
                <el-option
                    v-for="item in guests"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>  
            
        </div>
        <div class="content-box">
            <div>管理报警类型</div>
            <el-select v-model="multipleSelection.alarmId" :disabled="edit" multiple  placeholder="选择报警类型" style="width:75%;">
                <el-option
                    v-for="item in alarmType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
            </el-select>        

        </div>
         <div style="clear:both;"></div>
         <div class="content-box1">
            <div>管理区域</div>
            <el-select v-model="province" :disabled="edit" placeholder="选择区域" filterable @change="provinceChange" :class="{allWidth:!width,halfWidth:width}">
                <el-option-group
                    v-for="group in provinceOptions"
                    :key="group.label"
                    :label="group.label">
                    <el-option
                        v-for="item in group.options"
                        :key="item.areaId"
                        :label="item.label"
                        :value="item.areaId">
                </el-option>
            </el-option-group>
            </el-select>
            <el-select v-model="city" placeholder="请选择" @change="cityChange" filterable class="halfWidth" style="margin-left:10px;" v-if=" province && province != root && province !=multipleSelection.areaName">
                <el-option
                    v-for="item in cityOptions"
                    :key="item.areaId"
                    :label="item.label"
                    :value="item.areaId">
                </el-option>
            </el-select>
             <el-select v-model="county" placeholder="请选择" filterable class="halfWidth" style="margin-left:10px;" v-if="city">
                <el-option
                    v-for="item in countyOptions"
                    :key="item.areaId"
                    :label="item.label"
                    :value="item.areaId">
                </el-option>
            </el-select>
         </div>
          <div class="content-box1">
            <div>姓名</div>
            <el-input  v-model="multipleSelection.name" :disabled="tongJi"></el-input>
         </div>
          <div class="content-box1">
            <div>电话</div>
            <el-input v-model="multipleSelection.tel" type="text" :disabled="tongJi"></el-input>
         </div>
         <div class="content-box1">
            <div>邮箱</div>
            <el-input v-model="multipleSelection.mail" :disabled="tongJi"></el-input>
         </div>
         <div class="confirm" style="text-align:center;margin-top:10px;">
         <el-button type="primary" @click="ok">确定</el-button>
         <el-button type="primary" @click="cancel">取消</el-button>
     </div>
    </div>
</div>
</template>
<script>
    export default{
        props:["buttonClick","multipleSelection","first","alarmType","edital"],
        data(){
            return {
                addManage:false,
                // type:JSON.parse(this.$iHomed.getCookie("alarmType")),
                newGuest:{
                    alarmType:[],
                    areaId:null,
                    "level": null,
                    "mail": "",
                    "name": "",
                    "password": "",
                    "tel": null,
                    "username": ""
                },
                rootId:[],
                quan:false,
                disabled:"*********",
                guests:[{
                    value:10,
                    label:"普通管理员"
                },    
                {
                    value:50,
                    label:"高级管理员"
                },
                {
                    value:100,
                    label:"超级管理员"
                }],
                role:null,
                edit:false,
                tongJi:false,
                province:"",
                city:"",
                county:"",
                provinceOptions: [],
                cityOptions:[],
                countyOptions:[],
                root:"",
                width:false
            }
        },
        watch: {
            role(role){
                if(role == 100){
                        //省
                    if(first.fid == 1){
                         this.guests = [{
                            value:100,
                            label:"超级管理员"
                        }];
                    }else{
                        this.guests = [{
                            value:10,
                            label:"普通管理员"
                        },    
                        {
                            value:50,
                            label:"高级管理员"
                        }];
                    }
                }
                else if(role == 50){
                    this.guests = [{
                        value:10,
                        label:"普通管理员"
                    },    
                    {
                        value:50,
                        label:"高级管理员"
                    }];
                }
                else{
                    if(first.type == 1){
                        this.quan= true;
                    }else{
                        this.quan = false;
                        this.guests = [{
                        value:10,
                        label:"普通管理员"
                    },    
                    {
                        value:50,
                        label:"高级管理员"
                    }];
                    }
                }
            },
            province(province){
                if(!province){
                    this.width = false;
                }else {
                    if(this.multipleSelection && province == this.multipleSelection.areaName){
                        this.width = false;
                    }else{
                    this.width = true;
                    }
                }
            },
            buttonClick(buttonClick){
                if(buttonClick == 1){
                    this.province = "";
                    this.edit = false;
                    this.quan = false;
                    this.tongJi = false;
                }else{
                   
                }
            },
            first (first) { 
                this.rootId = localStorage.getItem("rootId").split(",");
                this.newGuest.areaId = first.id;
                var role = localStorage.getItem('role');
            },
           multipleSelection(multipleSelection){
                //修改个人信息
                if(multipleSelection){
               if(multipleSelection.areaName){
                    this.province = multipleSelection.areaName;
                    }
                    if(multipleSelection.name == localStorage.getItem("username")){
                    this.edit = true;
                    this.quan = true;
                    this.tongJi = false;
                }else if(multipleSelection.areaId ==localStorage.getItem("areaId") &&multipleSelection.type >=this.role){
                    this.edit = true;
                    this.quan = true;
                    this.tongJi = true;
                }else{
                     this.edit = false;
                    this.quan = false;
                    this.tongJi = false;
                }
            }   
           }
        },
        mounted(){
            this.role = localStorage.getItem('role');
            this.getProv();
        },
        methods:{
             getProv(){
                var self = this;
                self.axios({
                    method:"get",
                    url:self.$iHomed("api","get_treeList")+localStorage.getItem("areaId"),
                }).then((res)=>{
                    res = res.data.data;
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
            self.cityOptions = [];
             if(typeof (val) == Number){
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
            self.countyOptions = [];
                self.axios({
                method:"get",
                url:self.$iHomed("api","get_treeList")+val,
                }).then((res)=>{
                    res = res.data.data;
                    if(res.children.length > 0){
                        this.flag = true;
                        self.cityOptions = res.children;
                    }else{
                        this.flag = false;
                    }
                })      
            },
            ok(){
                var self = this;
                var pattern = /^\d+$/;
                //新增
                if(this.buttonClick == 1){
                    //新增用户确定操作
                    if(!pattern.test(self.newGuest.tel)){
                        self.$alert("电话要为数字并且符合规范哦！");
                        return false;
                    }
                    if(self.county){
                        self.newGuest.areaId = self.county;
                    }else if(self.city){
                        self.newGuest.areaId = self.city;
                    }
                    else if(self.province){
                        self.newGuest.areaId = self.province;
                    }
                    for(let i in this.newGuest){
                        if(this.newGuest[i] ||this.newGuest[i] == "0"){
                            continue;
                        }
                        else {
                            this.$alert("请补全信息！");
                            return false;
                        }
                    }
                    this.$emit("addManage",this.addManage,this.newGuest);
                        this.newGuest = {
                        alarmType:[],
                        areaId:null,
                        "level": null,
                        "mail": "",
                        "name": "",
                        "password": "",
                        "tel": null,
                        "username": ""
                    };
                }
                else{
                   //修改用户确定操作
                    if(!pattern.test(self.multipleSelection.tel)){
                        self.$alert("电话要为数字并且符合规范哦！");
                        return false;
                    }
                    self.multipleSelection.level = self.multipleSelection.type;
                    self.multipleSelection.username = self.multipleSelection.userName;
                    if(self.county){
                        self.multipleSelection.areaId = self.county;
                    }else if(self.city){
                        self.multipleSelection.areaId = self.city;
                    }
                    else if(self.province){
                        self.multipleSelection.areaId = self.province;
                    }
                    self.multipleSelection.username = self.multipleSelection.userName;
                    self.$emit("addManage",self.addManage,self.multipleSelection);
                    self.county = "";
                    self.city = "";
                }
            },
            cancel(){
                 this.$message("已取消操作！");
                this.$emit("addManage",this.addManage);
                    this.newGuest = {
                        alarmType:[],
                        areaId:null,
                        level: null,
                        mail: "",
                        name: "",
                        password: "",
                        tel: null,
                        username: ""
                    };
                     this.city = "";
                    this.county =""; 
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
    .editalInfo{
        position:fixed;
        top:100px;
        left:500px;
        width:480px;
        height:450px;
        background:#fff;
        z-index:99;
        opacity:1;
    }
    .table_cell{
        float:left;
    }
    .table_cell div{
        width:280px;
        height:30px;
        line-height:30px;
        margin:0 0 10px 20px;
        font-size:14px;
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
    .content-box{
        width:240px;
        height:60px;
        float:left;
    }
    .content-box .el-input{
        width:180px;
    }
    .content-box div:not(.title){
        margin-left:28px;
    }
    .content-box1 div:not(.halfWidth){
        margin-left:28px;
    }
    .el-input{
        margin-top:0;
        width:420px;
        -webkit-appearance:none;
    }
    .el-button{
        width:88px;
        height:28px;
        line-height:8px;
    }
     .allWidth{
       width:420px;

    }
    .halfWidth{
        width:27.2%;
        margin-left:28px;
    }
</style>