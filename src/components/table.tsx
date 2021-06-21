import React, {FunctionComponent} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});


export const TableList: FunctionComponent<any> = ({title, rows, children}) => {
    const classes = useStyles();

    return (
        <div>
            <h6>
                {title.toUpperCase()}
            </h6>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="right">Rating</TableCell>
                            <TableCell align="right">Positive</TableCell>
                            <TableCell align="right">Negative</TableCell>
                            <TableCell align="right">Neutral</TableCell>
                            <TableCell align="right">Review</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow key={row.rating}>
                                <TableCell component="th" scope="row">
                                    {row.rating}
                                </TableCell>
                                <TableCell align="right">{row.confidenceScores.positive}</TableCell>
                                <TableCell align="right">{row.confidenceScores.negative}</TableCell>
                                <TableCell align="right">{row.confidenceScores.neutral}</TableCell>
                                <TableCell align="right">{row.review.substring(0,100)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>

    );
}
