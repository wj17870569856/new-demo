<template>
    <div class="productTemplate-page">
        <div class="title">
            <span>商品介绍模板</span>
            <div class="tips">设置模板后，发布产品时将会自动套用该模板</div>
        </div>
        <vue-editor id="editor" v-model="Template" use-custom-image-handler :editor-toolbar="customToolbar"
            @image-added="handleImageAdded"></vue-editor>
        <div style="text-align: right; margin-top: 20px">
            <el-button class="save-btn" @click="saveTemplate">保 存</el-button>
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex'
import Api from '../../plugins/api'
export default {
    name: 'ProductTemplate',
    layout: 'personalCenter',
    middleware: "auth",
    data() {
        return {
            Template: '',
            customToolbar: [
                [{ header: [false, 1, 2, 3, 4, 5, 6] }],
                [
                    'bold',
                    'italic',
                    'underline',
                    'strike',
                    { align: '' },
                    { align: 'center' },
                    { align: 'right' },
                    { align: 'justify' },
                ],
                [{ background: [] }, { color: [] }],
                ['image'],
            ],
        }
    },
    computed: {
        ...mapState(['userInfo']),
    },
    mounted() {
        this.getTemplate()
    },
    methods: {
        getTemplate() {
            this.$request.get(Api.getGoodsBriefTpl).then((res) => {
                this.Template = res.data.desc
            })
        },
        saveTemplate() {
            this.$request
                .post(Api.saveGoodsBriefTpl, { desc: this.Template })
                .then((res) => {
                    if (res.code === 0) {
                        this.$message.success(res.msg)
                    }
                })
        },
        handleImageAdded(file, Editor, cursorLocation, resetUploader) {
            console.log(file)
            const fileSuffix = file.name.substring(file.name.lastIndexOf('.') + 1)
            const whiteList = [
                'pdf',
                'jpg',
                'jpeg',
                'png',
                'JPG',
                'JPEG',
                'PNG',
                'PDF',
            ]

            if (!whiteList.includes(fileSuffix)) {
                this.$message.error('上传文件只能是图片或pdf格式')
                return false
            }

            const formData = new FormData()
            formData.append('file', file, file.name)
            formData.append('dir', 'productDescTemplate')

            const uploadConfig = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }

            this.$request
                .post(Api.uploadImage, formData, uploadConfig)
                .then((result) => {
                    const url = result.data.img_path // Get url from response
                    Editor.insertEmbed(cursorLocation, 'image', url)
                    resetUploader()
                })
                .catch((err) => {
                    console.log(err)
                })
        },
    },
}
</script>
<style lang="less" scoped>
.productTemplate-page {
    background-color: #fff;
    padding: 20px;
    box-sizing: border-box;
    .title {
        font-weight: bold;
font-size: 18px;
color: #0A1833;
line-height: 21px;
margin-bottom: 10px;

        .tips {
            width: 302px;
            text-align: center;
            background: #fff2d4;
            border: 1px solid #ffb507;
            font-size: 14px;
            font-family: Microsoft YaHei, Microsoft YaHei-Regular;
            font-weight: 400;
            color: #353535;
            margin-top: 10px;
        }
    }

    :deep(.ql-editor) {
        height: 500px;
    }

    .save-btn {
        padding: 0;
        width: 120px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        background: #2277e8;
        border-radius: 2px;
        color: #fff;
    }
}
</style>