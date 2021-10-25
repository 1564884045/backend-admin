import Layout from '@/layout'

export default {
    path: '/vip',
    component: Layout,
    redirect: '/vip/list',
    name: 'vip',
    meta: {
        title: '会员管理',
        icon: 'vip'
    },
    children: [
        {
            path: 'list',
            name: 'vipList',
            component: () => import('@/views/vip/list'),
            meta: {
                title: '套餐列表',
                icon: 'list',
                auth: ['permission.browse'],
                sidebar: true,
                breadcrumb: true,
            }
        }
    ]
}
