import ZipCodesIndexView from "@/views/zipCodes/ZipCodesIndexView.vue";
import AddZipCodeView from "@/views/zipCodes/AddZipCodeView.vue";
import EditZipCodeView from "@/views/zipCodes/EditZipCodeView.vue";

const zipCodesRouter = [
    {
        path: '/zipcodes',
        name: 'zipcodes',
        component: ZipCodesIndexView,
        meta: {requiresAuth: true}
    },
    {
        path: '/zipcodes/add',
        name: 'add-zipcode',
        component: AddZipCodeView,
        meta: {requiresAuth: true}
    },
    {
        path: '/zipcodes/edit/:id',
        name: 'edit-zipcode',
        component: EditZipCodeView,
        meta: {requiresAuth: true}
    },

]

export default zipCodesRouter