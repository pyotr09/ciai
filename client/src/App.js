import React, { Component } from 'react';
import './App.css';
import Home from './Home';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Security, SecureRoute, LoginCallback } from '@okta/okta-react';
import AccountsList from './AccountsList';
import AccountEdit from './AccountEdit';
import { withOktaAuth } from '@okta/okta-react';
import Api from './Api';
import NavBar from './NavBar';
import TransactionsList from "./TransactionsList";
import TransactionEdit from "./TransactionEdit";

const AuthWrapper = withOktaAuth(class WrappedRoutes extends Component {
    constructor(props) {
        super(props);
        this.state = {authenticated: null, user: null, api: new Api()};
        this.checkAuthentication = this.checkAuthentication.bind(this);
    }

    async checkAuthentication() {
        const authenticated = await this.props.authState.isAuthenticated;
        if (authenticated !== this.state.authenticated) {
            if (authenticated) {
                const user = await this.props.authService.getUser();
                let accessToken = await this.props.authService.getAccessToken();
                this.setState({authenticated, user, api: new Api(accessToken, user)});
            } else {
                this.setState({authenticated, user: null, api: new Api()});
            }
        }
    }

    async componentDidMount() {
        await this.checkAuthentication();
    }

    async componentDidUpdate() {
        await this.checkAuthentication();
    }

    async login() {
        if (this.state.authenticated === null) return; // do nothing if auth isn't loaded yet
        await this.props.authService.login('/');
    }

    async logout() {
        await this.props.authService.logout('/');
    }

    render() {
        let {authenticated, user, api} = this.state;

        if (authenticated === null) {
            return null;
        }

        const navbar = <NavBar
            isAuthenticated={authenticated}
            login={this.login.bind(this)}
            logout={this.logout.bind(this)}
        />;

        return (
            <Switch>
                <Route
                    path='/'
                    exact={true}
                    render={(props) => <Home {...props} authenticated={authenticated} user={user} api={api} navbar={navbar}/>}
                />
                <SecureRoute
                    path='/accounts'
                    exact={true}
                    render={(props) => <AccountsList {...props} authenticated={authenticated} user={user} api={api}
                                                        navbar={navbar}/>}
                />
                <SecureRoute
                    path='/accounts/:id'
                    render={(props) => <AccountEdit {...props} authenticated={authenticated} userId={user.sub} api={api}
                                                       navbar={navbar} />}
                />
                <SecureRoute
                    path='/transactions'
                    exact={true}
                    render={(props) => <TransactionsList {...props} authenticated={authenticated} user={user} api={api}
                                                     navbar={navbar}/>}
                />
                <SecureRoute
                    path='/transactions/:id'
                    render={(props) => <TransactionEdit {...props} authenticated={authenticated} userId={user.sub} api={api}
                                                    navbar={navbar} />}
                />
            </Switch>
        )
    }
});

class App extends Component {

    render() {
        return (
            <Router>
                <Security issuer='https://dev-97365878.okta.com/oauth2/default'
                          clientId='0oa4qye2gTjgpSwTx5d6'
                          redirectUri={window.location.origin + '/callback'}
                          pkce={true}>
                    <Route path='/callback' component={LoginCallback}/>
                    <AuthWrapper/>
                </Security>
            </Router>
        )
    }
}

export default App;
