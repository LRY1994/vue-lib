<script>
export default {
    data(){
        var userClass = {//这个要参照SVG属性
            /**shapeStyle
             * fill:填充的背景颜色
                stroke: 边框颜色
                strokeWidth: 边框宽度
                rx: 圆角
                ry: 
             */
            shapeStyle:{//矩形样式
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
            /**
             * textStyle
             *  fontWeight
             *  fontSize
             * 
             */
            textStyle:{//文本样式
                fontWeight:'bold'
            }    
        };
        return{
            graphData :{
                node:{
                    '100':{text:'用户提交资料',category:userClass},
                    '101':{text:'用户完善资料',category:userClass},
                    '102':{text:'用户确认完成',category:userClass},
                    '103':{text:'用户撤销',category:userClass},

                    '200':{text:'供应商驳回'},
                    '201':{text:'供应商接单'},
                    '202':{text:'供应商完工'},
                    '203':{text:'等待供应商处理'},

                    '300':{text:'系统交付出错'}               
                },
                edge :{//每个点都要写
                    '100': ['200','201','103'], 
                    '101': ['201'],
                    '102':[],
                    '103': ['100'],

                    '200': ['101'],              
                    '201': ['202','300'],
                    '202': ['102'],               
                    '203': ['102'], 

                    '300': ['203'],
                
                },
            }
        }
    }
}
</script>
