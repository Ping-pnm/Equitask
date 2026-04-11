// from login.html
function handleLogin(event) {
    event.preventDefault();
    // Navigate to homepage on login
    window.location.href = 'homepage.html';
}

// from homepage.html
function openModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
    // reset form on close
    if (modalId === 'modal-create-class') {
        document.getElementById('form-create-class').reset();
    } else if (modalId === 'modal-compose') {
        document.getElementById('form-compose').reset();
    } else if (modalId === 'modal-invite') {
        const form = document.getElementById('form-invite');
        if (form) form.reset();
        const chips = document.getElementById('invite-chips-container');
        if (chips) chips.innerHTML = '';
    }
}

function handleCreateClass(event) {
    event.preventDefault();
    const className = document.getElementById('class-name').value;

    if (className.trim() !== '') {
        // Add to sidebar
        const classList = document.getElementById('class-list');
        const newLi = document.createElement('li');
        const newA = document.createElement('a');
        newA.href = '#';
        newA.className = 'class-item';
        newA.textContent = className;
        newLi.appendChild(newA);
        classList.appendChild(newLi);

        closeModal('modal-create-class');
    }
}

function handlePost(event) {
    event.preventDefault();
    const postContent = document.getElementById('post-content').value;

    if (postContent.trim() !== '') {
        // Add to stream
        const postsContainer = document.getElementById('posts-container');
        const dateOptions = { month: 'short', day: 'numeric' };
        const today = new Date().toLocaleDateString('en-US', dateOptions).toUpperCase();

        const newCard = document.createElement('div');
        newCard.className = 'post-card';
        newCard.innerHTML = `
            <div class="post-icon-wrapper" style="background: #9ab4c1; border-radius: 50%; display: flex; align-items: center; justify-content: center; width: 50px; height: 50px;">
                <img src="../public/assets/checklist-icon.png" alt="Post Icon" style="width: 24px; height: 24px; object-fit: contain;">
            </div>
            <div class="post-info">
                <div class="post-title">Sasiporn Usanavasin posted a new material: ${postContent}</div>
                <div class="post-date">${today}</div>
            </div>
        `;

        // insert at beginning
        postsContainer.prepend(newCard);

        closeModal('modal-compose');
    }
}

function toggleGroupWork() {
    const toggle = document.getElementById('group-work-toggle');
    const knob = document.getElementById('group-work-knob');
    
    if (toggle && knob) {
        const isToggled = toggle.getAttribute('data-toggled') === 'true';
        if (isToggled) {
            toggle.style.background = '#999';
            knob.style.transform = 'translateX(0)';
            toggle.setAttribute('data-toggled', 'false');
        } else {
            toggle.style.background = '#41b8d5';
            knob.style.transform = 'translateX(16px)';
            toggle.setAttribute('data-toggled', 'true');
        }
    }
}

function openAssignmentDetail() {
    const listContainer = document.getElementById('assignments-container');
    const detailView = document.getElementById('assignment-detail-view');
    const btnAssign = document.getElementById('btn-assign');

    if (listContainer) listContainer.style.display = 'none';
    if (btnAssign) btnAssign.style.display = 'none';
    if (detailView) detailView.style.display = 'block';
}

function openEditModal(event) {
    if (event) {
        event.stopPropagation();
    }
    openModal('modal-edit-assignment');
}

function toggleEditGroupWork() {
    const toggle = document.getElementById('edit-group-work-toggle');
    const knob = document.getElementById('edit-group-work-knob');
    
    if (toggle && knob) {
        const isToggled = toggle.getAttribute('data-toggled') === 'true';
        if (isToggled) {
            toggle.style.background = '#999';
            knob.style.transform = 'translateX(0)';
            toggle.setAttribute('data-toggled', 'false');
        } else {
            toggle.style.background = '#41b8d5';
            knob.style.transform = 'translateX(16px)';
            toggle.setAttribute('data-toggled', 'true');
        }
    }
}

function updateRubric(prefix, type, delta) {
    const tableBody = document.getElementById('rubric-table-' + prefix);
    const rowsSpan = document.getElementById('rubric-rows-' + prefix);
    const colsSpan = document.getElementById('rubric-cols-' + prefix);
    
    if (!tableBody || !rowsSpan || !colsSpan) return;

    let currentRows = parseInt(rowsSpan.innerText);
    let currentCols = parseInt(colsSpan.innerText);

    if (type === 'row') {
        const newRows = currentRows + delta;
        if (newRows < 1 || newRows > 10) return; // limit 1-10
        
        if (delta > 0) {
            const tr = document.createElement('tr');
            for (let i = 0; i < currentCols; i++) {
                const td = document.createElement('td');
                td.contentEditable = "true";
                td.style.border = "1px solid #000";
                td.style.height = "40px";
                td.style.padding = "5px";
                td.style.outline = "none";
                td.style.fontSize = "14px";
                td.style.verticalAlign = "top";
                tr.appendChild(td);
            }
            tableBody.appendChild(tr);
        } else {
            tableBody.removeChild(tableBody.lastElementChild);
        }
        rowsSpan.innerText = newRows;
    } else if (type === 'col') {
        const newCols = currentCols + delta;
        if (newCols < 1 || newCols > 10) return;

        const rows = tableBody.querySelectorAll('tr');
        if (delta > 0) {
            rows.forEach(tr => {
                const td = document.createElement('td');
                td.contentEditable = "true";
                td.style.border = "1px solid #000";
                td.style.height = "40px";
                td.style.padding = "5px";
                td.style.outline = "none";
                td.style.fontSize = "14px";
                td.style.verticalAlign = "top";
                tr.appendChild(td);
            });
        } else {
            rows.forEach(tr => {
                tr.removeChild(tr.lastElementChild);
            });
        }
        colsSpan.innerText = newCols;
    }
}

