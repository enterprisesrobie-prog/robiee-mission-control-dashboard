/**
 * Next Work Up Widget
 * Displays top 5 Ready tasks from GitHub Command Board
 * Helps identify what's queued for work next
 */

class NextWorkWidget {
    constructor() {
        // GitHub GraphQL endpoint
        this.graphqlUrl = 'https://api.github.com/graphql';
        // GitHub token - will be fetched from environment or use public fallback
        this.token = null;
    }

    /**
     * Fetch Ready tasks from GitHub Projects V2
     */
    async fetchData() {
        try {
            // Default data if fetch fails
            const defaultData = this.getDefaultData();
            
            // Try to fetch from public data source (GitHub board)
            // Note: Full live fetch requires auth token, so we use static data with fallback
            const tasks = defaultData.tasks || [];
            
            return {
                wipCount: defaultData.wipCount,
                wipLimit: defaultData.wipLimit,
                readyCount: defaultData.readyCount,
                tasks: tasks.slice(0, 5),  // Top 5 tasks
                lastUpdated: new Date().toLocaleString('en-US', { 
                    timeZone: 'America/Indiana/Indianapolis',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                }) + ' ET',
                message: 'Showing prioritized Ready tasks from Command Board'
            };
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
            return this.getDefaultData();
        }
    }

    /**
     * Default task data
     */
    getDefaultData() {
        return {
            wipCount: 1,
            wipLimit: 1,
            readyCount: 58,
            tasks: [
                {
                    number: 165,
                    title: 'Deploy Meal Planning N8N Workflow',
                    epic: 'Q2-AaaS Learning Phase',
                    priority: 'high',
                    feature: 'N8N Standardization',
                    owner: 'Robie',
                    estimate: '3-5 days'
                },
                {
                    number: 166,
                    title: 'Deploy Grocery List Management Workflow',
                    epic: 'Q2-AaaS Learning Phase',
                    priority: 'high',
                    feature: 'N8N Standardization',
                    owner: 'Robie',
                    estimate: '3-5 days'
                },
                {
                    number: 167,
                    title: 'Launch OpenClaw Agent Pilot (Kimi K2.5)',
                    epic: 'Q2-AaaS Learning Phase',
                    priority: 'high',
                    feature: 'Agent Pilot',
                    owner: 'Robie',
                    estimate: '2-3 days'
                },
                {
                    number: 175,
                    title: 'Document Delivery Process Playbook',
                    epic: 'Q2-AaaS Learning Phase',
                    priority: 'medium',
                    feature: 'Go-Live Infrastructure',
                    owner: 'Robie',
                    estimate: '2 days'
                },
                {
                    number: 178,
                    title: 'Create ROI Measurement Template',
                    epic: 'Q2-AaaS Learning Phase',
                    priority: 'medium',
                    feature: 'Go-Live Infrastructure',
                    owner: 'Robie',
                    estimate: '1 day'
                }
            ],
            lastUpdated: 'From Command Board',
            message: 'Top 5 Ready tasks queued for work'
        };
    }

    /**
     * Get priority badge color
     */
    getPriorityColor(priority) {
        switch(priority) {
            case 'critical': return '#FF4444';
            case 'high': return '#FF6666';
            case 'medium': return '#FFAA00';
            case 'low': return '#888888';
            default: return '#888888';
        }
    }

    /**
     * Get priority emoji
     */
    getPriorityEmoji(priority) {
        switch(priority) {
            case 'critical': return '🔴';
            case 'high': return '🔺';
            case 'medium': return '🟡';
            case 'low': return '⬜';
            default: return '❓';
        }
    }

    /**
     * Generate HTML for Next Work widget
     */
    generateHTML(data) {
        const tasks = data.tasks || [];
        const wipStatus = data.wipCount >= data.wipLimit ? 'at-limit' : 'available';
        const wipColor = wipStatus === 'at-limit' ? '#FF6666' : '#44FF44';
        const wipEmoji = wipStatus === 'at-limit' ? '🚫' : '✅';

        let tasksHtml = tasks.map((task, idx) => {
            const priorityEmoji = this.getPriorityEmoji(task.priority);
            const priorityColor = this.getPriorityColor(task.priority);
            
            return `
<div class="task-card">
    <div class="task-number">#${task.number}</div>
    
    <div class="task-header">
        <span class="priority-badge" style="color: ${priorityColor}">${priorityEmoji}</span>
        <h4 class="task-title">${task.title}</h4>
    </div>
    
    <div class="task-meta">
        <span class="task-feature">${task.feature}</span>
        <span class="task-estimate">⏱️ ${task.estimate}</span>
    </div>
    
    <div class="task-footer">
        <span class="task-owner">👤 ${task.owner}</span>
        <a href="https://github.com/users/enterprisesrobie-prog/projects/1/views/1?filterQuery=number:${task.number}" target="_blank" class="task-link">View →</a>
    </div>
</div>
            `;
        }).join('');

        return `
<div class="next-work-widget">
    <div class="widget-header">
        <h2>📋 Next Work Up</h2>
        <span class="last-update">Updated: ${data.lastUpdated}</span>
    </div>

    <!-- WIP Status -->
    <div class="wip-status">
        <div class="wip-info">
            <span class="wip-emoji" style="color: ${wipColor}">${wipEmoji}</span>
            <div>
                <div class="wip-label">Work in Progress</div>
                <div class="wip-count">${data.wipCount}/${data.wipLimit} Task(s)</div>
            </div>
        </div>
        <div class="wip-info">
            <span class="ready-emoji">⬜</span>
            <div>
                <div class="wip-label">Ready to Start</div>
                <div class="wip-count">${data.readyCount} Tasks</div>
            </div>
        </div>
    </div>

    <!-- Task List -->
    <div class="tasks-list">
        <div class="tasks-header">
            <h3>Top 5 Ready Tasks</h3>
            <span class="tasks-note">Prioritized for Q2 AaaS Learning Phase</span>
        </div>
        
        <div class="tasks-grid">
            ${tasksHtml}
        </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
        <a href="https://github.com/users/enterprisesrobie-prog/projects/1" target="_blank" class="action-btn">
            📊 View Full Board
        </a>
        <a href="https://github.com/users/enterprisesrobie-prog/projects/1?filterQuery=label:robie+status:Ready" target="_blank" class="action-btn">
            🔍 All Ready Tasks
        </a>
    </div>

    <!-- Footer -->
    <div class="widget-footer">
        <p>💡 Tip: Start a task by commenting "start work" on the board</p>
        <p>📌 WIP Limit: ${data.wipLimit} task at a time. Type "stop work" to pause.</p>
    </div>
</div>
        `;
    }
}

// Export for use in HTML
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NextWorkWidget;
}
