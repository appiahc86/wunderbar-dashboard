import Login from "../../../src/views/users/Login.vue";
import ChangePassword from "../../views/users/ChangePassword.vue";
import DashboardUsers from "@/views/users/DashboardUsers.vue";
import EditUser from "@/views/users/EditUser.vue";
import AddUser from "@/views/users/AddUser.vue";

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
    {
        path: '/users/add',
        name: 'add-user',
        component: AddUser,
        meta: {requiresAuth: true, isAdmin: true}
    },
    {
        path: '/users/edit/:id',
        name: 'edit-user',
        component: EditUser,
        meta: {requiresAuth: true, isAdmin: true}
    },
    {
        path: '/dashboard/users/',
        name: 'dashboard-users',
        component: DashboardUsers,
        meta: {requiresAuth: true, isAdmin: true}
    },
]

export default userRouter;