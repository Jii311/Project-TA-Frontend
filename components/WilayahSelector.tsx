"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { NewForm } from "@/app/features/onboarding/schema";
import { useFormContext as useCustomFormContext } from "@/app/features/onboarding/context";

type Option = {
  id: number;
  name: string;
};

export function WilayahSelector() {
  const { control, setValue, getValues, watch, clearErrors } =
    useFormContext<NewForm>();
  const { updateNewFormDetails } = useCustomFormContext();
  const [isRestoring, setIsRestoring] = useState(true);

  const provId = watch("provinsi_id");
  const kabId = watch("kabupaten_id");
  const kecId = watch("kecamatan_id");

  const [provinsi, setProvinsi] = useState<Option[]>([]);
  const [kabupaten, setKabupaten] = useState<Option[]>([]);
  const [kecamatan, setKecamatan] = useState<Option[]>([]);
  const [kelurahan, setKelurahan] = useState<Option[]>([]);

  useEffect(() => {
    fetch("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json")
      .then((res) => res.json())
      .then((res) => setProvinsi(res));
  }, []);

  useEffect(() => {
    if (!provId) {
      if (!isRestoring) {
        setKabupaten([]);
        setKecamatan([]);
        setKelurahan([]);
        setValue("kabupaten_id", "");
        setValue("kecamatan_id", "");
        setValue("kelurahan_id", "");
      }
      return;
    }

    fetch(
      `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provId}.json`
    )
      .then((res) => res.json())
      .then((res) => {
        setKabupaten(res);
        if (!isRestoring) {
          setKecamatan([]);
          setKelurahan([]);
          setValue("kabupaten_id", "");
          setValue("kecamatan_id", "");
          setValue("kelurahan_id", "");
        }
      });
  }, [provId]);

  useEffect(() => {
    if (!kabId) {
      if (!isRestoring) {
        setKecamatan([]);
        setKelurahan([]);
        setValue("kecamatan_id", "");
        setValue("kelurahan_id", "");
      }
      return;
    }

    fetch(
      `https://www.emsifa.com/api-wilayah-indonesia/api/districts/${kabId}.json`
    )
      .then((res) => res.json())
      .then((res) => {
        setKecamatan(res);
        if (!isRestoring) {
          setKelurahan([]);
          setValue("kecamatan_id", "");
          setValue("kelurahan_id", "");
        }
      });
  }, [kabId]);

  useEffect(() => {
    if (!kecId) {
      if (!isRestoring) {
        setKelurahan([]);
        setValue("kelurahan_id", "");
      }
      return;
    }

    fetch(
      `https://www.emsifa.com/api-wilayah-indonesia/api/villages/${kecId}.json`
    )
      .then((res) => res.json())
      .then((res) => {
        setKelurahan(res);
        if (!isRestoring) {
          setValue("kelurahan_id", "");
        }
      });
  }, [kecId]);

  const wilayahFields = [
    { name: "provinsi_id", label: "Provinsi", options: provinsi },
    { name: "kabupaten_id", label: "Kabupaten", options: kabupaten },
    { name: "kecamatan_id", label: "Kecamatan", options: kecamatan },
    { name: "kelurahan_id", label: "Kelurahan", options: kelurahan },
  ];

  const saveToLocalStorage = (key: string, value: string, label: string) => {
    const stored = JSON.parse(localStorage.getItem("personal_form") || "{}");
    stored[key] = value;
    stored[`${key.replace("_id", "_nama")}`] = label;
    localStorage.setItem("personal_form", JSON.stringify(stored));
  };

  return (
    <>
      {wilayahFields.map((field) => (
        <FormField
          key={field.name}
          control={control}
          name={field.name as keyof NewForm}
          render={({ field: formField, fieldState }) => (
            <FormItem>
              <FormLabel>{field.label}</FormLabel>
              <Select
                onValueChange={(val) => {
                  const selectedOption = field.options.find(
                    (opt) => opt.id.toString() === val
                  );

                  setValue(field.name as keyof NewForm, val, {
                    shouldValidate: true,
                  });
                  clearErrors(field.name as keyof NewForm);

                  updateNewFormDetails({
                    [field.name]: val,
                    [`${field.name.replace("_id", "_nama")}`]:
                      selectedOption?.name || "",
                  });

                  saveToLocalStorage(
                    field.name,
                    val,
                    selectedOption?.name || ""
                  );
                }}
                value={formField.value?.toString() || ""}
                disabled={
                  (field.name === "kabupaten_id" && kabupaten.length === 0) ||
                  (field.name === "kecamatan_id" && kecamatan.length === 0) ||
                  (field.name === "kelurahan_id" && kelurahan.length === 0)
                }
              >
                <FormControl>
                  <SelectTrigger
                    className={cn(
                      "w-full",
                      fieldState.error && "border-red-500"
                    )}
                  >
                    <SelectValue placeholder={`Pilih ${field.label}`} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {field.options.map((opt) => (
                    <SelectItem key={opt.id} value={opt.id.toString()}>
                      {opt.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
    </>
  );
}
