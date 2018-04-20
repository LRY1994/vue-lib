<template>
    <el-form-item v-if="display" :label="label" :prop="prop" :rules="rules" :ref="formItemRef">
        <el-upload class="avatar-uploader" action="" :ref="prop" :show-file-list="false" :auto-upload="false" :with-credentials="true" :on-change="handleChange" :before-upload="beforeAvatarUpload" :disabled="disabled">
            <img v-if="model || inUrl" :src="model || inUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <slot></slot>
    </el-form-item>
</template>

<script type="text/javascript">
    import mixin from '../editor.mixin';
    export default {
        mixins: [mixin],
        name: 'alogic-image',
        data() {
            return {
                inUrl: ''
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
                    this.handleBlur({content: file, type: file.type, name: file.name});
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
                    if (data) {
                        this.inUrl = data;

                        // 手动触发change事件，通知上级form
                        this.emitChange(data);
                    }
                })
            },
            handleBlur(value) {
                let params = {
                    item: this.item,
                    value
                };
                this.config.setter(params).then(data => {
                    this.config.setterCallback && this.config.setterCallback(this.item);
                });

                if (this.$refs[this.formItemRef]) {
                    this.$refs[this.formItemRef].clearValidate();
                }

                this.$emit('blur', params);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>

<style type="text/css" scoped>
    .avatar-uploader >>> .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    
    .avatar-uploader >>> .el-upload:hover {
        border-color: #409EFF;
    }
</style>