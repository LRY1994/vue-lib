
<script>
export default {
data(){
    return{
        User:{
            category:"User",
            shape:"RoundedRectangle",
            shapeOptions:{
                fill:"bluegrad",
                portId:"",
                cursor:"pointer",
                fromEndSegmentLength:40
            }   

        },
        Supplier:{
            category:"Supplier",
            shape:"RoundedRectangle",
            shapeOptions:{
                fill:"greengrad",
                portId:"",
                toEndSegmentLength:40
            }  
        },

        myjson:{
            "copiesArrays": true,
            "copiesArrayObjects": true,
            "nodeDataArray": [
            { "key": -1, "category": "User", "text": "用户提交资料" },
            { "key": -2, "category": "User", "text": "用户完善资料" },
            { "key": -3, "category": "User", "text": "用户确认完成" },
            { "key": -4, "category": "User", "text": "用户撤销" },
            

            { "key": 0, "text": "系统交付出错" },
            

            { "key": 100, "category": "Supplier", "text": "供应商驳回" ,
            "reasonsList": [{"text":"内容描述不具体"}]
            },   
                
            { "key": 101, "category": "Supplier", "text": "供应商接单" },
            { "key": 102, "category": "Supplier", "text": "供应商完工" },
            { "key": 103, "category": "Supplier", "text": "等待供应商处理" },

            ],
            "linkDataArray": [
            { "from": -1, "to": -4 },
            { "from": -4, "to": -1 },
            { "from": -1, "to": 100 },
            { "from": 100, "to": -2 },
            { "from":  -2, "to": 101 },
            { "from":  -1, "to": 101 },
            { "from":  101, "to": 102 },
            { "from":  101, "to": 0 },
            { "from":  0, "to": 103 },
            { "from":  103, "to": -3 },
            { "from":  102, "to": -3 }
        ]
    }
    }
}
}
</script>

