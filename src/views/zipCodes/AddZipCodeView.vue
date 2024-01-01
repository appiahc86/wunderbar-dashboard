<script setup>
import { currency } from "@/functions";
import { reactive, ref } from "vue";
import axios from "@/axios";
import { useHomeStore } from "@/store/home";
import { useRouter } from "vue-router";

const router = useRouter();
const store = useHomeStore();
const loading = ref(false);
const formData = reactive({zipCode: null, town: "Braunschweig", minOrder: null, deliveryFee: null});

const saveData = async () => {
  try {

    loading.value = true;

    const response = await  axios.post('/admin/zipcodes',
        JSON.stringify(formData),
        {
          headers: {
            'Authorization': `Bearer ${store.user.token}`
          }
        }
    )

    if (response.status === 201){
      // router.push({name: 'zipcodes'});
      formData.zipCode = null;
      formData.town = "Braunschweig";
      formData.minOrder = null;
      formData.deliveryFee = null;
    }

  }catch (e) {
    if (e.response) return toast.add({severity:'warn', detail: `${e.response.data}`, life: 4000});
    if (e.request && e.request.status === 0) {
      return toast.add({severity:'error',
        detail: `Leider wurde die Verbindung zum Server abgelehnt. Bitte überprüfen Sie Ihre Internetverbindung oder versuchen Sie es später erneut`,
        life: 4000});
    }

    return toast.add({severity:'warn', detail: 'Entschuldigung, etwas ist schief gelaufen. Bitte versuchen Sie es später noch einmal',
      life: 4000});
  }finally { loading.value = false; }
}


</script>

<template>
<div class="container my-5">
  <div class="row justify-content-center">
    <h4 class="text-center">Postleitzahl hinzufügen</h4>
    <div class="col-md-10 col-lg-6">
      <form @submit.prevent="saveData">
        <small>Postleitzahl</small>
        <input type="number" placeholder="Postleitzahl" v-model="formData.zipCode"
               class="form-control mb-2 shadow-none" required>

        <small>Stadt</small>
        <input type="text" placeholder="Postleitzahl" v-model.trim="formData.town"
               class="form-control mb-2 shadow-none" required>

        <small>Min Bestell Wert</small>
        <div class="input-group mb-2">
          <div class="input-group-text">
           {{ currency }}
          </div>
          <input type="number" v-model="formData.minOrder" min="0" step="0.01" required
                 placeholder="Min Bestell Wert" class="form-control shadow-none">
        </div>

        <small>Anfahrtkosten</small>
        <div class="input-group mb-2">
          <div class="input-group-text">
            {{ currency }}
          </div>
          <input type="number" v-model="formData.deliveryFee" min="0" step="0.01" required
                 placeholder="Anfahrtkosten" class="form-control shadow-none">
        </div>

        <div class="text-center">
          <button class="btn btn-primary" disabled v-if="loading">
            <span class=" spinner-border spinner-border-sm"></span>&nbsp;Bitte warten</button>
          <button class="btn btn-primary" v-else>
            <span class="pi pi-save"></span>&nbsp;Einreichen
          </button>
        </div>

      </form>
    </div>
  </div>
</div>
</template>

<style scoped>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
</style>