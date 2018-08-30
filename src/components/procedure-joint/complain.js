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

var mangerClass = {          
    outerStyle:{
        fill:{
            type: 'linearGradient',
            stops: [
                {offset: '0%', color: 'rgb(254, 201, 0)'},
                {offset: '100%', color: 'rgb(254, 162, 0)'}
            ],
        },
        rx:0,
        ry:0
    }   
};

var  paperData = {               
        height:300
    };
var    graphData ={
        node:{
            '100':{text:'用户提交信息',category:userClass},
            '101':{text:'用户完善信息',category:userClass},
            '102':{text:'用户确认完成',category:userClass},
            '103':{text:'用户撤销',category:userClass},

            '200':{text:'商家处理'},
            

            '300':{text:'管理员驳回',category:mangerClass},
            '301':{text:'管理员通知商家处理',category:mangerClass},
            '302':{text:'管理员令商家重处理',category:mangerClass},
            '303':{text:'管理员仲裁不通过',category:mangerClass}
    
        },
        edge :{//每个点都要写
            '100': ['300','301','103'], 
            '101': ['301'],
            '102':[],
            '103': ['100'],

            '200': ['303','102'],   
            
            '300':['101'],
            '301':['200'],
            '302':['200'],
            '303':['302']                                                   
        },
    }

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
export { paperData,graphData,tip }