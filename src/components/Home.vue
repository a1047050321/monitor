<template>
  <div id="app">
    <el-row class="app-content">
      <el-col :span="4" class="menu-wrapper">
        <!-- 菜单导航头部 -->
        <menu-header class="menu-header"></menu-header>
        <!-- 菜单列表 -->
        <menu-content :contentParam="contentParam" class="menu-content"></menu-content>
      </el-col>
      <el-col :span="20" class="content-wrapper">
          <router-view  :showType="showType" :alarmType="alarmType" @callType="alarmChange" :newAlarm="newAlarm"></router-view>
      </el-col>
    </el-row>
    <app-footer :footerParam="footerParam"></app-footer>        
  </div>
</template>

<script>
import MenuHeader from "@/components/User/MenuHeader";
import MenuContent from "@/components/User/MenuContent";
import AppFooter from "@/components/User/AppFooter";
export default {
  components: {
    MenuHeader,
    MenuContent,
    AppFooter,
  },
  name: "app",
  data() {
    return {
      headerParam: {
        systemname: "",
        systemids: [],
        sysList: sysList
      },
      menuList:[],
      contentParam: {
        role: null,
        list:[]
      },
      footerParam: {
        username: ""
      },
      alarmType:[],
      showType:{},
      newAlarm:{}
    }
  },
  mounted() {
     this.contentParam = {
      role:localStorage.getItem('role')
    };
    this.footerParam = {
      username:localStorage.getItem('username')
    };
    
    this.getAlarm();
  },
  methods:{
     //获取报警类型信息
        getAlarm(){
             var self = this;
              self.axios({
                  method:"get",
                  url:self.$iHomed("api","alarmType_list"),
                  data:{
                      currentPage:self.page,
                      pageSize:self.pagenum
                  }
              })
              .then((res)=>{
                  res = res.data.data;
                    for(let i = 0;i<res.data.length;i++){
                      self.alarmType.push({
                          value:res.data[i].id,
                          label:res.data[i].name
                      })
                      self.showType[res.data[i].id] = res.data[i].name;
                  }
                  self.$store.commit("ALARMTYPE",self.alarmType);
              })
        },
        alarmChange(a,b){
          this.showType = a;
          this.alarmType = b;
        }
  }
  }
</script>
<style>
  .content-wrapper{
    height:100%;
  }
</style>
