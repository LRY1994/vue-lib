<template>
  
    <div id="paper" ></div>
 
</template>

<script>

window.joint=require('jointjs');
export default {
    data(){
        return{
            graph:null,
            paper:null
        }
    },
    mounted(){    
        let w = document.body.clientWidth - 270-30;   
        this.graph = new joint.dia.Graph;
        this.paper = new joint.dia.Paper({
            el: document.getElementById('paper'),
            width: w,
            height: 300,
            gridSize: 1,
            model: this.graph
        });
        this.layout();
        
    },
     methods:{
        makeLink(parentElementLabel, childElementLabel) {

            return new joint.dia.Link({
                source: { id: parentElementLabel },
                target: { id: childElementLabel },
                attrs: { '.marker-target': { d: 'M 4 0 L 0 2 L 4 4 z' } },
                smooth: true
            });
           
        },
        makeElement(label) {

            var maxLineLength = _.max(label.split('\n'), function(l) { return l.length; }).length;

            // Compute width/height of the rectangle based on the number
            // of lines in the label and the letter size. 0.6 * letterSize is
            // an approximation of the monospace font letter width.
            var letterSize = 8;
            var width = 2 * (letterSize * (0.6 * maxLineLength + 1));
            var height = 2 * ((label.split('\n').length + 1) * letterSize);

            return new joint.shapes.basic.Rect({
                id: label,
                size: { width: width, height: height },
                attrs: {
                    text: { text: label, 'font-size': letterSize, 'font-family': 'monospace' },
                    rect: {
                        width: width, height: height,
                        rx: 5, ry: 5,
                        stroke: '#555'
                    }
                }
            });
        },
        buildGraphFromAdjacencyList(adjacencyList) {
            var elements = [];
            var links = [];
            const _this=this;
            _.each(adjacencyList, function(edges, parentElementLabel) {
                elements.push(_this.makeElement(parentElementLabel));

                _.each(edges, function(childElementLabel) {
                    links.push(_this.makeLink(parentElementLabel, childElementLabel));
                });
            });

            // Links must be added after all the elements. This is because when the links
            // are added to the graph, link source/target
            // elements must be in the graph already.
            return elements.concat(links);
        },
        layout() {
            
            let adjacencyList ={
               a: ['b','c','d'],
                b: ['d', 'e'],
                c: [],
                d: [],
                e: ['e'],
                f: [],
                g: ['b','i'],
                h: ['f'],
                i: ['f','h']

                    }
            
            var cells = this.buildGraphFromAdjacencyList(adjacencyList);
            this.graph.resetCells(cells);
            joint.layout.DirectedGraph.layout(this.graph,{ setLinkVertices: false });
            
        },

   }
}
</script>


<style>
         #paper {
             border: 1px solid lightgray;
           
             margin-left: auto;
             margin-right: auto;
             left: 0;
             right: 0;
             top: 100px;
         }
         .controls {
             margin: auto;
             text-align: center;
             padding: 10px 0;
             border-bottom: 1px solid lightgray;
         }
        </style>