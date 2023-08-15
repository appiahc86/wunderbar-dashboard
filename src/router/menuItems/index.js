import MenuItems from "@/views/menuItems/MenuItems.vue";
import AddMenuItem from "@/views/menuItems/AddMenuItem.vue";
import EditMenuItem from "@/views/menuItems/EditMenuItem.vue";

const menuItemsRouter = [
    {
        path: '/menuItems',
        name: 'menu-items',
        component: MenuItems,
        // meta: {requiresAuth: true}
    },
    {
        path: '/menuItems/add',
        name: 'add-menu-item',
        component: AddMenuItem,
        // meta: {requiresAuth: true}
    },
    {
        path: '/menuItems/edit/:slug',
        name: 'edit-menu-item',
        component: EditMenuItem,
        // meta: {requiresAuth: true}
    },

]

export default menuItemsRouter;