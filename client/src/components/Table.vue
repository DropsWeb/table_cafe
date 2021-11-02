<template>
    <div class="table">
        {{room}}
    </div>
</template>

<script>
import { mapGetters} from 'vuex';

export default {
    name: 'Table',
    computed: {
        ...mapGetters(['room'])
    },

}
</script>

<style>

</style>