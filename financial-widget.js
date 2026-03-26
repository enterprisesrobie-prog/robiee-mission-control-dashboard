/**
 * Mission Control Dashboard — Financial Widget
 * Fetches cost data from Google Sheet and displays in real-time
 * 
 * Data source: RobieE Mission Control Dashboard (Google Sheet)
 * Spreadsheet ID: 1OH2rnWQaAkxCX-vb42y5uDk91rROQ7jzxNrGHTwz3Lw
 */

class FinancialWidget {
    constructor() {
        this.spreadsheetId = '1OH2rnWQaAkxCX-vb42y5uDk91rROQ7jzxNrGHTwz3Lw';
        this.apiKey = process.env.GOOGLE_SHEETS_API_KEY || 'AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXX'; // Will be set at runtime
        this.refreshInterval = 5 * 60 * 1000; // Refresh every 5 minutes
        this.lastUpdate = null;
    }

    /**
     * Fetch current financial data from Google Sheet
     */
    async fetchData() {
        try {
            const dashboardData = await this.fetchSheetData('Dashboard', 'A1:C30');
            const runningTotals = await this.fetchSheetData('Running Totals', 'A1:D20');
            
            return {
                dashboard: this.parseDashboardSheet(dashboardData),
                runningTotals: this.parseRunningTotals(runningTotals),
                lastUpdate: new Date().toLocaleString('en-US', { timeZone: 'America/Indiana/Indianapolis' })
            };
        } catch (error) {
            console.error('Failed to fetch financial data:', error);
            return this.getDefaultData();
        }
    }

