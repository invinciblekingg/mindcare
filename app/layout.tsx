import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/components/providers/AppProvider';
import { Header } from '@/components/common/Header';
import { Sidebar } from '@/components/common/Sidebar';
import { DevRoleToolbar } from '@/components/common/DevRoleToolbar';
import { CrisisModalWrapper } from '@/components/common/CrisisModalWrapper';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MindCareAI — Explainable Mental Wellness for Adolescents',
  description:
    'A calm, clinical-grade adolescent wellness companion and counsellor portal with transparent safety classifications, non-diagnostic reflection, and secure human escalation.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={plusJakarta.variable}>
      <body className="bg-background text-foreground antialiased min-h-screen flex flex-col font-sans selection:bg-sage/20 selection:text-sage">
        <AppProvider>
          <CrisisModalWrapper />
          <Header />
          <div className="flex-1 flex overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto pb-20 md:pb-6 p-4 md:p-8 max-w-7xl mx-auto w-full">
              {children}
            </main>
          </div>
          <DevRoleToolbar />
        </AppProvider>
      </body>
    </html>
  );
}
