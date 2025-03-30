import { Fragment } from 'react';
import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <Fragment>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </Fragment>
  );
} 