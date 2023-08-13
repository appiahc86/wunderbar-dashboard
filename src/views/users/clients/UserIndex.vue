<script setup>
import { ref } from "vue";
import axios from "../../../axios.js";
import { formatNumber } from "@/functions";
import DataTable from 'primevue/datatable';
import Button from "primevue/button";
import Column from 'primevue/column';
import { useHomeStore } from "@/store/home";
const store = useHomeStore();

const loading = ref(null);
const submitting = ref(false);
const users = ref([]);
const userDialog = ref(null);
const searchTerm = ref(null);
const searchedUser = ref();
const page = ref(1);
const pageSize = ref(10);
const totalRecords = ref(0);

//Validate phone number
const validatePhoneNumber = (e) => {
  e.target.value = e.target.value.replace(/[^0-9]/g, '');
  e.target.value = e.target.value.replace(/(\..*)\./g, '$1');
}

//Get all users
const getUsers = async () => {
  try {
    loading.value = true;
    const response = await  axios.get('/admin/clientUsers',
        {
          params: {
            page: page.value,
            pageSize: pageSize.value,
          },
          headers: { 'Authorization': `Bearer ${store.token}`}
        }
    )

    if (response.status === 200){
      users.value = response.data.data;
      totalRecords.value = response.data.totalRecords;
    }

  }catch (e) {
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

getUsers();

//Search User
const searchUser = async () => {
  try {
    submitting.value = true;
    const response = await  axios.post('/admin/clientUsers/search',
        JSON.stringify({phone: searchTerm.value}),
        {
          headers: { 'Authorization': `Bearer ${store.token}`}
        }
    )

    if (response.status === 200){
      searchedUser.value = response.data;
      userDialog.value.showModal();
    }

  }catch (e) {
    if (e.response) return toast.add({severity:'warn', summary: 'Error', detail: `${e.response.data}`, life: 4000});
    if (e.request && e.request.status === 0) {
      return toast.add({severity:'error', summary: 'Error',
        detail: `Sorry, Connection to Server refused. Please check your internet connection or try again later`,
        life: 4000});
    }

    return toast.add({severity:'warn', summary: 'Error', detail: 'Sorry, something went wrong. Please try again later',
      life: 4000});
  }finally { submitting.value = false }
}

const onPage = (event) => {
  page.value = event.page + 1;
  getUsers();
};

</script>

<template>

<h4 class="text-center">Users</h4>
<div class="container">
  <div class="row">
    <div class="col">
      <form @submit.prevent="searchUser">
        <div class="input-group">
          <input type="tel" class="p-inputtext p-inputtext-sm" @input="validatePhoneNumber"
                 maxlength="10" v-model.number="searchTerm" placeholder="Search Number" required>
          <button type="submit" class="p-button p-button-sm" :disabled="submitting">
            <span :class="submitting ? 'spinner-border spinner-border-sm' : 'pi pi-search'"></span>
          </button>
        </div>
      </form>

      <div class="table-responsive mt-2">
<!--        Table -->
        <DataTable :value="users" :lazy="true" :paginator="true" :rows="pageSize" dataKey="id"
                   :totalRecords="totalRecords" :loading="loading" @page="onPage($event)"
                   class="p-datatable-sm p-datatable-striped p-datatable-hoverable-rows p-datatable-gridlines"
                   paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport
                   RowsPerPageDropdown" responsiveLayout="scroll"
                   currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries">
          <template #loading>
            <h6 class="text-white fw-bold">Loading data Please wait. <span class="spinner-border spinner-border-sm"></span></h6>

          </template>
          <Column field="phone" header="Phone" sortable class="data-table-font-size">
            <template #body="{data}">
              <td>
                {{ '0' + data.phone}}
              </td>
            </template>
          </Column>
          <Column field="balance" header="Balance" sortable class="data-table-font-size">
            <template #body="{data}">
              <td>
                {{ formatNumber(data.balance) }}
              </td>
            </template>
          </Column>
          <Column field="isActive" header="Active" sortable class="data-table-font-size">
            <template #body="{data}">
              <td>
                {{ data.isActive ? 'Yes' : 'No' }}
              </td>
            </template>
          </Column>
        </DataTable>
      </div>

<!--      User dialog    -->
      <dialog ref="userDialog" style="border: none;" class="py-4">
        <button class="bg-danger text-white float-end" @click="userDialog.close()">X</button>
        <div class="pt-5" v-if="searchedUser">
          <table class="table table-bordered table-striped">
            <tr>
              <th>Phone</th>
              <td>0{{ searchedUser.phone }}</td>
            </tr>
            <tr>
              <th>Network</th>
              <td>{{ searchedUser.network }}</td>
            </tr>
            <tr>
              <th>Acc. Balance</th>
              <td>{{ formatNumber(searchedUser.balance) }}</td>
            </tr>
            <tr>
              <th>Active</th>
              <td>{{ searchedUser.isActive ? 'Yes' : 'No' }}</td>
            </tr>
            <tr>
              <th>Date Registered</th>
              <td>{{ new Date(searchedUser.createdAt).toLocaleDateString() }}</td>
            </tr>
<!--            <input type="checkbox" v-model="searchedUser.isActive" :checked="searchedUser.isActive">-->

          </table>

        </div>
      </dialog>

    </div>
  </div>
</div>
  
</template>

<style scoped>


</style>