// Ensure DOM is loaded before attaching global event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Close modal when clicking outside
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', function (e) {
            if (e.target === this) {
                closeModal(this.id);
            }
        });
    });
    // Handle post button color based on input
    const postContentInput = document.getElementById('post-content');
    if (postContentInput) {
        postContentInput.addEventListener('input', function() {
            const btnPost = document.querySelector('#modal-compose .btn-post');
            if (btnPost) {
                if (this.value.trim().length > 0) {
                    btnPost.classList.add('active');
                } else {
                    btnPost.classList.remove('active');
                }
            }
        });
    }
});

function openInviteModal(title) {
    const modal = document.getElementById('modal-invite');
    const titleEl = document.getElementById('invite-modal-title');
    if (modal && titleEl) {
        titleEl.textContent = title;
        const form = document.getElementById('form-invite');
        if (form) form.reset();
        const chips = document.getElementById('invite-chips-container');
        if (chips) chips.innerHTML = '';
        modal.classList.remove('hidden');
    }
}

function handleInvite(event) {
    event.preventDefault();
    const emailInput = document.getElementById('invite-email');
    const email = emailInput.value.trim();

    if (email !== '') {
        const container = document.getElementById('invite-chips-container');
        
        const chip = document.createElement('div');
        chip.style.display = 'flex';
        chip.style.alignItems = 'center';
        chip.style.background = '#a8a8a8';
        chip.style.borderRadius = '20px';
        chip.style.padding = '4px 10px 4px 4px';
        chip.style.width = 'fit-content';
        chip.style.gap = '8px';
        
        chip.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 45 45" fill="none">
                <circle cx="22.5" cy="22.5" r="22.5" fill="#666666" />
                <circle cx="22.5" cy="16" r="6" fill="#ffffff" />
                <path d="M10.5 35.5C10.5 28.5 15.5 25 22.5 25C29.5 25 34.5 28.5 34.5 35.5V36.5H10.5V35.5Z" fill="#ffffff" />
            </svg>
            <span style="font-size: 13px; color: #111;">${email}</span>
            <span style="font-size: 16px; color: #111; cursor: pointer; line-height: 1; padding-left: 4px;" onclick="this.parentElement.remove()">×</span>
        `;
        
        container.appendChild(chip);
        emailInput.value = '';
    }
}

function toggleMemberSelection(element) {
    const isSelected = element.getAttribute('data-selected') === 'true';
    if (isSelected) {
        element.setAttribute('data-selected', 'false');
        element.style.background = 'transparent';
        element.innerHTML = '';
    } else {
        element.setAttribute('data-selected', 'true');
        element.style.background = '#56c4df';
        element.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 2px;"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    }
    updateSelectAllState();
}

function toggleSelectAll() {
    const selectAllCheckbox = document.getElementById('checkbox-select-all');
    if (!selectAllCheckbox) return;

    const isCurrentlySelected = selectAllCheckbox.getAttribute('data-selected') === 'true';
    const newState = !isCurrentlySelected;

    if (newState) {
        selectAllCheckbox.setAttribute('data-selected', 'true');
        selectAllCheckbox.style.background = '#56c4df';
        selectAllCheckbox.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 2px;"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else {
        selectAllCheckbox.setAttribute('data-selected', 'false');
        selectAllCheckbox.style.background = 'transparent';
        selectAllCheckbox.innerHTML = '';
    }

    const memberCheckboxes = document.querySelectorAll('.member-checkbox');
    memberCheckboxes.forEach(cb => {
        if (newState) {
            cb.setAttribute('data-selected', 'true');
            cb.style.background = '#56c4df';
            cb.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 2px;"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
        } else {
            cb.setAttribute('data-selected', 'false');
            cb.style.background = 'transparent';
            cb.innerHTML = '';
        }
    });
}

function updateSelectAllState() {
    const selectAllCheckbox = document.getElementById('checkbox-select-all');
    if (!selectAllCheckbox) return;
    
    const memberCheckboxes = document.querySelectorAll('.member-checkbox');
    if (memberCheckboxes.length === 0) {
        selectAllCheckbox.setAttribute('data-selected', 'false');
        selectAllCheckbox.style.background = 'transparent';
        selectAllCheckbox.innerHTML = '';
        return;
    }

    const allSelected = Array.from(memberCheckboxes).every(cb => cb.getAttribute('data-selected') === 'true');
    const someSelected = Array.from(memberCheckboxes).some(cb => cb.getAttribute('data-selected') === 'true');

    if (allSelected) {
        selectAllCheckbox.setAttribute('data-selected', 'true');
        selectAllCheckbox.style.background = '#56c4df';
        selectAllCheckbox.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 2px;"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else {
        selectAllCheckbox.setAttribute('data-selected', 'false');
        selectAllCheckbox.style.background = 'transparent';
        if (someSelected) {
            selectAllCheckbox.style.background = '#56c4df';
            selectAllCheckbox.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 2px;"><line x1="5" y1="12" x2="19" y2="12"></line></svg>`;
        } else {
            selectAllCheckbox.innerHTML = '';
        }
    }
}

