import Layout from '@/layout/index'

export default {
    path: '/circle',
    component: Layout,
    redirect: '/circle/list',
    name: 'circle',
    meta: {
        title: '知识圈管理',
        icon: 'circle'
    },
    children: [
        {
            path: 'list',
            name: 'circleList',
            component: () => import('@/views/edu/circle'),
            meta: {
                title: '发布列表',
                icon: 'list',
                auth: ['permission.browse'],
                sidebar: true,
                breadcrumb: true,
            }
        }
    ]
}
