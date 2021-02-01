import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {
    Alert,
    Button,
    Container,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Form,
    FormGroup,
    Input,
    Label
} from 'reactstrap';

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
            dropdownOpen: false,
            accountsForLookup : []
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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

    toggle = () => this.setState({dropdownOpen: !this.state.dropdownOpen});

    render() {
        const {item, errorMessage, isCreate, account, dropdownOpen} = this.state;
        const dateString = item.date.substring(0, 10);
        const title = <h2>{isCreate ? 'Add Transaction' : 'Edit Transaction'}</h2>;
        const accountsForLookup = this.state.accountsForLookup;

        return (
            <div>
                {this.props.navbar}
                <Container style={{textAlign: 'left'}}>
                    {title}
                    {errorMessage ?
                        <Alert color="warning">
                            {errorMessage}
                        </Alert> : null
                    }
                    <Form onSubmit={this.handleSubmit}>
                        <div className="row">
                            <FormGroup className="col-md-8 mb-3">
                                <Label for="name">Description</Label>
                                <Input type="text" name="description" id="description" value={item.description || ''}
                                       onChange={this.handleChange} autoComplete="name"/>
                            </FormGroup>
                            <FormGroup className="col-md-4 mb-3">
                                <Label for="amount">Amount</Label>
                                <Input type="text" name="amount" id="amount" value={item.amount || ''}
                                       onChange={this.handleChange} />
                            </FormGroup>
                            <FormGroup className="col-md-4 mb-3">
                                <Label for="date">Date</Label>
                                <Input type="date" name="date" id="date" value={dateString}
                                       onChange={this.handleChange} />
                            </FormGroup>
                        </div>
                        <FormGroup>
                            <Label for="account">Account</Label>
                            <Input type="text" name="account" id="account" value={account.name || ''}
                                   onChange={this.handleChange} disabled />
                            <Dropdown isOpen={dropdownOpen} toggle={this.toggle}>
                                <DropdownToggle caret>
                                    Choose Account
                                </DropdownToggle>
                                <DropdownMenu right>
                                    <DropdownItem header>Accounts</DropdownItem>
                                    {accountsForLookup.map(acc =>
                                        <DropdownItem key={acc.id} onClick={() =>this.setState({account: acc})}>
                                            {acc.name}</DropdownItem>
                                    )}
                                </DropdownMenu>
                            </Dropdown>
                        </FormGroup>
                        <FormGroup>
                            <Button color="primary" type="submit">Save</Button>{' '}
                            <Button color="secondary" tag={Link} to="/transactions">Cancel</Button>
                        </FormGroup>
                    </Form>
                </Container>
            </div>
        );
    }
}

export default withRouter(TransactionEdit);
