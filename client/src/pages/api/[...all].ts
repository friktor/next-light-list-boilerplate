import type { NextApiRequest, NextApiResponse } from "next";
import httpProxyMiddleware from "next-http-proxy-middleware";

export const config = {
  api: {
    externalResolver: true,
    bodyParser: false,
  },
};

// Is middleware for dev-mode, for proxy on production use nginx
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return httpProxyMiddleware(req, res, {
    target: `${process.env.API_HOST}/api`,
    changeOrigin: true,
    autoRewrite: true,
    pathRewrite: [
      {
        patternStr: "^/api",
        replaceStr: "",
      },
    ],
  });
}
