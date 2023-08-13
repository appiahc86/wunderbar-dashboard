<script setup>
import axios from "@/axios";
import {ref} from "vue";
const loading = ref(false);
import {useHomeStore} from "@/store/home";
import {formatNumber} from "@/functions";

const store  = useHomeStore();

const userCount = ref(0);
const deposits = ref(0);
const withdrawals = ref(0);
const annualWinnings = ref(0);

//Get data
const getData = async () => {
  try {
    loading.value = true;
    const response = await  axios.get('/admin/dashboard',
        {
          headers: { 'Authorization': `Bearer ${store.token}`}
        }
    )

    if (response.status === 200){
      userCount.value = response.data.userCount;
      deposits.value = response.data.deposits;
      withdrawals.value = response.data.withdrawals;
      annualWinnings.value = response.data.annualWinnings;
    }

  }catch (e) {
    console.log(e.message)
    if (e.response) return toast.add({severity:'warn', summary: 'Error', detail: `${e.response.data}`, life: 4000});
    if (e.request && e.request.status === 0) {
      return toast.add({severity:'error', summary: 'Error',
        detail: `Sorry, Connection to Server refused. Please check your internet connection or try again later`,
        life: 4000});
    }

    return toast.add({severity:'warn', summary: 'Error', detail: 'Sorry, something went wrong. Please try again later',
      life: 4000});
  }finally { loading.value = false; }

}

getData();


</script>

<template>

<div class="container-fluid">

  <div class="row mb-3">

    <h4 class="text-black-50 my-3"><b>DASHBOARD</b></h4>
            <!--Products-->
    <div class="col-md-6 col-lg-3 mb-3">
      <div class="card shadow h-100 py-2 border-primary border-4 border-bottom-0 border-top-0 border-end-0">
        <div class="card-body">
          <div class="row no-gutters align-items-center">
            <div class="col mr-2">
              <div class="text-xs fw-bold text-primary mb-1" style="font-size: 0.9em;">USERS COUNT</div>
               <div class="h6 mb-0 fw-bold" v-if="loading">
                <span class="spinner-border spinner-border-sm"></span> loading...</div>
              <div class="h6 mb-0 fw-bold">&nbsp; {{ userCount.toLocaleString() }}</div>
            </div>
            <div class="col-auto">
              <span class="text-black-50" style="font-size: 250%">&#128101;</span>
            </div>
          </div>
        </div>
      </div>
    </div>
                  <!-- Purchases -->
    <div class="col-md-6 col-lg-3 mb-3">
      <div class="card shadow h-100 py-2 border-warning border-4 border-bottom-0 border-top-0 border-end-0">
        <div class="card-body">
          <div class="row no-gutters align-items-center">
            <div class="col mr-2">
              <div class="text-xs fw-bold mb-1" style="font-size: 0.9em; color: darkgoldenrod">ANNUAL WINNINGS</div>
              <div class="h6 mb-0 fw-bold" v-if="loading">
                <span class="spinner-border spinner-border-sm"></span> loading...
              </div>
              <div class="h6 mb-0 fw-bold">GH¢ {{ formatNumber(annualWinnings) }}</div>
            </div>
            <div class="col-auto">
              <span class="" style="font-size: 250%">&#128179;</span>
            </div>
          </div>
        </div>
      </div>
    </div>


    <div class="col-md-6 col-lg-3 mb-3">
      <div class="card shadow h-100 py-2 border-danger border-4 border-bottom-0 border-top-0 border-end-0">
        <div class="card-body">
          <div class="row no-gutters align-items-center">
            <div class="col mr-2">
              <div class="text-xs fw-bold text-danger mb-1" style="font-size: 0.9em;">TODAY'S WITHDRAWALS</div>
               <div class="h6 mb-0 fw-bold" v-if="loading">
                <span class="spinner-border spinner-border-sm"></span> loading...</div>
              <div class="h6 mb-0 fw-bold">GH¢ {{ formatNumber(withdrawals) }}</div>
            </div>
            <div class="col-auto">
              <span style="font-size: 250%">&#128176;</span>
            </div>
          </div>
        </div>
      </div>
    </div>

                   <!-- Annual Sales -->
    <div class="col-md-6 col-lg-3 mb-3">
      <div class="card shadow h-100 py-2 border-success border-4 border-bottom-0 border-top-0 border-end-0">
        <div class="card-body">
          <div class="row no-gutters align-items-center">
            <div class="col mr-2">
              <div class="text-xs fw-bold text-success mb-1" style="font-size: 0.9em;">TODAY'S DEPOSITS</div>
              <div class="h6 mb-0 fw-bold" v-if="loading">
                <span class="spinner-border spinner-border-sm"></span> loading...</div>
              <div class="h6 mb-0 fw-bold">GH¢ {{ formatNumber(deposits) }}</div>
            </div>
            <div class="col-auto">
                <span style="font-size: 250%">
                  &#128181;
                </span>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
  </div>

</template>

<style scoped>


</style>