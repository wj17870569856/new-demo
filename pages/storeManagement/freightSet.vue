<template>
    <!-- 店铺商品运费设置模板 -->
    <div class="freightSet-page">
        <div class="fee-info">
        <div class="title">
            <span class="sub-title">店铺商品运费设置模板</span>
            <span class="tips">用户购买多件产品，按购买产品的最低运费金额计算</span>
        </div>
        <div>
            <el-table :data="feeTableData" border style="width: 100%" max-height="600px"
                :header-row-style="{ background: 'rgba(137,147,165,0.06)' }" :header-cell-style="{
                    background: 'transparent',
                    color: '#353535',
                    fontSize: '14px',
                }">
                <el-table-column prop="name" label="省份" align="center">
                </el-table-column>
                <el-table-column prop="freight_price" label="运费" align="center">
                    <template slot-scope="scope">
                        <el-input v-model.trim="scope.row.freight_price" size="small" clearable
                            @input="(value) => inputNumCheck(value, scope.row)"></el-input>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="btn-group">
            <div class="clear-btn" @click="clearFreightTpl">全部清空</div>
            <div class="save-btn" @click="editFreightTpl">保 存</div>
        </div>
    </div>
    </div>
</template>
<script>
//   import { mapState, mapActions } from 'vuex'
import Api from '../../plugins/api'

export default {
    name: 'FreightSet',
    middleware: "auth",
    layout: 'personalCenter',
    data() {
        return {
            feeTableData: [],
        }
    },
    computed: {},
    mounted() {
        this.getFreightTpl()
    },
    methods: {
        inputNumCheck(value, row) {
            if (isNaN(value)) {
                row.freight_price = 0.0
            }
        },
        getFreightTpl() {
            this.$request.get(Api.getFreightTpl).then((res) => {
                this.feeTableData = res.data
            })
        },
        clearFreightTpl() {
            this.$request.post(Api.getFreightTplClear).then((res) => {
                if (res.code === 0) {
                    this.$message.success('清除成功')
                    this.getFreightTpl()
                }
            })
        },
        editFreightTpl() {
            const data = this.feeTableData.map((item) => {
                return {
                    area_id: item.area_id,
                    freight_price: item.freight_price,
                }
            })
            this.$request.post(Api.getFreightTplEdit, { data }).then((res) => {
                if (res.code === 0) {
                    this.$message.success('保存成功')
                    this.getFreightTpl()
                }
            })
        },
    },
}
</script>
<style lang="less" scoped>
.freightSet-page {
    box-sizing: border-box;
    padding: 20px;
    background-color: #fff;
}
.fee-info {
    width: 400px;

    .title {
        display: flex;
        flex-direction: column;

        .sub-title {
            font-weight: bold;
font-size: 18px;
color: #0A1833;
line-height: 21px;
margin-bottom: 10px;
        }

        .tips {
            width: 336px;
            height: 24px;
            line-height: 24px;
            background: #fff2d4;
            border: 1px solid #ffb507;
            font-size: 14px;
            font-family: Microsoft YaHei, Microsoft YaHei-Regular;
            font-weight: 400;
            text-align: center;
            color: #353535;
            margin: 16px 0;
        }
    }

    .btn-group {
        display: flex;
        justify-content: flex-end;
        margin: 20px 0;

        .clear-btn {
            width: 120px;
            height: 40px;
            line-height: 40px;
            text-align: center;
            background: #ffffff;
            border: 1px solid #d5d5d5;
            border-radius: 2px;
            margin: 0 10px;
            cursor: pointer;
        }

        .save-btn {
            width: 120px;
            height: 40px;
            line-height: 40px;
            text-align: center;
            background: #2277e8;
            border-radius: 2px;
            color: #fff;
            cursor: pointer;
        }
    }
}
</style>