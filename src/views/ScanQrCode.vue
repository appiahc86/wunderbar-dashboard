<script setup>
import { useHomeStore } from "@/store/home";
import {ref} from "vue";
import { QrStream, QrCapture, QrDropzone } from 'vue3-qr-reader';
import axios from "@/axios";
import {useRouter} from "vue-router";

const store = useHomeStore();
const router = useRouter();
const loading = ref(false);
let val = null;
const onDecode = (data) => {
  val = data;
 sentToServer();
}

const sentToServer = async () => {
  try {
    loading.value = true;
    return alert(val)
    const response = await axios.get('/admin/scan',
        {
          headers: {'Authorization': `Bearer ${store.user.token}`}
        }
    )

    if (response.status === 200) {
       return toast.add({severity: 'warn', detail: 'Erfolg', life: 6000})
    }


  } catch (e) {
    if (e.response) return toast.add({severity: 'warn', detail: `${e.response.data}`, life: 6000});
    if (e.request && e.request.status === 0) {
      return toast.add({
        severity: 'error',
        detail: `Leider wurde die Verbindung zum Server abgelehnt. Bitte überprüfen Sie Ihre Internetverbindung oder versuchen Sie es später erneut`,
        life: 7000
      });
    }

    return toast.add({
      severity: 'warn', detail: 'Entschuldigung, etwas ist schief gelaufen. Bitte versuchen Sie es später noch einmal',
      life: 6000
    });
  } finally {
    loading.value = false;
    router.push({name: 'home'});
  }
}




</script>

<template>
  <div class="text-center mt-3 d-flex">


      <div class="stream">
        <qr-stream @decode="onDecode" class="mb">
          <div style="color: red;" class="frame"></div>
        </qr-stream>
      </div>


  </div>

</template>

<style scoped>

</style>