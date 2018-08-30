<template>
  <div id="diagramDiv"></div>   
</template>

<script>

import go from 'alogic-gojs';
var $ = go.GraphObject.make;

export default{
      props: ["modelData","category"],  // accept model data as a parameter
      data() { return { diagram: null } },  // provide access to the GoJS Diagram
      mounted: function() {
        this.init();
        for(let ctg of this.category){
            this.addNodeTemplate(ctg);
        }
        this.updateModel(this.modelData);

      },
      watch: {
        modelData: function(val) { this.updateModel(val); }
      },
      methods: {
          init(){
                var myDiagram =
                $(go.Diagram, "diagramDiv",
                    {
                      isReadOnly: true,
                    initialContentAlignment: go.Spot.Center,
                    "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
                    layout: $(go.LayeredDigraphLayout, { isInitial: false, isOngoing: false, layerSpacing: 50 }),
                    //   layout: $(go.TreeLayout, { angle: 0, arrangement: go.TreeLayout.ArrangementHorizontal }),
                    "undoManager.isEnabled": true,
                    // Model ChangedEvents get passed up to component users
                    });

                myDiagram.nodeTemplate =
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

                myDiagram.linkTemplate =
                $(go.Link,  // the whole link panel
                        new go.Binding("points").makeTwoWay(),
                        { curve: go.Link.Bezier, toShortLength: 15 },
                        new go.Binding("curviness", "curviness"),
                        $(go.Shape,  // the link shape
                            { stroke: "#2F4F4F", strokeWidth: 2.5 }),
                        $(go.TextBlock,                        // this is a Link label
                            new go.Binding("text", "text")),
                        $(go.Shape,  // the arrowhead
                            { toArrow: "kite", fill: "#2F4F4F", stroke: null, scale: 2 })
                        );

                this.diagram = myDiagram;
          },
          addNodeTemplate(options){
            let fill = this.getOption()[options.shapeOptions.fill];
            options.shapeOptions.fill = fill;

            this.diagram.nodeTemplateMap.add(options.category,
            $(go.Node, "Auto",
                new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                // $(go.Shape, options.shape,{...options.shapeOptions,stroke:null}),
                $(go.Shape, options.shape,options.shapeOptions),
                
                $(go.TextBlock,  {
                    margin: 6,
                    wrap: go.TextBlock.WrapFit,
                    textAlign: "center",
                    editable: true,
                    font: this.getOption()['bigfont']
                },
                new go.Binding("text").makeTwoWay())
                ));
        },
          getOption(){
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
        model: function() { return this.diagram.model; },
        updateModel: function(val) {
          // No GoJS transaction permitted when replacing Diagram.model.
          if (val instanceof go.Model) {
            this.diagram.model = val;
          } else {
            var m = new go.GraphLinksModel()
            if (val) {
              for (var p in val) {
                m[p] = val[p];
              }
            }
            this.diagram.model = m;
          }

          this.diagram.layoutDiagram(true);//箭头不会挡住矩形
        }
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
#diagramDiv{
  height: 100%; 
  border: solid 1px #d3d3d3;
}

</style>
