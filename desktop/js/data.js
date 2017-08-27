/**
 * 数据
 * @type {Object}
 */
var data = {
    menu: {
        'main': [
            {
                name: '新建',
                // disabled: true,
                children: [
                    {
                        callbackname: 'createFloder',
                        type: 'floder',
                        name: '新建文件夹',
                    },
                    {
                        callbackname: 'createTxt',
                        type: 'txt',
                        name: '新建文本'
                    }
                ]
            },
            {
                type: 'splitLine'
            },
            {
                callbackname: 'uploadF',
                name: '上传文件'
                // disabled: true,
            },
            {
                type: 'splitLine'
            },
            {
                name: '排序',
                children: [
                    {
                        callbackname: 'typeSort',
                        name: '按文件类型排序'
                    },
                    {
                        callbackname: 'timeSort',
                        name: '按创建时间排序'
                    }
                ]
            }
        ],
        'file': [
            {
                callbackname: 'openFile',
                name: '打开'
            },
            {
                callbackname: 'Rename',
                name: '重命名'
            },
            {
                callbackname: 'Delete',
                name: '删除'
            },
            {
                callbackname: 'Copy',
                name: '复制'
            }
        ],
        'trashMain': [
            {
                name: '还原全部',
                callbackname: 'reduction'
            },
            {
                name: '清空回收站',
                callbackname: 'clearAll'
            }
        ]
    },
    // 数据驱动视图
    list: [
        {
			id: 1,
			pid: 0,
			type: 'trash',
			name: '回收站',
		},
        {
            id: 2,
            pid: 0,
            type: 'floder',
            name: '技术'

        },
        {
            id: 3,
            pid: 0,
            type: 'floder',
            name: '电影'
        },
        {
            id: 4,
            pid: 0,
            type: 'floder',
            name: '音乐'
        },
        {
            id: 5,
            pid: 0,
            type: 'floder',
            name: '图片'
        },
        {
            id: 6,
            pid: 0,
            type: 'floder',
            name: '小说'
        },
        {
            id: 7,
            pid: 0,
            type: 'txt',
            name: 'README'
        },
        {
            id: 8,
            pid: 2,
            type: 'floder',
            name: '前端'
        },
        {
            id: 9,
            pid: 2,
            type: 'floder',
            name: '后端'
        },
        // {
        //     id: 10,
        //     pid: 8,
        //     type: 'floder',
        //     name: 'javascript'
        // },
        // {
        //     id: 11,
        //     pid: 10,
        //     type: 'floder',
        //     name: 'ECMAScript'
        // },
        // {
        //     id: 12,
        //     pid: 11,
        //     type: 'floder',
        //     name: 'ECMAScript2015'
        // }
    ]
};
