import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
} from "lucide-react";
import ExpenseTable from "./ExpenseTable";
import FilterBar from "./FilterBar";
import ExpenseForm from "./ExpenseForm";
import ExpenseDetail from "./ExpenseDetail";
import { fetchExpenses } from "@/services/expenseService";
import { useToast } from "@/components/ui/use-toast";

const Home = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showExpenseDetail, setShowExpenseDetail] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(
    null,
  );
  const [expenses, setExpenses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const { toast } = useToast();

  // Carregar despesas do banco de dados
  useEffect(() => {
    loadExpenses();
  }, [activeTab, filters]);

  const loadExpenses = async () => {
    setIsLoading(true);
    try {
      // Combinar filtros com o filtro de status baseado na aba ativa
      const statusFilter = activeTab !== "all" ? { status: activeTab } : {};
      const combinedFilters = { ...filters, ...statusFilter };

      const data = await fetchExpenses(combinedFilters);

      // Mapear dados para o formato esperado pelo ExpenseTable
      const formattedExpenses = data.map((expense) => ({
        id: expense.id,
        name: expense.users?.name || "Desconhecido",
        description: expense.description,
        amount: expense.amount,
        status: expense.status,
        date: expense.submitted_date,
        purpose: expense.purpose,
        costCenter: expense.cost_centers?.name || "",
        category: expense.categories?.name || "",
        paymentDate: expense.payment_date,
      }));

      setExpenses(formattedExpenses);
    } catch (error) {
      console.error("Erro ao carregar despesas:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as despesas. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (expense) => {
    setSelectedExpenseId(expense.id);
    setShowExpenseDetail(true);
  };

  const handleCreateExpense = () => {
    setShowExpenseForm(true);
  };

  const handleCloseForm = () => {
    setShowExpenseForm(false);
    // Recarregar despesas após fechar o formulário para mostrar novas entradas
    loadExpenses();
  };

  const handleCloseDetail = () => {
    setShowExpenseDetail(false);
    setSelectedExpenseId(null);
    // Recarregar despesas após fechar os detalhes para refletir possíveis mudanças de status
    loadExpenses();
  };

  const handleApprove = async (expense) => {
    // Esta função não é usada diretamente aqui, mas é passada para o ExpenseTable
    // A aprovação real acontece no componente ExpenseDetail
  };

  const handleReject = async (expense) => {
    // Esta função não é usada diretamente aqui, mas é passada para o ExpenseTable
    // A rejeição real acontece no componente ExpenseDetail
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleStatusChange = () => {
    // Recarregar despesas quando o status mudar (aprovado/rejeitado)
    loadExpenses();
  };

  // Contar despesas por status
  const pendingCount = expenses.filter((e) => e.status === "pending").length;
  const approvedCount = expenses.filter((e) => e.status === "approved").length;
  const rejectedCount = expenses.filter((e) => e.status === "rejected").length;
  const totalCount = expenses.length;

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
              <div className="text-2xl font-bold">{totalCount}</div>
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
                <span className="text-2xl font-bold">{pendingCount}</span>
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
                <span className="text-2xl font-bold">{approvedCount}</span>
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
                <span className="text-2xl font-bold">{rejectedCount}</span>
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

          <FilterBar onFilterChange={handleFilterChange} />

          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Carregando despesas...</span>
            </div>
          ) : (
            <>
              <TabsContent value="pending" className="mt-4">
                <ExpenseTable
                  expenses={expenses.filter((e) => e.status === "pending")}
                  onViewDetails={handleViewDetails}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              </TabsContent>
              <TabsContent value="approved" className="mt-4">
                <ExpenseTable
                  expenses={expenses.filter((e) => e.status === "approved")}
                  onViewDetails={handleViewDetails}
                />
              </TabsContent>
              <TabsContent value="rejected" className="mt-4">
                <ExpenseTable
                  expenses={expenses.filter((e) => e.status === "rejected")}
                  onViewDetails={handleViewDetails}
                />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>

      {showExpenseForm && (
        <ExpenseForm onClose={handleCloseForm} onSubmit={handleCloseForm} />
      )}

      {showExpenseDetail && selectedExpenseId && (
        <ExpenseDetail
          expenseId={selectedExpenseId}
          isOpen={showExpenseDetail}
          onClose={handleCloseDetail}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
};

export default Home;
