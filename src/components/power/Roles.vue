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

              <el-row v-for="(item,i) in scope.row.children" :key="item.id" :class="['bdbottom',i==1 ? 'bdtop':'','vcenter']">
                <!--   一级权限           -->
                <el-col :span="5">
                  <el-tag closable @close="removeRightById(scope.row,item.id)">{{item.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!--   二级权限和三级权限              -->
                <el-col :span="19">
                  <el-row v-for="(item2,i2) in item.children" :key="item2.id" :class="{bdtop:i2!=0,vcenter:true}">
                    <!--   二级权限                 -->
                    <el-col :span="5">
                      <el-tag closable @close="removeRightById(scope.row,item2.id)" type="success">{{item2.authName}}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <!--   三级权限                 -->
                    <el-col :span="19">
                      <el-tag closable @close="removeRightById(scope.row,item3.id)" type="warning" v-for="(item3,i3) in item2.children" :key="item3.id">{{item3.authName}}</el-tag>
                    </el-col>
                  </el-row>
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
                  <el-button type="warning" size="mini" icon="el-icon-setting" @click="showSetRightDialog()">分配权限</el-button>
              </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!--  分配权限的对话框    -->
      <el-dialog title="提示" :visible.sync="setRightDialogVisible" width="30%">
        <span>分配权限</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRightDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="setRightDialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Roles",
      data(){
          return {
            // 所有角色列表数据
            rolesList:[],
            // 控制分配权限对话框的显示与隐藏
            setRightDialogVisible:false,
            // 权限列表数据
            rightsList:[],
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
        removeRightById:function (role,rightId) {
          console.log(rightId)
          this.$confirm('移除此权限, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(()=>{
            this.$http.get('remove_right_by_id/',{params:{'roleId':role.id,'rightId':rightId}})
            .then(res=>{
              if(res.data.result=="success"){
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                // 删除成功后，更新角色权限，返回数据中包含最新的角色权限数据
                role.children = res.data.role_new_right
              }else {
                this.$message({
                  type: 'fail',
                  message: '删除失败!'
                });
              }
            })

          }).catch(()=>{
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          })
        },
        showSetRightDialog:function () {
          this.$http.get("rights_tree/")
            .then(res=>{
              console.log(res)
              if(res.data.result=="success"){
                this.rightsList = res.data.right_list
                // console.log(this.rightsList)
              }
            })
          this.setRightDialogVisible = true

        }
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
  .vcenter{
    display: flex;
    align-items: center;
  }
</style>
