<template>
    <div class="admin">
        <el-row>
            <el-button @click="change_toggle()">Создать кафе</el-button>
        </el-row>
        <el-row v-if="toggle_form">
            <el-form :label-position="left" label-width="320px" :model="room">
                <el-form-item label="Название">
                    <el-input required v-model="room.name" width="100%"></el-input>
                </el-form-item>
                <el-form-item label="Сайт">
                    <el-input v-model="room.delivery"></el-input>
                </el-form-item>
                <el-form-item label="Номер телефона">
                    <el-input v-model="room.phone"></el-input>
                </el-form-item>
                <el-form-item >
                    <el-button type="primary" @click="submitForm(room)">Create</el-button>
                </el-form-item>
            </el-form>
        </el-row>
    </div>
</template>

<script>

export default {
    name: 'Auth',
    data(){
        return {
            room: {
                name: '',
                delivery: '',
                phone: '',
                type: 'create_room',
            },
            toggle_form: false,
        }
    },
    methods: {
        change_toggle() {
            this.toggle_form = !this.toggle_form;
        },
        submitForm(data){
            this.$store.dispatch('ws_message', JSON.stringify(data));
        }
    }
}
</script>
<style scoped>
    .admin {
        width: 100%;
    }
</style>
