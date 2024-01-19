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
const users = ref([]);
const loading = ref(false);


//Get all users
const getData = async () => {
  try {
    loading.value = true;
    const response = await  axios.get('/admin/users/dashboard',
        {
          headers: { 'Authorization': `Bearer ${store.user.token}`}
        }
    )

    if (response.status === 200){
      users.value = response.data.users;
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
  <div class="container-fluid mt-4">
    <div class="row justify-content-center">

      <div class="col-lg-9">

        <h4 class="">Dashboard-Benutzer</h4>

        <button class="btn btn-primary btn-sm" @click="router.push({name: 'add-user'})">
          <span class="pi pi-plus-circle"></span>
          Neuen Benutzer hinzufügen
        </button>

        <div class="table-responsive mt-2">
          <!--        Table -->
          <DataTable :value="users" :paginator="true" :rows="10" dataKey="id" :loading="loading"
                     class="p-datatable-sm p-datatable-striped p-datatable-hoverable-rows p-datatable-gridlines"
                     paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport
                   RowsPerPageDropdown" responsiveLayout="scroll" :rowsPerPageOptions="[10,25, 50]"
                     currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries">
            <template #loading>
              <h6 class="text-white fw-bold">Daten werden geladen. Bitte warten. <span class="spinner-border spinner-border-sm"></span></h6>
            </template>
            <Column field="name" header="Name" class="data-table-font-size">
              <template #body="{data}">
                <td class="text-capitalize">
                  {{ data.name }}
                </td>
              </template>
            </Column>

            <Column field="email" header="E-Mail" class="data-table-font-size">
              <template #body="{data}">
                <td>
                  {{ data.email }}
                </td>
              </template>
            </Column>

            <Column field="role" header="Rolle" class="data-table-font-size">
              <template #body="{data}">
                <td v-if="parseInt(data.role) === 1">Administrator</td>
                <td v-if="parseInt(data.role) === 4">Benutzer</td>
                <td v-if="parseInt(data.role) === 5">Lieferperson</td>
              </template>
            </Column>

            <Column field="isActive" header="Aktiv" class="data-table-font-size">
              <template #body="{data}">
                <td>
                  {{ !!data.isActive ? "&#x2705;" : "&#x274C;" }}
                </td>
              </template>
            </Column>

            <Column header="Bearbeiten" class="data-table-font-size"><!-- Edit  -->
              <template #body="{data}">
                <td class="text-success">
                <span class="pi pi-file-edit" style="cursor: pointer;" title="Bearbeiten"
                  @click="router.push({name: 'edit-user', params: {id: data.id}})">

                </span>
                </td>
              </template>
            </Column>
<!--            <Column header="Löschen" class="data-table-font-size">&lt;!&ndash; Delete  &ndash;&gt;-->
<!--              <template #body="{data}">-->
<!--                <td class="text-danger">-->
<!--                <span class="pi pi-trash" style="cursor: pointer;" title="Löschen">-->

<!--                </span>-->
<!--                </td>-->
<!--              </template>-->
<!--            </Column>-->
          </DataTable>
        </div>
      </div>
    </div>



  </div>
</template>

<style scoped>

</style>