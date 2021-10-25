import Layout from '@/layout'

/**
 * 聊天界面
 */
export default {
    path: '/chat',
    component: Layout,
    redirect: '/chat/list',
    name: 'chat',
    meta: {
        title: '客服消息',
        icon: 'article'
    },
    children: [
        {
            path: 'list',
            name: 'chatList',
            component: () => import('@/views/article'),
            meta: {
                title: '消息列表',
                icon: 'list',
                auth: ['permission.browse'],
                sidebar: true,
                breadcrumb: true,
            }
        }
    ]
}
