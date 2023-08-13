<script setup>
import Button from "primevue/button";
import axios from "@/axios";
import {reactive, ref} from "vue";
import { useHomeStore } from "@/store/home";
import {useRouter} from "vue-router";

const router = useRouter();
const store = useHomeStore();
const showPassword = ref(false);
const error = ref('');
const loading = ref(false);
const formData = reactive({
  currentPassword: '', password: '', password_confirmation: ''
})

//.............Change Password..................
const changePassword = async () => {

  try {
    loading.value = true;
    error.value = "";

    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])(?!.*\s).{8,}$/

    //Validation
    if (!formData.currentPassword.trim()) return error.value = "Current password field is required";
    if (!formData.password.trim()) return error.value = "New password field is required";
    if (formData.password !== formData.password_confirmation) return error.value = "Passwords do not match";
    if (!formData.password.match(regex)) return error.value = "Password does not meet requirements";


    //Send Data To Server
    const response = await  axios.post(
        '/admin/users/auth/change-password',
        JSON.stringify({...formData, password_confirmation: undefined}),
        {
          headers: { 'Authorization': `Bearer ${store.token}`}
        }
    )

    if (response.status === 200) {
      store.clearToken();
      store.clearUser();
      toast.add({severity:'success', summary: 'Success', detail:'Your Password has been changed', life: 4000});
      return router.push({name: 'login'});
    }


  }catch (e) {
    if (e.response) return error.value = e.response.data;
    if (e.request && e.request.status === 0) {
      return error.value = 'Sorry, Connection to Server refused. Please check your internet connection or try again later';
    }

    return error.value = 'Sorry, something went wrong. Please try again later';

  }finally { loading.value = false; }

}



</script>

<template>
  <h4 class="text-center mt-4"><span class="pi pi-lock"></span> Reset Password</h4>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4">

          <p v-if="error" class="text-danger">{{ error }}</p>

        <form @submit.prevent="changePassword">
          <input :type="showPassword? 'text' : 'password'" class="form-control shadow-none" placeholder="Current Password"
          v-model="formData.currentPassword"><br>
          <input :type="showPassword? 'text' : 'password'" class="form-control shadow-none" placeholder="New Password"
          v-model="formData.password"><br>
          <input :type="showPassword? 'text' : 'password'" class="form-control shadow-none" placeholder="Confirm Password"
          v-model="formData.password_confirmation">
          <div class="form-check mb-3 mt-2">
            <input class="form-check-input" id="showResetPassword" type="checkbox" v-model="showPassword">
            <label class="form-check-label" for="showResetPassword">
              Show Password
            </label>
          </div>
          <div class="text-center">
            <Button label="Reset" type="submit" :loading="loading" loadingIcon="spinner-border spinner-border-sm"
                    class="p-button p-button-rounded"/>
          </div>
          <div class="text-center mt-3">
            <ol class="text-muted">
              <li><small>Password length must be more than 7 characters.</small></li>
              <li><small>Password must contain at least 1 Lowercase and 1 Uppercase.</small></li>
              <li><small>Password must contain at least 1 special character and 1 number.</small></li>
            </ol>
          </div>

        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>


</style>