<template>
    <div class="row roomForm">
        <form class="form-inline" @submit.prevent="createNewRoom(data.room_name)">
            <div class="form-group mb-2">
                <input type="text" class="form-control" v-model="data.roomNroom_nameame" >
            </div>
            <button type="submit" class="btn btn-primary mb-2 createRoomBotton">Create Room</button>
        </form>
    </div>
</template>

<script lang='ts'>
import { defineComponent, reactive } from 'vue';
import useEmmitter from '@/composables/userEmmiter';


interface dataRoom{
    room_name: string | null

}
const AddRoom = defineComponent({
    name:'AddRoom',
    setup(){
        const data = reactive<dataRoom>({
            room_name:""
        });

        const emmiter = useEmmitter();

        function createNewRoom(name:string){
            if(!name){
                alert("Insira um nome para a sala");
            }
            data.room_name = "";
            emmiter.emit("new_room", name);
        }

        return { createNewRoom, data };
    }
});

export default AddRoom;
</script>

<style>
 .roomForm {
     margin-left: auto;
     margin-right: auto;
     margin-top: 30px;
     width: 100%;
 }
 .createRoomBotton {
   color: #fff;
   background-color: #4d555f;
   border-color: #303840;
   padding: 8px;
   font-weight: bolder;
 }
</style>