import { useState } from 'react';
import LeaveRequestForm from '../components/leave/LeaveRequestForm';
import LeaveRequestsList from '../components/leave/LeaveRequestsList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Leave() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Congés</h1>
        <p className="mt-2 text-gray-600">
          Soumettez vos demandes de congés et consultez votre historique
        </p>
      </div>

      <Tabs defaultValue="request" className="space-y-6">
        <TabsList>
          <TabsTrigger value="request">Demander un congé</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>
        
        <TabsContent value="request">
          <LeaveRequestForm />
        </TabsContent>
        
        <TabsContent value="history">
          <LeaveRequestsList />
        </TabsContent>
      </Tabs>
    </div>
  );
} 