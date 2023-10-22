<script setup>
import {useRoute, useRouter} from "vue-router";
import {ref} from "vue";
import moment from "moment";
import axios from "@/axios";
import {useHomeStore} from "@/store/home";
import {currency, formatNumber, getStatus} from "@/functions";

const store = useHomeStore();
const route = useRoute();
const router = useRouter();
const loading = ref(false);
const order = ref([]);

const confirmDeliverDialog = ref();
const confirmCancelDialog = ref();
const confirmMarkAsDelivered = ref();

const cancelLoading = ref(false);
const deliverLoading = ref(false);

const getOrder = async () => {
  try {

    loading.value = true;

    const response = await  axios.post('/admin/orders/details',
        {id: route.params.id},
        {
          headers: { 'Authorization': `Bearer ${store.user.token}`}
        }
    )

    if (response.status === 200) {
      order.value = response.data;
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
  }finally {
    loading.value = false;
  }
}

getOrder();


//Cancel Order
const cancelOrder = async () => {
  try {

    cancelLoading.value = true;

    const response = await axios.post("/admin/orders/cancel",
        {id: route.params.id},
        {
          headers: { 'Authorization': `Bearer ${store.user.token}`}
        }
    )

    if (response.status === 200){
      confirmCancelDialog.value.close();
      toast.add({severity:'success', detail: 'Erfolg', life: 4000});
      router.push({name: 'orders'});
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
  }finally {
    cancelLoading.value = false;
  }
}


//Send Order
const deliverOrder = async () => {
  try {

    deliverLoading.value = true;

    const response = await axios.post("/admin/orders/send",
        {id: route.params.id},
        {
          headers: { 'Authorization': `Bearer ${store.user.token}`}
        }
    )

    if (response.status === 200){
      confirmDeliverDialog.value.close();
      toast.add({severity:'success', detail: 'Erfolg', life: 4000});
      router.push({name: 'orders'});
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
  }finally {
    deliverLoading.value = false;
  }
}


//Mark as delivered
const markAsDelivered = async () => {
  try {

    deliverLoading.value = true;

    const response = await axios.post("/admin/orders/delivered",
        {id: route.params.id},
        {
          headers: { 'Authorization': `Bearer ${store.user.token}`}
        }
    )

    if (response.status === 200){
      confirmMarkAsDelivered.value.close();
      toast.add({severity:'success', detail: 'Erfolg', life: 4000});
      router.push({name: 'delivering-orders'});
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
  }finally {
    deliverLoading.value = false;
  }
}

</script>

<template>
<div class="container">
  <div class="row justify-content-center">
    <div class="col-lg-8">


      <div v-if="loading">
        <h5 class="text-center my-4"><span class="spinner-border"></span></h5>
      </div>

      <!--      Else -->
      <div v-else>

        <div class="order-status text-center">
          <h2>{{ getStatus(order[0].deliveryStatus) }}</h2>

          <p>{{ moment(order[0].orderDate).format("YYYY-MM-DD")}}
            | {{ moment(order[0].orderDate).format("h:mm:ss a") }}</p>
        </div>


        <template v-if="order.length">
          <h5 class="mb-2 fw-bold">Deine Bestellung</h5>
          <template v-for="ord in order" :key="ord.orderDetailsId">
            <div class="row">
              <div class="col-2"><b>{{ ord.qty }}x</b></div>
              <div class="col">
                <span class="text-capitalize">{{ ord.menuItemName }} </span><br>
                <small class="text-muted" v-if="ord.choiceOf">{{ ord.choiceOf }}</small>
                <small class="text-light" v-else>.</small>
              </div>
              <div class="col" style="text-align: right;">
                {{ formatNumber(ord.price * ord.qty) }} {{ currency }}
              </div>
            </div>
            <hr>
          </template>

          <div class="row">
            <h5 class="mb-2 fw-bold">Lieferdetails</h5>
            <address class="fst-italic">
              <span class="pi pi-map-marker"></span>
              Straße: {{ order[0].deliveryAddress.street }}<br>
              Hausnummer: {{ order[0].deliveryAddress.houseNumber }}<br>
              Postleitzahl: {{ order[0].deliveryAddress.postCode }} <br>
              Etage: {{ order[0].deliveryAddress.floor }} <br>
              Stadt: {{ order[0].deliveryAddress.city }} <br>
              Telefonnummer: {{ order[0].deliveryAddress.phone }} <br>
              Anmerkung: {{ order[0].note }} <br>
            </address>
          </div>

          <div class="row" v-if="order[0].note">
            <h5 class="mb-2 fw-bold">Anmerkung</h5>
            <p>
              {{ order[0].note }}
            </p>
          </div>

          <!--        Summary -->
          <div class="py-4 px-3 mt-3" style="background: #f3f0f0;">
            <h5 class="mb-2 fw-bold">Zusammenfassung</h5>
            <div class="row mb-2">
              <div class="col">Lieferkosten</div>
              <div class="col" style="text-align: right;">
                {{ formatNumber(order[0].deliveryFee) }} {{ currency }}
              </div>
            </div>
            <div class="row mb-2">
              <div class="col">Produkte</div>
              <div class="col" style="text-align: right;">
                {{ formatNumber(order[0].total - order[0].deliveryFee) }} {{ currency }}
              </div>
            </div>
            <div class="row mb-2">
              <div class="col"><b>Gesamt</b></div>
              <div class="col" style="text-align: right;">
                {{ formatNumber(order[0].total) }} {{ currency }}
              </div>
            </div>
          </div>

          <div class="text-center my-5">
            <button class="btn btn-primary me-4 mb-3" v-if="order[0].deliveryStatus === 'waiting'"
            @click="confirmDeliverDialog.showModal()">liefern</button>
            <button class="btn btn-primary me-4 mb-3" v-else
            @click="confirmMarkAsDelivered.showModal()">Als geliefert markieren</button>
            <button class="btn btn-danger mb-3"
                    @click="confirmCancelDialog.showModal()">Stornieren</button>
          </div>

        </template>
      </div>

    </div>
  </div>
</div>



  <!--      Confirm deliver dialog    -->
  <dialog ref="confirmDeliverDialog" style="border: none;" class="p-5 pt-3">

      <button class="text-white bg-danger float-end mb-2"
              @click="confirmDeliverDialog.close()">X</button>
    <div class="clearfix"></div>
    <p>
      Sie sind dabei, diese Bestellung an den Kunden zu senden
    </p>
    <h6 class="text-center mt-3">Sind Sie sicher, dass Sie dies tun möchten?</h6>
    <div class="text-center">
      <button class="btn btn-success btn-sm" disabled v-if="deliverLoading">
        <span class=" spinner-border spinner-border-sm"></span> Bitte warten</button>
      <button v-else class="btn btn-success btn-sm" @click="deliverOrder">Fortfahren</button>
    </div>
  </dialog>



  <!--      Confirm cancel dialog    -->
  <dialog ref="confirmCancelDialog" style="border: none;" class="p-5 pt-3">
    <button class="text-white bg-danger float-end mb-2"
            @click="confirmCancelDialog.close()">X</button>
    <div class="clearfix"></div>
    <p>
      Durch diese Aktion wird die Bestellung storniert
    </p>
    <h6 class="text-center mt-3">Sind Sie sicher, dass Sie dies tun möchten?</h6>
    <div class="text-center">
      <button class="btn btn-success btn-sm" disabled v-if="cancelLoading">
        <span class=" spinner-border spinner-border-sm"></span> Bitte warten</button>
      <button v-else class="btn btn-success btn-sm" @click="cancelOrder">Fortfahren</button>
    </div>
  </dialog>



  <!--      Confirm Mark as delivered dialog    -->
  <dialog ref="confirmMarkAsDelivered" style="border: none;" class="p-5 pt-3">
    <button class="text-white bg-danger float-end mb-2"
            @click="confirmMarkAsDelivered.close()">X</button>
    <div class="clearfix"></div>
    <p>
      Schließen Sie die Lieferung ab
    </p>
    <h6 class="text-center mt-3">Sind Sie sicher, dass Sie dies tun möchten?</h6>
    <div class="text-center">
      <button class="btn btn-success btn-sm" disabled v-if="cancelLoading">
        <span class=" spinner-border spinner-border-sm"></span> Bitte warten</button>
      <button v-else class="btn btn-success btn-sm" @click="markAsDelivered">Fortfahren</button>
    </div>
  </dialog>

</template>

<style scoped>

</style>