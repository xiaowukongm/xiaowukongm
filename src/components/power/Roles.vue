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
              <el-button type="primary" @click="showAddRoleDialog">添加角色</el-button>
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
                  <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditRoleDialog(scope.row.id)">编辑</el-button>
                  <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteRole(scope.row.id)">删除</el-button>
                  <el-button type="warning" size="mini" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
              </template>
          </el-table-column>
        </el-table>
      </el-card>
      <!--  添加角色的对话框    -->
      <el-dialog title="添加角色" :visible.sync="addRoleDialogVisible" width="30%" @close="addRoleDialogClose">
        <el-form ref="addRoleFormRef" :model="addRoleForm" label-width="80px">
          <el-form-item label="角色名称">
            <el-input v-model="addRoleForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="addRoleForm.roleDes"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRole">确 定</el-button>
        </span>
      </el-dialog>
      <!--  修改角色的对话框    -->
      <el-dialog title="修改角色" :visible.sync="editRoleDialogVisible" width="30%" @close="editRoleDialogClose">
        <el-form ref="editRoleFormRef" :model="editRoleForm" label-width="80px">
          <el-form-item label="角色名称">
            <el-input v-model="editRoleForm.role_name"></el-input>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="editRoleForm.role_desc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editRole">确 定</el-button>
        </span>
      </el-dialog>
      <!--  分配权限的对话框    -->
      <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="30%" @close="setRightDialogClose">
        <!--  权限树形结构-->
        <el-tree ref="treeRef" :data="rightsList" :props="props" show-checkbox  node-key="id"  default-expand-all :default-checked-keys="defKeys"></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRightDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allotRight">确 定</el-button>
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

            // 控制添加角色对话框的显示与隐藏
            addRoleDialogVisible:false,
            // 添加角色表单
            addRoleForm:{
              roleName:'',
              roleDes:''
            },

            // 控制修改角色对话框的显示与隐藏
            editRoleDialogVisible:false,
            // 修改角色表单
            editRoleForm:{},
            // 控制分配权限对话框的显示与隐藏
            setRightDialogVisible:false,

            // 权限列表数据
            rightsList:[],
            // 控制树形结构的属性
            props: {
              // 指定节点标签为节点对象的某个属性值
              label: 'authName',
              // 指定子树为节点对象的某个属性值
              children: 'children'
            },
            // 默认选中树形节点id列表
            defKeys:[],
            // 当前分配角色id
            roleId:'',
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
            // console.log(res)
          })
        },

        // 显示添加角色dialog
        showAddRoleDialog:function(){
          this.addRoleDialogVisible = true
        },

        // 添加角色
        addRole:function(){
          // 表单预验证
          this.$refs.addRoleFormRef.validate(valid=>{
            if(!valid){
              return this.$message.error("验证失败")
            }
            this.$http.post('add_role/',this.qs.stringify(this.addRoleForm))
            .then(res=>{
              if(res.data.result=="success"){
                this.$message.success("添加角色成功！")
                // 关闭dialog
                this.addRoleDialogVisible=false
                // 刷新角色列表
                this.getRolesList()
              }
              else {
                this.$message.error("添加角色失败！")
              }
            })
            .catch(err=>{
              console.log(err)
              this.$message.error("添加角色失败！")
            })
          })
        },

        // 监听添加角色对话框，关闭时重置表单
        addRoleDialogClose:function(){
          this.$refs.addRoleFormRef.resetFields()
        },

        // 显示修改角色dialog
        showEditRoleDialog:function(role_id){
          // 查询当前角色 ，将角色字段填写到表单中
          // 显示表单
          this.editRoleDialogVisible=true
          // 获取该用户的数据
          this.$http.get("get_role_by_id",{params:{role_id:role_id}})
          .then(res=>{
            // console.log(res.data.role)
            this.editRoleForm=res.data.role
          })
        },

        // 修改角色
        editRole:function () {
          this.$refs.editRoleFormRef.validate(valid=>{
            if(!valid){
              return this.$message.error("验证失败")
            }
            // 调用修改用户接口
            this.$http.post("edit_role/",this.qs.stringify(this.editRoleForm))
            .then(res=>{
              if(res.data.result === "success"){
                this.$message.success("修改角色信息成功！")
                this.editRoleDialogVisible = false
                // 刷新用户列表
                this.getRolesList()
              }
            })
            .catch(error=>{
              return this.$message.error("修改角色信息失败！")
            })
          })
        },

        // 监听编辑角色对话框，关闭时重置表单
        editRoleDialogClose:function(){
          this.editRoleDialogVisible=false
          this.$refs.editRoleFormRef.resetFields()
        },

        // 删除角色
        deleteRole:function (role_id) {
          this.$confirm("此操作将永久删除该角色, 是否继续?",'提示',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(()=>{
            this.$http.get('delete_role/',{params:{'role_id':role_id}})
            .then(res=>{
              if(res.data.result==="success"){
                  this.$message.success("删除角色成功！")
                  // 刷新角色列表
                  this.getRolesList()
                }else if(res.data.result==="fail"){
                  return this.$message.error("删除角色失败！")
                }
            })
            .catch(err=>{
              console.log(err)
              return this.$message.error("删除角色失败！")
            })
          }).catch(()=>{
              this.$message.info("已取消删除操作！")
          })
        },

        // 移除角色权限
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

        // 显示或隐藏权限列表dialog
        showSetRightDialog:function (role) {
          this.$http.get("rights_tree/")
            .then(res=>{
              if(res.data.result=="success"){
                this.rightsList = res.data.right_list
                // 获取角色已有三级权限id
                this.getLeafKeys(role,this.defKeys)
              }
            })
          this.setRightDialogVisible = true
          this.roleId = role.id
        },

        // 获取当前角色已有三级权限的id
        getLeafKeys:function (node,arr) {
          if(!node.children){
            return arr.push(node.id)
          }
          node.children.forEach(item=>{
            this.getLeafKeys(item,arr)
          })
        },

        // 监听分配权限对话框，关闭时重置defKeys
        setRightDialogClose:function () {
          this.defKeys = []
        },

        // 为角色分配权限
        allotRight:function () {
          // 获取所选权限id以及半选id
          const keys = [...this.$refs.treeRef.getCheckedKeys(),...this.$refs.treeRef.getHalfCheckedKeys()]
          this.$http.get('allot_rights/',{params:{
              "right_ids":keys.join(','),
              "role_id":this.roleId
            }}).then(res=>{
              if(res.data.result=="success"){
                this.$message({
                  type: 'success',
                  message: '分配权限成功!'
                });
                // 关闭dialog
                this.setRightDialogVisible = false
                // 刷新角色列表
                this.getRolesList()
              }else {
                this.$message({
                  type: 'fail',
                  message: '分配权限失败!'
                });
              }
            })
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
