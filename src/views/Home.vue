<template>
    <div class="container-fluid chat_container" id="app">
        <div class="row" v-if="data.authenticated">
            <Rooms />
            <Video :username="data.username"/>
            <Logs />
        </div>
        <div class="row" v-else>
            <div class="username">
                <form class="form-inline" @submit.prevent="submitUsername(data.username)">
                    <div class="form-group mb-2">
                        <input type="text" class="form-control" v-model="data.username" >
                    </div>
                    <button type="submit" class="btn btn-primary mb-2 Botton">Submit</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script lang="ts">

import AddRoom from '@/components/AddRom.vue';
import Logs from '@/components/Logs.vue';
import Rooms from "@/components/Rooms.vue";
import Video from '@/components/Video.vue';
import { defineComponent, reactive } from 'vue';

interface userData{
    username:string | null,
    authenticated: boolean | null
}

const Home = defineComponent({
    components: {
        AddRoom,
        Logs,
        Rooms,
        Video
    },

    setup(){
        const data = reactive<userData>({
            username:"",
            authenticated: false
        });

        function submitUsername(username:userData){
            if(!username){
                return alert('Por favor insira um Username');
            }
            data.authenticated = true;
        }
        return{ submitUsername, data };
    }
});
export default Home;

</script>

<style>
 #app {
   font-family: 'Avenir', Helvetica, Arial, sans-serif;
   -webkit-font-smoothing: antialiased;
   -moz-osx-font-smoothing: grayscale;
   text-align: center;
   color: #2c3e50;
   margin-top: 60px;
   background: #2c3e50;
 }
 .box {
   border: 1px solid gray;
 }

 .username {
   margin: 12px auto 7px auto;
   color: wheat;
 }

   .Botton {
   color: #fff;
   background-color: #4d555f;
   border-color: #303840;
   padding: 8px;
   font-weight: bolder;
 }
</style>

