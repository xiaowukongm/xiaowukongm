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
      <el-aside :width="isCollapse ? '64px':'200px'">
        <!--        菜单水平折叠按钮-->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu :default-active="activePath" :router="true" :unique-opened="true" :collapse="isCollapse" class="el-menu-vertical-demo" :collapse-transition="false" background-color="#333744" text-color="#fff" active-text-color="#409eff">
          <!--一级菜单-->
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <!--一级菜单模板区域-->
            <template slot="title">
              <i :class="menuIcons[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!--二级菜单-->
            <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/'+subItem.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--右边内容主体-->
      <el-main>
        <router-view></router-view>
      </el-main>
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
             // 菜单图标
             menuIcons:{
               "101":'el-icon-s-custom',
               "102":'el-icon-key',
               "103":'el-icon-s-goods',
               "104":'el-icon-s-order',
               "105":'el-icon-data-line',
             },
             // 菜单是否折叠
             isCollapse:false,
             // 被激活的链接地址
             activePath:"",
           }
      },
      created() {
          this.getMenuList()
          this.activePath = window.sessionStorage.getItem("activePath")
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
            // console.log(res.data)
          },
          //菜单折叠展开
          toggleCollapse(){
            this.isCollapse = !this.isCollapse
          },
          //保存被点击菜单index
          saveNavState(activePath){
              window.sessionStorage.setItem("activePath",activePath)
              this.activePath = activePath
          }
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
  .toggle-button{
    background-color: #4A5064;
    color:#fff;
    line-height: 24px;
    font-size: 10px;
    text-align: center;
    cursor: pointer;
    letter-spacing: 0.2em;
  }
  .el-menu{
    border-right:none;
  }
</style>
