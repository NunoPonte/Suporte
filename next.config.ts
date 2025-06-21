import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/getAssistencias",
        destination: process.env.NEXT_PUBLIC_GET_ASSISTENCIAS || "",
      },

      {
        source: "/api/postAssistencia",
        destination: process.env.NEXT_PUBLIC_POST_ASSISTENCIA || "",
      },
      {
        source: "/api/postMensagem",
        destination: process.env.NEXT_PUBLIC_POST_INTERVENCOES || "",
      },
      {
        source: "/api/postFile",
        destination: process.env.NEXT_PUBLIC_POST_FILE || "",
      }
    ];
  },
};

export default nextConfig;
