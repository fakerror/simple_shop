<script setup lang="ts">
import { onMounted, ref, computed, h } from 'vue';
import {
  ElScrollbar,
  ElCard,
  ElButton,
  ElTabs,
  ElTabPane,
  ElNotification,
  ElDialog,
  ElAffix,
  ElLink,
  ElSpace,
  ElDescriptions,
  ElDescriptionsItem,
  ElInputNumber,
  ElInput,
  ElLoading
} from 'element-plus';
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/display.css'
import * as _axios from 'axios';

let axios = _axios.default.create();
// Add a request interceptor
axios.interceptors.request.use(
  config => {
    // Do something before request is sent
    return config;
  },
  error => {
    // Do something with request error
    if (error) {
      handle_respose_error(error)
    }
    return Promise.reject(error);
  });
// Add a response interceptor
axios.interceptors.response.use(
  response => {
    // status code 2xx
    return response;
  },
  error => {
    // status code not 2xx
    if (error) {
      handle_respose_error(error)
    }
    return Promise.reject(error);
  }
);

function handle_respose_error(e: any) {
  let log = ''
  let logs = []
  if (e.response) {
    // 错误发生在服务器返回HTTP信息后 只不过错误代码不为2xx
    log += 'HTTP Status: ' + e.response.status + '\n'
    log += 'Data: ' + JSON.stringify(e.response.data) + '\n'
    console.log(log)

    logs.push('HTTP Status: ' + e.response.status)
    logs.push('Data: ' + JSON.stringify(e.response.data))
  } else if (e.request) {
    // 错误发生在request阶段 此时并无respone
    // `e.request` 在浏览器中为XMLHttpRequest 在nodejs中是http.ClientRequest
  } else {
    // 设置阶段的错误
  }
  let new_logs = [];
  for (const l of logs) {
    new_logs.push(h('p', null, l));
  }
  ElNotification({
    title: 'Error',
    message: h('div', null, new_logs),
    type: 'error',
  })
}

function time_string_parse(t: string): string {
  let d = new Date(Date.parse(t))

  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
}

async function sleep(ms: number = 1000) {
  return await new Promise((resolve) => setTimeout(() => resolve(undefined), ms))
}

