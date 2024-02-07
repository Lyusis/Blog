import {defineConfig} from 'vitepress'

export default defineConfig({
    title: "Lyu'sis Blog",
    base: '/',
    head: [
        [
            'link', {rel: 'icon', href: '/images/logo.png'}
        ]
    ],
    themeConfig: {
        nav: [
            {text: 'Home', link: '/'},
            {text: 'Study', link: '/Golang语言基础'}
        ],

        sidebar: [
            {
                text: 'Study',
                items: [
                    {text: 'Golang语言基础', link: '/Golang语言基础'},
                    {text: 'innodb数据库', link: '/innodb数据库'},
                    {text: 'Java多线程基础知识', link: '/Java多线程基础知识'},
                    {text: 'Netty基础', link: '/Netty基础'},
                    {text: 'RabbitMQ', link: '/RabbitMQ'},
                    {text: 'Redis基础', link: '/Redis基础'},
                    {text: 'Shell编程基础', link: '/Shell编程基础'},
                    {text: '使用Viper输出列表结构至配置文件', link: '/使用Viper输出列表结构至配置文件'},
                    {text: '垃圾回收基础', link: '/垃圾回收基础'},
                    {text: '广度优先搜索', link: '/广度优先搜索'},
                    {text: '网络编程基础', link: '/网络编程基础'},
                    {text: '面试', link: '/面试'},
                ]
            }
        ],

        socialLinks: [
            // { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
        ]
    }
})
