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
import Twilio, { connect, createLocalTracks, createLocalVideoTrack } from 'twilio-video';
import axios from "axios";

interface videoData{
    loading:boolean,
    data:any,
    localTrack:boolean,
    remoteTrack:string,
    activeRoom:any,
    previewTracks:'',
    identity:'',
    roomName:null | string,
    vueThis: any
}

const Video = defineComponent({
    name:"Video",
    props:{
        username:String,
    },
    setup(props){
        const emmiter = useEmmitter();
        const data = reactive<videoData>({
            loading:false,
            data:{},
            localTrack:false,
            remoteTrack:'',
            activeRoom:false,
            previewTracks:'',
            identity:'',
            roomName:null,
            vueThis:''
        });


        //Gerar o acess token
        async function getAcessToken(){
            return await axios.get(`http://localhost:3000/token?identity=${props.username}`);
        }
            
        //Gatilho dos eventos do log,
        function dispatchLog(message:string){
            emmiter.emit('new_log',message);
        }

        function attachTracks(tracks:any,container:any){
            tracks.forEach(function(track:any){
                container.appendChild(track.attach());
            });
        }

        function attachParticipantTracks(participant:any,container:any){
            let tracks = Array.from(participant.track.values());
            return attachTracks(tracks, container);
        }

        function detachTracks(tracks:any){
            tracks.forEach((track:any) => {
                track.detach().forEach((detachedElement:any)=>{
                    detachedElement.remove();
                });
            });
        }

        function detachParticipantTracks(participant:any){
            let tracks = Array.from(participant.tracks.value());
            return detachTracks(tracks);
        }

        function leaveRoomIfJoined(){
            if(data.activeRoom){
                data.activeRoom.disconnect();
            }
        }

        function createChat(room_name:string){
            data.loading = true;
            data.vueThis.getAcessToken().then((data:any)=>{
                data.data.roomName = null;
                const token = data.data.token;
                let connectOptions = {
                    name:room_name,
                    audio:true,
                    video:{ width: 400 }
                };
                    //disconecta o usuario de uma uma outra sala
                data.vueThis.leaveRoomIfJoined();

                    //remove todas as tracks quando entrar em uma nova sala
                    document.getElementById('remoteTrack')?.innerHTML;

                    Twilio.connect(token,connectOptions).then(function(room){
                        //log se entrar com sucesso
                        data.vueThis.dispatchLog('Entrou na sala com sucesso' + room_name);

                        data.vueThis.activeRoom = room,
                        data.roomName = room_name,
                        data.vueThis.loading=false;
                    });
            }
            );} 

        onMounted(()=>{
            getAcessToken();
        });

        return { 
            data,
            getAcessToken,
            dispatchLog,
            attachTracks,
            attachParticipantTracks,
            detachParticipantTracks,
            leaveRoomIfJoined,
            createChat
        };
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