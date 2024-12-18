<template>
    <div class="staffAccountAdmin-page">
        <div class="title">
            <span>员工账号管理</span>
        </div>
        <div class="search-form">
            <el-form ref="searchForm" :model="searchForm" class="search-form-inline">
                <el-form-item prop="realname">
                    <el-input v-model="searchForm.realname" placeholder="员工姓名"></el-input>
                </el-form-item>
                <el-form-item prop="mobile">
                    <el-input v-model="searchForm.mobile" placeholder="手机号码"></el-input>
                </el-form-item>
                <el-form-item prop="username">
                    <el-input v-model="searchForm.username" placeholder="员工账号"></el-input>
                </el-form-item>
                <el-form-item prop="status">
                    <el-select v-model="searchForm.status" placeholder="账号状态">
                        <el-option label="正常" :value="1"></el-option>
                        <el-option label="禁用" :value="2"></el-option>
                        <el-option label="待认证" :value="3"></el-option>
                        <el-option label="待审核" :value="4"></el-option>
                        <el-option label="不通过" :value="5"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item >
                    <el-button type="text" @click="onSearchStaff">搜索</el-button>
                    <el-button type="text" @click="resetForm()">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table-wrapper">
            <div class="btn-group">
                <el-button  type="danger" @click="deleteManyStaff">批量删除</el-button>
                <el-button type="primary" icon="el-icon-user-solid" @click="addStaffBtn">新增员工</el-button>
            </div>
            <el-table ref="multipleTable" :data="staffTableData" tooltip-effect="dark" style="width: 100%" stripe
                header-row-class-name="table-header-style" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center">
                </el-table-column>
                <el-table-column prop="realname" label="员工姓名" align="center" width="100">
                </el-table-column>
                <el-table-column prop="mobile" label="手机号码" align="center">
                </el-table-column>
                <el-table-column prop="username" label="员工账号" align="center">
                </el-table-column>
                <el-table-column prop="status_txt" label="账号状态" align="center">
                </el-table-column>
                <el-table-column label="操作"  width="150" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" icon="el-icon-edit"
                            @click="editStaff(scope.row.id)">修改</el-button>
                        <el-popconfirm :title="`删除员工 ${scope.row.realname} `" hide-icon confirm-button-text="取消"
                            cancel-button-text="删除" popper-class="popper-delete" @cancel="deleteStaff([scope.row.id])">
                            <el-button slot="reference" type="text" size="small" icon="el-icon-delete">删除</el-button>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination  style="text-align: right; margin: 20px 0" small layout=" prev, pager, next, jumper"
                :total="total" :page-size="pageSize" :pager-count="5" :current-page="page"
                @current-change="handleCurrentChange">
            </el-pagination>
        </div>

        <!-- 添加员工弹窗 -->
        <el-dialog class="dialog-style" title="新增员工" :visible.sync="addStaffFormVisible" center width="540px">
            <el-form ref="addStaffForm" :model="addStaffForm" :rules="addStaffFormRules">
                <!-- 添加员工 -->
                <el-form-item v-if="addStaffStep === 1" label="员工姓名" label-width="100px" prop="realname">
                    <el-input v-model="addStaffForm.realname" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item v-if="addStaffStep === 1" label="员工手机号" label-width="100px" prop="mobile">
                    <el-input v-model="addStaffForm.mobile" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item v-if="addStaffStep === 1" label="角色权限" label-width="100px">
                    <el-checkbox-group v-model="addStaffForm.role" prop="role">
                        <el-checkbox label="客服" name="role" true-label="1" false-label=""></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>

                <el-form-item v-if="addStaffStep === 2" label="员工账号" label-width="100px" prop="username">
                    <el-input v-model="addStaffForm.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item v-if="addStaffStep === 2" label="登录密码" label-width="100px" prop="passwd">
                    <el-input v-model="addStaffForm.passwd" autocomplete="off" type="password"></el-input>
                </el-form-item>
            </el-form>
            <div v-if="addStaffStep === 1" slot="footer" class="dialog-footer">
                <el-button class="cancel-btn" @click="closeAddDialog">取 消</el-button>
                <el-button type="primary" class="sure-btn" @click="submitAddStaff">提 交</el-button>
            </div>
            <div v-if="addStaffStep === 2" slot="footer" class="dialog-footer">
                <el-button class="cancel-btn" @click="addStaffStep = 1">上一步</el-button>
                <el-button type="primary" class="sure-btn" @click="submitStaffAccount">提 交</el-button>
            </div>
        </el-dialog>

        <!-- 修改员工 -->
        <el-dialog class="dialog-style" title="新增员工" :visible.sync="editStaffFormVisible" center width="540px"
            @close="closeEditDialog">
            <el-form ref="editStaffForm" :model="editStaffForm" :rules="editStaffFormRules">
                <el-form-item label="员工姓名" label-width="100px" prop="realname">
                    <el-input v-model="editStaffForm.realname" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="员工手机号" label-width="100px" prop="mobile">
                    <el-input v-model="editStaffForm.mobile" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="员工账号" label-width="100px" prop="username">
                    <el-input v-model="editStaffForm.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="登录密码" label-width="100px" prop="passwd">
                    <el-input v-model="editStaffForm.passwd" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="角色权限" label-width="100px">
                    <el-checkbox-group v-model="editStaffForm.role" prop="role">
                        <el-checkbox label="客服" name="role" true-label="1" false-label=""></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button class="cancel-btn" @click="closeEditDialog">取 消</el-button>
                <el-button type="primary" class="sure-btn" @click="submitEditStaff">保 存</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import Api from '../../plugins/api'
