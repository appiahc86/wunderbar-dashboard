import OrdersIndexView from "@/views/orders/OrdersIndexView.vue";
import OrderDetails from "@/views/orders/OrderDetails.vue";
import DeliveringOrders from "@/views/orders/DeliveringOrders.vue";

const ordersRouter = [
    {
        path: '/orders',
        name: 'orders',
        component: OrdersIndexView,
        meta: {requiresAuth: true}
    },
    {
        path: '/orders/:id',
        name: 'view-order',
        component: OrderDetails,
        meta: {requiresAuth: true}
    },
    {
        path: '/orders/delivering',
        name: 'delivering-orders',
        component: DeliveringOrders,
        meta: {requiresAuth: true}
    },

]

export default ordersRouter;