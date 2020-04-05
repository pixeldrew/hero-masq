import { renderHook, act } from "@testing-library/react-hooks";
import useForm from "./useForm";
import { object, string } from "yup";

describe("useForm", () => {
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
      expect(() =>
        result.current.handleChange()({
          persist: () => {},
          target: { value: "blah" }
        })
      ).toThrow();
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
          lastname: "",
          title: ""
        },
        object({
          firstname: string().required("First Name is Required"),
          lastname: string(),
          title: string()
            .required("Title is Required")
            .oneOf(["mr", "mrs", "ms"])
        })
      )
    );

    // trigger form validation
    act(() => {
      result.current.handleSubmit();
    });

    expect(result.current.errors.length).toBe(2);
    expect(result.current.disable).toBeTruthy();
    expect(result.current.hasError("firstname")).toBeTruthy();
    expect(result.current.hasError("title")).toBeTruthy();

    act(() => {
      result.current.handleChange({
        persist: () => {},
        target: { id: "firstname", value: "bill" }
      });
    });

    expect(result.current.hasError("firstname")).toBeFalsy();

    // test invalid title
    act(() => {
      result.current.handleChange({
        persist: () => {},
        target: { id: "title", value: "dr" }
      });
    });

    expect(result.current.errors.length).toBe(1);

    act(() => {
      result.current.handleChange({
        persist: () => {},
        target: { id: "title", value: "mr" }
      });
    });

    expect(result.current.errors.length).toBe(0);

    act(() => {
      result.current.handleSubmit();
    });

    expect(submitMock.mock.calls.length).toBe(1);
    expect(submitMock.mock.calls[0][0].firstname).toBe("bill");

    act(() => {
      result.current.resetForm();
    });

    expect(result.current.values.firstname).toBe("");
  });
});
