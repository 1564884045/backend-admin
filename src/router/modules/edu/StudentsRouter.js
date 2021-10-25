import Layout from '@/layout/index'

export default {
    path: '/students',
    component: Layout,
    redirect: '/students/index',
    name: 'students',
    meta: {
        title: '学员管理',
        icon: 'student'
    },
    children: [
        {
            path: 'list',
            name: 'studentsList',
            component: () => import('@/views/edu/students/list'),
            meta: {
                title: '学员列表',
                icon: 'list',
                auth: ['permission.browse'],
                sidebar: true,
                breadcrumb: true,
            }
        }
    ]
}
