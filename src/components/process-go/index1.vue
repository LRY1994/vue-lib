<template>
<div>
  <p style="background-color:#d5d5d5;margin:0;padding:5px;">
    您当前处于 <span class="tip">用户提交资料</span> 步骤 
    下一步等待<span class="tip">供应商接单</span>
    <el-button type="text" v-if="show===false" @click="show=true">展开</el-button>
    <el-button type="text" v-else @click="show=false">收起</el-button>
    
  </p>
  <div id="myDiagramDiv" v-show="show"  ></div>
  </div> 
    
</template>

<script>
window.go =require('./go.js') 
var $ = go.GraphObject.make;

import datam from './data';
export default{
  mixins:[datam],
  data(){
    return{
      myDiagram:null,
      show:true
    }
  },
  mounted(){
    this.load();
  },
  methods:{
    load(){
      this.init();
      this.addNodeTemplate(this.User);
      this.addNodeTemplate(this.Supplier);
      this.layout();
    },
    layout() {
      this.myDiagram.model = go.Model.fromJson(this.myjson);
      this.myDiagram.layoutDiagram(true);
    },

    getOption(){
      // for conciseness in defining templates

      let options={
        yellowgrad : $(go.Brush, "Linear", { 0: "rgb(254, 201, 0)", 1: "rgb(254, 162, 0)" }),
        greengrad : $(go.Brush, "Linear", { 0: "#98FB98", 1: "#9ACD32" }),
        bluegrad : $(go.Brush, "Linear", { 0: "#B0E0E6", 1: "#87CEEB" }),
        redgrad : $(go.Brush, "Linear", { 0: "#C45245", 1: "#871E1B" }),
        whitegrad : $(go.Brush, "Linear", { 0: "#F0F8FF", 1: "#E6E6FA" }),
        bigfont : "bold 8pt Helvetica, Arial, sans-serif",
        smallfont : "bold 6pt Helvetica, Arial, sans-serif",
        
      }

      return options;
    },

     textStyle(){
        return {
          margin: 6,
          wrap: go.TextBlock.WrapFit,
          textAlign: "center",
          editable: true,
          font: this.getOption()['bigfont']
        }
      },
      init(){
        this.myDiagram =
            $(go.Diagram, "myDiagramDiv",
              {
                isReadOnly: true,
                // have mouse wheel events zoom in and out instead of scroll up and down
                "toolManager.mouseWheelBehavior": go.ToolManager.WheelNone,
                initialAutoScale: go.Diagram.Uniform,
                "linkingTool.direction": go.LinkingTool.ForwardsOnly,
                initialContentAlignment: go.Spot.Center,
                layout: $(go.LayeredDigraphLayout, { isInitial: false, isOngoing: false, layerSpacing: 50 }),
                "undoManager.isEnabled": true
              });
              //默认节点模板
        this.myDiagram.nodeTemplate =
            $(go.Node, "Auto",
              new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
              // define the node's outer shape, which will surround the TextBlock
              $(go.Shape, "Rectangle",
                { fill: this.getOption()['yellowgrad'], stroke: "black",
                  portId: "", fromLinkable: true, toLinkable: true, cursor: "pointer",
                  toEndSegmentLength: 50, fromEndSegmentLength: 40 }),
              $(go.TextBlock, "Page",
                { margin: 6,
                  font: this.getOption()['bigfont'],
                  editable: true },
                new go.Binding("text", "text").makeTwoWay()));
            // replace the default Link template in the linkTemplateMap
          this.myDiagram.linkTemplate =
                $(go.Link,  // the whole link panel
                  new go.Binding("points").makeTwoWay(),
                  { curve: go.Link.Bezier, toShortLength: 15 },
                  new go.Binding("curviness", "curviness"),
                  $(go.Shape,  // the link shape
                    { stroke: "#2F4F4F", strokeWidth: 2.5 }),
                  $(go.Shape,  // the arrowhead
                    { toArrow: "kite", fill: "#2F4F4F", stroke: null, scale: 2 })
                  );
      },
      /**
       * options:{
       *  category
       *  shape:RoundedRectangle/Rectangle
       *  shapeOptions:{
       *   fill:bluegrad/greengrad/yellowgrad/null/redgrad/whitegrad  自定义的
       *   stroke: "black",
       *   portId:""
       *   fromLinkable:true
       *   toLinkable:
       *   cursor:"pointer"
       *   fromEndSegmentLength:40
       *    toEndSegmentLength
       *    strokeWidth
       *  
       *   }
       *    textStyle:
       *        { margin: 9,
            maxSize: new go.Size(200, NaN),
            wrap: go.TextBlock.WrapFit,
            editable: true,
            textAlign: "center",
            font: smallfont },
       *    
       * }
       */
      addNodeTemplate(options){
        let fill = this.getOption()[options.shapeOptions.fill];
        options.shapeOptions.fill = fill;
        this.myDiagram.nodeTemplateMap.add(options.category,
          $(go.Node, "Auto",
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            $(go.Shape, options.shape,options.shapeOptions),
            $(go.TextBlock,  this.textStyle(),
              new go.Binding("text", "text").makeTwoWay())
            ));
      },

    }


}

</script>

<style scoped>
.tip{
  color:red;
  font-size:0.8em;
  font-weight:bold;
  padding:5px;
}
#myDiagramDiv{
  height: 200px; 
  border: solid 1px #d3d3d3;
}

</style>
