# Render Vault Website - All Text Content

This document contains all the text content from the Render Vault website, organized by page and component. Each section shows the file path where the text appears, making it easy to know where edits need to go.

---

## HOME PAGE (Landing Page)

### File: `components/Hero.tsx`

**Main Headline:**
```
No models
No venue
No photographer
```

**Subheadline:**
```
Product images without stress
```

---

### File: `components/PainContrast.tsx`

**Section Title:**
```
The Old Way
```

**Old Way - Point 1:**
- Title: `5-10k on a photoshoot`
- Description: `Stressful & people let you down`

**Old Way - Point 2:**
- Title: `Limited editing options`
- Description: `Once its done, it's done`

**Old Way - Point 3:**
- Title: `Slow turnaround`
- Description: `Time is money`

**Section Title:**
```
The Vault
```

**The Vault - Point 1:**
- Title: `Fraction of the price`
- Description: `Only pay for imagery that you need`

**The Vault - Point 2:**
- Title: `Post edits are easy`
- Description: `Change colours, positions & facial expressions`

**The Vault - Point 3:**
- Title: `24 hour turnaround`
- Description: `Launch faster. Scale infinitely.`

---

### File: `components/ProofWall.tsx`

**Section Title:**
```
Our Standard
```

**Example Titles:**
- `Homewares`
- `Furniture`
- `Toys`

---

### File: `components/HowItWorks.tsx`

**Section Title:**
```
How it works
```

**Subtitle:**
```
Three steps from brief to batch.
```

**Step 1:**
- Number: `1`
- Title: `Send your brief`
- Description: `Brand, product shots, and a few example images you like.`

**Step 2:**
- Number: `2`
- Title: `We design and run the AI`
- Description: `We handle concepts, scenes, and all the AI work. No tools for you to learn.`

**Step 3:**
- Number: `3`
- Title: `You get 20+ hero images`
- Description: `Sized for your chosen channels, ready to drop into ads, site, and email.`

**Button Text:**
- `Start brief`
- `See brief flow`

---

### File: `components/Pricing.tsx`

**Section Title:**
```
Simple Pricing
```

**Tier 1: Single Image**
- Title: `Single Image`
- Price: `$89` `Per image`
- Description: `Perfect for meta or social media posts`
- Features:
  - `1 images built from your product shots.`
  - `Sized for ads, site, email, and PDP.`
  - `Human art direction and QA on every batch.`
  - `Commercial rights for your brand.`
  - `Delivery in 1 business days after brief approval.`
- Button: `Get Started`

**Tier 2: One-time batch (Most Popular)**
- Badge: `Most Popular`
- Title: `One-time batch`
- Price: `$980`
- Description: `The AI photoshoot` (line break) `One batch of hero images, done for you.`
- Features:
  - `~20 final images built from your product shots.`
  - `Sized for ads, site, email, and PDP.`
  - `Human art direction and QA on every batch.`
  - `Commercial rights for your brand.`
  - `Delivery in 5 business days after brief approval.`
- Button: `Get Pro`

**Tier 3: The Vault**
- Title: `The Vault`
- Price: `$200` `/ month`
- Description: `For brands that need consistent content on tap.`
- Features:
  - `Unlimited Renders`
  - `Prioritized Queue`
  - `Dedicated Art Director`
  - `Monthly Strategy Call`
  - `Cancel Anytime`
- Button: `Join Vault`

---

### File: `components/UseCases.tsx`

**Section Title:**
```
Ready for Everything
```

**Use Case Titles:**
- `Meta Ads`
- `Email Marketing`
- `PDP Gallery`
- `Social Content`
- `Billboards`
- `Press Kits`

---

### File: `components/FAQ.tsx`

**Section Title:**
```
Common Questions
```

**Question 1:**
- Question: `How long does it take?`
- Answer: `Our standard turnaround time is 48 hours for the initial model and first batch of renders. Once the model is in our vault, new renders can be generated instantly.`

**Question 2:**
- Question: `Do I need to ship my product?`
- Answer: `No. We only need a few reference photos taken from your phone to understand dimensions and textures. We build the digital twin from scratch.`

**Question 3:**
- Question: `What if I don't like the renders?`
- Answer: `We offer unlimited revisions on the 3D model until it matches your product perfectly. For renders, we provide a satisfaction guarantee.`

**Question 4:**
- Question: `Can you do complex animations?`
- Answer: `Yes. Since we build a full 3D asset, we can create anything from simple 360 spins to complex physics simulations and exploded views.`

---

### File: `components/IntakeWizard.tsx`

**Modal Title:**
```
Start Brief
```

**Form Field 1:**
- Label: `Project Name`
- Placeholder: `e.g. Summer Campaign`

**Form Field 2:**
- Label: `Product Type`
- Options:
  - `Cosmetics`
  - `Furniture`
  - `Tech`
  - `Beverage`

**Button:**
- `Continue`

