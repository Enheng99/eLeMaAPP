<template>
  <div class="shopcart">
    <transition name="fade" tag="div">
      <div class="list-mask" v-show="listShow" @click="hideList"></div>
    </transition>
    <div class="content" @click="toggleList">
      <div class="content-left">
        <div class="logo-wrapper">
          <div class="logo" :class="{'highlight':totalCount>0}">
            <i class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></i>
          </div>
          <div class="num" v-show="totalCount>0">{{ totalCount }}</div>
        </div>
        <div class="price" :class="{'highlight':totalPrice>0}">￥{{ totalPrice }}元</div>
        <div class="desc">另需配送费￥{{ deliveryPrice }}元</div>
      </div>
      <div class="content-right" @click.stop.prevent="pay">
        <div class="pay" :class="payClass">{{ payDesc }}</div>
      </div>
    </div>

    <div class="ball-container">
      <transition-group
        name="fold"
        tag="div"
        v-on:before-enter="beforeEnter"
        v-on:enter="enter"
        v-on:after-enter="afterEnter"
      >
        <div class="ball" v-for="ball in balls" v-show="ball.show" :key="ball.index">
          <div class="inner inner-hook"></div>
        </div>
      </transition-group>
    </div>

    <!-- 购物车列表 -->
    <transition name="fold">
      <div class="shopcart-list" v-show="listShow">
        <div class="list-header">
          <h1 class="title">购物车</h1>
          <span class="empty" @click="empty">清空</span>
        </div>
        <div class="list-content" ref="listContent">
          <ul>
            <li class="food" v-for="food in selectFoods">
              <span class="name">{{ food.name }}</span>
              <div class="price">
                <span>￥{{ food.price * food.count }}</span>
              </div>
              <div class="cartcontrol-wrapper">
                <cartcontrol :food="food"></cartcontrol>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>
    <!-- /购物车列表 -->
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from "better-scroll";
import cartcontrol from "../../components/cartcontrol/cartcontrol";

export default {
  props: {
    //获得加入购物车的商品的数量以及单价
    selectFoods: {
      typr: Array,
      default() {
        return [{ price: 10, count: 3 }];
      }
    },

    deliveryPrice: {
      type: Number,
      default: 0
    },
    minPrice: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      balls: [
        { show: false, index: 0 },
        { show: false, index: 1 },
        { show: false, index: 2 },
        { show: false, index: 3 },
        { show: false, index: 4 }
      ],
      dropBalls: [], // //添加一个变量，用来存贮已经下落的小球
      fold: true ////购物车详情列表默认折叠
    };
  },
  computed: {
    totalPrice() {
      let total = 0;
      this.selectFoods.forEach(food => {
        total += food.price * food.count;
      });
      return total;
    },
    //获得加入购物车的商品总和
    totalCount() {
      let count = 0;
      this.selectFoods.forEach(food => {
        count += food.count;
      });
      return count;
    },
    payDesc() {
      if (this.totalPrice === 0) {
        return "￥" + this.minPrice + "元";
      } else if (this.totalPrice < this.minPrice) {
        let diff = this.minPrice - this.totalPrice;
        return `还差￥${diff}元起送`;
        // return "还差￥" + diff + "元起送";
      } else {
        return "去结算";
      }
    },
    payClass() {
      if (this.totalPrice < this.minPrice) {
        return "not-enough";
      } else {
        return "enough";
      }
    },
    listShow() {
      if (!this.totalCount) {
        this.fold = true;
        return false; //不做切换
      }
      let show = !this.fold;
      if (show) {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.listContent, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      }
      return show;
    }
  },
  methods: {
    drop(el) {
      // console.log(el);
      for (let i = 0; i < this.balls.length; i++) {
        let ball = this.balls[i];
        if (!ball.show) {
          ball.show = true;
          ball.el = el;
          this.dropBalls.push(ball);
          return;
        }
      }
    }, //将所有设置为true的小球均找到
    beforeEnter(el) {
      let count = this.balls.length;
      while (count--) {
        let ball = this.balls[count];
        if (ball.show === true) {
          //cartcontrol组件的加号DOM对象相对视窗的距离
          let rect = ball.el.getBoundingClientRect();
          let x = rect.left - 32;
          let y = -(window.innerHeight - rect.top - 22);
          el.style.display = "";
          //小球纵轴做动画
          el.style.webkitTransform = `translate3d(0,${y}px,0)`;
          el.style.transform = `translate3d(0,${y}px,0)`;
          //小球横轴做动画 向左平移
          let inner = el.getElementsByClassName("inner-hook")[0];
          inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
          inner.style.transform = `translate3d(${x}px,0,0)`;
        }
      }
    },
    //当小球动画完成时，应该有的状态
    enter(el) {
      //触发浏览器重绘
      /* eslint-disable no-unused-vars */
      let rf = el.offsetHeight;
      this.$nextTick(() => {
        el.style.webkitTransform = "translate3d(0, 0, 0)";
        el.style.transform = "translate3d(0, 0, 0)";
        let inner = el.getElementsByClassName("inner-hook")[0];
        inner.style.webkitTransform = "translate3d(0, 0, 0)";
        inner.style.transform = "translate3d(0, 0, 0)";
      });
    },
    // 动画做完时，应将show设置为false
    afterEnter(el) {
      let ball = this.dropBalls.shift();
      if (ball) {
        ball.show = false;
        el.style.display = "none";
      }
    },
    toggleList() {
      if (!this.totalCount) {
        //购物车没有商品的时候不可点击
        return;
      }
      this.fold = !this.fold; //当前是收起状态就展开，展开状态就收起
    },
    // 清空购物车
    empty() {
      //遍历food，将food的count都置零
      this.selectFoods.forEach(food => {
        food.count = 0;
      });
    },
    // 用于遮盖
    hideList() {
      this.fold = true; //点击mark层，购物车详情列表被收回
    },
    // 结算
    pay() {
      if (this.totalPrice < this.minPrice) {
        return;
      }
      window.alert("支付" + this.totalPrice + "元");
    }
  },
  //注册cartcontrol
  components: {
    cartcontrol
  }
};
</script>

