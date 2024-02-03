<script setup>
import { useHomeStore } from "@/store/home";
import {ref} from "vue";
import {useRouter} from "vue-router";

const store = useHomeStore();
const router = useRouter();

const val = ref(null);

</script>

<template>
<div class="text-center mt-3 d-flex">
  <h3 class="mb-3">Willkommen
    <span class="fw-bold text-uppercase" translate="no">
      {{ store.user.name }}
    </span></h3>

    <button class="center-me" @click="router.push({name: 'scan-receipt'})"
            v-if="store.isDeliveryPerson">QR-Code scannen</button>


</div>

</template>

<style scoped>

.center-me {
  position: absolute;
  top: 50%;
  left: 50%;
}

@media screen and (max-width: 600px){
  .center-me {
    left: 35% !important;
  }
}

</style>