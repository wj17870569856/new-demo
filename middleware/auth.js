// auth.js
export default function ({ store, redirect }) {
  if (!store.state.token) {
    // 没有登录就跳转到登录页
    return redirect('/login')
  }
}
