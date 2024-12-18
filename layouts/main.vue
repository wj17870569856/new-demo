<template>
  <div>
    <nuxt />
  </div>
</template>
<script>
export default {
  name: "mainPage",
  mounted() {
    window._AMapSecurityConfig = {
      securityJsCode: "76d07dc7ab72cbe95ac658358acb6df5",
    };
  },
};
</script>
