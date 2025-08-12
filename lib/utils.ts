import { FieldConfig, FormFieldConfig } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export enum FormDataRoutes {
  PERSONAL_DATA = "/form/personal-data",
  WORK_DATA = "/form/work-data",
  PARTNER_DATA = "/form/partner-data",
  PARENT_DATA = "/form/parents-data",
  CHILDREN_DATA = "/form/children-data",
  REVIEW_DATA = "/form/review",
}

export const viewFieldGroups = [
  {
    title: "Data Diri",
    fields: [
      { label: "Nama", name: "name", type: "text" },
      { label: "Email", name: "email", type: "email" },
      { label: "NIP", name: "nip", type: "text" },
      { label: "NIK", name: "nik", type: "text" },
      { label: "Telephone", name: "telephone", type: "text" },
      { label: "Alamat", name: "alamat", type: "text" },
      { label: "Agama", name: "agama_id", type: "select" },
      { label: "Tempat Lahir", name: "tempat_lahir", type: "text" },
      { label: "Tanggal Lahir", name: "tanggal_lahir", type: "date" },
      { label: "provinsi", name: "provinsi", type: "select" },
      { label: "Kabupaten", name: "kabupaten", type: "select" },
      { label: "Kecamatan", name: "kecamatan", type: "select" },
      { label: "Kelurahan", name: "kelurahan", type: "select" },
      { label: "Pendidikan", name: "pendidikan_id", type: "select" },
      { label: "NPWP", name: "npwp", type: "text" },
      { label: "Jenis Kelamin", name: "jenis_kelamin_id", type: "select" },
    ],
  },
  {
    title: "Data Pekerjaan",
    fields: [
      { label: "Mulai Tugas", name: "mulai_tugas", type: "date" },
      { label: "Pangkat", name: "pangkat_id", type: "select" },
      { label: "Jabatan", name: "jabatan_id", type: "select" },
      { label: "Pekerjaan", name: "pekerjaan_id", type: "select" },
      { label: "Golongan", name: "golongan_id", type: "select" },
      { label: "Divisi", name: "divisi_id", type: "select" },
      { label: "Lokasi Kantor", name: "lokasi_kantor_id", type: "select" },
      { label: "Lokasi Kerja", name: "lokasi_kerja_id", type: "select" },
      { label: "Status", name: "status_id", type: "select" },
    ],
  },
  {
    title: "Data Pasangan",
    fields: [
      { label: "Nama Pasangan", name: "nama_pasangan", type: "text" },
      {
        label: "Tempat Lahir Pasangan",
        name: "tempat_lahir_pasangan",
        type: "text",
      },
      {
        label: "Pekerjaan Pasangan",
        name: "pekerjaan_pasangan",
        type: "text",
      },
      { label: "Telepon Pasangan", name: "telephone_pasangan", type: "text" },
    ],
  },
  {
    title: "Data Orang Tua",
    fields: [
      { label: "Nama Ayah", name: "nama_ayah", type: "text" },
      { label: "Nama Ibu", name: "nama_ibu", type: "text" },
      { label: "Alamat Ayah", name: "alamat_ayah", type: "text" },
      { label: "Alamat Ibu", name: "alamat_ibu", type: "text" },
    ],
  },
];

