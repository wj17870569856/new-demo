/* eslint-disable */
import axios from "axios";
import Api from "~/plugins/api";
import config from "~/config";

export const state = () => ({
  token: "",
  category_list: [],
  userInfo: {
    realname: "",
    mobile: "",
    username: "",
    avatar: "",
    avatar_url: "",
    company_name: "",
    company_role: "", // 1采购商 2供应商
    member_level: "", // 1主账号 3子账号
    status: "",
    company_id: "",
    store_open: "", // 1是 2否
    // welfare_token:'',
    welfare_shop_id: "", //登录时根据 welfare_shop_id 是否为空，调用该接口实现同步登录商家后台
  },
  GoodsCartCount: 0,
  footNavMenuList: [], //脚导航
  productSortList: [], //产品分类列表
  tabNavMenuList: [], //tab导航按钮
  headNavMenuList: [], //头部导航按钮
  numTab:{}
});

export const getters = {
  getToken(state) {
    return state.token;
  },
};

export const mutations = {
  setToken(state, token) {
    state.token = token;
    if (!token) {
      state.userInfo = {};
    }
  },
  SET_CATE_LIST(state, data) {
    state.category_list = data.map((item) => {
      return {
        ...item,
        icon: config.imgUrl + item.icon,
      };
    });
  },
  setWelfareToken(state, welfare_token) {
    state.userInfo.welfare_token = welfare_token;
  },

  setUserInfo(state, userInfo) {
    state.userInfo = JSON.parse(userInfo);
    sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
  },

  setUserName(state, newName) {
    state.userInfo.realname = newName;
  },

  setGoodsCartCount(state, count) {
    state.GoodsCartCount = count;
  },

  setFootNavMenuList(state, footNavMenuList) {
    state.footNavMenuList = footNavMenuList;
  },

  setProductSortList(state, productSortList) {
    state.productSortList = productSortList;
  },

  setTabNavMenuList(state, tabNavMenuList) {
    state.tabNavMenuList = tabNavMenuList;
  },

  setHeadNavMenuList(state, headNavMenuList) {
    state.headNavMenuList = headNavMenuList;
  },

  updateNumTab(state, numTab) {
    state.numTab = numTab;
  },
};

export const actions = {
  async nuxtServerInit(store, context) {
    const { commit } = store;
    const { req } = context;
    if (req.headers.cookie) {
      const cookie = req.headers.cookie.split(";");

      cookie.forEach((item) => {
        if (item.indexOf("cloud_token=") >= 0) {
          const token = item.split("cloud_token=")[1];
          commit("setToken", token);
          axios
            .get(config.baseUrl + Api.getUserInfo, {
              headers: {
                Authorization: "Bearer " + token,
              },
            })
            .then((res) => {
              if (res.data.code === 0) {
                commit("setUserInfo", JSON.stringify(res.data.data));
              }
            });
        }

        // 福利商城token
        if (item.indexOf("welfare_token=") >= 0) {
          const welfare_token = item.split("welfare_token=")[1];
          commit("setWelfareToken", welfare_token);
        }

        // if (item.indexOf('userInfo=') >= 0) {
        //   const userInfo = item.split('userInfo=')[1]
        //   commit('setUserInfo', decodeURIComponent(userInfo))
        // }
      });
    } else {
      commit("setToken", "");
    }

    const footNavMenuListRes = await axios.get(
      config.baseUrl + Api.getSiteNavMenuList,
      { params: { type: 2 } }
    );
    if (footNavMenuListRes.data.code === 0) {
      commit("setFootNavMenuList", footNavMenuListRes.data.data);
    }

    const productSortListRes = await axios.get(config.baseUrl + Api.shopIndex);
    if (productSortListRes.data.code === 0) {
      commit("setProductSortList", productSortListRes.data.data.category_list);
    }

    const tabNavMenuListRes = await axios.get(
      config.baseUrl + Api.getSiteNavMenuList,
      { params: { type: 1 } }
    );
    if (tabNavMenuListRes.data.code === 0) {
      commit("setTabNavMenuList", tabNavMenuListRes.data.data);
    }

    const headNavMenuListRes = await axios.get(
      config.baseUrl + Api.getSiteNavMenuList,
      { params: { type: 2 } }
    );
    if (headNavMenuListRes.data.code === 0) {
      commit("setHeadNavMenuList", headNavMenuListRes.data.data);
    }

    return axios
      .all([
        axios.get(config.baseUrl + Api.getArticleCateList, {
          params: {
            pid: 16,
          },
        }),
      ])
      .then(
        axios.spread(function (res) {
          commit("SET_CATE_LIST", res.data.data.child);
        })
      );
  },
};
