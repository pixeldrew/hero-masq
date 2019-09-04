import gql from "graphql-tag";
import { useSubscription } from "@apollo/react-hooks";
import React, { useState } from "react";
import { formatDistance } from "date-fns";
import { useInterval } from "../hooks/useInterval";

const LEASES_UPDATED_SUBSCRIPTION = gql`
  subscription leasesUpdated {
    leasesUpdated {
      dateUpdated
    }
  }
`;
export const LastUpdated = ({ triggerRefetch }) => {
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  const [sinceLastUpdated, setSinceLastUpdated] = useState(Date.now());
  const {
    data: { leasesUpdated: { dateUpdated = NaN } = {} } = {},
    loading
  } = useSubscription(LEASES_UPDATED_SUBSCRIPTION);

  useInterval(() => {
    setSinceLastUpdated(Date.now());
  }, 1000 * 60);

  if (dateUpdated > lastUpdated) {
    triggerRefetch();
    setLastUpdated(parseInt(dateUpdated, 10));
    setSinceLastUpdated(parseInt(dateUpdated, 10));
    return <h4>Refreshing</h4>;
  }

  return (
    <h4>
      {!loading &&
        dateUpdated &&
        `Last Updated ${formatDistance(
          new Date(lastUpdated),
          new Date(sinceLastUpdated)
        )} ago`}
    </h4>
  );
};
