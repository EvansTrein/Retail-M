<template>
  <main class="main__wrap">
    <Chart />
    <nav class="main__nav">
      <div class="main__nav-btns">
        <btn
          class="main__nav-btns-item"
          :class="{ 'main__nav-btns_active': activeBtn === 'Day' }"
          text="Day"
          @click="setActiveBtn('Day')"
        />
        <btn
          class="main__nav-btns-item"
          :class="{ 'main__nav-btns_active': activeBtn === 'Week' }"
          text="Week"
          @click="setActiveBtn('Week')"
        />
        <btn
          class="main__nav-btns-item"
          :class="{ 'main__nav-btns_active': activeBtn === 'Month' }"
          text="Month"
          @click="setActiveBtn('Month')"
        />
        <btn
          class="main__nav-btns-item"
          :class="{ 'main__nav-btns_active': activeBtn === 'Year' }"
          text="Year"
          @click="setActiveBtn('Year')"
        />
      </div>
      <period />
    </nav>
    <loader class="main__loader" v-if="rateStore.isLoad" />
  </main>
</template>

<script setup lang="ts">
import btn from '../shared/button.vue';
import period from '../shared/period.vue';
import loader from '../shared/loader.vue';
import { useRateStore } from '../store';

const rateStore = useRateStore();

const activeBtn = ref<string>('Day');

const setActiveBtn = (btnName: string) => {
  rateStore.loadData(btnName.toLowerCase());
  activeBtn.value = btnName;
};
</script>

<style lang="scss">
@use '~/assets/styles/vars' as v;
@use '~/assets/styles/mixins' as m;

.main__wrap {
  position: relative;
  height: 100vh;
  @include m.center80w;
  // @include m.debug1;
}

.main__nav {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;

  @media (max-width: v.$xlBrp) {
    flex-direction: column;
  }

  &-btns {
    display: flex;
    gap: 2rem;

    &-item {
      border: 2px solid rgb(75, 75, 75);
    }

    &_active {
      border: 2px solid white !important;
    }
  }
}

.main__loader {
  position: absolute;
  z-index: 10;
  top: -50%;
  margin: 0 auto;
  transform: translate(-50%, -50%);
  // @include m.debug;
}
</style>
