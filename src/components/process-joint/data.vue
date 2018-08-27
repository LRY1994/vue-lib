<template>
<div>
    <process-joint :graph-data="graphData" ></process-joint>
    <!--或者-->
    <process-joint :graph-data="graphData" paper-data="paperData"> </process-joint>   
</div>

</template>
<script>
import processJoint from './index'
export default{
  components:{processJoint},
data(){
        /*参考http://resources.jointjs.com/docs/jointjs/v2.1/joint.html#dia.attributes
        */
        var userClass = {
            /** fill:填充的背景颜色
                stroke: 边框颜色
                strokeWidth: 边框宽度
                rx: x圆角
                ry: y圆角
                等等
             */
            outerStyle:{//矩形样式
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
             *  fontWeight/fontSize/fontFamily/fontStyle/stroke/fill等
             */
            textStyle:{//文本样式
                fontStyle:'italic',
                fontWeight:'bold',
                fill       : '#fff'
            }    
        };
        var imgClass ={
            outerStyle:{
                width:10,
                height:10
            }
        }
        var img = require('@/assets/avatar-place.png');
        return{
           show:false,
            paperData:{
                width:600,
                height:100,
                layoutOptions:{//参考http://resources.jointjs.com/docs/jointjs/v2.1/joint.html#layout.DirectedGraph
                    setVertices: true,
                }
            },
            graphData :{
                node:{
                    '100':{text:'用户提交资料',category:userClass,type:'shape'},
                    '101':{text:'用户完善资料',category:userClass},
                    '102':{text:'用户确认完成',category:userClass},
                    '103':{text:'用户撤销',category:userClass},

                    '200':{text:'供应商驳回',type:'image',src:img},
                    '201':{text:'供应商接单',type:'image',src:img,category:'imgClass'},
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
