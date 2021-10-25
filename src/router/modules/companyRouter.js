import Layout from '@/layout'

export default {
    path: '/company',
    component: Layout,
    redirect: '/company/index',
    name: 'company',
    meta: {
        title: '企业管理',
        icon: 'sidebar-permission'
    },
    children: [
        {
            path: 'index',
            name: 'companyIndex',
            component: () => import('@/views/company/index'),
            meta: {
                title: '企业列表',
                auth: ['permission.browse'],
                sidebar: true,
                breadcrumb: true,
            }
        },{
            path: 'map',
            name: 'companyMap',
            component: () => import('@/views/company/map'),
            meta: {
                title: '企业分布',
                auth: ['permission.browse'],
                sidebar: true,
                breadcrumb: true,
            }
        }
    ]
}
