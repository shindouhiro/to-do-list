import { execSync } from 'node:child_process'
import { chmodSync, copyFileSync, cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')

const RESOURCES_DIR = path.join(repoRoot, 'src-tauri', 'resources')
const SERVER_RESOURCE_DIR = path.join(RESOURCES_DIR, 'server')
const CLIENT_RESOURCE_DIR = path.join(RESOURCES_DIR, 'client')
const RUNTIME_RESOURCE_DIR = path.join(RESOURCES_DIR, 'runtime')
const API_BASE_URL = 'http://127.0.0.1:3001/api'

function run(cmd, cwd = repoRoot, env = process.env) {
  console.log(`Running: ${cmd} in ${cwd}`)
  execSync(cmd, {
    cwd,
    env,
    stdio: 'inherit',
  })
}

// 清理旧资源
rmSync(RESOURCES_DIR, { recursive: true, force: true })
mkdirSync(SERVER_RESOURCE_DIR, { recursive: true })
mkdirSync(CLIENT_RESOURCE_DIR, { recursive: true })
mkdirSync(RUNTIME_RESOURCE_DIR, { recursive: true })

// 1. 构建并准备 Server 资源 (替代不稳定的 pnpm deploy)
console.log('Building server...')
run('pnpm --filter @todo-app/server build')

// 复制 package.json 并移除 workspace: 依赖（如果有的话，这里 server 没有 workspace 依赖）
// 直接复制编译后的文件
console.log('Preparing server resources...')
cpSync(path.join(repoRoot, 'packages', 'server', 'dist'), path.join(SERVER_RESOURCE_DIR, 'dist'), { recursive: true })
copyFileSync(path.join(repoRoot, 'packages', 'server', 'package.json'), path.join(SERVER_RESOURCE_DIR, 'package.json'))

// 在资源目录安装生产依赖，使用 --no-workspace 避免目录解析问题
// 并在临时目录创建一个空的 pnpm-workspace.yaml 强制其脱离当前工作区上下文
writeFileSync(path.join(SERVER_RESOURCE_DIR, 'pnpm-workspace.yaml'), 'packages: []\n')
run('pnpm install --prod --no-frozen-lockfile', SERVER_RESOURCE_DIR)
rmSync(path.join(SERVER_RESOURCE_DIR, 'pnpm-workspace.yaml'))

// 2. 构建并准备 Client 资源
console.log('Building client...')
run('pnpm --filter @todo-app/client build', repoRoot, {
  ...process.env,
  VITE_API_URL: API_BASE_URL,
})

cpSync(path.join(repoRoot, 'packages', 'client', 'dist'), path.join(CLIENT_RESOURCE_DIR, 'dist'), {
  recursive: true,
  force: true,
})

// 3. 准备 Node 运行时
console.log('Preparing runtime...')
const nodeBinaryName = process.platform === 'win32' ? 'node.exe' : 'node'
const nodeTargetPath = path.join(RUNTIME_RESOURCE_DIR, nodeBinaryName)
copyFileSync(process.execPath, nodeTargetPath)

if (process.platform !== 'win32')
  chmodSync(nodeTargetPath, 0o755)

console.log('Tauri resources prepared successfully!')
