import Layout from '@/layout/index'

export default {
    path: '/resume',
    component: Layout,
    redirect: '/resume/index',
    name: 'company',
    meta: {
        title: '简历管理',
        icon: 'sidebar-permission'
    },
    children: [
        {
            path: 'index',
            name: 'resumeList',
            component: () => import('@/views/resume/list'),
            meta: {
                title: '简历列表',
                auth: ['permission.browse'],
                sidebar: true,
                breadcrumb: true,
            }
        }
    ]
}
