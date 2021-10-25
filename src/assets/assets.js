import '@/assets/styles/app.scss'
// 自动装配
const req = require.context('./icons', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
