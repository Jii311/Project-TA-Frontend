import { NewForm } from "@/app/features/onboarding/schema";

declare interface TableDataProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageSize?: number;
  isLoading?: boolean;
  onRowClick?: (row: TData) => void;
}

export type DataKaryawan = {
  id: string;
  name: string;
  nip: string;
  nik: string;
  email: string;
  telephone: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  alamat: string;
  kelurahan_id: string;
  pendidikan_id: string;
  npwp: string;
  jenis_kelamin_id: string;
  mulai_tugas: string;
  pangkat_id: string;
  jabatan_id: string;
  pekerjaan_id: string;
  golongan_id: string;
  divisi_id: string;
  agama_id: string;
  lokasi_kantor_id: string;
  lokasi_kerja_id: string;
  status_id: string;
  nama_pasangan: string;
  tempat_lahir_pasangan: string;
  pekerjaan_id_pasangan: string;
  telephone_pasangan: string;
  nama_ayah: string;
  nama_ibu: string;
  alamat_ayah: string;
  alamat_ibu: string;
};

export type DataAnak = {
  id: string;
  name: string;
  nik: string;
  jenis_kelamin_id: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  karyawan_id: string;
};

export type DataRegisterUser = {
  id: string;
  nama: string;
  email: string;
  password: string;
  edit: string;
};

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: any;
  setCurrentPage: any;
}

export type Absensi = {
  id: number;
  nama: string;
  masuk: string;
  pulang: string;
  status: "Tepat Waktu" | "Terlambat" | "Izin";
};

export type DataMaster = {
  id: string;
  name: string;
  provinsiId?: string
};

declare interface TextFieldProps {
  placeholder: string;
  className: string;
  type: React.HTMLInputTypeAttribute | undefined;
}

declare interface FormFieldConfig {
  name: keyof NewForm;
  label: string;
  type: React.HTMLInputTypeAttribute | "select";
  placeholder?: string;
}

type FieldConfig = {
  label: string;
  name: keyof DataKaryawan;
  type: "text" | "email" | "date" | "select";
  required?: boolean;
};

declare interface SelectOption {
  value: string;
  label: string;
}

declare interface FormErrors {
  [key: string]: string | undefined;
}

declare interface HeaderProps {
  buttonLabel: string;
  onClick: React.MouseEventHandler;
}

declare interface CustomDialogProps {
  id?: string;
  initialData?: Partial<Agama>;
  children: React.ReactNode;
  mode: "add" | "edit";
  mapData?: DataMaster[];
}