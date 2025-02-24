class ProjectCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }); // Shadow DOM
    this.shadowRoot.innerHTML = `
      <style>
        .card {
          padding: 10px;
          border-radius: 8px;
          box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
          background: white;
        }
      </style>
      <article class="card-project w-400">
          <img src="./assets/thumbnails/grid-pattern.png" class="cover w-300" />
          <h3><slot></slot></h3>
          <a href="http://localhost:3000/exemples/halftone/index.html">Grid pattern</a>
          <code>http://192.168.1.125:3000/exemples/grid pattern/index.html</code>
        </article>
    `;
  }
}

customElements.define('projectCard', ProjectCard);
