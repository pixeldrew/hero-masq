import React from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";

import { DeleteDialog } from "./DeleteDialog";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  button: {
    margin: theme.spacing(1),
  },
}));

export function StaticHostsList({ editHost, deleteHost, staticHosts }) {
  const classes = useStyles();

  if (staticHosts.length === 0) {
    return null;
  }

  return (
    <Table className={classes.table}>
      <TableHead>
        <TableRow>
          <TableCell>IP</TableCell>
          <TableCell>Host Name</TableCell>
          <TableCell>Mac Address</TableCell>
          <TableCell>Client Id</TableCell>
          <TableCell>Expiry</TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {staticHosts.map((host) => (
          <TableRow key={`staticHost-${host.id}`}>
            <TableCell>{host.ip}</TableCell>
            <TableCell>{host.host}</TableCell>
            <TableCell>{host.mac}</TableCell>
            <TableCell>{host.client}</TableCell>
            <TableCell>{host.leaseExpiry}</TableCell>
            <TableCell>
              <Button
                variant="outlined"
                color="primary"
                className={classes.button}
                onClick={() => {
                  editHost(host);
                }}
              >
                Edit
              </Button>
              <DeleteDialog
                okHandler={() => {
                  deleteHost(host.id);
                }}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

StaticHostsList.propTypes = {
  editHost: PropTypes.func,
  deleteHost: PropTypes.func,
  staticHosts: PropTypes.array,
};
