<script setup>
import {onMounted, reactive, ref} from "vue";
import axios from "@/axios";
import {useHomeStore} from "@/store/home";
import Editor from "primevue/editor";
import {useRoute, useRouter} from "vue-router";

const router = useRouter();
const route = useRoute();
const store = useHomeStore();
const loading = ref(false);
const saveLoading = ref(false);
const menuLoading = ref(false);
const menu = ref([]);
const loadDialog = ref();
const choices = ref([]);
const path = ref('');
const formData = reactive({
  id: null,
  name: '',
  menuId: '',
  price: null,
  choiceOf: [],
  description: '',
  shortDescription: '',
  image: null,
  newImage: null
})


//Load menu
const getMenu = async () => {
  try {
    menuLoading.value = true;
    const response = await  axios.get('/admin/menuItems/getMenu',
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
  }finally { menuLoading.value = false; }

}
getMenu();


//Get data
const load = async () => {
  try {

    loading.value = true;
    loadDialog.value.showModal();
    loadDialog.value.oncancel = (e) => e.preventDefault();

    const response = await  axios.post('/admin/menuItems/view',
        {slug: route.params.slug},
        {
          headers: { 'Authorization': `Bearer ${store.user.token}`}
        }
    )

    if (response.status === 200){
      formData.id = response.data.menuItem.id;
      formData.name = response.data.menuItem.name;
      formData.menuId = response.data.menuItem.menuId;
      formData.price = response.data.menuItem.price;
      formData.description = response.data.menuItem.description;
      formData.shortDescription = response.data.menuItem.shortDescription;
      formData.image = response.data.menuItem.image;
      choices.value = JSON.parse(response.data.menuItem.choiceOf);
      path.value = response.data.path;
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
    loadDialog.value.close();
  }
} // ./load data


onMounted(() => {
  load();
})

//Add choice
const addChoice = () => {
  const choiceContainer = document.querySelector("#choice-container");
  const choice = document.querySelector("#choice");
  choiceContainer.appendChild(choice.cloneNode(true).firstChild)
}


//Handle file change
const handleFileChange = (event) => {
  const targetImageTag = document.getElementById('image');
  if(typeof event.target.files[0] !== 'undefined'){
    formData.newImage = event.target.files[0];
    targetImageTag.src = window.URL.createObjectURL(event.target.files[0]);
    targetImageTag.style.display = 'block';
  }else {
    formData.newImage = null;
    targetImageTag.removeAttribute('src');
    targetImageTag.style.display = 'none';
  }
}


//save data
const saveData = async () => {
  try {
    saveLoading.value = true;
    formData.choiceOf = [];
    const choiceOfNames = document.querySelectorAll(".choice-container .choiceOfName");
    const choiceOfPrices = document.querySelectorAll(".choice-container .choiceOfPrice");

    let count = 0;
    for (const choiceOfName of choiceOfNames) {
      formData.choiceOf.push({name: choiceOfName.value, price: choiceOfPrices[count].value});
      count++;
    }


    const myData = new FormData();
    myData.append('id', formData.id);
    myData.append('name', formData.name);
    myData.append('price', formData.price);
    myData.append('choiceOf', JSON.stringify(formData.choiceOf));
    myData.append('shortDescription', formData.shortDescription);
    myData.append('description', formData.description);
    myData.append('menuId', formData.menuId);
    myData.append('image', formData.image);
    myData.append('newImage', formData.newImage);


    //..........................validation goes here ...................................

    const response = await  axios.post('/admin/menuItems/edit',
        myData,
        {
          headers: {
            'Authorization': `Bearer ${store.user.token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
    )

    if (response.status === 200){
      toast.add({severity:'success', detail: ` Datensatz gespeichert`, life: 3000});
      router.push({name: 'menu-items'})
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
  }finally {saveLoading.value = false; }
} // ./save data




</script>

<template>


  <div class="container mb-5" v-if="!loading">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <h6 class="text-center mt-2">Daten bearbeiten</h6><br>
        <form @submit.prevent="saveData">
          <input type="text" class="form-control shadow-none" placeholder="Artikelname"
                 v-model.trim="formData.name"  required><br>

          <div class="input-group">
            <select class="form-control shadow-none" v-model="formData.menuId" required>
              <option value="">--wähle eine Option--</option>
              <template v-for="men in menu" :key="men.id">
                <option :value="men.id" class="text-capitalize">{{ men.name }}</option>
              </template>
            </select>
            <button type="button" class="btn btn-warning" v-if="menuLoading">
              <span class="spinner-border spinner-border-sm"></span></button>
          </div><br>



          <input type="number" class="form-control shadow-none" placeholder="Preis"
                 v-model.number="formData.price"  required step="0.01"><br>

          <div class="input-group">
            <div class="input-group-text">Auswahl von</div>
            <button type="button" class="btn btn-dark" @click="addChoice">+</button>
          </div>
          <br>

          <div id="choice-container" class="choice-container">
            <template v-for="(choice, index) in choices" :key="index">
              <div class="input-group mb-3">
                <input type="text" class="form-control bg-info shadow-none choiceOfName" placeholder="name"
                       required style="width: 47%;" :value="choice.name">
                <input type="number" class="form-control shadow-none bg-light choiceOfPrice" placeholder="Preis"
                       required step="0.01" :value="choice.price">
                <button type="button" class="btn btn-danger" onclick="this.parentNode.remove()">X</button>
              </div>
            </template>
          </div>

          <input type="file" accept="image/*" class="form-control mb-3"
                 @change="handleFileChange" id="saveFile">

          <template v-if="formData.image && !formData.newImage">
            <img alt="image" :src="path + formData.image" width="80" height="40" class="mb-3"/>
          </template>
<!--          <template v-else>-->
            <img id="image" alt="image" width="80" height="40" style="display: none;" class="mb-3"/>
<!--          </template>-->

          <textarea cols="5" rows="2" v-model="formData.shortDescription" maxlength="50"
                    class="form-control shadow-none" placeholder="kurze Beschreibung"></textarea><br>

          <Editor v-model="formData.description" editorStyle="height: 180px"
                  placeholder="Weitere Produktinformationen" /><br>
          <button v-if="saveLoading" class="btn btn-primary fw-bold" disabled>
            <span class="spinner-border spinner-border-sm"></span> Bitte warten</button>
          <button v-else class="btn btn-primary fw-bold">Einreichen</button><br>
        </form>


      </div>
    </div>

    <!--  Choice -->
    <template id="choice">
      <div class="input-group mb-3">
        <input type="text" class="form-control bg-info shadow-none choiceOfName" placeholder="name"
               required style="width: 47%;">
        <input type="number" class="form-control shadow-none bg-light choiceOfPrice" placeholder="Preis"
               required step="0.01">
        <button type="button" class="btn btn-danger" onclick="this.parentNode.remove()">X</button>
      </div>
    </template>

  </div>

  <dialog ref="loadDialog" class="loadDialog">
      <span class="spinner-border"></span>
  </dialog>

</template>

<style scoped>
dialog {
  border: none !important;
  outline: 0 solid transparent;
  background: transparent;
}

</style>