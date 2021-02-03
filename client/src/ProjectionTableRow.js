import React, {Component} from 'react';
import {IconButton, TableCell, TableRow, Collapse, Box, Typography,
Table, TableHead, TableBody} from "@material-ui/core";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";

class ProjectionTableRow extends Component {

    constructor(props) {
        super(props);
        this.state = {open: false};

        this.setOpen = this.setOpen.bind(this);
    }

    setOpen(isOpen) {
        this.setState({open: isOpen});
    }

    render() {
        const projection = this.props.projection;
        const open = this.state.open;
        return (<React.Fragment>
            <TableRow key={projection.account.id}>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => this.setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {projection.account.name}
                </TableCell>
                <TableCell align="right">${projection.account.currentBalance.toFixed(2)}</TableCell>
                <TableCell align="right">${projection.balance.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={4}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <Typography variant="h6" gutterBottom component="div">
                                Included Transactions
                            </Typography>
                            <Table size="small" aria-label="transactions">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Description</TableCell>
                                        <TableCell align="right">Amount</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {projection.transactions.sort((t1, t2) => {return new Date(t1.date) - new Date(t2.date)} )
                                        .map((tranRow) => (
                                        <TableRow key={tranRow.date + tranRow.description}>
                                            <TableCell component="th" scope="row">
                                                {new Date(tranRow.date).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>{tranRow.description}</TableCell>
                                            <TableCell align="right">
                                                ${Math.round(tranRow.amount* 100) / 100}
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

export default ProjectionTableRow;
