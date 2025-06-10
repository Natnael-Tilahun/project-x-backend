import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

// Custom email validation function
const cbeEmailValidation = z.string()
  .email("Invalid email format")
  .refine(
    (email) => email.endsWith("@cbe.com.et"),
    "Email must be CBE work email address. Email must end with @cbe.com.et"
  );

export const newStaffFormSchema = toTypedSchema(
  z.object({
    id: z.string().optional().nullable(),
    firstname: z.string(),
    middlename: z.string(),
    lastname: z.string(),
    username: z.string().min(5, "Username must be at least 5 characters long"),
    staffId: z.string(),
    displayName: z.string().optional().nullable(),
    mobileNo: z.string().optional().nullable(),
    emailAddress: cbeEmailValidation,
    active: z.boolean().optional().default(true).nullable(),
    joiningDate: z.union([z.string(), z.date()]).optional().nullable(),
    assign: z.boolean().optional().default(false).nullable(),
    newOfficeId: z.string().optional().nullable(),
    supervisorStaffId: z.string().optional().nullable(),
    newRoleId: z.string().optional().nullable(),
    remarks: z.string().optional().nullable(),
    assignmentDate: z.string().optional().nullable(),
  }).superRefine((data, ctx) => {
    if (data.assign) {
      if (data.newOfficeId == null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["newOfficeId"],
          message: "Office is required when assign is true",
        });
      }
      // if (data.supervisorStaffId == null) {
      //   ctx.addIssue({
      //     code: z.ZodIssueCode.custom,
      //     path: ["supervisorStaffId"],
      //     message: "Supervisor is required when assign is true",
      //   });
      // }
      if (data.newRoleId == null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["newRoleId"],
          message: "Role is required when assign is true",
        });
      }
      if (data.assignmentDate == null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["assignmentDate"],
          message: "Assignment date is required when assign is true",
        });
      }
    }
  })
);