import { z } from "zod";

export const loginSchema = (t: (key: string) => string) =>
  z.object({
    username: z.string().min(1, t("errors.usernameRequired")),
    password: z.string().min(8, t("errors.passwordLength")),
    rememberMe: z.boolean().optional(),
  });

export type LoginFormData = z.infer<ReturnType<typeof loginSchema>>;
