import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import LoginView from '@/components/LoginView'
import RequestInstallView from '@/components/RequestInstallView'

Vue.use(Router)

//export default new Router({
const router = new Router({
  routes: [{
      path: '/',
      name: 'Home',
      component: Home,
      props: true
    },
    {
      path: '/LoginView',
      name: 'LoginView',
      component: LoginView,
      props: true,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/RequestInstallView',
      name: 'RequestInstallView',
      component: RequestInstallView
    }
  ]
})

// TODO : scatter를 설치하지 않은 경우 login컴포넌트에 접근못하도록 하기. 
// router.beforeEach((to, from, next) => {
//   if (to.matched.some(record => record.meta.requiresAuth)) {
//     // 이 라우트는 인증이 필요하며 로그인 한 경우 확인하십시오.
//     // 그렇지 않은 경우 로그인 페이지로 리디렉션하십시오.
//     alert('test!!!!')
//     // if (!auth.loggedIn()) {
//     //   next({
//     //     path: '/login',
//     //     query: {
//     //       redirect: to.fullPath
//     //     }
//     //   })
//     // } else {
//     //   next()
//     // }
//   } else {
//     alert('222');
//     next() // 반드시 next()를 호출하십시오!
//   }
// })

export default router
