
import type {NextConfig} from 'next';

const isGithubActions = process.env.GITHUB_ACTIONS === 'true'
const repo = process.env.GITHUB_REPOSITORY?.replace(/.*?\//, '') || ''

const nextConfig: NextConfig = {
  // Comentamos la exportación estática temporalmente para debugging
  // output: 'export',
  
  // Comentamos la configuración de GitHub Pages temporalmente
  // basePath: isGithubActions ? `/${repo}` : '',
  // assetPrefix: isGithubActions ? `/${repo}/` : '',
  
  // Las imágenes de dominio remoto no son compatibles con la exportación estática por defecto.
  // Es mejor usar imágenes locales o un proveedor de imágenes compatible.
  // Por ahora, se deshabilita la optimización de imágenes para que la compilación funcione.
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pleybast.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.discordapp.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'novedadeslocales.wordpress.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
