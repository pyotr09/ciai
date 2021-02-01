import React, { Component } from 'react';
import {Alert} from "@material-ui/lab";
import {Button, Card, CardActions, CardContent, Typography} from "@material-ui/core";
import { Link } from 'react-router-dom';

const Account = (props) => (
    <div className="accounts-container p-2 m-2 d-flex flex-column">
        <Card>
            <CardContent>
                <Typography variant="h5" component="h2">
                    {props.name}
                </Typography>
                <Typography variant="body2" component="p">
                    Current Balance: ${props.currentBalance}
                </Typography>
            </CardContent>
            <CardActions>
                <Button color="primary" component={Link} to={'/accounts/' + props.id}>Edit</Button>
                <Button color="secondary" onClick={() => props.remove(props.id)}>Delete</Button>
            </CardActions>
        </Card>
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
                    <Button variant="contained" color="primary" component={Link} to="/accounts/new">Add New</Button>
                </div>
                {errorMessage ?
                    <div className="d-flex flex-row justify-content-center">
                        <Alert severity="warning" style={{flex:1, maxWidth:'80%'}}>
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
