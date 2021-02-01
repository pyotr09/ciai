import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import {FormGroup, Button, TextField, Container} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

class AccountEdit extends Component {

    emptyItem = {
        name: '',
        currentBalance: '',
        userId: this.props.userId
    };

    constructor(props) {
        super(props);
        this.state = {
            item: this.emptyItem,
            errorMessage: null,
            isCreate: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentDidMount() {
        const isCreate = this.props.match.params.id === 'new'; // are we editing or creating?
        if (!isCreate) {
            const response = await this.props.api.getAccountById(this.props.match.params.id);
            const account = await response.json();
            this.setState({item: account});
        }
        this.setState({isCreate: isCreate})
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
        const {item, isCreate} = this.state;

        let result = isCreate ? await this.props.api.createAccount(item) : await this.props.api.updateAccount(item);

        if (!result.ok) {
            this.setState({errorMessage: `Failed to ${isCreate ? 'create' : 'update'} record: ${result.status} ${result.statusText}`})
        } else {
            this.setState({errorMessage: null});
            this.props.history.push('/accounts');
        }

    }

    render() {
        const {item, errorMessage, isCreate} = this.state;
        const title = <h2>{isCreate ? 'Add Account' : 'Edit Account'}</h2>;

        return (
            <div>
                {this.props.navbar}
                <Container>
                    {title}
                    {errorMessage ?
                        <Alert severity="warning">
                            {errorMessage}
                        </Alert> : null
                    }
                    <form onSubmit={this.handleSubmit}>
                        <div className="row">
                            <FormGroup className="col-md-8 mb-3">
                                <TextField id="name" label="Name" value={item.name || ''}
                                           onChange={this.handleChange} />
                            </FormGroup>
                            <FormGroup className="col-md-4 mb-3">
                                       <TextField id="currentBalance" label="Current Balance" value={item.currentBalance || ''}
                                       onChange={this.handleChange} />
                            </FormGroup>
                        </div>
                        <FormGroup>
                            <Button variant="contained" color="primary" type="submit">Save</Button>{' '}
                            <Button color="default" component={Link} to="/accounts">Cancel</Button>
                        </FormGroup>
                    </form>
                </Container>
            </div>
        );
    }
}

export default withRouter(AccountEdit);
