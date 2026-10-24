NEFERDIDI — TWO YEARS OF STORIES
Soft Modern Design Update

DESIGN CHANGES
- Replaced the sharp, square feel with a consistent rounded design system: buttons, cards, panels, camera preview, inputs and sections now use gentle radii.
- Added calmer backgrounds, softer shadows, warmer off-white surfaces and light orange accents while preserving Neferdidi's black/orange/white identity.
- Added subtle hover feedback and kept reduced-motion preferences in mind.
- Improved mobile spacing and card layouts.
- Added Products, Approved Memories Gallery and Branch Finder sections in Arabic and English.

BEFORE PUBLISHING
1. Confirm the production site URL in config.js and the canonical/OG links in index.html.
2. Confirm all branch names and areas in config.js with operations. The Google Maps URLs open a search and do not certify exact pins or opening hours.
3. Configure the Cloudinary unsigned upload preset in the Cloudinary dashboard. Restrict formats, file sizes and folders; use moderation controls if available. Unsigned upload presets are public and can be abused, so client-side checks alone are not security.
4. Do not store API secrets in this static site. For stronger abuse prevention, private storage or robust deletion workflows, use a server-side upload endpoint and admin workflow.
5. Add images/videos to approvedMedia only after team review and explicit publication permission. Use HTTPS media URLs. Remove media promptly if permission is withdrawn.
6. GA4 is disabled by default. Only add a real measurement ID to analyticsMeasurementId after analytics and privacy approval. If enabled, the code tracks campaign CTA, menu, branch-map and successful submission events; it does not send customer names, notes, original file names or media URLs to GA4.
7. Verify the official social profiles and menuUrl before production.
8. Test the live HTTPS deployment on mobile devices. The camera, media upload and analytics provider cannot be fully tested in a static local preview.

GALLERY
The gallery is intentionally empty by default. This prevents new customer submissions from being published automatically. Populate approvedMedia only with reviewed content and the relevant consent.

SOCIAL MEDIA VISIBILITY UPDATE
- Instagram and TikTok now appear in the intro screen, desktop header, and a dedicated follow panel immediately after the hero. The footer links remain available too.
- Links are populated from config.js. Instagram: https://www.instagram.com/neferdidimilktea/ ; TikTok: https://www.tiktok.com/@neferdidimilkteashop
- Social profile clicks fire the optional GA4 event social_profile_click only if analyticsMeasurementId is configured.
