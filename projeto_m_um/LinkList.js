class LinkList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.links = []; // Inicializar como array vazio
  }

  connectedCallback() {
    this.links = JSON.parse(localStorage.getItem('links')) || []; // Carregar links do localStorage
    this.render();
    this.addEventListener('edit-link', this.handleEditLink);
    this.addEventListener('delete-link', this.handleDeleteLink);
    this.addEventListener('share-link', this.handleShareLink);

    document.querySelector('category-filter').addEventListener('filter-change', (e) => {
      const category = e.detail.category;
      this.render(category);
    });
  }

  render(category = "") {
    this.shadowRoot.innerHTML = `
      <style>
        .link-list {
          display: grid;
          gap: 16px;
          padding: 16px;
        }
      </style>
      <div class="link-list" id="links-container"></div>
    `;

    const container = this.shadowRoot.getElementById('links-container');
    container.innerHTML = '';

    this.links
      .filter(link => !category || link.category === category)
      .forEach(link => {
        const linkItem = document.createElement('link-item');
        linkItem.setAttribute('id', link.id);
        linkItem.setAttribute('title', link.title);
        linkItem.setAttribute('url', link.url);
        linkItem.setAttribute('category', link.category);
        container.appendChild(linkItem);
      });
  }

  handleEditLink = (e) => {
    this.dispatchEvent(new CustomEvent('edit-request', { detail: e.detail }));
  }

  handleDeleteLink = (e) => {
    this.links = this.links.filter(link => link.id !== e.detail.id);
    localStorage.setItem('links', JSON.stringify(this.links));
    this.render();
  }

  handleShareLink = (e) => {
    if (navigator.share) {
      navigator.share({
        title: e.detail.title,
        text: `Confira este link: ${e.detail.title}`,
        url: e.detail.url
      }).catch(err => {
        console.error('Erro ao compartilhar:', err);
      });
    } else {
      alert(`Compartilhe este link: ${e.detail.url}`);
    }
  }

  addLink(newLink) {
    this.links.push(newLink); // Adicionar o novo link ao array
    localStorage.setItem('links', JSON.stringify(this.links)); // Atualizar o localStorage
    this.render();
  }

  updateLink(updatedLink) {
    this.links = this.links.map(link =>
      link.id === updatedLink.id ? updatedLink : link
    ); // Atualizar o link existente
    localStorage.setItem('links', JSON.stringify(this.links)); // Atualizar o localStorage
    this.render();
  }
}

customElements.define('link-list', LinkList);