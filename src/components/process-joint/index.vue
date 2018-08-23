/** 使用方法
<component :graph-data="graphData" :paper-h="200" :paper-w="200"> </component>
 */
<template>
<div id="container">
    <div id="myholder"></div>
</div>
</template>
<script>
var img = require('./img.png');
window.joint=require('jointjs');
//矩形/椭圆
var JShape = joint.dia.Element.define('default.Rectangle', {      
        attrs: {  
            rect: {
                refWidth: '100%',
                refHeight: '100%',
                //下面这些可以自己设置
                fill:{
                    type: 'linearGradient',
                    stops: [
                        {offset: '0%', color: '#B0E0E6'},//渐变开始
                        {offset: '100%', color: '#F0F8FF'}//渐变结束
                    ]
                },
                stroke: '#B0E0E6',
                strokeWidth: 1,
                rx: 5,//圆角
                ry: 5
            },
            text: {
                refX: '50%',
                refY: '50%',                               
                textVerticalAnchor: 'middle',
                textAnchor: 'middle',
                fontSize: 12           
            }
         }                    
    }, 
    {
         markup: '<rect/><text/>',
         setText: function(text) {                    
            return this.attr('text/text', text || '');
        },
        setShapeStyle:function(shapeStyle){
            let newstyle = Object.assign({},this.attr('rect'),shapeStyle);
            return this.attr('rect',newstyle)
        },
        
        setTextStyle:function(textStyle){
            let newstyle = Object.assign({},this.attr('text'),textStyle);
            return this.attr('text',newstyle)
        }
    }
);
//图片
var JImage = joint.dia.Element.define('Image',{
    attrs:{
        image:{
            xlinkHref:''
        },
        text: {
                ref:'image',              
                refX: '50%',
                refY: '110%',                               
                textVerticalAnchor: 'middle',
                textAnchor: 'middle',
                fontSize: 12           
        }
    }},{
         markup: '<image/><text/>',
         setText: function(text) {                    
            return this.attr('text/text', text || '');
        },
        setImage:function(opt){
            let newstyle = Object.assign({},this.attr('image'),opt);
            return this.attr('image',newstyle)
        },
        
        setTextStyle:function(textStyle){
            let newstyle = Object.assign({},this.attr('text'),textStyle);
            return this.attr('text',newstyle)
        }
    })



var JLink = joint.dia.Link.define('default.Link', {
        attrs: {
            '.connection': {
                stroke: '#2F4F4F',//线
                strokeWidth: 1,
                fill:'#fff',
                pointerEvents: 'none',
                targetMarker: {//箭头
                    type: 'path',
                    fill: '#2F4F4F',//填充颜色
                    stroke: '#2F4F4F',//边框颜色
                    strokeWidth:'1',
                    d: 'M -3 0 2 2 0 0 2 -2 -3 0 z'//形状
                }
            }
        },
        connector: {
            name: 'smooth'
            // name:'rounded'
        },
        z: -1, //make sure all links are displayed under the elements
        weight: 1,
        minLen: 1,
        labelPosition: 'c',
        labelOffset: 10,
        labelSize: {
            width: 50,
            height: 30
        },
        labels: [{
            markup: '<rect/><text/>',
            attrs: {
                text: {
                    fill: 'gray',
                    textAnchor: 'middle',
                    refY: 5,
                    refY2: '-50%',
                    fontSize: 10,
                    cursor: 'pointer'
                },
                // rect: {
                //     fill: 'lightgray',
                //     stroke: 'gray',
                //     strokeWidth: 2,
                //     refWidth: '100%',
                //     refHeight: '100%',
                //     refX: '-50%',
                //     refY: '-50%',
                //     rx: 5,
                //     ry: 5
                // }
            },
            size: {
                width: 50, height: 10
            }
        }]

    }, {
        markup: '<path class="connection"/><g class="labels"/>',
        
        connect: function(sourceId, targetId) {
            return this.set({
                source: { id: sourceId },
                target: { id: targetId }
            });
        },

        setLabelText: function(text) {
            return this.prop('labels/0/attrs/text/text', text || '');
        }
    });



