class ProjectCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }); // Shadow DOM
    this.project = String(this.getAttribute('project')) || '';
    const path = './projects/' + this.project;
    const origin = window.location.origin;
    const slug = origin + '/projects/' + this.project + '/index.html';

    this.shadowRoot.innerHTML = `
      <style>
        .card {
          display: flex;
          flex-direction: column;
          justify-content: end;
          align-items: center;
          padding: 0;
          gap: 1rem;

          width: 208px;
          height: 290px;

          background: #F3F3F3;
          background-image: url("${path}/cover.png");
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
          border: 4px solid #FFFFFF;
          border-radius: 0.5rem;

          overflow:hidden;
        }

        slot{
          display: flex;
          flex-direction: row;
          align-items: center;
          padding: 0.25rem 0.5rem;
          margin: 1rem;
          gap: 7px;
          color: #1C75F1;

          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(2px);
          /* Note: backdrop-filter has minimal browser support */
          border-radius: 32px;
        }

        a {
          opacity: 0;
          transform: translateY(50%) scale(0.9);
          transition: .25s;
          transition-timing-function: ease-out;
        }
          
        .card:hover a{
          opacity: 1;
          transform: translateY(0%) scale(1);
        }

        .card:hover{
          cursor: pointer;
        }

      </style>
      <article class="card">
          <a href="${slug}"><slot></slot></a>
        </article>
    `;
  }
}

customElements.define('project-card', ProjectCard);

/* Group 9 */

// /* Inside auto layout */
// flex: none;
// order: 1;
// flex-grow: 0;
// z-index: 1;
