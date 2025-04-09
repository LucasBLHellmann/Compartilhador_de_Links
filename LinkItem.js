class LinkItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.shadowRoot.innerHTML = `
      <style>
        .link-card {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 12px;
          background-color: #fff;
        }
        .link-title {
          font-size: 1.2rem;
          margin: 0 0 8px 0;
          color: #333;
        }
        .link-url {
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 8px;
          word-break: break-all;
        }
        .link-category {
          display: inline-block;
          background-color: #f0f0f0;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
          color: #555;
        }
        .link-actions {
          margin-top: 12px;
          display: flex;
          gap: 8px;
        }
        button {
          padding: 6px 12px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .edit-btn {
          background-color: #4a6fa5;
          color: white;
        }
        .delete-btn {
          background-color: #e74c3c;
          color: white;
        }
        .share-btn {
          background-color: #2ecc71;
          color: white;
        }
      </style>
      <div class="link-card">
        <h3 class="link-title"></h3>
        <p class="link-url"></p>
        <span class="link-category"></span>
        <div class="link-actions">
          <button class="edit-btn">Editar</button>
          <button class="delete-btn">Excluir</button>
          <button class="share-btn">Compartilhar</button>
        </div>
      </div>
    `;
  }

  connectedCallback() {
    this.shadowRoot.querySelector('.link-title').textContent = this.getAttribute('title');
    this.shadowRoot.querySelector('.link-url').textContent = this.getAttribute('url');
    this.shadowRoot.querySelector('.link-category').textContent = this.getAttribute('category');

    this.shadowRoot.querySelector('.edit-btn').addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('edit-link', {
        detail: {
          id: this.getAttribute('id'),
          title: this.getAttribute('title'),
          url: this.getAttribute('url'),
          category: this.getAttribute('category')
        },
        bubbles: true,
        composed: true
      }));
    });

    this.shadowRoot.querySelector('.delete-btn').addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('delete-link', {
        detail: { id: this.getAttribute('id') },
        bubbles: true,
        composed: true
      }));
    });

    this.shadowRoot.querySelector('.share-btn').addEventListener('click', () => {
      const title = this.getAttribute('title');
      const url = this.getAttribute('url');

      if (navigator.share) {
        navigator.share({
          title: title,
          text: `Confira este link: ${title}`,
          url: url
        }).catch(err => {
          console.error('Erro ao compartilhar:', err);
        });
      } else {
        alert(`Compartilhe este link: ${url}`);
      }
    });
  }
}

customElements.define('link-item', LinkItem);