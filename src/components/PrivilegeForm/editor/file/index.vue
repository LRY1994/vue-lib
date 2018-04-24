<template>
    <el-form-item v-if="display" :label="label" :prop="prop" :rules="rules" :ref="formItemRef">
        <div v-if="disabled" class="plain">
            <span v-if="fileInfo && fileInfo.fileName">
                <span v-if="fileInfo.fileName"><i class="el-icon-document"></i>{{fileInfo.fileName}}
                <span class="fileinfo">{{fileInfo.fileSize | fileSizeFilter}}</span> 
                <a :href="fileInfo.downloadLink" class="fileinfo" :download="fileInfo.fileName"><el-button type="text">下载</el-button></a>
                </span>
            </span>
        </div>
        <div v-else>
            <el-upload class="upload-demo" 
                :ref="prop" 
                drag 
                action=""
                :on-change="handleChange" 
                :auto-upload="false" 
                :show-file-list="false" 
                >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>

            <span v-if="fileInfo">
                <span v-if="fileInfo.fileName"><i class="el-icon-document"></i>{{fileInfo.fileName}}
                <span class="fileinfo">{{fileInfo.fileSize | fileSizeFilter}}</span> 
                <a :href="fileInfo.downloadLink" class="fileinfo" :download="fileInfo.fileName"><el-button type="text">下载</el-button></a>
                </span>
            </span>
        </div>
        
        <div v-show="!disabled">
            <slot></slot>
        </div>
    </el-form-item>
</template>

<script type="text/javascript">
    import mixin from '../editor.mixin';
    export default {
        mixins: [mixin],
        name: 'alogic-file',
        data() {
            return {
                fileInfo: '',
                fileObj: null
            }
        },
        methods: {
            handleChange(file, fileList) {
                this.fileInfo = {
                    fileName: file.name,
                    fileSize: file.size,
                    downloadLink: file.url
                };
                file = file.raw;
                this.fileObj = file;
                this.handleBlur({
                    content: file, 
                    type: file.type, 
                    name: file.name,
                });
            },
            getValue() {
                this.config.getter(this.item).then(data => {
                    this.fileInfo = data;
                    this.emitChange(this.fileInfo);
                })
            },
            handleBlur(value) {
                let params = {
                    item: this.item,
                    value
                };
                this.config.setter(params).then(data => {
                    this.model = this.fileObj;
                    this.emitChange(this.model);
                    this.config.setterCallback && this.config.setterCallback(this.item);
                });

                if (this.$refs[this.formItemRef]) {
                    this.$refs[this.formItemRef].clearValidate();
                }

                this.$emit('blur', params);
            }
        },
        filters: {
            fileSizeFilter(input) {
                let result = '-';
                let kb = 1000, mb = 1000*1000, gb = 1000*1000*1000;
                if(input < kb) {
                    result = input+'B';
                }else if(input >= kb && input < mb) {
                    result = Math.round(input/kb) + 'KB';
                }else if(input >= mb && input < gb) {
                    result = (input/mb).toFixed(2) + 'MB';
                }else{
                    result = (input/gb).toFixed(2) + 'GB';
                }
                return result;
            }
        }
    }
</script>

<style lang="scss" scoped>
.fileinfo {
    margin-left: 15px;
}

</style>