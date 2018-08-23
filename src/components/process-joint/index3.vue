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
var Ellipse ={
    ellipse: {
            // rx:10,
            // ry:10,//圆就设置成一样的
            refWidth: '100%',
            refHeight: '100%',
            fill:{
                    type: 'linearGradient',
                    stops: [
                        {offset: '0%', color: '#B0E0E6'},//渐变开始
                        {offset: '100%', color: '#F0F8FF'}//渐变结束
                    ]
                },
            stroke: '#B0E0E6',
            strokeWidth: 1
        },
        
        text: {
            refX: '0',
            refY: '0',     
            xAlignment:'middle',
            yAlignment:'middle',                                     
            textVerticalAnchor: 'middle',
            textAnchor: 'middle',
            fontSize: 10           
        }   
};
var Rectangle ={
    rect: {
        refWidth: '100%',
        refHeight: '100%',
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
var Methods = {
    setText: function(text) {                    
        return this.attr('text/text', text || '');
    },
    setShapeStyle:function(type,shapeStyle){
        let newstyle = Object.assign({},this.attr(type),shapeStyle);
        return this.attr(type,newstyle)
    },
       
    setTextStyle:function(textStyle){
        let newstyle = Object.assign({},this.attr('text'),textStyle);
        return this.attr('text',newstyle)
    },

}
var common = {
        markup: '<rect/><text/>',
        setText: function(text) {         
           
            return this.attr('text/text', text || '');
        },
       
        setShapeStyle:function(rectStyle){  
            let newstyle = Object.assign({},this.attr('rect'),rectStyle);
                      console.log(newstyle);
            return this.attr('rect',newstyle)
        },
       
        setTextStyle:function(textStyle){
            return this.attr('text',textStyle)
        },
        hightLight:function(){
            console.log(this.attr('rect'));
            this.attr('text/fontWeight','bold');
            this.attr('rect/fill/stops/0',{offset: '0%', color: '#98FB98'});
            this.attr('rect/fill/stops/1',{offset: '100%', color: '#9ACD32'});
            
            return this;
        }
}
//矩形
joint.dia.Element.define('default.Rectangle', {      
        attrs: {   ...Rectangle }                    
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
        },
        // setText: function(text) {         
        //     Methods.setText.apply(this,[text])
        // },
       
        // setShapeStyle:function(rectStyle){  
        //     Methods.setShapeStyle.apply(this,['rect',rectStyle])
        // },
       
        // setTextStyle:function(textStyle){
        //     Methods.setTextStyle.apply(this,[textStyle])
        // },
    }
);
//圆、椭圆
joint.dia.Element.define('default.Ellipse', {      
        attrs: {   ...Ellipse }                    
    }, 
    {
         markup: '<ellipse/><text/>',
         setText: function(text) {                    
            return this.attr('text/text', text || '');
        },
        setShapeStyle:function(shapeStyle){
            let newstyle = Object.assign({},this.attr('ellipse'),shapeStyle);
            return this.attr('ellipse',newstyle)
        },
        
        setTextStyle:function(textStyle){
            let newstyle = Object.assign({},this.attr('text'),textStyle);
            return this.attr('text',newstyle)
        },
    }
);

var Link = joint.dia.Link.define('demo.Link', {
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
        makeElement(type,label,id){
            let size =this.getWidthandHeight(label);
            if(type=='Rectangle'){
                return new joint.shapes.default.Rectangle(
                    { id: id,size :size});
            }
             if(type=='Ellipse'){
                  Ellipse.ellipse.rx = size.width;
                  Ellipse.ellipse.ry = size.height;                 
                 return new joint.shapes.default.Ellipse(
                    { id: id });
             }
            
        },
        getWidthandHeight(label){
            var maxLineLength = _.max(label.split('\n'), function(l) { return l.length; }).length;

            // Compute width/height of the rectangle based on the number
            // of lines in the label and the letter size. 0.6 * letterSize is
            // an approximation of the monospace font letter width.
            var letterSize = 8;
            var width = 2 * (letterSize * (0.6 * maxLineLength + 1));
            var height = 2 * ((label.split('\n').length + 1) * letterSize);
            return {
               
                    width,height
                
            }
        },
        getLayoutOptions() {
            return {
                // setVertices: false,
                // setLabels: false,
                // ranker:'longer-path',//'tight-tree'/'network-simplex',
                rankDir: 'LR',
                align: 'UR',
                rankSep:50,
                edgeSep:50,
                nodeSep:50,
            };
        },
        buildGraphFromAdjacencyList(adjacencyList) {
            let elements = [];
            let links = [];
            const _this=this;
            const map=this.graphData.node;
            Object.keys(adjacencyList).forEach(function(parentId) {
                // Add element
                // let node = _this.makeElement('Rectangle',map[parentId],parentId);
                let node = _this.makeElement('Ellipse',map[parentId],parentId);
                
                
                node.setText(map[parentId]);
                if(parentId===_this.graphData.highlight){
                    node = node.setShapeStyle({
                        fill:{
                            type: 'linearGradient',
                            stops: [
                                {offset: '0%', color: '#98FB98'},
                                {offset: '100%', color: '#9ACD32'}
                            ]
                        },
                    }).setTextStyle({
                        fontWeight:'bold'
                    })
                    
                    // node= node.hightLight();
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
            var cells = this.buildGraphFromAdjacencyList(this.graphData.edge);    
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
  font-size:0.8em;
  font-weight:bold;
  padding:5px;
}
</style>
