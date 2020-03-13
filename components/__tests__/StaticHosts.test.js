import React from "react";
import { render, waitForElement } from "@testing-library/react";
import { MockedProvider } from "@apollo/react-testing";

// The component AND the query need to be exported
import { STATIC_HOSTS_QUERY, StaticHosts } from "../StaticHosts";

const mocks = [
  {
    request: {
      query: STATIC_HOSTS_QUERY
    },
    result: {
      data: {
        staticHosts: [
          {
            id: "85c2f09b555f5abdd6d3bcdb50fc52e69461af8b",
            mac: "01:01:01:01:01:01",
            ip: "10.137.0.252",
            client: "",
            host: "rancher",
            leaseExpiry: "24h"
          }
        ]
      }
    }
  }
];

it("should render loading state initially", async () => {
  const { getByText } = render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <StaticHosts />
    </MockedProvider>
  );

  expect(getByText("Loading")).toHaveTextContent("Loading");
});

it("should render static hosts", async () => {
  const { getByText } = render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <StaticHosts />
    </MockedProvider>
  );

  const hostnameTextNode = await waitForElement(() => getByText("rancher"));

  expect(hostnameTextNode).toHaveTextContent("rancher");
});
