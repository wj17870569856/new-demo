<template>
  <div class="col-table">
    <el-table ref="table" :data="ColTableData" border style="width: 950px">
      <el-table-column
        v-for="(attr, i) in AttrCol"
        :key="i"
        :label="attr.attr_name"
        align="center"
      >
        <template slot-scope="scope">
          <el-input
            v-if="scope.row.sku_attr && scope.row.sku_attr.length > 0"
            v-model="scope.row.sku_attr[i].attr_value"
            placeholder="请输入"
          >
          </el-input>
        </template>
      </el-table-column>
      <el-table-column label="销售价" align="center">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.sku_shop_price"
            placeholder="请输入"
            @input="(value) => InputNumShopPrice(value, scope.row)"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="成本价" align="center">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.sku_cost_price"
            placeholder="请输入"
            @input="(value) => InputNumCostPrice(value, scope.row)"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="province" label="起订量" align="center">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.min_sale"
            placeholder="请输入"
            @input="(value) => InputNumMinSale(value, scope.row)"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="city" label="单位" align="center">
        <template slot-scope="scope">
          <el-select v-model="scope.row.unit" placeholder="请选择">
            <el-option
              v-for="item in unitList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="库存状态" align="center">
        <template slot-scope="scope">
          <el-select v-model="scope.row.stock_status" placeholder="请选择">
            <el-option
              v-for="item in stockStatus"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="zip" label="上架状态" align="center">
        <template slot-scope="scope">
          <el-select v-model="scope.row.is_on_sale" placeholder="请选择">
            <el-option
              v-for="item in OnSaleList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center" width="50">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="deleteRow(scope.$index, ColTableData, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import Api from '../plugins/api'
