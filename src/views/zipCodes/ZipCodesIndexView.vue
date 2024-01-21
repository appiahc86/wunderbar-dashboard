<script setup>
import {ref} from "vue";
import axios from "@/axios";
import DataTable from "primevue/datatable";
import Column from 'primevue/column';
import {useHomeStore} from "@/store/home";
import {currency, formatNumber} from "@/functions";
import {useRouter} from "vue-router";

const router = useRouter();
const store = useHomeStore();
const zipcodes = ref([]);
const zipCodeId = ref('');
const loading = ref(false);
const deleteLoading = ref(false);
const confirmDeleteDialog = ref();


//Get all menu
const getData = async () => {
  try {
    loading.value = true;
    const response = await  axios.get('/admin/zipcodes',
        {
          headers: { 'Authorization': `Bearer ${store.user.token}`}
        }
    )

    if (response.status === 200){
      zipcodes.value = response.data.zipcodes;
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


//Confirm delete
const confirmDelete = (id) => {
  zipCodeId.value = id;
  confirmDeleteDialog.value.showModal();
}

//Delete Menu
const deleteItem = async () => {
  try {

    deleteLoading.value = true;

    const response = await  axios.post('/admin/zipcodes/delete',
        {id: zipCodeId.value },
        {
          headers: { 'Authorization': `Bearer ${store.user.token}`}
        }
    )

    if (response.status === 200) {
      zipcodes.value = zipcodes.value.filter(rec => {
        return rec.id.toString() !== zipCodeId.value.toString();
      })
      zipCodeId.value = '';
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


</script>

<template>
  <div class="container-fluid mt-4">
    <div class="row justify-content-center">

      <div class="col-lg-9">

        <h4 class="">Zip Codes</h4>

          <button class="btn btn-primary btn-sm" @click="router.push({name: 'add-zipcode'})">
            <span class="pi pi-plus-circle"></span>
            Neuen Datensatz hinzufügen
          </button>

        <div class="table-responsive mt-2">
          <!--        Table -->
          <DataTable :value="zipcodes" :paginator="true" :rows="10" dataKey="id" :loading="loading"
                     class="p-datatable-sm p-datatable-striped p-datatable-hoverable-rows p-datatable-gridlines"
                     paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport
                   RowsPerPageDropdown" responsiveLayout="scroll" :rowsPerPageOptions="[10,25, 50]"
                     currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries">
            <template #loading>
              <h6 class="text-white fw-bold">Daten werden geladen. Bitte warten. <span class="spinner-border spinner-border-sm"></span></h6>
            </template>
            <Column field="name" header="Zip Code" sortable class="data-table-font-size">
              <template #body="{data}">
                <td>
                  {{ data.zipCode }}
                </td>
              </template>
            </Column>

            <Column field="town" header="Stadt" sortable class="data-table-font-size">
              <template #body="{data}">
                <td>
                  {{ data.town }}
                </td>
              </template>
            </Column>

            <Column field="minOrder" header="Min Bestell Wert" sortable class="data-table-font-size">
              <template #body="{data}">
                <td>
                  {{ formatNumber(data.minOrder) }} {{ currency }}
                </td>
              </template>
            </Column>

            <Column field="deliveryFee" header="Anfahrtkosten" sortable class="data-table-font-size">
              <template #body="{data}">
                <td>
                  {{ formatNumber(data.deliveryFee) }} {{ currency }}
                </td>
              </template>
            </Column>

            <Column header="Bearbeiten" class="data-table-font-size"><!-- Edit  -->
              <template #body="{data}">
                <td class="text-success">
                <span class="pi pi-file-edit" style="cursor: pointer;" title="Bearbeiten"
                      @click="router.push({name: 'edit-zipcode', params: {id: data.id}})">
                </span>
                </td>
              </template>
            </Column>
            <Column header="Löschen" class="data-table-font-size"><!-- Delete  -->
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


    <!--      Confirm delete dialog    -->
    <dialog ref="confirmDeleteDialog" style="border: none;" class="p-5">
      <!-- Are you sure you want delete this entry? -->
      <h6 class="text-center my3">Möchten Sie diesen Eintrag wirklich löschen?</h6>
      <div class="text-center">
        <button class="btn btn-secondary btn-sm mx-3" @click="confirmDeleteDialog.close()">Stornieren</button>
        <button class="btn btn-danger btn-sm" disabled v-if="deleteLoading">
          <span class=" spinner-border spinner-border-sm"></span> Bitte warten</button>
        <button v-else class="btn btn-danger btn-sm" @click="deleteItem">Fortfahren</button>
      </div>
    </dialog>



  </div>
</template>

<style scoped>

</style>