// Admin CMS - Content Management System
const AdminCMS = {
    currentSection: 'profile',
    hasUnsavedChanges: false,
    editingSkillId: null,
    editingProjectId: null,
    editingExperienceId: null,
    
    init() {
        this.setupNavigation();
        this.setupLogout();
        this.setupFormListeners();
        this.loadAllData();
        this.setupUnsavedWarning();
    },
    
    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const section = item.dataset.section;
                this.switchSection(section);
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
            });
        });
    },
    
    switchSection(section) {
        document.querySelectorAll('.cms-section').forEach(sec => {
            sec.style.display = 'none';
        });
        document.getElementById(section + 'Section').style.display = 'block';
        const titles = {
            profile: 'Profile Editor',
            skills: 'Skills Manager',
            projects: 'Projects Manager',
            experience: 'Experience Timeline',
            contact: 'Contact Settings',
            settings: 'Site Settings',
            data: 'Data Management'
        };
        document.getElementById('pageTitle').textContent = titles[section] || 'Dashboard';
        this.currentSection = section;
    },
    
    setupLogout() {
        document.getElementById('logoutBtn').addEventListener('click', () => {
            AdminAuth.logout();
        });
    },
    
    setupFormListeners() {
        document.querySelectorAll('.form-control').forEach(input => {
            input.addEventListener('input', () => {
                this.hasUnsavedChanges = true;
            });
        });
    },
    
    setupUnsavedWarning() {
        window.addEventListener('beforeunload', (e) => {
            if (this.hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = '';
            }
        });
    },
    
    loadAllData() {
        this.loadProfile();
        this.loadSkills();
        this.loadProjects();
        this.loadExperience();
        this.loadContact();
        this.loadSettings();
    },
    
    // Profile
    loadProfile() {
        const profile = SiteData.get('profile');
        document.getElementById('profileName').value = profile.name || '';
        document.getElementById('profileTitle').value = profile.title || '';
        document.getElementById('profileLocation').value = profile.location || '';
        document.getElementById('profileEmail').value = profile.email || '';
        document.getElementById('profileBio1').value = profile.bio || '';
        document.getElementById('profileBio2').value = profile.bio2 || '';
        document.getElementById('profileBio3').value = profile.bio3 || '';
        
        const avatarPreview = document.getElementById('avatarPreview');
        if (profile.avatar && profile.avatar.startsWith('data:')) {
            avatarPreview.src = profile.avatar;
            avatarPreview.style.display = 'block';
        } else {
            avatarPreview.style.display = 'none';
        }
        
        document.getElementById('avatarUpload').addEventListener('click', () => {
            document.getElementById('avatarInput').click();
        });
        document.getElementById('avatarInput').addEventListener('change', (e) => {
            this.handleImageUpload(e, 'avatar');
        });
    },
    
    saveProfile() {
        const avatarPreview = document.getElementById('avatarPreview');
        // FIX: Check if avatar is a valid base64 data URL, not a broken src check
        const avatarSrc = avatarPreview.src;
        const avatarData = (avatarSrc && avatarSrc.startsWith('data:')) ? avatarSrc : null;

        const profile = {
            name: document.getElementById('profileName').value,
            title: document.getElementById('profileTitle').value,
            location: document.getElementById('profileLocation').value,
            email: document.getElementById('profileEmail').value,
            bio: document.getElementById('profileBio1').value,
            bio2: document.getElementById('profileBio2').value,
            bio3: document.getElementById('profileBio3').value,
            avatar: avatarData
        };
        
        SiteData.save('profile', profile);
        this.hasUnsavedChanges = false;
        this.showToast('Profile saved successfully!');
    },
    
    // Skills
    loadSkills() {
        const skills = SiteData.get('skills');
        const list = document.getElementById('skillsList');
        list.innerHTML = skills.map(skill => `
            <div class="list-item" data-id="${skill.id}">
                <div class="drag-handle">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                </div>
                <div class="list-item-content">
                    <div class="list-item-title">${skill.name}</div>
                    <div class="list-item-subtitle">${skill.percentage}% proficiency</div>
                </div>
                <div class="list-item-actions">
                    <button class="btn btn-icon btn-secondary" onclick="AdminCMS.editSkill(${skill.id})">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button class="btn btn-icon btn-danger" onclick="AdminCMS.deleteSkill(${skill.id})">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                </div>
            </div>
        `).join('');
        this.setupSkillsDragDrop();
    },

    setupSkillsDragDrop() {
        const list = document.getElementById('skillsList');
        let draggedItem = null;
        list.querySelectorAll('.list-item').forEach(item => {
            item.draggable = true;
            item.addEventListener('dragstart', () => {
                draggedItem = item;
                item.style.opacity = '0.5';
            });
            item.addEventListener('dragend', () => {
                item.style.opacity = '1';
                draggedItem = null;
            });
            item.addEventListener('dragover', (e) => e.preventDefault());
            item.addEventListener('drop', (e) => {
                e.preventDefault();
                if (draggedItem && draggedItem !== item) {
                    this.reorderSkills(parseInt(draggedItem.dataset.id), parseInt(item.dataset.id));
                }
            });
        });
    },
    
    reorderSkills(fromId, toId) {
        let skills = SiteData.get('skills');
        const fromIndex = skills.findIndex(s => s.id === fromId);
        const toIndex = skills.findIndex(s => s.id === toId);
        if (fromIndex > -1 && toIndex > -1) {
            const [removed] = skills.splice(fromIndex, 1);
            skills.splice(toIndex, 0, removed);
            skills = skills.map((s, i) => ({ ...s, id: i + 1 }));
            SiteData.save('skills', skills);
            this.loadSkills();
            this.showToast('Skills reordered!');
        }
    },
    
    openSkillModal(skillId = null) {
        this.editingSkillId = skillId;
        const skill = skillId ? SiteData.get('skills').find(s => s.id === skillId) : null;
        document.getElementById('modalTitle').textContent = skillId ? 'Edit Skill' : 'Add Skill';
        document.getElementById('modalBody').innerHTML = `
            <div class="form-group" style="margin-bottom: 1rem;">
                <label class="form-label">Skill Name</label>
                <input type="text" class="form-control" id="skillName" value="${skill?.name || ''}" placeholder="e.g., React">
            </div>
            <div class="form-group">
                <label class="form-label">Proficiency</label>
                <div class="range-container">
                    <input type="range" class="range-slider" id="skillPercentage" min="0" max="100" value="${skill?.percentage || 50}">
                    <span class="range-value" id="skillPercentageValue">${skill?.percentage || 50}%</span>
                </div>
            </div>
        `;
        document.getElementById('skillPercentage').addEventListener('input', (e) => {
            document.getElementById('skillPercentageValue').textContent = e.target.value + '%';
        });
        document.getElementById('modalFooter').innerHTML = `
            <button class="btn btn-secondary" onclick="AdminCMS.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="AdminCMS.saveSkill()">${skillId ? 'Update' : 'Add'}</button>
        `;
        this.openModal();
    },
    
    editSkill(id) { this.openSkillModal(id); },
    
    saveSkill() {
        const name = document.getElementById('skillName').value.trim();
        const percentage = parseInt(document.getElementById('skillPercentage').value);
        if (!name) { this.showToast('Please enter a skill name', 'error'); return; }
        let skills = SiteData.get('skills');
        if (this.editingSkillId) {
            const index = skills.findIndex(s => s.id === this.editingSkillId);
            if (index > -1) skills[index] = { ...skills[index], name, percentage };
        } else {
            const newId = skills.length > 0 ? Math.max(...skills.map(s => s.id)) + 1 : 1;
            skills.push({ id: newId, name, percentage, icon: name.toLowerCase().replace(/\s+/g, '') });
        }
        SiteData.save('skills', skills);
        this.closeModal();
        this.loadSkills();
        this.showToast(this.editingSkillId ? 'Skill updated!' : 'Skill added!');
    },
    
    deleteSkill(id) {
        if (confirm('Are you sure you want to delete this skill?')) {
            let skills = SiteData.get('skills').filter(s => s.id !== id);
            SiteData.save('skills', skills);
            this.loadSkills();
            this.showToast('Skill deleted!');
        }
    },
    
    // Projects
    loadProjects() {
        const projects = SiteData.get('projects');
        const list = document.getElementById('projectsList');
        list.innerHTML = projects.map(project => `
            <div class="list-item" data-id="${project.id}">
                <div class="list-item-content">
                    <div class="list-item-title">${project.title}</div>
                    <div class="list-item-subtitle">${project.tags.join(', ')}</div>
                </div>
                <label class="toggle-switch" style="margin-right: 1rem;">
                    <input type="checkbox" ${project.visible ? 'checked' : ''} onchange="AdminCMS.toggleProjectVisibility(${project.id})">
                    <span class="toggle-slider"></span>
                </label>
                <div class="list-item-actions">
                    <button class="btn btn-icon btn-secondary" onclick="AdminCMS.editProject(${project.id})">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button class="btn btn-icon btn-danger" onclick="AdminCMS.deleteProject(${project.id})">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                </div>
            </div>
        `).join('');
    },
    
    openProjectModal(projectId = null) {
        this.editingProjectId = projectId;
        const project = projectId ? SiteData.get('projects').find(p => p.id === projectId) : null;
        document.getElementById('modalTitle').textContent = projectId ? 'Edit Project' : 'Add Project';
        const hasImage = project?.image && project.image.startsWith('data:');
        document.getElementById('modalBody').innerHTML = `
            <div class="form-group" style="margin-bottom: 1rem;">
                <label class="form-label">Project Title</label>
                <input type="text" class="form-control" id="projectTitle" value="${project?.title || ''}" placeholder="Project name">
            </div>
            <div class="form-group" style="margin-bottom: 1rem;">
                <label class="form-label">Description</label>
                <textarea class="form-control" id="projectDescription" rows="3">${project?.description || ''}</textarea>
            </div>
            <div class="form-group" style="margin-bottom: 1rem;">
                <label class="form-label">Tags (comma separated)</label>
                <input type="text" class="form-control" id="projectTags" value="${project?.tags?.join(', ') || ''}" placeholder="React, Three.js, WebGL">
            </div>
            <div class="form-group" style="margin-bottom: 1rem;">
                <label class="form-label">Live URL</label>
                <input type="url" class="form-control" id="projectLiveUrl" value="${project?.liveUrl || ''}" placeholder="https://...">
            </div>
            <div class="form-group" style="margin-bottom: 1rem;">
                <label class="form-label">GitHub URL</label>
                <input type="url" class="form-control" id="projectGithubUrl" value="${project?.githubUrl || ''}" placeholder="https://github.com/...">
            </div>
            <div class="form-group">
                <label class="form-label">Thumbnail Image</label>
                <div class="image-upload" id="projectImageUpload">
                    <input type="file" id="projectImageInput" accept="image/*" style="display: none;">
                    <img src="${hasImage ? project.image : ''}" alt="Project Preview" class="image-preview" id="projectImagePreview" style="${hasImage ? 'display: block;' : 'display: none;'}">
                    <svg class="image-upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="${hasImage ? 'display: none;' : ''}"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    <span class="image-upload-text" style="${hasImage ? 'display: none;' : ''}">Click to upload image</span>
                </div>
            </div>
        `;
        setTimeout(() => {
            document.getElementById('projectImageUpload').addEventListener('click', () => {
                document.getElementById('projectImageInput').click();
            });
            document.getElementById('projectImageInput').addEventListener('change', (e) => {
                this.handleImageUpload(e, 'project');
            });
        }, 0);
        document.getElementById('modalFooter').innerHTML = `
            <button class="btn btn-secondary" onclick="AdminCMS.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="AdminCMS.saveProject()">${projectId ? 'Update' : 'Add'}</button>
        `;
        this.openModal();
    },
    
    editProject(id) { this.openProjectModal(id); },
    
    saveProject() {
        const title = document.getElementById('projectTitle').value.trim();
        const description = document.getElementById('projectDescription').value.trim();
        const tags = document.getElementById('projectTags').value.split(',').map(t => t.trim()).filter(t => t);
        const liveUrl = document.getElementById('projectLiveUrl').value.trim();
        const githubUrl = document.getElementById('projectGithubUrl').value.trim();
        // FIX: Check for valid base64 data URL, not broken src string check
        const imgSrc = document.getElementById('projectImagePreview').src;
        const image = (imgSrc && imgSrc.startsWith('data:')) ? imgSrc : null;
        
        if (!title) { this.showToast('Please enter a project title', 'error'); return; }
        let projects = SiteData.get('projects');
        if (this.editingProjectId) {
            const index = projects.findIndex(p => p.id === this.editingProjectId);
            if (index > -1) {
                projects[index] = { ...projects[index], title, description, tags, liveUrl, githubUrl,
                    image: image || projects[index].image };
            }
        } else {
            const newId = projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1;
            projects.push({ id: newId, title, description, tags, liveUrl, githubUrl, image, visible: true });
        }
        SiteData.save('projects', projects);
        this.closeModal();
        this.loadProjects();
        this.showToast(this.editingProjectId ? 'Project updated!' : 'Project added!');
    },
    
    deleteProject(id) {
        if (confirm('Are you sure you want to delete this project?')) {
            SiteData.save('projects', SiteData.get('projects').filter(p => p.id !== id));
            this.loadProjects();
            this.showToast('Project deleted!');
        }
    },
    
    toggleProjectVisibility(id) {
        let projects = SiteData.get('projects');
        const index = projects.findIndex(p => p.id === id);
        if (index > -1) {
            projects[index].visible = !projects[index].visible;
            SiteData.save('projects', projects);
            this.showToast('Project visibility updated!');
        }
    },

    // Experience
    loadExperience() {
        const experience = SiteData.get('experience');
        const list = document.getElementById('experienceList');
        list.innerHTML = experience.map(exp => `
            <div class="list-item" data-id="${exp.id}">
                <div class="list-item-content">
                    <div class="list-item-title">${exp.title}</div>
                    <div class="list-item-subtitle">${exp.company} | ${exp.date}</div>
                </div>
                <div class="list-item-actions">
                    <button class="btn btn-icon btn-secondary" onclick="AdminCMS.editExperience(${exp.id})">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button class="btn btn-icon btn-danger" onclick="AdminCMS.deleteExperience(${exp.id})">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                </div>
            </div>
        `).join('');
    },
    
    openExperienceModal(expId = null) {
        this.editingExperienceId = expId;
        const exp = expId ? SiteData.get('experience').find(e => e.id === expId) : null;
        document.getElementById('modalTitle').textContent = expId ? 'Edit Experience' : 'Add Experience';
        document.getElementById('modalBody').innerHTML = `
            <div class="form-group" style="margin-bottom: 1rem;">
                <label class="form-label">Date Range</label>
                <input type="text" class="form-control" id="expDate" value="${exp?.date || ''}" placeholder="e.g., 2023 - Present">
            </div>
            <div class="form-group" style="margin-bottom: 1rem;">
                <label class="form-label">Job Title</label>
                <input type="text" class="form-control" id="expTitle" value="${exp?.title || ''}" placeholder="e.g., Senior Developer">
            </div>
            <div class="form-group" style="margin-bottom: 1rem;">
                <label class="form-label">Company</label>
                <input type="text" class="form-control" id="expCompany" value="${exp?.company || ''}" placeholder="Company name">
            </div>
            <div class="form-group">
                <label class="form-label">Description</label>
                <textarea class="form-control" id="expDescription" rows="3">${exp?.description || ''}</textarea>
            </div>
        `;
        document.getElementById('modalFooter').innerHTML = `
            <button class="btn btn-secondary" onclick="AdminCMS.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="AdminCMS.saveExperience()">${expId ? 'Update' : 'Add'}</button>
        `;
        this.openModal();
    },
    
    editExperience(id) { this.openExperienceModal(id); },
    
    saveExperience() {
        const date = document.getElementById('expDate').value.trim();
        const title = document.getElementById('expTitle').value.trim();
        const company = document.getElementById('expCompany').value.trim();
        const description = document.getElementById('expDescription').value.trim();
        if (!title || !company) { this.showToast('Please fill in required fields', 'error'); return; }
        let experience = SiteData.get('experience');
        if (this.editingExperienceId) {
            const index = experience.findIndex(e => e.id === this.editingExperienceId);
            if (index > -1) experience[index] = { ...experience[index], date, title, company, description };
        } else {
            const newId = experience.length > 0 ? Math.max(...experience.map(e => e.id)) + 1 : 1;
            experience.push({ id: newId, date, title, company, description });
        }
        SiteData.save('experience', experience);
        this.closeModal();
        this.loadExperience();
        this.showToast(this.editingExperienceId ? 'Experience updated!' : 'Experience added!');
    },
    
    deleteExperience(id) {
        if (confirm('Are you sure you want to delete this experience?')) {
            SiteData.save('experience', SiteData.get('experience').filter(e => e.id !== id));
            this.loadExperience();
            this.showToast('Experience deleted!');
        }
    },
    
    // Contact
    loadContact() {
        const contact = SiteData.get('contact');
        document.getElementById('contactEmail').value = contact.email || '';
        document.getElementById('contactGithub').value = contact.github || '';
        document.getElementById('contactLinkedin').value = contact.linkedin || '';
        document.getElementById('contactTwitter').value = contact.twitter || '';
    },
    
    saveContact() {
        const contact = {
            email: document.getElementById('contactEmail').value.trim(),
            github: document.getElementById('contactGithub').value.trim(),
            linkedin: document.getElementById('contactLinkedin').value.trim(),
            twitter: document.getElementById('contactTwitter').value.trim()
        };
        SiteData.save('contact', contact);
        this.hasUnsavedChanges = false;
        this.showToast('Contact settings saved!');
    },
    
    // Settings
    loadSettings() {
        const settings = SiteData.get('settings');
        document.getElementById('siteTitle').value = settings.siteTitle || '';
        document.getElementById('faviconText').value = settings.favicon || '';
        document.getElementById('toggleAbout').checked = settings.sections?.about !== false;
        document.getElementById('toggleSkills').checked = settings.sections?.skills !== false;
        document.getElementById('toggleProjects').checked = settings.sections?.projects !== false;
        document.getElementById('toggleExperience').checked = settings.sections?.experience !== false;
        document.getElementById('toggleContact').checked = settings.sections?.contact !== false;
    },
    
    saveSettings() {
        const settings = {
            siteTitle: document.getElementById('siteTitle').value,
            favicon: document.getElementById('faviconText').value,
            sections: {
                about: document.getElementById('toggleAbout').checked,
                skills: document.getElementById('toggleSkills').checked,
                projects: document.getElementById('toggleProjects').checked,
                experience: document.getElementById('toggleExperience').checked,
                contact: document.getElementById('toggleContact').checked
            }
        };
        SiteData.save('settings', settings);
        document.title = settings.siteTitle;
        this.hasUnsavedChanges = false;
        this.showToast('Settings saved!');
    },
    
    // Image upload handler
    handleImageUpload(e, type) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const base64 = event.target.result;
            if (type === 'avatar') {
                const preview = document.getElementById('avatarPreview');
                preview.src = base64;
                preview.style.display = 'block';
            } else if (type === 'project') {
                const preview = document.getElementById('projectImagePreview');
                if (preview) { preview.src = base64; preview.style.display = 'block'; }
                const icon = document.querySelector('#projectImageUpload .image-upload-icon');
                const text = document.querySelector('#projectImageUpload .image-upload-text');
                if (icon) icon.style.display = 'none';
                if (text) text.style.display = 'none';
            }
            this.hasUnsavedChanges = true;
        };
        reader.readAsDataURL(file);
    },
    
    // Data management
    importData(input) {
        const file = input.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const success = SiteData.import(e.target.result);
            if (success) { this.loadAllData(); this.showToast('Data imported successfully!'); }
            else { this.showToast('Failed to import data. Invalid JSON format.', 'error'); }
        };
        reader.readAsText(file);
        input.value = '';
    },
    
    resetData() {
        if (confirm('Are you sure you want to reset all data to defaults? This cannot be undone!')) {
            SiteData.reset();
            this.loadAllData();
            this.showToast('Data reset to defaults!');
        }
    },
    
    openModal() { document.getElementById('modalOverlay').classList.add('active'); },
    
    closeModal() {
        document.getElementById('modalOverlay').classList.remove('active');
        this.editingSkillId = null;
        this.editingProjectId = null;
        this.editingExperienceId = null;
    },
    
    showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                ${type === 'success'
                    ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>'
                    : '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'}
            </svg>
            <span>${message}</span>
        `;
        container.appendChild(toast);
        setTimeout(() => {
            toast.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
};

window.AdminCMS = AdminCMS;
