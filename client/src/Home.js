import React, { Component } from 'react';
import './App.css';
import { Link } from 'react-router-dom';
import {Button, Container} from '@material-ui/core';
import Projection from './Projection';

class Home extends Component {

    render() {
        if (this.props.authenticated === null) {
            return <p>Loading...</p>;
        }
        return (
            <div className="app">
                {this.props.navbar}
                <Container>
                    {this.props.authenticated ?
                        <div>
                            <p>Welcome, {this.props.user.name}</p>
                            <Button variant="contained" color="primary" component={Link} to="/accounts">Manage Accounts</Button>
                            <Button variant="contained" color="primary" component={Link} to="/transactions">Manage Transactions</Button>
                            <Projection api={this.props.api} userId={this.props.user.sub}/>
                        </div> :
                        <div>
                            <p>Please log in.</p>
                            <Button color="primary" disabled={true}>
                                Manage Accounts
                            </Button>
                            <Button color="primary" disabled={true}>
                                Manage Transactions
                            </Button>
                        </div>
                    }
                </Container>
            </div>
        );
    }
}

export default Home;
