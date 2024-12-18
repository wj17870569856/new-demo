<template>
    <div class="companyAuthInfo-page">
        <div class="title">公司认证信息</div>
        <div class="form">
            <div class="sub-title">基本信息</div>
            <el-form ref="companyForm" :model="companyForm" :rules="companyFormRules" label-width="150px"
                class="companyForm">
                <el-form-item label="公司名称" prop="company_name">
                    <el-input v-model="companyForm.company_name"></el-input>
                </el-form-item>
                <el-form-item label="公司所在地" prop="province">
                    <el-cascader v-model="companyForm.province" placeholder="请选择" size="large" style="width: 100%"
                        :options="cityOptions">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="详细地址">
                    <el-input v-model="companyForm.address"></el-input>
                </el-form-item>
                <el-form-item label="法人姓名" prop="legal_person_name">
                    <el-input v-model="companyForm.legal_person_name"></el-input>
                </el-form-item>
                <el-form-item label="法人身份证">
                    <el-input v-model="companyForm.legal_person_identity"></el-input>
                </el-form-item>
                <el-form-item label="法人电话" prop="legal_person_mobile">
                    <el-input v-model="companyForm.legal_person_mobile"></el-input>
                </el-form-item>
                <el-form-item label="办公电话">
                    <el-input v-model="companyForm.phone"></el-input>
                </el-form-item>
            </el-form>
            <div class="sub-title">统一社会信用代码</div>
            <el-form ref="socialForm" :model="socialForm" :rules="socialFormRules" label-width="150px"
                class="socialForm">
                <el-form-item label="统一社会信用代码" prop="social_credit_code">
                    <el-input v-model="socialForm.social_credit_code"></el-input>
                </el-form-item>

                <el-form-item label="营业执照副本">
                    <el-upload class="upload-demo" :auto-upload="false" action="" :on-change="uploadPayVoucher"
                        :on-preview="handlePreview" :on-remove="handleRemove" :limit="1" :file-list="fileList">
                        <el-button plain size="small" type="primary" icon="el-icon-upload2">点击上传</el-button>
                    </el-upload>
                    <div v-if="socialForm.business_license" class="business_license-text"
                        @click="viewBusinessLicense(socialForm.business_license_url)">
                        点击查看
                    </div>
                </el-form-item>

                <el-form-item label="公司成立日期">
                    <el-date-picker style="width:350px" v-model="socialForm.establishment_date" type="date"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="注册资本">
                    <el-input v-model="socialForm.registered_capital">
                        <template slot="append">万</template>
                    </el-input>
                </el-form-item>
            </el-form>
            <el-row style="justify-content: flex-end;width:100%" class="flex">
                <el-button style="width: 100px;height:36px;background: #257FF8;" type="primary" @click="saveCompanyInfo">保存</el-button>
            </el-row>
        </div>
    </div>
