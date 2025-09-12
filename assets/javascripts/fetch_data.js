const MODRINTH_API = {
    USER: 'https://api.modrinth.com/v2/user/zhengzhengyiyi',
    USER_PROJECTS: 'https://api.modrinth.com/v2/user/zhengzhengyiyi/projects',
    PROJECTS: 'https://api.modrinth.com/v2/projects'
};

function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function calculateMonthsSinceJoined(createdAt) {
    const joinDate = new Date(createdAt);
    const now = new Date();
    const months = (now.getFullYear() - joinDate.getFullYear()) * 12 + 
                (now.getMonth() - joinDate.getMonth());
    return Math.max(1, months);
}

function getRelativeTimeString(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
}

async function fetchUserData() {
    try {
        const response = await fetch(MODRINTH_API.USER);
        if (!response.ok) throw new Error('Failed to fetch user data');
        return await response.json();
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
}

async function fetchUserProjects() {
    try {
        const response = await fetch(MODRINTH_API.USER_PROJECTS);
        if (!response.ok) throw new Error('Failed to fetch projects');
        const projects = await response.json();
        return projects.map(project => project.id || project.slug);
    } catch (error) {
        console.error('Error fetching projects:', error);
        throw error;
    }
}

async function fetchProjectDetails(projectIds) {
    try {
        const idsParam = encodeURIComponent(JSON.stringify(projectIds));
        const url = `${MODRINTH_API.PROJECTS}?ids=${idsParam}`;
        
        console.log('Fetching project details from:', url);
        
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'zhengzhengyiyi.github.io (your-email@example.com)'
            }
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error:', response.status, errorText);
            throw new Error(`API returned ${response.status}: ${errorText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching project details:', error);
        throw error;
    }
}

function updateUserStats(userData, totalDownloads) {
    const statsGrid = document.getElementById('userStats');
    if (!statsGrid) return;
    
    const monthsOnModrinth = calculateMonthsSinceJoined(userData.created);
    const projectCount = userData.projects ? userData.projects.length : 0;
    
    statsGrid.innerHTML = `
        <div class="stat-card">
            <div class="stat-number">${projectCount}</div>
            <div class="stat-label">Total Projects</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${formatNumber(totalDownloads)}</div>
            <div class="stat-label">Total Downloads</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${monthsOnModrinth}</div>
            <div class="stat-label">Months on Modrinth</div>
        </div>
    `;
}

function updateProjectsList(projects) {
    const projectsList = document.getElementById('projectsList');
    const loadingElement = document.getElementById('projectsLoading');
    
    if (!projectsList || !loadingElement) return;
    
    const sortedProjects = projects.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
    
    projectsList.innerHTML = sortedProjects.map(project => `
        <li class="project-item">
            <div class="project-name">${project.title || 'Unknown Project'}</div>
            <div class="project-stats">
                ${formatNumber(project.downloads || 0)} downloads • 
                ${project.followers || 0} followers • 
                Updated ${getRelativeTimeString(project.updated || project.date_created || new Date())}
            </div>
        </li>
    `).join('');
    
    loadingElement.style.display = 'none';
    projectsList.style.display = 'block';
}

async function initModrinthData() {
    try {
        console.log('Starting Modrinth data initialization...');
        
        const userData = await fetchUserData();
        console.log('User data received:', userData);
        
        const projectIds = await fetchUserProjects();
        console.log('Project IDs received:', projectIds);
        
        if (!projectIds || projectIds.length === 0) {
            throw new Error('No projects found for this user');
        }
        
        const projects = await fetchProjectDetails(projectIds);
        console.log('Project details received:', projects);
        
        const totalDownloads = projects.reduce((sum, project) => sum + (project.downloads || 0), 0);
        
        updateUserStats(userData, totalDownloads);
        updateProjectsList(projects);
        
    } catch (error) {
        console.error('Error in initModrinthData:', error);
        const loadingElement = document.getElementById('projectsLoading');
        if (loadingElement) {
            loadingElement.innerHTML = 'Failed to load data. Please check console for details.';
            loadingElement.style.color = '#e74c3c';
        }
    }
}

document.addEventListener('DOMContentLoaded', initModrinthData);
