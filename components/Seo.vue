<template>
  <!-- 以下链接仅用于SEO -->
  <div style="display:none">
    <ul v-for="( sort, i ) in productSortList" :key="i">
      <li v-for="(sort2, j) in sort.children" :key="j">
        <a v-for="(sort3, k) in sort2.children" :key="k"
           :alt="sort3.name"
           :href="config.link_domain + '/productList?' + `sort1=${sort.id}&sort2=${sort2.id}&sort3=${sort3.id}`"
           target="_blank">
          {{ sort3.name }}
        </a>
      </li>
    </ul>
    <!-- 以上链接仅用于SEO -->
  </div>
</template>

<script>
/* eslint-disable */
import config from "~/config";
import Api from "~/plugins/api";
import axios from "axios";

export default {
  name: "SEO",
  props: {
    productSortList: {
      type: Array,
      default: [],
    },
    config: {
      type: Object,
      default: () => {
        return {}
      },
    }
  },
}
</script>

<style scoped>

</style>
