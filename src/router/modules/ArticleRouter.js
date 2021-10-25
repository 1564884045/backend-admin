import Layout from '@/layout'

export default {
    path: '/article',
    component: Layout,
    redirect: '/article/list',
    name: 'article',
    meta: {
        title: '文章管理',
        icon: 'article'
    },
    children: [
        {
            path: 'list',
            name: 'articleList',
            component: () => import('@/views/article'),
            meta: {
                title: '文章列表',
                icon: 'list',
                auth: ['permission.browse'],
                sidebar: true,
                breadcrumb: true,
            }
        },{
            path: 'list',
            name: 'articleList',
            component: () => import('@/views/article'),
            meta: {
                title: '文章分类',
                icon: 'article-category',
                auth: ['permission.browse'],
                sidebar: false,
                breadcrumb: false,
            }
        }
    ]
}
