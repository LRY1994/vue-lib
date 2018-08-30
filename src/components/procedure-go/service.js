var graph={
    "copiesArrays": true,
    "copiesArrayObjects": true,
    "nodeDataArray": [
    { "key": 100, "category": "User", "text": "用户提交信息" },
    { "key": 101, "category": "User", "text": "用户完善信息" },
    { "key": 102, "category": "User", "text": "用户确认完成" },
    { "key": 103, "category": "User", "text": "用户撤销" },
    

    {"key":200,"category": "Supplier","text":'商家驳回'},
    {"key":201,"category": "Supplier","text":'商家处理'},
   
    ],
    "linkDataArray": [
    { "from": 100, "to": 201 },
    { "from": 100, "to": 200,text:"信息不明确" },
    { "from": 100, "to": 103 },
    { "from": 101, "to": 201 },
    { "from":  103, "to": 100 },
    { "from":  200, "to": 101 },
    { "from":  201, "to": 102 }
]
};
var tip={
    'new':{
        now:'用户申请售后',
        next:'用户填写信息提交'
    },
    'pending':{
        now:'待商家查看'
    },
    'acting':{
        now:'商家处理中',
    },
    'cancel':{
        now:'用户已取消'
    },
    'unclear':{
        now:'商家驳回',
        next:'用户完善信息'
    },
    'done':{
        now:'商家已处理',
        next:'用户确认完成'
    },
    'finished':{
        now:'用户确认完成'
    }
}
export { graph,tip };