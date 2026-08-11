import { permanentRedirect } from "next/navigation";

export default function SelectedWorkRedirectPage() {
  permanentRedirect("/works");
}
