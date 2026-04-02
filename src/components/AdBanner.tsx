"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface AdBannerProps {
  adSlot: string;
  adFormat?: string;
  fullWidthResponsive?: boolean;
}

/**
 * Google AdSense Banner Component
 *
 * How to use:
 * 1. Sign up at https://adsense.google.com and add your site.
 * 2. Get your Publisher ID (ca-pub-XXXXXXXXXXXXXXXX) from AdSense → Account → Account information.
 * 3. Add it to .env.local as NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX
 * 4. In AdSense → Ads → By ad unit → Display ads → create an ad unit and copy the "data-ad-slot" value.
 * 5. Pass that slot value as the `adSlot` prop to this component.
 */
export default function AdBanner({ adSlot, adFormat = "auto", fullWidthResponsive = true }: AdBannerProps) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense script not loaded yet
    }
  }, []);

  if (!clientId || clientId === "ca-pub-xxxxxxxxxxxxxxxx") return null;

  return (
    <ins
      className="adsbygoogle block"
      style={{ display: "block" }}
      data-ad-client={clientId}
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-full-width-responsive={String(fullWidthResponsive)}
    />
  );
}