---

## APP PAGES (Logged In)

### File: `components/app/AppShell.tsx`

**Header:**
- Logo/Brand: `Render Vault`
- Button: `New project`
- Link: `Profile`

---

### File: `app/(app)/projects/page.tsx`

**Page Header:**
- Title: `Projects`
- Description: `Filter, search, and create projects.`
- Button: `New project`

**Search:**
- Placeholder: `Search by name or brief...`

**Filter Tabs:**
- `All`
- `Active`
- `Drafts`
- `Completed`

**Project Card Labels:**
- `Image render`
- `Website build`
- `Other`
- `images` (e.g., "5 images")
- `v1` (version number)
- `Updated [time]` (e.g., "Updated 2 hours ago")
- `Due [date]` (e.g., "Due Dec 5, 2024")
- `Open` (button text)
- `No brief yet.` (when brief is empty)

**Empty State:**
- Title: `No projects yet`
- Description: `Create your first project to share a brief, upload references, and review renders in one place.`
- Button: `New project`

**New Project Sheet:**
- Title: `New project`
- Description: `Add a brief and optional due date to kick things off.`
- Button: `Close`

---

### File: `app/(app)/projects/new/page.tsx`

**Page Title:**
- `New project`

**Page Description:**
- `Add a project type, a name (or let us auto-name it), a short brief, and an optional due date.`

**Back Button:**
- `Back to projects`

---

### File: `components/app/NewProjectForm.tsx`

**Form Fields:**
- Label: `Project type`
  - Options: `Image render`, `Website build`, `Other`
- Label: `Project name`
  - Placeholder: `e.g. "Summer campaign" (leave blank to auto-name)`
- Label: `Brief`
  - Placeholder: `What do you need? Key requirements, references, outputs...`
- Label: `Due date (optional)`

**Buttons:**
- `Cancel`
- `Create project` (or custom submitLabel)

---

### File: `app/(app)/projects/[projectId]/page.tsx`

**Back Button:**
- `Back to projects`

**Project Header Labels:**
- `Project`
- `Billing [period]` (e.g., "Billing 2024-11")
- `Due [date]` (e.g., "Due Dec 5, 2024")

**Action Buttons:**
- `Upload assets`
- `New image`

**Section Labels:**
- `Brief`
- `Deliverables`

**Assets Section:**
- Title: `Assets`
- Filter Tabs: `All`, `Source`, `Reference`, `Materials`, `Inspiration`, `Other`

**Output Images Section:**
- Title: `Output images`
- Button: `Add image`
- Button: `Add output image`
- Status: `Processing…` (when no preview)

**Notes Section:**
- Title: `Notes`
- Placeholder: `Add a note...`
- Button: `Send`

---

### File: `app/(app)/projects/[projectId]/images/[imageId]/page.tsx`

**Back Button:**
- `Back to project`

**Page Labels:**
- `Image`
- `Project: [project name]`
- `Last updated [date/time]`
- `Status`
- `Comments (v[version])` (e.g., "Comments (v3)")

**Empty States:**
- `No version selected`
- `No comments yet.`
- `Image not found.`

**Comments:**
- Placeholder: `Add a comment...`
- Button: `Send`

**Action Buttons:**
- `Download`
- `Request revision`
- `Approve image`

**Zoom Controls:**
- `[percentage]%` (e.g., "100%")

---

### File: `app/(auth)/login/page.tsx`

**Page Title:**
- `Login`

**Description:**
- `Authentication flow will be powered by Supabase Auth. Add the Supabase UI or custom form here.`

---

## PROFILE PAGE

### File: `components/profile/ProfilePage.tsx`

**Accordion Sections:**
- `Personal information`
- `Brand details`
- `Billing & credits`
- `Projects & usage`
- `Login & security`
- `Support`
- `Legal`

**Footer:**
- Button: `Log out`
- Text: `Render Vault · Profile`
- Version: `v1.0.0`

---

### File: `components/profile/ProfileHeader.tsx`

**Header Content:**
- Name display (e.g., "Steven Shelley")
- Company badge (e.g., "BHM Furniture & Homewares")
- Email display
- `Member ID: [id]` (e.g., "Member ID: RV-2024-0847")
- `Member since [date]` (e.g., "Member since 3/15/2024")
- Fallback: `Your profile`

---

### File: `components/profile/sections/PersonalInfoSection.tsx`

**Section Title:**
- `Contact details`

**Buttons:**
- `Edit`
- `Cancel`
- `Save`

**Form Fields:**
- Label: `Full name`
- Label: `Email`
- Label: `Phone number`
- Label: `Company`
- Label: `Country`
- Label: `Timezone`

---

### File: `components/profile/sections/BrandSection.tsx`

**Section Title:**
- `Brand specification`

**Buttons:**
- `Edit`
- `Cancel`
- `Save`

