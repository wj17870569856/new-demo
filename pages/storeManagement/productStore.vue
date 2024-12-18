<template>
    <div class="productStore-page">
        <div class="title">公司产品库</div>
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
                <el-form-item label="发布时间" class="time" label-width="190px">
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
        <div>
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="已上架" name="first">
                    <div class="btn-group">
                        <div class="btn" @click="goodsBatchDelete(firstTableChecked)">
                            批量删除
                        </div>
                        <div class="btn" @click="goodsBatchIsOnSale(firstTableChecked, 0)">
                            批量下架
                        </div>
                    </div>
                    <el-table :data="firsttable" tooltip-effect="dark" style="width: 100%" stripe
                        header-row-class-name="table-header-style" @selection-change="selecChangeFirsttable"
                        @row-click="clickRow">
                        <el-table-column type="selection" width="55" align="center">
                        </el-table-column>
                        <el-table-column label="商品图片" align="center" width="90">
                            <template slot-scope="scope">
                                <el-image :src="scope.row.image"
                                    style="width: 62px; height: 62px; border: 1px solid #d5d5d5" fit="contain">
                                    <div slot="error">
                                        <img style="width: 62px; height: 62px" :src="defaultImg" alt="" />
                                    </div>
                                </el-image>
                            </template>
                        </el-table-column>
                        <el-table-column prop="category_name" label="商品分类" align="center" width="95">
                        </el-table-column>
                        <el-table-column prop="name" label="商品名称" align="center">
                            <template slot-scope="scope">
                                <p class="product-name-p">
                                    {{ scope.row.name }}
                                </p>
                                <p class="product-attr-p">
                                    {{ `${scope.row.sku_number}个商品明细 >` }}
                                </p>
                            </template>
                        </el-table-column>
                        <el-table-column prop="serial_number" label="商品编号" width="185" align="center">
                        </el-table-column>
                        <el-table-column prop="check_status" label="审核状态" align="center" width="100">
                        </el-table-column>
                        <el-table-column prop="release_time" label="发布时间" align="center" width="100">
                            <template slot-scope="scope">
                                <div v-splitTime="scope.row.release_time"></div>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination style="text-align: right; margin: 20px 0" small layout="prev, pager, next, jumper"
                        :total="total1" :page-count="10" :pager-count="5" :current-page="page1"
                        @current-change="handleCurrentChange1">
                    </el-pagination>
                </el-tab-pane>
                <el-tab-pane label="未上架" name="second">
                    <div class="btn-group">
                        <div class="btn" @click="goodsBatchDelete(secondTableChecked)">
                            批量删除
                        </div>
                        <div class="btn" @click="goodsBatchIsOnSale(secondTableChecked, 1)">
                            批量上架
                        </div>
                    </div>
                    <el-table :data="secondtable" tooltip-effect="dark" style="width: 100%" stripe
                        header-row-class-name="table-header-style" @selection-change="selecChangeSecondtable"
                        @row-click="clickRow">
                        <el-table-column type="selection" width="55" align="center">
                        </el-table-column>
                        <el-table-column label="商品图片" align="center" width="90">
                            <template slot-scope="scope">
                                <el-image :src="scope.row.image"
                                    style="width: 62px; height: 62px; border: 1px solid #d5d5d5" fit="contain">
                                    <div slot="error">
                                        <img style="width: 62px; height: 62px" :src="defaultImg" alt="" />
                                    </div>
                                </el-image>
                            </template>
                        </el-table-column>
                        <el-table-column prop="category_name" label="商品分类" align="center" width="95">
                        </el-table-column>
                        <el-table-column prop="name" label="商品名称" align="center">
                            <template slot-scope="scope">
                                <p class="product-name-p">
                                    {{ scope.row.name }}
                                </p>
                                <p class="product-attr-p">
                                    {{ `${scope.row.sku_number}个商品明细 >` }}
                                </p>
                            </template>
                        </el-table-column>
                        <el-table-column prop="serial_number" label="商品编号" align="center" width="185">
                            <template slot-scope="scope">
                                <p>{{ scope.row.serial_number }}</p>
                                <p v-show="scope.row.edit_state === '待完善'" style="color: #e84b01">
                                    {{ scope.row.edit_state }}
                                </p>
                                <p v-show="scope.row.is_on_sale === '否'">
                                    {{ scope.row.is_on_sale === '否' ? '已下架' : '' }}
                                </p>
                            </template>
                        </el-table-column>
                        <el-table-column prop="check_status" label="审核状态" align="center" width="100">
                        </el-table-column>
                        <el-table-column prop="release_time" label="发布时间" align="center" width="100">
                            <template slot-scope="scope">
                                <div v-splitTime="scope.row.release_time"></div>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination style="text-align: right; margin: 20px 0" small layout="prev, pager, next, jumper"
                        :total="total2" :page-count="10" :pager-count="5" :current-page="page2"
                        @current-change="handleCurrentChange2">
                    </el-pagination>
                </el-tab-pane>
                <el-tab-pane label="审核不通过" name="third">
                    <div class="btn-group">
                        <div class="btn" @click="goodsBatchDelete(thirdTableChecked)">
                            批量删除
                        </div>
                    </div>
                    <el-table :data="thirdtable" tooltip-effect="dark" style="width: 100%" stripe
                        header-row-class-name="table-header-style" @selection-change="selecChangeThirdtable"
                        @row-click="clickRow">
                        <el-table-column type="selection" width="55" align="center">
                        </el-table-column>
                        <el-table-column label="商品图片" align="center" width="90">
                            <template slot-scope="scope">
                                <el-image :src="scope.row.image"
                                    style="width: 62px; height: 62px; border: 1px solid #d5d5d5" fit="contain">
                                    <div slot="error">
                                        <img style="width: 62px; height: 62px" :src="defaultImg" alt="" />
                                    </div>
                                </el-image>
                            </template>
                        </el-table-column>
                        <el-table-column prop="category_name" label="商品分类" align="center" width="95">
                        </el-table-column>
                        <el-table-column prop="name" label="商品名称" align="center">
                            <template slot-scope="scope">
                                <p class="product-name-p">
                                    {{ scope.row.name }}
                                </p>
                                <p class="product-attr-p">
                                    {{ `${scope.row.sku_number}个商品明细 >` }}
                                </p>
                            </template>
                        </el-table-column>
                        <el-table-column prop="serial_number" label="商品编号" align="center" width="185">
                        </el-table-column>
                        <el-table-column prop="check_status" label="审核状态" align="center" width="100">
                            <template slot-scope="scope">
                                <span style="color: #e84b01">{{
                                    scope.row.refuse_reason
                                    }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="release_time" label="发布时间" align="center" width="100">
                            <template slot-scope="scope">
                                <div v-splitTime="scope.row.release_time"></div>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination style="text-align: right; margin: 20px 0" small layout="prev, pager, next, jumper"
                        :total="total3" :page-count="10" :pager-count="5" :current-page="page3"
                        @current-change="handleCurrentChange3">
                    </el-pagination>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex'
import Api from '../../plugins/api'
import defaultImg from '@/assets/images/default-img.png'

export default {
    name: 'ProductStore',
    middleware: "auth",
    layout: 'personalCenter',
    directives: {
        splitTime(el, binding) {
            if (binding && binding.value) {
                let str = ''
                const arr = binding.value.split(' ')
                str = `<p>${arr[0]}</p><p>${arr[1]}</p>`
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
                check_status: '',
                is_on_sale: 1,
                pagesize: 10,
            },
            activeName: 'first',
            firsttable: [],
            page1: 1,
            total1: 0,
            secondtable: [],
            page2: 1,
            total2: 0,
            thirdtable: [],
            page3: 1,
            total3: 0,

            firstTableChecked: [],
            sceondTableChecked: [],
            thirdTableChecked: [],
        }
    },
    computed: {
        ...mapState(['userInfo']),
    },
    mounted() {
        this.getGoodsLists()
    },
    methods: {
        getGoodsLists() {
            this.$request
                .get(Api.getGoodsLists, { params: this.searchForm })
                .then((res) => {
                    if (this.activeName === 'first') {
                        this.firsttable = res.data.data
                        this.total1 = res.data.total
                    }
                    if (this.activeName === 'second') {
                        this.secondtable = res.data.data
                        this.total2 = res.data.total
                    }
                    if (this.activeName === 'third') {
                        this.thirdtable = res.data.data
                        this.total3 = res.data.total
                    }
                })
        },
        selecChangeFirsttable(val) {
            this.firstTableChecked = val
        },
        selecChangeSecondtable(val) {
            this.secondTableChecked = val
        },
        selecChangeThirdtable(val) {
            this.thirdTableChecked = val
        },
        handleCurrentChange1(val) {
            this.searchForm.page = val
            this.getGoodsLists()
        },
        handleCurrentChange2(val) {
            this.searchForm.page = val
            this.getGoodsLists()
        },
        handleCurrentChange3(val) {
            this.searchForm.page = val
            this.getGoodsLists()
        },
        // 批量删除
        goodsBatchDelete(checkedRow) {
            const ids = checkedRow.map((item) => item.id)
            if (ids.length > 0) {
                this.$request.post(Api.goodsBatchDelete, { ids }).then((res) => {
                    console.log(res)
                    if (res.code === 0) {
                        this.getGoodsLists()
                    }
                })
            } else {
                this.$message.error('请选择商品')
            }
        },
        // 批量上下架
        goodsBatchIsOnSale(checkedRow, is_on_sale) {
            const ids = checkedRow.map((item) => item.id)
            if (ids.length > 0) {
                this.$request
                    .post(Api.goodsBatchIsOnSale, { ids, is_on_sale })
                    .then((res) => {
                        console.log(res)
                        if (res.code === 0) {
                            this.getGoodsLists()
                        }
                    })
            } else {
                this.$message.error('请选择商品')
            }
        },
        onSubmit() {
            this.getGoodsLists()
        },
        reset(formName) {
            this.$refs[formName].resetFields()
            this.searchForm.start_time = ''
            this.searchForm.end_time = ''
            this.searchForm.page = 1
            this.searchForm.pagesize = 10
            this.getGoodsLists()
        },
        handleClick(tab) {
            if (tab.name === 'first') {
                // 已上架
                this.searchForm.page = this.page1
                this.searchForm.is_on_sale = 1
                this.searchForm.check_status = ''
            }
            if (tab.name === 'second') {
                // 已未架
                this.searchForm.page = this.page2
                this.searchForm.is_on_sale = 0
                this.searchForm.check_status = ''
            }
            if (tab.name === 'third') {
                // 审核不通过
                this.searchForm.page = this.page3
                this.searchForm.is_on_sale = ''
                this.searchForm.check_status = 2
            }
            this.getGoodsLists()
        },

        clickRow(row) {
            console.log(row)
            this.$router.push({
                path: '/storeManagement/publishProduct',
                query: { id: row.id },
            })
        },
    },
}
</script>
<style lang="less" scoped>
.productStore-page {
    background-color: #fff;
    box-sizing: border-box;
    padding: 20px;
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

    .btn-group {
        display: flex;

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
            color: #353535;
            cursor: pointer;
        }
    }



    :deep(.table-header-style) {
        background: rgba(137,147,165,0.06);

        th {
            background: transparent;
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
</style>