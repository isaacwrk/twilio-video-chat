<template>
    <div class="col-md-3 box">
        <div class="log"  v-for="log in logs" v-bind:key="log.id">
            {{log.message}}
        </div>
    </div>
</template>

<script lang='ts'>
import { defineComponent, onMounted, reactive } from 'vue';
import useEmmitter from '@/composables/userEmmiter';
import axios from "axios";

interface dataLogs{
    logs:any,
    logCount:number
}
const Logs = defineComponent({
    name:"Logs",
    setup(){
        const data = reactive<dataLogs>({
            logs:[],
            logCount:0
        });

        const emmiter = useEmmitter();

        onMounted(()=>{
            emmiter.on('new_log',(message:string)=>{
                data.logs.push({ id:data.logCount, message:message });
                data.logCount += 1;
            });
        });
    }
});

export default Logs;
</script>

<style scoped>
    .log {
        border: 1px solid rgb(124, 129, 124);
        padding: 13px;
        margin: 3px 0px;
        color: ghostwhite;
    }
</style>