    /**
     * Fetch specific range from Google Sheet
     * Uses public API if API key available, otherwise falls back to CSV export
     */
    async fetchSheetData(sheetName, range) {
        // Method 1: Try Google Sheets API (if API key available)
        if (this.apiKey && !this.apiKey.includes('XXXXX')) {
            const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/'${sheetName}'!${range}?key=${this.apiKey}`;
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                return data.values || [];
            }
        }

        // Method 2: Fall back to CSV export (no auth needed)
        const csvUrl = `https://docs.google.com/spreadsheets/d/${this.spreadsheetId}/export?format=csv&gid=0`;
        const response = await fetch(csvUrl);
        if (response.ok) {
            const csv = await response.text();
            return this.parseCSV(csv);
        }

        throw new Error('Unable to fetch sheet data');
    }

    /**
     * Parse CSV data
     */
    parseCSV(csv) {
        return csv.split('\n').map(line => line.split(','));
    }

    /**
     * Parse Dashboard sheet
     */
    parseDashboardSheet(data) {
        const dashboard = {};
        
        // Extract key metrics
        data.forEach((row, idx) => {
            if (row[0] && row[1]) {
                const metric = row[0].trim();
                const value = row[1].trim();
                
                // Map common metrics
                if (metric.includes("Today's Total")) dashboard.todayTotal = value;
                if (metric.includes("YTD Total")) dashboard.ytdTotal = value;
                if (metric.includes("Daily Average")) dashboard.dailyAverage = value;
                if (metric.includes("OpenRouter YTD")) dashboard.openrouterYtd = value;
                if (metric.includes("Anthropic API YTD")) dashboard.anthropicYtd = value;
                if (metric.includes("Status")) dashboard.status = row[2]?.trim() || '✅';
            }
        });

        return dashboard;
    }

    /**
     * Parse Running Totals sheet
     */
    parseRunningTotals(data) {
        const totals = {};
        
        data.forEach((row) => {
            if (row[0]) {
                const label = row[0].trim();
                
                if (label.includes('API Spend')) totals.apiSpend = row[1]?.trim();
                if (label.includes('Fixed Costs')) totals.fixedCosts = row[1]?.trim();
                if (label.includes('GRAND TOTAL')) totals.grandTotal = row[3]?.trim();
                if (label.includes('Daily Average (all)')) totals.dailyAvgAll = row[1]?.trim();
                if (label.includes('Daily Average (API)')) totals.dailyAvgApi = row[1]?.trim();
            }
        });

        return totals;
    }

    /**
     * Generate HTML for the financial widget
     */
    generateHTML(data) {
        const dashboard = data.dashboard;
        const totals = data.runningTotals;
        const status = dashboard.status || '✅';

        return `
<div class="financial-widget">
    <div class="widget-header">
        <h2>💰 Financial Status</h2>
        <span class="status ${status.includes('✅') ? 'healthy' : 'warning'}">${status}</span>
        <span class="last-update">Updated: ${data.lastUpdate}</span>
    </div>

    <div class="widget-grid">
        <!-- Quick Stats -->
        <div class="stat-card">
            <div class="stat-label">Today's Total</div>
            <div class="stat-value">${dashboard.todayTotal || '$-'}</div>
            <div class="stat-sublabel">API + Fixed</div>
        </div>

        <div class="stat-card">
            <div class="stat-label">YTD Total</div>
            <div class="stat-value">${dashboard.ytdTotal || '$-'}</div>
            <div class="stat-sublabel">Jan 1 - Today</div>
        </div>

        <div class="stat-card">
            <div class="stat-label">Daily Average</div>
            <div class="stat-value">${dashboard.dailyAverage || '$-'}</div>
            <div class="stat-sublabel">w/ fixed costs</div>
        </div>

        <div class="stat-card">
            <div class="stat-label">API Budget</div>
            <div class="stat-value">$5.00</div>
            <div class="stat-sublabel">daily limit</div>
        </div>
    </div>

    <!-- Breakdown -->
    <div class="breakdown">
        <div class="breakdown-section">
            <h3>API Costs</h3>
            <ul>
                <li><span class="label">OpenRouter:</span> <span class="value">${dashboard.openrouterYtd || '$-'}</span></li>
                <li><span class="label">Anthropic:</span> <span class="value">${dashboard.anthropicYtd || '$-'}</span></li>
            </ul>
        </div>

        <div class="breakdown-section">
            <h3>YTD Totals</h3>
            <ul>
                <li><span class="label">API Spend:</span> <span class="value">${totals.apiSpend || '$-'}</span></li>
                <li><span class="label">Fixed Costs:</span> <span class="value">${totals.fixedCosts || '$-'}</span></li>
                <li><span class="label"><strong>Grand Total:</strong></span> <span class="value strong">${totals.grandTotal || '$-'}</span></li>
            </ul>
        </div>
    </div>

    <!-- Budget Status -->
    <div class="budget-status">
        <div class="budget-bar">
            <div class="budget-fill" style="width: ${this.calculateBudgetPercent(dashboard.todayTotal)}%"></div>
        </div>
        <div class="budget-label">
            <span>Daily API: ${dashboard.todayTotal || '$-'} / $5.00</span>
            <span class="budget-percent">${this.calculateBudgetPercent(dashboard.todayTotal)}%</span>
        </div>
    </div>

    <div class="widget-footer">
        <p>📊 Data from <a href="https://docs.google.com/spreadsheets/d/${this.spreadsheetId}" target="_blank">Mission Control Dashboard</a></p>
        <p>🔄 Auto-updates every 5 minutes | Cost data updated daily at 8:00 AM ET</p>
    </div>
</div>
        `;
    }

    /**
     * Calculate budget percentage from cost value
     */
    calculateBudgetPercent(costStr) {
        if (!costStr) return 0;
        const cost = parseFloat(costStr.replace('$', '').replace(',', ''));
        return Math.min(100, Math.round((cost / 5.0) * 100));
    }

    /**
     * Default data if fetch fails
     */
    getDefaultData() {
        return {
            dashboard: {
                todayTotal: '$-',
                ytdTotal: '$545.86',
                dailyAverage: '$2.25',
                openrouterYtd: '$21.60',
                anthropicYtd: '$107.85',
                status: '⚠️ Loading...'
            },
            runningTotals: {
                apiSpend: '$129.45',
                fixedCosts: '$416.41',
                grandTotal: '$545.86',
                dailyAvgAll: '$2.25/day',
                dailyAvgApi: '$1.52/day'
            },
            lastUpdate: 'Loading...'
        };
    }

    /**
     * Start auto-refresh
     */
    startAutoRefresh(callback) {
        // Initial load
        this.fetchData().then(callback);

        // Refresh every 5 minutes
        setInterval(() => {
            this.fetchData().then(callback);
        }, this.refreshInterval);
    }
}

// Export for use in HTML
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FinancialWidget;
}
