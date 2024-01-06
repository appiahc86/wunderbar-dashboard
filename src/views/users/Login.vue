<script setup>
import Button from "primevue/button";
import {onMounted, reactive, ref} from "vue";
import axios from "@/axios";
import {useHomeStore} from "@/store/home";
import {useComponentStore} from "@/store/componentStore";
import PasswordReset from "@/components/PasswordReset.vue";
import Dialog from "primevue/dialog";
import {useRouter} from "vue-router";

const store = useHomeStore();
const router = useRouter();
const componentStore = useComponentStore()
const loading = ref(false);
const error = ref('');
const showPassword = ref(false)
const loginData = reactive({email: '', password: ''})
componentStore.authDialog = true;

const resetLoginData = () => {
  loginData.email = ''; loginData.password = '';
}

//Login
const login = async () => {
  try {
    error.value = "";
    loading.value = true;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    //Validation
    if (!loginData.email.trim()) return error.value = "Bitte E-Mail-Adresse angeben";
    if (!loginData.email.match(emailRegex)) return error.value = "Bitte geben Sie eine gültige E-Mail-Adresse ein";
    if (!loginData.password.trim())  return error.value = "Bitte Passwort eingeben";




    //Send Data To Server
    const response = await  axios.post('/admin/users/auth/login',


        {
          email: loginData.email.toLowerCase(),
          password: loginData.password
        }
    )

    if (response.status === 200) {
      componentStore.authDialog = false;
      const payload = {
        name: response.data.user.name,
        email: response.data.user.email,
        role:  response.data.user.role,
        token: response.data.token
      }
      store.setUser(payload);
      resetLoginData();
      router.push({name: 'home'})
    }


  }catch (e) {
    if (e.response) return error.value = e.response.data;
    if (e.request && e.request.status === 0)
      return error.value = "Leider wurde die Verbindung zum Server abgelehnt. Bitte überprüfen Sie Ihre Internetverbindung oder versuchen Sie es später erneut";

    return error.value = 'Entschuldigung, etwas ist schief gelaufen. Bitte versuchen Sie es später noch einmal';

  }finally {
    loading.value = false;
  }

}


const openPasswordResetDialog = () => {
  // componentStore.setDefaults();
  componentStore.passwordResetDialog = true;
}



</script>

<template>

  <Dialog v-model:visible="componentStore.authDialog" maximizable
           :style="{ width: '100vw' }" :closable="false"
          :modal="true" class="auth-dialog" >

    <div class="wrapper w-100">

      <section class="form-wrapper w-100 px-4">

        <h3 class="text-center mb-3 fw-bold">Admin Login <span>&#128274;</span></h3>
        <section class="container-fluid">
          <section class="row justify-content-center">
            <section class="col-md-6 col-lg-4">
              <form @submit.prevent="login">
                <template v-if="error">
                  <p class="text-white text-center">{{ error }}</p>
                </template>

                  <input type="email" class="form-control shadow-none p-2"
                         placeholder="E-Mail-Adresse" v-model.trim="loginData.email">
                <br>
                <input :type="showPassword ? 'text' : 'password'" class="form-control shadow-none p-2"
                       placeholder="Passwort" v-model="loginData.password">

                <section class="form-check mt-3">
                  <input class="form-check-input mx-auto" id="showPassword" type="checkbox" v-model="showPassword">
                  <label class="form-check-label" for="showPassword">
                    &nbsp;Passwort anzeigen
                  </label>
                </section>

                <p>Passwort vergessen?
                  <span class="text-primary" @click="openPasswordResetDialog" style="cursor: pointer;">
                     klicken Sie hier</span>
                </p>

                <section class="text-center">
                  <Button label="Login" type="submit" :loading="loading" loadingIcon="spinner-border spinner-border-sm"
                          class="p-button  p-button-rounded mt-2 px-4 py-2"/>
                </section>

              </form>
            </section>
          </section>
        </section>

      </section>
      <div><span class="dot"></span></div>
      <div><span class="dot"></span></div>
      <div><span class="dot"></span></div>
      <div><span class="dot"></span></div>
      <div><span class="dot"></span></div>
      <div><span class="dot"></span></div>
      <div><span class="dot"></span></div>
      <div><span class="dot"></span></div>
      <div><span class="dot"></span></div>
      <div><span class="dot"></span></div>
      <div><span class="dot"></span></div>
      <div><span class="dot"></span></div>
      <div><span class="dot"></span></div>
      <div><span class="dot"></span></div>
      <div><span class="dot"></span></div>
    </div>

  </Dialog>



  <!--  Password Reset Dialog-->
  <Dialog v-model:visible="componentStore.passwordResetDialog" header=" " :style="{ width: '50vw' }"
          :breakpoints="{ '960px': '75vw', '641px': '100vw' }" position="center" :modal="true">
    <div class="container-fluid container-lg">
      <div class="row">
        <PasswordReset />
      </div>
    </div>
  </Dialog>

