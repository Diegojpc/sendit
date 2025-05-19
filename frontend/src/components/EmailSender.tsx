
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Mail, Send } from "lucide-react";

interface EmailData {
  sender: string;
  subject: string;
  body: string;
}

interface ApiPayload {
  body: string,
  recipient: string,
  subject: string
}

interface ApiSuccessResponse {
  success: boolean,
  details: string,
  email: ApiPayload,
  id: string
}

interface ApiErrorResponse {
  details: string
}

const EmailSender: React.FC = () => {
  const [emailData, setEmailData] = useState<EmailData>({
    sender: '',
    subject: '',
    body: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEmailData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emailData.sender || !emailData.subject || !emailData.body) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    setIsLoading(true);

    const apiPayload: ApiPayload = {
      recipient: emailData.sender,
      subject: emailData.subject,
      body: emailData.body
    };
    
    try {
      // Aquí realizamos la petición POST a la API externa
      const response = await fetch('http://localhost:8000/notifications/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiPayload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        const errorDetails = (responseData as ApiErrorResponse)?.details || 'Error al enviar el correo desde el servidor';
        throw new Error(errorDetails);
      }

      const successData = responseData as ApiSuccessResponse;
      if (successData.success) {
        toast.success(`${successData.details} (ID: ${successData.id})`);
        // Opcional: limpiar el formulario después de enviar
        setEmailData({
          sender: '',
          subject: '',
          body: ''
        });
      } else {
        // En caso de que response.ok sea true, pero success sea false (si tu API lo permite)
        const errorDetails = successData.details || 'El servidor indicó un fallo al procesar la solicitud.';
        throw new Error(errorDetails);
      }
      
    } catch (error) {
      console.error('Error:', error);
      toast.error('No se pudo enviar el correo. Inténtalo nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <div className="flex items-center gap-2">
          <Mail className="h-6 w-6" />
          <CardTitle>Envío de Correo Masivo</CardTitle>
        </div>
        <CardDescription className="text-blue-100">
          Completa el formulario para enviar tu correo electrónico
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sender">Remitente</Label>
            <Input
              id="sender"
              name="sender"
              placeholder="nombre@ejemplo.com"
              value={emailData.sender}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subject">Asunto</Label>
            <Input
              id="subject"
              name="subject"
              placeholder="Asunto del correo"
              value={emailData.subject}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="body">Contenido</Label>
            <Textarea
              id="body"
              name="body"
              placeholder="Escribe el contenido de tu correo aquí..."
              value={emailData.body}
              onChange={handleChange}
              className="min-h-[200px] w-full"
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between items-center border-t pt-6">
        <div className="text-sm text-gray-500">
          Todos los campos son obligatorios
        </div>
        <Button 
          onClick={handleSubmit} 
          disabled={isLoading} 
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
              Enviando...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              Enviar Correo
            </span>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EmailSender;
