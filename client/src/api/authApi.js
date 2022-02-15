import axios from "axios";
import { API } from "../constant/namespace";
import { setAuth } from "../container/localstorage";

export const sign_in =  (args) => {
    return axios({
            url: `${API}/signin`,
            method: "post",
            headers: {
                "Content-type": "application/json"
            },
            data: args
        }).then(response => {
            return response.data;
        }).then(data => {
            setAuth(data);
            return data;
        })
        .catch((error) => {
            throw Error(error.response.data?.error)
        });
       
}

export const sign_up = async (form) => {
    return axios({
        url: `${API}/signup`,
        method: "post",
        data: form
    }).then(response => {
        return response.data;
    }).then(data => {
        setAuth(data);
        return data;
    })
    .catch((error) => {
        throw Error(error.response.data?.error)
    });
}