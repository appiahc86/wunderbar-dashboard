import OrdersIndexView from "@/views/orders/OrdersIndexView.vue";
import Settings from "@/views/Settings.vue";


const settingsRouter = [
    {
        path: '/settings',
        name: 'settings',
        component: Settings,
        meta: {requiresAuth: true}
    }

]

export default settingsRouter;