// 读取token
const user_token = ref('' as string | null)
set_user_token(localStorage.getItem('user_token'))
function set_user_token(token: string | null) {
  user_token.value = token
  if (token !== null) {
    localStorage.setItem('user_token', token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('user_token')
    delete axios.defaults.headers.common['Authorization']
  }
}

interface Product {
  id: string
  created_at: string
  updated_at: string
  name: string
  description: string
  value: number
  quantity: number
}
const product_list = ref([] as Product[])

function reload_product_list() {
  axios.get('/product_list')
    .then(function (r) {
      product_list.value = r.data
    })
}
reload_product_list()

interface Order {
  id: string
  created_at: string
  updated_at: string
  user_id: string
  product_id: string
  quantity: number,
  trans_info: null,
  product: Product
}
const order_list = ref([] as Order[])

function reload_order_list() {
  axios.get('/user/order_list')
    .then(function (r) {
      order_list.value = r.data
    })
}
reload_order_list()

const order_dialog_show = ref(false)
const order_count = ref(1)
const order_product = ref({} as Product)
function on_order(product: Product) {
  if (!user_token.value) {
    ElNotification({
      title: 'Info',
      message: '请先登录',
      type: 'warning',
    })
    return
  }
  order_product.value = product
  order_dialog_show.value = true
}
async function on_order_confirm(confirm: boolean) {
  if (!confirm) {
    order_dialog_show.value = false
    return
  }

  const params = new URLSearchParams();
  params.append('product_id', order_product.value.id);
  params.append('quantity', order_count.value.toString());

  let job_id;
  try {
    const ret = await axios.post('/job/order_make', params)
    job_id = ret.data.id
  } catch (error) {
    return
  }
  const loading = ElLoading.service({
    lock: true,
    text: '下单中，请等候，在此期间请不要重复下单',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  let job_status: string;
  while (true) {
    try {
      await sleep(500)
      const ret = await axios.get('/job/status', {
        params: { id: job_id }
      })
      job_status = ret.data
    } catch (error) {
      break
    }
    if (['completed', 'failed'].includes(job_status)) {
      break
    }
    console.log(job_status);
  }
  loading.close()

  if (job_status! !== 'completed') {
    ElNotification({
      title: 'Error',
      message: '下单失败',
      type: 'error',
    })
    return
  }
  ElNotification({
    title: 'Info',
    message: '下单成功',
    type: 'success',
  })
  reload_product_list()

  order_dialog_show.value = false
}

const username = ref('test')
const password = ref('test')
const login_dialog_show = ref(false)
function on_login() {
  login_dialog_show.value = true
}
async function on_login_confirm(confirm: boolean) {
  if (!confirm) {
    login_dialog_show.value = false
    return
  }

  const params = new URLSearchParams();
  params.append('username', username.value,);
  params.append('password', password.value);

  let ret;
  try {
    ret = await axios.post('/user/login', params)
  } catch (error) {
    return
  }
  set_user_token(ret.data.token)
  login_dialog_show.value = false
  ElNotification({
    title: 'Info',
    message: '登陆成功',
    type: 'success',
  })
}

async function on_logout() {
  try {
    await axios.post('/user/logout')
  } catch (error) {
    return
  } finally {
    set_user_token(null)
  }
}

const old_password = ref('')
const new_password = ref('')
const change_password_dialog_show = ref(false)
function on_change_password() {
  change_password_dialog_show.value = true
}
async function on_change_password_confirm(confirm: boolean) {
  if (!confirm) {
    change_password_dialog_show.value = false
    return
  }

  const params = new URLSearchParams();
  params.append('old_password', old_password.value,);
  params.append('new_password', new_password.value);

  try {
    await axios.post('/user/change_password', params)
  } catch (error) {
    return
  }
  change_password_dialog_show.value = false
  ElNotification({
    title: 'Info',
    message: '修改密码成功',
    type: 'success',
  })
}
</script>
 
<template>
  <div class="main">
    <el-affix class="banner border" :style="{ boxShadow: `var(--el-box-shadow-base)` }" :offset="0">
      <el-space v-if="user_token">
        <el-link type="default">{{ username }}</el-link>
        <el-link @click="on_change_password" type="primary">修改密码</el-link>
        <el-link @click="on_logout" type="danger">退出登录</el-link>
      </el-space>
      <el-space v-else>
        <el-link @click="on_login" type="primary">登录</el-link>
      </el-space>
    </el-affix>

    <el-tabs type="card">
      <el-tab-pane label="商品">
        <el-scrollbar>
          <div class="product-container">
            <el-card
              class="product-item"
              v-for="(item,i) in product_list"
              :body-style="{ padding: '10px' }"
            >
              <el-descriptions :title="item.name" :column="1" border>
                <template #extra>
                  <el-button type="primary" @click="on_order(item)">下单</el-button>
                </template>
                <el-descriptions-item>
                  <template #label>描述</template>
                  {{ item.description }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label>价格</template>
                  {{ item.value }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label>剩余库存</template>
                  {{ item.quantity }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label>更新时间</template>
                  {{ time_string_parse(item.updated_at) }}
                </el-descriptions-item>
              </el-descriptions>
            </el-card>
          </div>
        </el-scrollbar>
      </el-tab-pane>
      <el-tab-pane v-if="user_token" label="订单">
        <el-scrollbar>
          <div class="product-container">
            <el-card
              class="product-item"
              v-for="(item,i) in order_list"
              :body-style="{ padding: '10px' }"
            >
              <el-descriptions :column="2" border>
                <el-descriptions-item>
                  <template #label>商品名称</template>
                  {{ item.product.name }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label>下单时间</template>
                  {{ time_string_parse(item.created_at) }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label>商品数量</template>
                  {{ item.quantity }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label>订单总价</template>
                  {{ item.product.value * item.quantity }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label>物流状态</template>
                  {{ item.trans_info }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label>更新时间</template>
                  {{ time_string_parse(item.updated_at) }}
                </el-descriptions-item>
              </el-descriptions>
            </el-card>
          </div>
        </el-scrollbar>
      </el-tab-pane>
    </el-tabs>
    <el-dialog v-model="order_dialog_show" title="下单">
      <div style="display:flex; justify-content: center;">
        <el-input-number v-model="order_count" :min="1" :max="order_product.quantity" />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="on_order_confirm(false)">Cancel</el-button>
          <el-button type="primary" @click="on_order_confirm(true)">Confirm</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="login_dialog_show" title="登录">
      <div style="display:flex; flex-direction: column; align-items: center;">
        <el-input v-model="username" placeholder="用户名" minlength="4" />
        <el-input v-model="password" placeholder="密码" show-password />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="on_login_confirm(false)">Cancel</el-button>
          <el-button type="primary" @click="on_login_confirm(true)">Login</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="change_password_dialog_show" title="修改密码">
      <div style="display:flex; flex-direction: column; align-items: center;">
        <el-input v-model="old_password" placeholder="原密码" show-password />
        <el-input v-model="new_password" placeholder="新密码" show-password />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="on_change_password_confirm(false)">Cancel</el-button>
          <el-button type="primary" @click="on_change_password_confirm(true)">Login</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.main {
  display: flex;
  height: 100%;
  flex-direction: column;
}

.banner {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.border {
  border: 1px solid var(--el-border-color-base);
}

.product-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
}
.product-item {
  flex-grow: 1;
  flex-basis: 40%;
  margin: 10px;
}

.el-tabs {
  height: 0;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}
:deep(.el-tabs__header) {
  margin: 0;
}

.el-tab-pane {
  height: 100%;
}
</style>