<style lang='stylus' scoped rel ='stylesheet/stylus'>
@import '../../common/stylus/mixin';

.shopcart {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 50;
  width: 100%;
  height: 48px;

  .list-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 40;
    backdrop-filter: blur(10px); // 模糊效果
    -webkit-backdrop-filter: blur(10px);
    opacity: 1;
    background: rgba(7, 17, 27, 0.6);

    &.fade-enter-active, &.fade-leave-active {
      opacity: 1;
      transition: all 0.5s; // 设置缓动效果
      background: rgba(7, 17, 27, 0.6);
    }

    &.fade-enter, &.fade-leave-active {
      opacity: 0;
      background: rgba(7, 17, 27, 0);
    }
  }

  .content {
    display: flex;
    background: #141d27;
    font-size: 0;
    color: rgba(255, 255, 255, 0.4);

    .content-left {
      flex: 1;

      .logo-wrapper {
        display: inline-block;
        vertical-align: top;
        position: relative;
        top: -10px;
        margin: 0 12px;
        padding: 6px;
        width: 56px;
        height: 56px;
        box-sizing: border-box;
        border-radius: 50%;
        background: #141d27;

        .logo {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          text-align: center;
          background: #2b343c;

          &.highlight {
            background: rgb(0, 160, 220);
          }

          .icon-shopping_cart {
            line-height: 44px;
            font-size: 24px;
            color: #80858a;

            &.highlight {
              color: rgb(255, 255, 255);
            }
          }
        }

        .num {
          position: absolute;
          top: 0;
          right: 0;
          width: 24px;
          height: 16px;
          line-height: 16px;
          text-align: center;
          border-radius: 16px;
          font-size: 9px;
          font-weight: 700;
          color: #ffffff;
          background: rgb(240, 20, 20);
          box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
        }
      }

      .price {
        display: inline-block;
        vertical-align: top;
        margin-top: 12px;
        line-height: 24px;
        padding-right: 12px;
        box-sizing: border-box;
        border-right: 1px solid rgba(255, 255, 255, 0.1);
        font-size: 16px;
        font-weight: 700;

        &.highlight {
          color: rgb(255, 255, 255);
        }
      }

      .desc {
        display: inline-block;
        vertical-align: top;
        margin: 12px 0 0 12px;
        line-height: 24px;
        font-size: 10px;
      }
    }

    .content-right {
      flex: 0 0 105px;
      width: 105px;

      .pay {
        height: 48px;
        line-height: 48px;
        text-align: center;
        font-size: 12px;
        font-weight: 700;
        background: #2b333b;

        &.not-enough {
          background: #2b333b;
        }

        &.enough {
          background: #00b43c;
          color: #ffffff;
        }
      }
    }
  }

  .ball-container {
    .ball {
      position: fixed;
      left: 32px;
      bottom: 22px;
      z-index: 200;

      &.fold-enter-active {
        transition: all 1s cubic-bezier(0.49, -0.29, 0.75, 0.41);

        .inner {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: rgb(0, 160, 220);
          transition: all 1s linear;
        }
      }
    }
  }

  // 购物车列表
  .shopcart-list {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 50;
    width: 100%;
    transform: translate3d(0, -100%, 0); // 整个列表相对于当前自身的高度做一个偏移

    &.fold-enter-active, &.fold-leave-active {
      transition: all 0.5s linear;
      transform: translate3d(0, -100%, 0); // 每个表项相对于当前自身的高度做一个偏移
    }

    &.fold-enter, &.fold-leave-active {
      transform: translate3d(0, 0, 0);
    }

    .list-header {
      height: 40px;
      line-height: 40px;
      padding: 0 18px;
      background: #f3f5f7;
      border-bottom: 1px solid rgba(7, 17, 27, 0.1);

      .title {
        float: left;
        font-size: 14px;
        color: rgb(7, 17, 27);
      }

      .empty {
        float: right;
        font-size: 12px;
        color: rgb(0, 160, 220);
      }
    }

    .list-content {
      padding: 0 18px;
      max-height: 217px;
      overflow: hidden; // 用于隐藏
      background: #ffffff;

      .food {
        position: relative;
        padding: 12px 0;
        box-sizing: border-box;
        border-1px(rgba(7, 17, 27, 0.1));

        .name {
          line-height: 24px;
          font-size: 14px;
          color: rgb(7, 17, 27);
        }

        .price {
          position: absolute;
          right: 90px;
          bottom: 12px;
          line-height: 24px;
          font-size: 14px;
          font-weight: 700;
          color: rgb(240, 20, 20);
        }

        .cartcontrol-wrapper {
          position: absolute;
          right: 0;
          bottom: 6px;
        }
      }
    }
  }
}
</style>