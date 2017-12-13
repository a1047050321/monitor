<template>
    <div class='pop' v-show="dialog" v-if="multipleSelection">
        <p><b>开户账户:</b>{{multipleSelection.name}}</p>
        <p><b>原总空间:</b>{{multipleSelection.totalSpace}}</p>
        <p><b>已用空间:</b>{{multipleSelection.usedSpace}}</p>
        <p style='margin-bottom:0;'><b>扩容后空间:</b><input type='number' class='input' height='20' v-model="totalSpace"/>G</p>
        <div class="tips">不能低于已用空间！</div>
        <div>
            <el-button class='dialogBtn' @click='updateUser'>确定</el-button>
            <el-button type="primary" class='dialogBtn' @click="cancel">取消</el-button>
        </div>              
    </div>
</template>
<script>
    export default{
        props:["multipleSelection","dialog"],
        data(){
            return {
                _dialog : this.dialog,
                totalSpace:0,
                Loading: null,
            }
        },
        mounted(){
        },
        methods:{
            loading(param) {
				
				param = Object.assign({
							target: ".userManage",
							text: "玩命扩容中，请稍候..."
						}, param || {});
				
				this.Loading = this.$loading(param);
                console.log(this.Loading);

			},
			// 关闭数据加载提示
			closeLoading() {
				this.$nextTick(() => {
					this.Loading.close();
				});				
			},
             updateUser(){
                 var self = this;
                 self._dialog = false;
                self.$emit("dialog",this._dialog);
                $(".userManage").css("opacity", "1");
                self.loading();
                console.log(111);
                setTimeout(function(){
                    self.closeLoading();
                },3000);
            },
            cancel(){
                this._dialog = false;
                this.$emit("dialog",this._dialog);
                $(".userManage").css("opacity", "1");
                this.$message('已取消操作');
            }                   
        }
    }
</script>
<style>
    .pop{
        width:400px;
        height:210px;
        position:absolute;
        padding-top:20px;
        top:100px;
        left:500px;
        text-align:center;
        color:#000;
        z-index:100;
        background:#fff;
    }
    .pop p,
    .pop div{
        margin-top:5px;
    }
    .tips{
        width:150px;
        height:20px;
        margin-left:180px;
        color:red;
        font-size:10px;
    }
</style>