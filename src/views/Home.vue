<script setup>
import { useHomeStore } from "@/store/home";
import {ref} from "vue";
const store = useHomeStore();

const val = ref(null);
const onDecode = (data) => {
  val.value = data
}
// import { QrStream, QrCapture, QrDropzone } from 'vue3-qr-reader'
// import { StreamBarcodeReader, ImageBarcodeReader  } from "@teckel/vue-barcode-reader";

import { QrStream, QrCapture, QrDropzone } from 'vue3-qr-reader';


</script>

<template>
<div class="text-center mt-3">
  <h3 class="mb-3">Willkommen
    <span class="fw-bold text-uppercase" translate="no">
      {{ store.user.name }}
    </span></h3>



  <div class="stream">
    <qr-stream @decode="onDecode" class="mb">
      <div style="color: red;" class="frame"></div>
    </qr-stream>
  </div>
  <div class="result">
    Result: {{val}}
  </div>

</div>

</template>

<style scoped>


</style>