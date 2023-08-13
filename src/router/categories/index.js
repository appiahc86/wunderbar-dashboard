import Categories from "@/views/categories/Categories.vue";

const categoriesRouter = [
    {
        path: '/categories',
        name: 'categories',
        component: Categories,
        // meta: {requiresAuth: true}
    },

]

export default categoriesRouter;