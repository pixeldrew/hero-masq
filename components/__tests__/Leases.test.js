import React from "react";
import { render, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/react-testing";

// The component AND the query need to be exported
import { LEASES_QUERY, Leases } from "../Leases";
import { LEASES_UPDATED_SUBSCRIPTION } from "../LastUpdated";

const mocks = [
  {
    request: {
      query: LEASES_QUERY
    },
    result: {
      data: {
        leases: [
          {
            mac: "11:11:11:11:11:11",
            ip: "10.137.0.110",
            client: "eh",
            host: "host11",
            timestamp: "1568228852"
          }
        ]
      }
    }
  },
  {
    request: {
      query: LEASES_UPDATED_SUBSCRIPTION
    },
    result: {
      data: {
        leasesUpdated: {
          dateUpdated: "2020-03-12T15:27:45.782Z"
        }
      }
    }
  }
];

it("should render loading state initially", async () => {
  const { getByText } = render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <Leases />
    </MockedProvider>
  );

  expect(getByText("Fetching")).toHaveTextContent("Fetching");
});

it("should render leases", async () => {
  const { getByText } = render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <Leases />
    </MockedProvider>
  );

  const ipTextNode = await waitFor(() => getByText("10.137.0.110"));

  expect(ipTextNode).toHaveTextContent("10.137.0.110");
});
