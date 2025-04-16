import { cn } from "@/lib/utils";
import { TextFieldProps } from "@/types/index.d";
import { Search } from "lucide-react";

function TextField({ placeholder, className, type, ...props }: TextFieldProps) {
  return (
    <div
      className={cn(
        "flex items-center border rounded-md border-[#E6E6E6] pl-2",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
      )}
    >
      <Search className="icon" />

      <input
        placeholder={placeholder}
        type={type}
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex h-9 w-full min-w-0 bg-transparent px-3 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        {...props}
      />
    </div>
  );
}

export { TextField };
