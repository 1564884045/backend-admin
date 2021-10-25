import Layout from '@/layout'

export default {
    path: '/user',
    component: Layout,
    redirect: '/user/index',
    name: 'user',
    meta: {
        title: '用户管理',
        icon: 'user'
    },
    children: [
        {
            path: 'list',
            name: 'userList',
            component: () => import('@/views/user/list'),
            meta: {
                title: '用户列表',
                icon: 'list',
                auth: ['permission.browse'],
                sidebar: true,
                breadcrumb: true,
            }
        }, {
            path: 'role',
            name: 'userRoleList',
            component: () => import('@/views/user/role'),
            meta: {
                title: '用户角色',
                icon: 'role-list',
                auth: ['permission.browse'],
                sidebar: true,
                breadcrumb: true,
            }
        }
    ]
}
