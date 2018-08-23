<template>
<div id="container">
  <p style="background-color:#EEEEEE;margin:0;padding:5px;font-size:0.9em">
    您当前处于 <span class="tip">用户提交资料</span> 步骤 
    下一步等待<span class="tip">供应商接单</span>
    <el-button type="text" v-if="show===false" @click="show=true">展开</el-button>
    <el-button type="text" v-else @click="show=false">收起</el-button>
    
  </p>
    <div id="myholder" v-show="show"></div>
</div>
</template>

<script>
window.joint=require('jointjs');
var Shape = joint.dia.Element.define('default.Rectangle', {      
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
                fontSize: 10           
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

var Link = joint.dia.Link.define('default.Link', {
        attrs: {
            '.connection': {
                stroke: '#2F4F4F',//线
                strokeWidth: 1,
                pointerEvents: 'none',
                targetMarker: {//箭头
                    type: 'path',
                    fill: '#2F4F4F',//填充颜色
                    stroke: '#2F4F4F',//边框颜色
                    strokeWidth:'1',
                    d: 'M 2 -2 0 0 2 2 z'//形状
                }
            }
        },
        connector: {
            name: 'rounded'
        },
        z: -1,
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
            paper:null,
            show:true
        }       
    },
    props:{
        graphData:{
            type:Object,
            required:true
        }
    },
    mounted(){
        let w = document.getElementById('container').width ; 
        this.graph = new joint.dia.Graph;
        this.paper = new joint.dia.Paper({
            el: document.getElementById('myholder'),
            width: w,
            height: 250,         
            model: this.graph,
            elementView: ElementView,//禁止拖拽
            linkView:LinkView//禁止拖拽
        });
        this.layout();
    },
    methods:{
        getWidthandHeight(label){
            let maxLineLength = _.max(label.split('\n'), function(l) { return l.length; }).length,

            // Compute width/height of the rectangle based on the number
            // of lines in the label and the letter size. 0.6 * letterSize is
            // an approximation of the monospace font letter width.
             letterSize = 8,
             width = 2 * (letterSize * (0.6 * maxLineLength + 1)),
             height = 2 * ((label.split('\n').length + 1) * letterSize);
            return {width,height}
        },
        getLayoutOptions() {
            return {
                // setVertices: false,
                // setLabels: false,
                // ranker:'longer-path',//'tight-tree'/'network-simplex',
                rankDir: 'LR',
                align: 'UR',
                rankSep:0,
                edgeSep:0,
                nodeSep:0,
            };
        },
        buildGraphFromAdjacencyList(adjacencyList) {
            let elements = [],links = [],obj,size,node;
            const _this=this;
            const map=this.graphData.node;

            Object.keys(adjacencyList).forEach(function(parentId) {
                // Add element

                obj =map[parentId];
                size = _this.getWidthandHeight(obj.text);
                node =new Shape({id:parentId,size:size}).setText(obj.text);

                if(obj.category&&obj.category.shapeStyle){
                    node = node.setShapeStyle(obj.category.shapeStyle);
                }
                if(obj.category&&obj.category.textStyle){
                    node = node.setTextStyle(obj.category.textStyle);
                }

                elements.push(node);
                
                // Add links
                adjacencyList[parentId].forEach(function(childId) {
                    links.push(
                        new Link().connect(parentId, childId)// .setLabelText(parentLabel + '-' + childLabel)                                         
                    );
                });
            });

            return elements.concat(links);
        },
        layout() {            
            let cells = this.buildGraphFromAdjacencyList(this.graphData.edge);    
            this.graph.resetCells(cells);
            joint.layout.DirectedGraph.layout(this.graph, this.getLayoutOptions());
        },
    }
}
</script>

<style>
#myholder {
    border: 1px solid lightgray;
    margin-bottom:20px;
    padding-left:20px
}
.tip{
  color:#9ACD32;
  font-size:0.9em;
  font-weight:bold;
  padding:5px;
}
</style>
