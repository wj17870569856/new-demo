<!-- 发布运力供需信息 -->
<template>
    <div>
        <div class="main">
            <div class="sd-publish">
                <slot name="nav"></slot>
                <!-- 运力需求 -->
                <div v-if="information_type === 1">
                    <div class="title">1.1 运力需求</div>
                    <div class="card">
                        <el-form ref="form" :rules="formRules" :model="form" label-width="100px"
                            :disabled="(status === 2 || status === 4)">
                            <el-form-item label="发货地" style="width: 400px" prop="province_code">
                                <el-row :gutter="10">
                                    <el-col :span="11">
                                        <el-select v-model="form.province_code" placeholder="请选择"
                                            @change="provinceChange">
                                            <el-option v-for="item in provinceOptions" :key="item.id" :label="item.name"
                                                :value="item.citycode">
                                            </el-option>
                                        </el-select>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-select v-model="form.city_code" placeholder="请选择">

                                            <el-option v-for="item in cityOptions" :key="item.id" :label="item.name"
                                                :value="item.citycode">
                                            </el-option>
                                        </el-select>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                            <el-form-item label="收货地" style="width: 400px" prop="receives">
                                <el-row v-for="(receive, index) in form.receives" :key="index" :gutter="10">
                                    <el-col :span="11">
                                        <el-select v-model="receive.province_code" placeholder="省"
                                            @change="(value) => receiveProvinceChange(value, index)">
                                            <el-option v-for="item in provinceOptions" :key="item.id" :label="item.name"
                                                :value="item.citycode">
                                            </el-option>
                                        </el-select>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-select v-model="receive.city_code" placeholder="市">
                                            <el-option v-for="item in receive.cityOptions" :key="item.id"
                                                :label="item.name" :value="item.citycode">
                                            </el-option>
                                        </el-select>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                            <el-form-item label="车型" prop="vehicle_model">
                                <el-checkbox-group v-model="form.vehicle_model">
                                    <el-checkbox label="不限"> 不限</el-checkbox>
                                    <el-checkbox v-for="(car, index) in carTypeList" :key="index" :label="car.name">
                                        {{ car.name }}</el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                            <el-form-item label="车长" prop="vehicle_length">
                                <el-radio-group v-model="form.vehicle_length">
                                    <el-radio v-for="(car, index) in carLengthList" :key="index" :label="car.name">
                                        {{ car.name }}
                                    </el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="货物" prop="goods">
                                <el-input v-model="form.goods" style="width: 330px"></el-input>
                            </el-form-item>
                            <el-form-item label="数量" prop="number">
                                <el-input v-model="form.number" style="width: 330px">
                                    <el-select slot="append" v-model="form.unit" style="width: 80px" size="mini"
                                        placeholder="请选择">
                                        <!-- <el-option v-for="item in unitOptions" :key="item.id" :label="item.name"
                                            :value="item.name">
                                        </el-option> -->
                                        <el-option label="吨" value="吨"></el-option>
                                        <el-option label="立方" value="立方"></el-option>
                                    </el-select>
                                </el-input>
                            </el-form-item>
                            <el-form-item label="信息有效期" prop="deadline_long">
                                <el-row :gutter="10">
                                    <el-col :span="3">
                                        <el-radio v-model="form.deadline_long" :label="2">指定日期</el-radio>
                                    </el-col>
                                    <el-col :span="9">
                                        <el-date-picker v-model="form.deadline" :picker-options="pickerOptions"
                                            @change="deadlineChange" type="date" placeholder="选择日期"
                                            value-format="yyyy-MM-dd">
                                        </el-date-picker>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-radio v-model="form.deadline_long" :label="1"
                                            @input="deadlineTypeChange">长期有效</el-radio>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                            <!-- <el-form-item label="附件">
                                <el-upload class="upload-file" action="https://jsonplaceholder.typicode.com/posts/"
                                    :limit="1" :on-exceed="handleExceed" :file-list="fileList">
                                    <el-button size="small" type="default">点击上传</el-button>
                                    <div slot="tip" class="el-upload__tip">
                                        支持jpg，png图片,pdf，txt，word，excel，psd，crd，Ai，dwg，cdr文件，压缩包，附件仅限15M</div>
                                </el-upload>
                            </el-form-item> -->
                            <el-form-item label="补充说明">
                                <el-input v-model="form.remark" style="padding: 0 5px" type="textarea" :rows="4"
                                    placeholder="填写更多需求">
                                </el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
                <!-- 运力供应 -->
                <div v-if="information_type === 2">
                    <div class="title">1.1 车源信息</div>
                    <div class="card">
                        <el-table ref="listTable" :data="tableData" border v-loading="importing" style="width: 100%"
                            size="mini" :header-row-style="{ background: '#e9f0fa' }" :header-cell-style="{
                                background: 'transparent',
                                color: '#353535',
                                fontSize: '12px',
                            }">
                            <el-table-column prop="category" label="分类（必填）" width="140" align="center">
                                <template slot-scope="scope">
                                    <el-select v-model="scope.row.category" size="mini" filterable allow-create
                                        default-first-option placeholder="请选择" :disabled="(status === 2 || status === 4)">
                                        <el-option v-for="item in carTypeList" :key="item.id" :label="item.name"
                                            :value="item.name">
                                        </el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column prop="content" label="需求名称" align="center">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.content" size="mini"
                                        :disabled="(status === 2 || status === 4)"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="num" label="载重量" width="100" align="center">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.num" size="mini"
                                        :disabled="(status === 2 || status === 4)"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="unit" label="单位" width="100" align="center">
                                <template slot-scope="scope">
                                    <el-select v-model="scope.row.unit" size="mini" placeholder="请选择"
                                        :disabled="(status === 2 || status === 4)">
                                        <el-option v-for="item in unitOptions" :key="item.id" :label="item.name"
                                            :value="item.name">
                                        </el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" width="80" align="center" v-if="(status !== 2 && status !== 4)">
                                <template slot-scope="scope">
                                    <el-button type="text" @click="deleteRow(scope.row.id, scope.$index, tableData)">删除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="btn-group" v-if="(status !== 2 && status !== 4)">
                            <el-button type="text" icon="el-icon-plus" @click="addRow">添加车源</el-button>
                            <el-popover v-model="popoverVisible" placement="bottom" width="300" trigger="manual">
                                <div>
                                    <el-upload ref="uploadExcel" class="upload-demo" action="" :limit="1"
                                        :file-list="excelList" :auto-upload="false" :on-change="chooseExcel"
                                        :on-remove="removeExcel" :on-exceed="handleExceedExcel">
                                        <el-button slot="trigger" size="small">选择文件</el-button>
                                    </el-upload>
                                    <div style="border-bottom: 1px solid rgba(137,147,165,0.06); margin: 5px 0"></div>
                                    <el-button type="text" @click="exportTemplate">下载模版</el-button>
                                    <div style="text-align: center">
                                        <div class="cancel-btn" @click="popoverVisible = false">
                                            取 消
                                        </div>
                                        <div class="confirm-btn" @click="sureImport">确认导入</div>
                                    </div>
                                </div>
                                <el-button type="text" slot="reference" icon="el-icon-upload2"
                                    @click="popoverVisible = true">导入车源
                                </el-button>
                            </el-popover>
                            <!-- <el-button type="text" icon="el-icon-download">导入车源</el-button> -->
                        </div>
                    </div>

                    <div class="title">1.2 供应说明</div>
                    <div class="card">
                        <el-form ref="form" :rules="formRules" :model="form" label-width="100px"
                            :disabled="(status === 2 || status === 4)">
                            <el-form-item label="发货地" style="width: 455px" prop="province_code">
                                <el-row :gutter="10">
                                    <el-col :span="11">
                                        <el-select v-model="form.province_code" placeholder="请选择"
                                            @change="provinceChange">
                                            <el-option v-for="item in provinceOptions" :key="item.id" :label="item.name"
                                                :value="item.citycode">
                                            </el-option>
                                        </el-select>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-select v-model="form.city_code" placeholder="请选择">
                                            <el-option v-for="item in cityOptions" :key="item.id" :label="item.name"
                                                :value="item.citycode">
                                            </el-option>
                                        </el-select>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                            <el-form-item label="收货地" style="width: 490px" prop="receives">
                                <el-row v-for="(receive, index) in form.receives" :key="index" :gutter="10"
                                    style="margin-bottom: 10px">
                                    <el-col :span="10">
                                        <el-select v-model="receive.province_code" placeholder="省"
                                            @change="(value) => receiveProvinceChange(value, index)">
                                            <el-option v-for="item in provinceOptions" :key="item.id" :label="item.name"
                                                :value="item.citycode">
                                            </el-option>
                                        </el-select>
                                    </el-col>
                                    <el-col :span="10">
                                        <el-select v-model="receive.city_code" placeholder="市">
                                            <el-option label="全省" value=""></el-option>
                                            <el-option v-for="item in receive.cityOptions" :key="item.id"
                                                :label="item.name" :value="item.citycode">
                                            </el-option>
                                        </el-select>
                                    </el-col>
                                    <el-col :span="2">
                                        <el-button v-if="index === 0 && status !== 2" type="text"
                                            @click="addReceive">添加</el-button>
                                        <el-button v-if="index !== 0 && status !== 2" type="text" style="color: red"
                                            @click="deleteReceive(form.receives, index)">删除</el-button>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                            <el-form-item label="报价有效期" prop="deadline_long">
                                <el-row :gutter="10">
                                    <el-col :span="3">
                                        <el-radio v-model="form.deadline_long" :label="2">指定日期</el-radio>
                                    </el-col>
                                    <el-col :span="9">
                                        <el-date-picker v-model="form.deadline" type="date" placeholder="选择日期"
                                            :picker-options="pickerOptions" @change="deadlineChange"
                                            value-format="yyyy-MM-dd">
                                        </el-date-picker>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-radio v-model="form.deadline_long" :label="1"
                                            @input="deadlineTypeChange">长期有效</el-radio>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                            <!-- <el-form-item label="附件">
                                <el-upload class="upload-file" action="" :on-change="chooseFile" :limit="1"
                                    :on-exceed="handleExceed" :file-list="fileList" :auto-upload="false">
                                    <el-button size="small" type="default">点击上传</el-button>
                                    <div slot="tip" class="el-upload__tip">
                                        支持jpg，png图片,pdf，txt，word，excel，psd，crd，Ai，dwg，cdr文件，压缩包，附件仅限15M</div>
                                </el-upload>
                            </el-form-item> -->
                            <el-form-item label="补充说明">
                                <el-input v-model="form.remark" style="padding: 0 5px" type="textarea" :rows="4"
                                    placeholder="填写更多需求">
                                </el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>

                <div style="display: flex; width: 952px; justify-content: flex-end">
                    <div class="btn" @click="back" >返回</div>
                    <div class="btn" @click="deleteSupplyOrder" v-if="status === 1">删除</div>
                    <div class="btn" @click="closeSupplyOrder" v-if="status === 2">关闭</div>
                    <div class="pub-btn" @click="publish" v-if="status === 1 || status === 3 || !id">{{ id ? '保存' : '发布'
                    }}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