function deleteSelectedMembers() {
    const memberCheckboxes = document.querySelectorAll('.member-checkbox');
    memberCheckboxes.forEach(cb => {
        if (cb.getAttribute('data-selected') === 'true') {
            const row = cb.closest('.person-row');
            if (row) row.remove();
        }
    });
    updateSelectAllState();
}

// ===== Dashboard Group Project =====
let dashboardProjectInitialized = false;

function showDashboardProjectView() {
    const listingView = document.getElementById('dashboard-listing-view');
    const projectView = document.getElementById('dashboard-project-view');
    if (!listingView || !projectView) return;

    listingView.style.display = 'none';
    projectView.style.display = '';

    // Only render group cards once
    if (!dashboardProjectInitialized) {
        initDashboardGroupProject();
        dashboardProjectInitialized = true;
    }
}

function showDashboardListingView() {
    const listingView = document.getElementById('dashboard-listing-view');
    const projectView = document.getElementById('dashboard-project-view');
    if (!listingView || !projectView) return;

    projectView.style.display = 'none';
    listingView.style.display = '';
}

function initDashboardGroupProject() {
    const container = document.getElementById('groups-container');
    if (!container) return;

    // Group Data
    const groupsData = [
        {
            name: "Group 1",
            students: [
                { name: "Student 1", score: 48 },
                { name: "Student 2", score: 63 },
                { name: "Student 3", score: 27 }
            ]
        },
        {
            name: "Group 2",
            students: [
                { name: "Student 1", score: 67 },
                { name: "Student 2", score: 95 },
                { name: "Student 3", score: 82 }
            ]
        }
    ];

    const circleRadius = 42;
    const circumference = 2 * Math.PI * circleRadius;

    groupsData.forEach(group => {
        // Calculate average
        const sum = group.students.reduce((acc, curr) => acc + curr.score, 0);
        const average = Math.round(sum / group.students.length);
        const offset = circumference - (average / 100) * circumference;

        // Build students HTML
        const studentsHtml = group.students.map(student => `
            <div class="student-row">
                <div class="student-name">${student.name}</div>
                <div class="progress-bar-container">
                    <div class="progress-bar-fill" style="width: 0%;"></div>
                </div>
                <div class="student-percent">${student.score}%</div>
            </div>
        `).join('');

        // Build Group Card HTML with SVG donut chart
        const cardHtml = `
            <div class="group-card">
                <div class="group-header">${group.name}</div>
                <div class="group-divider"></div>

                <div class="group-content">
                    <!-- Left: Circular SVG donut progress -->
                    <div class="progress-circle-wrapper">
                        <div class="progress-circle-container">
                            <svg viewBox="0 0 110 110">
                                <circle class="progress-track" cx="55" cy="55" r="${circleRadius}"></circle>
                                <circle class="progress-fill" cx="55" cy="55" r="${circleRadius}"
                                    stroke-dasharray="${circumference}"
                                    stroke-dashoffset="${circumference}"
                                    data-target-offset="${offset}"></circle>
                            </svg>
                            <div class="progress-label">${average}%</div>
                        </div>
                    </div>

                    <!-- Right: AI Summary -->
                    <div class="ai-summary-container">
                        <div class="ai-summary-header">
                            <img src="../public/assets/Ai-sign.png" alt="AI Icon">
                            AI Summary
                        </div>
                        <div class="ai-summary-box">
                            <div class="summary-text">This group are...................................<br>.................</div>
                            <span class="read-more">read more</span>
                        </div>
                    </div>
                </div>

                <!-- Students Progress Bars -->
                <div class="student-list">
                    ${studentsHtml}
                </div>

                <div class="btn-more-container">
                    <button class="btn-more">More</button>
                </div>
            </div>
        `;

        container.innerHTML += cardHtml;
    });

    // Animate progress bars and circles
    setTimeout(() => {
        document.querySelectorAll('.progress-bar-fill').forEach((bar, i) => {
            const allStudents = groupsData.flatMap(g => g.students);
            if (allStudents[i]) {
                bar.style.width = allStudents[i].score + '%';
            }
        });

        document.querySelectorAll('.progress-fill').forEach(circle => {
            const targetOffset = circle.getAttribute('data-target-offset');
            circle.style.strokeDashoffset = targetOffset;
        });
    }, 200);
}
