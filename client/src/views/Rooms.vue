<template>
    <div class="rooms">
      <Admin/>
    <el-table
      :data="rooms"
      style="width: 100%">
      <el-table-column
        label="Порядковый номер"
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
            <el-popover
            v-model="visible">
            <p>Удалить данное кафе?</p>
            <div class="popup_warning">
              <el-button size="mini" type="default" @click="visible = false">отмена</el-button>
              <el-button size="mini" type="danger" @click="delete_room(index.row)">удалить</el-button>
            </div>
            <template #reference>
              <el-button
              size="mini"
              type="danger"
              >
              Удалить
              </el-button>
            </template>
          </el-popover>
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
import Admin from '@/components/Admin.vue';
import router from '../router';

export default {
  name: 'Rooms',
  components: {
    Admin
  },
  data(){
    return {
      visible: false,
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
    change_visible(){
      this.visible = true;
    },
    enter_room(index) {
      this.$store.commit('put_id_room', index.id)
      this.$store.commit('put_mode_room', 'select')
      router.push({name: 'Room', params: {id: index.id}})
      console.log("Действие: вход в комнату")
      console.log(index)
    },
    delete_room(index) {
      let data = {
        type :"delete_room",
        id: index.id
      }
      this.$store.dispatch('ws_message', JSON.stringify(data));
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
.popup_warning {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>