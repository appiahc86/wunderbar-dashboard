<script setup>
import axios from "@/axios";
import {reactive, ref} from "vue";
import {useHomeStore} from "@/store/home";
import {formatNumber, currency} from "@/functions";

const store  = useHomeStore();
const loading = ref(false);
const users = ref(0);
const todayOrders = ref(0);
const totalMenuItems = ref(0);


const barChartRecords = ref([]);


//Barchart data
const barChartOptions = reactive({
  chart: {
    id: 'bar-chart',
  },
  plotOptions: {
    bar: {
      distributed: true
    }
  },
  colors: [
    "rgba(255,99,132,0.7)", "rgba(175, 159, 64, 0.7)", "rgba(255, 205, 86, 0.7)", "rgba(75, 192, 192, 0.7)",
    "rgba(25, 119,132, 0.7)","rgba(125, 99,192, 0.7)", "rgba(67,87,215, 0.7)", "rgba(128, 12, 128, 0.7)",
    "rgba(200,199,12,0.89)", "rgba(100, 110,152, 0.7)",
  ],
  dataLabels: {
    enabled: true
  },
  title: {
    text: 'Das meistverkaufte Menü von heute',
    align: 'left'
  },
  xaxis: {
    categories: []
  }
})
const barChartSeries = reactive([
  {
    name: 'Menü',
    data: []
  }
])


//Get data
const getData = async () => {
  try {
    loading.value = true;
    const response = await  axios.get('/admin/dashboard',
        {
          headers: { 'Authorization': `Bearer ${store.user.token}`}
        }
    )

    if (response.status === 200){
      users.value = response.data.users;
      todayOrders.value = response.data.todayOrders;
      totalMenuItems.value = response.data.totalMenuItems;
      barChartRecords.value = response.data.barChartRecords;

      //Populate Barchart data
      if (barChartRecords.value.length){
        for (const chartRecord of barChartRecords.value) {
          barChartOptions.xaxis.categories.push(chartRecord.name);
          barChartSeries[0].data .push(chartRecord.sum);
        }
      }

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

getData();


</script>

<template>

<div class="container-fluid">

  <div class="row mb-3">

    <h4 class="text-black-50 my-3 text-uppercase"><b>Armaturenbrett</b></h4>
            <!--Total Users-->
    <div class="col-md-6 col-lg-4 mb-3">
      <div class="card shadow h-100 py-2 border-primary border-4 border-bottom-0 border-top-0 border-end-0">
        <div class="card-body">
          <div class="row no-gutters align-items-center">
            <div class="col mr-2">
              <div class="text-xs fw-bold text-primary mb-1 text-uppercase" style="font-size: 0.9em;">Anzahl der Nutzer</div>
               <div class="h6 mb-0 fw-bold" v-if="loading">
                <span class="spinner-border spinner-border-sm"></span> loading...</div>
              <div class="h6 mb-0 fw-bold">&nbsp; {{ users.toLocaleString() }}</div>
            </div>
            <div class="col-auto">
              <span class="text-black-50" style="font-size: 250%">&#128101;</span>
            </div>
          </div>
        </div>
      </div>
    </div>


    <!-- Total menu items -->
    <div class="col-md-6 col-lg-4 mb-3">
      <div class="card shadow h-100 py-2 border-danger border-4 border-bottom-0 border-top-0 border-end-0">
        <div class="card-body">
          <div class="row no-gutters align-items-center">
            <div class="col mr-2">
              <div class="text-xs fw-bold text-uppercase text-danger mb-1" style="font-size: 0.9em;">Gesamtmenge der Menüpunkte</div>
              <div class="h6 mb-0 fw-bold" v-if="loading">
                <span class="spinner-border spinner-border-sm"></span> loading...</div>
              <div class="h6 mb-0 fw-bold"> {{ totalMenuItems.toLocaleString() }}</div>
            </div>
            <div class="col-auto">
              <span style="font-size: 250%">&#127869;</span>
            </div>
          </div>
        </div>
      </div>
    </div>

                  <!-- Today's Orders -->
    <div class="col-md-6 col-lg-4 mb-3">
      <div class="card shadow h-100 py-2 border-warning border-4 border-bottom-0 border-top-0 border-end-0">
        <div class="card-body">
          <div class="row no-gutters align-items-center">
            <div class="col mr-2">
              <div class="text-xs fw-bold text-uppercase mb-1" style="font-size: 0.9em; color: darkgoldenrod">HEUTE BESTELLUNGEN</div>
              <div class="h6 mb-0 fw-bold" v-if="loading">
                <span class="spinner-border spinner-border-sm"></span> loading...
              </div>
              <div class="h6 mb-0 fw-bold"> {{ formatNumber(todayOrders) }} {{ currency }}</div>
            </div>
            <div class="col-auto">
              <span class="" style="font-size: 250%">&#128181;</span>
            </div>
          </div>
        </div>
      </div>
    </div>


  </div>


  <!--    Chart area -->
  <div class="row mt-4">
    <div class="col-12 mt-4">
      <div class="card shadow mb-1">
        <div class="card-body">
          <apexchart height="300" type="bar" :series="barChartSeries" :options="barChartOptions"></apexchart>
        </div>
      </div>
    </div>
<!--    <div class="col-4 mt-4">-->
<!--      <div class="card mb-1 shadow">-->
<!--        <div class="card-body">-->
<!--          <apexchart height="300" type="donut" :options="chartOptions" :series="pieChartSeries"></apexchart>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
  </div>


  </div>

</template>

<style scoped>

</style>