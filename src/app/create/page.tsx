import CreateForm from "@/components/CreateForm";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CreatePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/create");
  return <CreateForm />;
}
