import AdminFooter from "./utils/adminFooter";
import AdminHeader from "./utils/adminHeader";
import Link from "next/link";

export default function Admin() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <AdminHeader />
      <div className="grid grid-cols-2 text-center gap-4 pb-20">
        <Link href="/admin/barGraph" className="border border-black rounded-md p-2 bg-ayr-logo-blue text-white hover:scale-105 hover:bg-green hover:text-black">
          Go To Bar Graph
        </Link>
        <Link href="/admin/search" className="border border-black rounded-md p-2 bg-ayr-logo-blue text-white hover:scale-105 hover:bg-green hover:text-black">Go To Search</Link>
      </div>
      <Link href="/" className="border border-black rounded-md p-2 bg-ayr-logo-blue text-white hover:scale-105 hover:bg-green hover:text-black">Back To Homepage</Link>
      <AdminFooter />
    </main>
  );
}
