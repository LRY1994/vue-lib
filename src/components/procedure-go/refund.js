var graph={
    "copiesArrays": true,
    "copiesArrayObjects": true,
    "nodeDataArray": [
    { "key": 100, "category": "User", "text": "用户提交信息" },
    { "key": 101, "category": "User", "text": "用户撤销" },
    { "key": 102, "category": "User", "text": "用户完善信息" },
    { "key": 103, "category": "User", "text": "退款成功" },
    

    { "key": 300, "text": "系统退款" },
    { "key": 301, "text": "系统退款出错" },
    
    

    { "key": 200, "category": "Supplier", "text": "商家同意退款" },                  
    { "key": 201, "category": "Supplier", "text": "商家拒绝退款" },
    { "key": 202, "category": "Supplier", "text": "商家提交退款" }

    ],
    "linkDataArray": [
    { "from": 100, "to": 200 },
    { "from": 100, "to": 201 },
    { "from": 100, "to": 101 },
    
    { "from": 101, "to": 100 },
    { "from": 102, "to": 200 },

    { "from": 200, "to": 300 },
    { "from":  201, "to": 102 },
    { "from":  202, "to": 103 },

    { "from":  300, "to": 301 },
    { "from":  300, "to": 103 },
    { "from":  301, "to": 202 }
]
};
var tip={
    'new':{
        now:'用户申请退款',
        next:'用户填写信息提交'
    },
    'refunded':{
        now:'退款成功'
    },
    'submitted':{
        now:'已提交退款',
        next:'系统退款'
    },
    'pending':{
        now:'用户已提交信息',
        next:'商家审核'
    },
    'cancel':{
        now:'用户已取消'
    },
    'agree':{
        now:'商家同意退款',
        next:'系统退款'
    },
    'rejected':{
        now:'商家拒绝退款',
        next:'用户完善信息'
    },
    'error':{
        now:'系统退款出错',
        next:'商家提交退款'
    },
    'refunding':{
        now:'退款中'
    }
}
export { graph,tip };