export const editFieldGroups: { title: string; fields: FieldConfig[] }[] = [
  {
    title: "Data Diri",
    fields: [
      { label: "Nama", name: "name", type: "text", required: true },
      { label: "Email", name: "email", type: "email", required: true },
      { label: "NIP", name: "nip", type: "text", required: true },
      { label: "NIK", name: "nik", type: "text", required: true },
      { label: "Telephone", name: "telephone", type: "text", required: true },
      { label: "Alamat", name: "alamat", type: "text", required: true },
      { label: "Agama", name: "agama_id", type: "select", required: true },
      {
        label: "Tempat Lahir",
        name: "tempat_lahir",
        type: "text",
        required: true,
      },
      {
        label: "Tanggal Lahir",
        name: "tanggal_lahir",
        type: "date",
        required: true,
      },
      {
        label: "Provinsi",
        name: "provinsi",
        type: "select",
        required: true,
      },
      {
        label: "Kabupaten",
        name: "kabupaten",
        type: "select",
        required: true,
      },
      {
        label: "Kecamatan",
        name: "kecamatan",
        type: "select",
        required: true,
      },
      {
        label: "Kelurahan",
        name: "kelurahan",
        type: "select",
        required: true,
      },
      {
        label: "Pendidikan",
        name: "pendidikan_id",
        type: "select",
        required: true,
      },
      { label: "NPWP", name: "npwp", type: "text", required: true },
      {
        label: "Jenis Kelamin",
        name: "jenis_kelamin_id",
        type: "select",
        required: true,
      },
    ],
  },
  {
    title: "Data Pekerjaan",
    fields: [
      {
        label: "Mulai Tugas",
        name: "mulai_tugas",
        type: "date",
        required: true,
      },
      { label: "Pangkat", name: "pangkat_id", type: "select", required: true },
      { label: "Jabatan", name: "jabatan_id", type: "select", required: true },
      {
        label: "Pekerjaan",
        name: "pekerjaan_id",
        type: "select",
        required: true,
      },
      {
        label: "Golongan",
        name: "golongan_id",
        type: "select",
        required: true,
      },
      { label: "Divisi", name: "divisi_id", type: "select", required: true },
      {
        label: "Lokasi Kantor",
        name: "lokasi_kantor_id",
        type: "select",
        required: true,
      },
      {
        label: "Lokasi Kerja",
        name: "lokasi_kerja_id",
        type: "select",
        required: true,
      },
      { label: "Status", name: "status_id", type: "select", required: true },
    ],
  },
  {
    title: "Data Pasangan",
    fields: [
      { label: "Nama Pasangan", name: "nama_pasangan", type: "text" },
      {
        label: "Tempat Lahir Pasangan",
        name: "tempat_lahir_pasangan",
        type: "text",
      },
      {
        label: "Pekerjaan Pasangan",
        name: "pekerjaan_id_pasangan",
        type: "text",
      },
      { label: "Telepon Pasangan", name: "telephone_pasangan", type: "text" },
    ],
  },
  {
    title: "Data Orang Tua",
    fields: [
      { label: "Nama Ayah", name: "nama_ayah", type: "text" },
      { label: "Nama Ibu", name: "nama_ibu", type: "text" },
      { label: "Alamat Ayah", name: "alamat_ayah", type: "text" },
      { label: "Alamat Ibu", name: "alamat_ibu", type: "text" },
    ],
  },
];

export const childrenFormFields = [
  {
    name: "name",
    label: "Nama Lengkap Anak",
    type: "text",
    placeholder: "Masukan Nama lengkap anak",
    required: true,
  },
  {
    name: "nik",
    label: "NIK Anak",
    type: "text",
    placeholder: "Masukan NIK Anak",
    required: true,
  },
  {
    name: "jenis_kelamin_id",
    label: "Jenis Kelamin Anak",
    type: "select",
    placeholder: "Pilih Jenis Kelamin Anak",
    required: true,
  },
  {
    name: "tempat_lahir",
    label: "Tempat lahir anak",
    type: "text",
    placeholder: "Masukan Tempat lahir anak",
    required: true,
  },
  {
    name: "tanggal_lahir",
    label: "Tanggal lahir anak",
    type: "date",
    placeholder: "Masukan Tanggal lahir anak",
    required: true,
  },
] as const;

export const parentFormFields: FormFieldConfig[] = [
  {
    name: "nama_ayah",
    label: "Nama Lengkap Ayah",
    type: "text",
    placeholder: "Masukan Nama Lengkap Ayah",
  },
  {
    name: "nama_ibu",
    label: "Nama Lengkap Ibu",
    type: "text",
    placeholder: "Masukan Nama Lengkap Ibu",
  },
  {
    name: "alamat_ayah",
    label: "Alamat Ayah",
    type: "text",
    placeholder: "Masukan Alamat ayah",
  },
  {
    name: "alamat_ibu",
    label: "Alamat Ibu",
    type: "text",
    placeholder: "Masukan Alamat Ibu",
  },
];

