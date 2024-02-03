import UserIndex from "../../../views/users/clients/UserIndex.vue";

const clientUserRouter = [
    {
        path: '/clients/users',
        name: 'client-users',
        component: UserIndex,
        meta: {requiresAuth: true, isAdmin: true}
    },
    
]

export default clientUserRouter;