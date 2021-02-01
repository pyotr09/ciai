import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {Select, TextField, InputLabel, MenuItem, FormControl,
FormGroup, InputAdornment, Container, Button} from "@material-ui/core";
import {Alert} from "@material-ui/lab";
import {KeyboardDatePicker} from '@material-ui/pickers';
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

class TransactionEdit extends Component {

    emptyItem = {
        description: '',
        amount: '',
        date: '',
        userId: this.props.userId
    };
    emptyAccount = {
        name: '',
        currentBalance: '',
        userId: this.props.userId
    };

    constructor(props) {
        super(props);
        this.state = {
            item: this.emptyItem,
            errorMessage: null,
            isCreate: false,
            account : this.emptyAccount,
            accountsForLookup : []
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleAccountChange = this.handleAccountChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
    }

    async componentDidMount() {
        this.state.isCreate = this.props.match.params.id === 'new'; // are we editing or creating?
        if (!this.state.isCreate) {
            const response = await this.props.api.getTransactionById(this.props.match.params.id);
            const transaction = await response.json();
            const accResponse = await this.props.api.getTransactionAccount(this.props.match.params.id);
            const account = await accResponse.json();
            this.setState({item: transaction});
            this.setState({account: account})
        }
        const response = await this.props.api.getAllAccountsForUser();
        if (!response.ok) {
            this.setState({
                    errorMessage: `Failed to load accounts: ${response.status} ${response.statusText}`,
                    isLoading: false
                }
            )
        }
        else {
            const accounts = await response.json();
            this.setState({
                accountsForLookup: accounts
            });
        }
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const id = target.id;
        let item = {...this.state.item};
        item[id] = value;
        this.setState({item});
    }

    handleDateChange(date) {
        let item = {...this.state.item};
        item["date"] = new Date(date).toISOString();
        this.setState({item});
    }

    handleAccountChange(event) {
        const accName = event.target.value;
        const acc = this.state.accountsForLookup.find(acc => acc.name === accName);
        this.setState({account: acc});
    }

    async handleSubmit(event) {
        event.preventDefault();
        const {item, isCreate, account} = this.state;

        let result = isCreate
            ? await this.props.api.createTransaction(item, account)
            : await this.props.api.updateTransaction(item, account);

        if (!result.ok) {
            this.setState({errorMessage: `Failed to ${isCreate ? 'create' : 'update'} record: ${result.status} ${result.statusText}`})
        } else {
            this.setState({errorMessage: null});
            this.props.history.push('/transactions');
        }

    }

    render() {
        const {item, errorMessage, isCreate, account} = this.state;
        const dateString = item.date.substring(0, 10);
        const title = <h2>{isCreate ? 'Add Transaction' : 'Edit Transaction'}</h2>;
        const accountsForLookup = this.state.accountsForLookup;

        return (
            <div>
                {this.props.navbar}
                <Container style={{textAlign: 'left'}}>
                    {title}
                    {errorMessage ?
                        <Alert severity="warning">
                            {errorMessage}
                        </Alert> : null
                    }
                    <form onSubmit={this.handleSubmit}>
                        <div className="row">
                            <FormGroup className="col-md-8 mb-3">
                                <TextField id="description" label="Description" value={item.description || ''}
                                           onChange={this.handleChange} />
                            </FormGroup>
                            <FormGroup className="col-md-4 mb-3">
                                <TextField id="amount" label="Amount" value={item.amount || 0.00}
                                           onChange={this.handleChange}
                                           InputProps={{
                                               startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                           }} />
                            </FormGroup>
                            <FormGroup className="col-md-4 mb-3">
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                        disableToolbar
                                        variant="inline"
                                        format="MM/dd/yyyy"
                                        margin="normal"
                                        id="date-picker"
                                        label="Date"
                                        value={dateString || new Date()}
                                        onChange={date => this.handleDateChange(date)}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                    />
                                </MuiPickersUtilsProvider>
                            </FormGroup>
                        </div>
                        <FormGroup>
                            <InputLabel id="account-select-label">Account</InputLabel>
                            <FormControl className="col-md-4 mb-3">
                                <Select value={account.name} id={"account-select"} labelId={"account-select-label"}
                                    onChange={this.handleAccountChange}>
                                    {accountsForLookup.map(acc =>
                                        <MenuItem key={acc.id} value={acc.name}>{acc.name}</MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                        </FormGroup>
                        <FormGroup>
                            <Button variant="contained" color="primary" type="submit">Save</Button>{' '}
                            <Button color="primary" component={Link} to="/transactions">Cancel</Button>
                        </FormGroup>
                    </form>
                </Container>
            </div>
        );
    }
}

export default withRouter(TransactionEdit);
