<template>
  <div id="rights">
    <!--    面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    卡片容器-->
    <el-card class="box-card">
      <el-table border :data="rightsList" stripe style="width: 100%">
        <el-table-column type="index" label="#">
        </el-table-column>
        <el-table-column prop="authName" label="权限名称">
        </el-table-column>
        <el-table-column prop="path" label="路径">
        </el-table-column>
        <el-table-column prop="level" label="权限等级">
            <template v-slot:="scope">
              <el-tag v-if="scope.row.level === '0'">一级</el-tag>
              <el-tag v-else-if="scope.row.level === '1'" type="success">二级</el-tag>
              <el-tag v-else-if="scope.row.level === '2'" type="warning">三级</el-tag>
            </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
  export default({
    name: "Rights",
    data(){
      return{
        // 权限列表
        rightsList:[],
      }
    },
    created(){
      this.getRightList()
    },
    methods:{
      // 获取权限列表
      getRightList(){
        this.$http.get("rights/").then(res=>{
          if(res.data.result=="success"){
            this.rightsList = res.data.right_list
            console.log(res.data.right_list)
          }
        })
      }
    }
  })
</script>
<style>

</style>
