
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
 
        var graphData ={
                node:{
                    '100':{text:'用户申请退款',category:userClass},
                    '101':{text:'用户撤销',category:userClass},
                    '102':{text:'用户完善信息',category:userClass},
                    '103':{text:'退款成功',category:userClass},
                    
                    '200':{text:'商家同意'},
                    '201':{text:'商家拒绝'},
                    '202':{text:'商家处理'},


                    '300':{text:'系统退款'}, 
                    '301':{text:'系统退款出错'}               
                                  
                },
                edge :{//每个点都要写
                    '100': ['200','201','101'], 
                    '101': ['100'],
                    '102':['200'],
                    '103': [],

                    '200': ['300'],              
                    '201': ['102'],
                    '202': ['103'],               
 

                    '300': ['301','103'],
                    '301': ['202'],
                    
                
                },
            }
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
        next:'商家手动提交退款'
    },
    'refunding':{
        now:'退款中'
    }
}
export  {graphData,tip}