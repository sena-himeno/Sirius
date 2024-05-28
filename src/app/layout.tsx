import React from 'react';
import Header from '../components/Header';
import { type Metadata } from 'next';
import '@/style/color.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sirius',
  description: 'i just want to be happy',
    icons: {
     icon: '/icon.png'
    }
};

export default function RootLayout ({children}: Readonly<{ children: React.ReactNode }>) {
  return (
      <html lang="en">
      <body className={''}>
      <Header />
              {children}
          </body>
      </html>
  );
}
