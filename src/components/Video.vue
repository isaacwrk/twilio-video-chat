<template>
    <div class="col-md-6 box">
        <div class="roomTitle">
            <span v-if="data.loading"> Loading... {{data.roomName}}</span>
            <span v-else-if="!data.loading && data.roomName"> Connected to {{data.roomName}}</span>
            <span v-else>Selecione a sala</span>
        </div>
        <div class="row remote_video_container">
            <div id="remoteTrack"></div>
        </div>
        <div class="spacing"></div>
        <div class="row">
            <div id="localTrack"></div>
        </div>
    </div>
</template>

<script lang='ts'>
import { defineComponent, onMounted, reactive } from 'vue';
import useEmmitter from '@/composables/userEmmiter';
import axios from "axios";

interface videoData{
    loading:boolean,
    data:any,
    localTrack:boolean,
    remoteTrack:string,
    activeRoom:string,
    previewTracks:'',
    identity:'',
    roomName:null
}

const Video = defineComponent({
    name:"Video",
    props:{
        username:String,
    },
    setup(){
        const emmiter = useEmmitter();
        const data = reactive<videoData>({
            loading:false,
            data:{},
            localTrack:false,
            remoteTrack:'',
            activeRoom:'',
            previewTracks:'',
            identity:'',
            roomName:null
        });

        onMounted(()=>{
            //Gerar o acess token
            async function getAcessToken(){}
            
            //Gatilho dos eventos do log,
            function dispatchLog(message:string){}

            function attachTracks(tracks:any,container:any){}

            function detachTacks(tracks:any){}

            function detachParticipantTracks(participant:string){}

            function leaveRoomIfJoined(){}

            function createChat(room_name:string){}

        });


        return { data };
    }
});

export default Video;
</script>

<style >
   .remote_video_container {
     left: 0;
     margin: 0;
     border: 1px solid rgb(124, 129, 124);
   }
   #localTrack video {
       border: 3px solid rgb(124, 129, 124);
       margin: 0px;
       max-width: 50% !important;
       background-repeat: no-repeat;
   }
   .spacing {
     padding: 20px;
     width: 100%;
   }
   .roomTitle {
       border: 1px solid rgb(124, 129, 124);
       padding: 4px;
       color: dodgerblue;
   }
</style>