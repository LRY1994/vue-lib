<template>
    <el-form-item v-if="display" :label="label" :prop="prop" :rules="rules" :ref="formItemRef">

        <el-button v-if="model || inUrl" type="text" @click="checkoutOrigin">查看原图</el-button>
        <div v-if="disabled" class="plain" v-bind:style="{width: (targetWidth || 178) + 'px', height: (targetHeight || 178 ) + 'px'}">
            <img v-if="model || inUrl" :src="model || inUrl" class="avatar" v-bind:style="{width: (targetWidth || 178) + 'px', height: (targetHeight || 178 ) + 'px'}">
        </div>
        <el-upload v-else class="avatar-uploader" action="" :ref="prop" :show-file-list="false" :auto-upload="false" :on-change="handleChange">
            <img v-if="model || inUrl" :src="model || inUrl" class="avatar" v-bind:style="{width: (targetWidth || 178) + 'px', height: (targetHeight || 178 ) + 'px'}">
            <i v-else class="el-icon-plus avatar-uploader-icon" v-bind:style="{width: (targetWidth || 178) + 'px', height: (targetHeight || 178 ) + 'px', 'line-height': (targetHeight || 170) + 'px'}"></i>
        </el-upload>

        <div v-show="!disabled">
            <slot></slot>
        </div>


    </el-form-item>
</template>

<script type="text/javascript">
    import mixin from '../editor.mixin';
    import options_mixin from '../options.mixin';
    export default {
        mixins: [mixin, options_mixin],
        name: 'alogic-image',
        data() {
            return {
                inUrl: '',
                base64Code: '',
                targetWidth: null,
                targetHeight: null,
                limitHeight: document.body.clientHeight * 0.8
            }
        },
        methods: {
            handleChange(file, fileList) {
                if (this.beforeAvatarUpload(file)) {
                    file = file.raw;
                    let reader = new FileReader();
                    reader.onload = (event) => {
                        this.base64Code = event.target.result;

                        // 手动触发blur事件保存结果
                        this.handleBlur({content: file, type: file.type, name: file.name});
                    };
                    reader.readAsDataURL(file);
                }
            },
            checkResolution(file) {
                let image = new Image();
                image.src = file.url;
                image.onload = () => {
                    let naturalWidth = image.width, naturalHeight = image.height;

                    if (this.targetWidth && this.targetHeight) {
                        if (naturalWidth != this.targetWidth || naturalHeight != this.targetHeight) {
                            this.$message({
                                type: 'warning',
                                message: `您上传的图片不满足分辨率: ${this.targetWidth}*${this.targetHeight}。可能在市场中显示变形等问题。`,
                                customClass: 'image-warning-class'
                            });
                        }
                    }
                };
            },
            beforeAvatarUpload(file) {
                let fileRaw = file.raw;
                //jpg png bmp
                const isType = (fileRaw.type === 'image/jpeg') || (fileRaw.type === 'image/png') || (fileRaw.type === 'image/bmp');
                const isLt3M = fileRaw.size / 1024 / 1024 <= 3;
                if(!isType) {
                    this.$message.error('上传的图片只能是 JPG/PNG/BMP格式!');
                    return;
                }
                if(!isLt3M) {
                    this.$message.error('上传的图片大小不能超过 3MB!');
                    return;
                }
                this.checkResolution(file);
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
                    // 手动触发change事件通知上级form
                    this.model = this.base64Code;
                    this.emitChange(this.model);
                    this.config.setterCallback && this.config.setterCallback(this.item);
                }).catch(err => {
                    this.model = '';
                    this.emitChange(this.model);
                    this.$message.error('上传失败');
                })

                if (this.$refs[this.formItemRef]) {
                    this.$refs[this.formItemRef].clearValidate();
                }

                this.$emit('blur', params);
            },
            getOptions() {
                this.config.genOptions(this.item).then(data => {
                    if (data && data.length > 0) {
                        data.forEach(item => {
                            if (item.label == 'width') {
                                this.targetWidth = parseInt(item.value);
                            } else {
                                if (item.label == 'height') {
                                    this.targetHeight = parseInt(item.value);
                                }
                            }
                        });
                    }
                })
            },
            checkoutOrigin() {
                const h = this.$createElement;
                this.$msgbox({
                    customClass: 'image-editor-dialog-class',
                    title: '查看原图',
                    message: h('el-scrollbar', {
                            props: {
                                'wrap-style': 'overflow-x:hidden;'
                            },
                            style: {
                                'height': this.limitHeight + 'px'
                            }
                        }, [
                            h('div', {
                                style: {
                                    'min-height': (this.limitHeight - 100) + 'px',
                                    'display': 'flex',
                                    'align-items': 'center'
                                }
                            }, [
                                h('img', {
                                    domProps: {
                                        src: this.model || this.inUrl
                                    },
                                    style: {
                                        'margin': '0 auto',
                                        'max-width': '100%',
                                        'border': '1px solid #ccc'
                                    }
                                })
                            ])
                        ]),
                    showConfirmButton: false
                }).then(action => {
                    this.$message({
                        type: 'info',
                        message: 'action: ' + action
                    });
                }).catch(action => {

                });
            }
        }
    }
</script>

<style lang="scss" scoped>
	.avatar-uploader {
		line-height: initial;
	}
	
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        text-align: center;
    }
    
    .avatar {
        display: block;
    }

    .plain {
        border: 1px solid #eee;
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

<style lang="scss">
    .image-editor-dialog-class {
        width: 70%;
    }

    .image-editor-dialog-class .el-scrollbar__wrap {
        height: 100%;
    }
    .image-editor-dialog-class .el-message-box__message {
        text-align: center;
    }
    
    .image-warning-class.el-message--warning {
        top: 80px;
    }
</style>