</template>
<script>
import Api from "../../plugins/api";
export default {
    name: "CompanyAuthInfo",
    middleware: "auth",
    layout: 'personalCenter',
    data() {
        return {
            cityOptions: [],
            //   公司及法人表单
            companyForm: {
                company_name: "",
                province: [],
                address: "",
                legal_person_name: "",
                legal_person_identity: "",
                legal_person_mobile: "",
                phone: "",
            },
            companyFormRules: {
                company_name: [{ required: true, message: "请输入", trigger: "blur" }],
                address: [{ required: true, message: "请输入", trigger: "blur" }],
                province: [{ required: true, message: "请输入", trigger: "blur" }],
                legal_person_name: [
                    { required: true, message: "请输入", trigger: "blur" },
                ],
                legal_person_identity: [
                    { required: true, message: "请输入", trigger: "blur" },
                ],
                legal_person_mobile: [
                    { required: true, message: "请输入", trigger: "blur" },
                ],
                phone: [{ required: true, message: "请输入", trigger: "blur" }],
            },
            //   统一社会信用代码
            socialForm: {
                social_credit_code: "",
                business_license: "",
                business_license_url: "",
                establishment_date: "",
                registered_capital: "",
            },
            socialFormRules: {
                social_credit_code: [
                    { required: true, message: "请输入", trigger: "blur" },
                ],
                business_license: [
                    { required: true, message: "请上传营业执照", trigger: "blur" },
                ],
                establishment_date: [
                    { required: true, message: "请输入", trigger: "blur" },
                ],
                registered_capital: [
                    { required: true, message: "请输入", trigger: "blur" },
                ],
            },

            fileList: [], // 营业执照副本
        };
    },
    mounted() {
        this.getAllRegion();
        this.getCompanyInfo();
    },
    methods: {
        uploadPayVoucher(file) {
            console.log(file);
            const fileSuffix = file.name.substring(file.name.lastIndexOf(".") + 1);
            const whiteList = [
                "pdf",
                "jpg",
                "jpeg",
                "png",
                "JPG",
                "JPEG",
                "PNG",
                "PDF",
            ];

            if (!whiteList.includes(fileSuffix)) {
                this.$message.error("上传凭证只能是图片或pdf格式");
                return false;
            }

            const formData = new FormData();
            formData.append("file", file.raw, file.name);
            formData.append("dir", "payVoucher");
            const uploadConfig = {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            };

            this.$request
                .post(Api.uploadImage, formData, uploadConfig)
                .then((res) => {
                    if (res.code === 0) {
                        const data = res.data;
                        data.url = res.data.img_path;
                        data.name = res.data.img;
                        this.fileList = [data];
                    } else {
                        this.$message({
                            message: res.msg,
                            type: "error",
                        });
                    }
                });
        },
        handleRemove(file, fileList) {
            this.fileList = fileList;
        },
        handlePreview() { },
        saveCompanyInfo() {
            this.$refs["companyForm"].validate((valid) => {
                if (valid) {
                    this.$refs["socialForm"].validate((valid) => {
                        if (valid) {
                            let d = {
                                ...this.socialForm,
                                ...this.companyForm,
                            };
                            console.log(d, "d");
                            d.province_code = d.province[0];
                            d.city_code = d.province[1];
                            d.district_code = d.province[2];
                            if (this.fileList.length) {
                                d.business_license = this.fileList[0].url;
                                d.business_license_url = this.fileList[0].url;
                            } else if (this.socialForm.business_license_url) {
                                d.business_license = this.socialForm.business_license_url;
                                d.business_license_url = this.socialForm.business_license_url;
                            } else {
                                return this.$message.error("请上传营业执照");
                            }

                            this.$request.post(Api.saveCompanyInfo, d).then((res) => {
                                if (res.code === 0) {
                                    this.getCompanyInfo();
                                    this.$message.success(res.msg);
                                } else {
                                    this.$message.error(res.msg);
                                }
                            })

                            return false;
                        }
                    });
                }
            });
        },
        getAllRegion() {
            this.$request.get(Api.selectAllRegion).then((res) => {
                if (res.code === 0) {
                    this.cityOptions = res.data;
                }
            });
        },
        // 获取公司信息，修改
        getCompanyInfo() {
            this.$request.post(Api.registerCompanyInfo, {}).then((res) => {
                if (res.code === 0 && res.data) {
                    const {
                        address,
                        business_license,
                        business_license_url,
                        city_code,
                        company_id,
                        company_name,
                        district_code,
                        establishment_date,
                        is_audit,
                        legal_person_identity,
                        legal_person_mobile,
                        legal_person_name,
                        phone,
                        province_code,
                        registered_capital,
                        social_credit_code,
                    } = res.data;
                    this.companyForm = {
                        company_name,
                        address,
                        legal_person_name,
                        legal_person_identity,
                        legal_person_mobile,
                        phone,
                        company_id,
                        is_audit,
                        province: [],
                    };

                    if (province_code) {
                        this.companyForm.province[0] = province_code;
                    }
                    if (city_code) {
                        this.companyForm.province[1] = city_code;
                    }
                    if (district_code) {
                        this.companyForm.province[2] = district_code;
                    }
                    this.socialForm = {
                        social_credit_code,
                        business_license,
                        business_license_url,
                        establishment_date,
                        registered_capital,
                    };
                }
            });
        },

        //
        viewBusinessLicense(url) {
            window.open(url);
        },
    },
};
</script>
<style lang="less" scoped>
.btn {
    width: 220px;
    padding: 0;
}

.companyAuthInfo-page {
    background-color: #fff;
    padding: 20px;
    box-sizing: border-box;

    .title {
        font-weight: bold;
        font-size: 18px;
        color: #0A1833;
        line-height: 21px;

    }

    .form {
        background-color: #ffffff;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        margin-top: 20px;

        .companyForm {
            width: 500px;
        }

        .socialForm {
            width: 550px;
            box-sizing: border-box;
            padding-right: 50px;

            :deep(.el-input-group__append) {
                color: #353535;
            }
        }

        .sub-title {
            font-weight: bold;
            font-size: 16px;
            color: #0A1833;
            line-height: 19px;
            margin-bottom: 10px;
        }

        .business_license-tips {
            font-size: 12px;
            font-family: Microsoft YaHei, Microsoft YaHei-Regular;
            font-weight: 400;
            text-align: left;
            color: #959595;
        }

        .business_license-text {
            font-size: 14px;
            font-family: Microsoft YaHei, Microsoft YaHei-Regular;
            font-weight: 400;
            text-align: left;
            color: #2263e8;
            cursor: pointer;
        }
    }

    :deep(.el-input.is-disabled .el-input__inner) {
        background: #efefef;
        border: 1px solid #d5d5d5;
        border-radius: 2px;
        color: #353535;
    }
}
</style>