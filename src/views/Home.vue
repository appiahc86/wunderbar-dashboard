<script setup>
import { useHomeStore } from "@/store/home";
const store = useHomeStore();

</script>

<template>
<div class="text-center mt-3">
  <h3 class="mb-3">Willkommen
    <span class="fw-bold text-uppercase">
      {{ store.user.name }}
    </span></h3>
</div>

</template>

<style scoped>


</style>