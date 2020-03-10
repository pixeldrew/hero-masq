import { MockedProvider } from "@apollo/react-testing";
import wait from "waait";
import { mount, shallow } from "enzyme";

// The component AND the query need to be exported
import { LEASES_QUERY, Leases } from "../Leases";
import TableCell from "@material-ui/core/TableCell";

import React from "react";

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
  }
];

it("renders without error", () => {
  mount(
    <MockedProvider mocks={mocks} addTypename={false}>
      <Leases />
    </MockedProvider>
  );
});
//
it("should render loading state initially", () => {
  const component = render(
    <MockedProvider mocks={[]}>
      <Leases />
    </MockedProvider>
  );

  expect(component.text()).toEqual("Fetching");
});

it("should render leases", async () => {
  const component = mount(
    <MockedProvider mocks={mocks} addTypename={false}>
      <Leases />
    </MockedProvider>
  );

  await wait(0); // wait for response

  console.log(component.html());

  expect(
    component.containsMatchingElement(<TableCell>10.137.0.110</TableCell>)
  ).toEqual(true);
});
