import Layout from '@/layout'

/**
 * 预约相关的路由
 */
export default {
    path: '/appoint',
    component: Layout,
    redirect: '/appoint/list',
    name: 'appoint',
    meta: {
        title: '预约管理',
        icon: 'article'
    },
    children: [
        {
            path: 'list',
            name: 'appointList',
            component: () => import('@/views/edu/appoint'),
            meta: {
                title: '预约列表',
                icon: 'list',
                auth: ['permission.browse'],
                sidebar: true,
                breadcrumb: true,
            }
        }, {
            path: 'teacherList',
            name: 'appointTeacherList',
            component: () => import('@/views/edu/appoint/teacher'),
            meta: {
                title: '教师预约',
                icon: 'list',
                auth: ['permission.browse'],
                sidebar: true,
                breadcrumb: true,
            }
        }
    ]
}
