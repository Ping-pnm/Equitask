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
