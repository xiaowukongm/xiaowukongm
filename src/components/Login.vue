<template>
  <div class="login_container">
    <div class="login_box">
       <!--头像区域-->
       <div class="avatar_box">
          <img src="../assets/logo.png">
       </div>
       <!--登录表单区域-->
       <el-form ref="loginFormRef" class="login_form" :model="loginForm" :rules="loginFormRules" label-width="0px">
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" placeholder="登录名" prefix-icon="el-icon-user"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" placeholder="密码" prefix-icon="el-icon-lock" type="password"></el-input>
          </el-form-item>
          <!--按钮区域-->
          <el-form-item class="btns">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="resetLoginForm">重置</el-button>
          </el-form-item>
       </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data(){
      return{
        // 登录表单的数据绑定对象
        loginForm:{
          username:"hmm",
          password:"123456"
        },
        //表单的验证规则对象
        loginFormRules:{
          username:[
            { required: true, message: '请输入登录名', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          password:[
            { required: true, message: '请输入登录密码', trigger: 'blur' },
            { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
          ]
        }
      }
    },
  methods:{
    resetLoginForm: function () {
      this.$refs.loginFormRef.resetFields()
    },
    login: function () {
      this.$refs.loginFormRef.validate(valid => {
        console.log(this.loginForm);
        if (!valid) return;
        this.$http.post("login/", this.qs.stringify(this.loginForm))
                  .then(response =>{
                    console.log(response)
                    if(response.data["status"]==="error"){
                        this.$message.error(response.data["msg"]);
                    }else if(response.data["status"]==="success"){
                        this.$message.success(response.data["msg"])
                      //设置登录状态
                      window.sessionStorage.setItem("token",response.data["login_status"])
                    // 页面跳转到home
                    this.$router.push("/home")
                    }
                  })
                  .catch(error =>{ // 请求失败处理
                    this.$message.error("请求失败！");
                  });
      })
    }
  },
}
</script>
<style>
  .login_container{
    height:100%;
    background-color:#2b4b6b;
  }
  .login_box{
    width:450px;
    height:300px;
    background-color:#fff;
    boder-radius:2px;
    position:absolute;
    left:50%;
    top:50%;
    transform:translate(-50%,-50%)
  }
  .avatar_box{
    height:130px;
    width:130px;
    boder:1px solid #eee;
    border-radius:50%;
    padding:10px;
    box-shadow:0 0 10px #ddd;
    position:absolute;
    left:50%;
    transform:translate(-50%,-50%);
    background-color: #fff;
  }
  .avatar_box img{
      width:100%;
      height:100%;
      border-radius:50%;
      background-color:#eee;

  }
  .login_form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 50px;
    box-sizing: border-box;
  }
  .btns{
    /*text-align: center;*/
    /*弹性盒子*/
    display: flex;
    justify-content: center;
  }

</style>
