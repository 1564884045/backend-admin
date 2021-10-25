import Layout from '@/layout'
import empty from "@/layout/empty";

export default {
    path: '/conf',
    component: Layout,
    redirect: '/conf/index',
    name: 'conf',
    meta: {
        title: '系统设置',
        icon: 'sys'
    },
    children: [
        {
            path: 'base',
            name: 'conf',
            component: () => import('@/views/conf/config'),
            meta: {
                title: '基础设置',
                auth: ['permission.browse'],
                sidebar: true,
                breadcrumb: true,
                icon: 'base'
            }
        }, {
            path: 'sms',
            name: 'confSms',
            component: () => import('@/views/conf/config-sms'),
            meta: {
                title: '短信设置',
                auth: ['permission.browse'],
                sidebar: true,
                breadcrumb: true,
                icon: 'sms'
            }
        }, {
            path: 'third',
            name: 'confThird',
            component: empty,
            meta: {
                title: '第三方设置',
                auth: ['permission.browse'],
                sidebar: true,
                breadcrumb: true,
                icon: 'api'
            },
            children: [
                {
                    path: 'mp',
                    name: 'confThirdMp',
                    component: () => import('@/views/conf/config-mp'),
                    meta: {
                        title: '小程序设置',
                        auth: ['permission.browse'],
                        sidebar: true,
                        breadcrumb: true,
                        icon: 'mp'
                    }
                }, {
                    path: 'gzh',
                    name: 'confThirdGzh',
                    component: () => import('@/views/conf/config-gzh'),
                    meta: {
                        title: '公众号设置',
                        auth: ['permission.browse'],
                        sidebar: true,
                        breadcrumb: true,
                        icon: 'gzh'
                    }
                },
            ]
        }, {
            path: 'pay',
            name: 'confPay',
            component: () => import('@/views/conf/config-pay'),
            meta: {
                title: '支付设置',
                auth: ['permission.browse'],
                sidebar: true,
                breadcrumb: true,
                icon: 'pay'
            }
        }, {
            path: 'poster',
            name: 'confPoster',
            component: () => import('@/views/conf/config-poster'),
            meta: {
                title: '文案设置',
                auth: ['permission.browse'],
                sidebar: true,
                breadcrumb: true,
                icon: 'img'
            }
        }, {
            path: 'about-us',
            name: 'aboutUs',
            component: () => import('@/views/conf/company-about-us'),
            meta: {
                title: '关于我们',
                auth: ['permission.browse'],
                sidebar: true,
                breadcrumb: true,
                icon: 'about-us'
            }
        }
    ]
}
