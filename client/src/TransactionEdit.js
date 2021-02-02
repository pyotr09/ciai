import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {Select, TextField, InputLabel, MenuItem, FormControl, FormControlLabel,
FormGroup, InputAdornment, Container, Button, Grid, Checkbox,
FormLabel, RadioGroup, Radio} from "@material-ui/core";
import {Alert} from "@material-ui/lab";
import {KeyboardDatePicker} from '@material-ui/pickers';
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

class TransactionEdit extends Component {

    emptyItem = {
        description: '',
        amount: '',
        date: new Date(),
        userId: this.props.userId
    };
    emptyRecurringItem = {
        description: '',
        amount: '',
        startDate: new Date(),
        endDate: new Date(),
        userId: this.props.userId,
        daysInterval: 0,
        type: "INTERVAL_FREQUENCY"
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
            recurringItem: this.emptyRecurringItem,
            errorMessage: null,
            isCreate: false,
            account : this.emptyAccount,
            accountsForLookup : [],
            isRecurring : false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleAccountChange = this.handleAccountChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleRecurChange = this.handleRecurChange.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.handleEndDateChange = this.handleEndDateChange.bind(this);
        this.handleIntervalChange = this.handleIntervalChange.bind(this);
    }

    async componentDidMount() {
        this.state.isCreate = this.props.match.params.id === 'new'; // are we editing or creating?
        console.log(`param1 is ${this.props.location.param1}`);
        const isRecurring = this.props.location.param1;
        if (!this.state.isCreate) {
            let response;
            if (!isRecurring) {
                response  = await this.props.api.getTransactionById(this.props.match.params.id);
                const transaction = await response.json();
                this.setState({item: transaction});
            }
            else {
                response = await this.props.api.getRecurringTransactionById(this.props.match.params.id);
                const recurringTransaction = await response.json();
                this.setState({recurringItem: recurringTransaction});
            }
            const accResponse = await this.props.api.getTransactionAccount(this.props.match.params.id, isRecurring);
            const account = await accResponse.json();
            this.setState({account: account, isRecurring : isRecurring})
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
        if (this.state.isRecurring) {
            let recurringItem = {...this.state.recurringItem};
            recurringItem[id] = value;
            this.setState({recurringItem: recurringItem});
        }
        else {
            let item = {...this.state.item};
            item[id] = value;
            this.setState({item});
        }
    }

    handleDateChange(date) {
        if (this.state.isRecurring) {
            let recurringItem = {...this.state.recurringItem};
            recurringItem["startDate"] = new Date(date);
            this.setState({recurringItem: recurringItem});
        }
        else {
            let item = {...this.state.item};
            item["date"] = new Date(date);
            this.setState({item: item});
        }
    }

    handleEndDateChange(date) {
        if (!this.state.isRecurring) return;
        let recurringItem = {...this.state.recurringItem};
        recurringItem["endDate"] = new Date(date);
        this.setState({recurringItem: recurringItem});
    }

    handleAccountChange(event) {
        const accName = event.target.value;
        const acc = this.state.accountsForLookup.find(acc => acc.name === accName);
        this.setState({account: acc});
    }

    handleRecurChange(event) {
        this.setState({isRecurring: event.target.checked});
    }

    handleTypeChange(event) {
        if (!this.state.isRecurring) return;
        let recurringItem = {...this.state.recurringItem};
        recurringItem["type"] = event.target.value;
        this.setState({recurringItem: recurringItem});
    }

    handleIntervalChange(event) {
        if (!this.state.isRecurring) return;
        let recurringItem = {...this.state.recurringItem};
        recurringItem["daysInterval"] = event.target.value;
        this.setState({recurringItem: recurringItem});
    }

    async handleSubmit(event) {
        event.preventDefault();
        const {item, recurringItem, isCreate, account, isRecurring} = this.state;

        let result = !isRecurring ?
            (isCreate
                ? await this.props.api.createTransaction(item, account)
                : await this.props.api.updateTransaction(item, account)) :
            (isCreate
                ? await this.props.api.createRecurringTransaction(recurringItem, account)
                : await this.props.api.updateRecurringTransaction(recurringItem, account));

        if (!result.ok) {
            this.setState({errorMessage: `Failed to ${isCreate ? 'create' : 'update'} record: ${result.status} ${result.statusText}`})
        } else {
            this.setState({errorMessage: null});
            this.props.history.push('/transactions');
        }

    }

    render() {
        const {item, recurringItem, errorMessage, isCreate, account, isRecurring} = this.state;
        const boundItem = isRecurring ? recurringItem : item;
        const date = isRecurring ? new Date(boundItem.startDate) : new Date(boundItem.date);
        const endDate = isRecurring ? new Date(boundItem.endDate) : new Date();
        const title = <h2>{isCreate ? 'Add Transaction' : 'Edit Transaction'}</h2>;
        const accountsForLookup = this.state.accountsForLookup;

        console.log(`interval is ${boundItem.daysInterval}`);

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
                                <TextField id="description" label="Description" value={boundItem.description || ''}
                                           onChange={this.handleChange} />
                            </FormGroup>
                            <FormGroup className="col-md-4 mb-3">
                                <TextField id="amount" label="Amount" value={boundItem.amount || 0.00}
                                           onChange={this.handleChange}
                                           InputProps={{
                                               startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                           }} />
                            </FormGroup>
                            <FormGroup className="col-md-4 mb-3">
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            disabled={!isCreate}
                                            checked={isRecurring}
                                            onChange={this.handleRecurChange}
                                            color="primary"
                                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                                        />}
                                    label="Recurring?"
                                />
                            </FormGroup>
                            <FormGroup className="col-md-4 mb-3">
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                        disableToolbar
                                        variant="inline"
                                        format="MM/dd/yyyy"
                                        margin="normal"
                                        id="date-picker"
                                        label={isRecurring ? "Start Date" : "Date"}
                                        value={date || new Date()}
                                        onChange={date => this.handleDateChange(date)}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                    />
                                    <KeyboardDatePicker
                                        hidden={!isRecurring}
                                        disableToolbar
                                        variant="inline"
                                        format="MM/dd/yyyy"
                                        margin="normal"
                                        id="end-date-picker"
                                        label="End Date"
                                        value={endDate || new Date()}
                                        onChange={date => this.handleEndDateChange(date)}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                    />
                                </MuiPickersUtilsProvider>
                            </FormGroup>
                            <FormGroup  className="col-md-4 mb-3" hidden={!isRecurring}>
                                <FormControl component="fieldset">
                                    <FormLabel component="legend">Recurrence Type</FormLabel>
                                    <RadioGroup aria-label="gender" name="interval" value={boundItem.type || "INTERVAL_FREQUENCY"} onChange={this.handleTypeChange}>
                                        <FormControlLabel value="INTERVAL_FREQUENCY" control={<Radio />} label="Frequency" />
                                        <FormControlLabel value="DAYS_OF_MONTH" control={<Radio />} label="Day of Month" />
                                    </RadioGroup>
                                </FormControl>
                                <FormGroup className="col-md-4 mb-3">
                                    <TextField id="interval" label="Interval in Days" value={boundItem.daysInterval || ''}
                                               onChange={this.handleIntervalChange}
                                               hidden={!isRecurring || boundItem.type === "DAYS_OF_MONTH"}
                                    />
                                </FormGroup>
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
