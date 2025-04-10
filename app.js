document.addEventListener('DOMContentLoaded', () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('ServiceWorker registrado com sucesso:', registration.scope);
        })
        .catch(err => {
          console.log('Falha ao registrar ServiceWorker:', err);
        });
    });
  }

  const linkForm = document.getElementById('link-form');
  const linkList = document.querySelector('link-list');
  const categoryFilter = document.querySelector('category-filter');

  const initForm = () => {
    linkForm.reset();
    linkForm.dataset.mode = 'add';
    linkForm.dataset.id = '';
  };

  linkForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(linkForm);
    const linkData = {
      id: linkForm.dataset.id || Date.now().toString(),
      title: formData.get('title'),
      url: formData.get('url'),
      category: formData.get('category')
    };

    if (linkForm.dataset.mode === 'edit') {
      linkList.updateLink(linkData);
    } else {
      linkList.addLink(linkData);
    }

    initForm();
  });

  linkList.addEventListener('edit-request', (e) => {
    const { id, title, url, category } = e.detail;

    document.getElementById('title').value = title;
    document.getElementById('url').value = url;
    document.getElementById('category').value = category;

    linkForm.dataset.mode = 'edit';
    linkForm.dataset.id = id;
  });

  linkList.addEventListener('delete-link', (e) => {
    const { id } = e.detail;
    linkList.links = linkList.links.filter(link => link.id !== id);
    localStorage.setItem('links', JSON.stringify(linkList.links));
    linkList.render();
  });

  categoryFilter.addEventListener('filter-change', (e) => {
    linkList.render(e.detail.category);
  });

  linkList.render();

  initForm();

  const cancelButton = document.getElementById('cancel-btn');

  cancelButton.addEventListener('click', () => {
    initForm();
  });
});