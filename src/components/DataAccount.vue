<template>
<div>
<div class="table-responsive">
<table class="table table-bordered">
<thead>
<tr>
<th>姓名</th>
<th>性别</th>
</tr>
</thead>
<tbody>
<tr v-for="item in list">
<td>
<span v-if="!editing" @dblclick="edit">{{item.wenzi}}</span>
<input type="text"
class="form-control"
ref="input"
v-if="editing"
:value="item.wenzi"
v-model="item.wenzi"
@blur="save">
</td>
<td>
<span v-if="!editing" @dblclick="edit">{{item.gender}}</span>
<input type="text"
class="form-control"
ref="input"
v-if="editing"
:value="item.gender"
v-model="item.gender"
@blur="save">
</td>
</tr>
</tbody>
</table>
</div>
</div>
</template>

<script type="text">
export default {
data: function () {
return {
editing: false,
list: [
{wenzi: '迪热力巴', gender: '女性'},
{wenzi: '鹿晗', gender: '男性'},
],
}
},
methods: {
edit: function () {
this.editing = true
this.$nextTick(function () {
this.$refs.input.focus()
})
},
save: function () {
this.editing = false
}
}
}
</script>