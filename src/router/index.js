import Vue from 'vue';
import Router from 'vue-router';
const _import = require('./_import_' + process.env.NODE_ENV);
import Full from '@/containers/Full'

// Views - Pages
import Page404 from '@/views/errorPages/Page404'
import Page500 from '@/views/errorPages/Page500'
import TagManage from '@/views/TagManage'
import TagInfo from '@/views/TagInfo'
import TagReview from '@/views/TagReview'
import TopicManage from '@/views/TopicManage'
import PaperManage from '@/views/PaperManage'
import PaperInfo from '@/views/PaperInfo'
import test from '@/views/test'


/* login */
const Login = _import('login/index');
Vue.use(Router);

export const constantRouterMap = [
    { path: '/login', component: Login, hidden: true },
    {path: '/pages',redirect: '/pages/p404', name: 'Pages',
          component: {
            render (c) { return c('router-view') }
              // Full,
          },
          children: [{path: '404',  name: 'Page404', component: _import('errorPages/Page404') },
                     {path: '500',name: 'Page500',component: _import('errorPages/Page404')},
                    ]
    }


]

export default new Router({
  mode: 'hash', 
  linkActiveClass: 'open active',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});

export const asyncRouterMap = [

 {
    path: '/',
    redirect: '/TopicManage',
    name: '首页',
    component: Full,
    hidden:false,
    children: [
      {path: '/TopicManage', name: '主题管理', icon:'android-list', component: _import('TopicManage')},
      {path: '/TagManage',name: '标签管理',icon:'ios-paper', component: _import('TagManage')},
      {path: '/TagInfo', name: '标签信息', icon:'android-list', component: _import('TagInfo'), hidden:true},
      {path: '/TagReview', name: '标签审核', icon:'android-list', component: _import('TagReview')},
      {path: '/PaperManage', name: '论文管理', icon:'android-list', component: _import('PaperManage')},
      {path: '/PaperInfo', name: '论文信息', icon:'android-list', component: _import('PaperInfo'), hidden:true},
      {path: '/test', name: '测试', icon:'android-list', component: _import('test')},
    ]
  },
  { path: '*', redirect: '/pages/404', hidden: true }
  
];