export default {
    name: 'StaffAccountAdmin',
    middleware: "auth",
    layout: 'personalCenter',
    data() {
        return {
            addStaffFormVisible: false, // 新增对话框
            editStaffFormVisible: false, // 编辑对话框
            searchForm: {
                realname: '',
                mobile: '',
                username: '',
                status: 1,
            },
            addStaffForm: {
                realname: '',
                mobile: '',
                username: '',
                role: '',
                passwd: '',
            }, //
            addStaffFormRules: {
                realname: [{ required: true, message: '请输入', trigger: 'blur' }],
                mobile: [{ required: true, message: '请输入', trigger: 'blur' }],
                username: [{ required: true, message: '请输入', trigger: 'blur' }],
                passwd: [{ required: true, message: '请输入', trigger: 'blur' }],
            },
            editStaffForm: {
                id: '',
                realname: '',
                mobile: '',
                role: '',
                username: '',
                passwd: '',
            },
            editStaffFormRules: {
                realname: [{ required: true, message: '请输入', trigger: 'blur' }],
                mobile: [{ required: true, message: '请输入', trigger: 'blur' }],
                username: [{ required: true, message: '请输入', trigger: 'blur' }],
            },
            staffTableData: [], // 员工表格数据
            page: 1,
            pageSize: 20,
            total: 0,
            multipleSelection: [], // 多选的数据
            addStaffStep: 1, // 添加员工第几步
        }
    },
    mounted() {
        this.getStaffList()
    },
    methods: {
        // 获取员工列表
        getStaffList() {
            const params = {
                page: this.page,
                limit: this.pageSize,
                ...this.searchForm,
            }
            this.$request.get(Api.userStaffList, { params }).then((res) => {
                if (res.code === 0) {
                    this.staffTableData = res.data
                    this.total = res.count
                } else {
                    this.$message.error(res.msg)
                }
            })
        },
        handleCurrentChange() {
            this.getStaffList()
        },
        // 表格多选触发
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        // 新增员工
        submitAddStaff() {
            const data = {
                realname: this.addStaffForm.realname,
                mobile: this.addStaffForm.mobile,
                role: this.addStaffForm.role,
            }
            this.$request.post(Api.userStaffAddByMobile, data).then((res) => {
                if (res.code === 0) {
                    if (res.data.is_exist === 0) {
                        this.addStaffStep = 2
                    } else if (res.data.is_exist === 1) {
                        this.page = 1
                        this.getStaffList()
                        this.closeAddDialog()
                    }
                } else {
                    this.$message.error(res.msg)
                }
            })
        },
        // 新增员工账号
        submitStaffAccount() {
            this.$request.post(Api.userStaffAdd, this.addStaffForm).then((res) => {
                if (res.code === 0) {
                    this.page = 1
                    this.$message.success(res.msg)
                    this.getStaffList()
                    this.closeAddDialog()
                    this.addStaffFormVisible = false
                } else {
                    this.$message.error(res.msg)
                }
            })
        },

        // 获取员工信息
        getStaffInfo(id) {
            this.$request
                .get(Api.userStaffDelete, {
                    params: { id },
                })
                .then((res) => {
                    if (res.code === 0) {
                        console.log(res)
                        this.$message.success(res.msg)
                    } else {
                        this.$message.error(res.msg)
                    }
                })
        },
        // 删除员工
        deleteStaff(idArr) {
            const ids = idArr.join(',')
            this.$request
                .get(Api.userStaffDelete, {
                    params: { id: ids },
                })
                .then((res) => {
                    if (res.code === 0) {
                        this.$message.success(res.msg)
                        this.getStaffList()
                    } else {
                        this.$message.error(res.msg)
                    }
                })
        },
        // 批量删除员工
        deleteManyStaff() {
            if (this.multipleSelection.length === 0) {
              return  this.$message.warning('请选择员工')
            }
            const ids = this.multipleSelection.map((item) => item.id)
            this.deleteStaff(ids)
        },
        // 修改员工信息
        updateStaffInfo() {
            this.$request.get(Api.userStaffInfo, {}).then((res) => {
                if (res.code === 0) {
                    this.staffTableData = res.data
                    this.total = res.count
                } else {
                    this.$message.error(res.msg)
                }
            })
        },
        // 搜索员工
        onSearchStaff() {
            this.page = 1
            this.getStaffList()
        },
        // 重置搜索条件
        resetForm() {
            this.page = 1
            this.$refs.searchForm.resetFields()
            this.getStaffList()
        },
        // 添加员工按钮
        addStaffBtn() {
            this.addStaffStep = 1
            this.addStaffForm = {
                realname: '',
                mobile: '',
                username: '',
                role: '',
                passwd: '',
            }
            this.addStaffFormVisible = true
        },
        // 编辑按钮
        editStaff(id) {
            this.$request.get(Api.userStaffInfo, { params: { id } }).then((res) => {
                if (res.code === 0) {
                    this.editStaffForm = res.data
                    this.editStaffForm.id = id
                    this.editStaffForm.passwd = ''
                    this.editStaffFormVisible = true
                } else {
                    this.$message.error(res.msg)
                }
            })
        },
        // 提交编辑员工
        submitEditStaff() {
            this.$request.post(Api.userStaffEdit, this.editStaffForm).then((res) => {
                if (res.code === 0) {
                    this.$message.success(res.msg)
                    this.getStaffList()
                    this.closeEditDialog()
                    this.editStaffFormVisible = false
                } else {
                    this.$message.error(res.msg)
                }
            })
        },
        // 关闭新增弹窗
        closeAddDialog() {
            this.addStaffStep = 1
            this.addStaffForm = {
                realname: '',
                mobile: '',
                username: '',
                role: '',
                passwd: '',
            }
            this.addStaffFormVisible = false
        },
        // 关闭编辑弹窗
        closeEditDialog() {
            this.editStaffForm = {
                id: '',
                realname: '',
                mobile: '',
                role: '',
                username: '',
                passwd: '',
            }
            this.editStaffFormVisible = false
        },
        handleClick(tab, event) {
            console.log(tab, event)
        },
    },
}
</script>
<style lang="less" scoped>
.staffAccountAdmin-page {
    background-color: #fff;
    padding: 20px;
    box-sizing: border-box;
    min-height: 750px;
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
        background: rgba(137,147,165,0.06);
        border-radius: 2px;
        padding: 5px;
        box-sizing: border-box;

        .search-form-inline {
            display: flex;

            :deep(.el-form-item) {
                margin: 0 5px;
                width: 120px;

                &.time {
                    width: 350px;
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
            margin-bottom: 24px;
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
                font-size: 14px;
                font-family: Microsoft YaHei, Microsoft YaHei-Regular;
                font-weight: 400;
                color: #353535;

                &.blue {
                    color: #2277e8;
                    border: 1px solid #2277e8;
                }
            }
        }



        :deep(.table-header-style) {
            background: rgba(137,147,165,0.06);

            th {
                background: transparent;
            }
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
}
</style>