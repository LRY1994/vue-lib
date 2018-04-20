<template>
    <el-form-item v-if="display" :label="label" :prop="prop" :rules="rules" :ref="formItemRef">
        <div class="htmleditor">
            <el-tabs value="first" type="border-card">
                <el-tab-pane label="编写" name="first">
                    <quill-editor :id="prop" class="my-html-editor" :options="quillOptions" @change="handleChange" @focus="handleFocus" v-model="model" @blur="handleEditorBlur" :disabled="disabled">
                    </quill-editor>
                </el-tab-pane>
                <el-tab-pane label="预览" name="second">
                    <div class="htmleditor-content">
                        <div v-html="model"></div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
        <slot></slot>
    </el-form-item>
</template>

<script type="text/javascript">
    // import quilleditor things
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import { quillEditor } from 'vue-quill-editor';

    import mixin from '../editor.mixin';
    export default {
        mixins: [mixin],
        name: 'alogic-htmleditor',
        components: {'quill-editor': quillEditor},
        data() {
            return {
                isFocused: false,
                quillOptions: {
                    modules: {
                        toolbar:  [['bold', 'italic', 'underline', 'strike'],[{ 'header': 2 }], [{ 'list': 'ordered'}, { 'list': 'bullet' }], ['image', 'video'], ['clean']]
                    }
                }
            }
        },
        methods: {
            handleChange(content) {
                if (content && content.html) {
                    this.emitChange(content.html);
                }
            },
            handleFocus() {
            	if(!this.disabled) {
                	this.isFocused = true;
            	}
            },
            handleEditorBlur() {
                if (this.isFocused) {
                    this.handleBlur();
                };
                this.isFocused = false;
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../../../../assets/css/variable.scss';

    .htmleditor-content {
        padding: 20px;
        @include htmleditor-content;
    }

    .overflow-visible {
        overflow:visible;
    }

    .my-html-editor {
        @extend .overflow-visible;
        padding-bottom: 30px;
    }
</style>

<style type="text/css" scoped>
    .htmleditor >>> .ql-toolbar {
        border: none;
        border-bottom: 1px solid #ccc;
    }
    
    .htmleditor >>> .ql-container {
        border: none;
    }
    
    .htmleditor >>> .el-tabs__content {
        padding: 0;
        overflow: visible;
    }
</style>