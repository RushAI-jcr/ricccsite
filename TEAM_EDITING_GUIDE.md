# RICCC Lab — Team Editing Guide

This guide is for lab members who need to update their profile, add new team members, or manage research spotlights. **No coding required.**

## How to Edit Your Profile

1. Go to **https://ricccsite.vercel.app/admin/**
2. Click **"Login with GitHub"** (you need a GitHub account with write access to the repo)
3. Click **"Team Members"** in the sidebar
4. Find your name and click to edit
5. Update your fields:
   - **Name**: Full name with degrees (e.g., "Jane Doe, MD, PhD")
   - **Role/Title**: Your position (e.g., "PhD Student, Biomedical Informatics")
   - **Photo**: Click to upload a square headshot (at least 400x400px)
   - **Bio**: Write 2-3 sentences about your research interests
   - **PubMed Author Name**: Your PubMed author name (e.g., "Doe J") — this auto-fetches your publications
   - **Academic links**: **Google Scholar** (full profile URL), **LinkedIn** (full profile URL), ORCID, personal website, GitHub username — all optional; add only what you want shown on the team page
6. Click **"Publish"** to save

Changes auto-deploy to the live site within 2-3 minutes.

## How to Add a New Team Member

1. Go to /admin/ and log in
2. Click **"Team Members"** → **"New Team Member"**
3. Fill in the required fields: Name, Role, Tier (student/staff/pi), Email
4. Optionally add photo, bio, and academic links
5. Click **"Publish"**

## How to Move Someone to Alumni

1. Edit the team member's profile
2. Change **Tier** from "student" or "staff" to **"alumni"**
3. Update their **Role** if needed (e.g., add their new position)
4. Publish

## How to Update Research Spotlights

1. Go to /admin/ and log in
2. Click **"Research Spotlights"**
3. Add, edit, or remove spotlight entries
4. Each spotlight needs: Title, Journal, Year, Authors, and optionally DOI/PMID
5. Publish

## How Publications Work

Publications are **automatically fetched from PubMed** — you don't need to add them manually.

- The site searches PubMed using the query configured in **Site Settings**
- If your profile has a **PubMed Author Name** field set, your publications appear on the team page
- Publications refresh every 24 hours

## Need Help?

Contact the lab admin or open an issue at https://github.com/riccc-rush-lab/ricccsite/issues
