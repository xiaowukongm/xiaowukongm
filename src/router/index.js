import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld';
import Login from '@/components/Login';
import Home from '@/components/Home';
import Welcome from "../components/Welcome";
import Users from "../components/user/Users";

Vue.use(Router)

const router = new Router({
  routes: [
    {path: '/',redirect:"/login"},
    {path: '/login', name: 'Login', component: Login},
    {path: '/home', component: Home,redirect:"/welcome",children:[
        {path: '/welcome', component: Welcome},
        {path: '/users', component: Users},
      ]},
  ]
})
//挂载路由导航守卫
router.beforeEach((to,from,next)=>{
  //  to 将要访问的路径
  //  from 从哪个路径跳转而来
  //  next() 放行
  //  next("/login") 强制跳转
  if(to.path==="/login"){
    return next()
  }
  //  获取登录标志
  const token = window.sessionStorage.getItem("token")
  if(!token){
    return next("/login")
  }
  next()
})
export default router
