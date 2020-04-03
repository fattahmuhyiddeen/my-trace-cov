export const LOGIN_USER = 'LOGIN_USER'
export const LOGOUT_USER = 'LOGOUT_USER'

export const loginUser = data => {
    return {
        type: LOGIN_USER,
        data
    }
}

export const logoutUser = () => {
    return {
        type: LOGOUT_USER,
    }
}