import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { AuthType } from "@/global-types";
const AuthTypeSchema = z.nativeEnum(AuthType);

export const authConfigFormSchema = toTypedSchema(
  z.object({
    id: z.string().optional().nullable(),
    authConfigName: z.string().optional().nullable(),
    authConfigDescription: z.string().optional().nullable(),
    authType: AuthTypeSchema,
    username: z.string().optional().nullable(),
    password: z.string().optional().nullable(),
    clientId: z.string().optional().nullable(),
    clientSecret: z.string().optional().nullable(),
    tokenUrl: z.string().optional().nullable(),
    redirectUri: z.string().optional().nullable(),
    codeVerifier: z.string().optional().nullable(),
    codeChallenge: z.string().optional().nullable(),
    grantType: z.string().optional().nullable(),
    scope: z.string().optional().nullable(),
    apiKey: z.string().optional().nullable(),
    jwtToken: z.string().optional().nullable(),
    currentToken: z.string().optional().nullable(),
    sessionCookie: z.string().optional().nullable(),
    additionalParams: z.any().optional().nullable(),
    customAuthOperation: z.any().optional().nullable(),
  })
);
