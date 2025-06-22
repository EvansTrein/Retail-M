<template>
  <div class="chart">
    <Bar v-if="chartData" :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { useRateStore } from '../store';
import { convertTimestampToLocaleString } from '../utils/utils';
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
} from 'chart.js';

const rateStore = useRateStore();

onMounted(() => {
  if (rateStore.data.length === 0) {
    rateStore.loadData('day');
  }
});

ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement);

const chartOptions = computed(() => {
  const prices = rateStore.data.map((item) => item.price);

  return {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: false,
        },
        ticks: {
          display: false,
        },
        grid: {
          display: false,
        },
      },
      y: {
        title: {
          display: false,
        },
        beginAtZero: false,
        min: Math.min(...prices),
        max: Math.max(...prices),
        ticks: {
          color: '#ffff',
          font: {
            size: 15,
          },
        },
        grid: {
          display: true,
          lineWidth: 3,
          color: '#5f5f5f',
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#ffff',
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'grey',
        bodyColor: '#000',
        titleColor: '#000',
				bodyFont: {
					size: 15,
				},
				titleFont: {
					size: 15,
				},
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            const timestamp = context.chart.data.labels[context.dataIndex];
            return `${label}: ${value.toLocaleString()} (${timestamp})`;
          },
        },
      },
    },
  };
});

const chartData = computed(() => {
  if (!rateStore.data.length) return null;

  const labels = rateStore.data.map((item) => convertTimestampToLocaleString(item.timestamp));
  const prices = rateStore.data.map((item) => item.price);

  return {
    labels,
    datasets: [
      {
        label: 'Bitcoin / USD',
        data: prices,
        borderColor: 'rgb(3, 87, 165)',
        backgroundColor: 'rgb(3, 87, 165, 0.2)',
        borderWidth: 3,
        hoverBorderColor: '#fff',
      },
    ],
  };
});
</script>

<style scoped lang="scss">
.chart {
  height: 500px;
}
</style>
