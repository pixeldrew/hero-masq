import React, { useLayoutEffect, useRef } from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import { DataGrid } from "@material-ui/data-grid";

import { DeleteDialog } from "./DeleteDialog";

import { compareIPAddresses } from "../lib/ip";

const useStyles = makeStyles((theme) => ({
  gridWrapper: {
    padding: theme.spacing(1, 2, 2),
    "& .MuiTablePagination-root": {
      marginRight: "60px",
    },
  },
  header: {
    margin: theme.spacing(1, 2, -1),
    padding: theme.spacing(1, 0),
  },
  button: {
    margin: theme.spacing(1),
  },
}));

export function StaticHostsList({ editHost, deleteHost, staticHosts }) {
  const classes = useStyles();

  const columns = [
    {
      field: "ip",
      headerName: "IP",
      width: 120,
      sortComparator: compareIPAddresses,
    },
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
    <>
      <Typography className={classes.header} component="h2" variant="h5">
        Static Hosts
      </Typography>
      <div ref={gridWrapperRef} className={classes.gridWrapper}>
        <DataGrid
          autoHeight={true}
          rows={rows}
          pageSize={20}
          columns={columns}
          density="compact"
          disableSelectionOnClick={true}
        />
      </div>
    </>
  );
}

StaticHostsList.propTypes = {
  editHost: PropTypes.func,
  deleteHost: PropTypes.func,
  staticHosts: PropTypes.array,
};
