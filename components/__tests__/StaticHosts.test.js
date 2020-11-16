import React from "react";
import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import { MockedProvider } from "@apollo/react-testing";

// The component AND the query need to be exported
import {
  STATIC_HOSTS_QUERY,
  ADD_STATIC_HOST,
  StaticHosts,
} from "../StaticHosts";

const INPUT_HOST_STATIC_HOST = {
  client: "",
  host: "norris",
  ip: "10.137.0.1",
  leaseExpiry: "24h",
  mac: "02:02:02:02:02:02",
};

const mocks = [
  {
    request: {
      query: STATIC_HOSTS_QUERY,
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
            leaseExpiry: "24h",
          },
        ],
      },
    },
  },
  {
    request: {
      query: ADD_STATIC_HOST,
      variables: {
        staticHost: INPUT_HOST_STATIC_HOST,
      },
    },
    result: {
      data: {
        addStaticHost: {
          ...INPUT_HOST_STATIC_HOST,
          id: "cbb586eefc8a158e6caa5a50371f1c65c61b60fe",
        },
      },
    },
  },
];

describe("StaticHosts", () => {
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

    const hostnameTextNode = await waitFor(() => getByText("rancher"));

    expect(hostnameTextNode).toHaveTextContent("rancher");
  });

  it("should render and edit static hosts form", async () => {
    const { getByText } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <StaticHosts />
      </MockedProvider>
    );

    await waitFor(() => screen.getByLabelText(/IP Address/));

    fireEvent.change(screen.getByLabelText(/IP Address/), {
      target: { value: INPUT_HOST_STATIC_HOST.ip },
    });
    fireEvent.change(screen.getByLabelText(/Host Name/), {
      target: { value: INPUT_HOST_STATIC_HOST.host },
    });
    fireEvent.change(screen.getByLabelText(/MAC Address/i), {
      target: { value: INPUT_HOST_STATIC_HOST.mac },
    });

    fireEvent.click(screen.getByText("Add"));

    const hostnameTextNode = await waitFor(() => getByText("norris"));
    expect(hostnameTextNode).toHaveTextContent("norris");
  });
});
