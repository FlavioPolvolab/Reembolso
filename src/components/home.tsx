import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import ExpenseTable from "./ExpenseTable";
import FilterBar from "./FilterBar";
import ExpenseForm from "./ExpenseForm";
import ExpenseDetail from "./ExpenseDetail";

const Home = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showExpenseDetail, setShowExpenseDetail] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  // Mock data for demonstration
  const mockExpenses = [
    {
      id: "1",
      name: "Polvo",
      description: "Almoço no território",
      amount: 445.22,
      purpose: "Reembolso",
      costCenter: "Babaçu",
      category: "Viagens",
      paymentDate: "2024-10-25",
      status: "pending",
      submittedDate: "2024-10-24",
      submittedBy: "Gabi",
      receiptUrl:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80",
    },
    {
      id: "2",
      name: "Polvo",
      description: "Táxi aeroporto",
      amount: 271.73,
      purpose: "Reembolso",
      costCenter: "Institucional",
      category: "Viagens",
      paymentDate: "2024-10-25",
      status: "approved",
      submittedDate: "2024-10-24",
      submittedBy: "Gabi",
      receiptUrl:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80",
    },
    {
      id: "3",
      name: "Polvo",
      description: "Microfone e estabilizador",
      amount: 786.93,
      purpose: "Reembolso",
      costCenter: "Institucional",
      category: "Escritório",
      paymentDate: "2024-10-25",
      status: "rejected",
      submittedDate: "2024-10-24",
      submittedBy: "Gabi",
      receiptUrl:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80",
    },
  ];

  const handleViewExpense = (expense) => {
    setSelectedExpense(expense);
    setShowExpenseDetail(true);
  };

  const handleCreateExpense = () => {
    setShowExpenseForm(true);
  };

  const handleCloseForm = () => {
    setShowExpenseForm(false);
  };

  const handleCloseDetail = () => {
    setShowExpenseDetail(false);
    setSelectedExpense(null);
  };

  const filteredExpenses = mockExpenses.filter((expense) => {
    if (activeTab === "pending") return expense.status === "pending";
    if (activeTab === "approved") return expense.status === "approved";
    if (activeTab === "rejected") return expense.status === "rejected";
    return true;
  });

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Sistema de Reembolso</h1>
          <Button
            onClick={handleCreateExpense}
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-5 w-5" />
            Novo Reembolso
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Solicitações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockExpenses.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pendentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-500" />
                <span className="text-2xl font-bold">
                  {mockExpenses.filter((e) => e.status === "pending").length}
                </span>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Aprovados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-2xl font-bold">
                  {mockExpenses.filter((e) => e.status === "approved").length}
                </span>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Rejeitados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-500" />
                <span className="text-2xl font-bold">
                  {mockExpenses.filter((e) => e.status === "rejected").length}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs
          defaultValue="pending"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pendentes
            </TabsTrigger>
            <TabsTrigger value="approved" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Aprovados
            </TabsTrigger>
            <TabsTrigger value="rejected" className="flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              Rejeitados
            </TabsTrigger>
          </TabsList>

          <FilterBar />

          <TabsContent value="pending" className="mt-4">
            <ExpenseTable
              expenses={filteredExpenses}
              onViewExpense={handleViewExpense}
            />
          </TabsContent>
          <TabsContent value="approved" className="mt-4">
            <ExpenseTable
              expenses={filteredExpenses}
              onViewExpense={handleViewExpense}
            />
          </TabsContent>
          <TabsContent value="rejected" className="mt-4">
            <ExpenseTable
              expenses={filteredExpenses}
              onViewExpense={handleViewExpense}
            />
          </TabsContent>
        </Tabs>
      </div>

      {showExpenseForm && <ExpenseForm onClose={handleCloseForm} />}

      {showExpenseDetail && selectedExpense && (
        <ExpenseDetail expense={selectedExpense} onClose={handleCloseDetail} />
      )}
    </div>
  );
};

export default Home;
