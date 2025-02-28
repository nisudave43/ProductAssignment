import React, { ReactNode } from 'react';
import Header from '@/component/Header';  // Adjust the path if necessary
import Footer from '@/component/Footer';  // Adjust the path if necessary

interface LayoutProps {
  children: ReactNode;  // This will represent the content of the page
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Fixed Header */}
      <Header />
      <main className="flex-grow overflow-y-auto pt-16 pb-4">
        <div className="max-w-screen-xl mx-auto px-4">{children}</div> {/* Centered content with fixed width */}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
