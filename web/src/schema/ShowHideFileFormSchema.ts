import { z } from "zod";

export const showHideFileFormSchema = z.object({
  password: z.string().min(1, "パスワードを入力してください."),
});

export type ShowHideFileFormSchema = z.infer<typeof showHideFileFormSchema>;
