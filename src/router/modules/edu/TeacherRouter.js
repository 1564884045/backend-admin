import Layout from '@/layout/index'

export default {
    path: '/teacher',
    component: Layout,
    redirect: '/teacher/index',
    name: 'teacher',
    meta: {
        title: '教师管理',
        icon: 'teacher'
    },
    children: [
        {
            path: 'list',
            name: 'teacherList',
            component: () => import('@/views/edu/teacher/list'),
            meta: {
                title: '教师列表',
                icon: 'list',
                auth: ['permission.browse'],
                sidebar: true,
                breadcrumb: true,
            }
        }
    ]
}
