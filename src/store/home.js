import { defineStore } from 'pinia';
import router from "../router/index.js";
import { parse, stringify,  } from 'zipson';

// You can name the return value of `defineStore()` anything you want,
// but it's best to use the name of the store and surround it with `use`
// and `Store` (e.g. `useUserStore`, `useCartStore`, `useProductStore`)
// the first argument is a unique id of the store across your application


export const useHomeStore = defineStore('homeStore', {
    state: () => {
        return {
            user: {},
        }
    },

    getters: {

        isLoggedIn() {
            return (this?.user?.token && this?.user?.email);
        },

        isAdmin() {
            return(this?.user?.role === 1);
        },
        isUser() {
            return(this?.user?.role === 4 || this?.user?.role === 1);
        },
        isDeliveryPerson() {
            return(this?.user?.role === 5);
        },

    },

    actions: {

        //Set User data
        setUser (payload){
            this.user = payload;
        },

        //logout
        logout(){
            this.user = {};
            router.push({name: "login"})
        },


    },

    persist: {
        key: '_session',
        storage: sessionStorage,
        paths: ['user'],
        serializer: {
            deserialize: parse,
            serialize: stringify
        }
    },

})