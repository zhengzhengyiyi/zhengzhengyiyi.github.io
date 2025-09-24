const projects = {
    "config_editor": {
        name: "Config Editor",
        description: "A configuration editor library",
        version: "1.0.0",
        mcVersion: "MC 1.20.1+",
        groupId: "io.github.zhengzhengyiyi"
    },
    "debughelper": {
        name: "Debug Helper",
        description: "A helper for debug",
        version: "1.0.4",
        mcVersion: "MC 1.20.1+",
        groupId: "io.github.zhengzhengyiyi.tweak_api"
    },
    "tweak": {
        name: "Tweak API",
        description: "API for Minecraft modding",
        version: "1.0.3-1.21.5",
        mcVersion: "MC 1.21.5",
        groupId: "io.github.zhengzhengyiyi.tweak_api"
    },
    "lazyboost": {
        name: "Lazy Boost",
        description: "Performance optimization library",
        version: "1.0.5",
        mcVersion: "MC 1.20.1+",
        groupId: "io.github.zhengzhengyiyi"
    }
};

function load_javadoc(artifactId, version = null) {
    const project = projects[artifactId];
    if (!project) {
        console.error(`Project not found: ${artifactId}`);
        return null;
    }
    
    const groupId = project.groupId;
    const actualVersion = version || project.version;
    
    const location = `${groupId}:${artifactId}:${actualVersion}`;
    return createJavadocWindow(location, {
        width: 1400,
        height: 900,
        left: 100,
        top: 100
    });
}

function createJavadocCardsContainer(containerId = "javadoc-cards-container") {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with id "${containerId}" not found`);
        return;
    }
    
    container.innerHTML = '';
    
    Object.entries(projects).forEach(([artifactId, project]) => {
        const card = document.createElement('a');
        card.href = "#";
        card.className = "javadoc-card";
        card.onclick = (e) => {
            e.preventDefault();
            load_javadoc(artifactId);
        };
        
        card.innerHTML = `
            <div>
                <h3 class="card-title">${project.name}</h3>
                <p class="card-description">${project.description}</p>
            </div>
            <div class="card-meta">
                <span class="version-badge">v${project.version}</span>
                <span class="mc-version">${project.mcVersion}</span>
                <span class="view-button">View Docs</span>
            </div>
        `;
        
        container.appendChild(card);
    });
}

function getAllProjectNames() {
    return Object.keys(projects);
}

function getProjectInfo(artifactId) {
    return projects[artifactId];
}

function loadLatestJavadoc(artifactId) {
    return load_javadoc(artifactId, null);
}

function batchOpenAllJavadocs() {
    const windows = [];
    Object.keys(projects).forEach(artifactId => {
        const win = load_javadoc(artifactId);
        if (win) {
            windows.push(win);
        }
    });
    return windows;
}

function searchProjects(keyword) {
    keyword = keyword.toLowerCase();
    return Object.entries(projects)
        .filter(([artifactId, project]) => 
            artifactId.toLowerCase().includes(keyword) ||
            project.name.toLowerCase().includes(keyword) ||
            project.description.toLowerCase().includes(keyword)
        )
        .map(([artifactId, project]) => ({ artifactId, ...project }));
}
