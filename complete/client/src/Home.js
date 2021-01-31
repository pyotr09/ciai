import React, { Component } from 'react';
import './App.css';
import { Link } from 'react-router-dom';
import { Button, Container } from 'reactstrap';

class Home extends Component {

    render() {
        if (this.props.authenticated === null) {
            return <p>Loading...</p>;
        }
        return (
            <div className="app">
                {this.props.navbar}
                <Container fluid>
                    {this.props.authenticated ?
                        <div>
                            <p>Welcome, {this.props.user.name}</p>
                            <p>email, {this.props.user.email}</p>
                            <p>email, {this.props.user.id}</p>
                            <p>user, {JSON.stringify(this.props.user)}</p>
                            <Button color="secondary">
                                <Link className="app-link" to="/accounts">Manage Accounts</Link>
                            </Button>
                        </div> :
                        <div>
                            <p>Please log in to manage accounts.</p>
                            <Button color="secondary" disabled={true}>
                                Manage Accounts
                            </Button>
                        </div>
                    }
                </Container>
            </div>
        );
    }
}

export default Home;
