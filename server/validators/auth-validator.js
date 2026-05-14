const { z } = require("zod");

const loginSchema = z.object({
    phone: z
        .string({ required_error: "phone is requires" })
        .trim()
        .min(10, { message: "phone must be atleast 10 chars" })
        .max(12, { message: "phone must be less then 13 chars" }),
});

const signUpSchema = z.object({
    username: z
        .string({ required_error: "Name is requires" })
        .trim()
        .min(3, { message: "name must be atleast 3 chars" })
        .max(49, { message: "name must be less then 50 chars" }),
    firstname: z
        .string({ required_error: "First Name is requires" })
        .trim()
        .min(3, { message: "First Name must be atleast 3 chars" })
        .max(49, { message: "First Name must be less then 50 chars" }),
    lastname: z
        .string({ required_error: "Last Name is requires" })
        .trim()
        .min(3, { message: "Last Name must be atleast 3 chars" })
        .max(49, { message: "Last Name must be less then 50 chars" }),
    email: z
        .string({ required_error: "Email is requires" })
        .trim()
        .email({ message: "Invalid email address" })
        .min(13, { message: "email must be atleast 13 chars" })
        .max(49, { message: "email must be less then 50 chars" }),
    phone: z
        .string({ required_error: "phone is requires" })
        .trim()
        .min(10, { message: "phone must be atleast 10 chars" })
        .max(12, { message: "phone must be less then 13 chars" }),
});

module.exports = { signUpSchema, loginSchema };