/* eslint-disable */
import Api from '../../plugins/api'
export default {
    name: 'SdPublish',
    props: ['information_type', 'id'],
    data() {
        return {
            popoverVisible: false,
            excelList: [],
            importing: false,
            pickerOptions: {
                disabledDate: (item) => {
                    return item * 1 < new Date() * 1
                },
            },
            breadcrumb: [
                { name: '首页', path: '/' },
                { name: '供需大厅', path: '/supplyDemand' },
                { name: '货源车源', path: '/supplyDemand/list?type=yunli' },
                { name: '发布需求', path: '' },
            ],
            unitOptions: [], // 单位下拉选
            categoryOptions: [], // 分类下拉选
            provinceOptions: [], // 省份下拉选
            cityOptions: [], // 市下拉选
            carLengthList: [], // 车长选择
            carTypeList: [], // 车长选择
            tableData: [],
            type: 3, // 3运力
            form: {
                province_code: '',
                city_code: '',
                deadline_long: 1,
                deadline: '',
                remark: '',
                vehicle_model: [],
                vehicle_length: '',
                goods: '',
                number: '',
                unit: '吨',
                receives: [
                    {
                        province_code: '',
                        city_code: '',
                        cityOptions: [],
                    },
                ],
            },
            status: '',
            formRules: {
                province_code: [
                    { required: true, message: '请选择省份', trigger: 'blur' },
                ],
                deadline_long: [
                    { required: true, message: '请选择有效期', trigger: 'blur' },
                ],
                receives: [
                    { required: true, message: '请选择收货地址', trigger: 'blur' },
                ],
                vehicle_model: [
                    { required: true, message: '请选择车型', trigger: 'blur' },
                ],
                // vehicle_length: [ 
                //     { required: true, message: '请选择车长', trigger: 'blur' },
                // ],
                goods: [
                    { required: true, message: '请输入货物', trigger: 'blur' },
                ],
                number: [
                    { required: true, message: '请输入数量和单位', trigger: 'blur' },
                ],
            },
            fileList: [],
        }
    },
    async mounted() {
        await this.getCityRegion()
        this.getSKUStateSelect()
        this.getCarCategoryOptions()
        if (this.id) {
            this.getDetails()
        }
        this.addRow()
    },
    methods: {
        // 获取下拉选
        getSKUStateSelect() {
            return this.$request.get(Api.getSKUStateSelect).then((res) => {
                if (res.code === 0) {
                    this.unitOptions = res.data.unit
                    this.stockStatus = res.data.stock_status
                    this.OnSaleList = res.data.is_on_sale
                }
            })
        },
        //
        async getCarCategoryOptions() {
            const carLength = await this.$request.get(Api.vehicleLengthSelectList)
            const carType = await this.$request.get(Api.vehicleModelSelectList)
            this.carLengthList = carLength.data
            this.carTypeList = carType.data
        },
        // 获取省
        getCityRegion() {
            return this.$request
                .get(Api.getCity, { params: { level: 2 } })
                .then((res) => {
                    if (res.code === 0) {
                        this.provinceOptions = res.data
                    }
                })
        },
        // 省改变获取市
        provinceChange(code, notClear) {
            if (!notClear) {
                this.form.city_code = ''
            }
            const city = this.provinceOptions.find((item) => item.citycode === code)
            if (city) {
                this.cityOptions = city.children
            }
        },

        receiveProvinceChange(code, index, notClear) {
            if (!notClear) {
                this.form.receives[index].city_code = ''
            }
            const city = this.provinceOptions.find((item) => item.citycode === code)
            console.log(city)
            if (city) {
                this.form.receives[index].cityOptions = city.children
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
        // 下载导入模板
        exportTemplate() {
            const h = this.$refs.listTable.columns.map((item) => item.label);
            h.splice(-1, 1) // 删除最后一个操作列
            const header = { header: h }
            const data = []
            const xlsxName = `运力信息供需清单导入模板`
            const ws = this.$xlsx.utils.json_to_sheet(data, header)
            const wb = this.$xlsx.utils.book_new()
            this.$xlsx.utils.book_append_sheet(wb, ws, xlsxName)
            this.$xlsx.writeFile(wb, xlsxName + '.xlsx')
        },
        sureImport() {
            const file = this.excelList[0]
            const that = this
            const reader = new FileReader()
            reader.onload = function (e) {
                const bstr = e.target.result
                const workbook = that.$xlsx.read(bstr, { type: 'binary' })
                const wsname = workbook.SheetNames[0]
                const ws = workbook.Sheets[wsname]
                const data = that.$xlsx.utils.sheet_to_json(ws, { header: 1 })
                that.excelDataToTableData(data)
            }
            reader.readAsBinaryString(file.raw)
            this.SkuExcelFileList = []
        },
        // excel表中的数据转成colTable组件需要的数据
        excelDataToTableData(data) {
            console.log(data);
            const that = this
            let tableheader = this.$refs.listTable.columns.map((item) => item.label) // 页面表格上的标题
            console.log('====================================');
            console.log(tableheader,'tableheader');
            console.log('====================================');
            tableheader.splice(-1, 1) // 删除最后一个操作列

            const headerIndex = {} // excel里的标题和对应的下标
            const tableData = []

            let hasError = false
            this.importing = true
            try {
                data.forEach((row, i) => {
                    if (i === 0) {
                        // 标题行
                        row.forEach((value, j) => {
                            headerIndex[value] = j
                        })
                        if (
                            !(
                                tableheader.length === row.length &&
                                tableheader.sort().toString() === row.sort().toString()
                            )
                        ) {
                            throw new Error(`excel表头数量不对，请重新下载模板填入`)
                        }
                    } else {
                        // 内容行
                        const obj = {}
                        for (const key in headerIndex) {
                            // 拿出excel里
                            if (Object.hasOwnProperty.call(headerIndex, key)) {
                                const k = headerIndex[key]
                                switch (key) {
                                    case '分类':
                                        obj.category = row[k]
                                        break
                                        case '分类（必填）':
                                        obj.category = row[k]
                                        break
                                    case '需求名称':
                                        obj.content = row[k]
                                        break
                                    case '载重量':
                                        // if (isNaN(row[k])) {
                                        //     throw new Error(`第${i + 1}数量不是数值`)
                                        // }
                                        obj.num = row[k]
                                        break
                                    case '单位':
                                        {
                                            const name = row[k]
                                            const Unit = that.unitOptions.find(
                                                (item) => item.name === name
                                            )
                                            if (Unit) {
                                                obj.unit = name
                                            } else {
                                                throw new Error(`第${i + 1}行单位填写错误`)
                                            }
                                        }
                                        break
                                }
                            }
                        }
                        tableData.push(obj)
                    }
                })
            } catch (error) {
                hasError = true
                this.importing = false
                this.$message.error(error.message)
            }

            if (hasError) {
                return
            }
            this.tableData = this.tableData.concat(tableData)

            let settimer = setTimeout(() => {

                settimer && clearTimeout(settimer)
                this.importing = false
                this.popoverVisible = false
                this.excelList = []
            }, 500)
        },
        addRow() {
            this.tableData.push({
                category: '',
                content: '',
                num: 1,
                unit: '吨',
            })
        },
        deleteRow(id, index, rows) {
            rows.splice(index, 1)
        },
        addReceive() {
            this.form.receives.push({
                province_code: '',
                city_code: '',
                cityOptions: [],
            })
        },
        deleteReceive(receives, index) {
            receives.splice(index, 1)
        },
        // 发布按钮
        publish() {
            const data = JSON.parse(JSON.stringify(this.form));


      if(this.information_type !== 1) {
        if (this.tableData.length === 0) {
        this.$message.error("至少添加一条供需明细！");
        return;
      }
      if (this.tableData.length !== this.tableData.filter((item) => item.category).length) {
        this.$message.error("请将明细信息填写完整");
        return;
      }
      }


            data.details = this.tableData
            data.type = this.type
            data.receives = data.receives.map((item) => ({
                province_code: item.province_code,
                city_code: item.city_code,
            }))
            data.information_type = this.information_type
            data.vehicle_model = data.vehicle_model.join(',')


            const type1Field = ['province_code', 'deadline_long', 'receives', 'vehicle_model', 'goods', 'number'] // 需求信息需要校验的字段
            const type2Field = ['province_code', 'deadline_long', 'receives'] // 供应信息需要校验的字段
            const Field = this.information_type === 1 ? type1Field : type2Field
            const validFieldMsg = []
            this.$refs.form.validateField(Field, (errorMessage) => {
                validFieldMsg.push(errorMessage)
                if (validFieldMsg.length === Field.length && validFieldMsg.every((item) => item === "")) {
                    this.$request.post(Api.supplyOrderEdit, data).then((res) => {
                        if (res.code === 0) {
                            this.$message.success('发布成功')

                            if (this.$route.path.indexOf('buyer') != -1) {
                                this.$emit('publishSuccess', { type: this.type })
                            } else {
                                this.$router.back()
                            }
                        } else {
                            this.$message.error(res.msg)
                        }
                    })
                }
            })
        },
        back() {
            this.$emit('publishBack', { type: this.type })
        },
        deleteSupplyOrder() {
            this.$request
                .get(Api.deleteSupplyOrder, { params: { id: this.id } })
                .then((res) => {
                    if (res.code === 0) {
                        this.$message.success('删除成功')
                        this.$emit('publishDelete', { type: this.type })
                    }
                })
        },
        closeSupplyOrder() {
            this.$request.get(Api.closeOrder, { params: { id: this.id } }).then((res) => {
                if (res.code === 0) {
                    this.$message.success('关闭成功')
                    this.$emit('publishClose', { type: this.type })
                }
            })
        },
        // 获取详情
        async getDetails() {
            await this.$request
                .get(Api.getSupplyOrderInfo, { params: { id: this.id } })
                .then((res) => {
                    if (res.code === 0) {
                        const {
                            id,
                            status,
                            province_code,
                            city_code,
                            deadline_long,
                            deadline,
                            remark,
                            vehicle_model,
                            vehicle_length,
                            goods,
                            number,
                            unit,
                            receive,
                            details,
                        } = res.data
                        const model = vehicle_model === '' ? [] : vehicle_model
                        this.form = {
                            id,
                            province_code,
                            city_code,
                            deadline_long,
                            deadline: deadline_long === 1 ? '' : this.$moment(deadline * 1000).format('yyyy-MM-DD'),
                            remark,
                            vehicle_model: model,
                            vehicle_length,
                            goods,
                            number,
                            unit,
                            receives: receive,
                        }
                        this.status = status

                        this.provinceChange(province_code, true)
                        this.form.receives.forEach((item, i) => {
                            this.receiveProvinceChange(item.province_code, i, true)
                        })
                        this.tableData = details
                    }
                })
        },
        async chooseFile(file, fileList) {
            const fileSuffix = file.name.substring(file.name.lastIndexOf('.') + 1)
            const whiteList = [
                'jpg',
                'png',
                'jpeg',
                'JPG',
                'JPEG',
                'PNG',
                'PDF',
                'pdf',
                'txt',
                'doc',
                'docx',
                'xls',
                'xlsx',
                'psd',
                'crd',
                'Ai',
                'dwg',
                'cdr',
                'zip',
                'rar',
            ]

            if (!whiteList.includes(fileSuffix)) {
                fileList.pop()
                this.$message.error(
                    '仅支持jpg，png，jpeg图片,pdf，txt，word，excel，psd，crd，Ai，dwg，cdr，zip，rar文件'
                )
                return false
            }
            const isLt15M = file.size / 1024 / 1024 <= 15
            if (!isLt15M) {
                fileList.pop()
                return this.$message.error('上传文件大小不能超过 15MB!')
            }

            // FormData 对象
            const formData = new FormData()
            // 文件对象
            formData.append('file', file.raw)
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: this.token,
                },
            }
            const res = await this.$request.post(Api.uploadFile, formData, config)
            console.log('res=>', res)
            console.log('fileList', fileList)
            if (res.success) {
                const { data } = res
                fileList[0].url = data.filePath
                this.fileList = fileList
            } else {
                this.fileList = []
                this.$message.error(res.msg)
            }
        },
        handleExceed() {
            this.$message.error('只能上传一个文件')
        },

        deadlineChange(value) {
            if (value) {
                this.form.deadline_long = 2
            }
        },
        deadlineTypeChange() {
            this.form.deadline = ''
        }
    },
}
</script>

