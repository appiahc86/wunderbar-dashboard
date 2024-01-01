<script setup>
import { currency } from "@/functions";
import { reactive, ref } from "vue";
import axios from "@/axios";
import { useHomeStore } from "@/store/home";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const store = useHomeStore();
const loading = ref(false);
const formData = reactive({id: null, zipCode: null, town: null, minOrder: null, deliveryFee: null});

const loadData = async () => {
  try {

    loading.value = true;

    const response = await  axios.post('/admin/zipcodes/view',
        JSON.stringify({id: route.params.id}),
        {
          headers: {
            'Authorization': `Bearer ${store.user.token}`
          }
        }
    )

    if (response.status === 200){
      formData.id = response.data.zipcode[0].id;
      formData.zipCode = response.data.zipcode[0].zipCode;
      formData.town = response.data.zipcode[0].town;
      formData.minOrder = response.data.zipcode[0].minOrder;
      formData.deliveryFee = response.data.zipcode[0].deliveryFee;
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
loadData();


const saveData = async () => {
  try {

    loading.value = true;

    const response = await  axios.post('/admin/zipcodes/edit',
        JSON.stringify(formData),
        {
          headers: {
            'Authorization': `Bearer ${store.user.token}`
          }
        }
    )

    if (response.status === 200){
      router.push({name: 'zipcodes'});
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
      <h4 class="text-center">Postleitzahl bearbeiten</h4>
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