import React, {Component} from 'react';
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import {
    Box,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@material-ui/core";
import ProjectionTableRow from "./ProjectionTableRow";
import GoalTableRow from "./GoalTableRow";

class Projection extends Component {

    constructor(props) {
        super(props);
        this.state = {
            date: this.getNextMonth(),
            errorMessage: '',
            projectedAccountBalances: [],
            goals: []
        };

        this.handleDateChange = this.handleDateChange.bind(this);
        this.onProjectClick = this.onProjectClick.bind(this);
        this.onSaveGoalClick = this.onSaveGoalClick.bind(this);
        this.deleteGoal = this.deleteGoal.bind(this);
    }

    async componentDidMount() {
        const response = await this.props.api.getAllGoalsForUser();
        if (!response.ok) {
            this.setState({
                    errorMessage: `Failed to load goals: ${response.status} ${response.statusText}`,
                    isLoading: false
                }
            )
        }
        else {
            const goals = await response.json();
            this.setState({
                goals: goals
            });
        }
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
        this.setState({date: date, });
    }

    async onProjectClick() {
        const response = await this.props.api.calculateProjection(this.state.date);
        if (!response.ok) {
            this.setState({
                    errorMessage: `Failed to calculate projection: ${response.status} ${response.statusText}`
                }
            )
        } else {
            const projections = await response.json();
            this.setState({projectedAccountBalances: projections});
        }
    }

    async onSaveGoalClick() {
        const newGoal = {date: this.state.date, createdDate: new Date(), userId: this.props.userId};
        const goalResponse = await this.props.api.createGoal(newGoal, this.state.projectedAccountBalances);
        if (!goalResponse.ok) {
            this.setState({
                    errorMessage: `Failed to create goal: ${goalResponse.status} ${goalResponse.statusText}`
                }
            )
        }
        else {
            let response = await this.props.api.getAllGoalsForUser();
            const updatedGoals = await response.json();
            this.setState({goals: updatedGoals, errorMessage: null});
        }
    }


    async deleteGoal(id) {
        let response = await this.props.api.deleteGoal(id);
        if (!response.ok) {
            this.setState({errorMessage: `Failed to delete goal: ${response.status} ${response.statusText}`})
        }
        else {
            let updatedGoals = [...this.state.goals].filter(i => i.id !== id);
            this.setState({goals: updatedGoals, errorMessage: null});
        }
    }

    render() {
        const projections = this.state.projectedAccountBalances;
        const goals = this.state.goals;
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
                <Button variant="contained" color="primary" onClick={this.onProjectClick}>Calculate Projection</Button>
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
                <Button hidden={projections.length < 1}
                        variant="contained"
                        color="primary"
                        onClick={this.onSaveGoalClick}>Save Projection as Goal</Button>
                <TableContainer component={Paper} hidden={goals.length < 1}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="h6" gutterBottom component="div">
                                        Goals
                                    </Typography></TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell align="right">Created On</TableCell>
                                <TableCell />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {goals.map((goal) => (
                                <GoalTableRow key={goal.id} goal={goal} delete={() => this.deleteGoal(goal.id)}/>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        );
    }

}

export default Projection;
