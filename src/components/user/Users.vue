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
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-tooltip class="item" effect="dark" content="添加" :enterable="false"	placement="top-start">
              <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="编辑" :enterable="false" placement="top-start">
              <el-button type="warning" icon="el-icon-edit" size="mini"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" :enterable="false" placement="top-start">
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="queryParams.pagenum" :page-sizes="[3, 5, 10, 15]"
                     :page-size="queryParams.pagesize" layout="total,sizes, prev, pager,jumper" :total="total">
      </el-pagination>
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
            userList:[],
            // 总数
            total:0,
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
            this.total = response.data.total
          })
        },
        // 每页显示总数改变时
        handleSizeChange(newSize){
          this.queryParams.pagesize = newSize
          this.getUserList()
        },
        // 页码发生变化时
        handleCurrentChange(newPage){
          this.queryParams.pagenum = newPage
          this.getUserList()
        },
        // 更新用户状态
        userStateChanged(userinfo){
          this.$http.get(`update_user_state?id=${userinfo.id}&state=${userinfo.mg_state}`)
          .catch(error=>{
            console.log(error)
            userinfo.mg_state = !userinfo.mg_state
              return this.$message.error("更新用户状态失败！")
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
.el-pagination{
  margin-top: 20px;
}
</style>
