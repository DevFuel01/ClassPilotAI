import { useState } from 'react';
import { ClassroomProvider } from './context/ClassroomContext';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';

function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'dashboard'>('landing');

  return (
    <ClassroomProvider>
      {currentPage === 'landing' ? (
        <LandingPage onStartTeaching={() => setCurrentPage('dashboard')} />
      ) : (
        <Dashboard />
      )}
    </ClassroomProvider>
  );
}

export default App;
