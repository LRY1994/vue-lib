var graph={
    "copiesArrays": true,
    "copiesArrayObjects": true,
    "nodeDataArray": [
    { "key": 100, "category": "User", "text": "用户提交信息" },
    { "key": 101, "category": "User", "text": "用户完善信息" },
    { "key": 102, "category": "User", "text": "用户确认完成" },
    { "key": 103, "category": "User", "text": "用户撤销" },
    
    

    { "key": 200, "category": "Supplier", "text": "商家驳回" },                  
    { "key": 201, "category": "Supplier", "text": "商家准备资料" },
    { "key": 202, "category": "Supplier", "text": "商家寄出" },


    ],
    "linkDataArray": [
    { "from": 100, "to": 200,text:"信息不明确" },
    { "from": 100, "to": 201 },
    { "from": 100, "to": 103 },

    
    { "from": 101, "to": 201 },
    { "from": 103, "to": 100 },
    { "from": 200, "to": 101 },
    { "from":  201, "to": 202 },
    { "from":  202, "to": 102 }
]
};
var tip ={
    'new':{
        now:'用户申请',
        next:'用户填写信息提交'
    },
    'pending':{
        now:'用户已提交信息',
        next:"商家审核",
    },
    'acting':{
        now:'商家准备资料中',
    },
    'cancel':{
        now:'用户已取消'
    },
    'unclear':{
        now:'商家驳回',
        next:'用户完善信息'
    },
    'done':{
        now:'商家已寄出',
        next:'用户确认完成'
    },
    'finished':{
        now:'用户确认完成'
    }
}
export { graph,tip };