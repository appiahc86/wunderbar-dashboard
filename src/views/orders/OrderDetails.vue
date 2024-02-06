<script setup>
import {useRoute, useRouter} from "vue-router";
import {ref} from "vue";
import moment from "moment";
import axios from "@/axios";
import {useHomeStore} from "@/store/home";
import {currency, formatNumber, getStatus} from "@/functions";
import VueQrcode from "vue-qrcode";
import tinyPrint from "tiny-print";

const store = useHomeStore();
const route = useRoute();
const router = useRouter();
const loading = ref(false);
const order = ref([]);
const paymentMethod = ref(null);
const qr = ref('');
const confirmDeliverDialog = ref();

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
      paymentMethod.value = order?.value[0]?.paymentMethod;
      qr.value = `pizza-wunderbar-${route.params.id}`;
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
      printReceipt();
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


//Print receipt
const printReceipt = () => {
  const receipt = document.querySelector("#printTable");
  tinyPrint(receipt, {scanStyles: false, scanHTML: true});
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

        <button @click="router.back()" class="btn btn-sm btn-dark mt-2">
          <span class="pi pi-arrow-circle-left"></span> Zurück
        </button>

        <template v-if="order.length">

        <div class="order-status text-center">
          <h2>{{ getStatus(order[0].deliveryStatus) }}</h2>

          <p>
            {{ moment(order[0].orderDate).format("YYYY-MM-DD")}}
            | <b>{{ moment(order[0].orderDate).format("h:mm:ss a") }}</b></p>
          <h5 v-if="paymentMethod === 'cash'">
            Barzahlung
          </h5>
          <br>
        </div>


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
              <b>Name: </b>{{ order[0].deliveryAddress.name }}<br>
              <b>Straße: </b>{{ order[0].deliveryAddress.street }}<br>
              <b>Hausnummer: </b>{{ order[0].deliveryAddress.houseNumber }}<br>
              <b>Postleitzahl: </b>{{ order[0].deliveryAddress.postCode }} <br>
              <b>Etage: </b>{{ order[0].deliveryAddress.floor }} <br>
              <b>Stadt: </b>{{ order[0].deliveryAddress.town }} <br>
              <b>Telefonnummer: </b>{{ order[0].deliveryAddress.phone }} <br>
            </address>
          </div>

          <div class="row" v-if="order[0].note">
            <h5 class="mb-2 fw-bold">Notiz</h5>
            <p>
              {{ order[0].note }}
            </p>
          </div>

          <!--        Summary -->
          <div class="py-4 px-3 mt-3" style="background: #f3f0f0;">
            <h5 class="mb-2 fw-bold">Zusammenfassung</h5>
            <div class="row mb-2">
              <div class="col">Produkte</div>
              <div class="col" style="text-align: right;">
                {{ formatNumber(order[0].total - order[0].deliveryFee) }} {{ currency }}
              </div>
            </div>
            <div class="row mb-2">
              <div class="col">Lieferkosten</div>
              <div class="col" style="text-align: right;">
                {{ formatNumber(order[0].deliveryFee) }} {{ currency }}
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

            <button disabled v-if="deliverLoading" class="btn btn-sm btn-dark"
            ><span class="spinner-border spinner-border-sm"></span> Bitte warten</button>


            <button @click="deliverOrder" v-else class="btn btn-sm btn-dark"
                    :disabled="order[0].deliveryStatus === 'delivered' || order[0].paymentStatus !== 'successful'"
            ><span class="pi pi-print"></span>&nbsp;Drucken</button>

            <div v-if="order[0].paymentStatus !== 'successful'">
              <small class="text-danger">Die Zahlung ist noch nicht erfolgreich</small>
            </div>


          </div>

        </template> <!-- ./ if order.length       -->


        <template v-else>
          <h3 class="text-center mt-5">
            Leider wurde kein Datensatz gefunden
          </h3><br>
          <h1 class="text-center display-2">&#128549;</h1>
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




  <!-- Print table  -->
  <template>
    <div id="printTable" v-if="order[0]">
      <div>
        <div class="mt-0" style="font-size: 11px;">
          <span>
            {{ moment(order[0].orderDate).format("YYYY-MM-DD")}}
<!--            | <b>{{ moment(order[0].orderDate).format("h:mm:ss a") }}</b>-->
          </span>
          <b style="float: right;">#{{ route.params.id }}</b>
        </div>

        <div  style="font-size: 12px;" v-if="paymentMethod === 'cash'">
          Barzahlung <br>
        </div>

        <div style="text-align: center;">
          <div style="font-size: 13px"><b>Pizza Wunderbar</b></div>
          <div style="font-size: 11px">Frankfurter Straße 10 38122 Braunschweig</div>

<!--          <div style="font-size: 11px">0049xxxxxx / 0049xxxxxx</div>-->
        </div>

        <br>

        <template v-for="ord in order" :key="ord.orderDetailsId">
          <div class="row" style="font-size: 11px;">
            <div class="col">
              <span><b>{{ ord.qty }}x</b>&nbsp;</span>
              <span class="text-capitalize">{{ ord.menuItemName }}</span><br>
              <small class="text-muted" v-if="ord.choiceOf">( {{ ord.choiceOf }} )</small>
            </div>
            <div class="col" style="text-align: right;">
              {{ formatNumber(ord.price * ord.qty) }} {{ currency }}
            </div>
          </div>
<!--          <br>-->
          <hr style="margin: 4px 0 2px 0 !important;">
        </template>


            <!--    Delivery Address    -->
        <address style="font-size: 11px;">
          <br>
          <b>Name: </b>{{ order[0].deliveryAddress.name }}<br>
          <b>Straße: </b>{{ order[0].deliveryAddress.street }}<br>
          <b>Hausnummer: </b>{{ order[0].deliveryAddress.houseNumber }}<br>
          <b>Postleitzahl: </b>{{ order[0].deliveryAddress.postCode }} <br>
          <b>Etage: </b>{{ order[0].deliveryAddress.floor }} <br>
          <b>Stadt: </b>{{ order[0].deliveryAddress.town }} <br>
          <b>Telefonnummer: </b>{{ order[0].deliveryAddress.phone }} <br>
        </address>

        <div class=""  v-if="order[0].note" style="font-size: 11px; text-align: center">
          <br>
          <div>Notiz</div>
          <div>{{order[0].note}}</div>
        </div>

        <div style="font-size: 12px !important">
          <div style="float: right;">Produkte:  {{ formatNumber(order[0].total - order[0].deliveryFee) }} {{ currency }}</div> <br>
          <div style="float: right;">Lieferkosten:  {{ formatNumber(order[0].deliveryFee) }} {{ currency }}</div> <br>
          <div style="float: right;"><b>Gesamt: {{ formatNumber(order[0].total) }} {{ currency }}</b></div>
        </div><br>


        <div  style="text-align: center;">
          <vue-qrcode :value="qr" type="image/png" :color="{dark: '#000000ff'}"></vue-qrcode>
        </div>

      </div>
    </div>
  </template>




</template>

<style scoped>

</style>