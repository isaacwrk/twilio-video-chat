<template>
    <div class="justify-center">
        <!-- <div class="roomTitle">
            <span v-if="data.loading"> Loading... {{data.roomName}}</span>
            <span v-else-if="!data.loading && data.roomName"> Connected to {{data.roomName}}</span>
            <span v-else>Selecione a sala</span>
        </div> -->

        <p class="text-white">Salinha da alegria : {{data.roomName}}</p>
        <div class="text-center justify-center mb-2">
            <button class="bg-green-400 text-green-600 w-28 h-16 rounded-sm mr-2" @click="joinRoom">Join</button>
            <button class="bg-yellow-400 text-yellow-600 w-28 h-16 rounded-sm" @click="previewVideo">Preview Video</button>
        </div>

        <div class="row remote_video_container">
            <div id="remoteTrack"></div>
            <div id="videoPreview"></div>
            <div id="remote-media-div"></div>

        </div>
        <div class="spacing"></div>
        <div class="row">
            <div id="localTrack"></div>
        </div>
    </div>
</template>

<script lang='ts'>
import { defineComponent, reactive } from 'vue';
import useEmmitter from '@/composables/userEmmiter';
import Twilio, { connect, createLocalTracks, createLocalVideoTrack, RemoteAudioTrack, RemoteDataTrack, RemoteVideoTrack, RemoteTrack } from 'twilio-video';


//import axios from "axios";

interface videoData{
    loading:boolean,
    data:any,
    localTrack:any,
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
        roomName:{
            type:String,
            required:true
        },
        token:{
            type:String
        }
    },
    setup(props){
        const emmiter = useEmmitter();
        const data = reactive<videoData>({
            loading:false,
            data:{},
            localTrack:null,
            remoteTrack:'',
            activeRoom:false,
            previewTracks:'',
            identity:'',
            roomName:null,
            vueThis:''
        });

        // Gerar o acess token
        // async function getAcessToken(){
        //     return await axios.get(`http://localhost:3000/token?identity=${props.roomName}`);
        // }

        function previewVideo(){
            createLocalVideoTrack().then(track => {
                const localMediaContainer = document.getElementById('videoPreview');
            localMediaContainer?.appendChild(track.attach());
            });
        }

        function attachTrack(track:RemoteVideoTrack|RemoteAudioTrack){
            let previewContainer = document.getElementById('remote-media-div');
            previewContainer?.appendChild((track!.attach()));
        }

        function trackExistsAndIsAttachable(track:RemoteTrack): track is RemoteAudioTrack | RemoteVideoTrack {
            return !!track && ((track as RemoteAudioTrack).attach !== undefined ||(track as RemoteVideoTrack).attach !== undefined);
        }

        function joinRoom(){
            console.log('token: ' + props.token);
            console.log('roomName: ' + props.roomName);
            const connectOptions = { name: props.roomName, audio : true , video:{ width: 400 } };
            Twilio.connect(props.token!,connectOptions).then(function(room){
                console.log(('Entrou na sala com sucesso ' + props.roomName));

                //data.vueThis.activeRoom = room,
                data.roomName = props.roomName!,
                // data.vueThis.loading = false;

                console.log(room.participants);
                room.participants.forEach(function(participant){
                    participant.tracks.forEach(publication => {
                        console.log('linha 109 *************' + publication.track + participant.identity);
                        if(!publication.isSubscribed){
                            return; 
                        }
                        if(!trackExistsAndIsAttachable(publication.track!)){
                            return;
                        }
                        attachTrack(publication.track);
                    });
                    participant.on('trackSubscribed', track => {
                        console.log('linha 138' + track);

                        if(!trackExistsAndIsAttachable(track!)){
                            return;
                        }
                        attachTrack(track);
                    });
                });

                room.on('participantConnected', function(participant){
                    participant.tracks.forEach(publication => {
                        console.log('linha 124 ' + publication.isSubscribed);
                        
                        if(!publication.isSubscribed){
                            return; 
                        }
                        if(!trackExistsAndIsAttachable(publication.track!)){
                            return;
                        }
                        attachTrack(publication.track);
                    });

                    console.log(("Joining: linha 135 '" + participant.identity + "'"));

                    participant.on('trackSubscribed', track => {
                        console.log('linha 138' + track);

                        if(!trackExistsAndIsAttachable(track!)){
                            return;
                        }
                        attachTrack(track);
                    });
                });

                room.on('participantDisconnected', function(participant) {
                    console.log(("Participant linha 148 '" + participant.identity + "' left the room"));
                    console.log(('linha 149 ' + participant));
                });

            });
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
                        data.vueThis.loading = false;

                        room.participants.forEach(function(participant){
                            let previewContainer = document.getElementById('remoteTrack');
                            data.vueThis.attachParticipantTracks(participant,previewContainer);
                        });

                        room.on('participantConnected', function(participant){
                            data.vueThis.dispatchLog("Joining: '" + participant.identity + "'");
                        });

                        // room.on('trackAdded', function(track:any,participant:any){
                        //     data.vueThis.dispatchLog(participant.identity + "added track" + track.kind);
                        //     let previewContainer = document.getElementById('remoteTrack');
                        //     data.vueThis.attachTracks([track], previewContainer);
                        // });

                        // room.on('trackRemoved', function(track:any, participant:any) {
                        //     data.vueThis.dispatchLog(participant.identity + " removed track: " + track.kind);
                        //     data.vueThis.detachTracks([track]);
                        // });

                        room.on('participantDisconnected', function(participant) {
                            data.vueThis.dispatchLog("Participant '" + participant.identity + "' left the room");
                            data.vueThis.detachParticipantTracks(participant);
                        });

                        // if(!data.vueThis.localTrack){
                        //     createLocalTracks().then(track=>{
                        //         let localMediaContainer = document.getElementById('localTrack');

                        //         localMediaContainer?.appendChild(track.attach());
                        //         data.vueThis.localTrack = true;
                        //     });
                        // }

                    });
            }
            );}

        // onMounted(()=>{
        //     emmiter.on('show_room',(room_name:any) =>{
        //         room_name.createChat(room_name);
        //     });

        //     window.addEventListener('beforeunload', leaveRoomIfJoined);
        // });

        return {
            data,
            //getAcessToken,
            dispatchLog,
            attachTracks,
            attachParticipantTracks,
            detachParticipantTracks,
            leaveRoomIfJoined,
            createChat,
            joinRoom,
            previewVideo
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