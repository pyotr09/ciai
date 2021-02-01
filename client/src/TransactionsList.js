import React, { Component } from 'react';
import {
    Alert,
    Button
} from 'reactstrap';
import { Link } from 'react-router-dom';

const Transaction = (props) => (
    <div className="transactions-container p-2 m-2 d-flex flex-column">
        <h3>{props.description}</h3>
        <div className="transactions-body">
            <div className="subtitle-container">
                <div>Amount: ${props.amount}</div>
                <div>Date: {new Date(props.date).toLocaleDateString()}</div>
                <div>Account: {props.account.name}</div>
            </div>
        </div>
        <div className="transaction-footer">
            <Button color="secondary" tag={Link} to={'/transactions/' + props.id}>Edit</Button>
            <Button color="danger" onClick={() => props.remove(props.id)}>Delete</Button>
        </div>
    </div>
);

class TransactionsList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            transactions: [],
            isLoading: true,
            errorMessage: null
        };
        this.remove = this.remove.bind(this);
    }

    async componentDidMount() {
        this.setState({isLoading: true});
        const response = await this.props.api.getAllTransactionsForUser();
        if (!response.ok) {
            this.setState({
                    errorMessage: `Failed to load transactions: ${response.status} ${response.statusText}`,
                    isLoading: false
                }
            )
        }
        else {
            const body = await response.json();
            const transactions = body;
            this.setState({
                transactions: transactions,
                isLoading: false,
                errorMessage: null
            });
        }
    }

    async remove(id) {
        let response = await this.props.api.deleteTransaction(id);
        if (!response.ok) {
            this.setState({errorMessage: `Failed to delete transaction: ${response.status} ${response.statusText}`})
        }
        else {
            let updatedTransactions = [...this.state.transactions].filter(i => i.id !== id);
            this.setState({transactions: updatedTransactions, errorMessage: null});
        }
    }

    render() {
        const {transactions, isLoading, errorMessage} = this.state;

        if (isLoading) {
            return <p>Loading...</p>;
        }

        return (
            <div>
                {this.props.navbar}
                <div className="d-flex flex-row justify-content-between p-3">
                    <h3 className="transactions-title">Transactions</h3>
                    <Button color="success" tag={Link} to="/transactions/new">Add New</Button>
                </div>
                {errorMessage ?
                    <div className="d-flex flex-row justify-content-center">
                        <Alert color="warning" style={{flex:1, maxWidth:'80%'}}>
                            {errorMessage}
                        </Alert>
                    </div> : null
                }
                <div className="d-flex flex-row flex-container flex-wrap justify-content-center">
                    {transactions.map( transaction =>
                        <Transaction {...transaction} remove={this.remove.bind(this)} key={transaction.id}/>
                    )}
                    {!transactions || transactions.length === 0 ? <p>No transactions!</p> : null}
                </div>
            </div>
        );
    }
}

export default TransactionsList;
