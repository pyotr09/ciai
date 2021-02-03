import React, {Component} from 'react';
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import {Button, Table, Paper, TableContainer, TableHead, TableRow, TableCell, TableBody,
IconButton} from "@material-ui/core";
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import ProjectionTableRow from "./ProjectionTableRow";

class Projection extends Component {

    constructor(props) {
        super(props);
        this.state = {
            date: this.getNextMonth(),
            errorMessage: '',
            projectedAccountBalances: []
        };

        this.handleDateChange = this.handleDateChange.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    getNextMonth() {
        let date = new Date();
        let d = date.getDate();
        date.setMonth(date.getMonth() + 1);
        if (date.getDate() !== d) {
            date.setDate(0);
        }
        return date;
    }

    handleDateChange(date) {
        this.setState({date: date});
    }

    async onClick() {
        const response = await this.props.api.calculateProjection(this.state.date);
        if (!response.ok) {
            this.setState({
                    errorMessage: `Failed to load calculate projection: ${response.status} ${response.statusText}`
                }
            )
        } else {
            const projections = await response.json();
            this.setState({projectedAccountBalances: projections});
        }
    }

    render() {
        const projections = this.state.projectedAccountBalances;
        return (
            <div>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                        disableToolbar
                        variant="inline"
                        format="MM/dd/yyyy"
                        margin="normal"
                        id="projection-date"
                        label={"Projection Date"}
                        value={this.state.date}
                        onChange={date => this.handleDateChange(date)}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                    />
                </MuiPickersUtilsProvider>
                <Button variant="contained" color="primary" onClick={this.onClick}>Calculate Projection</Button>
                <TableContainer component={Paper} hidden={projections.length < 1}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell />
                                <TableCell>Account</TableCell>
                                <TableCell align="right">Current Balance</TableCell>
                                <TableCell align="right">Balance on {projections[0] ? new Date(projections[0].date).toLocaleDateString() : ''}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {projections.map((projection) => (
                                <ProjectionTableRow key={projection.account.id} projection={projection}/>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        );
    }

}

export default Projection;
