<script setup>
import {reactive, ref} from "vue";
import Button from "primevue/button";
import axios from "@/axios";
import {useHomeStore} from "@/store/home";
import {useRouter} from "vue-router";

const router = useRouter();
const store = useHomeStore();
const loading = ref(false);
const error = ref("");
const regData = reactive({
  name: "", email: "", role: null
})


const addUser = async () => {
  try {
    loading.value = true;
    error.value = "";

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    //Validation
    if (regData.name.trim().length < 4) return error.value = "Der Name muss mindestens vier Zeichen lang sein";
    if (!regData.email.trim()) return error.value = "Bitte E-Mail-Adresse angeben";
    if (!regData.email.match(emailRegex)) return error.value = "Bitte geben Sie eine gültige E-Mail-Adresse ein";

    const response = await  axios.post('/admin/users/dashboard',
        regData,
        {
          headers: { 'Authorization': `Bearer ${store.user.token}`}
        }
    )

    if (response.status === 201){
      router.push({name: "dashboard-users"})
    }

  }catch (e) {
    if (e.response) return error.value = `${e.response.data}`;
    if (e.request && e.request.status === 0) {
       return error.value = `Leider wurde die Verbindung zum Server abgelehnt. Bitte überprüfen Sie Ihre Internetverbindung oder versuchen Sie es später erneut`;
    }

    return error.value = 'Entschuldigung, etwas ist schief gelaufen. Bitte versuchen Sie es später noch einmal';
  }finally { loading.value = false; }

}
</script>

<template>
<div class="container py-4">
  <h3 class="text-center">Benutzer hinzufügen</h3>
  <div class="row justify-content-center">
    <div class="col-lg-6">

      <form @submit.prevent="addUser">

        <small>Name</small>
        <div class="input-group mb-3">
          <div class="input-group-text"><span class="pi pi-user"></span></div>
          <input type="text" class="form-control shadow-none" placeholder="Name"
                required v-model.trim="regData.name">
        </div>

        <small>E-Mail-Adresse</small>
        <div class="input-group mb-3">
          <div class="input-group-text"><span class="pi pi-envelope"></span></div>
          <input type="email" class="form-control shadow-none" placeholder="E-Mail-Adresse"
                required v-model.trim="regData.email">
        </div>

        <small>Rolle</small>
        <div class="form-group mb-3">
          <label for="">
            <input type="radio" class="p-radiobutton" name="role"
                  v-model="regData.role" value="1" required>
             <b>&nbsp; Administrator</b>
          </label><br>
          <label for="">
            <input type="radio" class="p-radiobutton" name="role"
                   v-model="regData.role" value="4" required>
             <b>&nbsp; Benutzer</b>
          </label>
          <br>
          <label for="">
            <input type="radio" class="p-radiobutton" name="role"
                   v-model="regData.role" value="5" required>
            <b>&nbsp; Lieferperson</b>
          </label>
        </div>

        <div class="text-danger text-center" v-if="error">
          <small>{{ error }}</small></div>

        <div class="text-center">
          <Button label="Einreichen" type="submit" :loading="loading"
                  class="p-button  p-button-rounded my-4 px-4 py-2" />
        </div>

      </form>


    </div>
  </div>
</div>
</template>

<style scoped>

</style>