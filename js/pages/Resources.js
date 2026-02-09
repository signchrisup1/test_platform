// Resource Library
const ResourcesPage = {
  _searchQuery: '',

  render() {
    const content = document.getElementById('pageContent');
    if (!content) return;

    const resources = Store.get('resources') || [];
    const subjects = Store.get('subjects') || [];
    const filtered = this._searchQuery ?
      resources.filter(r =>
        r.name.toLowerCase().includes(this._searchQuery.toLowerCase()) ||
        (r.subject && r.subject.toLowerCase().includes(this._searchQuery.toLowerCase()))
      ) : resources;

    const typeIcons = { pdf: '📄', doc: '📝', image: '🖼️', link: '🔗', other: '📎' };

    content.innerHTML = `
      <div class="page-content">
        <div class="flex justify-between items-center mb-lg">
          <div>
            <h1>📁 Resources</h1>
            <p class="text-muted mt-sm" style="font-size:0.9rem">Upload and organize your study materials</p>
          </div>
          <button class="btn btn-primary" onclick="ResourcesPage.addResource()">+ Add Resource</button>
        </div>

        <!-- Search & Filter -->
        <div class="card mb-md" style="padding:12px 16px">
          <div class="flex gap-md items-center">
            <input type="text" class="form-input" placeholder="Search resources..." style="flex:1"
                   value="${this._searchQuery}" oninput="ResourcesPage.search(this.value)">
            <div class="flex gap-sm">
              <button class="tag ${!this._filterSubject ? 'active' : ''}" onclick="ResourcesPage.filterBySubject('')">All</button>
              ${subjects.slice(0, 4).map(id => {
                const s = MockData.subjects.find(sub => sub.id === id);
                return s ? `<button class="tag ${this._filterSubject === id ? 'active' : ''}" onclick="ResourcesPage.filterBySubject('${id}')">${s.emoji} ${s.name}</button>` : '';
              }).join('')}
            </div>
          </div>
        </div>

        ${filtered.length === 0 ? `
          <div class="card">
            <div class="empty-state">
              <div class="empty-state-icon">📁</div>
              <div class="empty-state-title">${this._searchQuery ? 'No matching resources' : 'No resources yet'}</div>
              <div class="empty-state-text">Add study materials to organize and access them quickly.</div>
              <button class="btn btn-primary" onclick="ResourcesPage.addResource()">Add Resource</button>
            </div>
          </div>
        ` : `
          <!-- Recent -->
          <h3 class="mb-md">Resources (${filtered.length})</h3>
          <div class="flex flex-col gap-sm">
            ${filtered.map(r => {
              const subjectData = MockData.subjects.find(s => s.id === r.subject);
              const icon = typeIcons[r.type] || typeIcons.other;
              return `
                <div class="resource-item">
                  <div class="resource-icon">${icon}</div>
                  <div class="resource-info">
                    <div class="resource-name">${Helpers.escapeHtml(r.name)}</div>
                    <div class="resource-meta">
                      ${subjectData ? `${subjectData.emoji} ${subjectData.name} | ` : ''}
                      ${r.size || 'Unknown size'} | Added ${Helpers.formatDate(r.addedDate, 'relative')}
                    </div>
                  </div>
                  <button class="btn btn-ghost btn-icon btn-sm" onclick="ResourcesPage.deleteResource('${r.id}')" data-tooltip="Delete">
                    🗑️
                  </button>
                </div>
              `;
            }).join('')}
          </div>
        `}
      </div>
    `;
  },

  search(query) {
    this._searchQuery = query;
    // Debounced render
    clearTimeout(this._searchTimeout);
    this._searchTimeout = setTimeout(() => this.render(), 200);
  },

  filterBySubject(subjectId) {
    this._filterSubject = subjectId;
    if (subjectId) {
      this._searchQuery = subjectId;
    } else {
      this._searchQuery = '';
    }
    this.render();
  },

  addResource() {
    const subjects = Store.get('subjects') || [];
    Modal.show({
      title: 'Add Resource',
      content: `
        <div class="form-group">
          <label class="form-label">Resource Name</label>
          <input type="text" class="form-input" id="resourceName" placeholder="e.g., Chapter 5 Notes.pdf">
        </div>
        <div class="form-group">
          <label class="form-label">Type</label>
          <select class="form-select" id="resourceType">
            <option value="doc">Document</option>
            <option value="pdf">PDF</option>
            <option value="image">Image</option>
            <option value="link">Link</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Subject</label>
          <select class="form-select" id="resourceSubject">
            <option value="">None</option>
            ${subjects.map(id => {
              const s = MockData.subjects.find(sub => sub.id === id);
              return s ? `<option value="${id}">${s.emoji} ${s.name}</option>` : '';
            }).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">File Upload (simulated)</label>
          <div style="border:2px dashed var(--border-color);border-radius:var(--radius-md);padding:32px;text-align:center;cursor:pointer"
               onclick="document.getElementById('fileInput').click()">
            <div style="font-size:2rem;margin-bottom:8px">📤</div>
            <div class="text-muted" style="font-size:0.9rem">Click to browse or drag & drop</div>
            <input type="file" id="fileInput" style="display:none" onchange="document.getElementById('resourceName').value = this.files[0]?.name || ''">
          </div>
        </div>
      `,
      footer: `
        <button class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
        <button class="btn btn-primary" onclick="ResourcesPage.saveResource()">Add Resource</button>
      `
    });
  },

  saveResource() {
    const name = document.getElementById('resourceName')?.value?.trim();
    if (!name) { Component.toast('Please enter a resource name', 'warning'); return; }

    Storage.addResource({
      name,
      type: document.getElementById('resourceType')?.value || 'doc',
      subject: document.getElementById('resourceSubject')?.value || '',
      size: `${Helpers.randomInt(100, 5000)} KB`,
    });

    Modal.close();
    this.render();
    Component.toast('Resource added!', 'success');
  },

  deleteResource(id) {
    Modal.confirm('Delete this resource?', () => {
      Storage.deleteResource(id);
      this.render();
      Component.toast('Resource deleted', 'info');
    });
  }
};
