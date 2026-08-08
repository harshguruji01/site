/**
 * hub-core.js
 * Shared logic for the AI, Tools, Learning, and Gaming Hubs.
 * Refactored to integrate Algolia InstantSearch.js
 */

class HubManager {
    constructor(config) {
        this.config = config; // We will use config.gridId
        this.initAlgolia();
    }

    initAlgolia() {
        const searchClient = algoliasearch('ASFAW7UC37', '50641a7e884d63f6d27f546d9885d4ea');

        const search = instantsearch({
            indexName: 'webguruji_online_asfaw7uc37_pages',
            searchClient,
        });

        // We replace the static #hub-search input with an Algolia searchBox
        const searchSection = document.querySelector('.hub-search-bar');
        if (searchSection) {
            searchSection.innerHTML = '<div id="hub-algolia-searchbox" style="width:100%"></div>';
        }

        // We clear the static grid to let Algolia handle it
        const grid = document.getElementById(this.config.gridId);
        if (grid) {
            grid.innerHTML = '';
            grid.className = ''; // Remove static grid class to let Algolia styling take over, or keep it if we map the classes
        }

        search.addWidgets([
            instantsearch.widgets.searchBox({
                container: '#hub-algolia-searchbox',
                placeholder: 'Search hub content...',
                showSubmit: false,
                showReset: true,
                cssClasses: {
                    input: 'hub-search-input',
                }
            }),
            instantsearch.widgets.hits({
                container: `#${this.config.gridId}`,
                templates: {
                    empty(results, { html }) {
                        return html`<div class="hub-empty-state">
                            <div class="hub-empty-icon">🔍</div>
                            <h3>No results found for "${results.query}"</h3>
                        </div>`;
                    },
                    item(hit, { html, components }) {
                        // Dynamically render a card based on Algolia's attributes
                        return html`
                            <a href="${hit.url || '#'}" class="hub-card" style="height:100%; display:flex; flex-direction:column; text-decoration:none;">
                                ${hit.image ? html`<img src="${hit.image}" class="hub-card-image" alt="Thumbnail">` : ''}
                                <div class="hub-card-content" style="padding:1.5rem; flex:1">
                                    <h3 class="hub-card-title">${components.Highlight({ hit, attribute: 'title' })}</h3>
                                    <p class="hub-card-desc" style="margin-top:0.5rem; color:var(--text-secondary)">${components.Highlight({ hit, attribute: 'description' })}</p>
                                </div>
                            </a>
                        `;
                    }
                },
                cssClasses: {
                    list: 'hub-grid',
                    item: 'algolia-grid-item', // Prevents default Algolia list-item padding
                }
            }),
            instantsearch.widgets.pagination({
                container: document.createElement('div'), // Create an empty div to hold pagination at bottom if needed
            })
        ]);

        // Create pagination container
        const paginationContainer = document.createElement('div');
        paginationContainer.id = 'hub-algolia-pagination';
        paginationContainer.style.marginTop = '2rem';
        paginationContainer.style.display = 'flex';
        paginationContainer.style.justifyContent = 'center';
        document.getElementById(this.config.gridId).after(paginationContainer);

        search.addWidgets([
            instantsearch.widgets.pagination({
                container: '#hub-algolia-pagination',
            })
        ]);

        search.start();

        // Remove the static filter buttons since Algolia handles search via index now
        const filterContainer = document.querySelector('.hub-filters');
        if (filterContainer) filterContainer.style.display = 'none';
    }
}
