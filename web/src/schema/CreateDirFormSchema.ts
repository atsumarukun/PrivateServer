import { z } from "zod";

export const createDirFormSchema = z.object({
  name: z.string().min(1, "ディレクトリ名を入力してください."),
});

export type CreateDirFormSchema = z.infer<typeof createDirFormSchema>;
