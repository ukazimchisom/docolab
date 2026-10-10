import { describe, it, expect } from "vitest";
import { loginSchema, signupSchema } from "./auth";

describe("loginSchema", () => {
  it("accepts a valid email and non-empty password", () => {
    const result = loginSchema.safeParse({
      email: "andy@docolab.com",
      password: "whatever123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "whatever123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an empty password", () => {
    const result = loginSchema.safeParse({
      email: "andy@docolab.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("signupSchema", () => {
  const validInput = {
    fullName: "Andy Rivers",
    email: "andy@docolab.com",
    password: "longenoughpassword",
    confirmPassword: "longenoughpassword",
  };

  it("accepts fully valid signup data", () => {
    expect(signupSchema.safeParse(validInput).success).toBe(true);
  });

  it("rejects a password shorter than 8 characters", () => {
    const result = signupSchema.safeParse({
      ...validInput,
      password: "short",
      confirmPassword: "short",
    });
    expect(result.success).toBe(false);
  });

  it("rejects mismatched passwords", () => {
    const result = signupSchema.safeParse({
      ...validInput,
      confirmPassword: "somethingElse123",
    });
    expect(result.success).toBe(false);
  });

  it("reports the mismatch error on the confirmPassword field", () => {
    const result = signupSchema.safeParse({
      ...validInput,
      confirmPassword: "somethingElse123",
    });
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(["confirmPassword"]);
    }
  });
});
