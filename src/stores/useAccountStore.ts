import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export interface Label {
  text: string;
}

export interface Account {
  id: number;
  labels: Label[];
  type: 'LDAP' | 'Локальная';
  login: string;
  password: string | null;
}

export const useAccountStore = defineStore('account', () => {
  const accounts = ref<Account[]>(
    JSON.parse(localStorage.getItem('accounts') || '[]')
  );

  const addAccount = () => {
    accounts.value.push({
      id: Date.now(),
      labels: [],
      type: 'Локальная',
      login: '',
      password: '',
    });
  };

  const removeAccount = (id: number) => {
    accounts.value = accounts.value.filter(a => a.id !== id);
  };

  // Сохранение в LocalStorage при любом изменении
  watch(accounts, (val) => {
    localStorage.setItem('accounts', JSON.stringify(val));
  }, { deep: true });

  return { accounts, addAccount, removeAccount };
});
