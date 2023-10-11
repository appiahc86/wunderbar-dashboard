<script setup>
import {reactive, ref} from "vue";
import axios from "@/axios";
import { formatNumber } from "@/functions";
import {useHomeStore} from "@/store/home";
import DataTable from "primevue/datatable";
import InputText from "primevue/inputtext";
import Column from "primevue/column";
import {onBeforeRouteLeave, useRouter} from "vue-router";
import {FilterMatchMode} from "primevue/api";

const router = useRouter();
const store = useHomeStore();
const loading = ref(false);
const deleteLoading = ref(false);
const detailsLoading = ref(false);
const errorMessage = ref('');
const menuItems = ref([]);
const menuItemId = ref(null);
const confirmDeleteDialog = ref();
// const page = ref(1);
// const pageSize = ref(100);
// const totalRecords = ref(0);
const details = reactive({
  name: '', price: 0, shortDescription: '', menu: '',
  image: '', description: '', choiceOf: []
})

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});


//Get Data
const getData = async () => {
  try {
    loading.value = true;
    const response = await  axios.get('/admin/menuItems',

        {
          // params: {
          //   page: page.value,
          //   pageSize: pageSize.value,
          // },
          headers: { 'Authorization': `Bearer ${store.user.token}`}
        }
    )

    if (response.status === 200){
      menuItems.value = response.data.menuItems;
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
getData();

const viewDetails = async (id, menu) => {
  try {
    errorMessage.value = "";
    details.name = "";
    details.menu = "";
    details.price = 0;
    details.image = "";
    details.shortDescription = "";
    details.description = "";
    details.choiceOf = [];
    new bootstrap.Modal('#viewModal').show();

     detailsLoading.value = true;

    const response = await  axios.post('/admin/menuItems/viewDetails',
        {id},
        {
          headers: { 'Authorization': `Bearer ${store.user.token}`}
        }
    )

    if (response.status === 200){
      details.name = response.data.name;
      details.price = response.data.price;
      details.shortDescription = response.data.shortDescription;
      details.image = response.data.image;
      details.menu = menu;
      details.description = response.data.description;
      details.choiceOf = JSON.parse(response.data.choiceOf);
    }

  }catch (e) {
    if (e.response) return errorMessage.value = e.response.data;
    if (e.request && e.request.status === 0) {
      return errorMessage.value =
           `Leider wurde die Verbindung zum Server abgelehnt. Bitte überprüfen Sie Ihre Internetverbindung oder versuchen Sie es später erneut`;
    }

    return errorMessage.value = 'Entschuldigung, etwas ist schief gelaufen. Bitte versuchen Sie es später noch einmal';

  }finally {
    detailsLoading.value = false;
  }
} // ./view details

// const onPage = (event) => {
//   page.value = event.page + 1;
//   getData();
// };

//Confirm delete
const confirmDelete = (id) => {
  menuItemId.value = null;
  menuItemId.value = id;
  confirmDeleteDialog.value.showModal();
}


//Delet menuItem
const deleteMenuItem = async () => {
  try {

    deleteLoading.value = true;
    const foundImage = menuItems.value.find((men) => men.id.toString() === menuItemId.value.toString());

    const response = await  axios.post('/admin/menuItems/delete',
        {id: menuItemId.value, image: foundImage.image},
        {
          headers: { 'Authorization': `Bearer ${store.user.token}`}
        }
    )

    if (response.status === 200) {
      menuItems.value = menuItems.value.filter(men => {
        return men.id.toString() !== menuItemId.value.toString();
      })
      menuItemId.value = null;
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
    deleteLoading.value = false;
    confirmDeleteDialog.value.close();
  }
}

onBeforeRouteLeave(() => {
  document.querySelector("#close-modal").click();
})


</script>

<template>
<div class="container mt-3 mb-5">
  <div class="row justify-content-center">
    <div class="col-md-10">
      <h4 class="text-center">Menüpunkte</h4>
      <div class="table-responsive mt-2">
        <!--        Table -->
        <DataTable :value="menuItems" :paginator="true" :rows="10" dataKey="id" :loading="loading"
                   class="p-datatable-sm p-datatable-striped p-datatable-hoverable-rows p-datatable-gridlines"
                   paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport
                   RowsPerPageDropdown" responsiveLayout="scroll" v-model:filters="filters"
                   :globalFilterFields="['name','menu']" filterDisplay="menu" :rowsPerPageOptions="[10, 15, 25]"
                   currentPageReportTemplate="Zeigt {first} bis {last} von {totalRecords} Einträgen">

          <template #header>
            <div class="d-flex justify-content-center align-items-center" style="height: 15px">
              <span class="p-input-icon-left">
                        <i class="pi pi-search" />
                        <InputText v-model="filters['global'].value" placeholder="suchen" style="height: 30px;"/>
                    </span>
            </div>
          </template>
          <template #empty>
            Kein Artikel gefunden.
          </template>

          <template #loading>
            <h6 class="text-white fw-bold">Daten werden geladen. Bitte warten. <span class="spinner-border spinner-border-sm"></span></h6>
          </template>
          <Column field="name" header="Name" sortable class="data-table-font-size">
            <template #body="{data}">
              <td class="text-capitalize">
                {{ data.name }}
              </td>
            </template>
          </Column>

          <Column field="menu" header="Menü"  class="data-table-font-size">
            <template #body="{data}">
              <td class="text-capitalize">{{ data.menu }}</td>
            </template>
          </Column>

          <Column field="price" header="Preis" class="data-table-font-size">
            <template #body="{data}">
              <td>
                {{ formatNumber(data.price) }}
              </td>
            </template>
          </Column>

          <Column header="Details" class="data-table-font-size">
            <template #body="{data}">
              <td>
                <span class="pi pi-eye" @click="viewDetails(data.id, data.menu)"  style="cursor: pointer;"
                      title="Details anzeigen"></span>
              </td>
            </template>
          </Column>

          <Column header="Bearbeiten" class="data-table-font-size"><!-- Edit  -->
            <template #body="{data}">
              <td class="text-success">
                <span class="pi pi-file-edit"  style="cursor: pointer;" title="Bearbeiten"
                      @click="router.push({name: 'edit-menu-item', params:{ slug: data.slug}})"
                ></span>
              </td>
            </template>
          </Column>
          <Column header="Details" class="data-table-font-size"><!-- Delete  -->
            <template #body="{data}">
              <td class="text-danger">
                <span class="pi pi-trash" style="cursor: pointer;" title="Löschen"
                      @click="confirmDelete(data.id)"></span>
              </td>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</div>


<!-- Details Modal -->

  <div class="modal" id="viewModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header border-0">
          <div v-if="details.name"><h5 class="fw-bold">{{ details.name }}</h5></div>
          <button type="button" id="close-modal" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div v-if="detailsLoading">
            <p class="text-center"><span class="spinner-border spinner-border-sm"></span></p>
          </div>
          <div class="" v-else>
            <div class="container-fluid">
              <div class="row justify-content-center">
                <div class="col-lg-6">
                  <div v-if="details.image.trim()" class="text-center">
                    <img :src="details.image" class="mb-3" alt="image" width="150" height="150">
                    <hr>
                  </div>


                    <div class="table-responsive">
                      <table class="table">
                        <tr>
                          <th>Preis</th>
                          <td>{{ formatNumber(details.price) }}</td>
                        </tr>
                      </table>
                    </div>
                  <hr>

                  <div class="" v-if="details.shortDescription">
                    <h6 class="text-center">kurze Beschreibung</h6>
                    <textarea class="form-control shadow-none" v-model="details.shortDescription" disabled cols="2" rows="2"></textarea>
                    <hr>
                  </div>


                  <div class="mt-3" v-if="details.choiceOf.length">
                  <h6 class="text-center">Auswahl von</h6>
                    <div class="table-responsive">
                      <table class="table">
                        <tr>
                          <th>Name</th>
                          <th>Preis</th>
                        </tr>
                        <template v-for="(choice, index) in details.choiceOf" :key="index">
                          <tr>
                            <th>{{ choice.name }}</th>
                            <td>{{ formatNumber(choice.price) }}</td>
                          </tr>
                        </template>

                      </table>
                    </div>
                    <hr>
                </div>

                  <div class="mt-2" v-if="details.description">
                    <h6 class="text-center">Produktinformationen</h6>
                    <div v-html="details.description"></div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>


  <!--      Confirm delete dialog    -->
  <dialog ref="confirmDeleteDialog" style="border: none;" class="p-5">
    <!-- Are you sure you want to do this? -->
    <h6 class="text-center my3">Sind Sie sicher, dass Sie dies tun möchten?</h6>
    <div class="text-center">
      <button class="btn btn-secondary btn-sm mx-3" @click="confirmDeleteDialog.close()">Stornieren</button>
      <button class="btn btn-danger btn-sm" disabled v-if="deleteLoading">
        <span class=" spinner-border spinner-border-sm"></span> Bitte warten</button>
      <button v-else class="btn btn-danger btn-sm" @click="deleteMenuItem">Fortfahren</button>
    </div>
  </dialog>

</template>

<style scoped>

</style>