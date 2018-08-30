var userClass = {          
outerStyle:{
    fill:{
        type: 'linearGradient',
        stops: [
            {offset: '0%', color: '#98FB98'},
            {offset: '100%', color: '#9ACD32'}
        ],
    },
    rx:150,
    ry:15
},           
textStyle:{
    fontStyle:'italic',
    fontWeight:'bold',
    fill       : '#fff'
}    
};

var     graphData ={
    node:{
        '100':{text:'用户提交信息',category:userClass},
        '101':{text:'用户完善信息',category:userClass},
        '102':{text:'用户确认完成',category:userClass},
        '103':{text:'用户撤销',category:userClass},

        '200':{text:'商家驳回'},
        '201':{text:'商家接单'},
        '202':{text:'商家完工'},
        '203':{text:'待商家处理'},
        '204':{text:'商家实施'},
        

        '300':{text:'系统交付出错'},
        '301':{text:'系统交付'},               
    },
    edge :{//每个点都要写
        '100': ['200','201','103'], 
        '101': ['201'],
        '102':[],
        '103': ['100'],

        '200': ['101'],              
        '201': ['204','301'],
        '202': ['102'],               
        '203': ['102'], 
        '204':['202'],

        '300': ['203'],
        '301':['102','300']
    
    },
}
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
export  {graphData,tip}