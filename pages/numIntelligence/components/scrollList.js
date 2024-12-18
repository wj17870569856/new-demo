export default {
    // mounted(el, binding = { value: 45 }, vnode, prevVnode) {
      bind(el, binding=45,vnode) {
      
      const gap = 1000 / binding; // 帧数差距， 浏览器大概1s 60帧， 数字 > 60 效果应该一致，数字越小越慢
      if (window.requestAnimationFrame) {
        let isUsing = false; // 是否介入操作；介入操作时暂停动画；
  
        // 鼠标移出时，继续动画
        el.addEventListener(
          "mouseleave",
          () => {
            isUsing && scrollAnimation(); // 如果动画已暂停，重置动画
            isUsing = false;
          },
          { passive: true }
        );
  
        // 鼠标滚动时，继续动画
        el.addEventListener(
          "wheel",
          () => {
            isUsing = true;
          },
          { passive: true }
        );
  
        // 鼠标点击时， 暂停动画
        el.addEventListener(
          "click",
          () => {
            isUsing = true;
          },
          { passive: true }
        );
  
        // 动画方法
        const scrollAnimation = () => {
          if (window.requestAnimationFrame) {
            /**
             * @Author: Damon Liu
             * @Date: 2024-04-29 10:28:37
             * @LastEditors: Damon Liu
             * @LastEditTime:
             * @Description:
             * @param {*} timeStamp 当前时间戳
             * @param {*} preTimeStamp 上一帧时间戳
             * @param {*} diff  累计的时间差
             */
            let animationFun = (timeStamp, preTimeStamp = 0, diff = 0) => {
              if (isUsing) {
                return;
              }              
              let currentDiff = preTimeStamp === 0 ? 0 : timeStamp - preTimeStamp; // 当前时间差
              let n_diff = currentDiff + diff; // 总时间差
              // 当总时间差比小于帧数差距时，不执行动画，申请下一帧执行
              if (n_diff < gap) {
                window.requestAnimationFrame((_timeStamp) =>
                  animationFun(_timeStamp, timeStamp, n_diff)
                );
                return;
              }
              let scrollTop = el.scrollTop; // 滚动条顶部
              let clientHeight = el.clientHeight; // 内容高度
              let scrollHeight = el.scrollHeight; // 滚动内容高度
              // 当没有滚动至底部时
              if (scrollTop + clientHeight < (scrollHeight-5)) {
                el.scrollTop = scrollTop + 1;
                window.requestAnimationFrame((_timeStamp) =>
                  animationFun(_timeStamp, timeStamp, 0)
                );
              } else {
                el.scrollTop = 0;
             
                scrollAnimation();
              }
            };
            // 开始动画
            window.requestAnimationFrame(animationFun);
          }
        };
        scrollAnimation();
      } else {
      }
    },
  };
  