"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface PhotoDialogProps {
  open: boolean;
  onClose: () => void;
  imageUrl: string;
  imageUrlPulang?: string;
  title?: string;
}

export const PhotoDialog = ({
  open,
  onClose,
  imageUrl,
  imageUrlPulang,
}: PhotoDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-4 max-w-full w-fit h-fit flex flex-col items-center justify-center bg-white">
        <div className="flex gap-8 justify-center items-start">
          <div className="flex flex-col items-center">
            <span className="text-sm font-medium mb-2">Foto Masuk</span>
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Bukti Masuk"
                className="object-contain max-w-[300px] max-h-[400px] rounded-lg border"
              />
            ) : (
              <div className="p-4 text-gray-500">Tidak ada foto</div>
            )}
          </div>

          <div className="flex flex-col items-center">
            <span className="text-sm font-medium mb-2">Foto Pulang</span>
            {imageUrlPulang ? (
              <img
                src={imageUrlPulang}
                alt="Bukti Pulang"
                className="object-contain max-w-[300px] max-h-[400px] rounded-lg border"
              />
            ) : (
              <div className="p-4 text-gray-500">Tidak ada foto</div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
