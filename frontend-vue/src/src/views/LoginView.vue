<template>
  <div class="login-page">
    <div class="login-box">
      <div class="logo">VapeBay</div>
      <h2>Login Admin</h2>

      <div v-if="error" class="error-msg">{{ error }}</div>

      <div class="form-group">
        <label>Email</label>
        <input v-model="form.email" type="email" placeholder="admin@vapebay.id" />
      </div>
      <div class="form-group">
        <label>Password</label>
        <input v-model="form.password" type="password" placeholder="••••••••" @keyup.enter="handleLogin" />
      </div>

      <button class="login-btn" :disabled="loading" @click="handleLogin">
        {{ loading ? 'Loading...' : 'Login' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth   = useAuthStore()

const form    = reactive({ email: '', password: '' })
const loading = ref(false)
const error   = ref(null)

async function handleLogin() {
  if (!form.email || !form.password) {
    error.value = 'Email dan password wajib diisi'
    return
  }
  loading.value = true
  error.value   = null
  try {
    await auth.login(form.email, form.password)
    router.push(auth.isAdmin ? '/admin' : '/')
  } catch (err) {
    error.value = err.response?.data?.error || 'Login gagal'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0a0a0a;
}
.login-box {
  background: #141414;
  border: 1px solid #2a2a2a;
  border-radius: 20px;
  padding: 48px 40px;
  width: 100%;
  max-width: 400px;
}
.logo { font-size: 2rem; font-weight: 700; color: #f32e4a; margin-bottom: 8px; }
h2 { color: white; margin-bottom: 32px; font-size: 1.1rem; }
.form-group { margin-bottom: 20px; }
.form-group label { display: block; color: #888; font-size: 0.85rem; margin-bottom: 8px; }
.form-group input {
  width: 100%;
  background: #0a0a0a;
  border: 1px solid #2a2a2a;
  color: white;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
}
.form-group input:focus { border-color: #f32e4a; }
.login-btn {
  width: 100%;
  background: #f32e4a;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 8px;
  transition: background 0.3s;
}
.login-btn:hover { background: #ff5570; }
.login-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.error-msg { background: rgba(243,46,74,0.1); border: 1px solid rgba(243,46,74,0.3); color: #f32e4a; padding: 12px; border-radius: 8px; margin-bottom: 20px; font-size: 0.9rem; }
</style>