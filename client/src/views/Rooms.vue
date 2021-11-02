<template>
    <div class="rooms">
      {{user}}
    <el-table
      :data="rooms"
      style="width: 100%">
      <el-table-column
        label="Идентификатор"
        prop="id">
      </el-table-column>
      <el-table-column
        label="Название кафе"
        prop="name">
      </el-table-column>
      <el-table-column
        label="Действия"
        align="right">
        <template v-slot="index">
          <el-button
            size="mini"
            type="success"
            @click="enter_room(index.row)">Войти</el-button>
          <el-button
            size="mini"
            type="danger"
            v-if="user.is_admin"
            @click="delete_room(index.row)">Удалить</el-button>
          <el-button
            size="mini"
            type="info"
            v-if="user.is_admin"
            @click="edit_room(index.row)">Редактировать</el-button>
        </template>
      </el-table-column>
    </el-table>
    </div>
</template>


<script>
import { useStore, mapGetters } from 'vuex';
import router from '../router';

export default {
  name: 'Rooms',
  data(){
    return {
    }
  },
  computed: {
      ...mapGetters(['rooms', 'user'])
  },
  created: function() {
    const store = useStore();
    let message = {
      type: 'get_rooms'
    };
    store.dispatch('get_rooms', message)
  },
  methods: {
    enter_room(index) {
      this.$store.commit('put_id_room', index.id)
      this.$store.commit('put_mode_room', 'select')
      router.push({name: 'Room', params: {id: index.id}})
      console.log("Действие: вход в комнату")
      console.log(index)
    },
    delete_room(index) {
      console.log("Действие: удалить комнату")
      console.log(index)
    },
    edit_room(index) {
      console.log("Действие: редактировать комнату")
      console.log(index)
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>