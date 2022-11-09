import React, { PropsWithChildren, useState } from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

export const withQueryClient: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [queryClient] = useState(new QueryClient());

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
