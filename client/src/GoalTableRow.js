import React, {Component} from "react";
import {
    Box,
    Collapse,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from "@material-ui/core";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import DeleteIcon from "@material-ui/icons/Delete";

class GoalTableRow extends Component {
    constructor(props) {
        super(props);
        this.state = {open: false};

        this.setOpen = this.setOpen.bind(this);
    }

    setOpen(isOpen) {
        this.setState({open: isOpen});
    }

    render() {
        const goal = this.props.goal;
        const open = this.state.open;
        return (<React.Fragment>
            <TableRow>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => this.setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {new Date(goal.date).toLocaleDateString()}
                </TableCell>
                <TableCell align="right">{new Date(goal.createdDate).toLocaleDateString()}</TableCell>
                <TableCell align="right"><IconButton aria-label="expand row" size="small" onClick={this.props.delete}>
                    <DeleteIcon />
                </IconButton></TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={4}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <Typography variant="h6" gutterBottom component="div">
                                Account Balances
                            </Typography>
                            <Table size="small" aria-label="transactions">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Account Name</TableCell>
                                        <TableCell align="right">Balance</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {goal.goalAccountBalances
                                        .map((gabRow) => (
                                            <TableRow key={gabRow.id}>
                                                <TableCell component="th" scope="row">
                                                    {gabRow.account.name}
                                                </TableCell>
                                                <TableCell align="right">
                                                    ${Math.round(gabRow.balance* 100) / 100}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>);
    }

}

export default GoalTableRow;
