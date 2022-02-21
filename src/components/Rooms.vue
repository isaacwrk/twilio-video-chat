<template>
    <div class="col-md-3 rooms">
        <div class="room" v-for="room in data.rooms" v-bind:key="room.id" @click="showRoom(room.name)">
            {{room.name}}
        </div>
        <AddRoom /> 
    </div>
</template>

<script lang='ts'>
import { defineComponent, onMounted, reactive } from 'vue';
import AddRoom from '@/components/AddRom.vue';
import useEmmitter from '@/composables/userEmmiter';



const Rooms = defineComponent({
    components:{
        AddRoom
    },
    setup(){
        const data = reactive({
            rooms: [
                { id: 1, name: 'Vue Room' },
                { id: 2, name: 'React Room' },
                { id: 3, name: 'Daily standup' }
            ],
            roomCount: 3, // used to keep track of the number of rooms present
            loading: false,
        });

        const emmiter = useEmmitter();
        
        function showRoom(room:string){
            emmiter.emit('show_room', room);
        }

        onMounted(()=>{
            emmiter.emit('new_room',(data:any) => {
                data.roomCount++;
                data.rooms.push({ id:data.roomCount,name:data });
            });
        });
        
        return{ showRoom, data };
    }
});

export default Rooms;
</script>

<style scoped> /* scoped attribute is used here so the styling applies to this component alone */
   .rooms > .room {
       border: 1px solid rgb(124, 129, 124);
       padding: 13px;
       margin: 3px 0px;
       color: ghostwhite;
   }

   .rooms {
     border: 1px solid rgb(64, 68, 64);
     cursor: pointer;
   }
</style>