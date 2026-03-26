/**
 * KR Progress Widget
 * Displays Q2 2026 Key Results and learning phase milestones
 */

class KRWidget {
    constructor() {
        this.dataUrl = './kr-data.json';
    }

    /**
     * Fetch KR data
     */
    async fetchData() {
        try {
            const response = await fetch(this.dataUrl);
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error('Failed to fetch KR data:', error);
        }
        return this.getDefaultData();
    }

    /**
     * Default KR data if fetch fails
     */
    getDefaultData() {
        return {
            quarter: 'Q2 2026',
            phase: 'Learning Phase',
            status: 'Planning',
            krs: [
                {
                    id: 'KR-1',
                    title: 'Deploy 3 N8N Workflows',
                    current: '0',
                    target: '3',
                    progress: 0,
                    status: 'not-started',
                    dueDate: '2026-04-30'
                },
                {
                    id: 'KR-2',
                    title: 'Launch 1 OpenClaw Agent Pilot',
                    current: '0',
                    target: '1',
                    progress: 0,
                    status: 'not-started',
                    dueDate: '2026-04-30'
                },
                {
                    id: 'KR-3',
                    title: 'Amber Validation & Sign-Off',
                    current: '0%',
                    target: 'Complete',
                    progress: 0,
                    status: 'blocked',
                    dueDate: '2026-05-31'
                },
                {
                    id: 'KR-4',
                    title: 'First Paying Customer (Tier 1A)',
                    current: '0',
                    target: '1',
                    progress: 0,
                    status: 'not-started',
                    dueDate: '2026-06-30'
                }
            ],
            lastUpdated: 'Loading...'
        };
    }

    /**
     * Get status badge color
     */
    getStatusColor(status) {
        switch(status) {
            case 'on-track': return '#44FF44'; // Green
            case 'in-progress': return '#FFAA00'; // Orange
            case 'at-risk': return '#FF6666'; // Red
            case 'blocked': return '#FF4444'; // Dark red
            case 'not-started': return '#888888'; // Gray
            default: return '#888888';
        }
    }

    /**
     * Get status emoji
     */
    getStatusEmoji(status) {
        switch(status) {
            case 'on-track': return '✅';
            case 'in-progress': return '🟡';
            case 'at-risk': return '🔴';
            case 'blocked': return '🚫';
            case 'not-started': return '⬜';
            default: return '❓';
        }
    }

    /**
     * Generate HTML for KR widget
     */
    generateHTML(data) {
        const krs = data.krs || [];
        const onTrack = krs.filter(kr => kr.status === 'on-track').length;
        const inProgress = krs.filter(kr => kr.status === 'in-progress').length;
        const blocked = krs.filter(kr => kr.status === 'blocked').length;
        const notStarted = krs.filter(kr => kr.status === 'not-started').length;

        let krCardsHtml = krs.map(kr => {
            const statusEmoji = this.getStatusEmoji(kr.status);
            const progressPercent = kr.progress || 0;
            
            return `
<div class="kr-card">
    <div class="kr-header">
        <span class="kr-emoji">${statusEmoji}</span>
        <h4 class="kr-title">${kr.title}</h4>
        <span class="kr-progress-text">${kr.current}/${kr.target}</span>
    </div>
    
    <div class="kr-progress-bar">
        <div class="kr-fill" style="width: ${progressPercent}%; background-color: ${this.getStatusColor(kr.status)}"></div>
    </div>
    
    <div class="kr-footer">
        <span class="kr-due">📅 ${kr.dueDate}</span>
        <span class="kr-status" style="color: ${this.getStatusColor(kr.status)}">${kr.status.toUpperCase()}</span>
    </div>
</div>
            `;
        }).join('');

        return `
<div class="kr-widget">
    <div class="widget-header">
        <h2>🎯 Q2 2026 Key Results</h2>
        <span class="phase-badge">${data.phase}</span>
        <span class="last-update">Updated: ${data.lastUpdated}</span>
    </div>

    <!-- Summary Stats -->
    <div class="kr-summary">
        <div class="summary-stat">
            <span class="stat-emoji">✅</span>
            <div>
                <div class="stat-count">${onTrack}</div>
                <div class="stat-label">On Track</div>
            </div>
        </div>
        <div class="summary-stat">
            <span class="stat-emoji">🟡</span>
            <div>
                <div class="stat-count">${inProgress}</div>
                <div class="stat-label">In Progress</div>
            </div>
        </div>
        <div class="summary-stat">
            <span class="stat-emoji">🚫</span>
            <div>
                <div class="stat-count">${blocked}</div>
                <div class="stat-label">Blocked</div>
            </div>
        </div>
        <div class="summary-stat">
            <span class="stat-emoji">⬜</span>
            <div>
                <div class="stat-count">${notStarted}</div>
                <div class="stat-label">Not Started</div>
            </div>
        </div>
    </div>

    <!-- KR Cards -->
    <div class="kr-cards">
        ${krCardsHtml}
    </div>

    <!-- Timeline -->
    <div class="kr-timeline">
        <div class="timeline-section">
            <h4>📆 April — Deploy & Learn</h4>
            <ul>
                <li>Apr 1: Kick off N8N workflows</li>
                <li>Apr 15: First workflow deployed</li>
                <li>Apr 30: All 3 workflows + agent running</li>
            </ul>
        </div>
        <div class="timeline-section">
            <h4>📆 May — Validate & Refine</h4>
            <ul>
                <li>May 1-31: Amber review & sign-off</li>
                <li>May 15: ROI metrics analyzed</li>
                <li>May 30: Delivery process refined</li>
            </ul>
        </div>
        <div class="timeline-section">
            <h4>📆 June — Soft Launch</h4>
            <ul>
                <li>Jun 1: First paying customer</li>
                <li>Jun 30: Q2 results documented</li>
                <li>Jul 1: Scale planning begins</li>
            </ul>
        </div>
    </div>

    <div class="widget-footer">
        <p>🎯 Learning-first approach: April tests, May validates, June launches</p>
        <p>📊 Track progress at: <a href="https://github.com/users/enterprisesrobie-prog/projects/1" target="_blank">RobieE Command Board</a></p>
    </div>
</div>
        `;
    }
}

// Export for use in HTML
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KRWidget;
}
