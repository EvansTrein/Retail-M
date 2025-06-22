<template>
  <form class="form" @submit.prevent="onSubmit">
    <input type="date" v-model="startDateForm" required />
    <input type="date" v-model="endDateForm" required />
    <btn text="Apply" />
  </form>
</template>

<script setup lang="ts">
import btn from '../shared/button.vue';
import { useRateStore } from '../store';
import { ref } from 'vue';
import { convertLocaleStringToTimestamp, getRangeDates } from '../utils/utils';

const rateStore = useRateStore();

// const bitcoinDate: string = '2009-01-03';

const { startDate, endDate } = getRangeDates();

const startDateForm = ref<string>(startDate);
const endDateForm  = ref<string>(endDate);

const onSubmit = () => {
  const startTimestamp = convertLocaleStringToTimestamp(startDateForm.value);
  const endTimestamp = convertLocaleStringToTimestamp(endDateForm.value);

  console.log('Start timestamp:', startTimestamp);
  console.log('End timestamp:', endTimestamp);

  if (startTimestamp > endTimestamp) {
    alert('start date cannot be greater than end date');
    return;
  }

	rateStore.loadRangeData(startTimestamp, endTimestamp)

  // startDate.value = bitcoinDate;
  // endDate.value = currentDate;
};
</script>

<style scoped lang="scss">
@use '~/assets/styles/mixins' as m;
.form {
  display: flex;
  padding: 3px;
  justify-content: center;
  align-items: center;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: var(--border-radius-s);
  gap: 1rem;

  > input {
    background-color: transparent;
    color: white;
  }
}
</style>
