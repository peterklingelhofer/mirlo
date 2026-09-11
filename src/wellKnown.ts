import express from "express";

const router = express.Router();

// Fedify handles webfinger for AP-enabled artists; fall through to 404 for
// non-AP artists or wrong-domain resources so the SPA catch-all doesn't grab them.
router.get("/.well-known/webfinger", (req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Android App Links and iOS Universal Links for the mobile app (space.mirlo.mobile).
// Both stores' keys are listed: Play re-signs store installs with its own key,
// EAS signs everything else with the upload key.
const assetLinks = [
  {
    relation: ["delegate_permission/common.handle_all_urls"],
    target: {
      namespace: "android_app",
      package_name: "space.mirlo.mobile",
      sha256_cert_fingerprints: [
        "C1:77:8F:94:E9:A5:25:8A:6C:67:6D:38:0E:31:BA:F7:49:41:D5:9A:13:45:75:94:2F:16:01:B9:C3:E6:8E:BB",
        "17:56:49:BC:2D:8F:32:26:B8:B8:A6:2E:29:81:44:18:7B:A1:BE:9A:4B:30:54:6E:C4:B7:41:42:9F:1E:1E:1A",
      ],
    },
  },
];

// Top-level routes in client/src/routes.tsx that sit beside artist slugs, and
// artist sub-pages the app has no screen for. Everything else under / opens the app.
const webOnlyRoots = [
  "account",
  "admin",
  "artists",
  "checkout",
  "checkout-error",
  "confirm-email-change",
  "email-confirmation",
  "fulfillment",
  "label",
  "login",
  "manage",
  "pages",
  "password-reset",
  "post",
  "profile",
  "releases",
  "sales",
  "search",
  "signup",
  "tags",
  "widget",
];
const webOnlyArtistPaths = [
  "checkout-complete",
  "checkout-error",
  "connect",
  "links",
  "merch",
  "merch/*",
  "posts",
  "posts/*",
  "release/*/download",
  "release/*/redeem",
  "release/*/tracks/*/download",
  "releases",
  "roster",
  "support",
  "tip",
  "unsubscribe",
];
const appleAppSiteAssociation = {
  applinks: {
    details: [
      {
        appIDs: ["VZCHHV7VNW.space.mirlo.mobile"],
        components: [
          ...webOnlyRoots.flatMap((root) => [
            { "/": `/${root}`, exclude: true },
            { "/": `/${root}/*`, exclude: true },
          ]),
          ...webOnlyArtistPaths.map((path) => ({
            "/": `/*/${path}`,
            exclude: true,
          })),
          { "/": "/*" },
        ],
      },
    ],
  },
};

for (const path of [
  "/.well-known/assetlinks",
  "/.well-known/assetlinks.json",
]) {
  router.get(path, (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(assetLinks));
  });
}
router.get("/.well-known/apple-app-site-association", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify(appleAppSiteAssociation));
});

export default router;
