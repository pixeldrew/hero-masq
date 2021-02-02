import React, { useLayoutEffect, useRef } from "react";
import PropTypes from "prop-types";

import { formatDistance } from "date-fns";

import { makeStyles } from "@material-ui/core/styles";
import { DataGrid } from "@material-ui/data-grid";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
}));

export function LeaseList({ leases }) {
  const columns = [
    { field: "ip", headerName: "IP", width: 120 },
    { field: "host", headerName: "Host Name", flex: 1 },
    { field: "mac", headerName: "Mac Address", flex: 0.7 },
    { field: "client", headerName: "Client Label", flex: 0.3 },
    { field: "timestamp", headerName: "Time Stamp", flex: 0.5 },
  ];

  const rows = leases.map(({ ip, host, mac, client, timestamp }, i) => ({
    id: i,
    ip,
    host,
    mac,
    client,
    timestamp:
      timestamp === "0"
        ? "Infinite"
        : formatDistance(new Date(timestamp * 1000), Date.now()),
  }));

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
        density="compact"
        pageSize={20}
        disableSelectionOnClick={true}
      />
    </div>
  );
}

LeaseList.propTypes = {
  leases: PropTypes.array.isRequired,
};
