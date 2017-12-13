import Vue from 'vue'
import Router from 'vue-router'
import BMap from '@/components/BMap/BMap'
import FIndex from '@/components/BMap/Findex'
import Echarts from '@/components/BMap/Echarts'
import CallManage from '@/components/BMap/CallManage'
import Pending from '@/components/BMap/Pending'
import Processed from '@/components/BMap/Processed'
import CallControl from '@/components/BMap/CallControl'
import NotifiManage from '@/components/BMap/NotifiManage'
import HandlePending from '@/components/BMap/HandlePending'
import videoPlayer from '@/components/BMap/videoPlayer'
import BaseInfoManage from '@/components/BaseInfoManage/BaseInfoManage'
import STBManage from '@/components/BaseInfoManage/STBManage'
import TreeTest from '@/components/TreeTest'
import Operate from '@/components/SystemManage/Operate'
import Manager from '@/components/SystemManage/Manager'
import AccessApp from '@/components/SystemManage/AccessApp'
import ChangePsd from '@/components/User/ChangePsd'
import Login from "@/components/Login"
import Home from "@/components/Home"

Vue.use(Router);

const router = new Router({
        // mode: 'history', //把/#去掉   要在index.html 直接引入的js src="/static"
        routes: [{ // 首页，也是数据统计
                path: '/',
                name: 'Index',
                redirect: { name: 'Login' }
            },
            {
                path: '/login',
                name: 'Login',
                component: Login,
                //直接进入
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/home',
                component: Home,
                children: [{ // 首页
                        path: '',
                        redirect: {
                            name: 'FIndex'
                        }
                    },
                    { // 首页
                        path: '/index',
                        name: "FIndex",
                        component: FIndex,
                        redirect: { name: 'BMap' },
                        children: [{ // 报警地图
                            path: '/index/bMap',
                            name: 'BMap',
                            component: BMap
                        }, { // 折线图
                            path: '/index/echarts',
                            name: 'Echarts',
                            component: Echarts
                        }]
                    },
                    { // 报警控制
                        path: '/callControl',
                        name: 'CallControl',
                        component: CallControl
                    },
                    { // 报警信息
                        path: '/callManage',
                        name: 'CallManage',
                        component: CallManage,
                        redirect: { name: 'Pending' },
                        children: [{ // 待处理
                                path: '/callManage/pending',
                                name: 'Pending',
                                component: Pending,
                            },
                            { // 已处理
                                path: '/callManage/processed',
                                name: 'Processed',
                                component: Processed,
                            }
                        ]

                    },
                    { // 解决待处理报警页面
                        path: '/handlePending',
                        name: 'HandlePending',
                        component: HandlePending
                    },
                    { // 通知消息
                        path: '/notifiManage',
                        name: 'NotifiManage',
                        component: NotifiManage
                    },
                    // { // 乡村资讯
                    //     path: '/countryExpress',
                    //     name: 'CountryExpress',
                    //     // component: CountryExpres
                    // },
                    // { // 乡村资讯
                    //     path: '/countryExpress/countryNews',
                    //     name: 'CountryNews',
                    //     component: CountryNews
                    // },
                    // { // 安全资讯
                    //     path: '/countryExpress/safeInfo',
                    //     name: 'SafeInfo',
                    //     component: SafeInfo
                    // },
                    // { // 三务公开
                    //     path: '/countryExpress/threeOpen',
                    //     name: 'ThreeOpen',
                    //     component: ThreeOpen
                    // },
                    { // 基本信息管理
                        path: '/baseInfoManage',
                        name: 'BaseInfoManage',
                        component: BaseInfoManage
                    }, {
                        // 机顶盒用户管理
                        path: '/stbManage',
                        name: 'STBManage',
                        component: STBManage
                    },
                    { // 用户新增
                        path: '/treeTest',
                        name: 'TreeTest',
                        component: TreeTest
                    },
                    { // 用户修改密码
                        path: '/user/changePsd',
                        name: 'ChangePsd',
                        component: ChangePsd
                    },
                    { // 管理员管理
                        path: '/systemManage/manager',
                        name: 'manager',
                        component: Manager
                    },
                    { // 接入应用
                        path: '/systemManage/accessApp',
                        name: 'accessApp',
                        component: AccessApp
                    },
                    { // 操作记录
                        path: '/systemManage/operate',
                        name: 'Operate',
                        component: Operate
                    },
                    { // 视频播放
                        path: '/videoPlayer',
                        name: 'videoPlayer',
                        component: videoPlayer
                    },

                    { // 没有匹配到路由，重定向到模块一
                        path: '/',
                        component: BMap,
                        redirect: '/home'
                    }
                ]
            },

        ]
    })
    // router.beforeEach((to, from, next) => {
    //     console.log("跳转")
    // })
export default router;