/**
 * Mission Control Dashboard — Financial Widget
 * Fetches cost data from local data.json (updated daily by cron)
 */

class FinancialWidget {
    constructor() {
        this.dataUrl = './data.json';
        this.refreshInterval = 5 * 60 * 1000; // Refresh every 5 minutes
        console.log('✅ FinancialWidget initialized, dataUrl:', this.dataUrl);
    }

    /**
     * Fetch financial data from local JSON file
     */
    async fetchData() {
        try {
            console.log('📡 Fetching data from:', this.dataUrl);
            const response = await fetch(this.dataUrl, {
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            });
            
            console.log('Response status:', response.status, response.statusText);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('✅ Data loaded successfully:', data);
            return data;
        } catch (error) {
            console.error('❌ Failed to fetch data:', error);
            const defaultData = this.getDefaultData();
            console.log('Using default data:', defaultData);
            return defaultData;
        }
    }

    /**
     * Default data if fetch fails
     */
    getDefaultData() {
        return {
            dashboard: {
                todayTotal: '$3.33',
                ytdTotal: '$545.86',
                dailyAverage: '$2.25',
                openrouterYtd: '$21.60',
                anthropicYtd: '$107.85',
                status: '✅'
            },
            runningTotals: {
                apiSpend: '$129.45',
                fixedCosts: '$416.41',
                grandTotal: '$545.86',
                dailyAvgAll: '$2.25/day',
                dailyAvgApi: '$1.52/day'
            },
            lastUpdate: '(default data - unable to load from server)'
        };
    }

    /**
     * Generate HTML for the financial widget
     */
    generateHTML(data) {
        const dashboard = data.dashboard || {};
        const totals = data.runningTotals || {};
        const status = dashboard.status || '✅';

        return `
<div class="financial-widget">
    <div class="widget-header">
        <h2>💰 Financial Status</h2>
        <span class="status ${status.includes('✅') ? 'healthy' : 'warning'}">${status}</span>
        <span class="last-update">Updated: ${data.lastUpdate || 'Loading...'}</span>
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
        <p>📊 Data from <a href="https://docs.google.com/spreadsheets/d/1OH2rnWQaAkxCX-vb42y5uDk91rROQ7jzxNrGHTwz3Lw" target="_blank">Mission Control Dashboard (Google Sheet)</a></p>
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
     * Start auto-refresh
     */
    startAutoRefresh(callback) {
        console.log('🔄 Starting auto-refresh (every 5 minutes)');
        
        // Initial load
        this.fetchData().then(data => {
            console.log('Initial data loaded, rendering...');
            callback(data);
        }).catch(err => {
            console.error('Initial load failed:', err);
            callback(this.getDefaultData());
        });

        // Refresh every 5 minutes
        setInterval(() => {
            console.log('🔄 Auto-refresh tick...');
            this.fetchData().then(callback).catch(err => {
                console.error('Refresh failed:', err);
            });
        }, this.refreshInterval);
    }
}

// Export for use in HTML
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FinancialWidget;
}
