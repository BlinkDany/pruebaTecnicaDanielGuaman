import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { IUsuarioProvider } from './src/context/UserContext';
import RootNavigator from './src/navigation/RootNavigator';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
    },
  },
});

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <IUsuarioProvider>
          <RootNavigator />
          <Toast />
        </IUsuarioProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