var ElementView = joint.dia.ElementView.extend({
        pointerdown: function () {

            // this._click = true;
            // joint.dia.ElementView.prototype.pointerdown.apply(this, arguments);
        },
        pointermove: function(evt, x, y) {
            // this._click = false;
            // joint.dia.ElementView.prototype.pointermove.apply(this, arguments);
        },
        pointerup: function (evt, x, y) {
            // if (this._click) {
            //     // triggers an event on the paper and the element itself
            //     this.notify('cell:click', evt, x, y); 
            // } else {
            //     joint.dia.ElementView.prototype.pointerup.apply(this, arguments);
            // }
        }
    });
var LinkView = joint.dia.LinkView.extend({
    addVertex: function(evt, x, y) {},
    removeVertex: function(endType) {},
    pointerdown:function(evt, x, y) {}
});


export default {   
    data(){
        return{
            graph:null,
            paper:null
        }       
    },
    props:{
        graphData:{//点边数据
            type:Object,
            required:true
        },
      
        paperH:{required:false},//画布高度
        paperW:{required:false},//画布宽度
        
    },
    mounted(){
        //默认宽度是容器100%,高度为220px;
        let w = document.getElementById('container').offsetWidth-120 ,h=220;
        if(this.paperH){ h = this.paperH}
        if(this.paperW){ w = this.paperW}
        
        this.graph = new joint.dia.Graph;
        this.paper = new joint.dia.Paper({
            el: document.getElementById('myholder'),
            width: w,
            height: h,         
            model: this.graph,
            elementView: ElementView,//禁止拖拽
            linkView:LinkView//禁止拖拽
        });
        
        this.layout();
        
    },
    methods:{
        //创建节点
        makeElement(type,id,label){
            let size;
            switch(type){
                case 'image':{
                    return new JImage({id}).setText(label);
                    break;
                }
                case 'shape':
                default:{
                    size = this.getWidthandHeight(label);
                    return new JShape({id,size}).setText(label);
                    break;
                }
            }
        },
        //计算矩形的大小
        getWidthandHeight(label){
            let maxLineLength = _.max(label.split('\n'), function(l) { return l.length; }).length,

            /* Compute width/height of the rectangle based on the number
              of lines in the label and the letter size. 0.6 * letterSize is
              an approximation of the monospace font letter width.
             */
             letterSize = 10,
             width = 2 * (letterSize * (0.6 * maxLineLength + 1)),
             height = 2 * ((label.split('\n').length + 1) * letterSize);
            return {width,height}
        },
        /*
        * 布局参数，可参考http://resources.jointjs.com/docs/jointjs/v2.1/joint.html#layout.DirectedGraph
        */
        getLayoutOptions() {
            return {
                setVertices: true,
                setLabels: true,
                ranker:'network-simplex',
                rankDir: 'LR',
                align: 'DR',
                rankSep:20,
                edgeSep:20,
                nodeSep:20,
            };
        },
        buildGraphFromAdjacencyList(adjacencyList) {
            let elements = [],links = [],obj,size,node,edge;
            const _this=this;
            const map=this.graphData.node;

            Object.keys(adjacencyList).forEach(function(parentId) {
                obj =map[parentId];
               
                if(obj.type===undefined){ obj.type='shape'};//默认创建矩形

                node = _this.makeElement(obj.type,parentId,obj.text);

                if(obj.type==='image'){
                    node = node.attr('image/xlinkHref',obj.src);
                }
                //如果有样式，就覆盖默认样式
                if(obj.category&&obj.category.shapeStyle){
                    node = node.setShapeStyle(obj.category.shapeStyle);
                }
                if(obj.category&&obj.category.textStyle){
                    node = node.setTextStyle(obj.category.textStyle);
                }
                // Add element
                elements.push(node);
                
                // Add links
                adjacencyList[parentId].forEach(function(childId) {
                    links.push(
                        new JLink().connect(parentId, childId)// .setLabelText(parentLabel + '-' + childLabel)                                         
                    );
                });
            });

            return elements.concat(links);
        },
        //构建布局
        layout() {            
            let cells = this.buildGraphFromAdjacencyList(this.graphData.edge);    
            this.graph.resetCells(cells);
            joint.layout.DirectedGraph.layout(this.graph, this.getLayoutOptions());
        },
    }
}
</script>

<style>
#container{
    border:1px solid #d3d3d3;
}
#myholder{   
     margin: 0 auto;
}
</style>