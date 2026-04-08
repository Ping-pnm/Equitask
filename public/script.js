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
