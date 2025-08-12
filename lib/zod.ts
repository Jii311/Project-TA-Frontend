import { z } from "zod";

export const authFormSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(1, "Please fill the email")
    .email({ message: "Invalid email type" }),
  password: z.string().min(1, "Please fill the password"),
});

export const userFormSchema = z.object({
  karyawan_id: z.string().nonempty("Karyawan is required"),
  name: z.string().nonempty("Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type FormSchema = z.infer<typeof userFormSchema>;

export const dataMasterSchema = z.object({
  name: z.string().min(1, "Tolong isi data"),
  provinsiId: z.string().optional(),
});

export const lokasiKantorSchema = dataMasterSchema.extend({
  alamat: z.string().min(1, "Alamat wajib diisi"),
  latitude: z.string().min(1, "Latitude wajib diisi"),
  longitude: z.string().min(1, "Longitude wajib diisi"),
});

export type DataMasterSchema = z.infer<typeof dataMasterSchema>;
export type LokasiKantorSchema = z.infer<typeof lokasiKantorSchema>;
