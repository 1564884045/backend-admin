import Layout from '@/layout'
import EmptyLayout from '@/layout/empty'

export default {
    path: '/ui',
    component: Layout,
    redirect: '/ui/home/banner',
    name: 'ui',
    meta: {
        title: '界面设置',
        icon: 'sidebar-permission'
    },
    children: [
        {
            path: 'home',
            name: 'home',
            component: EmptyLayout,
            meta: {
                title: '首页界面',
                auth: ['permission.browse']
            },
            children: [
                {
                    path: 'banner',
                    name: 'homeBanner',
                    component: () => import('@/views/ui/home/banner'),
                    meta: {
                        title: '首页banner'
                    }
                }, {
                    path: 'category',
                    name: 'homeCategory',
                    component: () => import('@/views/ui/home/category'),
                    meta: {
                        title: '首页分类设置',
                        auth: ['permission.browse'],
                        sidebar: true,
                        breadcrumb: true,
                    }
                }, {
                    path: 'recommend',
                    name: 'homeRecommend',
                    component: () => import('@/views/ui/home/recommend'),
                    meta: {
                        title: '首页推荐',
                        auth: ['permission.browse'],
                        sidebar: true,
                        breadcrumb: true,
                    }
                }
            ]
        }, {
            path: 'circle',
            name: 'circle',
            component: EmptyLayout,
            meta: {
                title: '知识圈界面',
                auth: ['permission.browse'],
                sidebar: true,
                breadcrumb: true,
            },
            children: [
                {
                    path: 'circle',
                    name: 'circleBanner',
                    component: () => import('@/views/ui/circle/banner'),
                    meta: {
                        title: '知识圈banner'
                    }
                }
            ]
        }
    ]
}
