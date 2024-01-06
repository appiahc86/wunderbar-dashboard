<script setup>
import {reactive, ref} from "vue";
import axios from "@/axios";
import DataTable from "primevue/datatable";
import Column from 'primevue/column';
import {useHomeStore} from "@/store/home";

const store = useHomeStore();
const menu = ref([]);
const menuId = ref('');
const loading = ref(false);
const saveLoading = ref(false);
const editLoading = ref(false);
const deleteLoading = ref(false);
const saveMenuData = reactive({name: ''});
const editMenuData = reactive({id: null, name: ''});
const confirmDeleteDialog = ref();
const editDialog = ref();

//Get all menu
const getMenu = async () => {
  try {
    loading.value = true;
    const response = await  axios.get('/admin/menu',
        {
          headers: { 'Authorization': `Bearer ${store.user.token}`}
        }
    )

    if (response.status === 200){
      menu.value = response.data.menu;
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
getMenu();



//Save Menu
const saveMenu = async () => {
  try {
    saveLoading.value = true;

    const response = await  axios.post('/admin/menu',
        JSON.stringify({
          name: saveMenuData.name
        }),
        {
          headers: {
            'Authorization': `Bearer ${store.user.token}`
          }
        }
    )

    if (response.status === 201){
      menu.value.unshift({
        id: response.data.id,
        name: saveMenuData.name,
      })
      saveMenuData.name = "";
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
  }finally { saveLoading.value = false; }

} //./Save menu



//Show Edit category dialog
const openEditDialog = (men) => {
  editMenuData.id = null;
  editMenuData.name = '';
 editMenuData.id = men.id;
 editMenuData.name = men.name;
 editDialog.value.showModal();
}


//Edit Menu
const editMenu = async () => {
  try {
    editLoading.value = true;


    const response = await  axios.post('/admin/menu/edit',
        {
          id:  editMenuData.id,
          name: editMenuData.name
        },
        {
          headers: {
            'Authorization': `Bearer ${store.user.token}`
          }
        }
    )

    if (response.status === 200){

      for (const men of menu.value) {
        if (men.id.toString() === editMenuData.id.toString()){
          men.name = response.data.name;
          break;
        }
      }

      editMenuData.id = null;
      editMenuData.name = "";
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
    editLoading.value = false;
    editDialog.value.close();
  }

}





//Confirm delete
const confirmDelete = (id) => {
  menuId.value = id;
  confirmDeleteDialog.value.showModal();
}

//Delete Menu
const deleteMenu = async () => {
  try {

    deleteLoading.value = true;
    const foundImage = menu.value.find((men) => men.id.toString() === menuId.value.toString());

    const response = await  axios.post('/admin/menu/delete',
        {id: menuId.value, image: foundImage.image},
        {
          headers: { 'Authorization': `Bearer ${store.user.token}`}
        }
    )

    if (response.status === 200) {
      menu.value = menu.value.filter(men => {
        return men.id.toString() !== menuId.value.toString();
      })
      menuId.value = '';
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
<div class="container mt-4">
  <div class="row">
    <div class="col-sm-5">
      <h3 class="mb-2">Menü hinzufügen</h3>
      <form @submit.prevent="saveMenu">
        <div class="mb-2">

        </div>
        <div class="input-group">
          <input type="text" class="form-control" placeholder="Menü hinzufügen"
                 v-model.trim="saveMenuData.name"  required>
          <button v-if="saveLoading" class="btn btn-primary fw-bold" disabled>
            <span class="spinner-border spinner-border-sm"></span> Bitte warten</button>
          <button v-else class="btn btn-primary fw-bold">Einreichen</button>
        </div>
      </form>
    </div>
    <div class="col-sm-7">
      <div class="table-responsive mt-2">
        <!--        Table -->
        <DataTable :value="menu" :paginator="true" :rows="10" dataKey="id" :loading="loading"
                   class="p-datatable-sm p-datatable-striped p-datatable-hoverable-rows p-datatable-gridlines"
                   paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport
                   RowsPerPageDropdown" responsiveLayout="scroll" :rowsPerPageOptions="[10,25, 50]"
                   currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries">
          <template #loading>
            <h6 class="text-white fw-bold">Daten werden geladen. Bitte warten. <span class="spinner-border spinner-border-sm"></span></h6>

          </template>
          <Column field="name" header="Menü" sortable class="data-table-font-size">
            <template #body="{data}">
              <td class="text-capitalize">
                {{ data.name }}
              </td>
            </template>
          </Column>

          
          <Column header="Bearbeiten" class="data-table-font-size"><!-- Edit  -->
            <template #body="{data}">
              <td class="text-success">
                <span class="pi pi-file-edit" style="cursor: pointer;" title="Bearbeiten"
                @click="openEditDialog(data)"></span>
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



<!-- Edit dialog  -->
  <dialog ref="editDialog" style="border: none;" class="p-3">
    <button class="text-white bg-danger" style="float: right;" @click="editDialog.close()">X</button><br><br>
    <form @submit.prevent="editMenu">

      <div class="input-group">
        <input type="text" class="form-control" placeholder="Kategorie eingeben"
               v-model.trim="editMenuData.name"  required>
        <button v-if="editLoading" class="btn btn-primary fw-bold" disabled>
          <span class="spinner-border spinner-border-sm"></span> Bitte warten</button>
        <button v-else class="btn btn-primary fw-bold">Einreichen</button>
      </div>
    </form>
  </dialog>


  <!--      Confirm delete dialog    -->
  <dialog ref="confirmDeleteDialog" style="border: none;" class="p-5">
    <!-- Deleting this item will delete all menuItems items associated with it. -->
    <p>Durch das Löschen dieses Elements werden alle damit verbundenen <br> Menüelemente gelöscht</p>
    <!-- Are you sure you want to do this? -->
    <h6 class="text-center my3">Sind Sie sicher, dass Sie dies tun möchten?</h6>
    <div class="text-center">
      <button class="btn btn-secondary btn-sm mx-3" @click="confirmDeleteDialog.close()">Stornieren</button>
      <button class="btn btn-danger btn-sm" disabled v-if="deleteLoading">
        <span class=" spinner-border spinner-border-sm"></span> Bitte warten</button>
      <button v-else class="btn btn-danger btn-sm" @click="deleteMenu">Fortfahren</button>
    </div>
  </dialog>


</div>
</template>

<style scoped>

</style>