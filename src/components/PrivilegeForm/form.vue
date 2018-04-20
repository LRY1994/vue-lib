<!--
<awesome-form  :items="items" :config="config"></awesome-form>
props:
    items {Array,必选}
    config{Array,必选}
        例如
        config: [{
                editor: ['*'],
                detail: {
                    genDisabled: dynamicGenDisabled('tenant_' + this.currentDisabledScope),
                    genDisplay: dynamicGenDisplay('tenant_' + this.currentVisibleScope)
                }
            }, {
                editor: ['input', 'textarea', 'daterange', 'timerange', 'check', 'radio', 'select'],
                detail: {
                    setter: this.plainSetterPromisory,
                }
            }, {
                editor: ['image'],
                detail: {
                    getter: this.imageGetterPromisory,
                    setter: this.imageSetterPromisory
                }
            }]

    basic{Object,可选}
-->

<template>
    <div>{{form}}
        <el-form class="my-form" :model="form" v-if="form && sortedItems && configForEditor" 
        ref="form" label-width="150px" label-position="left">
            <slot v-if="item.editor == basic.keys.slotEditor"
                  v-for="item in sortedItems"
                  :name="item[basic.keys.slotNameKey]" 
                  :item="item" :form="form">
            </slot>
            <component v-else 
                :is="basic.editorDict[item.editor] || item.editor" 
                :item="item" 
                v-model="form[item[basic.keys.propKey]]" 
                :config="configForEditor[basic.editorDict[item.editor] || item.editor]"
                :label="item[basic.keys.labelKey]"
                :prop="item[basic.keys.propKey]"
            >
                <span v-if="item[basic.keys.tooltipsKey]" class="tooltips" v-html="item[basic.keys.tooltipsKey]"></span>
            </component>
        </el-form>
    </div>
</template>

<script type="text/javascript">
    let editors = {}, editorConfigs = {};

    //把editotr/下的所有vue组件存入editors，editors[component.name]=component;
    function importAll (r) {
        r.keys().forEach(key => {
            let editComp = r(key).default;
            editors[editComp.name] = editComp;
        });
    }

    importAll(require.context('./editor', true, /index.vue$/));

    //组件名不重复
    function registerEditor(editor) {
        if (editor && editor.name && editor.component) {
            if (editors[editor.name]) {
                console.info('编辑器名称已经被占用');
            } else {
                editors[editor.name] = editor.component;
            }
        }
    }


    export {
        registerEditor
    }

    import baseConfig from './base';
    export default {
        name: 'awesome-form',
        props: {
            items: {
                required: true,
                type: Array
            },
            config: {
                type: Array,
                default: []
            },
            basic: {//项目自定义
                type: Object,
                default: () => {
                    return baseConfig;
                }
            }
        },
        data() {
            return {
                sortedItems: [],
                form: {},
                configForEditor: null
            }
        },
        components: editors,
        methods: {
            //表单验证
            validate() {
                let result = false;
                this.$refs.form.validate(valid => {
                    result = valid;
                });
                return result;
            },
            //表单验证
            validateAsync() {
                let p = new Promise((resolve, reject) => {
                    try {
                        this.$refs.form.validate(valid => {
                            resolve(valid)
                        });
                    } catch (err) {
                        reject(err);
                    }
                })
                
                return p;
            },
            //初始化表单数据 this.form[property] = value
            getFormModel() {
                this.items.forEach(item => {
                    this.form[item[this.basic.keys.propKey]] = '';
                 
                    
                })
            },
            //初始化为空 
            initEditorConfig() {
                let result = {};

                Object.keys(editors).forEach(key => {
                    result[key] = {};
                });

                return result;
            },

            /*result= {
                alogic-check:{
                    genDisabled:(...)
                    genDisplay:(...)                
                    genOptions:(...)               
                    genRules: (...)               
                    genTooltips:(...)                
                    getter: (...)               
                    setter:(...)
                },
                alogic-daterange: {…}, 
                alogic-file: {…}, 
                alogic-htmleditor: {…}, 
                alogic-image: {…}
             }               
            */
            calcConfigForEditor() {
                // 针对所有的editor都有配置
                let result = this.initEditorConfig();

                //基于base进行修改
                let allConfig = [...this.basic.editorConfig, ...this.config];
                allConfig.forEach(item => {
                    for(let e in result) {
                        if (item.editor.indexOf('*') >= 0 || item.editor.indexOf(e.split('-')[1]) >= 0) {
                            result[e] = Object.assign({}, result[e], item.detail);
                        }
                    }
                });
console.table(result)
                return result;
            },
            sortItem() {
                let result = [...this.items];
                result.sort((a, b) => {
                    return parseInt(a[this.basic.keys.orderKey]) - 
                        parseInt(b[this.basic.keys.orderKey]);
                });
                return result;
            }
        },
        mounted() {
            this.configForEditor = this.calcConfigForEditor();
            if (this.items) {
                this.sortedItems = this.sortItem();
                this.getFormModel();
            }
        },
        watch: {
            items: {
                handler(val) {
                    if (val) {
                        this.sortedItems = this.sortItem();
                    }
                },
                deep: true
            },
            config: {
                handler(val) {
                    if(val && val.length > 0) {
                        this.configForEditor = this.calcConfigForEditor();
                    }
                },
                deep: true
            }
        }
    }
</script>

<style lang="scss" scoped>
    .tooltips {
        color: #ddd;
        font-size: 12px;
        line-height: 1;
        padding-top: 4px;
        position: absolute;
        top: 100%;
        left: 0;
    }
</style>

<style type="text/css" scoped>
    .my-form >>> .el-form-item__error {
        background: #fff;
        width: 100%;
    }
</style>