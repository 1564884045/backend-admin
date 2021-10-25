import Layout from '@/layout'

export default {
    path: '/select',
    component: Layout,
    name: 'select',
    meta: {
        title: '选框管理',
        icon: 'select-down'
    },
    children: [
        {
            path: 'area',
            name: 'areaList',
            component: () => import('@/views/selects/area'),
            meta: {
                title: '区域管理',
                auth: ['permission.browse'],
                sidebar: true,
                breadcrumb: true,
            }
        }, {
            path: 'identity',
            name: 'identityList',
            component: () => import('@/views/selects/identity'),
            meta: {
                title: '身份管理',
                auth: ['permission.browse'],
                sidebar: true,
                breadcrumb: true,
            }
        }, {
            path: 'subject',
            name: 'subjectList',
            component: () => import('@/views/selects/subject'),
            meta: {
                title: '科目管理',
                auth: ['permission.browse'],
                sidebar: true,
                breadcrumb: true,
            }
        }, {
            path: 'stage',
            name: 'stageList',
            component: () => import('@/views/selects/stage'),
            meta: {
                title: '阶段/年级管理',
                auth: ['permission.browse'],
                sidebar: true,
                breadcrumb: true,
            }
        }, {
            path: 'money',
            name: 'moneyList',
            component: () => import('@/views/selects/money'),
            meta: {
                title: '薪资管理',
                auth: ['permission.browse'],
                sidebar: true,
                breadcrumb: true,
            }
        }
    ]
}
