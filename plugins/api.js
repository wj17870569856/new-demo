export default {
  // 用户注册相关----start
  userMobileCode: '/user/mobileCode', // 发短信
  registerUser: '/register/user', // 用户注册
  selectAllRegion: '/register/selectAllRegion', // 选择三级地区
  selectCityRegion: '/city/selectAllRegion', // 选择地区
  uploadBusinessLicense: '/register/uploadBusinessLicense', // 上传营业执照
  registerCompany: '/register/company', // 公司注册
  registerCompanyInfo: '/register/companyInfo', // 获取注册公司信息
  loginByAccount: '/login/loginByAccount', // 用户账号登录
  loginByMobile: '/login/loginByMobile', // 用户手机登录
  loginCaptcha: '/login/captcha', // 图片验证码
  loginAuthentication: '/login/authentication', // 用户验证
  loginResetPassword: '/login/resetPassword', // 重置密码
  registerAgreement: '/register/agreement', // 注册协议
  checkAuthenticationSms: '/login/checkAuthenticationSms', // 验证短信验证码
  userEditRealName: 'user/editRealName', // 修改用户姓名
  userAuthenticationEditMobile: '/user/authenticationEditMobile', // 用户验证(修改手机)
  userCheckAuthenticationSms: '/user/checkAuthenticationSms', // 安全验证(修改手机)
  userEditMobile: '/user/editMobile', // 修改用户手机
  getUserInfo: '/user/getUserInfo', // 获取当前用户信息
  logout: "/user/logout",  // 登出
  // 用户注册相关----end

  // 授权登录----start
  getAuthUrl: '/login/getAuthUrl', // 获取授权跳转地址
  authUserLogin: '/login/authUserLogin', // 授权登录
  loginAuthBind: '/login/bind', // 用户授权绑定
  loginByToken: '/login/loginByToken', // token登录
  // 授权登录----end

  // 员工账号管理----start
  userStaffAddByMobile: '/user/staffAddByMobile', // 员工新增(根据手机号码)
  userStaffAdd: '/user/staffAdd', // 员工新增(账号密码)
  userStaffEdit: '/user/staffEdit', // 员工修改
  userStaffInfo: '/user/staffInfo', // 员工信息
  userStaffDelete: '/user/staffDelete', // 员工删除
  userStaffList: '/user/staffList', // 员工列表
  // 员工账号管理----end

  // 首页----start
  shopIndex: '/Index/index', // 首页数据
  indexProductList: '/goods/list', // 列表
  indexProductDetail: '/goods/detail', // 产品SKU详情页
  getGoodsSalesArea: '/goods/getSalesArea', // 详情页获取销售区域 ?goods_id=36692
  indexGetAreaProduct: '/index/getProduct', // 专区产品
  getRecommendGoodsList: '/index/getRecommendGoodsList', // 首页配置-获取推荐商品
  getProductAreaList: '/index/getProductAreaList', // 首页配置-获取产品专区
  getRecommendSearchWordList: '/index/getRecommendSearchWordList', // 首页配置-获取推荐搜索词
  getSiteNavMenuList: '/index/getSiteNavMenuList', // 首页配置-网站导航菜单  // 1pc顶部导航 2网站导航 3移动端菜单导航
  getLatestOrders: '/index/getLatestOrders',// 首页-最新交易
  // 首页----start
  // 买家中心-首页
  getOrderAction: '/order.Order/getOrderAction',
  setOrderActionRead: '/order.Order/setOrderActionRead',
  setOrderAllRead: '/order.Order/setAllRead', // 全部已读
  // 买家中心-首页

  // 卖家中心-首页
  getSupplierOrderAction: '/order.SupplierOrder/getOrderAction',
  setSupplierOrderActionRead: '/order.SupplierOrder/setOrderActionRead',
  setSupplierOrderAllRead: '/order.SupplierOrder/setAllRead', // 全部已读
  // 卖家中心-首页

  // 卖家中心-店铺管理----start
  selectGoodsCategory: '/common/selectGoodsCategory', // 获取商品分类
  getGoodsCategoryTree: '/common/getGoodsCategoryTree', // 获取商品分类
  getLevel3CategoryList: '/goods/getGoodsLevel3CategoryList', // 获取商品分类


  getCity: '/common/getCity', // 获取省市
  getSalesArea: '/common/getSalesArea', // 获取商品销售区域
  selectSelfCompany: '/common/selectSelfCompany', // 选择自营店铺
  selelctGoodsAttribute: '/common/selelctGoodsAttribute', // 获取商品属性
  selelctGoodsOtherAttribute: '/goods.Goods/getGoodsOtherAttr', // 获取商品其他属性
  getSKUStateSelect: '/common/getSKUStateSelect', // 下拉选
  goodsSave: '/goods.Goods/save', // 商品保存操作
  goodsRelease: '/goods.Goods/release', // 商品添加发布
  getGoodsLists: '/goods.Goods/getGoodsLists', // 商铺产品管理
  goodsBatchDelete: '/goods.Goods/batchDelete', // 批量删除
  goodsBatchIsOnSale: '/goods.Goods/batchIsOnSale', // 批量删除
  goodsGetDetailsInfo: '/goods.Goods/getDetailsInfo', // 获取商品详情
  goodsGetSKULists: '/goods.GoodsSKU/getSKULists', // SKU产品价格
  goodsSKUbatchIsOnSale: '/goods.GoodsSKU/batchIsOnSale', // SKU批量上下架
  goodsSKUgetDetailsInfo: '/goods.GoodsSKU/getDetailsInfo', // 获取SKU详情
  goodsSKUexportSKU: '/goods.GoodsSKU/exportSKU', // SKU导出
  searchGoods: '/common/searchGoods', // 搜索热销产品
  getCompanyMember: '/common/getCompanyMember', // 获取公司用户
  getRenovationInfo: '/shop.Renovation/getRenovationInfo', // 获取店铺装饰信息
  saveRenovation: '/shop.Renovation/saveRenovation', // 店铺装修保存
  saveGoodsBriefTpl: '/shop.Renovation/saveGoodsBriefTpl', // 商品介绍模板保存
  getGoodsBriefTpl: '/shop.Renovation/getGoodsBriefTpl', // 商品介绍模版信息
  goodsGoodsDownload: '/goods.Goods/download', // 商品导入模板下载
  goodsGoodsImport: '/goods.Goods/import', // 商品导入
  goodsGoodsSKUImport: '/goods.GoodsSKU/import', //
  goodsGoodsSKUDownload: '/goods.GoodsSKU/download', // SKU导入模版下载
  goodsSKUmodify: '/goods.GoodsSKU/modify', // SKU修改
  getOtherSkuPageList: '/goods/getOtherSkuPageList', // 同一商品下面的其他SKU分页列表
  getFreightTpl: '/order.FreightTpl/index', // 获取运费模板
  getFreightTplClear: '/order.FreightTpl/clear', // 全部清空
  getFreightTplEdit: '/order.FreightTpl/edit', // 获取运费模板
  // 卖家中心-店铺管理----end

  // 买家中心-供需大厅----start
  getUserSupplyOrderList: '/user/supplyOrderList', // 我发布的需求/供应信息 { type:1物资，2设备，3运力,information_type:1需求，2供应 }
  getUserSupplyOrderInfo: 'user/supplyOrderInfo', // 详情，校验登录
  supplyOrderEdit: '/user/supplyOrderEdit', // 添加编辑需求供应信息
  reloadSupplyOrder: '/user/reloadSupplyOrder', // 需求供应信息重新激活
  deleteSupplyOrder: '/user/deleteSupplyOrder', // 需求供应信息删除
  closeOrder: '/user/closeOrder', // 需求供应信息关闭
  getGoodsLevel3CategoryList: '/goods/getGoodsLevel3CategoryList', // 物资-下拉列表
  equipmentSelectList: '/SupplyOrder/equipmentSelectList', // 设备-下拉列表
  vehicleLengthSelectList: '/SupplyOrder/vehicleLengthSelectList', // 车长-下拉列表
  vehicleModelSelectList: '/SupplyOrder/vehicleModelSelectList', // 车型-下拉列表
  // 买家中心-供需大厅----end

  // 买家中心-公司管理----start
  getOrderAddress: '/order.OrderAddress/index', // 获取地址列表
  postOrderAddressEdit: '/order.OrderAddress/edit', // 新增编辑地址
  postOrderAddressDelete: '/order.OrderAddress/delete', // 删除地址
  getOrderInvoice: '/order.OrderInvoice/index', // 获取发票列表
  postOrderInvoiceEdit: '/order.OrderInvoice/edit', // 新增编辑发票
  postOrderInvoiceDelete: '/order.OrderInvoice/delete', // 删除发票
  // 买家中心-公司管理----end

  // 供需大厅---start
  getSupplyOrderList: '/SupplyOrder/list',
  getSupplyOrderInfo: '/SupplyOrder/info', // 查看供需详情,不校验登录
  getSupplyOrderCategorys: 'SupplyOrder/orderCategorys', // ?type=1&information_type=1
  addSupplyOrderLog: '/SupplyOrderLog/add', // 记录用户行为日志
  getSupplyOrderLogList: '/SupplyOrderLog/index',//
  // 供需大厅---end

  // 资源直供-列表页----start
  getDirectiveLists: '/company/list',
  getCompanyInfo: '/company/detail',
  getProductList: '/company/products',
  getIntroduce: '/company/introduce',
  getShopGoodsLists: '/search/getShopGoodsLists',// ?shop_id=2&keyword=槽钢
  // 资源直供-列表页----end

  // 快速下单---start
  // simpleOrdersSave: '/SimpleOrders/save',
  simpleOrdersSave: '/User/inquiryOrder',
  // 快速下单---end


  // 采购单接口---start
  addGoodsCart: '/order.GoodsCart/add',// 加购按钮
  plusGoodsCart: '/order.GoodsCart/plus', //
  minusGoodsCart: '/order.GoodsCart/minus', //
  setNumber: '/order.GoodsCart/setNumber', // 修改购物车数量接口
  deleteGoodsCart: '/order.GoodsCart/delete', //
  getGoodsCart: '/order.GoodsCart/index', // 获取采购单详情
  getGoodsCartCount: '/order.GoodsCart/getCount', // 获取采购单产品数量
  clearGoodsCartCount: '/order.GoodsCart/clear', // 清空失效商品
  postPreOrder: '/order.GoodsCart/getPreOrder', // 获取预订单
  postDoOrder: '/order.GoodsCart/doOrder', // 生成订单
  exportGoodsCart: 'order.GoodsCart/export', // 导出采购单
  // 采购单接口----end

  /** 买家大宗商品订单接口----start ************************* */
  getOrderList: '/order.Order/index', // 商品订单列表接口
  getOrderInfo: '/order.Order/info', // 商品订单详情接口
  cancelOrder: '/order.Order/cancel', // 取消订单
  payVoucher: '/order.Order/payVoucher', // 上传支付凭证
  delPayVoucher: '/order.Order/delPayVoucher', // 删除支付凭证
  viewPayVoucher: 'order.Order/viewPayVoucher',// 查看支付凭证?order_id=49&voucher_id=16
  viewShipping: 'order.Order/viewShipping', // 查看物流凭证 ?order_id=49&shipping_id=1
  confirmOrder: 'order.Order/confirmOrder', // 买家确认订单
  confirmShipping: 'order.Order/confirmShipping', // 订单确认收货
  editBuyer: '/order.Order/editBuyer', //
  editInvoice: '/order.Order/editInvoice', //
  getBankCardList: '/order.Order/bank', //
  getOrderStatusCount: '/order.Order/getStatusCount',
  /** 买家大宗商品订单接口----end************************* */

  /** 卖家大宗商品订单接口----start ************************* */
  getSupplierOrderList: '/order.SupplierOrder/index', // 商品订单列表接口
  getSupplierOrderInfo: '/order.SupplierOrder/info', // 商品订单详情接口
  confirmSupplierOrder: '/order.SupplierOrder/confirm', // 确认订单
  cancelSupplierOrder: '/order.SupplierOrder/cancel', // 取消订单
  SupplierOrderDoShipping: '/order.SupplierOrder/doShipping', // 上传，修改发货凭证
  delShipping: '/order.SupplierOrder/delShipping',// 删除发货凭证
  shippingFinished: '/order.SupplierOrder/shippingFinished', // 发货完成按钮
  viewSupplierOrderShipping: '/order.SupplierOrder/viewShipping', // ?order_id=80&shipping_id=5 查看发货凭证
  viewSupplierOrderPayVoucher: '/order.SupplierOrder/viewPayVoucher', // ?order_id=80&voucher_id=17 查看支付凭证
  editSupplier: '/order.SupplierOrder/editSupplier', // 编辑供应商信息
  getCostTypeList: '/order.SupplierOrder/costTypeList', // 获取费用列表
  getSupplierOrderStatusCount: '/order.SupplierOrder/getStatusCount',
  /** 卖家大宗商品订单接口----end************************* */

  /** *************************数据中心接口*********************************** */
  getDataCenter: '/index/dataCenter',
  getPlatformStatistics: '/index/getPlatformStatistics',
  setClickNum: '/index/setClickNum',
  /** ******************** 搜索接口 ******************************* */
  searchGetGoodsLists: '/search/getGoodsLists',
  searchGetCompanyLists: '/search/getShop',

  /** ******************** 收藏接口 ******************************* */
  addGoodsCollect: '/goods/collect', // 添加商品收藏
  cancelGoodsCollect: '/goods/cancelCollect', // 取消商品收藏
  addCompanyCollect: '/company/collect', // 添加店铺收藏
  cancelCompanyCollect: '/company/cancelCollect', // 取消店铺收藏
  getGoodsCollectLists: '/goods/getCollectLists', // 收藏商品列表
  getCompanyCollectLists: '/company/getCollectLists', // 收藏店铺列表
  viewIsCollect: '/goods/viewIsCollect', // 查看是否已收藏

  // 通用接口
  uploadFile: '/Upload/uploadFile',
  uploadImage: '/Upload/uploadImage', // 图片上传
  // 广告接口
  getAd: '/Ad/index',

  // 文章列表
  getIndexArticleList: '/article/getIndexList', // 获取首页公告列表
  getArticleListByTag: '/article/getArticleListByTag',// ?tag=help&limit=6
  getArticleDetail: '/article/getDetail', // 查看文章内容
  getArticleCateList: '/article/getCateList', //
  getArticleList: '/article/getArticleList', // 获取公告列表
  getOtherCateAriticleList: '/article/getOtherCateAriticleList',// 右边导航获取其它分类文章列表


  /* ************************ 福利商城登录接口 ******************************** */
  LoginWelfareShop: '/login/welfareLoginShop',
  LogoutWelfareShop: '/api/account/logout',
  saveCompanyInfo: '/company/save',

  
    /* ************************ 账户银行相关接口 ******************************** */
    getBankList: '/bank/list',
    saveBankInfo: '/bank/save',
    getBankInfo:'/bank/info',
    deleteBankInfo:'/bank/delete',

    /* ************************ 在线支付接口 ******************************** */
    getPayWay: '/order.Order/getPayWay', // 支付方式接口
    getUnifiedPay: '/pay/unifiedpay', // 统一支付接口
    getPayStatus: '/order.Order/getPayStatus', // 支付状态接口


    /* ************************ 订单结算接口 ******************************** */
    getSettlement: '/settlement/index', // 搜索卖家待结算的订单.
    getSettlementCount: '/settlement/count', // 搜索卖家待结算的订单
    settlementSubmit: '/settlement/submit', // 搜索卖家待结算的订单,
    settlementOrder: '/settlement/order', // 已结算订单
    settlementLists: '/settlement/lists', // 已结算订单
    settlementInfo: '/settlement/info', // 结算详情

    getSKULists: '/goods.GoodsSKU/getSKULists', // 搜索选择关联产品接口
    updatePhoto: '/user/avatar', // 搜索选择关联产品接口

  /* ************************ 需求单 ******************************** */
  addPrice: '/user/addprice', // 需求单-提交报价
  getUserQuoteList: '/user/prices', //需求单-报价记录列表
  getReqOrderInfo: '/user/reqorderinfo', //需求单-报价记录列表
  setWinPrice: '/user/winprice', //需求单-报价记录列表
  unselectprice: '/user/unselectprice', //需求单-报价记录列表
  getPreOrder: '/user/getPreOrder', //需求单-报价记录列表
  callbackorder: '/user/callbackorder', //需求单-下单成功回调接口
  getMyPrices: '/user/myprices', //需求单-下单成功回调接口.




    /* ************************ 退货售后 ******************************** */
    afterSalePreOrder: '/order.afterSale/preOrder', // 需求单-提交报价
    afterSaleSubmit: '/order.afterSale/submit', // 需求单-提交报价



    
    /* ************************ 合同管理 ******************************** */
    contractList: '/contract/list', // 列表
    contractDelete: '/contract/delete', // 删除
    contractSave: '/contract/save', // 新增编辑




      /* ************************ 产业大脑数智 ******************************** */
      industryList: '/industry/categorys', // 列表 
      industryPage: '/industry/articlePage', // 列表
      industryGetails: '/industry/article', // 详情
      getOptionsNew:'/industry/options',
      getcompanymap:'/industry/companymap',//优质企业名单
      getCompCount:'/industrygpt.company/getCompCount',//全国专精特新企业分布数据
      getPatentmap:'/industry/patentmap',
      orgmap:'/industry/orgmap',//创新技术载体
      talentmap:'/industry/talentmap',//人才聚集发展

     

}
