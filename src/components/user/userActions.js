import store from '../../store';
const { REACT_APP_BASE_URL } = process.env;

export const signup = () => {
    return function(dispatch) {
        console.log(process.env)
        fetch(`${REACT_APP_BASE_URL}signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(store.getState().user.form)
        })
        .then(resp => resp.json())
        .then(data => {
            if (data.user) {
                localStorage.token = data.token;
                dispatch(logInUser(data));
            } else {
                console.log(data.error);
            }
            dispatch(clearForm());
        })
    }
};

export const login = () => {
    return function(dispatch) {
        fetch(`${REACT_APP_BASE_URL}login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(store.getState().user.form)
        })
        .then(resp => resp.json())
        .then(data => {
            if (data.user) {
                localStorage.token = data.token;
                dispatch(logInUser(data));
            } else {
                console.log(data.error)
            }
            dispatch(clearForm());
        })
    }
};

export const autologin = () => {
    return function(dispatch) {
        fetch(`${REACT_APP_BASE_URL}autologin`, {
            headers: {
                'Authorization': `Bearer ${localStorage.token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(resp => resp.json())
        .then(data => {
            if (data.user) {
                dispatch(logInUser(data));
            } else {
                console.log(data.error)
            }
        });
    };
};

export const logout = () => {
    return function(dispatch) {
        localStorage.clear();
        dispatch(logOutUser());
    }
}

// UTILITY

const clearForm = () => {
    return {
        type: 'CLEAR_FORM'
    }
};

const logInUser = (data) => {
    return {
        type: 'LOGIN',
        payload: data.user
    }
};

const logOutUser = () => {
    return {
        type: 'LOGOUT'
    }
};