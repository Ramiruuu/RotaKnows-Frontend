// Avatar preview logic
document.getElementById('avatar-upload').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(evt) {
      document.getElementById('profile-avatar').src = evt.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// Edit Profile logic
const editBtn = document.querySelector('.edit-btn');
const profileCard = document.querySelector('.profile-card');

if (editBtn) {
  editBtn.addEventListener('click', function() {
    const isEditing = editBtn.classList.contains('save-btn');
    const nameField = document.getElementById('profile-name');
    const emailField = document.getElementById('profile-email');
    const locationField = document.getElementById('profile-location');
    const detailName = document.getElementById('detail-name');
    const detailEmail = document.getElementById('detail-email');
    const detailLocation = document.getElementById('detail-location');

    if (!isEditing) {
      // Enable editing
      nameField.contentEditable = true;
      emailField.contentEditable = true;
      locationField.contentEditable = true;
      profileCard.classList.add('editing');
      editBtn.textContent = "Save";
      editBtn.classList.add('save-btn');
      nameField.focus();
    } else {
      // Disable editing (save)
      nameField.contentEditable = false;
      emailField.contentEditable = false;
      locationField.contentEditable = false;
      profileCard.classList.remove('editing');
      editBtn.textContent = "Edit Profile";
      editBtn.classList.remove('save-btn');
      // Update account details section
      if (detailName) detailName.textContent = nameField.textContent.replace(/^\s*|\s*$/g, '');
      if (detailEmail) detailEmail.textContent = emailField.textContent.replace(/^\s*|\s*$/g, '').replace(/^.*?>\s*/,''); // Remove icon if present
      if (detailLocation) detailLocation.textContent = locationField.textContent.replace(/^\s*|\s*$/g, '').replace(/^.*?>\s*/,'');
      // Optionally, save changes via AJAX here
    }
  });
}
