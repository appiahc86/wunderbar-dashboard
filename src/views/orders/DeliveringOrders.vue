<script setup>
import axios from "@/axios";
import { ref } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Paginator from "primevue/paginator";
import { useHomeStore } from "@/store/home";
import moment from "moment";
import { formatNumber, currency } from "@/functions";
import { useRouter } from "vue-router";

const page = ref(1);
const loading = ref(false);
const pageSize = ref(10);
const totalRecords = ref(0);
const orders = ref([]);
const store = useHomeStore();
const router = useRouter();
const orderId = ref(null);

//Get Data
const getData = async () => {
  try {
    loading.value = true;
    const response = await  axios.get('/admin/orders/delivering',

        {
          params: {
            page: page.value,
            pageSize: pageSize.value,
          },
          headers: { 'Authorization': `Bearer ${store.user.token}`}
        }

    )

    if (response.status === 200){
      orders.value = response.data.orders;
      totalRecords.value = response.data.totalRecords;
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
getData();


//Search Order
const searchOrder = () => {
  if (orderId.value)
  router.push({name: 'view-order', params: {id: orderId.value} })
  else return false;
}

const onPage = (event) => {
  page.value = event.page + 1;
  getData();
};

</script>

<template>

  <div class="container mt-3 mb-5">
    <div class="row justify-content-center">
      <div class="col-md-10">

        <h4 class="text-center my-3">Liefern</h4>

        <form @submit.prevent="searchOrder">
        <div class="input-group">
            <input type="search" placeholder="Auftragsnummer" v-model.trim="orderId"
                   class="shadow-none form-control" style="max-width: 200px !important">
            <button class="btn btn-primary"><span class="pi pi-search"></span></button>
        </div>
      </form>

        <div class="table-responsive mt-2">
          <!--        Table -->
          <DataTable :value="orders" :paginator="true" :rows="10" dataKey="id" :loading="loading"
                     class="p-datatable-sm p-datatable-striped p-datatable-hoverable-rows
                     p-datatable-gridlines" responsiveLayout="scroll">

            <template #empty>
              Kein Daten gefunden.
            </template>

            <template #loading>
              <h6 class="text-white fw-bold">Daten werden geladen. Bitte warten. <span class="spinner-border spinner-border-sm"></span></h6>
            </template>
            <Column field="id" header="Auftragsnummer" sortable class="data-table-font-size">
              <template #body="{data}">
                <td>
                  {{ data.id }}
                </td>
              </template>
            </Column>

            <Column field="orderDate" header="Datum"  class="data-table-font-size">
              <template #body="{data}">
                <td>
                  {{ moment(data.orderDate).format("YYYY-MM-DD")}} {{ moment(data.orderDate).format("h:mm:ss a") }}
                </td>
              </template>
            </Column>

            <Column field="numberOfItems" header="Anzahl der Teile"  class="data-table-font-size">
              <template #body="{data}">
                <td>{{ data.numberOfItems }}</td>
              </template>
            </Column>

            <Column field="total" header="Gesamt"  class="data-table-font-size">
              <template #body="{data}">
                <td class="text-capitalize">{{ formatNumber(data.total) }} {{ currency }}</td>
              </template>
            </Column>

            <Column header="Details anzeigen" class="data-table-font-size">
              <template #body="{data}">
                <td>
                <span class="pi pi-eye" style="cursor: pointer;" title="Details anzeigen"
                      @click="router.push({name: 'view-order', params: {id: data.id}})"
                ></span>
                </td>
              </template>
            </Column>

          </DataTable>
        </div>


        <Paginator :rows="pageSize" :totalRecords="totalRecords" @page="onPage($event)"
                   :alwaysShow="false" :class="{'invisible': loading}">
        </Paginator>

      </div>
    </div>
  </div>

</template>


<style scoped>

</style>