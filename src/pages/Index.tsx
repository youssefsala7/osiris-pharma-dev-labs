import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Dashboard } from "@/components/Dashboard";
import { Inventory } from "@/components/Inventory";
import { Customers } from "@/components/Customers";
import { Sales } from "@/components/Sales";
import { Prescriptions } from "@/components/Prescriptions";
import { Reports } from "@/components/Reports";
import { Settings } from "@/components/Settings";
import { Suppliers } from "@/components/Suppliers";
import { PurchaseOrders } from "@/components/PurchaseOrders";
import { ExpiredMedicines } from "@/components/ExpiredMedicines";
import { UserManagement } from "@/components/UserManagement";
import { Billing } from "@/components/Billing";
import { Notifications } from "@/components/Notifications";
import { DrugInteractions } from "@/components/DrugInteractions";
import { InsuranceClaims } from "@/components/InsuranceClaims";

const Index = () => {
  const [currentPage, setCurrentPage] = useState("dashboard");

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "inventory":
        return <Inventory />;
      case "customers":
        return <Customers />;
      case "sales":
        return <Sales />;
      case "prescriptions":
        return <Prescriptions />;
      case "suppliers":
        return <Suppliers />;
      case "purchase-orders":
        return <PurchaseOrders />;
      case "billing":
        return <Billing />;
      case "insurance-claims":
        return <InsuranceClaims />;
      case "drug-interactions":
        return <DrugInteractions />;
      case "expired-medicines":
        return <ExpiredMedicines />;
      case "user-management":
        return <UserManagement />;
      case "notifications":
        return <Notifications />;
      case "reports":
        return <Reports />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <div className="flex-1 overflow-auto">
        {renderPage()}
      </div>
    </div>
  );
};

export default Index;