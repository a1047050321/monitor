<template>
    <div>测试homed</div>
</template>
<script>
import md5 from "js-md5"
    export default{
        data(){
            return {

            }
        },
        mounted(){
            this.getAjax();
        },
        methods:{
            getAjax(){
                var self = this;
                function promiseTest(){
                    var p = new Promise(function(resolve,rejected){
                    self.axios({
                        method:"get",
                        url:self.$iHomed("api","get_treated")
                    }).then((res)=>{
                        var datalist = res.data.data.data,
                        arr = [];
                        for(let i = 0; i < datalist.length;i++){
                            if(datalist[i].monitor){
                                arr.push(datalist[i].monitor);
                            }else{
                                arr.push("");
                            }
                        }
                        resolve(arr);
                    })
                })
                return p;
                }
                promiseTest().then(function(data){
                    console.log(data);
                })
                }
            },
        }
</script>