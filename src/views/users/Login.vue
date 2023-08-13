<script setup>
import {ref, onMounted, reactive} from "vue";
import Button from "primevue/button";
import { useRouter, onBeforeRouteLeave } from "vue-router";
import { useHomeStore } from "@/store/home";
import axios from "@/axios";

const closeModal = ref();
const openModal = ref();
const loading = ref(false);
const loginError = ref('');
const showPassword = ref(false);
const store = useHomeStore();
const router = useRouter();

const loginData = reactive({    // Login Form Data
  phoneNumber: null, password: ""
})

//on mounted hook show modal
onMounted(() => {
  if (store.token) return router.push({name: 'home'});
  openModal.value.click();
})

//Close modal before leaving this page
onBeforeRouteLeave( (to, from, next) => {
  closeModal.value.click();
  next();
})

//Validate phone number
const validatePhoneNumber = (e) => {
  e.target.value = e.target.value.replace(/[^0-9]/g, '');
  e.target.value = e.target.value.replace(/(\..*)\./g, '$1');
}

// .................Login.................
const login = async () => {
  try {
    loading.value = true;
    loginError.value = "";
    //Validation
    if (!loginData.phoneNumber) return loginError.value = "Please enter phone number";
    if (loginData.phoneNumber.toString().length  !== 9) return loginError.value = "Please check phone number";
    if (!loginData.password.trim()) return loginError.value = "Please provide a password";
    //Send Data To Server
    const response = await  axios.post(
        '/admin/users/auth/login',
        JSON.stringify(loginData),
    )

    if (response.status === 200) {
      store.setToken(response.data.token);
      store.setUser(response.data.user);
      return router.push({name: 'home'});
    }



  } catch (e) {
    if (e.response) return loginError.value = e.response.data;
    if (e.request && e.request.status === 0) {
      return loginError.value = 'Sorry, Connection to Server refused. Please check your internet connection or try again later';
    }

    return loginError.value = 'Sorry, something went wrong. Please try again later';

  } finally { loading.value = false; }

}

</script>

<template>

  <!--  this button launches the modal -->
  <button type="button" ref="openModal" class="d-none mt-5 mb-5" data-bs-toggle="modal" data-bs-target="#authModal"></button>

  <!-- Modal -->
  <div class="modal" id="authModal" tabindex="-1" data-bs-keyboard="false" aria-labelledby="authModal" aria-hidden="true">
    <div class="modal-dialog modal-fullscreen">
      <div class="modal-content">
        <div class="modal-body"  style="background: #ccc;">

          <div class="wrapper w-100">

            <section class="form-wrapper w-100 px-4">

              <h3 class="text-center mb-3 fw-bold">Admin Login <span>&#128274;</span></h3>
              <section class="container-fluid">
                <section class="row justify-content-center">
                  <section class="col-md-6 col-lg-4">
                    <form @submit.prevent="login">
                      <template v-if="loginError">
                        <p class="text-warning text-center" id="errorMessage">{{ loginError }}</p>
                      </template>
                      <section class="input-group">
                        <section class="input-group-prepend">
                          <section class="input-group-text p-2">E-mail</section>
                        </section>
                        <input type="tel" class="form-control shadow-none p-2" maxlength="10" v-model.number="loginData.phoneNumber"
                               @input="validatePhoneNumber">
                      </section>

                      <br>
                      <input :type="showPassword ? 'text' : 'password'" class="form-control shadow-none p-2"
                             v-model="loginData.password" placeholder="Password">

                      <section class="form-check mt-3">
                        <input class="form-check-input mx-auto" id="showPassword" type="checkbox" v-model="showPassword">
                        <label class="form-check-label" for="showPassword">
                          &nbsp;Show Password
                        </label>
                      </section>

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
          <!-- this button closes the modal -->
          <button type="button" class="d-none" data-bs-dismiss="modal" ref="closeModal"></button>
        </div>
      </div>
    </div>
  </div>



</template>


<style scoped>
* {
  margin: 0;
  padding: 0;
}
.wrapper {
  height: 100%;
  width: 100%;
  background: linear-gradient(180deg, #04fafd, 5%, #119dff, 50%, #030423);
  position: absolute;
  overflow: hidden;
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