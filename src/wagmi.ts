import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  bsc,
} from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'RainbowKit App',
  projectId: '50fdf83633b3224814645f65c0656aff',
  chains: [
   bsc,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [bsc] : []),
  ],
  ssr: true,
});