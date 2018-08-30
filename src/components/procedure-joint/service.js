
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
        var paperData={           
            layoutOptions:{//参考http://resources.jointjs.com/docs/jointjs/v2.1/joint.html#layout.DirectedGraph
                setVertices: true,
                rankSep:80
            }
        };
         var   graphData ={
                node:{
                    '100':{text:'用户提交信息',category:userClass},
                    '101':{text:'用户完善信息',category:userClass},
                    '102':{text:'用户确认完成',category:userClass},
                    '103':{text:'用户撤销',category:userClass},

                    '200':{text:'商家驳回'},
                    '201':{text:'商家处理'},

            
                },
                edge :{//每个点都要写
                    '100': ['200','201','103'], 
                    '101': ['201'],
                    '102':[],
                    '103': ['100'],

                    '200': ['101'],              
                    '201': ['102'],
                                


                
                },
            }
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
export  {graphData,paperData,tip}