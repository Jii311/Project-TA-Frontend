import {
  Clock,
  Database,
  FileCheck,
  FileText,
  Home,
  User,
  UserPlus,
} from "lucide-react";

export const adminSidebarLinks = [
  {
    icon: <Home />,
    route: "/admin",
    label: "Dashboard",
  },
  {
    icon: <Database />,
    route: "/admin/data-master",
    label: "Data Master",
    dropdownOptions: [
      { label: "Pendidikan", route: "/admin/data-master/pendidikan" },
      { label: "Pangkat", route: "/admin/data-master/pangkat" },
      { label: "Jabatan", route: "/admin/data-master/jabatan" },
      { label: "Pekerjaan", route: "/admin/data-master/pekerjaan" },
      { label: "Golongan", route: "/admin/data-master/golongan" },
      { label: "Divisi", route: "/admin/data-master/divisi" },
      { label: "Agama", route: "/admin/data-master/agama" },
      { label: "Lokasi Kantor", route: "/admin/data-master/lokasi-kantor" },
      { label: "Lokasi Kerja", route: "/admin/data-master/lokasi-kerja" },
      { label: "Jenis Kelamin", route: "/admin/data-master/jenis-kelamin" },
      { label: "Jenis Izin", route: "/admin/data-master/jenis-izin" },
      { label: "Status Absensi", route: "/admin/data-master/status-absensi" },
    ],
  },
  {
    icon: <Clock />,
    route: "/admin/absensi",
    label: "Absensi",
  },
  {
    icon: <FileText />,
    route: "/admin/izin",
    label: "Izin",
  },
  {
    icon: <FileCheck />,
    route: "/admin/izin-terverifikasi",
    label: "Izin Terverifikasi",
  },
  {
    icon: <User />,
    route: "/admin/data-karyawan",
    label: "Data Karyawan",
  },
  {
    icon: <UserPlus />,
    route: "/admin/register-user",
    label: "Register User",
  },
];

export const formStepLinks = [
  {
    icon: 1,
    route: "/form/personal-data",
    label: "Data Diri",
    step: "Step 1",
  },
  {
    icon: 2,
    route: "/form/work-data",
    label: "Data Pekerjaan",
    step: "Step 2",
  },
  {
    icon: 3,
    route: "/form/partner-data",
    label: "Data Pasangan",
    step: "Step 3",
  },
  {
    icon: 4,
    route: "/form/parents-data",
    label: "Data Orang Tua",
    step: "Step 4",
  },
  {
    icon: 5,
    route: "/form/children-data",
    label: "Data Anak",
    step: "Step 5",
  },
  {
    icon: 6,
    route: "/form/review",
    label: "Review",
    step: "Step 6",
  },
];