**Form Fields:**
- Label: `Brand name`
- Label: `Tone of voice`
- Label: `Brand summary`
- Label: `Visual style`
- Label: `Font preferences`
- Label: `Notes`

---

### File: `components/profile/sections/BillingCreditsSection.tsx`

**Section Title:**
- `Plan & credits`

**Description:**
- `Manage your subscription and see how your credits move with each job.`

**Current Plan:**
- Label: `Current plan`
- Value: `No active plan` (if no plan)
- Description: `Billing is handled securely via Stripe. You can upgrade, pause, or cancel anytime from the customer portal.`

**Credits:**
- Label: `Credits`
- Value: `[number] credits` (e.g., "47 credits")
- Description: `Every render job adjusts your balance. Top-ups land here instantly after payment.`

**Recent Activity:**
- Label: `Recent activity`
- Transaction Types:
  - `Manual adjustment`
  - `Job created`
  - `Stripe payment`
  - `Refund`
  - `Promo credit`
- Empty State: `No recent credit activity yet.`

---

### File: `components/profile/sections/ProjectsUsageSection.tsx`

**Stat Labels:**
- `Total projects`
- `Active projects`
- `Completed images`
- `Last activity`
- Fallback: `—` (if no activity)

---

### File: `components/profile/sections/SecuritySection.tsx`

**Description:**
- `Your account is secured via email login. Password resets and magic links are handled by our authentication provider.`

**Primary Login:**
- Label: `Primary login`
- Shows email address

---

### File: `components/profile/sections/SupportSection.tsx`

**Description:**
- `Need a hand with a brief, a scene, or a tricky material? Message us on Messenger and we'll walk through it with you.`

**Button:**
- `Message us on Messenger`

**Note:**
- `The link includes your member reference so we can align chats with the right projects.`

---

### File: `components/profile/sections/LegalSection.tsx`

**Description:**
- `Render Vault is built for creative teams who need consistent, on-brand imagery without production overhead.`
- `By using the service you agree to our standard terms, including usage rights for generated imagery. Final legal copy will live here, with links to full Terms of Service and Privacy Policy.`

---

## DEMO DATA (Sample Content)

### File: `lib/demo-data.ts`

**Demo Project:**
- Name: `Teak Dining Collection`
- Brief: `Hero images for the new teak dining collection. Need 6 lifestyle shots showing the table and chairs in a warm Australian home setting.

Key requirements:
- Natural light, warm afternoon feel
- Show the grain and texture of the reclaimed teak
- Modern but warm interior backdrop
- Include some lifestyle elements (books, plants, ceramics)`
- Deliverables: `6 high-res images (4000x3000), 2 square crops for Instagram`

**Demo Notes:**
- `Uploaded source images. Please highlight specific grain patterns.`
- `Reviewed assets. Starting first batch now. ETA for previews is tomorrow.`
- `Looking great so far! Try warmer light temperature on image 3.`

**Demo Image Titles:**
- `Hero shot - table setting`
- `Detail - wood grain`
- `Lifestyle - morning light`

**Demo Comments:**
- `Initial render. Looking for feedback on lighting and composition.`
- `Composition works. Can we enhance the grain and add lifestyle elements?`
- `Version 2 ready with grain detail and composition tweaks.`
- `Better! Please warm up the light to late afternoon.`
- `Version 3 now has warmer lighting and added lifestyle pieces.`

**Demo Asset Labels:**
- `Dining table hero.jpg`
- `Chair detail.jpg`
- `Style reference 1.png`
- `Style reference 2.png`
- `Brand guidelines.pdf`

---

## STATUS LABELS

### File: `lib/status.ts`

These appear throughout the app via `StatusPill` component:

**Project Statuses:**
- `Draft`
- `In review`
- `In progress`
- `Awaiting you`
- `Completed`
- `Archived`

**Image Statuses:**
- `Draft`
- `Processing`
- `Delivered`
- `Needs revision`
- `Approved`
- `Archived`

**Version Statuses:**
- `Candidate`
- `Delivered`
- `Approved`
- `Rejected`

---

## NOTES FOR EDITING

1. **File Paths**: Each section shows the file path where the text appears. When you make edits, note which file path the text belongs to.

2. **Placeholders**: Text in square brackets like `[date]` or `[number]` are dynamic values that will be replaced with actual data.

3. **Buttons & Links**: All button text and link labels are included.

4. **Empty States**: Messages shown when there's no content (e.g., "No projects yet").

5. **Form Labels**: All form field labels and placeholders are included.

6. **Status Labels**: These are used throughout the app to show project/image status.

---

## HOW TO USE THIS DOCUMENT

1. Open this file in Microsoft Word or Google Docs.
2. Edit the text content as needed.
3. Note the file path for each section you edit.
4. When you're done, save the document and share it back.
5. The developer will update the code files with your changes.

---

**Last Updated:** [Date when this document was created]
**Total Sections:** [Count of text sections extracted]

