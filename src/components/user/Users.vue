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
          <el-input clearable placeholder="请输入搜索内容" v-model="queryParams.query" @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addUserDialogVisible = true">添加用户</el-button>
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
    <!--    添加用户的对话框-->
    <el-dialog title="添加用户" :visible.sync="addUserDialogVisible" width="30%" @closed="addDialogClosed">
      <!--      内容主题区，表单  -->
      <el-form status-icon ref="addFormRef" :model="addForm" label-width="80px" :rules="addFormRules">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!--      底部按钮-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
    export default {
      name: "Users",
      data(){
          // 校验邮箱的规则
          var checkEmail =(rule, value, cb)=>{
            var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
            if(reg.test(value)){
              return cb;
            }else{
              cb(new Error("请输入合法邮箱"))
            }

          }
          return{
            // 用户数据请求参数
            queryParams:{
              query:'',
              pagenum:1,
              pagesize:3,
            },
            //用户数据列表
            userList:[],
            // 总数
            total:0,
            // 控制添加用户对话框的隐藏与显示
            addUserDialogVisible:false,
            // 添加用户表单
            addForm:{
              username:'',
              password:'',
              email:'',
              mobile:'',
            },
            // 添加用户表单的校验规则
            addFormRules:{
              username: [
                { required: true, message: '请输入用户名', trigger: 'blur' },
              ],
              password: [
                { required: true, message: '请输入密码', trigger: 'blur' },
                { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
              ],
              email: [
                { validator:checkEmail,trigger: 'blur' },
              ],
              mobile: [
                { required: true, message: '请输入手机号', trigger: 'blur' },
                { min: 11, message: '长度最少 11 个字符', trigger: 'blur' }
              ],
            },
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
        },
        // 添加用户
        addUser(userInfo){
          //  表单预验证
          this.$refs.addFormRef.validate(valid=>{
            if(!valid){
              return this.$message.error("验证失败")
            }
          })
          // 预验证通过后，调用添加用户接口
          this.$http.post("addUser/",this.qs.stringify(this.addForm))
            .then(res=>{
              if(res.data.result==="success"){
                return this.$message.success("添加用户成功")
              }
            })
            .catch(error=>{
              return this.$message.error("添加用户失败")
            })
          // 隐藏dialog
          this.addUserDialogVisible = false
          // 刷新列表
          this.getUserList()
        },
        // 监听添加用户对话框的关闭事件
        addDialogClosed(){
          this.$refs.addFormRef.resetFields()
        },
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
