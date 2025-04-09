class CategoryFilter extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
    connectedCallback() {
      const categories = ["Trabalho", "Pessoal"];
      
      this.shadowRoot.innerHTML = `
        <style>
          .filter-container {
            padding: 16px;
            background-color: #f5f5f5;
            border-bottom: 1px solid #ddd;
          }
          select {
            padding: 8px;
            border-radius: 4px;
            border: 1px solid #ddd;
            width: 100%;
          }
        </style>
        <div class="filter-container">
          <select id="category-select">
            <option value="">Todas as categorias</option>
            ${categories.map(category => 
              `<option value="${category}">${category}</option>`
            ).join('')}
          </select>
        </div>
      `;
  
      this.shadowRoot.getElementById('category-select').addEventListener('change', (e) => {
        this.dispatchEvent(new CustomEvent('filter-change', {
          detail: { category: e.target.value }
        }));
      });
    }
  }
  
  customElements.define('category-filter', CategoryFilter);