import OrdersIndexView from "@/views/orders/OrdersIndexView.vue";

const ordersRouter = [
    {
        path: '/orders',
        name: 'orders',
        component: OrdersIndexView,
        // meta: {requiresAuth: true}
    },

]

export default ordersRouter;