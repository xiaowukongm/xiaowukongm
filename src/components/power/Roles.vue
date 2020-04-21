<template>
    <div id="roles">
      <!--      面包屑导航-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!--      卡片容器-->
      <el-card class="box-card">
        <el-row>
          <el-col :span="24">
              <!--        添加角色按钮-->
              <el-button type="primary">添加角色</el-button>
          </el-col>
        </el-row>
        <!--        角色列表-->
        <el-table border :data="rolesList" stripe style="width: 100%">
          <!--          展开列用于展示权限-->
          <el-table-column type="expand">
            <template v-slot="scope">
              <el-row v-for="(item,i) in scope.row.children" :key="item.id" :class="['bdbottom',i==1 ? 'bdtop':'']">
                <el-col :span="5">
                  <el-tag>{{item.authName}}</el-tag>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column type="index" label="#">
          </el-table-column>
          <el-table-column prop="roleName" label="角色名称">
          </el-table-column>
          <el-table-column prop="roleDes" label="角色描述">
          </el-table-column>
          <el-table-column label="操作">
              <template v-slot="scope">
                  <el-button type="primary" size="mini" icon="el-icon-edit" @click="editRole(scope.row.id)">编辑</el-button>
                  <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteRole(scope.row.id)">删除</el-button>
                  <el-button type="warning" size="mini" icon="el-icon-setting" @click="seleteRole(scope.row.id)">分配权限</el-button>
              </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
</template>

<script>
    export default {
        name: "Roles",
      data(){
          return {
            rolesList:[]
          }
      },
      created() {
          this.rolesList = this.getRolesList()
      },
      methods:{
        getRolesList:function () {
          this.$http.get("roles/",)
          .then(res=>{
            this.rolesList = res.data.all_role_list
            console.log(res)
          })
        },
        editRole:function (role_id) {
          console.log(role_id)
        },
        deleteRole:function (role_id) {
          console.log(role_id)
        },
        seleteRole:function (role_id) {
          console.log(role_id)
        },
      },
    }
</script>

<style scoped>
  .el-table{
    margin-top: 20px;
    font-size: 13px;
  }
  .el-tag{
    margin: 10px;
  }
  .bdbottom{
    border-bottom: 1px solid #eeeeee;
  }
  .bdtop{
    border-top: 1px solid #eeeeee;
  }
</style>
