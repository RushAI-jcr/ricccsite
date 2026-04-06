# RICCC Lab — Team Editing Guide

This guide is for lab members who need to update their profile, add new team members, or manage the team directory. **No coding required.**

## How to Log In

1. Go to **https://riccc-lab.com/staff/login**
2. Enter the shared lab passphrase (ask J.C. or Kevin if you don't have it)
3. You'll be logged in for 8 hours before needing to re-enter it

## How to Edit Your Profile

1. After logging in, go to **https://riccc-lab.com/staff/members**
2. Find your name in the list and click **Edit**
3. Update your fields:
   - **Name**: Full name with degrees (e.g., "Jane Doe, MD, PhD")
   - **Role/Title**: Your position (e.g., "PhD Student, Biomedical Informatics")
   - **Photo**: Drag and drop a headshot (max 4.5 MB, auto-resized to 400x400)
   - **Bio**: Write 2-3 sentences about your research interests
   - **PubMed Author Name**: Your PubMed author name (e.g., "Doe J") — this auto-fetches your publications
   - **Academic links**: Google Scholar URL, LinkedIn URL, ORCID, personal website, GitHub — all optional
4. Click **Save**

Changes commit to GitHub and auto-deploy to the live site within 1-2 minutes.

## How to Add a New Team Member

1. Go to **/staff/members** and click **New Member**
2. Fill in the required fields: Name, Role, Tier (student/staff/pi), Email
3. Optionally add photo, bio, and academic links
4. Click **Save**

## How to Archive Someone (Move to Alumni)

1. Find the member in **/staff/members**
2. Click the **Archive** action
3. Their tier changes to "alumni" and they move to the alumni section on the public site
4. To restore them, use the **Restore** action

## How Publications Work

Publications are **automatically fetched from PubMed, Semantic Scholar, and OpenAlex** — you don't need to add them manually.

- The site searches using the query configured in the site config
- If your profile has a **PubMed Author Name** field set, your publications appear
- Publications refresh every 24 hours (and monthly via cron)

## Need Help?

Contact J.C. Rojas (juan_rojas@rush.edu) or open an issue at https://github.com/riccc-rush-lab/ricccsite/issues
