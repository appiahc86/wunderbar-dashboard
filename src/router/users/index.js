import Login from "../../../src/views/users/Login.vue";
import ChangePassword from "../../views/users/ChangePassword.vue";

const userRouter = [
    {
        path: '/users/login',
        name: 'login',
        component: Login
    },
    {
        path: '/users/change-password',
        name: 'change-password',
        component: ChangePassword,
        meta: {requiresAuth: true}
    },
]

export default userRouter;