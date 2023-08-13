import MenuItems from "@/views/menu/MenuItems.vue";

const menuRouter = [
    {
        path: '/menu',
        name: 'menu',
        component: MenuItems,
        // meta: {requiresAuth: true}
    },

]

export default menuRouter;