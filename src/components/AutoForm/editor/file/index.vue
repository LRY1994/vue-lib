<template>
    <el-form-item v-if="display" :label="label" :prop="prop" :rules="rules" :ref="formItemRef">
        <div v-if="disabled" class="plain">
            <span v-if="fileInfo && fileInfo.fileName">
                <span v-if="fileInfo.fileName"><i class="el-icon-document"></i>{{fileInfo.fileName}}
                <span class="fileinfo">{{fileInfo.fileSize | fileSizeFilter}}</span> <span class="fileinfo">{{fileInfo.createDate|dateformat}}</span>
                <a :href="fileInfo.downloadLink" class="fileinfo" :download="fileInfo.fileName"><el-button type="text">下载</el-button></a>
                </span>
            </span>
        </div>
        <div v-else>
            <el-upload class="upload-demo" 
                :ref="prop" 
                drag 
                :action="config.setter(item)"
                :on-success="handleFileSuccess"
                >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>

            <span v-if="fileInfo">
                <span v-if="fileInfo.fileName"><i class="el-icon-document"></i>{{fileInfo.fileName}}
                <span class="fileinfo">{{fileInfo.fileSize | fileSizeFilter}}</span> <span class="fileinfo">{{fileInfo.createDate|dateformat}}</span>
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
            }
        },
        methods: {
    		handleFileSuccess(res, file) {
				if(res.code == 'core.ok') {
		            //清除上传的队列
					this.$refs[this.prop].clearFiles();
                	//上传成功后显示文件信息
					this.fileInfo = {
			            fileName: file.name,
		                fileSize: file.size,
		                downloadLink: file.url,
		                createDate: new Date().getTime()
					}
					this.emitChange(res.data.fileId);
                    this.config.setterCallback && this.config.setterCallback(this.item);
                    if (this.$refs[this.formItemRef]) {
                    	this.$refs[this.formItemRef].clearValidate();
                	}
				} else {
					this.$message.error(res.reason)
				}
			},
            getValue() {
            	//item.value即fileId存在，再获取fileId的信息
            	if(this.item.value) {
	                this.config.getter(this.item).then(data => {
                    	this.fileInfo = data;
                    	this.emitChange(this.fileInfo);
                	})
            	}
            }
        }
    }
</script>

<style lang="scss" scoped>
.fileinfo {
    margin-left: 15px;
}

</style>