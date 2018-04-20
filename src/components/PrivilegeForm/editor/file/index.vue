<template>
    <el-form-item v-if="display" :label="label" :prop="prop" :rules="rules" :ref="formItemRef">

        <el-upload class="upload-demo" 
            v-if="!disabled" :ref="prop" 
            drag 
            :on-change="handleChange" 
            :auto-upload="false" 
            :show-file-list="false" 
            :disabled="disabled" 
            >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>

        <span v-if="fileInfo.fileName"><i class="el-icon-document"></i>{{fileInfo.fileName}}
        <span class="fileinfo">{{fileInfo.fileSize | fileSizeFilter}}</span> 
        <a :href="fileInfo.inUrl" class="fileinfo"><el-button type="text">下载</el-button></a>
        </span>
        <slot></slot>
    </el-form-item>
</template>

<script type="text/javascript">
    import mixin from '../editor.mixin';
    export default {
        mixin: [mixin],
        name: 'alogic-file',
        data() {
            return {
                fileInfo: ''
            }
        },
        methods: {
            handleChange(file, fileList) {
                file = file.raw;
                let reader = new FileReader();
                reader.onload = (event) => {
                    this.model = event.target.result;

                    // 手动触发change事件通知上级form
                    this.emitChange(this.model);

                    // 手动触发blur事件保存结果
                    this.handleBlur();
                };
                reader.readAsDataURL(file);
            },
            beforeAvatarUpload(file) {
                //jpg png bmp
                const isType = (file.type === 'image/jpeg') || (file.type === 'image/png') || (file.type === 'image/bmp');
                const isLt3M = file.size / 1024 / 1024 <= 3;
                if(!isType) {
                    this.$message.error('上传头像图片只能是 JPG/PNG/BMP格式!');
                    return;
                }
                if(!isLt3M) {
                    this.$message.error('上传头像图片大小不能超过 3MB!');
                    return;
                }
                return isType && isLt3M;
            },
            getValue() {
                this.config.getter(this.item).then(data => {
                    this.fileInfo = data;
                    this.emitChange(data.inUrl);
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
.fileinfo {
    margin-left: 15px;
}

</style>