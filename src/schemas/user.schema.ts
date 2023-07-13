import { TypeOf, object, string } from "zod";
export const createUserSchema = object({
  body: object({
    name: string({
      required_error: "Name is required",
    }),
    password: string({
      required_error: "Password is required",
    }).min(6, "Password too short, should be min 6"),
    password_confirmation: string({
      required_error: "Password confirmation is required",
    }),
    email: string({
      required_error: "Email is required",
    }).email("Email is not valid"),
  }).refine(data => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  }),
});

export type createUserInput = Omit<TypeOf<typeof createUserSchema>, "body.password_confirmation">;
