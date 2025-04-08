// app.js

import { supabase } from './supabase.js';

// === Section Switching ===
function showSection(id) {
  document.querySelectorAll('.section').forEach(section => {
    section.classList.add('hidden');
  });

  const section = document.getElementById(id);
  if (section) {
    section.classList.remove('hidden');
    document.getElementById('pageTitle').innerText =
      section.querySelector('h2')?.innerText || 'Section';

    if (id === 'roles') loadRoles();
  }
}

// === Modal Handling ===
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('hidden');
    document.body.classList.add('modal-open');
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('hidden');
    document.body.classList.remove('modal-open');
  }
}

// === Add Role to Supabase ===
async function addRole(description) {
  const id = 'ROLE' + Date.now();
  const { error } = await supabase.from('roles').insert([{ id, description }]);

  if (error) {
    alert('Error adding role: ' + error.message);
    return;
  }

  await loadRoles(); // Refresh table
}

// === Load Roles Table ===
async function loadRoles() {
  const tableBody = document.getElementById('rolesTableBody');
  tableBody.innerHTML = '<tr><td colspan="3" class="p-4 text-center text-gray-500">Loading...</td></tr>';

  const { data: roles, error } = await supabase.from('roles').select('*');

  if (error) {
    tableBody.innerHTML = `<tr><td colspan="3" class="p-4 text-red-500">Error loading roles: ${error.message}</td></tr>`;
    return;
  }

  if (!roles.length) {
    tableBody.innerHTML = '<tr><td colspan="3" class="p-4 text-gray-400">No roles found.</td></tr>';
    return;
  }

  tableBody.innerHTML = '';
  roles.forEach(role => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${role.id}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${role.description}</td>
      <td class="px-6 py-4 text-right">
        <button class="text-blue-500 hover:underline" onclick="editRole('${role.id}', '${role.description}')">Edit</button>
        <button class="text-red-500 hover:underline ml-4" onclick="deleteRole('${role.id}')">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// === Edit Role Modal Trigger ===
function editRole(id, description) {
  document.getElementById('editRoleId').value = id;
  document.getElementById('editRoleDescription').value = description;
  openModal('editRoleModal');
}

// === Save Edited Role to Supabase ===
async function saveEditedRole() {
  const id = document.getElementById('editRoleId').value;
  const description = document.getElementById('editRoleDescription').value.trim();

  if (!description) {
    alert('Please enter a role description.');
    return;
  }

  const { error } = await supabase
    .from('roles')
    .update({ description })
    .eq('id', id);

  if (error) {
    alert('Error updating role: ' + error.message);
    return;
  }

  closeModal('editRoleModal');
  await loadRoles();
}

// === Delete Role ===
async function deleteRole(id) {
  if (!confirm('Are you sure you want to delete this role?')) return;

  const { error } = await supabase.from('roles').delete().eq('id', id);

  if (error) {
    alert('Error deleting role: ' + error.message);
    return;
  }

  await loadRoles();
}

// === Event Listeners ===
document.addEventListener('click', function (e) {
  // Add role
  if (e.target && e.target.id === 'confirmAddRole') {
    const desc = document.getElementById('newRoleDescription').value.trim();
    if (!desc) {
      alert('Please enter a role description.');
      return;
    }

    addRole(desc);
    closeModal('addRoleModal');
    document.getElementById('newRoleDescription').value = '';
  }

  // Save edited role
  if (e.target && e.target.id === 'confirmEditRole') {
    saveEditedRole();
  }
});

// === Sidebar Toggle ===
document.addEventListener('click', (e) => {
  if (e.target.closest('#toggleSidebar')) {
    const sidebar = document.querySelector('.sidebar');
    const texts = sidebar.querySelectorAll('.sidebar-text');
    const icon = sidebar.querySelector('#toggleSidebar i');

    sidebar.classList.toggle('w-64');
    sidebar.classList.toggle('w-16');

    texts.forEach(el => el.classList.toggle('hidden'));
    icon.classList.toggle('rotate-180');
  }
});

// === Error Logging ===
window.onerror = function (message, source, lineno, colno, error) {
  console.error('Error:', message, 'at', source, lineno + ':' + colno);
};

// === On Page Load ===
document.addEventListener('DOMContentLoaded', () => {
  showSection('projects');
});

// === Expose to HTML ===
window.showSection = showSection;
window.openModal = openModal;
window.closeModal = closeModal;
window.loadRoles = loadRoles;
window.editRole = editRole;
window.saveEditedRole = saveEditedRole;
window.deleteRole = deleteRole;
