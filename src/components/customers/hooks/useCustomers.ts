import { useState, useMemo } from "react";
import { Customer, CustomerFormData, CustomerStats } from "../types";
import { showSuccess, showError } from "@/utils/toast";

const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: "CUST-001",
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, City, State 12345",
    dateOfBirth: "1985-03-15",
    totalPurchases: 1250.75,
    lastVisit: "2024-01-15",
    status: "Active",
    insuranceProvider: "Blue Cross Blue Shield",
    policyNumber: "BCBS123456789",
    emergencyContact: "+1 (555) 987-6543",
    allergies: ["Penicillin", "Sulfa"],
    medicalConditions: ["Hypertension", "Diabetes Type 2"]
  },
  {
    id: "CUST-002",
    name: "Jane Smith",
    email: "jane.smith@email.com",
    phone: "+1 (555) 987-6543",
    address: "456 Oak Ave, City, State 12345",
    dateOfBirth: "1990-07-22",
    totalPurchases: 875.50,
    lastVisit: "2024-01-14",
    status: "Active",
    insuranceProvider: "Aetna",
    policyNumber: "AET987654321",
    emergencyContact: "+1 (555) 123-4567",
    allergies: ["Latex"],
    medicalConditions: ["Asthma"]
  },
  {
    id: "CUST-003",
    name: "Mike Johnson",
    email: "mike.johnson@email.com",
    phone: "+1 (555) 456-7890",
    address: "789 Pine Rd, City, State 12345",
    dateOfBirth: "1978-11-08",
    totalPurchases: 2150.25,
    lastVisit: "2024-01-10",
    status: "Active",
    emergencyContact: "+1 (555) 321-0987",
    allergies: [],
    medicalConditions: ["High Cholesterol"]
  },
];

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.phone.includes(searchTerm);
      const matchesStatus = statusFilter === "all" || customer.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [customers, searchTerm, statusFilter]);

  const stats: CustomerStats = useMemo(() => {
    const activeCustomers = customers.filter(c => c.status === "Active").length;
    const newCustomers = customers.filter(c => {
      const lastVisitDate = new Date(c.lastVisit);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return lastVisitDate >= thirtyDaysAgo;
    }).length;
    const totalRevenue = customers.reduce((sum, c) => sum + c.totalPurchases, 0);

    return {
      totalCustomers: customers.length,
      activeCustomers,
      newCustomers,
      totalRevenue
    };
  }, [customers]);

  const addCustomer = async (customerData: CustomerFormData) => {
    if (!customerData.name || !customerData.email || !customerData.phone) {
      showError("Please fill in all required fields");
      return false;
    }

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const customer: Customer = {
        id: `CUST-${String(customers.length + 1).padStart(3, '0')}`,
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone,
        address: customerData.address || "",
        dateOfBirth: customerData.dateOfBirth || "",
        totalPurchases: 0,
        lastVisit: new Date().toISOString().split('T')[0],
        status: "Active",
        insuranceProvider: customerData.insuranceProvider,
        policyNumber: customerData.policyNumber,
        emergencyContact: customerData.emergencyContact,
        allergies: customerData.allergies || [],
        medicalConditions: customerData.medicalConditions || [],
      };
      
      setCustomers(prev => [...prev, customer]);
      showSuccess("Customer added successfully!");
      return true;
    } catch (error) {
      showError("Failed to add customer");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCustomer = async (updatedCustomer: Customer) => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setCustomers(prev => prev.map(customer => 
        customer.id === updatedCustomer.id ? updatedCustomer : customer
      ));
      showSuccess("Customer updated successfully!");
      return true;
    } catch (error) {
      showError("Failed to update customer");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCustomer = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) {
      return false;
    }

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setCustomers(prev => prev.filter(customer => customer.id !== id));
      showSuccess("Customer deleted successfully!");
      return true;
    } catch (error) {
      showError("Failed to delete customer");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const exportCustomers = async () => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const csvContent = [
        ["ID", "Name", "Email", "Phone", "Address", "Total Purchases", "Status"].join(","),
        ...filteredCustomers.map(customer => [
          customer.id, customer.name, customer.email, customer.phone, 
          customer.address, customer.totalPurchases, customer.status
        ].join(","))
      ].join("\n");
      
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "customers-export.csv";
      a.click();
      
      showSuccess("Customer data exported successfully!");
      return true;
    } catch (error) {
      showError("Failed to export data");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    customers: filteredCustomers,
    allCustomers: customers,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    stats,
    isLoading,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    exportCustomers
  };
};