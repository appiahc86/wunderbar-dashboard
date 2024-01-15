<script setup>
import Editor from "primevue/editor";
import {reactive, ref} from "vue";
import axios from "@/axios";
import {useHomeStore} from "@/store/home";

const store = useHomeStore();
const loading = ref(false);
const menuLoading = ref(false);
const menu = ref([]);
const formData = reactive({
  name: '',
  menuId: '',
  price: null,
  choiceOf: [],
  description: '',
  shortDescription: '',
  image: null
})

const clearForm = () => {
  formData.name = "";
  formData.menuId = '';
  formData.price = null;
  formData.choiceOf = [];
  formData.description = "";
  formData.shortDescription = "";
  formData.image = null;
  document.querySelector('#image').style.display = 'none';
  document.querySelector('#saveFile').value = '';
}


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


//Handle File Change
function handleFileChange() {
  const fileInput = document.getElementById("saveFile");
  const targetImageTag = document.getElementById('image');
  const selectedFile = fileInput.files[0];


  formData.image = null;
  targetImageTag.removeAttribute('src');
  targetImageTag.style.display = 'none';

  if (selectedFile){

    let reader = new FileReader();

//Read the contents of Image File.
    reader.readAsDataURL(selectedFile);
    reader.onload = function (e) {

      //Initiate the JavaScript Image object.
      let image = new Image();

      //Set the Base64 string return from FileReader as source.
      image.src = e.target.result;

      //Validate the File Height and Width.
      image.onload = function () {
        if (this.height !== 200 && this.width !== 200) {
          fileInput.value = "";
           toast.add({severity:'warn',
            detail: `Das Bild sollte 200 x 200 Pixel groß sein`,
            life: 4000});
          return false;
        }
        //Image is Valid
          formData.image = selectedFile;
          targetImageTag.src = window.URL.createObjectURL(selectedFile);
          targetImageTag.style.display = 'block';
        return true;
      };
    };

  } // ./If selectedFile
  else {
    formData.image = null;
    targetImageTag.removeAttribute('src');
    targetImageTag.style.display = 'none';
  }


  }


//save data
const saveData = async () => {
  try {
    loading.value = true;
    formData.choiceOf = [];
    const choiceOfNames = document.querySelectorAll(".choice-container .choiceOfName");
    const choiceOfPrices = document.querySelectorAll(".choice-container .choiceOfPrice");

    let count = 0;
    for (const choiceOfName of choiceOfNames) {
        formData.choiceOf.push({name: choiceOfName.value, price: choiceOfPrices[count].value});
        count++;
    }



    const myData = new FormData();
    myData.append('name', formData.name);
    myData.append('price', formData.price);
    myData.append('choiceOf', JSON.stringify(formData.choiceOf));
    myData.append('shortDescription', formData.shortDescription);
    myData.append('description', formData.description);
    myData.append('menuId', formData.menuId);
    myData.append('image', formData.image);  // Add image file


    //..........................validation goes here ...................................

    const response = await  axios.post('/admin/menuItems/create',
        myData,
        {
          headers: {
            'Authorization': `Bearer ${store.user.token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
    )

    if (response.status === 201){
      toast.add({severity:'success', detail: ` Datensatz gespeichert`, life: 3000});
      //Remove choiceOf dynamic inputs
      for (const choiceOfPrice of choiceOfPrices) {
        choiceOfPrice.parentNode.remove();
      }
      clearForm();
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
  }finally {loading.value = false; }
} // ./save data



//Add choice element
const addChoice = () => {
  const choiceContainer = document.querySelector("#choice-container");
  const choice = document.querySelector("#choice");
  choiceContainer.appendChild(choice.cloneNode(true).firstChild)
}
</script>

<template>
<div class="container mb-5">
  <div class="row justify-content-center">
    <div class="col-md-6">
      <h6 class="text-center mt-2">Artikel hinzufügen</h6><br>
      <form @submit.prevent="saveData">

        <small>Artikelname</small>
        <input type="text" class="form-control shadow-none" placeholder="Artikelname"
               v-model.trim="formData.name"  required><br>

        <small>wähle eine Option</small>
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


        <small>Preis</small>
        <input type="number" class="form-control shadow-none" placeholder="Preis"
               v-model.number="formData.price"  required step="0.01"><br>

        <div class="input-group">
          <div class="input-group-text">Auswahl von</div>
          <button type="button" class="btn btn-dark" @click="addChoice">+</button>
        </div>
        <br>

        <div id="choice-container" class="choice-container"></div>

        <small class="fw-bold">200 x 200</small>
    <div class="mb-2">
        <input type="file" accept="image/*" class="form-control"
               @change="handleFileChange" id="saveFile">
    </div>

        <img id="image" alt="image" width="80" height="80"  style="display: none;"/><br>

        <small>kurze Beschreibung</small>
        <textarea cols="5" rows="2" v-model="formData.shortDescription" maxlength="150"
                  class="form-control shadow-none" placeholder="kurze Beschreibung"></textarea><br>

        <small>Weitere Produktinformationen</small>
        <Editor v-model="formData.description" editorStyle="height: 180px"
                placeholder="Weitere Produktinformationen" /><br>
        <button v-if="loading" class="btn btn-primary fw-bold" disabled>
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
</template>

<style scoped>

</style>