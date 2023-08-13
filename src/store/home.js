import { defineStore } from 'pinia'
import { parse, stringify,  } from 'zipson';

// You can name the return value of `defineStore()` anything you want,
// but it's best to use the name of the store and surround it with `use`
// and `Store` (e.g. `useUserStore`, `useCartStore`, `useProductStore`)
// the first argument is a unique id of the store across your application


export const useHomeStore = defineStore('homeStore', {
    state: () => {
        return {
            user: {},
            token: "",
         }
    },

    getters: {

    },

    actions: {
        //Set Token
     setToken(payload){ this.token = payload },

    //set User
    setUser(payload){ this.user = payload },

       //Clear Token
     clearToken(){ this.token = "" },

    //Clear User
    clearUser(){ this.user = {} }

    },

    persist: {
       key: '_loda',
            storage: sessionStorage,
            paths: ['token', 'user'],
            serializer: {
                deserialize: parse,
                serialize: stringify
            }
        },

})