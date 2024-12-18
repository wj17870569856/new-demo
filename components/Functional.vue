<template>
    <div class="comp">
        <div class="item col-center" @click="nav(item)" v-for="(item, index) in list" :key="index" @mouseenter="item.active = 1"
            @mouseleave="item.active = 0"
            :style="{ 'background-image': 'url(' + (item.active == '0' ? item.img : item.img_active) + ')' }">
            <span class="text">{{ item.text }}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'functionalComp',
    props: {
        show: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        list() {
            return this.originList.filter((item) => {
                return this.show.indexOf(item.text) > -1;
            })

        },
    },
    data() {
        return {
            originList: [
                {
                    img: require('../assets/imgs/icon_supply.png'),
                    img_active: require('../assets/imgs/icon_supply-active.png'),
                    text: '我的供应',
                    active: 0,
                    path:'/personalCenter/mysupply'
                },
                {
                    img: require('../assets/imgs/icon_demand.png'),
                    img_active: require('../assets/imgs/icon_demand-active.png'),
                    text: '我的需求',
                    active: 0,
                      path:'/personalCenter/mydemand'
                },
                {
                    img: require('../assets/imgs/icon_cart.png'),
                    img_active: require('../assets/imgs/icon_cart-active.png'),
                    text: '购物车',
                    active: 0,
                    path:'/purchaseorder'
                },
                {
                    img: require('../assets/imgs/icon_order.png'),
                    img_active: require('../assets/imgs/icon_order-active.png'),
                    text: '我的订单',
                    active: 0,
                       path:'/personalCenter/sellerList'
                },
                {
                    img: require('../assets/imgs/icon_product.png'),
                    img_active: require('../assets/imgs/icon_product-active.png'),
                    text: '我的产品',
                    active: 0,
                    path:'/storeManagement/productStore'
                }
            ]
        }
    },
    methods: {
        nav (item) {
            this.$router.push(item.path)
        }
    }
}
</script>

<style scoped lang="less">
.comp {
    position: fixed;
    right: 20px;
    bottom: 20vh;

    .item {
        width: 80px;
        cursor: pointer;
        height: 80px;
        background-color: #fff;
        flex-direction: column;
        box-sizing: border-box;
        background-size: 32px 32px;
        background-repeat: no-repeat;
        background-position: center 10px;
        padding-top: 46px;

        &:hover {
            background-color: #257FF8;

            .text {
                color: #fff;
            }
        }

        .text {
            font-size: 16px;
            color: #0A1833;
            line-height: 19px;
            margin-top: 4px;
        }
    }
}
</style>