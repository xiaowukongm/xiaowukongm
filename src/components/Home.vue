<template>
  <el-container class="home-container">
    <!--头部-->
    <el-header>
      <div>
        <img  class="logo" src="../assets/logo.jpg">
        <span>小悟空的管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!--页面主体区域-->
    <el-container>
      <!--侧边导航栏-->
      <el-aside width="200px">
        <el-menu default-active="2" class="el-menu-vertical-demo" background-color="#333744" text-color="#fff" active-text-color="#ffd04b">
          <!--一级菜单-->
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <!--一级菜单模板区域-->
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item.authName}}</span>
            </template>
            <!--二级菜单-->
            <el-menu-item :index="subItem.id+''" v-for="subItem in item.children" :key="subItem.id">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--右边内容主体-->
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
  export default {
      name: "Home",
      data(){
           return{
             // 左侧菜单数据
             menuList:[],
           }
      },
      created() {
          this.getMenuList()
      },
      methods:{
          logout(){
          //  清空token并重定向到登录页面
            window.sessionStorage.clear()
            this.$router.push("/login")
          },
          //获取左侧所有菜单
          async getMenuList(){
            const res =await this.$http.get("get_menus")
            if(res.status != 200) return this.$message.error(res.data.msg)
            //为menuList赋值
            this.menuList=res.data.data
            console.log(res.data)
          },
      }
    }
</script>

<style scoped>
  .home-container{
    height: 100%;
  }
  .el-header{
    background-color: #373d41;
    display: flex;
    padding-left:0px;
    /*flex横轴上的对齐方式*/
    justify-content: space-between;
    /*flex纵轴上的对齐方式*/
    align-items: center;
    color: #ffffff;
    font-size: 20px;
  }
  .el-header div{
    display: flex;
    align-items: center;
  }
  .el-header div span{
    margin-left: 15px;
  }
  .el-aside{
    background-color: #333744;
  }
  .el-main{
    background-color: #eaedf1;
  }
  .logo{
    width: 60px;
  }
</style>
