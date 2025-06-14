document.addEventListener('DOMContentLoaded', function() {
    const createPostBtn = document.getElementById('createPostBtn');
    const modal = document.getElementById('createPostModal');
    const closeModal = document.getElementById('closeModal');
    const cancelButton = document.getElementById('cancelButton');

    createPostBtn.addEventListener('click', function() {
        console.log('Create Post Button clicked');
        modal.style.display = 'flex';
    });

    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    cancelButton.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    const imageUpload = document.getElementById('imageUpload');
    const imagePreview = document.getElementById('imagePreview');

    imageUpload.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
            }
            reader.readAsDataURL(file);
        }
    });
}); 