<script setup>
import { useHomeStore } from "@/store/home";
import {onMounted, ref} from "vue";
import { QrStream, QrCapture, QrDropzone } from 'vue3-qr-reader';
import axios from "@/axios";
import {useRouter} from "vue-router";

const store = useHomeStore();
const router = useRouter();
const loading = ref(false);
const loadingDialog = ref(null);

const onDecode = (data) => {

 sentToServer(data);

}

const sentToServer = async (code) => {
  try {
    loading.value = true;
    loadingDialog.value.showModal();

    //validation
    if (!code) {
      return toast.add({severity: 'warn',
        detail: 'QRcode-Informationen wurden nicht erfasst', life: 6000})
    }
    if (!code.startsWith("pizza-wunderbar-")){
      return toast.add({severity: 'warn',
        detail: 'Leider ist dies keine gültige Bestellnummer', life: 6000})
    }

    code = code.replace("pizza-wunderbar-", "");

    const response = await axios.post('/admin/qrcode/scan',
        {code},
        {
          headers: {'Authorization': `Bearer ${store.user.token}`}
        }
    )

    if (response.status === 200) {
       return toast.add({severity: 'success', detail: 'Erfolg', life: 6000})
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
    loadingDialog.value.close();
    router.push({name: 'home'});
  }
}



</script>

<template>
  <div class="text-center mt-3 d-flex">


      <dialog ref="loadingDialog" class="text-center bg-transparent"
              style="border: transparent;">
        <span class="spinner spinner-border"></span>
      </dialog>


      <div class="stream" v-if="!loading">
        <qr-stream @decode="onDecode" class="mb">
          <div style="color: red;" class="frame"></div>
        </qr-stream>
      </div>


  </div>

</template>

<style scoped>

</style>