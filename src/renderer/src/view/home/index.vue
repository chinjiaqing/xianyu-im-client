<template>
    <div class="p-4 flex flex-col gap-4 h-100vh overflow-hidden w-100vw overflow-x-hidden" v-if="isReady">
        <div class="flex items-center justify-between py-4">
            <div class="text-lg font-500">欢迎使用</div>
            <div class="flex items-center gap-2">
                <Button size="small" @click="send2main('xianyuLogin')">
                    <img src="https://img.alicdn.com/tfs/TB19WObTNv1gK0jSZFFXXb0sXXa-144-144.png" class="w-4 h-4"
                        style="border-radius: 50%;" alt="">
                    添加账号</Button>
            </div>
        </div>
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
                <div>账号列表</div>
                <!-- <div class="text-sm text-#64748b">({{ userList.length }})</div> -->
            </div>
            <div class="flex items-center  text-sm gap-1 text-#64748b hover:text-#10b981" cursor="pointer"
                @click="syncUserList">
                <div class="i-carbon:renew w-1em h-1em"></div>
                刷新
            </div>
        </div>
        <div class="max-h-90 overflow-y-auto flex flex-col w-100%">
            <User v-for="user in userList" :key="user.userId" :info="user" />
        </div>
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
                <div>日志列表</div>
            </div>
            <div class="flex items-center  text-sm gap-1 text-#64748b hover:text-#10b981" cursor="pointer"
                @click="handleClearLog">
                <div class="i-carbon:trash-can"></div>
                清除
            </div>
        </div>
        <div class="flex flex-col gap-1 px-1 flex-1 h-100% text-sm overflow-y-auto" id="logBox">
            <div class="flex flex-col gap-1 p-1 rounded-1 hover:bg-#f5f6f7 border-dashed  border-b-1px border-#b2b2b2"
                v-for="log in logList" :key="log.datetime">
                <div class="flex gap-1 justify-between items-center">
                    <div class="flex gap-1 items-center">
                        <Tag severity="info" class="text-sm" size="small" value="系统"></Tag>
                        <!-- <Tag severity="success" class="text-sm" size="small" value="用户" v-else></Tag> -->
                        <span>{{ log.subject }}</span>
                    </div>
                    <span class="text-sm color-#666 flex-grow-1">{{ dayjs(Number(log.datetime)).format('HH:mm:ss')
                        }}</span>
                </div>
                <div :class="[log.status ? 'text-#555' : 'text-red']" class="break-all">{{ log.body }}</div>
            </div>
        </div>
    </div>
    <div class="actions">

    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref,nextTick } from 'vue'
import User from "./components/user.vue"
// import { userList, syncUserList,addUser} from '@renderer/hooks/useUser/index'
import dayjs from 'dayjs'
import { LogItem } from '@renderer/types'
import { send2main } from "@renderer/utils/ipc-send"
import { ipcInvoke } from '@renderer/utils/icp-invoke'
import { GooFishUser } from '@shared/types'
import { addEvent } from '@renderer/utils/ipc.listener'

const logList = ref<LogItem[]>([])
const isReady = ref(false)
const userList = ref<GooFishUser[]>([])
function handleClearLog() {
    logList.value = []
}

async function syncUserList(){
    userList.value = await ipcInvoke('userList')
}

onMounted(async () => {
    document.title = `闲鱼IM`
    isReady.value = true
    addEvent('log',(payload:LogItem)=>{
        logList.value.unshift(payload)
        nextTick(() => {
            document.querySelector('#logBox')?.scrollTo({
                top: 0,
                behavior: 'smooth'
            })
        })
    })
    addEvent('refreshUserList',syncUserList)
    syncUserList()
    send2main('onMounted')
})

</script>

<style lang="scss" scoped></style>