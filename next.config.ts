import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Applique ces en-têtes à toutes les routes API
        source: "/api/:path*",
        headers: [
          { 
            key: "Access-Control-Allow-Credentials", 
            value: "true" 
          },
          { 
            key: "Access-Control-Allow-Origin", 
            // En production, remplacez * par vos domaines spécifiques
            value: process.env.NODE_ENV === "production" 
              ? "https://morose.netlify.app" 
              : "*"
          },
          { 
            key: "Access-Control-Allow-Methods", 
            value: "GET,POST,PUT,DELETE,OPTIONS" 
          },
          { 
            key: "Access-Control-Allow-Headers", 
            value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization" 
          },
          // Optionnel: Cache les pré-vols pour 24h
          {
            key: "Access-Control-Max-Age",
            value: "86400"
          }
        ]
      },
      // Optionnel: Ajoutez une configuration spécifique pour les requêtes OPTIONS
      {
        source: "/api/:path*",
        headers: [
          { key: "Vary", value: "Origin" },
          { key: "Vary", value: "Access-Control-Request-Method" },
          { key: "Vary", value: "Access-Control-Request-Headers" }
        ],
        missing: [
          {
            type: "header",
            key: "Access-Control-Request-Method"
          }
        ]
      }
    ];
  },
  // Autres configurations Next.js...
  reactStrictMode: true,
  swcMinify: true
};

export default nextConfig;