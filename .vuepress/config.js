module.exports = {
  "title": "前端开发社区",
  "description": "",
  "dest": "dist",
  "base": "/blog/",
  "head": [
    [
      "link",
      {
        "rel": "icon",
        "href": "/favicon.ico"
      }
    ],
    [
      "meta",
      {
        "name": "viewport",
        "content": "width=device-width,initial-scale=1,user-scalable=no"
      }
    ]
  ],
  "theme": "reco",
  "themeConfig": {
    "mode": 'light', // 默认 auto，auto 跟随系统，dark 暗色模式，light 亮色模式
    "modePicker": false,  // 默认 true，false 不显示模式调节按钮，true 则显示
    "nav": [
      {
        "text": "时间轴",
        "link": "/timeline/",
        "icon": "reco-date"
      },
      {
        "text": "分享课",
        "link": "/categories/分享课/",
        "icon": "reco-blog",
      },
      {
        "text": "文档",
        "icon": "reco-message",
        "items": [
          {
            "text": "Fish UI",
            "link": "/docs/Fish/"
          }
        ]
      },
      {
        "text": "链接",
        "icon": "reco-menu",
        "items": [
          {
            "text": "GitLub",
            "link": "http://git.sendinfo.com/",
            "icon": "reco-github"
          },
          {
            "text": "前端私有库",
            "link": "http://npm.sendinfo.com//",
            "icon": "reco-npm"
          },
        ]
      }
    ],
    "sidebar": {
      "/docs/Fish/": [
        "",
        "theme",
        "plugin",
        "api"
      ]
    },
    "type": "blog",
    "blogConfig": {
      "category": {
        "location": 2,
        "text": "分类"
      },
      "tag": {
        "location": 3,
        "text": "标签"
      }
    },
    "friendLink": [
      {
        "title": "vuepress",
        "desc": "一个以 Vue 驱动的主题系统的简约静态网站生成工具，和一个为编写技术文档而优化的默认主题。它是为了支持 Vue 子项目的文档需求而创建的。",
        "link": "http://caibaojian.com/vuepress/guide/getting-started.html"
      },
      {
        "title": "vuepress-theme-reco",
        "desc": "该主题几乎继承 VuePress 默认主题的一切功能，所以本文档只负责介绍该主题扩展的功能，如果你发现某些功能本网站没有相关文档，或者想要了解默认主题的一些功能",
        "avatar": "https://vuepress-theme-reco.recoluan.com/icon_vuepress_reco.png",
        "link": "https://vuepress-theme-reco.recoluan.com"
      }
    ],
    "logo": "/logo.jpg",
    "search": true,
    "searchMaxSuggestions": 10,
    "lastUpdated": "Last Updated",
    "author": "sendinfo",
    "authorAvatar": "/avatar.jpg",
    "record": "深大智能",
    "startYear": "2020"
  },
  "markdown": {
    "lineNumbers": true
  }
}