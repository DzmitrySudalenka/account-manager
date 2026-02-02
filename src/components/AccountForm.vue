<script setup lang="ts">
import { useAccountStore, type Account } from '../stores/useAccountStore';
import { Delete, QuestionFilled } from '@element-plus/icons-vue';

const store = useAccountStore();

// Логика трансформации строки в массив объектов
const updateLabels = (account: Account, val: string) => {
  account.labels = val
    .split(';')
    .map(s => s.trim())
    .filter(s => s !== '')
    .map(s => ({ text: s }));
};

// Преобразование массива меток обратно в строку для Input
const labelsToString = (account: Account) => account.labels.map(l => l.text).join('; ');

// Валидация
const isInvalid = (val: string | null, max: number) => {
  if (!val || val.trim() === '') return true;
  if (val.length > max) return true;
  return false;
};
</script>

<template>
  <div class="container">
    <div class="header">
      <h2>Учетные записи</h2>
      <el-button type="primary" @click="store.addAccount">+</el-button>
    </div>

    <el-alert type="info" show-icon :closable="false" class="hint">
      <template #title>
        Для указания нескольких меток используйте точку с запятой ";"
      </template>
    </el-alert>

    <div v-for="account in store.accounts" :key="account.id" class="account-row">
      <!-- Метки -->
      <el-form-item label="Метка">
        <el-input 
          :model-value="labelsToString(account)"
          @input="(v: string) => updateLabels(account, v)"
          maxlength="50"
          placeholder="Метка 1; Метка 2"
        />
      </el-form-item>

      <!-- Тип записи -->
      <el-form-item label="Тип">
        <el-select v-model="account.type" @change="account.type === 'LDAP' ? account.password = null : null">
          <el-option label="LDAP" value="LDAP" />
          <el-option label="Локальная" value="Локальная" />
        </el-select>
      </el-form-item>

      <!-- Логин -->
      <el-form-item label="Логин">
        <el-input 
          v-model="account.login" 
          maxlength="100"
          :class="{ 'is-error': isInvalid(account.login, 100) }"
        />
      </el-form-item>

      <!-- Пароль (только для Локальная) -->
      <el-form-item v-if="account.type === 'Локальная'" label="Пароль">
        <el-input 
          v-model="account.password" 
          type="password"
          show-password
          maxlength="100"
          :class="{ 'is-error': isInvalid(account.password, 100) }"
        />
      </el-form-item>

      <el-button :icon="Delete" @click="store.removeAccount(account.id)" class="del-btn" />
    </div>
  </div>
</template>

<style scoped>
.container { padding: 20px; max-width: 1200px; }
.header { display: flex; align-items: center; gap: 20px; margin-bottom: 20px; }
.account-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)) 50px; gap: 15px; margin-bottom: 20px; align-items: end; }
.is-error :deep(.el-input__wrapper) { box-shadow: 0 0 0 1px red inset !important; }
.hint { margin-bottom: 20px; }
</style>