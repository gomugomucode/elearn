import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";

export default function StudentLayout({ children }) {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1 pt-16">
        <Sidebar userRole="student" userName={user?.name} />
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}
