# RobieE Mission Control Dashboard

Real-time financial dashboard for RobieE Enterprises, powered by Google Sheets.

## Features

- 💰 Real-time cost tracking (YTD, daily, averages)
- 📊 Budget visualization (daily API spend vs $5 limit)
- 🔄 Auto-refresh every 5 minutes
- 📈 Cost breakdown (OpenRouter vs Anthropic)
- 🟢 Status indicators (healthy/warning/critical)

## Data Source

All cost data is fetched from the **RobieE Mission Control Dashboard** Google Sheet:
- Spreadsheet ID: `1OH2rnWQaAkxCX-vb42y5uDk91rROQ7jzxNrGHTwz3Lw`
- Updated daily at 8:00 AM ET via automated cron job
- No API key required (uses public CSV export fallback)

## Deployment

This dashboard is deployed on GitHub Pages and auto-updates whenever the source repo is pushed.

**URL:** `https://enterprisesrobie-prog.github.io/robiee-mission-control-dashboard/`

## How It Works

1. **Daily Cost Collection (8:00 AM ET)**
   - Python script queries OpenRouter + Anthropic APIs
   - Results written to Google Sheet

2. **Dashboard Fetch (Every 5 minutes)**
   - JavaScript fetches latest data from Google Sheet
   - Updates displayed metrics in real-time

3. **Visualization**
   - Shows YTD totals, daily costs, budget status
   - Color-coded status (green = healthy, orange = warning)
   - Budget bar shows % of $5/day API limit used

## Technical Stack

- HTML/CSS/JavaScript (client-side only)
- Google Sheets API (public access via CSV export)
- No backend server required

## Updating the Dashboard

To update the dashboard:
```bash
cd /path/to/repo
git add .
git commit -m "Update dashboard"
git push
```

Changes are deployed automatically to GitHub Pages within 1-2 minutes.

## Status

✅ **Live & Monitoring**
- Data updates: Daily at 8:00 AM ET
- Dashboard refreshes: Every 5 minutes
- Budget status: On track ($1.52/day avg vs $5 limit)
