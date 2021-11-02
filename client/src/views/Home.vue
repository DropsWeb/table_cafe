<template>
  <div class="home">
    <Reg
    v-if="user.authorized == false"
    />
  </div>
</template>

<script>
// @ is an alias to /src
import {mapGetters, mapActions, useStore} from 'vuex';
import Reg from '../components/Reg.vue';
export default {
  name: 'Home',
  components: {
    Reg
    // Header
  },

  created: function() {
    const store = useStore();
    console.log("Starting connection to WebSocket Server")
    let connection = new WebSocket("ws://localhost:8999")
    
    store.dispatch('start_server', connection)
  },
  computed: mapGetters(['all_users', 'start_ws', 'user']),

  methods: mapActions(['websocket_server']),

}
</script>

<style scoped>

</style>
