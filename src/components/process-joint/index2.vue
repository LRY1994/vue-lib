<template>
    <div id="myholder"></div>
</template>

<script>
window.joint=require('jointjs');
var Shape = joint.dia.Element.define('demo.Shape', {
        size: {
            width: 50,
            height: 20
        },
        attrs: {
            body: {
                refWidth: '100%',
                refHeight: '100%',
                fill: 'ivory',
                stroke: 'gray',
                strokeWidth: 2,
                rx: 10,
                ry: 10
            },
            label: {
                refX: '50%',
                refY: '50%',
                yAlignment: 'middle',
                xAlignment: 'middle',
                textVerticalAnchor: 'middle',
                 textAnchor: 'middle',
                fontSize: 10
            }
        }
    }, {
        markup: [{
            tagName: 'rect',
            selector: 'body',
        }, {
            tagName: 'text',
            selector: 'label'
        }],

        setText: function(text) {
            return this.attr('text/text', text || '');
        }
    });

var Link = joint.dia.Link.define('demo.Link', {
        attrs: {
            '.connection': {
                stroke: 'gray',
                strokeWidth: 2,
                pointerEvents: 'none',
                targetMarker: {
                    type: 'path',
                    fill: 'gray',
                    stroke: 'none',
                    d: 'M 10 -10 0 0 10 10 z'
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





export default {   
    data(){
        return{
             graph:null,
            paper:null
        }       
    },
    props:{
        graphData:{
            type:Object,
            required:true
        }
    },
    mounted(){
        let w = document.body.clientWidth - 270-40; 
        this.graph = new joint.dia.Graph;
        this.paper = new joint.dia.Paper({
            el: document.getElementById('myholder'),
            width: w,
            height: 300,         
            model: this.graph
        });
        this.layout();
    },
    methods:{
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
                size: {
                    width: width,
                    height: height
                },
                // size: { width: width, height: height },
                attrs: {
                    text: { 
                        text: label, 
                        // 'font-size': 16, 
                        // 'font-family': 'monospace' 
                        //  refX: '50%',
                        // refY: '50%',
                        // yAlignment: 'middle',/
                        // xAlignment: 'middle',
                        // textVerticalAnchor: 'middle',
                        // textAnchor: 'middle',
                        fontSize: 10
                    },
                    rect: {
                        // width: width, 
                        // height: height,
                        // rx: 5, ry: 5,
                        // stroke: '#555'
                        refWidth: '100%',
                        refHeight: '100%',
                        fill: 'ivory',
                        stroke: 'gray',
                        strokeWidth: 2,
                        rx: 10,
                        ry: 10
                    }
                }
            });
        },
        getLayoutOptions() {
            return {
                setVertices: false,
                setLabels: true,
                ranker:'network-simplex',
                rankDir: 'LR',
                align: 'DR',
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
            Object.keys(adjacencyList).forEach(function(parentLabel) {
                // Add element
                elements.push(
                    _this.makeElement(map[parentLabel])
                //    new Shape(parentLabel).setText(map[parentLabel])
                );
                // Add links
                adjacencyList[parentLabel].forEach(function(childLabel) {
                    links.push(
                        new Link()
                            .connect(map[parentLabel], map[childLabel])
                            // .setLabelText(parentLabel + '-' + childLabel)
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
    margin-top:-130px;
    margin-bottom:20px;
    padding-left:20px
}
</style>
