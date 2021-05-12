const { REACT_APP_BASE_URL } = process.env;

// PORTFOLIO REQUESTS

export const createNewPortfolioRequest = (newPortfolioName) => {
    return fetch(`${REACT_APP_BASE_URL}portfolios`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({name: newPortfolioName})
    })
    .then(resp => resp.json());
};

export const getPortfolioRequest = (id) => {
    return fetch(`${REACT_APP_BASE_URL}portfolios/${id}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(resp => resp.json());
};

export const getPortfoliosRequest = () => {
    return fetch(`${REACT_APP_BASE_URL}portfolios`, {
        headers: {
            'Authorization': `Bearer ${localStorage.token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(resp => resp.json());
};

// ACTIVITY REQUESTS

export const createNewActivityRequest = (activityFormData) => {
    return fetch(`${REACT_APP_BASE_URL}activities`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(activityFormData)
    })
    .then(resp => resp.json())
};

export const sellActivityRequest = (activityFormData) => {
    return fetch(`${REACT_APP_BASE_URL}sell`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(activityFormData)
    })
    .then(resp => resp.json())
}

// STOCK REQUESTS

export const getStockSymbolsRequest = () => {
    return fetch(`${REACT_APP_BASE_URL}stocks`, {
        headers: {
            'Authorization': `Bearer ${localStorage.token}`
        }
    })
    .then(resp => resp.json())
}

export const getStockDataRequest = (query) => {
    return fetch(`${REACT_APP_BASE_URL}stocks/${query}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(resp => resp.json())
};

export const getStockQuotesRequest = (queries) => {
    return fetch(`${REACT_APP_BASE_URL}quotes/${queries}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(resp => resp.json())
};

export const getIntradayPricesRequest = (query, openPrice) => {
    return fetch(`${REACT_APP_BASE_URL}intraday/${query}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.token}`,
            'openPrice': openPrice
        }
    })
    .then(resp => resp.json())
}

export const getWeekPricesRequest = (query) => {
    return fetch(`${REACT_APP_BASE_URL}week/${query}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.token}`
        }
    })
    .then(resp => resp.json())
}

export const getHistoricalPricesRequest = (query, periodType, period) => {
    return fetch(`${REACT_APP_BASE_URL}historical/${query}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.token}`,
            periodType: periodType,
            period: period
        }
    })
    .then(resp => resp.json())
}

// FUND REQUESTS

export const createFundRequest = (form) => {
    const category = form.category === 'Deposit' ? 'deposit' : 'withdraw'
    return fetch(`${REACT_APP_BASE_URL}${category}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
    })
    .then(resp => resp.json())
}