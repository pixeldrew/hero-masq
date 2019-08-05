import * as PropTypes from "prop-types";
import React from "react";

export function LeaseList({ allLeases }) {
  return (
    <table>
      <tbody>
        {allLeases.map((lease, i) => (
          <tr key={`ip-${i}`}>
            <td>{lease.ip}</td>
            <td>{lease.mac}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

LeaseList.propTypes = {
  allLeases: PropTypes.array.isRequired
};
