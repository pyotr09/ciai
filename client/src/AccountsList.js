import React, { Component } from 'react';
import {
    Alert,
    Button
} from 'reactstrap';
import { Link } from 'react-router-dom';

const Account = (props) => (
    <div className="accounts-container p-2 m-2 d-flex flex-column">
        <h3>{props.name}</h3>
        <div className="accounts-body">
            <div className="subtitle-container">
                <div>Current Balance: ${props.currentBalance}</div>
            </div>
        </div>
        <div className="account-footer">
            <Button color="secondary" tag={Link} to={'/accounts/' + props.id}>Edit</Button>
            <Button color="danger" onClick={() => props.remove(props.id)}>Delete</Button>
        </div>
    </div>
);

class AccountsList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            accounts: [],
            isLoading: true,
            errorMessage: null
        };
        this.remove = this.remove.bind(this);
    }

    async componentDidMount() {
        this.setState({isLoading: true});
        const response = await this.props.api.getAllAccountsForUser();
        if (!response.ok) {
            this.setState({
                    errorMessage: `Failed to load accounts: ${response.status} ${response.statusText}`,
                    isLoading: false
                }
            )
        }
        else {
            const body = await response.json();
            const accounts = body;
            this.setState({
                accounts: accounts,
                isLoading: false,
                errorMessage: null
            });
        }
    }

    async remove(id) {
        let response = await this.props.api.deleteAccount(id);
        if (!response.ok) {
            this.setState({errorMessage: `Failed to delete account: ${response.status} ${response.statusText}`})
        }
        else {
            let updatedAccounts = [...this.state.accounts].filter(i => i.id !== id);
            this.setState({accounts: updatedAccounts, errorMessage: null});
        }
    }

    render() {
        const {accounts, isLoading, errorMessage} = this.state;

        if (isLoading) {
            return <p>Loading...</p>;
        }

        return (
            <div>
                {this.props.navbar}
                <div className="d-flex flex-row justify-content-between p-3">
                    <h3 className="accounts-title">Accounts</h3>
                    <Button color="success" tag={Link} to="/accounts/new">Add New</Button>
                </div>
                {errorMessage ?
                    <div className="d-flex flex-row justify-content-center">
                        <Alert color="warning" style={{flex:1, maxWidth:'80%'}}>
                            {errorMessage}
                        </Alert>
                    </div> : null
                }
                <div className="d-flex flex-row flex-container flex-wrap justify-content-center">
                    {accounts.map( account =>
                        <Account {...account} remove={this.remove.bind(this)} key={account.id}/>
                    )}
                    {!accounts || accounts.length === 0 ? <p>No accounts!</p> : null}
                </div>
            </div>
        );
    }
}

export default AccountsList;
