<template>
    <div class="text-center justify-center pt-2">
        <input type="text" placeholder="nome" class="mr-2" v-model="nome"/>
        <input type="text" placeholder="nome da sala" class="mr-2" v-model="roomName"/>
        <button class="bg-red-200 text-red-500 w-28 h-8 rounded-md text-xs" @click="getAcessToken">Recuperar Token</button>
        <p class="text-white mt-2 break-all p-2">{{token}}</p>
        <Video :roomName="roomName" :token="token"/>
    </div>
</template>

<script lang='ts'>
import { defineComponent,ref } from 'vue';
import axios from 'axios';
import Video from '@/components/Video.vue';

const Token = defineComponent({
    components:{
        Video
    },
    setup(){
        const token = ref('');
        const roomName = ref('');
        const nome = ref('');
        //Gerar o acess token
        async function getAcessToken(){
            const result  = await axios.get(`https://47b1-45-170-92-45.ngrok.io/token?identity=${nome.value}`);
            token.value = result.data.token;
            return token.value;
        }

        return{ getAcessToken,token,roomName,nome };
    }
});

export default Token;
</script>

<style>

</style>