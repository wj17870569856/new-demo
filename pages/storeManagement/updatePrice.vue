<template>
    <div class="updatePrice-page">
        <div class="title">
            更新商品价格

        </div>
        <div class="btn-group">
            <el-button class="btn" icon="el-icon-download" @click="exportProduct">导出产品</el-button>
            <el-popover v-model="popoverVisible" placement="bottom" width="300" trigger="manual">
                <div>
                    <el-upload ref="uploadExcel" class="upload-demo" action="" :limit="1" :file-list="excelList"
                        :auto-upload="false" :on-change="chooseExcel" :on-remove="removeExcel"
                        :on-exceed="handleExceedExcel">
                        <el-button slot="trigger" size="small">选择文件</el-button>
                    </el-upload>
                    <div style="border-bottom: 1px solid rgba(137,147,165,0.06); margin: 5px 0"></div>
                    <ul>
                        <li>1. 表头红色字段为必填</li>
                        <li>2. 导入后，若商品资料未完善，需要在店铺产品上传图片</li>
                    </ul>
                    <el-button type="text" @click="exportTemplate">下载模版</el-button>
                    <div style="text-align: center">
                        <div class="cancel-btn" @click="popoverVisible = false">
                            取 消
                        </div>
                        <div class="confirm-btn" @click="sureImport">确认导入</div>
                    </div>
                </div>
                <el-button slot="reference" class="btn" icon="el-icon-upload2" @click="popoverVisible = true">导入产品
                </el-button>
            </el-popover>

            <!-- <el-button class="btn" icon="el-icon-upload2" @click="sureImport">确认导入</el-button> -->
        </div>
        <div class="search-form">
            <el-form ref="searchForm" :model="searchForm" class="search-form-inline">
                <el-form-item label="" prop="category_name">
                    <el-input v-model="searchForm.category_name" placeholder="商品分类"></el-input>
                </el-form-item>
                <el-form-item label="" prop="goods_name">
                    <el-input v-model="searchForm.goods_name" placeholder="商品名称"></el-input>
                </el-form-item>
                <el-form-item label="" prop="serial_number">
                    <el-input v-model="searchForm.serial_number" placeholder="商品编号"></el-input>
                </el-form-item>
                <el-form-item label="发布时间" class="time" label-width="190px" prop="category_name">
                    <el-col :span="11">
                        <el-date-picker v-model="searchForm.start_time" type="date" placeholder="选择日期"
                            value-format="yyyy-MM-dd" style="width: 100%"></el-date-picker>
                    </el-col>
                    <el-col class="line" :span="2">-</el-col>
                    <el-col :span="11">
                        <el-date-picker v-model="searchForm.end_time" type="date" placeholder="选择日期"
                            value-format="yyyy-MM-dd" style="width: 100%"></el-date-picker>
                    </el-col>
                </el-form-item>
                <el-form-item >
                    <el-button type="text" @click="onSubmit">搜索</el-button>
                    <el-button type="text" @click="reset('searchForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table-wrapper">
            <div class="btn-group">
                <div class="btn" @click="goodsSKUbatchIsOnSale(1)">批量上架</div>
                <div class="btn" @click="goodsSKUbatchIsOnSale(0)">批量下架</div>
            </div>
            <el-table ref="multipleTable" :data="SkuTable" tooltip-effect="dark" style="width: 100%" stripe
                header-row-class-name="table-header-style" @selection-change="handleSelectionChange"
                @row-click="clickRow">
                <el-table-column type="selection" width="55" align="center">
                </el-table-column>
                <el-table-column label="商品图片" align="center" width="85">
                    <template slot-scope="scope">
                        <el-image :src="scope.row.image" style="width: 62px; height: 62px; border: 1px solid #d5d5d5"
                            fit="contain">
                            <div slot="error">
                                <img style="width: 62px; height: 62px" :src="defaultImg" alt="" />
                            </div>
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="category_name" label="商品分类" align="center" width="95">
                </el-table-column>
                <el-table-column prop="goods_name" label="商品名称" align="center">
                    <template slot-scope="scope">
                        <p class="product-name-p">
                            {{ scope.row.goods_name }}
                        </p>
                        <p class="product-attr-p text-ellipsis">
                            {{ scope.row.goods_sku_attr }}
                        </p>
                    </template>
                </el-table-column>
                <el-table-column prop="serial_number" label="商品编号" align="center" width="185">
                </el-table-column>
                <el-table-column prop="sku_shop_price" label="销售价/¥" align="center" width="85">
                    <template slot-scope="scope">
                        <span v-show="scope.row.sku_shop_price != 0">
                            {{ scope.row.sku_shop_price }}/{{ scope.row.unit_name }}
                        </span>
                        <span v-show="scope.row.sku_shop_price == 0"> 面议 </span>
                    </template>
                </el-table-column>
                <el-table-column prop="is_on_sale" label="是否上架" align="center" width="80">
                    <template slot-scope="scope">
                        {{ scope.row.is_on_sale === 1 ? '是' : '否' }}
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="发布时间" align="center" width="100">
                    <template slot-scope="scope">
                        <div v-splitTime="scope.row.create_time"></div>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination style="text-align: right; margin: 20px 0" small layout=" prev, pager, next, jumper"
                :total="total" :page-count="10" :pager-count="5" :current-page.sync="searchForm.page"
                @current-change="handleCurrentChange">
            </el-pagination>
        </div>
        <el-dialog class="dialog-style" title="修改商品" :visible.sync="updateSkuDialog" center width="540px"
            @close="closeUpdateDialog">
            <el-form ref="updateSKUForm" :model="updateSKUForm" :rules="updateSKUFormRules">
                <!-- 修改商品 -->
                <el-form-item v-for="(attr, i) in updateSKUForm.sku_attr" :key="i" :label="attr.attr_name"
                    label-width="80px" prop="attr_name">
                    <el-input v-model="attr.attr_value" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="销售价" label-width="80px" prop="sku_shop_price">
                    <el-input v-model="updateSKUForm.sku_shop_price" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="成本价" label-width="80px" prop="sku_cost_price">
                    <el-input v-model="updateSKUForm.sku_cost_price" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="库存" label-width="80px" prop="stock_status">
                    <el-select v-model="updateSKUForm.stock_status" placeholder="请选择" style="width: 100%">
                        <el-option v-for="item in stockStatusOptions" :key="item.id" :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="起订量" label-width="80px" prop="min_sale">
                    <el-input v-model="updateSKUForm.min_sale" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="单位" label-width="80px" prop="unit">
                    <el-select v-model="updateSKUForm.unit" placeholder="请选择" style="width: 100%">
                        <el-option v-for="item in unitOptions" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="上架" label-width="80px" prop="is_on_sale">
                    <el-checkbox-group v-model="updateSKUForm.is_on_sale">
                        <el-checkbox name="role" :true-label="1" false-label="0"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button class="cancel-btn" @click="updateSkuDialog = false">取消</el-button>
                <el-button type="primary" class="sure-btn" @click="submitUpdateSKU">确认修改</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { mapState } from 'vuex'
