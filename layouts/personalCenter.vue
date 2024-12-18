<template>
    <div class="wrap">
        <NavHeader :active="active" :tabs="tabs"></NavHeader>
        <div class="content">
            <Breadcrumb :list="breadcrumb" />
            <div class="view row-sw">
                <div class="bar left">
                    <div v-for="(item, index) in getModule && getModule.menu" :key="index">
                        <div class="leave1 row-sw col-center" :class="$route.path == item.path ? 'active' : ''"
                            @click="nav(item)">
                            <span class="name">{{ item.name }}</span>
                            <img v-if="item.path" class="icon" src="../assets/imgs/icon_nav.png" />
                        </div>
                        <ul>
                            <li :class="$route.path == tab.path ? 'active' : ''" class="leave2  row-sw col-center"
                                v-for="(tab, j) in item.children" :key="j" @click="nav(tab)">
                                <span class="name">{{ tab.name }}</span>
                                <img v-if="tab.path" class="icon" src="../assets/imgs/icon_nav.png" />
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="right">
                    <nuxt />
                </div>
            </div>


        </div>
        <NavFooter></NavFooter>
    </div>
</template>
<script>
import NavHeader from '~/components/NavHeader2.vue'
import NavFooter from '~/components/NavFooter.vue'
export default {
    name: 'indexPage',
    middleware: "auth",
    components: { NavHeader, NavFooter },
    data() {
        return {
            pages: [{
                name: '首页',
                path: '/personalCenter',
                menu: [
                    {
                        name: '首页',
                        path: '/personalCenter',
                    },
                    {
                        name: '我出售的商品',
                        children: [
                            {
                                name: '订单列表',
                                path: '/personalCenter/sellerList'
                            }
                        ]
                    },
                    {
                        name: '我采购的商品',
                        children: [
                            {
                                name: '订单列表',
                                path: '/personalCenter/buyerList'
                            }
                        ]
                    },
                    {
                        name: '供需大厅',
                        children: [
                            {
                                name: '我发布的需求信息',
                                path: '/personalCenter/mydemand'
                            },
                            {
                                name: '我发布的供应信息',
                                path: '/personalCenter/mysupply'
                            },
                            {
                                name: '我报价的需求信息',
                                path: '/personalCenter/myQuote'
                            }
                        ]
                    }
                    // , {
                    //     name: '收藏',
                    //     children: [
                    //         {
                    //             name: '我收藏的商品',
                    //             path: '/personalCenter/myCollectionGoods'
                    //         },
                    //         {
                    //             name: '我收藏的店铺',
                    //             path: '/personalCenter/myCollectionStore'
                    //         }
                    //     ]
                    // },
                    //  {
                    //     name: '更新个人资料',
                    //     path: '/personalCenter/updateInfo'
                    // }
                ]
            },











            {
                name: '店铺管理',
                menu: [
                    {
                        name: '商品管理',
                        children: [
                            {
                                name: '发布商品',
                                path: '/storeManagement/publishProduct'
                            }, {
                                name: '公司产品库',
                                path: '/storeManagement/productStore'
                            }, {
                                name: '更新商品价格',
                                path: '/storeManagement/updatePrice'
                            }
                        ]
                    },
                    {
                        name: '店铺装修',
                        children: [
                            {
                                name: '店铺装修',
                                path: '/storeManagement/storeRenovation'
                            }, {
                                name: '商品介绍模板',
                                path: '/storeManagement/productTemplate'
                            }, {
                                name: '运费设置模板',
                                path: '/storeManagement/freightSet'
                            }
                        ]
                    }
                ]
            },





            {
                name: '公司管理',
                menu: [
                    {
                        name: '公司管理',
                        children: [
                            {
                                name: '公司认证信息',
                                path: '/companyManagement/companyAuthInfo'
                            }
                        ]
                    },
                    {
                        name: '员工管理',
                        children: [
                            {
                                name: '员工账号管理',
                                path: '/companyManagement/staffAccountAdmin'
                            }
                        ]
                    },
                    {
                        name: '合同管理',
                        path: '/companyManagement/contractManagement'
                    }
                ]
            }













            ],
            tabs: [
                {
                    name: '首页',
                    path: '/personalCenter'
                },
                {
                    name: '店铺管理',
                    path: '/storeManagement/publishProduct'

                }, {
                    name: '公司管理',
                    path: '/companyManagement/companyAuthInfo'

                }
            ]
        }
    },
    methods: {
        nav(item) {
            if (!item.path) return;
            this.$router.push(item.path);
        },
    },
    computed: {
        active() {
            if (this.$route.path.indexOf('storeManagement') > -1) {
                return 1;
            } else if (this.$route.path.indexOf('personalCenter') > -1) {
                return 0;
            } else {
                return 2;
            }
        },
        getModule() {
            return this.pages[this.active];

        },
        breadcrumb() {
            let list = [{
                name: '个人中心',
                path: '/personalCenter'
            }];


            let nowPage;



            for (let i = 0; i < this.getModule.menu.length; i++) {
                const element = this.getModule.menu[i];
                const name = element.name;

                if (name == this.$route.path) {//如何当前菜单不是当前页，则跳出循环
                    nowPage = element;
                    break;
                }
                if (element.children) {


                    const result = element.children.findIndex((item) => item.path == this.$route.path);


                    if (result > -1) {
                        nowPage = element.children[result];
                        break;
                    }
                }

            }

            console.log(nowPage, 'nowPage');


            if (nowPage) {
                list.push({
                    name: nowPage.name
                })
            }
            return list;
        }
    }
}
</script>
<style scoped lang="less">
.bar {
    width: 260px;
    min-height: 660px;
    background-color: #fff;
}

.left {
    .leave1 {
        width: 100%;
        height: 50px;
        font-size: 16px;
        color: #0A1833;
        line-height: 24px;
        box-sizing: border-box;
        padding: 0 20px;
        cursor: pointer;
        margin-top: 10px;

        &.active {
            background: rgba(37, 127, 248, 0.1);
        }


    }

    .leave2 {

        width: 100%;
        height: 50px;
        font-size: 14px;
        color: #43546F;
        line-height: 24px;
        padding: 0 20px 0 40px;
        box-sizing: border-box;
        cursor: pointer;

        &.active {
            background: rgba(37, 127, 248, 0.1);
        }


    }

    .icon {
        width: 14px;
        height: 14px;
    }
}


.right {
    width: 1020px;
}
</style>