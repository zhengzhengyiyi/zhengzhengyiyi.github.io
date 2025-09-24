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

function getProjectGroupId(artifactId) {
    const project = projects[artifactId];
    return project ? project.groupId : "io.github.zhengzhengyiyi";
}

function createJavadocCardsContainer(containerId = "javadoc-cards-container") {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with id "${containerId}" not found`);
        return;
    }
    
    container.innerHTML = '';
    
    Object.entries(projects).forEach(([artifactId, project]) => {
        const card = document.createElement('div');
        card.className = "javadoc-card";
        card.onclick = () => {
            openJavadocViewer(artifactId, project.version);
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

function createJavadocWindow(location, windowOptions = {}) {
    const parts = location.split(':');
    let groupId = parts[0];
    const artifactId = parts[1];
    const version = parts[2] || '';
    
    if (!groupId && artifactId) {
        groupId = getProjectGroupId(artifactId);
    }
    
    let url = `https://javadoc.io/doc/${groupId}/${artifactId}`;
    if (version) {
        url += `/${version}`;
    }
    
    const defaultOptions = {
        width: 1200,
        height: 800,
        left: (screen.width - 1200) / 2,
        top: (screen.height - 800) / 2,
        menubar: 'no',
        toolbar: 'no',
        location: 'no',
        status: 'no',
        resizable: 'yes',
        scrollbars: 'yes'
    };
    
    const options = { ...defaultOptions, ...windowOptions };
    const optionsString = Object.entries(options)
        .map(([key, value]) => `${key}=${value}`)
        .join(',');
    
    const newWindow = window.open(url, `javadoc_${groupId}_${artifactId}`, optionsString);
    
    if (newWindow) {
        newWindow.focus();
        return newWindow;
    } else {
        alert('Popup window blocked. Please allow popups for this site.');
        return null;
    }
}