export const partnerFormFields: FormFieldConfig[] = [
  {
    name: "nama_pasangan",
    label: "Nama Lengkap Pasangan",
    type: "text",
    placeholder: "Masukan Nama Lengkap Pasangan",
  },
  {
    name: "tempat_lahir_pasangan",
    label: "Tempat Lahir Pasangan",
    type: "text",
    placeholder: "Masukan Tempat Lahir Pasangan",
  },
  {
    name: "pekerjaan_pasangan",
    label: "Pekerjaan Pasangan",
    type: "text",
    placeholder: "Masukan Pekerjaan Pasangan",
  },
  {
    name: "telephone_pasangan",
    label: "Telepon Pasangan",
    type: "tel",
    placeholder: "Masukan Telepon Pasangan",
  },
];

export const personalFormFields: FormFieldConfig[] = [
  {
    name: "nama",
    label: "Nama Lengkap",
    type: "text",
    placeholder: "Masukan Nama Lengkap",
  },
  {
    name: "nip",
    label: "NIP (Nomor Induk Pegawai)",
    type: "text",
    placeholder: "Masukan NIP",
  },
  {
    name: "nik",
    label: "NIK (Nomor Induk Kependudukan)",
    type: "text",
    placeholder: "Masukan NIK",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "Masukan Email",
  },
  {
    name: "telephone",
    label: "Nomor Telepon",
    type: "tel",
    placeholder: "Masukan No. Telepon",
  },
  {
    name: "tempat_lahir",
    label: "Tempat Lahir",
    type: "text",
    placeholder: "Masukan Tempat Lahir",
  },
  {
    name: "tanggal_lahir",
    label: "Tanggal Lahir",
    type: "date",
    placeholder: "dd-mm-yyyy",
  },
  {
    name: "jenis_kelamin_id",
    label: "Jenis Kelamin",
    type: "select",
    placeholder: "Pilih Jenis Kelamin",
  },
  {
    name: "agama_id",
    label: "Agama",
    type: "select",
    placeholder: "Pilih Agama",
  },
  {
    name: "pendidikan_id",
    label: "Pendidikan",
    type: "select",
    placeholder: "Pilih Pendidikan",
  },
  {
    name: "npwp",
    label: "NPWP (Nomor Pokok Wajib Pajak)",
    type: "text",
    placeholder: "Masukan NPWP",
  },
  {
    name: "alamat",
    label: "Alamat",
    type: "text",
    placeholder: "Masukan Alamat",
  },
  {
    name: "provinsi_id",
    label: "Provinsi",
    type: "select",
    placeholder: "Pilih Provinsi",
  },
  {
    name: "kabupaten_id",
    label: "Kabupaten",
    type: "select",
    placeholder: "Pilih Kabupaten",
  },
  {
    name: "kecamatan_id",
    label: "Kecamatan",
    type: "select",
    placeholder: "Pilih Kecamatan",
  },
  {
    name: "kelurahan_id",
    label: "Kelurahan",
    type: "select",
    placeholder: "Pilih Kelurahan",
  },
];

export const workFormFields: FormFieldConfig[] = [
  {
    name: "pangkat_id",
    label: "Pangkat",
    type: "select",
    placeholder: "Pilih Pangkat",
  },
  {
    name: "jabatan_id",
    label: "Jabatan",
    type: "select",
    placeholder: "Pilih Jabatan",
  },
  {
    name: "pekerjaan_id",
    label: "Pekerjaan",
    type: "select",
    placeholder: "Pilih Pekerjaan",
  },
  {
    name: "golongan_id",
    label: "Golongan",
    type: "select",
    placeholder: "Pilih Golongan",
  },
  {
    name: "divisi_id",
    label: "Divisi",
    type: "select",
    placeholder: "Pilih Divisi",
  },
  {
    name: "status_id",
    label: "Status",
    type: "select",
    placeholder: "Pilih Status",
  },
  {
    name: "lokasi_kantor_id",
    label: "Lokasi Kantor",
    type: "select",
    placeholder: "Pilih Lokasi Kantor",
  },
  {
    name: "lokasi_kerja_id",
    label: "Lokasi Kerja",
    type: "select",
    placeholder: "Pilih Lokasi Kerja",
  },
  {
    name: "mulai_tugas",
    label: "Mulai Tugas",
    type: "date",
    placeholder: "Masukan Mulai Tugas",
  },
];
