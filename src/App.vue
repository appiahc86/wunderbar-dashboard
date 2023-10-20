<script setup>
import { io }  from "socket.io-client";
import { ref, onMounted } from 'vue';
import Toast from "primevue/toast";
import Avatar from "primevue/avatar";
import  { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { useHomeStore } from "@/store/home";
import axios from "@/axios";
window.toast = useToast();
const store = useHomeStore();
const router = useRouter();

const usersOnline = ref(0);
const profileSidebar = ref(false);

const socket = io(`${axios.defaults.baseURL}`);
window.socket = socket;
socket.emit('join-admin-users', 'admin');

socket.on("onlineUsers", (users) => {
  usersOnline.value = users
})


onMounted(() => {
  const sidebarToggler = document.querySelector("#menu-toggle");
  const wrapper = document.querySelector("#wrapper");
  sidebarToggler.onclick = (e) => {
    e.preventDefault();
    wrapper.classList.toggle("toggled");
  }

})

//Logout
const logout = () => {
  profileSidebar.value = false;
  store.logout();
  router.push({name: 'login'});
}
</script>

<template>
<div id="wrapper">

<!-- Sidebar -->
<div id="sidebar-wrapper">
    <div class="sidebar-nav">
        <section class="sidebar-brand">
          <router-link :to="{name: 'dashboard'}"><span>&#127962;</span> Armaturenbrett</router-link>
        </section>
        
        <section>
          <router-link :to="{name: 'home'}"><span>&#127968;</span> Heim</router-link>
        </section>
         <section>
            <router-link :to="{name: 'home'}"><span>&#128101;</span> Benutzer</router-link>
        </section>
      <section>
        <router-link :to="{name: 'menu'}"><span>&#11088;</span> Menü</router-link>
      </section>

      <section>
        <div class="dropdown">
          <a class="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
            <span>&#127869;</span>
            Menüpunkte <!--Menu Items-->
          </a>
          <ul class="dropdown-menu dropdown-menu-dark w-100">
            <li><router-link :to="{name: 'menu-items'}">
              <span class="pi pi-list"></span>&nbsp; Menüpunkte auflisten</router-link></li>

            <li><router-link :to="{name: 'add-menu-item'}">
              <span class="pi pi-plus-circle"></span>&nbsp; Menüpunkt hinzufügen</router-link></li>

          </ul>
        </div>
      </section>

        <section>
         <div class="dropdown">
          <a class="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
            <span>&#128073;</span>
            Bestellungen  <!--Orders-->
          </a>
          <ul class="dropdown-menu dropdown-menu-dark w-100">
            <li><router-link :to="{name: 'orders'}">
              <span class="pi pi-circle"></span>&nbsp; Neue Bestellungen</router-link></li>

            <li><router-link :to="{name: 'delivering-orders'}">
              <span class="pi pi-circle"></span>&nbsp; Liefern </router-link></li>
          </ul>
        </div>
      </section>


      <!--   Settings   -->
      <section>
        <router-link :to="{name: 'home'}"><span>&#128101;</span> Einstellungen</router-link>
      </section>


      <div class="text-center dropdown mt-4">
        <span class="text-white" data-bs-toggle="dropdown" aria-expanded="false">
          <Avatar icon="pi pi-user" style="background-color:#2196F3; color: #ffffff; cursor: pointer;"
                  v-if="!store.isLoggedIn" shape="circle" @click="profileSidebar = true;"
           />
          <span class="dropdown-toggle">&nbsp; {{ store.user.name || 'User' }}</span>
        </span>
        <ul class="dropdown-menu w-100">
          <li class="dropdown-divider"></li>
          <li><a class="dropdown-item fw-bold" @click="logout" style="cursor: pointer;"><span>&#9940;</span> Logout</a></li>
        </ul>
      </div>

    </div>
</div>
<!-- /#sidebar-wrapper -->

<!--Navbar-->
<nav class="navbar bg-light">
  <div class="container-fluid">
    <a class="navbar-brand py-0" style="cursor: pointer;" id="menu-toggle">
      <h3 class="pi pi-bars"></h3>
    </a>

    <!--   Online users   -->
    <div class="justify-content-center mx-auto">
      <div class="navbar-nav">
        <a class="nav-link fw-bold">
          Benutzer online: {{ usersOnline }}
        </a>
      </div>
    </div>

  </div>
</nav>

<!-- Page Content -->

<div class="px-2">
  <router-view></router-view>
</div>


</div>
<!-- /#wrapper -->

  <Toast position="center" style="padding: 0;" class="my-toast"/>
</template>

<style scoped>

.my-toast {
  font-size: 0.5em !important;
}
body {
    overflow-x: hidden;
 }
.dropdown-toggle {
  cursor: pointer;
}
 .router-link-exact-active {
  color: #9af803 !important;
   font-weight: bold;
  background: none !important;
 }

/* Toggle Styles */

#wrapper {
    padding-left: 0;
    -webkit-transition: all 0.5s ease;
    -moz-transition: all 0.5s ease;
    -o-transition: all 0.5s ease;
    transition: all 0.5s ease;
}

#wrapper.toggled {
    padding-left: 250px;
}

#sidebar-wrapper {
    z-index: 1000;
    position: fixed;
    left: 250px;
    width: 0;
    height: 100%;
    margin-left: -250px;
    overflow-y: auto;
    background: #000;
    -webkit-transition: all 0.5s ease;
    -moz-transition: all 0.5s ease;
    -o-transition: all 0.5s ease;
    transition: all 0.5s ease;
}

#wrapper.toggled #sidebar-wrapper {
    width: 250px;
}

#page-content-wrapper {
    width: 100%;
    position: absolute;
    padding: 15px;
}

#wrapper.toggled #page-content-wrapper {
    position: absolute;
    margin-right: -250px;
}

/* Sidebar Styles */

.sidebar-nav {
    position: absolute;
    top: 0;
    width: 250px;
    margin: 0;
    padding: 0;
    list-style: none;
}

.sidebar-nav section {
    text-indent: 10px;
    line-height: 50px;
}

.sidebar-nav section a {
    display: block;
    text-decoration: none;
    color: #fff3cd;
    font-weight: bold;
  letter-spacing: 0.8px;
}

.sidebar-nav section a:hover {
    text-decoration: none;
    color: #f5d2ae;
    background: rgba(255,255,255,0.2);
}

.sidebar-nav section a:active,
.sidebar-nav section a:focus {
    text-decoration: none;
}

.sidebar-nav > .sidebar-brand {
    height: 65px;
    font-size: 18px;
    line-height: 60px;
}

.sidebar-nav > .sidebar-brand a {
    color: #999999;
}

.sidebar-nav > .sidebar-brand a:hover {
    color: #fff;
    background: none;
}

@media(min-width:768px) {
    #wrapper {
        padding-left: 250px;
    }

    #wrapper.toggled {
        padding-left: 0;
    }

    #sidebar-wrapper {
        width: 250px;
    }

    #wrapper.toggled #sidebar-wrapper {
        width: 0;
    }

    #page-content-wrapper {
        padding: 20px;
        position: relative;
    }

    #wrapper.toggled #page-content-wrapper {
        position: relative;
        margin-right: 0;
    }
}
</style>
