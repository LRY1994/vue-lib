var graph={
    "copiesArrays": true,
    "copiesArrayObjects": true,
    "nodeDataArray": [
    { "key": 100, "category": "User", "text": "用户提交信息"},
    { "key": 101, "category": "User", "text": "用户完善信息" },
    { "key": 102, "category": "User", "text": "用户确认完成" },
    { "key": 103, "category": "User", "text": "用户撤销" },
    

    { "key": 200,"category": "Supplier", "text": "商家处理" },
    

    { "key": 300, "text": "管理员驳回" },                  
    { "key": 301, "text": "管理员指派商家处理" },
    { "key": 302,  "text": "管理员令商家重处理" }

    ],
    "linkDataArray": [
    { "from": 100, "to": 300 ,text:"信息不明确"},
    { "from": 100, "to": 301 },
    { "from": 101, "to": 301 },
    { "from": 100, "to": 103 },
    { "from": 103, "to": 100 },

    { "from":  200, "to": 303 },
    { "from":  200, "to": 102 },

    { "from":  300, "to": 101 },
    { "from":  301, "to": 200 },  
    { "from":  302, "to": 200 },  
    
    { "from":  200, "to": 302 ,text:"审核不通过"}
]
};
var tip ={
    'new':{
        now:'用户申请投诉',
        next:'用户提交信息'
    },
    'pending':{
        now:'待管理员查看'
     },
    'cancel':{
        now:'用户撤销'
    },
    'unclear':{
        now:'管理员驳回',
        next:'用户完善信息'
    },
    'acting':{
        now:'商家正在处理',
        next:'等待商家处理完毕'
    },   
    'done':{
        now:'商家处理完毕',
        next:'用户确认完成'
    },
    'finished':{
        now:'用户确认完成'
    }
}
export { graph,tip };