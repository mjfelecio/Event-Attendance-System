import { toast } from "sonner";

export const toastSuccess = (title: string, description?: string) => {
  toast.success(title, {
    description: <div className="text-black">{description}</div>,
    position: "top-center",
    style: {
      "--normal-bg":
        "color-mix(in oklab, light-dark(var(--color-green-600), var(--color-green-400)) 10%, var(--background))",
      "--normal-text":
        "light-dark(var(--color-green-600), var(--color-green-400))",
      "--normal-border":
        "light-dark(var(--color-green-600), var(--color-green-400))",
    } as React.CSSProperties,
  });
};

export const toastInfo = (title: string, description?: string) => {
  toast.info(title, {
    description: <div className="text-black">{description}</div>,
    position: "top-center",
    style: {
      "--normal-bg":
        "color-mix(in oklab, light-dark(var(--color-sky-600), var(--color-sky-400)) 10%, var(--background))",
      "--normal-text": "light-dark(var(--color-sky-600), var(--color-sky-400))",
      "--normal-border":
        "light-dark(var(--color-sky-600), var(--color-sky-400))",
    } as React.CSSProperties,
  });
};

export const toastWarning = (title: string, description?: string) => {
  toast.warning(title, {
    description: <div className="text-black">{description}</div>,
    position: "top-center",
    style: {
      "--normal-bg":
        "color-mix(in oklab, light-dark(var(--color-amber-600), var(--color-amber-400)) 10%, var(--background))",
      "--normal-text":
        "light-dark(var(--color-amber-600), var(--color-amber-400))",
      "--normal-border":
        "light-dark(var(--color-amber-600), var(--color-amber-400))",
    } as React.CSSProperties,
  });
};

export const toastDanger = (title: string, description?: string) => {
  toast.error(title, {
    description: <div className="text-black">{description}</div>,
    position: "top-center",
    style: {
      "--normal-bg":
        "color-mix(in oklab, var(--destructive) 10%, var(--background))",
      "--normal-text": "var(--destructive)",
      "--normal-border": "var(--destructive)",
    } as React.CSSProperties,
  });
};
