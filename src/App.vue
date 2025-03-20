<script setup>
import { ref } from "vue";
import { calculateBaZi } from "./utils/bazi";

const selectedDate = ref("");
const result = ref({});

const onSubmit = (e) => {
  e.preventDefault();
  if (selectedDate.value) {
    result.value = calculateBaZi(selectedDate.value);
  }
};

// 计算当前时刻的八字
const now = new Date();
const currentBazi = calculateBaZi(now);
</script>

<template>
  <div class="container">
    <h2>八字计算</h2>
    <div class="current-bazi">
      <h3>当前时刻八字</h3>
      <div class="bazi-result">
        <div class="pillar">
          <span class="label">年柱</span>
          <span class="value">{{ currentBazi.年柱 }}</span>
        </div>
        <div class="pillar">
          <span class="label">月柱</span>
          <span class="value">{{ currentBazi.月柱 }}</span>
        </div>
        <div class="pillar">
          <span class="label">日柱</span>
          <span class="value">{{ currentBazi.日柱 }}</span>
        </div>
        <div class="pillar">
          <span class="label">时柱</span>
          <span class="value">{{ currentBazi.时柱 }}</span>
        </div>
      </div>
    </div>

    <div class="calculator">
      <h3>选择日期时间计算八字</h3>
      <form @submit="onSubmit">
        <input v-model="selectedDate" type="datetime-local" />
        <button type="submit">计算八字</button>
      </form>
      <div v-if="Object.keys(result).length" class="bazi-result">
        <div class="pillar">
          <span class="label">年柱</span>
          <span class="value">{{ result.年柱 }}</span>
        </div>
        <div class="pillar">
          <span class="label">月柱</span>
          <span class="value">{{ result.月柱 }}</span>
        </div>
        <div class="pillar">
          <span class="label">日柱</span>
          <span class="value">{{ result.日柱 }}</span>
        </div>
        <div class="pillar">
          <span class="label">时柱</span>
          <span class="value">{{ result.时柱 }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h2, h3 {
  color: #333;
  text-align: center;
}

.current-bazi, .calculator {
  margin: 20px 0;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.bazi-result {
  display: flex;
  justify-content: space-around;
  margin: 20px 0;
}

.pillar {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 4px;
  min-width: 80px;
}

.label {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.value {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

form {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin: 20px 0;
}

input[type="datetime-local"] {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>
