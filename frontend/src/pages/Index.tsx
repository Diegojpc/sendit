
import React from 'react';
import EmailSender from '@/components/EmailSender';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Aplicación de Envío de Correos
          </h1>
          <p className="mt-3 text-lg text-gray-500">
            Envía correos electrónicos de forma rápida y sencilla
          </p>
        </div>
        
        <EmailSender />
        
        <div className="mt-10 text-center text-sm text-gray-500">
          <p>
            Asegúrate de tener los permisos necesarios para el envío de correos masivos.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