</template>


<style scoped>

.wrapper {
  height: 100vh;
  width: 100%;
  background: linear-gradient(180deg, #04fafd, 5%, #119dff, 50%, #030423);
  position: absolute;
  overflow: hidden;
  top: 0 !important;
}
.wrapper .form-wrapper {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
  font-family: sans-serif;
  letter-spacing: 1px;
  word-spacing: 2px;
  color: #fff;
  font-weight: 888;
  z-index: 100;
}
.wrapper div {
  height: 60px;
  width: 60px;
  border: 2px solid rgba(255, 255, 255, 0.7);
  border-radius: 50px;
  position: absolute;
  top: 10%;
  left: 10%;
  animation: 4s linear infinite;
}
div .dot {
  height: 10px;
  width: 10px;
  border-radius: 50px;
  background: rgba(255, 255, 255, 0.5);
  position: absolute;
  top: 20%;
  right: 20%;
}
.wrapper div:nth-child(1) {
  top: 20%;
  left: 20%;
  animation: animate 8s linear infinite;
}
.wrapper div:nth-child(2) {
  top: 60%;
  left: 80%;
  animation: animate 10s linear infinite;
}
.wrapper div:nth-child(3) {
  top: 40%;
  left: 40%;
  animation: animate 3s linear infinite;
}
.wrapper div:nth-child(4) {
  top: 66%;
  left: 30%;
  animation: animate 7s linear infinite;
}
.wrapper div:nth-child(5) {
  top: 90%;
  left: 10%;
  animation: animate 9s linear infinite;
}
.wrapper div:nth-child(6) {
  top: 30%;
  left: 60%;
  animation: animate 5s linear infinite;
}
.wrapper div:nth-child(7) {
  top: 70%;
  left: 20%;
  animation: animate 8s linear infinite;
}
.wrapper div:nth-child(8) {
  top: 75%;
  left: 60%;
  animation: animate 10s linear infinite;
}
.wrapper div:nth-child(9) {
  top: 50%;
  left: 50%;
  animation: animate 6s linear infinite;
}
.wrapper div:nth-child(10) {
  top: 45%;
  left: 20%;
  animation: animate 10s linear infinite;
}
.wrapper div:nth-child(11) {
  top: 10%;
  left: 90%;
  animation: animate 9s linear infinite;
}
.wrapper div:nth-child(12) {
  top: 20%;
  left: 70%;
  animation: animate 7s linear infinite;
}
.wrapper div:nth-child(13) {
  top: 20%;
  left: 20%;
  animation: animate 8s linear infinite;
}
.wrapper div:nth-child(14) {
  top: 60%;
  left: 5%;
  animation: animate 6s linear infinite;
}
.wrapper div:nth-child(15) {
  top: 90%;
  left: 80%;
  animation: animate 9s linear infinite;
}
@keyframes animate {
  0% {
    transform: scale(0) translateY(0) rotate(70deg);
  }
  100% {
    transform: scale(1.3) translateY(-100px) rotate(360deg);
  }
}

</style>