import Api from '../../plugins/api'
import defaultImg from '@/assets/images/default-img.png'

export default {
    name: 'UpdatePrice',
    middleware: "auth",
    layout: 'personalCenter',
    directives: {
        splitTime(el, binding) {
            if (binding && binding.value) {
                let str = ''
                const arr = binding.value.split(' ')
                str = `<p>${arr[0]}</p><p>${arr[1]}</p>`
                console.log(str)
                el.innerHTML = str
            }
        },
    },
    data() {
        return {
            defaultImg,
            searchForm: {
                category_name: '',
                goods_name: '',
                serial_number: '',
                start_time: '',
                end_time: '',
                page: 1,
                pagesize: 10,
            },
            SkuDetails: {},
            updateSkuDialog: false,
            popoverVisible: false,
            excelList: [], // 上传文件列表
            fileList: [],

            updateSKUForm: {
                id: '',
                sku_attr: [],
                sku_cost_price: '',
                sku_shop_price: '',
                stock_status: '',
                unit: '',
                min_sale: '',
                is_on_sale: '',
            },
            updateSKUFormRules: {},
            stockStatusOptions: [],
            unitOptions: [],
            total: 0,
            activeName: 'first',
            SkuTable: [],
            multipleSelection: [],
        }
    },
    computed: {
        ...mapState(['token', 'userInfo']),
    },
    mounted() {
        this.getSkuList()
        this.getSKUStateSelect()
    },
    methods: {
        getSkuList() {
            this.$request
                .get(Api.goodsGetSKULists, { params: this.searchForm })
                .then((res) => {
                    console.log(res)
                    if (res.code === 0) {
                        this.SkuTable = res.data.data
                        this.total = res.data.total
                    }
                })
        },
        // 获取下拉选
        getSKUStateSelect() {
            this.$request.get(Api.getSKUStateSelect).then((res) => {
                if (res.code === 0) {
                    this.unitOptions = res.data.unit
                    this.stockStatusOptions = res.data.stock_status
                }
            })
        },
        onSubmit() {
            this.getSkuList()
        },
        reset(formName) {
            this.$refs[formName].resetFields()
            this.searchForm.start_time = ''
            this.searchForm.end_time = ''
            this.searchForm.page = 1
            this.searchForm.pagesize = 10
            this.getSkuList()
        },
        // 点击行事件
        clickRow(row) {
            console.log(row)
            this.$request
                .get(Api.goodsSKUgetDetailsInfo, { params: { id: row.id } })
                .then((res) => {
                    console.log(res)
                    const {
                        id,
                        serial_number,
                        sku_attr,
                        sku_cost_price,
                        sku_shop_price,
                        stock_status,
                        unit,
                        min_sale,
                        is_on_sale,
                    } = res.data
                    this.updateSKUForm = {
                        id,
                        serial_number,
                        sku_attr,
                        sku_cost_price,
                        sku_shop_price,
                        stock_status,
                        unit,
                        min_sale,
                        is_on_sale,
                    }
                    this.updateSkuDialog = true
                })
        },
        submitUpdateSKU() {
            const params = this.updateSKUForm
            this.$request.post(Api.goodsSKUmodify, params).then((res) => {
                if (res.code === 0) {
                    this.$message.success(res.msg)
                    this.updateSkuDialog = false
                    this.getSkuList()
                } else {
                    this.$message.error(res.msg)
                }
            })
        },
        closeUpdateDialog() {
            this.$refs.updateSKUForm.resetFields()
            this.updateSkuDialog = false
        },
        // 表格多选事件
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        // 批量上下架
        goodsSKUbatchIsOnSale(is_on_sale) {
            const ids = this.multipleSelection.map((item) => item.id)
            if (ids.length > 0) {
                this.$request
                    .post(Api.goodsSKUbatchIsOnSale, { ids, is_on_sale })
                    .then((res) => {
                        if (res.code === 0) {
                            this.$message.success(res.msg)
                            this.getSkuList()
                        }
                    })
            } else {
                this.$message.error('请选择商品')
            }
        },
        chooseExcel(file, fileList) {
            this.excelList = fileList
        },
        removeExcel(file, fileList) {
            this.excelList = fileList
        },
        handleExceedExcel() {
            this.$message.error('只能导入一个文件')
        },
        // 确认导入按钮
        sureImport() {
            if (this.excelList.length === 0) {
                this.$message.error('请选择文件')
                return
            }
            const file = this.excelList[0].raw
            const formData = new FormData()
            formData.append('file', file, file.name)
            const uploadConfig = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }

            this.$request
                .post(Api.goodsGoodsSKUImport, formData, uploadConfig)
                .then((res) => {
                    if (res.code === 0) {
                        this.$message.success(res.msg)
                        this.popoverVisible = false
                        this.excelList = []
                        this.getSkuList()
                    } else {
                        this.$message.error(res.msg)
                        this.excelList = []
                    }
                })
        },
        // 分页事件
        handleCurrentChange() {
            this.getSkuList()
        },
        exportTemplate() {
            const link = document.createElement('a')
            link.style.display = 'none'
            link.href = `${this.$request.defaults.baseURL + Api.goodsGoodsSKUDownload
                }?token=${'Bearer ' + this.token}`
            link.target = 'download'
            link.setAttribute('download', '模板.xls')
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        },
        //
        exportProduct() {
            const ids = this.multipleSelection.map((item) => item.id)
            const link = document.createElement('a')
            link.style.display = 'none'
            let url = `${this.$request.defaults.baseURL + Api.goodsSKUexportSKU + '?'
                }`
            if (this.searchForm.category_name) {
                url += `${'category_name=' + this.searchForm.category_name + '&'}`
            }
            if (this.searchForm.goods_name) {
                url += `${'goods_name=' + this.searchForm.goods_name + '&'}`
            }
            if (this.searchForm.serial_number) {
                url += `${'serial_number=' + this.searchForm.serial_number + '&'}`
            }
            if (this.searchForm.start_time) {
                url += `${'start_time=' + this.searchForm.start_time + '&'}`
            }
            if (this.searchForm.end_time) {
                url += `${'end_time=' + this.searchForm.end_time + '&'}`
            }
            if (ids.length > 0) {
                url += `${'ids=' + ids + '&'}`
            }
            url += `${'token=Bearer ' + this.token}`
            console.log(url)
            link.href = url
            link.target = 'download'
            link.setAttribute('download', '产品.xls')
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        },
    },
}
</script>
<style lang="less" scoped>
.updatePrice-page {
    background-color: #fff;
    padding: 20px;
    box-sizing: border-box;
    .btn-group {
            display: flex;

            .btn {
                padding: 0 6px;
                height: 28px;
                line-height: 28px;
                text-align: center;
                background: #ffffff;
                border: 1px solid #d5d5d5;
                border: 1px solid #2277e8;
                border-radius: 2px;
                margin-right: 10px;
                font-size: 14px;
                font-family: Microsoft YaHei, Microsoft YaHei-Regular;
                font-weight: 400;
                color: #2277e8;

                &:hover {
                    color: #fff;
                    background: #2277e8;
                }
            }
        }
    .title {
        font-weight: bold;
        font-size: 18px;
        color: #0A1833;
        line-height: 21px;
        margin-bottom: 10px;


    }

    .search-form {
        height: 56px;
        display: flex;
        align-items: center;
        background: rgba(137, 147, 165, 0.06);
        border-radius: 2px;
        padding: 5px;
        box-sizing: border-box;

        .search-form-inline {
            display: flex;

            :deep(.el-form-item) {
                margin: 0 5px;
                width: 120px;

                &.time {
                    width: 370px;
                    display: flex;

                    .line {
                        text-align: center;
                    }

                    .el-form-item__label {
                        width: 120px !important;
                    }

                    .el-form-item__content {
                        margin: 0 !important;
                    }
                }

                &.search-form-btn {
                    width: 150px;
                    display: flex;
                    justify-content: space-around;
                    align-items: center;

                    .el-form-item__content {
                        display: flex;
                        justify-content: space-around;
                        align-items: center;

                        .el-button {
                            padding: 0;
                            width: 52px;
                            height: 26px;
                            line-height: 26px;
                            text-align: center;
                            background: #2277e8;
                            border-radius: 2px;
                            color: #fff;
                        }

                        .reset-btn {
                            background: #959595;
                        }
                    }
                }

                .el-input__inner {
                    border: 1px solid #d5d5d5;
                    border-radius: 2px;
                    height: 32px;
                    line-height: 32px;
                }
            }
        }
    }

    .table-wrapper {
        .btn-group {
            display: flex;
            margin-top: 10px;

            .btn {
                padding: 0;
                width: 80px;
                height: 28px;
                line-height: 28px;
                text-align: center;
                background: #ffffff;
                border: 1px solid #d5d5d5;
                border-radius: 2px;
                margin-bottom: 10px;
                margin-right: 10px;
                font-size: 12px;
                font-weight: 400;
                color: #353535;
                cursor: pointer;
            }
        }



        :deep(.table-header-style) {
            background: rgba(137, 147, 165, 0.06);

            th {
                background: transparent;
            }
        }
    }

    .product-name-p {
        font-size: 14px;
        color: #353535;
        text-align: left;
        font-family: Microsoft YaHei, Microsoft YaHei-Regular;
        font-weight: 400;
    }

    .product-attr-p {
        font-size: 12px;
        color: #353535;
        text-align: left;
        font-family: Microsoft YaHei, Microsoft YaHei-Regular;
        font-weight: 400;
    }
}

.dialog-style {
    :deep(.el-dialog__header) {
        background: #2277e8;
        padding: 10px;
    }

    :deep(.el-dialog__title) {
        color: #fff;
        font-size: 16px;
    }

    :deep(.el-dialog__headerbtn) {
        top: 15px;
    }

    .dialog-footer {
        .cancel-btn {
            padding: 0;
            width: 88px;
            height: 32px;
            line-height: 32px;
            text-align: center;
            background: #ffffff;
            border: 1px solid #d5d5d5;
            border-radius: 2px;
            color: #353535;
        }

        .sure-btn {
            padding: 0;
            width: 88px;
            height: 32px;
            line-height: 32px;
            text-align: center;
            background: #2277e8;
            border: 1px solid #2277e8;
            border-radius: 2px;
            color: #fff;
        }
    }
}
</style>