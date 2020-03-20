import { renderHook, act } from "@testing-library/react-hooks";
import useForm from "./useForm";
import { object, string } from "yup";

test("should handle form input with novalidation", () => {
  const submitMock = jest.fn();

  const { result } = renderHook(() =>
    useForm(submitMock, {
      firstname: "",
      lastname: ""
    })
  );

  // test broken change handler
  act(() => {
    expect(() => result.current.handleChange()()).toThrow();
  });

  act(() => {
    result.current.handleChange({
      persist: () => {},
      target: { id: "firstname", value: "bill" }
    });
  });

  act(() => {
    result.current.handleSubmit();
  });

  expect(result.current.errors.length).toBe(0);
  expect(submitMock.mock.calls.length).toBe(1);
  expect(submitMock.mock.calls[0][0].firstname).toBe("bill");
});

test("should handle form input with validation", () => {
  const submitMock = jest.fn();

  const { result } = renderHook(() =>
    useForm(
      submitMock,
      {
        firstname: "",
        lastname: ""
      },
      object({
        firstname: string().required("First Name is Required"),
        lastname: string()
      })
    )
  );

  // trigger form validation
  act(() => {
    result.current.handleSubmit();
  });

  expect(result.current.errors.length).toBe(1);
  expect(result.current.disable).toBeTruthy();
  expect(result.current.hasError("firstname")).toBeTruthy();

  act(() => {
    result.current.handleChange({
      persist: () => {},
      target: { id: "firstname", value: "bill" }
    });
  });

  act(() => {
    expect(result.current.errors.length).toBe(0);
    result.current.handleSubmit();
  });

  expect(submitMock.mock.calls.length).toBe(1);
  expect(submitMock.mock.calls[0][0].firstname).toBe("bill");

  act(() => {
    result.current.resetForm();
  });

  expect(result.current.values.firstname).toBe("");
});
