import Menu from "@/views/menu/Menu.vue";

const menuRouter = [
    {
        path: '/menu',
        name: 'menu',
        component: Menu,
        meta: {requiresAuth: true}
    },

]

export default menuRouter;