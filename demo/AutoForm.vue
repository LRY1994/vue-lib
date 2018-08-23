<template>    
    <awesome-form ref="dyform" :items="items" :config="config">
        <template slot="Party_A_address" slot-scope="{item, form}">
            <address-chooser :item="item" :state="curState" v-model="form[item.property]" :worksheet-id="worksheetId"></address-chooser>
        </template>
    </awesome-form>
</template>

<script type="text/javascript">
import {dynamicGenDisabled,dynamicGenDisplay}from '@/config/a_form_config.js';
export default {
    props:{
        worksheetId:{
            type:String,
            required:true
        },
        domain:{
            type:String,
            required:true
        },
        getExtend:{
            type:Function,
            required:true
        }
    },
    watch:{
        curState(val){
            this.config[0].detail.genDisabled = dynamicGenDisabled('user_' + val);
            this.config[0].detail.genDisplay = dynamicGenDisplay('user_' + val);
        }
    },
    data() {
        return {
            items: [],
            curState :'',
            config: [{
                editor: ['*'],
                detail: {
                    genDisabled: null,
                    genDisplay: null
                }
            }, {
                editor: ['input', 'textarea', 'daterange', 'timerange', 'check', 'radio', 'select'],
                detail: {
                    setter: this.normalSetter,
                }
            }, {
                editor: ['file'],
                detail: {
                    getter: this.fileGetter,
                    setter: this.fileSetter
                }
            }]
        }
    },
    created() {
        this.getItems();
    },
    methods:{
        //获取表单项
        getItems() {
            this.getExtend({
                    worksheetId: this.worksheetId,
                    domain:this.domain
                }).then(res=>{
                    this.items  = res.info;
                    this.curState = res.state;

            });
        },
        //其他文本类型项更新
        normalSetter({item,value}) {
            let params = {
                id: this.worksheetId,
                worksheetInfoId: item.worksheetInfoId,
                propertyValue : value
            };

            return this._$http.tenant.worksheetExtendUpdate(params);
        },
        //上传文件
        fileSetter({item, value}) {
            var blob = new Blob([value.content], {type: value.type});

            let params = {
                file: blob,
                __option: {
                    url: `/gw/tenant/worksheet/extend/Upload?worksheetInfoId=${item.worksheetInfoId}`
                }
            };

            return this._$http.tenant.extendUpload(params);
        },
        //获取文件信息
        getFileInfo(item){
            let fileId= item.value;
            const downloadLink =`/gw/tenant/worksheet/extend/Download?worksheetInfoId=${item.worksheetInfoId}&blobId=offer.info`;
            return new Promise((resolve,reject)=>{
                if(fileId == 'undefined') resolve(null);
                this._$http.tenant.offerExtendGetFileInfo({fileId: fileId})
                .then(res=>{
                    res={...res,downloadLink};
                    resolve(res)
                })
            })
        },
        //获取文件信息
       fileGetter: async function(item) {
            const fileInfo = await this.getFileInfo(item);
            return Promise.resolve(fileInfo);
        },
        //自动表单校验
        submit(){
            return this.$refs.dyform.validate();
        }
    }
}
</script>