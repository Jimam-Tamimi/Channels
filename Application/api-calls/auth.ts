// /src/api/auth.ts

import api from "./api";

export const signIn = async (data: { username: string; password: string }) => {
 

    const response = await api.post('/account/token/', data);
    return response.data;
 
 
};

export const signUp = async (data: { username: string; email: string; password: string }) => {
    const response = await api.post('/account/users/', data);
    return response.data;
};

