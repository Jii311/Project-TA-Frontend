"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowDown, Loader2 } from "lucide-react";

import { userFormSchema, FormSchema } from "@/lib/zod";
import { cn } from "@/lib/utils";
import { DataKaryawan } from "@/types";
import { TableData } from "@/components/TableData";
import { dataRegisterUser } from "./columns";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/axios";

export default function RegisterUserPage() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [karyawans, setKaryawans] = useState<DataKaryawan[]>([]);

  const form = useForm<FormSchema>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      karyawan_id: "",
      name: "",
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const selectedKaryawanId = form.watch("karyawan_id");
  const selectedKaryawan = karyawans.find((k) => k.id === selectedKaryawanId);
  const selectedKaryawanName = selectedKaryawan?.name || "Select Karyawan...";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [usersRes, karyawanRes] = await Promise.all([
          api.get("user"),
          api.get("karyawan"),
        ]);

        setUsers(usersRes.data);
        setKaryawans(karyawanRes.data);
      } catch (err) {
        console.error("Gagal ambil data:", err);
        toast.error("Gagal ambil data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleKaryawanSelect = (karyawan: DataKaryawan) => {
    form.setValue("karyawan_id", karyawan.id, { shouldValidate: true });
    form.setValue("name", karyawan.name, { shouldValidate: true });
    form.setValue("email", karyawan.email, { shouldValidate: true });
    setSearchOpen(false);
  };

  const handleSubmit = async (data: FormSchema) => {
    setIsSubmitting(true);

    try {
      const response = await api.post("user", data);

      if (response.status >= 200 && response.status < 300) {
        toast.success("User registered successfully");
        form.reset();
        setOpen(false);
        router.refresh();
      } else {
        throw new Error(response.data?.message || "Gagal daftar user");
      }
    } catch (error: any) {
      console.error("Registration failed:", error.message);
      toast.error(error.message || "Registration failed");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex justify-end">
        <Button
          onClick={() => setOpen(true)}
          className="bg-[#17876E] hover:bg-[#17876E]/90"
        >
          Add User
        </Button>
      </div>

      <div className="flex flex-col h-full">
        {loading ? (
          <Skeleton className="h-full w-full rounded-3xl" />
        ) : (
          <div className="w-full h-full bg-[#CDF9EF] rounded-3xl">
            <TableData columns={dataRegisterUser} data={users} />
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Register New User
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="mt-4 space-y-6"
          >
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="karyawan">Karyawan</Label>
                <Popover open={searchOpen} onOpenChange={setSearchOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="justify-between w-full"
                      id="karyawan"
                    >
                      {selectedKaryawanName}
                      <ArrowDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-[var(--radix-popover-trigger-width)] p-0"
                    align="start"
                    side="right"
                  >
                    <Command className="border ml-1">
                      <CommandInput placeholder="Search Karyawan..." />
                      <CommandList>
                        <CommandEmpty>No Karyawan found.</CommandEmpty>
                        <CommandGroup>
                          {karyawans.map((karyawan) => (
                            <CommandItem
                              key={karyawan.id}
                              value={karyawan.name}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                handleKaryawanSelect(karyawan);
                              }}
                              className="hover:cursor-pointer"
                            >
                              {karyawan.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {form.formState.errors.karyawan_id && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.karyawan_id.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  disabled
                  className="bg-gray-100"
                  {...form.register("email")}
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  {...form.register("password")}
                />
                {form.formState.errors.password && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="submit"
                disabled={isSubmitting || !form.formState.isValid}
                className={cn(
                  "w-full bg-[#17876E] hover:bg-[#17876E]/90",
                  "min-w-32 h-11 text-md",
                  isSubmitting && "opacity-70"
                )}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin" />
                    Registering...
                  </span>
                ) : (
                  "Register User"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