export default {
  name: 'ColTable',
  props: {
    tableData: {
      type: Array,
      default: () => [],
    },
    attrHeader: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      delete_sku_ids: [],
      AttrCol: [
        // {
        //   attr_id: '',
        //   attr_name: '',
        //   attr_value: '',
        // },
      ],
      ColTableData: [
        // {
        //   id: 204,
        //   serial_number: '233202209230001cO-1',
        //   stock_status: 1,
        //   min_sale: 1,
        //   unit: 4,
        //   sku_cost_price: 12,
        //   sku_shop_price: 22,
        //   is_on_sale: 1,
        //   sku_attr: [
        //     {
        //       attr_id: 0,
        //       attr_name: '颜色',
        //       attr_value: '红色',
        //       id: 1164,
        //     },
        //   ],
        // },
        // {
        //   id: 205,
        //   serial_number: '233202209230001cO-2',
        //   stock_status: 1,
        //   min_sale: 1,
        //   unit: 4,
        //   sku_cost_price: 12,
        //   sku_shop_price: 25,
        //   is_on_sale: 1,
        //   sku_attr: [
        //     {
        //       attr_id: 0,
        //       attr_name: '颜色',
        //       attr_value: '黄色',
        //       id: 1164,
        //     },
        //   ],
        // },
        // {
        //   id: 206,
        //   serial_number: '233202209230001cO-3',
        //   stock_status: 1,
        //   min_sale: 2,
        //   unit: 1,
        //   sku_cost_price: 20,
        //   sku_shop_price: 200,
        //   is_on_sale: 1,
        //   sku_attr: [
        //     {
        //       attr_id: 0,
        //       attr_name: '颜色',
        //       attr_value: '蓝色',
        //       id: 1164,
        //     },
        //   ],
        // },
      ],
      unitList: [],
      stockStatus: [],
      OnSaleList: [],
    }
  },
  mounted() {
    this.getSKUStateSelect()
    setTimeout(() => {
      this.setTableData()
    }, 500)
  },
  methods: {
    setTableData() {
      this.ColTableData = this.tableData
      if (this.ColTableData.length > 0 && this.ColTableData[0].sku_attr) {
        this.AttrCol = this.ColTableData[0].sku_attr.map((item, i) => {
          return {
            attr_id: i,
            attr_name: item.attr_name,
          }
        })
      } else {
        this.AttrCol = []
      }
    },
    // 获取下拉选
    getSKUStateSelect() {
      return this.$request.get(Api.getSKUStateSelect).then((res) => {
        if (res.code === 0) {
          this.unitList = res.data.unit
          this.stockStatus = res.data.stock_status
          this.OnSaleList = res.data.is_on_sale
        }
      })
    },
    InputNumShopPrice(value, row) {
      if (!isNaN(value)) {
        row.sku_shop_price = value
      } else {
        this.$message.warning('销售价只能输入数字')
        row.sku_shop_price = ''
      }
    },
    InputNumCostPrice(value, row) {
      if (!isNaN(value)) {
        row.sku_cost_price = value
      } else {
        this.$message.warning('成本价只能输入数字')
        row.sku_cost_price = ''
      }
    },
    InputNumMinSale(value, row) {
      if (!isNaN(value)) {
        row.min_sale = value
      } else {
        this.$message.warning('起订量只能输入数字')
        row.min_sale = ''
      }
    },

    // 生成表头
    createHeader(AllCheckAttr) {
      const hadName = this.AttrCol.map((item) => item.attr_name)

      AllCheckAttr.forEach((attr, i) => {
        if (!hadName.includes(attr.attr_name)) {
          // 生成表头时，如果表格已经有数据
          if (this.ColTableData.length > 0) {
            this.ColTableData.forEach((row, i) => {
              if (row.sku_attr) {
                row.sku_attr.push({
                  attr_id: attr.attr_id,
                  attr_name: attr.attr_name,
                  attr_value: '',
                })
              } else {
                this.$set(row, 'sku_attr', [])
                row.sku_attr.push({
                  attr_id: attr.attr_id,
                  attr_name: attr.attr_name,
                  attr_value: '',
                })
              }
            })
          }
          // 生成表头
          this.AttrCol.push({
            attr_id: i,
            attr_name: attr.attr_name,
          })
        }
      })
    },
    // 添加行
    addRow() {
      // 用
      const sku_attr = this.attrHeader.map((item, i) => {
        return {
          attr_name: item.attr_name,
          attr_value: '',
          attr_id: item.attr_id,
        }
      })
      console.log(sku_attr)
      this.ColTableData.push({
        stock_status: 1,
        min_sale: 1,
        unit: this.unitList[0].id,
        sku_cost_price: 0,
        sku_shop_price: 0,
        is_on_sale: 1,
        sku_attr,
      })
    },
    deleteRow(index, tabledata, row) {
      this.delete_sku_ids.push(row.id)
      tabledata.splice(index, 1)
    },
    // 添加列
    addCol(attr_name, attr_id = '', id = '') {
      const hadName = this.AttrCol.map((item) => item.attr_name) // 已有属性名
      if (hadName.includes(attr_name)) {
        return
      }
      const sku_attr = this.attrHeader.map((item) => {
        return {
          attr_name: item.attr_name,
          attr_value: '',
          attr_id: item.attr_id,
        }
      })

      this.ColTableData.forEach((item) => {
        if (!item.sku_attr) {
          this.$set(item, 'sku_attr', [])
        }
        item.sku_attr = sku_attr
      })
    },

    getData() {
      return this.ColTableData
    },
    clearCol(uncheckAttr) {
      uncheckAttr.forEach((attrObj) => {
        this.AttrCol.forEach((item, i) => {
          if (item.attr_name === attrObj.attr_name) {
            this.AttrCol.splice(i, 1)
          }
        })
        this.ColTableData.forEach((item) => {
          item.sku_attr.forEach((attr, j) => {
            if (attr.attr_name === attrObj.attr_name) {
              item.sku_attr.splice(j, 1)
            }
          })
        })
      })
    },
  },
}
</script>
