import { toast } from "sonner";

/**
 * Toast helpers — the app's transient feedback channel.
 *
 * Built on `sonner`, rendered once globally by `<Toaster />` in the root layout.
 * Every mutation should surface its outcome through one of these; the app has
 * no global error boundary, so a silently-swallowed failure is invisible.
 *
 * ## Choosing the right one
 *
 * | Helper | Use for |
 * |---|---|
 * | `toastSuccess` | The action completed and changed something. |
 * | `toastInfo` | Neutral context the operator should notice. |
 * | `toastWarning` | A **no-op that isn't a failure** — e.g. "attendance was already recorded" when the server returns `changed: false`. |
 * | `toastDanger` | A genuine failure the operator may need to act on. |
 *
 * The warning/danger distinction matters more than it looks: during an event,
 * an organizer who sees red for a harmless duplicate scan will assume
 * attendance was lost and start re-scanning.
 *
 * ## Constraints
 * - Keep `title` to a few words; put detail in `description`.
 * - Don't use a toast for information that must persist — use an `Alert`
 *   in the page instead. Toasts auto-dismiss and are easy to miss on a
 *   shared laptop.
 *
 * @see /design-system — fires each variant live
 */
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
