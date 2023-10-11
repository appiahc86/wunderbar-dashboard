import { defineStore } from 'pinia'

// You can name the return value of `defineStore()` anything you want,
// but it's best to use the name of the store and surround it with `use`
// and `Store` (e.g. `useUserStore`, `useCartStore`, `useProductStore`)
// the first argument is a unique id of the store across your application


export const useComponentStore = defineStore('componentStore', {
    state: () => {
        return {
            authDialog: false,
            passwordResetDialog: false

        }
    },

    getters: {

    },

    actions: {
        //Set Defaults
        setDefaults(){
            this.authDialog = false;
            this.passwordResetDialog = false;
        }


    }

})