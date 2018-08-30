var graph={
    "copiesArrays": true,
    "copiesArrayObjects": true,
    "nodeDataArray": [
    { "key": -1, "category": "User", "text": "用户提交信息" },
    { "key": -2, "category": "User", "text": "用户完善信息" },
    { "key": -3, "category": "User", "text": "用户确认完成" },
    { "key": -4, "category": "User", "text": "用户撤销" },
    

    { "key": 0, "text": "系统交付" },
    

    { "key": 100, "category": "Supplier", "text": "商家驳回" },                  
    { "key": 101, "category": "Supplier", "text": "商家接单" },
    { "key": 102, "category": "Supplier", "text": "商家完工" },
    { "key": 103, "category": "Supplier", "text": "商家处理" },

    ],
    "linkDataArray": [
    { "from": -1, "to": -4 },
    { "from": -4, "to": -1 },
    { "from": -1, "to": 100 ,text:"信息不明确"},
    { "from": 100, "to": -2 },
    { "from":  -2, "to": 101 },
    { "from":  -1, "to": 101 },
    { "from":  101, "to": 102 ,text:"人工服务类商品"},
    { "from":  101, "to": 0 },
    { "from":  0, "to": 103 ,text:'系统出错'},
    { "from":  0, "to": -3 },
    
    { "from":  103, "to": -3 },
    { "from":  102, "to": -3 }
]
};
var tip={
    'new':{
        now:'用户申请交付',
        next:'用户填写信息提交'
    },
    'acting':{
        now:'商家实施中',
        next:'商家完工'
    },
    'done':{
        now:'商家已完工',
        next:'用户确认完成'
    },
    'finished':{
        now:'用户确认完成',
    },
    'refunded':{
        now:'订单已退款'
    },
    'submitted':{
        now:'用户提交信息',
        next:'待商家审核'
    },
    'error':{
        now:'系统交付出错',
        next:'待商家处理'
    },
    'unclear':{
        now:'商家驳回',
        next:'用户完善信息'
    },
    'cancel':{
        now:'用户撤销'
    }
}
export { graph,tip };