import Layout from '@/layout/index'

export default {
    path: '/jiGou',
    component: Layout,
    redirect: '/jiGou/index',
    name: 'jiGou',
    meta: {
        title: '机构管理',
        icon: 'jiGou'
    },
    children: [
        {
            path: 'jiGou',
            name: 'jiGouList',
            component: () => import('@/views/edu/jiGou/list'),
            meta: {
                title: '机构列表',
                icon: 'list',
                auth: ['permission.browse'],
                sidebar: true,
                breadcrumb: true,
            }
        }
    ]
}
