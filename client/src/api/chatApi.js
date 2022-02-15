import axios from "axios"
import { API } from "../constant/namespace"

export const create_box = ({token, box}) => {
    return axios({
        url: `${API}/box`,
        method: "post",
        headers: {
            "Content-type": "application/json",
            "Authorization": token
        },
        data: box
    }).then((response) => {
        return response.data;
    }).catch((err) => {
        throw Error(err.response.data?.error)
    })
}

export const join_box = ({token, box}) => {
    return axios({
        url: `${API}/box`,
        method: "put",
        headers: {
            "Content-type": "application/json",
            "Authorization": token
        },
        data: box
    }).then((response) => {
        return response.data;
    }).catch((err) => {
        throw Error(err.response.data?.error)
    })
}

export const get_all_box = ({token}) => {
    return axios({
        url: `${API}/box`,
        method: "get",
        headers: {
            "Content-type": "application/json",
            "Authorization": token
        }
    }).then((response) => {
        return response.data;
    }).catch((err) => {
        throw Error(err.response.data?.error)
    })
}

export const post_chat = ({token, message, boxId, user}) => {
    return axios({
        url: `${API}/box/${boxId}`,
        method: "post",
        headers: {
            "Content-type": "application/json",
            "Authorization": token
        },
        data: {message: message, user: user}
    }).then((response) => {
        return response.data;
    }).catch((err) => {
        throw Error(err.response.data?.error)
    })
}

export const out_box = ({token, boxId}) => {
    return axios({
        url: `${API}/box/${boxId}`,
        method: "delete",
        headers: {
            "Content-type": "application/json",
            "Authorization": token
        },
    }).then((response) => {
        return response.data;
    }).catch((err) => {
        throw Error(err.response.data?.error)
    })
}

export const remove_box = ({token, boxId}) => {
    return axios({
        url: `${API}/box`,
        method: "delete",
        headers: {
            "Content-type": "application/json",
            "Authorization": token
        },
        data: {id: boxId}
    }).then((response) => {
        return response.data;
    }).catch((err) => {
        throw Error(err.response.data?.error)
    })
}