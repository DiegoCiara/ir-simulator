import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateProps {
  children: ReactNode;
}

function Private({ children }: PrivateProps) {
  const token = () => { return sessionStorage.getItem("@ir-simulator:token") };

  if (token()) {
    return children;
  }

  return <Navigate to="/login" replace />;
}


export default Private;