<style scoped lang="less">
.sd-publish {
    margin: 0 auto;
    position: relative;
    padding-bottom: 120px;
}

.title {
    font-size: 14px;
    font-family: Microsoft YaHei, Microsoft YaHei-Bold;
    font-weight: 700;
    color: #353535;
    line-height: 18px;
    margin-bottom: 8px;
}

.card {
    width: 925px;
    min-height: 192px;
    border: 1px solid #e5e5e5;
    border-top: 2px solid #cbd7eb;
    padding: 20px 12px;
    position: relative;
    margin-bottom: 24px;

    :deep(.el-table) {
        margin-bottom: 40px;
    }

    :deep(.el-form-item__content) {
        padding-left: 5px;
    }

    :deep(.el-table .el-input__inner) {
        border-radius: 0;
    }

    :deep(.el-table .el-button) {
        padding: 6px 12px;
    }

    :deep(.el-upload__tip) {
        font-size: 12px;
        font-family: Microsoft YaHei, Microsoft YaHei-Regular;
        font-weight: 400;
        text-align: left;
        color: #959595;
        line-height: 18px;
        margin-top: 0;
    }

    .btn-group {
        position: absolute;
        bottom: 10px;
    }
}

.upload-file {
    padding: 0 5px;
}

.btn {
    padding: 0;
    width: 120px;
    height: 40px;
    margin: 0 20px 0 0;
    background: #ffffff;
    border: 1px solid #e5e5e5;
    border-radius: 2px;
    font-size: 14px;
    font-family: Microsoft YaHei, Microsoft YaHei-Regular;
    font-weight: 400;
    text-align: center;
    color: #353535;
    line-height: 40px;
    cursor: pointer;
}

.pub-btn {
    width: 120px;
    height: 40px;
    background: #2277e8;
    border-radius: 2px;
    font-size: 14px;
    font-family: Microsoft YaHei, Microsoft YaHei-Regular;
    font-weight: 400;
    text-align: center;
    color: #ffffff;
    line-height: 40px;
}

:deep(.el-input.is-disabled .el-input__inner) {
    color: #353535;
}

:deep(.el-checkbox__input.is-disabled+span.el-checkbox__label) {
    color: #353535;
}

:deep(.el-radio__input.is-disabled+span.el-radio__label) {
    color: #353535;
}

:deep(.el-radio__input.is-disabled.is-checked .el-radio__inner::after) {
    background-color: #353535;
}

:deep(.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after) {
    border-color: #353535;
}
</style>
