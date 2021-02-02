import React, { useLayoutEffect, useRef } from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";

import { DeleteDialog } from "./DeleteDialog";
import Paper from "@material-ui/core/Paper";
import TableContainer from "@material-ui/core/TableContainer";
import { formatDistance } from "date-fns";
import { DataGrid } from "@material-ui/data-grid";

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

  const columns = [
    { field: "ip", headerName: "IP", width: 120 },
    { field: "host", headerName: "Host Name", flex: 1 },
    { field: "mac", headerName: "Mac Address", flex: 0.7 },
    { field: "client", headerName: "Client Label", flex: 0.2 },
    { field: "leaseExpiry", headerName: "Expiry", flex: 0.3 },
    {
      field: "id",
      headerName: " ",
      sortable: false,
      width: 120,
      disableClickEventBubbling: true,
      // eslint-disable-next-line react/display-name
      renderCell: (params) => {
        return (
          <>
            <IconButton
              disableRipple
              variant="outlined"
              aria-label="edit"
              className={classes.button}
              onClick={() => {
                editHost(params.row);
              }}
              size="small"
            >
              <EditIcon />
            </IconButton>
            <DeleteDialog
              okHandler={() => {
                deleteHost(params.value);
              }}
            />
          </>
        );
      },
    },
  ];

  const rows = staticHosts.map(
    ({ id, ip, host, mac, client, leaseExpiry, tags }, i) => ({
      id,
      ip,
      host,
      mac,
      client,
      leaseExpiry,
      tags,
    })
  );

  const gridWrapperRef = useRef(null);
  useLayoutEffect(() => {
    const gridDiv = gridWrapperRef.current;
    if (gridDiv) {
      const gridEl = gridDiv.querySelector("div");
      gridEl.style.height = "";
    }
  });

  return (
    <div ref={gridWrapperRef}>
      <DataGrid
        autoHeight={true}
        rows={rows}
        columns={columns}
        pageSize={20}
        density="compact"
        disableSelectionOnClick={true}
        hideFooterPagination={true}
      />
    </div>
  );
}

StaticHostsList.propTypes = {
  editHost: PropTypes.func,
  deleteHost: PropTypes.func,
  staticHosts: PropTypes.array,
};
