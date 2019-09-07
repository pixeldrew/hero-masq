import * as PropTypes from "prop-types";
import React from "react";

import { formatDistance } from "date-fns";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

const useStyles = makeStyles(theme => ({
  table: {
    minWidth: 650
  }
}));

export function LeaseList({ leases }) {
  const classes = useStyles();

  return (
    <Table className={classes.table}>
      <TableHead>
        <TableRow>
          <TableCell>IP Address</TableCell>
          <TableCell>Host Name</TableCell>
          <TableCell>MAC Address</TableCell>
          <TableCell>Client ID</TableCell>
          <TableCell>Expires</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {leases.map((lease, i) => (
          <TableRow key={`ip-${i}`}>
            <TableCell>{lease.ip}</TableCell>
            <TableCell>{lease.host}</TableCell>
            <TableCell>{lease.mac}</TableCell>
            <TableCell>{lease.client}</TableCell>
            <TableCell>
              {formatDistance(new Date(lease.timestamp * 1000), Date.now())}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

LeaseList.propTypes = {
  leases: PropTypes.array.isRequired
};
