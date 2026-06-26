const CONTACT_ENDPOINT = import.meta.env.VITE_FORMSPREE_CONTACT_ENDPOINT ?? "";
const PREORDER_ENDPOINT =
  import.meta.env.VITE_FORMSPREE_PREORDER_ENDPOINT ?? CONTACT_ENDPOINT;

export function getFormspreeEndpoints() {
  return { contact: CONTACT_ENDPOINT, preorder: PREORDER_ENDPOINT };
}

export async function submitToFormspree(
  formData: FormData,
  kind: "contact" | "preorder" | "careers" = "contact"
) {
  const endpoint =
    kind === "preorder"
      ? PREORDER_ENDPOINT
      : CONTACT_ENDPOINT;

  if (!endpoint) {
    throw new Error(
      "Formspree is not configured yet. Add VITE_FORMSPREE_CONTACT_ENDPOINT to your .env file."
    );
  }

  const response = await fetch(endpoint, {
    method: "POST",
    body: formData,
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(
      (data as { error?: string } | null)?.error ??
        "Something went wrong. Please try again or email arktossystems@gmail.com directly."
    );
  }
}
