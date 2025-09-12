function formatNumber(num){
if(num>=1000){return(num/1000).toFixed(1)+'K';}
return num.toString();}

function getRelativeTimeString(dateString){
const date=new Date(dateString);
const now=new Date();
const diffTime=Math.abs(now-date);
const diffDays=Math.floor(diffTime/(1000*60*60*24));
if(diffDays===0)return'today';
if(diffDays===1)return'yesterday';
if(diffDays<7)return`${diffDays} days ago`;
if(diffDays<30)return`${Math.floor(diffDays/7)} weeks ago`;
return`${Math.floor(diffDays/30)} months ago`;}

function displayProjectsGrid(projects){
const projectsGrid=document.getElementById('projectsGrid');
const loadingElement=document.getElementById('projectsLoading');
const errorElement=document.getElementById('projectsError');
if(!projectsGrid||!loadingElement)return;
const sortedProjects=projects.sort((a,b)=>(b.downloads||0)-(a.downloads||0));
projectsGrid.innerHTML=sortedProjects.map(project=>`
<div class="project-card">
<h3 class="project-title">${project.title||'Unknown Project'}</h3>
<p class="project-description">${project.description||'No description available.'}</p>
<div class="project-stats">
<div class="stat-item">
<div class="stat-number">${formatNumber(project.downloads||0)}</div>
<div class="stat-label">Downloads</div>
</div>
<div class="stat-item">
<div class="stat-number">${project.followers||0}</div>
<div class="stat-label">Followers</div>
</div>
<div class="stat-item">
<div class="stat-number">${project.versions?project.versions.length:0}</div>
<div class="stat-label">Versions</div>
</div>
</div>
<p class="last-updated">Updated ${getRelativeTimeString(project.updated||project.date_created||new Date())}</p>
<a href="https://modrinth.com/project/${project.slug||project.id}" class="project-link" target="_blank">View on Modrinth</a>
</div>`).join('');
loadingElement.style.display='none';
projectsGrid.style.display='grid';}

function handleProjectsError(error){
console.error('Projects display error:',error);
const loadingElement=document.getElementById('projectsLoading');
const errorElement=document.getElementById('projectsError');
if(loadingElement)loadingElement.style.display='none';
if(errorElement)errorElement.style.display='block';}

async function initProjectsPage(){
try{
console.log('Initializing projects page...');
const projectIds=await fetchUserProjects();
if(!projectIds||projectIds.length===0)throw new Error('No projects found');
const projects=await fetchProjectDetails(projectIds);
displayProjectsGrid(projects);}
catch(error){handleProjectsError(error);}}

document.addEventListener('DOMContentLoaded',function(){
if(document.getElementById('projectsGrid')){
initProjectsPage();}});