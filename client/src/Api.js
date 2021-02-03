class Api {

    constructor(authToken, user) {
        this.authToken = authToken;
        this.user = user;
    }

    headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };

    uriHeaders = {
        'Accept': '*/*',
        'Content-Type': 'text/uri-list'
    };

    BASE_ACCOUNTS_URL = '/accounts';
    BASE_TRANS_URL = '/transactions';
    BASE_RECURTRANS_URL = '/recurringTransactions';

    createHeaders() {
        return this.headers;
        // this.authToken ? {
        //     ...this.headers,
        //     'Authorization': 'Bearer ' + this.authToken
        // } :
            //this.headers;

    }

    createUriListHeaders() {
        return this.uriHeaders;
        // this.authToken ? {
        //     ...this.uriHeaders,
        //     'Authorization': 'Bearer ' + this.authToken
        // } :
        //this.uriHeaders;
    }

    async getAll() {
        return await fetch(this.BASE_ACCOUNTS_URL, {
            method: 'GET',
            headers: this.createHeaders()
        });
    }

    async getAllAccountsForUser() {
        return await fetch(`/account/get?userId=${this.user.sub}`, {
            method: 'GET',
            headers: this.createHeaders()
        });
    }

    async getAccountById(id) {
        return await fetch(`${this.BASE_ACCOUNTS_URL}/${id}`, {
            method: 'GET',
            headers: this.createHeaders()
        });
    }

    async deleteAccount(id) {
        return await fetch(`${this.BASE_ACCOUNTS_URL}/${id}`, {
            method: 'DELETE',
            headers: this.createHeaders()
        });
    }

    async updateAccount(item) {
        return await fetch(`${this.BASE_ACCOUNTS_URL}/${item.id}`, {
            method: 'PUT',
            headers: this.createHeaders(),
            body: JSON.stringify(item)
        });
    }

    async createAccount(item) {
        return await fetch(this.BASE_ACCOUNTS_URL, {
            method: 'POST',
            headers: this.createHeaders(),
            body: JSON.stringify(item)
        });
    }

    async getTransactionById(id) {
        return await fetch(`${this.BASE_TRANS_URL}/${id}`, {
            method: 'GET',
            headers: this.createHeaders()
        });
    }

    async getTransactionAccount(tranId, isRecurring) {
        return await isRecurring ?
            fetch(`${this.BASE_RECURTRANS_URL}/${tranId}/account`, {
                method: 'GET',
                headers: this.createHeaders()
            })
            :
            fetch(`${this.BASE_TRANS_URL}/${tranId}/account`, {
                method: 'GET',
                headers: this.createHeaders()
            });
    }

    async getTransactionToAccount(tranId, isRecurring) {
        return await isRecurring ?
            fetch(`${this.BASE_RECURTRANS_URL}/${tranId}/toAccount`, {
                method: 'GET',
                headers: this.createHeaders()
            })
            :
            fetch(`${this.BASE_TRANS_URL}/${tranId}/toAccount`, {
                method: 'GET',
                headers: this.createHeaders()
            });
    }

    async deleteTransaction(id) {
        return await fetch(`${this.BASE_TRANS_URL}/${id}`, {
            method: 'DELETE',
            headers: this.createHeaders()
        });
    }

    async getAllTransactionsForUser() {
        return await fetch(`/transaction/get?userId=${this.user.sub}`, {
            method: 'GET',
            headers: this.createHeaders()
        });
    }

    async updateTransaction(item, account, toAccount) {
        let transResponse = await fetch(`${this.BASE_TRANS_URL}/${item.id}`, {
            method: 'PUT',
            headers: this.createHeaders(),
            body: JSON.stringify(item)
        });

        await fetch(`/transactions/${item.id}/account`, {
            method: 'PUT',
            headers: this.createUriListHeaders(),
            body: `/accounts/${account.id}`
        });

        if (toAccount.id) {
            await fetch(`/transactions/${item.id}/toAccount`, {
                method: 'PUT',
                headers: this.createUriListHeaders(),
                body: `/accounts/${toAccount.id}`
            });
        }

        return transResponse;
    }

    async createTransaction(item, account, toAccount) {
        let transResponse =  await fetch(this.BASE_TRANS_URL, {
            method: 'POST',
            headers: this.createHeaders(),
            body: JSON.stringify(item)
        });

        const trans = await transResponse.json();
        await fetch(`/transactions/${trans.id}/account`, {
            method: 'PUT',
            headers: this.createUriListHeaders(),
            body: `/accounts/${account.id}`
        });

        if (toAccount.id) {
            await fetch(`/transactions/${trans.id}/toAccount`, {
                method: 'PUT',
                headers: this.createUriListHeaders(),
                body: `/accounts/${toAccount.id}`
            });
        }

        return transResponse;
    }

    async getAllRecurringTransForUser() {
        return await fetch(`/transaction/getRecurring?userId=${this.user.sub}`, {
            method: 'GET',
            headers: this.createHeaders()
        });
    }

    async getRecurringTransactionById(id) {
        return await fetch(`${this.BASE_RECURTRANS_URL}/${id}`, {
            method: 'GET',
            headers: this.createHeaders()
        });
    }

    async updateRecurringTransaction(item, account, toAccount) {
        let transResponse = await fetch(`${this.BASE_RECURTRANS_URL}/${item.id}`, {
            method: 'PUT',
            headers: this.createHeaders(),
            body: JSON.stringify(item)
        });

        await fetch(`/recurringTransactions/${item.id}/account`, {
            method: 'PUT',
            headers: this.createUriListHeaders(),
            body: `/accounts/${account.id}`
        });

        if (toAccount.id) {
            await fetch(`/recurringTransactions/${item.id}/toAccount`, {
                method: 'PUT',
                headers: this.createUriListHeaders(),
                body: `/accounts/${toAccount.id}`
            });
        }

        return transResponse;
    }

    async createRecurringTransaction(item, account, toAccount) {
        let transResponse =  await fetch(this.BASE_RECURTRANS_URL, {
            method: 'POST',
            headers: this.createHeaders(),
            body: JSON.stringify(item)
        });

        const trans = await transResponse.json();
        await fetch(`/recurringTransactions/${trans.id}/account`, {
            method: 'PUT',
            headers: this.createUriListHeaders(),
            body: `/accounts/${account.id}`
        });

        if (toAccount.id) {
            await fetch(`/recurringTransactions/${trans.id}/toAccount`, {
                method: 'PUT',
                headers: this.createUriListHeaders(),
                body: `/accounts/${toAccount.id}`
            });
        }

        return transResponse;
    }

    async deleteRecurringTransaction(id) {
        return await fetch(`${this.BASE_RECURTRANS_URL}/${id}`, {
            method: 'DELETE',
            headers: this.createHeaders()
        });
    }

    async calculateProjection(date) {
        return await fetch(`/projection/calculate?userId=${this.user.sub}&startDate=${new Date().toLocaleDateString()}&endDate=${date.toLocaleDateString()}`, {
            method: 'GET',
            headers: this.createHeaders()
        });
    }
}

export default Api;
