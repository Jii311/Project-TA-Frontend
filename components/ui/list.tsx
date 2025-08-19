import React from "react";

interface ListProps {
  nama: string;
  kepentingan: string;
  tanggal: string;
  terverifikasi: string;
}

const List: React.FC<ListProps> = ({
  nama,
  kepentingan,
  tanggal,
  terverifikasi,
}) => {
  return (
    <div className="grid grid-cols-4 items-center px-4 py-3.5 bg-white rounded-lg cursor-pointer">
      <div className="flex flex-col">
        <span className="text-sm text-gray-500">Nama</span>
        <span className="text-black font-semibold">{nama}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm text-gray-500">Alasan</span>
        <span className="text-black font-semibold">{kepentingan}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm text-gray-500">Tanggal</span>
        <span className="text-black font-semibold">{tanggal}</span>
      </div>
      <div className="flex justify-end gap-1">
        <span
          className={`w-fit px-2 py-1 text-xs font-semibold rounded-sm uppercase ${
            terverifikasi?.toLowerCase() === "disetujui"
              ? "bg-green-100 text-green-600"
              : terverifikasi?.toLowerCase() === "ditolak"
              ? "bg-red-100 text-red-600"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {terverifikasi}
        </span>
      </div>
    </div>
  );
};

export default List;
