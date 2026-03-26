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
     * Generate HTML for a single KR card
     */
    generateKRCard(kr) {
        const statusEmoji = this.getStatusEmoji(kr.status);
        const progressPercent = kr.progress || 0;
        const dateLabel = kr.completedDate || kr.dueDate || '—';
        
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
        <span class="kr-due">📅 ${dateLabel}</span>
        <span class="kr-status" style="color: ${this.getStatusColor(kr.status)}">${kr.status.toUpperCase()}</span>
    </div>
</div>
        `;
    }

    /**
     * Generate HTML for KR widget
     */
    generateHTML(data) {
        // Q1 Section
        const q1 = data.q1 || {};
        const q1Krs = q1.krs || [];
        const q1Complete = q1Krs.filter(kr => kr.status === 'complete').length;

        // Q2 Section
        const q2 = data.q2 || {};
        const q2Krs = q2.krs || [];
        const q2OnTrack = q2Krs.filter(kr => kr.status === 'on-track').length;
        const q2InProgress = q2Krs.filter(kr => kr.status === 'in-progress').length;
        const q2Blocked = q2Krs.filter(kr => kr.status === 'blocked').length;
        const q2NotStarted = q2Krs.filter(kr => kr.status === 'not-started').length;

        const q1CardsHtml = q1Krs.map(kr => this.generateKRCard(kr)).join('');
        const q2CardsHtml = q2Krs.map(kr => this.generateKRCard(kr)).join('');

        return `
<div class="kr-widget">
    <div class="widget-header">
        <h2>🎯 Key Results 2026</h2>
        <span class="last-update">Updated: ${data.lastUpdated}</span>
    </div>

    <!-- Q1 Section -->
    <div class="kr-section">
        <div class="kr-section-header">
            <h3>Q1 2026 — Foundation & Stability ✅ COMPLETE</h3>
            <span class="section-badge complete">${q1Complete}/${q1Krs.length} KRs Complete</span>
        </div>
        <div class="kr-cards">
            ${q1CardsHtml}
        </div>
    </div>

    <!-- Divider -->
    <div class="kr-divider"></div>

    <!-- Q2 Section -->
    <div class="kr-section">
        <div class="kr-section-header">
            <h3>Q2 2026 — Learning Phase 🟡 IN PROGRESS</h3>
            <span class="phase-badge">${q2.phase}</span>
        </div>

        <!-- Summary Stats for Q2 -->
        <div class="kr-summary">
            <div class="summary-stat">
                <span class="stat-emoji">✅</span>
                <div>
                    <div class="stat-count">${q2OnTrack}</div>
                    <div class="stat-label">On Track</div>
                </div>
            </div>
            <div class="summary-stat">
                <span class="stat-emoji">🟡</span>
                <div>
                    <div class="stat-count">${q2InProgress}</div>
                    <div class="stat-label">In Progress</div>
                </div>
            </div>
            <div class="summary-stat">
                <span class="stat-emoji">🚫</span>
                <div>
                    <div class="stat-count">${q2Blocked}</div>
                    <div class="stat-label">Blocked</div>
                </div>
            </div>
            <div class="summary-stat">
                <span class="stat-emoji">⬜</span>
                <div>
                    <div class="stat-count">${q2NotStarted}</div>
                    <div class="stat-label">Not Started</div>
                </div>
            </div>
        </div>

        <!-- KR Cards -->
        <div class="kr-cards">
            ${q2CardsHtml}
        </div>

        <!-- Q2 Timeline -->
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
    </div>

    <div class="widget-footer">
        <p>📈 Q1: Foundation laid ✅ | Q2: Learning phase 🟡 | Q3: Scale 📊</p>
        <p>🔗 Track progress: <a href="https://github.com/users/enterprisesrobie-prog/projects/1" target="_blank">RobieE Command Board</a></p>
    </div>
</div>
        `;
    }
}

// Export for use in HTML
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KRWidget;
}
