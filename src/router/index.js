import { createRouter, createWebHistory } from 'vue-router';
import {useHomeStore} from "@/store/home";

import Home from '../views/Home.vue';
import Dashboard from '../views/Dashboard.vue';
import  userRouter from "@/router/users/index";
import menuRouter from "@/router/menu/index";
import menuItemsRouter from "@/router/menuItems/index";
import ordersRouter from "@/router/orders";
import settingsRouter from "@/router/settings";
import zipCodesRouter from "@/router/zipCodes";



const routes = [
    {
        path: '/',
        name: 'home',
        component: Home,
        meta: {requiresAuth: true}
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: Dashboard,
        meta: {requiresAuth: true}
    },

    //Load imported routes
    ...userRouter,
    ...menuRouter,
    ...menuItemsRouter,
    ...ordersRouter,
    ...settingsRouter,
    ...zipCodesRouter,

//    redirect to home page if route not found
    {
        path: '/:catchAll(.*)*',
        redirect: {name: 'home'}
    }
]


const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior (to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return { top: 0 }
        }
    }

})


router.beforeEach((to, from) => {
    const store = useHomeStore();
    if (to.meta.requiresAuth && !store.isLoggedIn) {
        return {
            name: 'login',
            // save the location we were at to come back later
            query: { redirect: to.fullPath },
        }
    }
})


export default router;