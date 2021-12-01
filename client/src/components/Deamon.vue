<template>
  <div class="deamon"></div>
</template>

<script>
import { useStore } from "vuex";
export default {
  name: "Deamon",
  created: function() {
    console.log("Всегда должен перенаправлять");
    this.$router.push({ name: "Home" });

    const store = useStore();
    console.log(store.getters);

    console.log("Starting connection to WebSocket Server");
    //Бой
    let connection = new WebSocket("wss://elstestzone.ru:8999");

    //Dev
    // let connection = new WebSocket("ws://localhost:8999");

    store.dispatch("start_server", connection);
  },
};
</script>
