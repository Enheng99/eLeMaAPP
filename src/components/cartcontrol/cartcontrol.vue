<template>
  <div class="cartcontrol">
    <transition name="move">
      <div class="cart-decrease" v-show="food.count>0" @click.stop.prevent="decreaseCart">
        <span class="inner icon-remove_circle_outline"></span>
      </div>
    </transition>

    <div class="cart-count" v-show="food.count>0">{{ food.count }}</div>

    <!-- 加法 -->
    <div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>
  </div>
</template>

<script type="text/ecmascript-6">
import Vue from "vue";

export default {
  props: {
    food: {
      typr: Object
    }
  },
  methods: {
    addCart(event) {
      if (!event._constructed) {
        return;
      }
      if (!this.food.count) {
        Vue.set(this.food, "count", 1);
      } else {
        this.food.count++;
      }
      this.$emit("cart_add", event.target);
    },
    decreaseCart(event) {
      if (!event._constructed) {
        return;
      }
      if (this.food.count) {
        this.food.count--;
      }
    }
  }
};
</script>

<style lang='stylus' scoped rel ='stylesheet/stylus'>
.cartcontrol {
  font-size: 0;

  .cart-decrease {
    display: inline-block;
    padding: 6px;

    .inner {
      display: inline-block;
      font-size: 24px;
      line-height: 24px;
      color: rgb(0, 160, 220);
    }

    &.move-enter-active, &.move-leave-active {
      transition: all 0.5s linear;
      opacity: 1;
      transform: translate3d(0, 0, 0);

      .inner {
        transition: all 0.5s;
        opacity: 1;
        transform: rotate(0deg);
      }
    }

    &.move-enter, &.move-leave-active {
      opacity: 0;
      transform: translate3d(24px, 0, 0);

      .inner {
        opacity: 0;
        transform: rotate(180deg);
      }
    }
  }

  .cart-count {
    display: inline-block;
    vertical-align: top;
    width: 12px;
    padding-top: 6px;
    line-height: 24px;
    text-align: center;
    font-size: 10px;
    color: rgb(147, 153, 159);
  }

  .cart-add {
    display: inline-block;
    padding: 6px;
    line-height: 24px;
    font-size: 24px;
    color: rgb(0, 160, 220);
  }
}
</style>