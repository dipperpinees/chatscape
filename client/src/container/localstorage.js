export const removeAuth = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("id");
    localStorage.removeItem("avatar");
}

export const getAuth = () => {
    return {
        token: localStorage.getItem("token") || "",
        user: localStorage.getItem("user") || "",
        id: localStorage.getItem("id"),
        avatar: localStorage.getItem("avatar") || "",
    }
}

export const setAuth = ({token, user, id, avatar}) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", user);
    localStorage.setItem("id", id);
    if(avatar) {
        localStorage.setItem("avatar", avatar);
    }
}
