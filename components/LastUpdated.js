import React, { useState } from "react";
import PropTypes from "prop-types";

import gql from "graphql-tag";
import { useSubscription } from "@apollo/react-hooks";
import { formatDistance } from "date-fns";

import { useInterval } from "react-use";

export const LEASES_UPDATED_SUBSCRIPTION = gql`
  subscription leasesUpdated {
    leasesUpdated {
      dateUpdated
    }
  }
`;
export const LastUpdated = ({ triggerRefetch }) => {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [sinceLastUpdated, setSinceLastUpdated] = useState(new Date());
  const {
    data: { leasesUpdated: { dateUpdated = null } = {} } = {},
    loading,
  } = useSubscription(LEASES_UPDATED_SUBSCRIPTION);

  useInterval(() => {
    setSinceLastUpdated(new Date());
  }, 1000 * 60);

  const dateUpdatedDateTime = new Date(dateUpdated);

  if (dateUpdatedDateTime > lastUpdated) {
    triggerRefetch();
    setLastUpdated(dateUpdatedDateTime);
    setSinceLastUpdated(dateUpdatedDateTime);
    return <h4>Refreshing</h4>;
  }

  return (
    <h4>
      {!loading &&
        dateUpdated &&
        `Last Updated ${formatDistance(lastUpdated, sinceLastUpdated)} ago`}
    </h4>
  );
};

LastUpdated.propTypes = {
  triggerRefetch: PropTypes.func,
};
