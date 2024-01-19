<script setup>
import { useHomeStore } from "@/store/home";
import {ref} from "vue";
import { QrStream, QrCapture, QrDropzone } from 'vue3-qr-reader';

const store = useHomeStore();

let val = null;
const onDecode = (data) => {
  val = data;
  alert(val);
}




</script>

<template>
  <div class="text-center mt-3 d-flex">


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