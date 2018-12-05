<template>
    <div>
        <div class="marquee" :class="'marquee-bg-'+name"></div>
        <div class="marquee" :class="'marquee-mask-'+name"></div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            name: ''
        }
    }
}
</script>

<style lang="scss">
// 没有好的办法通过vue传值过来，所以只能预设scss变量来处理了
// 乐享一
$lx1-bg: "~@/assets/img/double12/lx1.bg.png";
$lx1-bg1: "~@/assets/img/double12/lx1.bg.1.png";
$lx1-bg2: "~@/assets/img/double12/lx1.bg.2.png";
$lx1-bg3: "~@/assets/img/double12/lx1.bg.3.png";
// 乐享二
$lx2-bg: "~@/assets/img/double12/lx2.bg.png";
$lx2-bg1: "~@/assets/img/double12/lx2.bg.1.png";
$lx2-bg2: "~@/assets/img/double12/lx2.bg.2.png";
$lx2-bg3: "~@/assets/img/double12/lx2.bg.3.png";
// 乐享三
$lx3-bg: "~@/assets/img/double12/lx3.bg.png";
$lx3-bg1: "~@/assets/img/double12/lx3.bg.1.png";
$lx3-bg2: "~@/assets/img/double12/lx3.bg.2.png";
$lx3-bg3: "~@/assets/img/double12/lx3.bg.3.png";
// 乐享四
$lx4-bg: "~@/assets/img/double12/lx4.bg.png";
$lx4-bg1: "~@/assets/img/double12/lx4.bg.1.png";
$lx4-bg2: "~@/assets/img/double12/lx4.bg.2.png";
$lx4-bg3: "~@/assets/img/double12/lx4.bg.3.png";
@mixin marquee($name, $bg, $bg1, $bg2, $bg3) {
  @keyframes marquee-#{$name} {
    from,
    50%,
    to {
      animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    }
    0% {
      background: url($bg1) top center no-repeat;
    }
    50% {
      background: url($bg2) top center no-repeat;
    }
    to {
      background: url($bg3) top center no-repeat;
    }
  }
  .marquee-bg-#{$name} {
    background: url($bg) top center no-repeat;
    z-index: 0;
  }
  .marquee-mask-#{$name} {
    animation: marquee-#{$name} 2s infinite;
    z-index: 1;
  }
}

.marquee {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
@include marquee("lx1", $lx1-bg, $lx1-bg1, $lx1-bg2, $lx1-bg3);
@include marquee("lx2", $lx2-bg, $lx2-bg1, $lx2-bg2, $lx2-bg3);
@include marquee("lx3", $lx3-bg, $lx3-bg1, $lx3-bg2, $lx3-bg3);
@include marquee("lx4", $lx4-bg, $lx4-bg1, $lx4-bg2, $lx4-bg3);
</style>
