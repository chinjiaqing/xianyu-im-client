<template>
    <div class="flex user-item relative items-center gap-2 p-4 hover:bg-#f1f5f9 transition-all" v-if="info && info.userId" :class="[info.online ? '' : 'offline']">
        <!-- <Button size="small" class="text-sm user-in absolute right-2 bottom-4 z-2" style="position: absolute;" @click="restoreUser(info.userId)">进入</Button> -->
        <div class="text-sm user-in absolute right-2 bottom-4 z-2 absolute bg-#10b981 color-#fff px-4 py-1 rounded-1" cursor="pointer" @click="send2main('xianyuReLogin',info.userId)">
            进入
        </div>
        <div class="font-size-16px user-in absolute right-2 top-2 hover:color-red" title="解绑账号" cursor="pointer" @click="handleRemoveUser">
            <div class="i-carbon:close"></div>
        </div>
        <div class="relative">
            <OverlayBadge severity="danger" v-if="info.unread">
                <i class="pi pi-envelope" style="font-size: 2rem" />
            </OverlayBadge>
            <Avatar :class="{'ani-pulse':info.unread}" :image="info.avatar" size="large"
                shape="circle" />
        </div>
        <div class="flex-1">
            <div class="flex items-start gap-1 justify-between">
                <div class="text-color font-medium leading-6">
                    <div class="i-carbon:wifi-off w-1em h-1em" cursor="pointer" @click="toggleUserWsStatus(1)" v-if="!info.online" title="消息未连接"></div>
                    <div class="i-carbon:wifi w-1em h-1em color-#10b981" v-else  cursor="pointer" @click="toggleUserWsStatus(0)" title="消息已连接"></div>
                    {{ info.displayName }}
                </div>
            </div>
            <div class="flex items-center gap-5 justify-between mt-1">
                <div class="text-#64748b text-sm  line-clamp-1">
                    上次登录：{{ dayjs(Number(info.lastLogin)).format('YYYY-MM-DD HH:mm:ss') }}
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import dayjs from "dayjs"
import { send2main } from "@renderer/utils/ipc-send";
import { GooFishUser } from "@shared/types";
const props =  defineProps<{
    info:GooFishUser
}>()

function toggleUserWsStatus(status:number){
    console.log('%c [ status ]-43', 'font-size:13px; background:pink; color:#bf2c9f;', status)
    if(status) {
        send2main('xianyuImLogin',JSON.parse(JSON.stringify(props.info)))
    }else{
        send2main('xianyuImLogout',JSON.parse(JSON.stringify(props.info)))
    }
}
function handleRemoveUser(){
    send2main('userRemove',JSON.parse(JSON.stringify(props.info)))
}

</script>

<style lang="scss" scoped>
.user-in {
    display: none;
}
.offline {
    opacity: 0.8;
    img {
        filter: grayscale(100%);
    }
    :deep(.p-avatar img) {
        filter: grayscale(100%);
    }
}
.user-item {
    &:hover {
        .user-in {
            display: block;
        }
    }
}
</style>
