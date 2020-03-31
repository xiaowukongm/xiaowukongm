<template>
  <div>
    <!--    面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    卡片容器-->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="请输入搜索内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table border :data="userList" stripe style="width: 100%">
        <el-table-column type="index" label="#">
        </el-table-column>
        <el-table-column prop="username" label="姓名">
        </el-table-column>
        <el-table-column prop="mobile" label="电话">
        </el-table-column>
        <el-table-column prop="email" label="邮箱">
        </el-table-column>
        <el-table-column prop="role_name" label="角色">
        </el-table-column>
        <el-table-column label="状态">
          <template v-slot="scope">
            <el-switch v-model="scope.row.mg_state"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="warning" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
    export default {
      name: "Users",
      data(){
          return{
            // 用户数据请求参数
            queryParams:{
              query:',',
              pagenum:1,
              pagesize:3,
            },
            //用户数据列表
            userList:[]
          }
      },
      created() {
        this.getUserList()
      },
      methods:{
        getUserList(){
          this.$http.get("users",{params:this.queryParams})
          .then(response=>{
            this.userList = response.data.users
            // console.log(response.data.users)
          })
        }
      }
    }
</script>

<style scoped>
.el-table{
  margin-top: 20px;
  font-size: 13px;
}
</style>
