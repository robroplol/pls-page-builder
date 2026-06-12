let sortableBlocks, addBlock;

// This script enhances the HTML Page Builder with bidirectional editing
document.addEventListener('DOMContentLoaded', function() {
  // DOM elements
  const blocksTab = document.getElementById('blocks-tab');
  const codeTab = document.getElementById('code-tab');
  const blocksContainer = document.getElementById('blocks-container');
  const codeContainer = document.getElementById('code-container');
  sortableBlocks = document.getElementById('sortable-blocks');
  const htmlCode = document.getElementById('html-code');
  const updateFromCodeBtn = document.getElementById('update-from-code');
  const previewFrame = document.getElementById('preview-frame');
  const copyHtmlBtn = document.getElementById('copy-html');
  const downloadHtmlBtn = document.getElementById('download-html');
  
  // Get block templates
  const textTemplate = document.getElementById('text-template');
  const cardTemplate = document.getElementById('card-template');
  const accordionTemplate = document.getElementById('accordion-template');
  const timelineTemplate = document.getElementById('timeline-template');
  const tabsTemplate = document.getElementById('tabs-template');
  const tableTemplate = document.getElementById('table-template');
  const videoTemplate = document.getElementById('video-template');
  const imageTemplate = document.getElementById('image-template');
  
  // Rich Text Editor configuration
  const quillOptions = {
    modules: {
      toolbar: [
        [{ 'header': [2, 3, 4, false] }],  // Header levels 2-4 and normal text
        ['bold', 'italic', 'underline', 'strike'],
        ['link'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }]
      ]
    },
    placeholder: 'Enter your content here...',
    theme: 'snow'
  };

  // Component selector toggle
  const toggleComponentsBtn = document.getElementById('toggle-components');
  const componentGrid = document.getElementById('component-grid');

  if (toggleComponentsBtn && componentGrid) {
    toggleComponentsBtn.addEventListener('click', function() {
      componentGrid.classList.toggle('hidden');
      // Rotate the arrow icon
      const svg = this.querySelector('svg');
      if (svg) {
        if (componentGrid.classList.contains('hidden')) {
          svg.style.transform = 'rotate(-90deg)';
        } else {
          svg.style.transform = 'rotate(0deg)';
        }
      }
    });
  }

  // Add page title change listener
  const pageTitleInput = document.querySelector('[data-type="pageTitle"] [data-field="title"]');
  if (pageTitleInput) {
    pageTitleInput.addEventListener('input', function() {
      updatePreview();
      updateCodeView();
    });
  }

  // Initialize Sortable on the blocks container
  const sortableInstance = new Sortable(sortableBlocks, {
    animation: 150,
    handle: '.move-block',
    ghostClass: 'sortable-ghost',
    onEnd: function() {
      updatePreview();
      updateCodeView();
    }
  });

  // Tab switching
  blocksTab.addEventListener('click', function() {
    blocksTab.classList.add('tab-active');
    blocksTab.classList.remove('tab-inactive');
    codeTab.classList.add('tab-inactive');
    codeTab.classList.remove('tab-active');
    
    blocksContainer.classList.remove('hidden');
    codeContainer.classList.add('hidden');
  });

  codeTab.addEventListener('click', function() {
    codeTab.classList.add('tab-active');
    codeTab.classList.remove('tab-inactive');
    blocksTab.classList.add('tab-inactive');
    blocksTab.classList.remove('tab-active');
    
    codeContainer.classList.remove('hidden');
    blocksContainer.classList.add('hidden');
    
    // Update the code view with the current blocks
    updateCodeView();
  });

  // Component buttons
  document.querySelectorAll('.component-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const componentType = this.getAttribute('data-type');
      addBlock(componentType);
    });
  });

  // Update from code editor
  if (updateFromCodeBtn) {
    updateFromCodeBtn.addEventListener('click', function() {
      const html = htmlCode.value;
      parseHtmlToBlocks(html);
    });
  }

  // Copy HTML button
  if (copyHtmlBtn) {
    copyHtmlBtn.addEventListener('click', function() {
      updateCodeView();
      navigator.clipboard.writeText(htmlCode.value).then(function() {
        alert('HTML copied to clipboard!');
      }, function(err) {
        console.error('Could not copy text: ', err);
      });
    });
  }

  // Download HTML button
  if (downloadHtmlBtn) {
    downloadHtmlBtn.addEventListener('click', function() {
      updateCodeView();
      const blob = new Blob([htmlCode.value], {type: 'text/html'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'michigan-virtual-page.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  // Initialize the page after a small delay to ensure iframe is ready
setTimeout(() => {
  updatePreview();
  updateCodeView();
}, 100);

  // Function to update the code view based on block contents
  function updateCodeView() {
    htmlCode.value = generateHTML();
  }

  // Function to parse HTML code into block components
  function parseHtmlToBlocks(html) {
    try {
      // Create a temporary DOM parser to work with the HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Extract the page title
      const titleElement = doc.querySelector('h1');
      if (titleElement && pageTitleInput) {
        pageTitleInput.value = titleElement.textContent;
      }
      
      // Clear existing blocks except the page title
      clearBlocks();
      
      // Find content container
      const contentContainer = doc.querySelector('.container');
      if (!contentContainer) return;
      
      // Parse components and create corresponding blocks
      parseComponents(contentContainer);
      
      // Update preview
      updatePreview();
    } catch (e) {
      console.error('Error parsing HTML:', e);
      alert('Error parsing HTML. Please check the code format.');
    }
  }

  // Function to parse components from HTML
  function parseComponents(container) {
    if (!container) return;
    
    // We'll use a simple approach based on comment markers and element structure
    
    // Get direct children of the container
    const children = Array.from(container.children);
    
    // Skip the first few elements (h1 and hr)
    const contentElements = children.slice(2);
    
    // Process each element
    for (let i = 0; i < contentElements.length; i++) {
      const element = contentElements[i];
      
      // Check for component type
      if (element.tagName === 'DIV' && element.classList.contains('grid') && 
          element.classList.contains('gap-4')) {
        // Probably a card set
        processCardSet(element);
      } 
      else if (element.tagName === 'UL' && element.classList.contains('shadow-box') && 
               element.classList.contains('accordion-controls')) {
        // Accordion set
        processAccordionSet(element);
      }
      else if (element.tagName === 'OL' && element.classList.contains('relative') && 
               element.classList.contains('border-l')) {
        // Timeline
        processTimeline(element);
      }
      else if (element.tagName === 'UL' && element.classList.contains('flex') && 
               element.classList.contains('tabs-white')) {
        // Tabs component
        processTabs(element, contentElements[i+1]);
        i++; // Skip the next element which is the tab content
      }
      else if (element.tagName === 'DIV' && element.querySelector('table')) {
        // Table component
        processTable(element);
      }
      else if (element.tagName === 'DIV' && element.classList.contains('video-container')) {
        // Video component
        processVideo(element, contentElements[i+1]);
        if (contentElements[i+1] && contentElements[i+1].tagName === 'UL') {
          i++; // Skip the links list if present
        }
      }
      else if (element.tagName === 'DIV' && (
                (element.querySelector('img') && element.classList.contains('inline-flex')) || 
                (element.querySelector('img') && element.classList.contains('flex') && element.classList.contains('flex-col')) ||
                (element.classList.contains('grid') && element.classList.contains('md:grid-cols-2'))
              )) {
        // Image component
        processImage(element);
      }
      else if (element.innerHTML && element.innerHTML.trim() !== '') {
        // Text component (default fallback)
        processTextComponent(element);
      }
    }
  }

  // Process text component
  function processTextComponent(element) {
    // Create text block
    const block = textTemplate.cloneNode(true);
    
    // Set content
    const editorContainer = block.querySelector('[data-field="text"]');
    if (editorContainer) {
      const hiddenInput = editorContainer.querySelector('.editor-content');
      if (hiddenInput) {
        hiddenInput.value = element.outerHTML;
        
        // Initialize rich text editor
        const editorDiv = editorContainer.querySelector('.rich-text-editor');
        if (editorDiv) {
          const editor = new Quill(editorDiv, quillOptions);
          editor.root.innerHTML = hiddenInput.value;
          
          // Update hidden input when editor content changes
          editor.on('text-change', function() {
            hiddenInput.value = editor.root.innerHTML;
            updatePreview();
            updateCodeView();
          });
          
          // Store editor instance on the container
          editorDiv.quillEditor = editor;
        }
      }
    }
    
    // Add the block with all necessary event handlers
    addBlockWithHandlers(block);
  }

  // Process card set
  function processCardSet(element) {
    // Create card block
    const block = cardTemplate.cloneNode(true);
    
    // Extract color class
    const cardElements = element.querySelectorAll('.border-4');
    let colorClass = 'deep-teal';
    let cardType = 'standard';
    let layout = '1';
    
    if (cardElements.length > 0) {
      const firstCard = cardElements[0];
      
      // Extract color
      for (const className of firstCard.classList) {
        if (className.startsWith('border-') && !className.startsWith('border-4')) {
          colorClass = className.replace('border-', '');
          break;
        }
      }
      
      // Detect layout
      if (element.classList.contains('lg:grid-cols-2')) {
        layout = '2';
      }
      
      // Detect card type
      if (firstCard.querySelector('.flex-col.md\\:flex-row')) {
        cardType = 'icon';
      } else if (firstCard.classList.contains('border-l-[36px]')) {
        cardType = 'left-border';
      } else if (firstCard.classList.contains('flex-col.md\\:flex-row') && firstCard.querySelector('.bg-' + colorClass)) {
        cardType = 'left-border-icon';
      } else if (firstCard.querySelector('.text-5xl')) {
        cardType = 'numbered';
      }
    }
    
    // Set color, layout, and type
    const colorInput = block.querySelector('[data-field="color"]');
    const layoutInput = block.querySelector('[data-field="layout"]');
    const cardTypeInput = block.querySelector('[data-field="card-type"]');
    
    if (colorInput) colorInput.value = colorClass;
    if (layoutInput) layoutInput.value = layout;
    if (cardTypeInput) cardTypeInput.value = cardType;
    
    // Update UI to show selected color, layout, and type
    const colorOptions = block.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
      if (option.getAttribute('data-color') === colorClass) {
        option.classList.add('selected');
      } else {
        option.classList.remove('selected');
      }
    });
    
    const layoutOptions = block.querySelectorAll('.layout-option');
    layoutOptions.forEach(option => {
      if (option.getAttribute('data-layout') === layout) {
        option.classList.add('layout-selected');
      } else {
        option.classList.remove('layout-selected');
      }
    });
    
    const cardTypeOptions = block.querySelectorAll('.card-type-option');
    cardTypeOptions.forEach(option => {
      if (option.getAttribute('data-type') === cardType) {
        option.classList.add('card-type-selected');
      } else {
        option.classList.remove('card-type-selected');
      }
    });
    
    // Handle icon field visibility
    const iconContainer = block.querySelector('.card-icon-container');
    if (iconContainer) {
      if (cardType === 'icon' || cardType === 'left-border-icon') {
        iconContainer.classList.remove('hidden');
      } else {
        iconContainer.classList.add('hidden');
      }
    }
    
    // Clear existing cards
    const cardsContainer = block.querySelector('.cards-container');
    if (cardsContainer) {
      while (cardsContainer.firstChild) {
        cardsContainer.removeChild(cardsContainer.firstChild);
      }
      
      // Add cards
      cardElements.forEach((card, index) => {
        let titleText = '';
        let contentHTML = '';
        let iconURL = '';
        
        // Extract title and content based on card type
        if (cardType === 'standard') {
          titleText = card.querySelector('h2')?.textContent || '';
          contentHTML = card.querySelector('.text-lg.font-normal')?.innerHTML || '';
        } else if (cardType === 'icon') {
          titleText = card.querySelector('h2')?.textContent || '';
          contentHTML = card.querySelector('.bg-white p')?.innerHTML || '';
          iconURL = card.querySelector('img')?.src || '';
        } else if (cardType === 'left-border') {
          titleText = card.querySelector('h2')?.textContent || '';
          contentHTML = card.querySelector('.md\\:text-lg.font-normal')?.innerHTML || '';
        } else if (cardType === 'left-border-icon') {
          titleText = card.querySelector('h3')?.textContent || '';
          contentHTML = card.querySelector('p')?.innerHTML || '';
          iconURL = card.querySelector('img')?.src || '';
        } else if (cardType === 'numbered') {
          titleText = card.querySelector('h3')?.textContent || '';
          contentHTML = card.querySelector('p')?.innerHTML || '';
        }
        
        // Create card element
        const cardItem = document.createElement('div');
        cardItem.className = 'card-item mb-2 p-2 border rounded bg-gray-50';
        
        // Card header
        cardItem.innerHTML = `
          <div class="flex justify-between items-center mb-2">
            <h4 class="text-sm font-medium">Card ${index + 1}</h4>
            <div class="flex">
              <button class="move-card text-gray-500 hover:text-gray-700 focus:outline-none mr-2 cursor-move" title="Drag to reorder">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                </svg>
              </button>
              <button class="delete-card text-red-500 hover:text-red-700 focus:outline-none" title="Delete card">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
          <div class="mb-2">
            <label class="block mb-1 text-sm">Card Title</label>
            <input type="text" class="block-input w-full p-2 border rounded" value="${titleText}" data-field="card-title">
          </div>
        `;
        
        // Add icon field if needed
        if (cardType === 'icon' || cardType === 'left-border-icon') {
          const iconDiv = document.createElement('div');
          iconDiv.className = 'mb-2';
          iconDiv.innerHTML = `
            <label class="block mb-1 text-sm">Icon URL</label>
            <input type="text" class="block-input w-full p-2 border rounded" value="${iconURL}" data-field="card-icon">
            <p class="text-xs text-gray-500 mt-1">Full URL to the icon image</p>
          `;
          cardItem.appendChild(iconDiv);
          
          // Add event listener for icon input
          const iconInput = iconDiv.querySelector('input');
          if (iconInput) {
            iconInput.addEventListener('input', function() {
              updatePreview();
              updateCodeView();
            });
          }
        }
        
        // Card content
        const contentDiv = document.createElement('div');
        contentDiv.className = 'mb-2';
        contentDiv.innerHTML = `
          <label class="block mb-1 text-sm">Card Content</label>
          <div class="editor-container" data-field="card-content">
            <div class="rich-text-editor"></div>
            <input type="hidden" class="editor-content" value="${contentHTML}">
          </div>
        `;
        cardItem.appendChild(contentDiv);
        
        // Add card to container
        cardsContainer.appendChild(cardItem);
        
        // Initialize rich text editor for content
        const editorDiv = contentDiv.querySelector('.rich-text-editor');
        const hiddenInput = contentDiv.querySelector('.editor-content');
        
        if (editorDiv && hiddenInput) {
          const editor = new Quill(editorDiv, quillOptions);
          editor.root.innerHTML = hiddenInput.value;
          
          // Update hidden input when editor content changes
          editor.on('text-change', function() {
            hiddenInput.value = editor.root.innerHTML;
            updatePreview();
            updateCodeView();
          });
          
          // Store editor instance on the container
          editorDiv.quillEditor = editor;
        }
        
        // Add input change handler for title
        const titleInput = cardItem.querySelector('[data-field="card-title"]');
        if (titleInput) {
          titleInput.addEventListener('input', function() {
            updatePreview();
            updateCodeView();
          });
        }
        
        // Add delete card handler
        const deleteBtn = cardItem.querySelector('.delete-card');
        if (deleteBtn) {
          deleteBtn.addEventListener('click', function() {
            // Make sure we don't delete the last card
            if (cardsContainer.querySelectorAll('.card-item').length > 1) {
              cardItem.remove();
              
              // Renumber remaining cards
              const remainingCards = Array.from(cardsContainer.querySelectorAll('.card-item'));
              remainingCards.forEach((card, index) => {
                const cardHeader = card.querySelector('h4');
                if (cardHeader) {
                  cardHeader.textContent = `Card ${index + 1}`;
                }
              });
              
              updatePreview();
              updateCodeView();
            } else {
              alert('Card sets must have at least one card.');
            }
          });
        }
      });
      
      // Initialize card sortable
      initCardSortable(cardsContainer);
    }
    
    // Initialize other card block functionality
    setTimeout(() => {
      initCardTabs(block);
      initColorOptions(block);
      initLayoutOptions(block);
      initCardTypeOptions(block);
    }, 0);
    
    // Add the block with all necessary event handlers
    addBlockWithHandlers(block);
  }

  // Process accordion set
  function processAccordionSet(element) {
    // Create accordion block
    const block = accordionTemplate.cloneNode(true);
    
    // Extract settings
    const accordionItems = element.querySelectorAll('li');
    let colorClass = 'deep-teal';
    let accordionType = 'standard';
    
    if (accordionItems.length > 0) {
      const firstItem = accordionItems[0];
      
      // Extract color
      for (const className of firstItem.classList) {
        if (className.startsWith('bg-')) {
          colorClass = className.replace('bg-', '');
          break;
        }
      }
      
      // Detect accordion type
      if (firstItem.querySelector('a span.flex') && firstItem.querySelector('a span.flex img')) {
        accordionType = 'icon';
      }
    }
    
    // Set color and type
    const colorInput = block.querySelector('[data-field="color"]');
    const typeInput = block.querySelector('[data-field="accordion-type"]');
    
    if (colorInput) colorInput.value = colorClass;
    if (typeInput) typeInput.value = accordionType;
    
    // Update UI to show selected color and type
    const colorOptions = block.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
      if (option.getAttribute('data-color') === colorClass) {
        option.classList.add('selected');
      } else {
        option.classList.remove('selected');
      }
    });
    
    const typeOptions = block.querySelectorAll('.accordion-type-option');
    typeOptions.forEach(option => {
      if (option.getAttribute('data-type') === accordionType) {
        option.classList.add('accordion-type-selected');
      } else {
        option.classList.remove('accordion-type-selected');
      }
    });
    
    // Clear existing panels
    const panelsContainer = block.querySelector('.accordion-panels-container');
    if (panelsContainer) {
      while (panelsContainer.firstChild) {
        panelsContainer.removeChild(panelsContainer.firstChild);
      }
      
      // Add panels
      accordionItems.forEach((item, index) => {
        let titleText = '';
        let contentHTML = '';
        let iconURL = '';
        
        // Extract title
        if (accordionType === 'standard') {
          titleText = item.querySelector('a > span')?.textContent.trim() || '';
        } else if (accordionType === 'icon') {
          titleText = item.querySelector('a span.flex span')?.textContent.trim() || '';
          iconURL = item.querySelector('a span.flex img')?.src || '';
        }
        
        // Extract content
        const contentDiv = item.querySelector('.accordion__content .px-8');
        if (contentDiv) {
          contentHTML = contentDiv.innerHTML.trim();
        }
        
        // Create panel element
        const panelItem = document.createElement('div');
        panelItem.className = 'accordion-panel mb-2 p-2 border rounded bg-gray-50';
        
        // Panel header
        panelItem.innerHTML = `
          <div class="flex justify-between items-center mb-2">
            <h4 class="text-sm font-medium">Panel ${index + 1}</h4>
            <div class="flex">
              <button class="move-panel text-gray-500 hover:text-gray-700 focus:outline-none mr-2 cursor-move" title="Drag to reorder">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                </svg>
              </button>
              <button class="delete-panel text-red-500 hover:text-red-700 focus:outline-none" title="Delete panel">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
          <div class="mb-2">
            <label class="block mb-1 text-sm">Panel Title</label>
            <input type="text" class="block-input w-full p-2 border rounded" value="${titleText}" data-field="panel-title">
          </div>
        `;
        
        // Add icon field if needed
        if (accordionType === 'icon') {
          const iconDiv = document.createElement('div');
          iconDiv.className = 'mb-2 panel-icon-container';
          iconDiv.innerHTML = `
            <label class="block mb-1 text-sm">Icon URL (optional)</label>
            <input type="text" class="block-input w-full p-2 border rounded" value="${iconURL}" data-field="panel-icon">
            <p class="text-xs text-gray-500 mt-1">Full URL to the icon image</p>
          `;
          panelItem.appendChild(iconDiv);
          
          // Add event listener for icon input
          const iconInput = iconDiv.querySelector('input');
          if (iconInput) {
            iconInput.addEventListener('input', function() {
              updatePreview();
              updateCodeView();
            });
          }
        }
        
        // Panel content
        const contentItemDiv = document.createElement('div');
        contentItemDiv.className = 'mb-2';
        contentItemDiv.innerHTML = `
          <label class="block mb-1 text-sm">Panel Content</label>
          <div class="editor-container" data-field="panel-content">
            <div class="rich-text-editor"></div>
            <input type="hidden" class="editor-content" value="${contentHTML}">
          </div>
        `;
        panelItem.appendChild(contentItemDiv);
        
        // Add panel to container
        panelsContainer.appendChild(panelItem);
        
        // Initialize rich text editor for content
        const editorDiv = contentItemDiv.querySelector('.rich-text-editor');
        const hiddenInput = contentItemDiv.querySelector('.editor-content');
        
        if (editorDiv && hiddenInput) {
          const editor = new Quill(editorDiv, quillOptions);
          editor.root.innerHTML = hiddenInput.value;
          
          // Update hidden input when editor content changes
          editor.on('text-change', function() {
            hiddenInput.value = editor.root.innerHTML;
            updatePreview();
            updateCodeView();
          });
          
          // Store editor instance on the container
          editorDiv.quillEditor = editor;
        }
        
        // Add input change handler for title
        const titleInput = panelItem.querySelector('[data-field="panel-title"]');
        if (titleInput) {
          titleInput.addEventListener('input', function() {
            updatePreview();
            updateCodeView();
          });
        }
        
        // Add delete panel handler
        const deleteBtn = panelItem.querySelector('.delete-panel');
        if (deleteBtn) {
          deleteBtn.addEventListener('click', function() {
            deleteAccordionPanel(panelsContainer, panelItem);
          });
        }
      });
      
      // Initialize accordion panel sortable
      initAccordionPanelSortable(panelsContainer);
    }
    
    // Initialize other accordion block functionality
    setTimeout(() => {
      initAccordionTabs(block);
      initColorOptions(block);
      initAccordionTypeOptions(block);
    }, 0);
    
    // Add the block with all necessary event handlers
    addBlockWithHandlers(block);
  }

  // Process timeline
  function processTimeline(element) {
    // Create timeline block
    const block = timelineTemplate.cloneNode(true);
    
    // Detect timeline type
    const timelineItems = element.querySelectorAll('li');
    let timelineType = 'standard';
    let colorClass = 'deep-teal';
    let layout = '1';
    
    // Check if this is a timeline with cards
    if (timelineItems.length > 0 && timelineItems[0].querySelector('.grid')) {
      timelineType = 'cards';
      
      // Extract color and layout from cards
      const cardElements = timelineItems[0].querySelectorAll('.border-4');
      if (cardElements.length > 0) {
        // Extract color
        for (const className of cardElements[0].classList) {
          if (className.startsWith('border-') && !className.startsWith('border-4')) {
            colorClass = className.replace('border-', '');
            break;
          }
        }
        
        // Extract layout
        const cardGrid = timelineItems[0].querySelector('.grid');
        if (cardGrid && cardGrid.classList.contains('md:grid-cols-2')) {
          layout = '2';
        }
      }
    }
    
    // Set timeline type, color, and layout
    const typeInput = block.querySelector('.selected-timeline-type');
    const colorInput = block.querySelector('[data-field="color"]');
    const layoutInput = block.querySelector('[data-field="layout"]');
    
    if (typeInput) typeInput.value = timelineType;
    if (colorInput) colorInput.value = colorClass;
    if (layoutInput) layoutInput.value = layout;
    
    // Update UI to show selected type, color, and layout
    const typeOptions = block.querySelectorAll('.timeline-type-option');
    typeOptions.forEach(option => {
      if (option.getAttribute('data-type') === timelineType) {
        option.classList.add('timeline-type-selected');
      } else {
        option.classList.remove('timeline-type-selected');
      }
    });
    
    const colorOptions = block.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
      if (option.getAttribute('data-color') === colorClass) {
        option.classList.add('selected');
      } else {
        option.classList.remove('selected');
      }
    });
    
    const layoutOptions = block.querySelectorAll('.layout-option');
    layoutOptions.forEach(option => {
      if (option.getAttribute('data-layout') === layout) {
        option.classList.add('layout-selected');
      } else {
        option.classList.remove('layout-selected');
      }
    });
    
    // Show/hide style tab based on timeline type
    const styleTab = block.querySelector('.timeline-tab[data-tab="style"]');
    if (styleTab) {
      if (timelineType === 'cards') {
        styleTab.classList.remove('hidden');
      } else {
        styleTab.classList.add('hidden');
      }
    }
    
    // Clear existing timeline items
    const itemsContainer = block.querySelector('.timeline-items-container');
    if (itemsContainer) {
      while (itemsContainer.firstChild) {
        itemsContainer.removeChild(itemsContainer.firstChild);
      }
      
      // Add timeline items
      timelineItems.forEach((item, index) => {
        let contentHTML = item.innerHTML;
        
        // Extract content and cards
        if (timelineType === 'cards') {
          // Extract content (without the cards grid)
          const contentClone = item.cloneNode(true);
          const cardGrid = contentClone.querySelector('.grid');
          if (cardGrid) {
            cardGrid.remove();
          }
          contentHTML = contentClone.innerHTML;
          
          // Create timeline item
          const timelineItem = document.createElement('div');
          timelineItem.className = 'timeline-item mb-2 p-2 border rounded bg-gray-50';
          
          // Item header
          timelineItem.innerHTML = `
            <div class="flex justify-between items-center mb-2">
              <h4 class="text-sm font-medium">Timeline Item ${index + 1}</h4>
              <div class="flex">
                <button class="move-timeline-item text-gray-500 hover:text-gray-700 focus:outline-none mr-2 cursor-move" title="Drag to reorder">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                </button>
                <button class="delete-timeline-item text-red-500 hover:text-red-700 focus:outline-none" title="Delete item">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
            <div class="mb-2">
              <label class="block mb-1 text-sm">Content</label>
              <div class="editor-container" data-field="timeline-content">
                <div class="rich-text-editor"></div>
                <input type="hidden" class="editor-content" value="${contentHTML}">
              </div>
            </div>
          `;
          
          // Create cards container
          const cardsContainer = document.createElement('div');
          cardsContainer.className = 'timeline-cards-container mb-2';
          if (timelineType !== 'cards') {
            cardsContainer.classList.add('hidden');
          }
          
          cardsContainer.innerHTML = `
            <label class="block mb-1 text-sm">Cards</label>
            <div class="timeline-cards border p-2 rounded"></div>
            <button class="add-timeline-card mt-2 px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300 focus:outline-none flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
              </svg>
              Add Card
            </button>
          `;
          
          // Add cards container to timeline item
          timelineItem.appendChild(cardsContainer);
          
          // Get cards from the timeline item
          const cardElements = item.querySelectorAll('.border-4');
          const timelineCardsContainer = cardsContainer.querySelector('.timeline-cards');
          
          // Add cards
          cardElements.forEach((card, cardIndex) => {
            const cardTitle = card.querySelector('h4')?.textContent || '';
            const cardContent = card.querySelector('p')?.innerHTML || '';
            
            // Create card element
            const cardItem = document.createElement('div');
            cardItem.className = 'timeline-card mb-2 p-2 border rounded bg-gray-100';
            
            // Card header
            cardItem.innerHTML = `
              <div class="flex justify-between items-center mb-2">
                <h5 class="text-xs font-medium">Card ${cardIndex + 1}</h5>
                <div class="flex">
                  <button class="move-timeline-card text-gray-500 hover:text-gray-700 focus:outline-none mr-2 cursor-move" title="Drag to reorder">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                  </button>
                  <button class="delete-timeline-card text-red-500 hover:text-red-700 focus:outline-none" title="Delete card">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <div class="mb-2">
                <label class="block mb-1 text-xs">Card Title</label>
                <input type="text" class="block-input w-full p-1 border rounded text-sm" value="${cardTitle}" data-field="timeline-card-title">
              </div>
              <div class="mb-2">
                <label class="block mb-1 text-xs">Card Content</label>
                <div class="editor-container" data-field="timeline-card-content">
                  <div class="rich-text-editor"></div>
                  <input type="hidden" class="editor-content" value="${cardContent}">
                </div>
              </div>
            `;
            
            // Add card to container
            timelineCardsContainer.appendChild(cardItem);
            
            // Initialize rich text editor for card content
            const editorDiv = cardItem.querySelector('.rich-text-editor');
            const hiddenInput = cardItem.querySelector('.editor-content');
            
            if (editorDiv && hiddenInput) {
              const editor = new Quill(editorDiv, quillOptions);
              editor.root.innerHTML = hiddenInput.value;
              
              // Update hidden input when editor content changes
              editor.on('text-change', function() {
                hiddenInput.value = editor.root.innerHTML;
                updatePreview();
                updateCodeView();
              });
              
              // Store editor instance on the container
              editorDiv.quillEditor = editor;
            }
            
            // Add input change handler for title
            const titleInput = cardItem.querySelector('[data-field="timeline-card-title"]');
            if (titleInput) {
              titleInput.addEventListener('input', function() {
                updatePreview();
                updateCodeView();
              });
            }
            
            // Add delete card handler
            const deleteBtn = cardItem.querySelector('.delete-timeline-card');
            if (deleteBtn) {
              deleteBtn.addEventListener('click', function() {
                deleteTimelineCard(timelineCardsContainer, cardItem);
              });
            }
          });
          
          // Initialize timeline cards sortable
          initTimelineCardsSortable(timelineCardsContainer);
          
          // Add card button handler
          const addCardBtn = cardsContainer.querySelector('.add-timeline-card');
          if (addCardBtn) {
            addCardBtn.addEventListener('click', function() {
              const cardsCount = timelineCardsContainer.querySelectorAll('.timeline-card').length;
              const newCard = createTimelineCard(cardsCount + 1);
              timelineCardsContainer.appendChild(newCard);
              
              // Initialize rich text editor for the new card
              const cardEditorDiv = newCard.querySelector('.rich-text-editor');
              const cardHiddenInput = newCard.querySelector('.editor-content');
              
              const cardEditor = new Quill(cardEditorDiv, quillOptions);
              cardEditor.root.innerHTML = cardHiddenInput.value;
              
              cardEditor.on('text-change', function() {
                cardHiddenInput.value = cardEditor.root.innerHTML;
                updatePreview();
                updateCodeView();
              });
              
              cardEditorDiv.quillEditor = cardEditor;
              
              updatePreview();
              updateCodeView();
            });
          }
          
          // Add item to container
          itemsContainer.appendChild(timelineItem);
          
          // Initialize rich text editor for item content
          const itemEditorDiv = timelineItem.querySelector('[data-field="timeline-content"] .rich-text-editor');
          const itemHiddenInput = timelineItem.querySelector('[data-field="timeline-content"] .editor-content');
          
          if (itemEditorDiv && itemHiddenInput) {
            const editor = new Quill(itemEditorDiv, quillOptions);
            editor.root.innerHTML = itemHiddenInput.value;
            
            // Update hidden input when editor content changes
            editor.on('text-change', function() {
              itemHiddenInput.value = editor.root.innerHTML;
              updatePreview();
              updateCodeView();
            });
            
            // Store editor instance on the container
            itemEditorDiv.quillEditor = editor;
          }
          
          // Add delete item handler
          const deleteBtn = timelineItem.querySelector('.delete-timeline-item');
          if (deleteBtn) {
            deleteBtn.addEventListener('click', function() {
              deleteTimelineItem(itemsContainer, timelineItem);
            });
          }
        } else {
          // Standard timeline item
          const timelineItem = document.createElement('div');
          timelineItem.className = 'timeline-item mb-2 p-2 border rounded bg-gray-50';
          
          // Item header
          timelineItem.innerHTML = `
            <div class="flex justify-between items-center mb-2">
              <h4 class="text-sm font-medium">Timeline Item ${index + 1}</h4>
              <div class="flex">
                <button class="move-timeline-item text-gray-500 hover:text-gray-700 focus:outline-none mr-2 cursor-move" title="Drag to reorder">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                </button>
                <button class="delete-timeline-item text-red-500 hover:text-red-700 focus:outline-none" title="Delete item">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
            <div class="mb-2">
              <label class="block mb-1 text-sm">Content</label>
              <div class="editor-container" data-field="timeline-content">
                <div class="rich-text-editor"></div>
                <input type="hidden" class="editor-content" value="${contentHTML}">
              </div>
            </div>
            <div class="timeline-cards-container mb-2 hidden">
              <label class="block mb-1 text-sm">Cards</label>
              <div class="timeline-cards border p-2 rounded"></div>
              <button class="add-timeline-card mt-2 px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300 focus:outline-none flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
                </svg>
                Add Card
              </button>
            </div>
          `;
          
          // Add item to container
          itemsContainer.appendChild(timelineItem);
          
          // Initialize rich text editor for content
          const editorDiv = timelineItem.querySelector('.rich-text-editor');
          const hiddenInput = timelineItem.querySelector('.editor-content');
          
          if (editorDiv && hiddenInput) {
            const editor = new Quill(editorDiv, quillOptions);
            editor.root.innerHTML = hiddenInput.value;
            
            // Update hidden input when editor content changes
            editor.on('text-change', function() {
              hiddenInput.value = editor.root.innerHTML;
              updatePreview();
              updateCodeView();
            });
            
            // Store editor instance on the container
            editorDiv.quillEditor = editor;
          }
          
          // Add delete item handler
          const deleteBtn = timelineItem.querySelector('.delete-timeline-item');
          if (deleteBtn) {
            deleteBtn.addEventListener('click', function() {
              deleteTimelineItem(itemsContainer, timelineItem);
            });
          }
          
          // Add card button handler
          const addCardBtn = timelineItem.querySelector('.add-timeline-card');
          if (addCardBtn) {
            addCardBtn.addEventListener('click', function() {
              const cardsContainer = this.closest('.timeline-cards-container').querySelector('.timeline-cards');
              const cardsCount = cardsContainer.querySelectorAll('.timeline-card').length;
              const newCard = createTimelineCard(cardsCount + 1);
              cardsContainer.appendChild(newCard);
              
              // Initialize rich text editor for the new card
              const cardEditorDiv = newCard.querySelector('.rich-text-editor');
              const cardHiddenInput = newCard.querySelector('.editor-content');
              
              const cardEditor = new Quill(cardEditorDiv, quillOptions);
              cardEditor.root.innerHTML = cardHiddenInput.value;
              
              cardEditor.on('text-change', function() {
                cardHiddenInput.value = cardEditor.root.innerHTML;
                updatePreview();
                updateCodeView();
              });
              
              cardEditorDiv.quillEditor = cardEditor;
              
              updatePreview();
              updateCodeView();
            });
          }
        }
      });
      
      // Initialize timeline items sortable
      initTimelineItemSortable(itemsContainer);
    }
    
    // Initialize other timeline block functionality
    setTimeout(() => {
      initTimelineTabs(block);
      initTimelineTypeOptions(block);
      initColorOptions(block);
      initLayoutOptions(block);
    }, 0);
    
    // Add the block with all necessary event handlers
    addBlockWithHandlers(block);
  }

  // Process tabs component
  function processTabs(tabsElement, contentElement) {
    if (!tabsElement || !contentElement) return;
    
    // Create tabs block
    const block = tabsTemplate.cloneNode(true);
    
    // Get tab header items and content panels
    const tabItems = tabsElement.querySelectorAll('li a');
    const tabPanels = contentElement.querySelectorAll('[role="tabpanel"]');
    
    // Clear existing tab panels
    const tabsContainer = block.querySelector('.tabs-container');
    if (tabsContainer) {
      while (tabsContainer.firstChild) {
        tabsContainer.removeChild(tabsContainer.firstChild);
      }
      
      // Add tab panels
      tabItems.forEach((tabItem, index) => {
        const tabTitle = tabItem.textContent.trim();
        let tabContent = '';
        
        // Get corresponding content panel
        if (index < tabPanels.length) {
          tabContent = tabPanels[index].innerHTML.trim();
        }
        
        // Create tab panel element
        const panelItem = document.createElement('div');
        panelItem.className = 'tab-panel mb-2 p-2 border rounded bg-gray-50';
        
        // Panel header
        panelItem.innerHTML = `
          <div class="flex justify-between items-center mb-2">
            <h4 class="text-sm font-medium">Tab ${index + 1}</h4>
            <div class="flex">
              <button class="move-tab text-gray-500 hover:text-gray-700 focus:outline-none mr-2 cursor-move" title="Drag to reorder">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                </svg>
              </button>
              <button class="delete-tab text-red-500 hover:text-red-700 focus:outline-none" title="Delete tab">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
          <div class="mb-2">
            <label class="block mb-1 text-sm">Tab Title</label>
            <input type="text" class="block-input w-full p-2 border rounded" value="${tabTitle}" data-field="tab-title">
            <p class="text-xs text-gray-500 mt-1">Keep titles short (2-3 words recommended)</p>
          </div>
          <div class="mb-2">
            <label class="block mb-1 text-sm">Tab Content</label>
            <div class="editor-container" data-field="tab-content">
              <div class="rich-text-editor"></div>
              <input type="hidden" class="editor-content" value="${tabContent}">
            </div>
          </div>
        `;
        
        // Add panel to container
        tabsContainer.appendChild(panelItem);
        
        // Initialize rich text editor for content
        const editorDiv = panelItem.querySelector('.rich-text-editor');
        const hiddenInput = panelItem.querySelector('.editor-content');
        
        if (editorDiv && hiddenInput) {
          const editor = new Quill(editorDiv, quillOptions);
          editor.root.innerHTML = hiddenInput.value;
          
          // Update hidden input when editor content changes
          editor.on('text-change', function() {
            hiddenInput.value = editor.root.innerHTML;
            updatePreview();
            updateCodeView();
          });
          
          // Store editor instance on the container
          editorDiv.quillEditor = editor;
        }
        
        // Add input change handler for title
        const titleInput = panelItem.querySelector('[data-field="tab-title"]');
        if (titleInput) {
          titleInput.addEventListener('input', function() {
            updatePreview();
            updateCodeView();
          });
        }
        
        // Add delete tab handler
        const deleteBtn = panelItem.querySelector('.delete-tab');
        if (deleteBtn) {
          deleteBtn.addEventListener('click', function() {
            deleteTabPanel(tabsContainer, panelItem);
          });
        }
      });
      
      // Initialize tab panel sortable
      initTabPanelSortable(tabsContainer);
    }
    
    // Add the block with all necessary event handlers
    addBlockWithHandlers(block);
  }

  // Process table
  function processTable(element) {
    // Create table block
    const block = tableTemplate.cloneNode(true);
    
    // Get the table inside the container
    const table = element.querySelector('table');
    if (!table) return;
    
    // Extract color class
    let colorClass = 'deep-teal';
    if (element.classList.contains('border-4')) {
      for (const className of element.classList) {
        if (className.startsWith('border-') && !className.startsWith('border-4')) {
          colorClass = className.replace('border-', '');
          break;
        }
      }
    }
    
    // Get headers and count columns
    const headerCells = table.querySelectorAll('thead th');
    const columnCount = headerCells.length;
    
    // Set table settings
    const colsInput = block.querySelector('.selected-cols');
    const colorInput = block.querySelector('[data-field="color"]');
    
    if (colsInput) colsInput.value = columnCount.toString();
    if (colorInput) colorInput.value = colorClass;
    
    // Update UI to show selected column count and color
    const colsOptions = block.querySelectorAll('.table-cols-option');
    colsOptions.forEach(option => {
      if (option.getAttribute('data-cols') === columnCount.toString()) {
        option.classList.add('table-cols-selected');
      } else {
        option.classList.remove('table-cols-selected');
      }
    });
    
    const colorOptions = block.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
      if (option.getAttribute('data-color') === colorClass) {
        option.classList.add('selected');
      } else {
        option.classList.remove('selected');
      }
    });
    
    // Update table headers based on column count
    const headersContainer = block.querySelector('.table-headers');
    if (headersContainer) {
      while (headersContainer.firstChild) {
        headersContainer.removeChild(headersContainer.firstChild);
      }
      
      headersContainer.className = `table-headers grid grid-cols-${columnCount} gap-2 mb-2`;
      
      // Add header inputs
      headerCells.forEach((headerCell, index) => {
        const headerText = headerCell.textContent.trim();
        
        const headerInputDiv = document.createElement('div');
        headerInputDiv.className = 'header-input';
        
        const headerInput = document.createElement('input');
        headerInput.type = 'text';
        headerInput.className = 'block-input w-full p-2 border rounded';
        headerInput.value = headerText;
        headerInput.setAttribute('data-field', `header-${index}`);
        
        // Add input change handler
        headerInput.addEventListener('input', function() {
          // Update all cell labels when header changes
          updateCellLabels(block, index, this.value);
          updatePreview();
          updateCodeView();
        });
        
        headerInputDiv.appendChild(headerInput);
        headersContainer.appendChild(headerInputDiv);
      });
    }
    
    // Clear existing rows
    const rowsContainer = block.querySelector('.table-rows-container');
    if (rowsContainer) {
      while (rowsContainer.firstChild) {
        rowsContainer.removeChild(rowsContainer.firstChild);
      }
      
      // Get table body rows
      const tableRows = table.querySelectorAll('tbody tr');
      
      // Add rows
      tableRows.forEach((tableRow, rowIndex) => {
        // Create row
        const rowDiv = document.createElement('div');
        rowDiv.className = 'table-row mb-2 p-2 border rounded bg-gray-50';
        
        // Row header
        rowDiv.innerHTML = `
          <div class="flex justify-between items-center mb-2">
            <h4 class="text-sm font-medium">Row ${rowIndex + 1}</h4>
            <div class="flex">
              <button class="move-row text-gray-500 hover:text-gray-700 focus:outline-none mr-2 cursor-move" title="Drag to reorder">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                </svg>
              </button>
              <button class="delete-row text-red-500 hover:text-red-700 focus:outline-none" title="Delete row">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        `;
        
        // Cells container
        const cellsDiv = document.createElement('div');
        cellsDiv.className = `grid grid-cols-${columnCount} gap-2 row-cells`;
        rowDiv.appendChild(cellsDiv);
        
        // Get cells
        const cells = tableRow.querySelectorAll('th, td');
        
        // Create inputs for cells
        cells.forEach((cell, cellIndex) => {
          const cellValue = cell.textContent.trim();
          const headerText = headerCells[cellIndex]?.textContent.trim() || `Column ${cellIndex + 1}`;
          
          const cellDiv = document.createElement('div');
          cellDiv.className = 'mb-2';
          
          const cellLabel = document.createElement('label');
          cellLabel.className = 'block mb-1 text-xs';
          cellLabel.textContent = headerText;
          
          let cellInput;
          if (cellIndex === 0) {
            // First column is usually a header cell with shorter text
            cellInput = document.createElement('input');
            cellInput.type = 'text';
            cellInput.className = 'block-input w-full p-2 border rounded';
          } else {
            // Other columns are usually content cells with longer text
            cellInput = document.createElement('textarea');
            cellInput.className = 'block-input w-full p-2 border rounded';
            cellInput.rows = 3;
          }
          
          cellInput.value = cellValue;
          cellInput.setAttribute('data-field', `cell-${cellIndex}`);
          
          // Add input change handler
          cellInput.addEventListener('input', function() {
            updatePreview();
            updateCodeView();
          });
          
          cellDiv.appendChild(cellLabel);
          cellDiv.appendChild(cellInput);
          cellsDiv.appendChild(cellDiv);
        });
        
        // Add delete row handler
        const deleteBtn = rowDiv.querySelector('.delete-row');
        if (deleteBtn) {
          deleteBtn.addEventListener('click', function() {
            deleteTableRow(rowsContainer, rowDiv);
          });
        }
        
        // Add row to container
        rowsContainer.appendChild(rowDiv);
      });
      
      // Initialize table rows sortable
      initTableRowsSortable(rowsContainer);
    }
    
    // Initialize other table block functionality
    setTimeout(() => {
      initTableTabs(block);
      initTableColumnOptions(block);
      initColorOptions(block);
    }, 0);
    
    // Add the block with all necessary event handlers
    addBlockWithHandlers(block);
  }

  // Process video
  function processVideo(element, linksList) {
    // Create video block
    const block = videoTemplate.cloneNode(true);
    
    // Determine video type and extract embed code
    const iframe = element.querySelector('iframe');
    
    if (!iframe) return;
    
    let videoType = 'youtube';
    let videoURL = '';
    
    // Check if it's YouTube or YuJa based on src attribute
    if (iframe.src && iframe.src.includes('youtube.com')) {
      videoType = 'youtube';
      videoURL = iframe.src;
    } else if (iframe.src && iframe.src.includes('yuja.com')) {
      videoType = 'yuja';
      // Get full iframe HTML for YuJa
      videoURL = iframe.outerHTML;
    }
    
    // Set video type and URL
    const videoTypeInput = block.querySelector('.selected-video-type');
    const youtubeUrlInput = block.querySelector('[data-field="youtube-url"]');
    const yujaCodeInput = block.querySelector('[data-field="yuja-code"]');
    
    if (videoTypeInput) videoTypeInput.value = videoType;
    
    if (videoType === 'youtube' && youtubeUrlInput) {
      youtubeUrlInput.value = videoURL;
    } else if (videoType === 'yuja' && yujaCodeInput) {
      yujaCodeInput.value = videoURL;
    }
    
    // Update UI to show selected video type
    const typeOptions = block.querySelectorAll('.video-type-option');
    typeOptions.forEach(option => {
      if (option.getAttribute('data-type') === videoType) {
        option.classList.add('video-type-selected');
      } else {
        option.classList.remove('video-type-selected');
      }
    });
    
    // Show/hide relevant inputs
    const youtubeInput = block.querySelector('.youtube-input');
    const yujaInput = block.querySelector('.yuja-input');
    
    if (videoType === 'youtube') {
      youtubeInput.classList.remove('hidden');
      yujaInput.classList.add('hidden');
    } else if (videoType === 'yuja') {
      youtubeInput.classList.add('hidden');
      yujaInput.classList.remove('hidden');
    }
    
    // Extract transcript and direct links if available
    if (linksList) {
      const linkItems = linksList.querySelectorAll('li a');
      
      linkItems.forEach(link => {
        const linkText = link.textContent.trim().toLowerCase();
        
        if (linkText.includes('transcript')) {
          const transcriptInput = block.querySelector('[data-field="transcript-url"]');
          if (transcriptInput) transcriptInput.value = link.href;
        } else if (linkText.includes('direct') || linkText.includes('video link')) {
          const directInput = block.querySelector('[data-field="direct-url"]');
          if (directInput) directInput.value = link.href;
        }
      });
    }
    
    // Initialize other video block functionality
    setTimeout(() => {
      initVideoTabs(block);
      initVideoTypeOptions(block);
    }, 0);
    
    // Add the block with all necessary event handlers
    addBlockWithHandlers(block);
  }

  // Process image
  function processImage(element) {
    // Create image block
    const block = imageTemplate.cloneNode(true);
    
    // Determine image alignment
    let alignType = 'left';
    
    if (element.classList.contains('flex') && element.classList.contains('flex-col') && element.classList.contains('items-center')) {
      alignType = 'center';
    } else if (element.classList.contains('grid') && element.classList.contains('md:grid-cols-2')) {
      alignType = 'column';
    }
    
    // Extract image details
    const img = element.querySelector('img');
    const attribution = element.querySelector('p.text-sm');
    
    if (!img) return;
    
    const imageUrl = img.src || '';
    const imageAlt = img.alt || '';
    const attributionText = attribution ? attribution.textContent.trim() : '';
    
    // Set image details
    const urlInput = block.querySelector('[data-field="image-url"]');
    const altInput = block.querySelector('[data-field="image-alt"]');
    const attributionInput = block.querySelector('[data-field="image-attribution"]');
    const alignInput = block.querySelector('[data-field="align"]');
    
    if (urlInput) urlInput.value = imageUrl;
    if (altInput) altInput.value = imageAlt;
    if (attributionInput) attributionInput.value = attributionText;
    if (alignInput) alignInput.value = alignType;
    
    // Update UI to show selected alignment
    const alignOptions = block.querySelectorAll('.image-align-option');
    alignOptions.forEach(option => {
      if (option.getAttribute('data-align') === alignType) {
        option.classList.add('image-align-selected');
      } else {
        option.classList.remove('image-align-selected');
      }
    });
    
    // For column layout, extract column text and order
    if (alignType === 'column') {
      const textDiv = element.querySelector('.flex.items-center');
      const columnTextContainer = block.querySelector('.column-text-container');
      const reverseColumnsCheckbox = block.querySelector('[data-field="reverse-columns"]');
      
      if (columnTextContainer) columnTextContainer.classList.remove('hidden');
      
      if (textDiv) {
        const editorContainer = block.querySelector('.column-text-editor');
        if (editorContainer) {
          const hiddenInput = editorContainer.querySelector('.editor-content');
          if (hiddenInput) {
            hiddenInput.value = textDiv.innerHTML;
            
            // Initialize rich text editor
            const editorDiv = editorContainer.querySelector('.column-text-rich-editor');
            if (editorDiv) {
              // Create a custom options object that uses a single toolbar
              const columnEditorOptions = {
                modules: {
                  toolbar: {
                    container: [
                      [{ 'header': [1, 2, 3, false] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      ['link'],
                      [{ 'list': 'ordered'}, { 'list': 'bullet' }]
                    ]
                  }
                },
                placeholder: 'Enter column text here...',
                theme: 'snow'
              };
              
              const editor = new Quill(editorDiv, columnEditorOptions);
              editor.root.innerHTML = hiddenInput.value;
              
              editor.on('text-change', function() {
                hiddenInput.value = editor.root.innerHTML;
                updatePreview();
                updateCodeView();
              });
              
              // Store editor instance on the container
              editorDiv.quillEditor = editor;
            }
          }
        }
        
        // Check for reverse order
        if (reverseColumnsCheckbox) {
          // In reverse order, the image comes first
          const firstChild = element.firstElementChild;
          reverseColumnsCheckbox.checked = firstChild && firstChild.querySelector('img');
        }
      }
    }
    
    // Initialize other image block functionality
    setTimeout(() => {
      initImageTabs(block);
      initImageAlignOptions(block);
    }, 0);
    
    // Add the block with all necessary event handlers
    addBlockWithHandlers(block);
  }

  // Clear all blocks except the page title
  function clearBlocks() {
    // Get all blocks except the page title
    const blocks = Array.from(sortableBlocks.querySelectorAll('.block-item'));
    
    // Remove all blocks
    blocks.forEach(block => {
      block.remove();
    });
    
    // Add empty message if no blocks left
    checkEmptyBlocks();
  }

  // Function to add a block with all necessary event handlers
  function addBlockWithHandlers(block) {
    if (!block) return;
    
    // Clear the empty state message if it exists
    clearEmptyMessage();
    
    // Add collapse/expand functionality
    const header = block.querySelector('.flex.justify-between.items-center');
    const blockContent = block.querySelector('.block-content');
    
    if (header && blockContent) {
      // Set initial state (expanded)
      block.setAttribute('data-collapsed', 'false');
      
      // Add toggle button event
      const toggleBtn = block.querySelector('.collapse-toggle');
      if (toggleBtn) {
        toggleBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          
          const isCollapsed = block.getAttribute('data-collapsed') === 'true';
          
          if (isCollapsed) {
            // Expand
            blockContent.style.display = 'block';
            block.setAttribute('data-collapsed', 'false');
            this.querySelector('svg').style.transform = 'rotate(0deg)';
          } else {
            // Collapse
            blockContent.style.display = 'none';
            block.setAttribute('data-collapsed', 'true');
            this.querySelector('svg').style.transform = 'rotate(-90deg)';
          }
        });
      }
    }
    
    // Add delete handler
    const deleteBtn = block.querySelector('.delete-block');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', function() {
        block.remove();
        updatePreview();
        updateCodeView();
        checkEmptyBlocks();
      });
    }
    
    // Add the block to the sortable container
    sortableBlocks.appendChild(block);
    updatePreview();
    updateCodeView();
  }
  
  // Add block function (for adding new blocks from component selector)
  function addBlock(type) {
    clearEmptyMessage();
    
    let templateClone;
    
    switch(type) {
      case 'text':
        templateClone = textTemplate.cloneNode(true);
        break;
      
      case 'card':
        templateClone = cardTemplate.cloneNode(true);
        
        // Initialize the cards container for sortable
        if (templateClone) {
          setTimeout(() => {
            const cardsContainer = templateClone.querySelector('.cards-container');
            if (cardsContainer) {
              initCardSortable(cardsContainer);
            }
            
            // Initialize card tabs
            initCardTabs(templateClone);
            
            // Initialize color options
            initColorOptions(templateClone);
            
            // Initialize layout options
            initLayoutOptions(templateClone);
            initCardTypeOptions(templateClone);
          }, 0);

          // Ensure Type tab is handled correctly
          if (type === 'card') {
            setTimeout(() => {
              const typeTab = templateClone.querySelector('.card-tab[data-tab="type"]');
              const typeContent = templateClone.querySelector('.card-tab-content[data-tab-content="type"]');
              
              if (typeTab && typeContent) {
                typeTab.addEventListener('click', function() {
                  // Hide all tab contents
                  templateClone.querySelectorAll('.card-tab-content').forEach(content => {
                    content.classList.add('hidden');
                  });
                  
                  // Deactivate all tabs
                  templateClone.querySelectorAll('.card-tab').forEach(tab => {
                    tab.classList.remove('card-tab-active');
                  });
                  
                  // Activate type tab and content
                  typeTab.classList.add('card-tab-active');
                  typeContent.classList.remove('hidden');
                });
              }
            }, 100);
          }
        }
        break;

      case 'accordion':
        templateClone = accordionTemplate.cloneNode(true);
        
        // Initialize the panels container for sortable
        if (templateClone) {
          setTimeout(() => {
            const panelsContainer = templateClone.querySelector('.accordion-panels-container');
            if (panelsContainer) {
              initAccordionPanelSortable(panelsContainer);
            }
            
            // Initialize accordion tabs
            initAccordionTabs(templateClone);
            
            // Initialize color options
            initColorOptions(templateClone);
            
            // Initialize accordion type options
            initAccordionTypeOptions(templateClone);
          }, 0);
        }
        break;

      case 'timeline':
        templateClone = timelineTemplate.cloneNode(true);
        
        // Initialize the timeline items container for sortable
        if (templateClone) {
          setTimeout(() => {
            const timelineItemsContainer = templateClone.querySelector('.timeline-items-container');
            if (timelineItemsContainer) {
              initTimelineItemSortable(timelineItemsContainer);
            }
            
            // Initialize timeline tabs
            initTimelineTabs(templateClone);
            
            // Initialize timeline type options
            initTimelineTypeOptions(templateClone);
            
            // Initialize color options for timeline cards
            initColorOptions(templateClone);
            
            // Initialize layout options for timeline cards
            initLayoutOptions(templateClone);
          }, 0);
        }
        break;

      case 'tabs':
        templateClone = tabsTemplate.cloneNode(true);
        
        // Initialize the tabs container for sortable
        if (templateClone) {
          setTimeout(() => {
            const tabsContainer = templateClone.querySelector('.tabs-container');
            if (tabsContainer) {
              initTabPanelSortable(tabsContainer);
            }
          }, 0);
        }
        break;

      case 'table':
        templateClone = tableTemplate.cloneNode(true);
        
        // Initialize the table
        if (templateClone) {
          setTimeout(() => {
            // Initialize table tabs
            initTableTabs(templateClone);
            
            // Initialize column selection
            initTableColumnOptions(templateClone);
            
            // Initialize color options
            initColorOptions(templateClone);
            
            // Initialize table rows sortable
            const rowsContainer = templateClone.querySelector('.table-rows-container');
            if (rowsContainer) {
              initTableRowsSortable(rowsContainer);
            }
          }, 0);
        }
        break;

      case 'video':
        templateClone = videoTemplate.cloneNode(true);
        
        // Initialize the video if found
        if (templateClone) {
          setTimeout(() => {
            // Initialize video tabs
            initVideoTabs(templateClone);
            
            // Initialize video type options
            initVideoTypeOptions(templateClone);
            
            // Set up input change handlers
            const videoInputs = templateClone.querySelectorAll('input:not([type="hidden"]), textarea');
            videoInputs.forEach(input => {
              input.addEventListener('input', function() {
                updatePreview();
                updateCodeView();
              });
            });
            
            // Set up checkbox change handlers
            const checkboxInputs = templateClone.querySelectorAll('input[type="checkbox"]');
            checkboxInputs.forEach(checkbox => {
              checkbox.addEventListener('change', function() {
                updatePreview();
                updateCodeView();
              });
            });
          }, 0);
        }
        break;

      case 'image':
        templateClone = imageTemplate.cloneNode(true);
        
        // Initialize the image if found
        if (templateClone) {
          setTimeout(() => {
            // Initialize image tabs
            initImageTabs(templateClone);
            
            // Initialize image align options
            initImageAlignOptions(templateClone);

            // Set default, editable placeholder (but not value) for image URL field
            const imageUrlInput = templateClone.querySelector('[data-field="image-url"]');
            if (imageUrlInput) {
              // Set placeholder but not value (just like the icon accordion)
              imageUrlInput.placeholder = '/content/enforced/your-course-id/your-image.jpg';
              imageUrlInput.value = '';  // Empty value so user can type directly
            }
            
            // Set placeholder for alt text field
            const imageAltInput = templateClone.querySelector('[data-field="image-alt"]');
            if (imageAltInput) {
              imageAltInput.placeholder = 'Image description';
              imageAltInput.value = '';
            }

            // Set placeholder for attribution field
            const imageAttributionInput = templateClone.querySelector('[data-field="image-attribution"]');
            if (imageAttributionInput) {
              imageAttributionInput.placeholder = 'Image Attribution';
              imageAttributionInput.value = '';
            }
            
            // Initialize the rich text editor for column text using a single toolbar
            const editorContainer = templateClone.querySelector('.column-text-editor');
            if (editorContainer) {
              // Find the editor element with our custom class
              const editorDiv = editorContainer.querySelector('.column-text-rich-editor');
              const hiddenInput = editorContainer.querySelector('.editor-content');
              
              if (editorDiv && hiddenInput) {
                // Create a custom options object that uses a single toolbar
                const columnEditorOptions = {
                  modules: {
                    toolbar: {
                      container: [
                        [{ 'header': [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        ['link'],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }]
                      ]
                    }
                  },
                  placeholder: 'Enter column text here...',
                  theme: 'snow'
                };
                
                const editor = new Quill(editorDiv, columnEditorOptions);
                editor.root.innerHTML = hiddenInput.value;
                
                editor.on('text-change', function() {
                  hiddenInput.value = editor.root.innerHTML;
                  updatePreview();
                  updateCodeView();
                });
                
                // Store editor instance on the container
                editorDiv.quillEditor = editor;
              }
            }

            // Add event listener for column order checkbox
            const reverseColumnsCheckbox = templateClone.querySelector('[data-field="reverse-columns"]');
            if (reverseColumnsCheckbox) {
              reverseColumnsCheckbox.addEventListener('change', function() {
                updatePreview();
                updateCodeView();
              });
            }
            
            // Set up input change handlers
            const imageInputs = templateClone.querySelectorAll('input[type="text"]');
            imageInputs.forEach(input => {
              input.addEventListener('input', function() {
                updatePreview();
                updateCodeView();
              });
            });
          }, 0);
        }
        break;
        
      // Additional component types would be handled here
      default:
        return;
    }

    if (!templateClone) return;
    
    // Initialize rich text editors if any
    const richTextContainers = templateClone.querySelectorAll('.rich-text-editor');
    richTextContainers.forEach(container => {
      const editorContainer = container.closest('.editor-container');
      if (!editorContainer) return;
      
      const hiddenInput = editorContainer.querySelector('.editor-content');
      if (!hiddenInput) return;
      
      const initialValue = hiddenInput.value;
      
      // Initialize Quill editor
      const editor = new Quill(container, quillOptions);
      editor.root.innerHTML = initialValue;
      
      // Update hidden input when editor content changes
      editor.on('text-change', function() {
        hiddenInput.value = editor.root.innerHTML;
        updatePreview();
        updateCodeView();
      });
      
      // Store editor instance on the container
      container.quillEditor = editor;
    });
    
    // Add standard input change handlers
    const regularInputs = templateClone.querySelectorAll('input:not(.editor-content):not([type="hidden"]), select');
    regularInputs.forEach(input => {
      input.addEventListener('input', function() {
        updatePreview();
        updateCodeView();
      });
    });
    
    // Add the block with all necessary event handlers
    addBlockWithHandlers(templateClone);
  }
  
  // Function to initialize card sortable
  function initCardSortable(container) {
    if (!container) return;
    
    new Sortable(container, {
      animation: 150,
      handle: '.move-card',
      ghostClass: 'sortable-ghost',
      onEnd: function() {
        // Renumber cards after sorting
        const cards = Array.from(container.querySelectorAll('.card-item'));
        cards.forEach((card, index) => {
          const cardHeader = card.querySelector('h4');
          if (cardHeader) {
            cardHeader.textContent = `Card ${index + 1}`;
          }
        });
        
        updatePreview();
        updateCodeView();
      }
    });

    // Add card button functionality
    const addCardBtn = container.closest('.block-content').querySelector('.add-card-btn');
    if (addCardBtn) {
      addCardBtn.addEventListener('click', function() {
        const cardsCount = container.querySelectorAll('.card-item').length;
        addCard(container, cardsCount + 1);
        updatePreview();
        updateCodeView();
      });
    }
  }

  // Initialize card tabs
  function initCardTabs(cardBlock) {
    const tabs = cardBlock.querySelectorAll('.card-tab');
    const tabContents = cardBlock.querySelectorAll('.card-tab-content');
    
    tabs.forEach(tab => {
      const tabName = tab.getAttribute('data-tab');
      
      tab.addEventListener('click', function() {
        const clickedTabName = this.getAttribute('data-tab');
        
        // Deactivate all tabs
        tabs.forEach(t => t.classList.remove('card-tab-active'));
        tabContents.forEach(tc => tc.classList.add('hidden'));
        
        // Activate selected tab
        this.classList.add('card-tab-active');
        const activeContent = cardBlock.querySelector(`.card-tab-content[data-tab-content="${clickedTabName}"]`);
        
        if (activeContent) {
          activeContent.classList.remove('hidden');
        }
      });
    });
  }

  // Initialize accordion tabs
  function initAccordionTabs(accordionBlock) {
    const tabs = accordionBlock.querySelectorAll('.accordion-tab');
    const tabContents = accordionBlock.querySelectorAll('.accordion-tab-content');
    
    tabs.forEach(tab => {
      tab.addEventListener('click', function() {
        const tabName = this.getAttribute('data-tab');
        
        // Deactivate all tabs
        tabs.forEach(t => t.classList.remove('accordion-tab-active'));
        tabContents.forEach(tc => tc.classList.add('hidden'));
        
        // Activate selected tab
        this.classList.add('accordion-tab-active');
        const activeContent = accordionBlock.querySelector(`.accordion-tab-content[data-tab-content="${tabName}"]`);
        if (activeContent) {
          activeContent.classList.remove('hidden');
        }
      });
    });
  }

  // Initialize color options
  function initColorOptions(block) {
    const colorOptions = block.querySelectorAll('.color-option');
    const selectedColorInput = block.querySelector('.selected-color');
    
    if (!colorOptions.length || !selectedColorInput) return;
    
    // Mark initial selected color
    const initialColor = selectedColorInput.value;
    colorOptions.forEach(option => {
      if (option.getAttribute('data-color') === initialColor) {
        option.classList.add('selected');
      }
      
      option.addEventListener('click', function() {
        // Update selected state
        colorOptions.forEach(opt => opt.classList.remove('selected'));
        this.classList.add('selected');
        
        // Update hidden input
        const colorValue = this.getAttribute('data-color');
        selectedColorInput.value = colorValue;
        
        updatePreview();
        updateCodeView();
      });
    });
  }

  // Initialize layout options
  function initLayoutOptions(block) {
    const layoutOptions = block.querySelectorAll('.layout-option');
    const selectedLayoutInput = block.querySelector('.selected-layout');
    
    if (!layoutOptions.length || !selectedLayoutInput) return;
    
    // Mark initial selected layout
    const initialLayout = selectedLayoutInput.value;
    layoutOptions.forEach(option => {
      if (option.getAttribute('data-layout') === initialLayout) {
        option.classList.add('layout-selected');
      }
      
      option.addEventListener('click', function() {
        // Update selected state
        layoutOptions.forEach(opt => opt.classList.remove('layout-selected'));
        this.classList.add('layout-selected');
        
        // Update hidden input
        const layoutValue = this.getAttribute('data-layout');
        selectedLayoutInput.value = layoutValue;
        
        updatePreview();
        updateCodeView();
      });
    });
  }

  // Initialize card type options
  function initCardTypeOptions(cardBlock) {
    const typeOptions = cardBlock.querySelectorAll('.card-type-option');
    const selectedTypeInput = cardBlock.querySelector('.selected-card-type');
    const iconContainer = cardBlock.querySelector('.card-icon-container');
    
    if (!typeOptions.length || !selectedTypeInput) return;
    
    // Mark initial selected type
    const initialType = selectedTypeInput.value;
    typeOptions.forEach(option => {
      if (option.getAttribute('data-type') === initialType) {
        option.classList.add('card-type-selected');
      }
      
      option.addEventListener('click', function() {
        // Update selected state
        typeOptions.forEach(opt => opt.classList.remove('card-type-selected'));
        this.classList.add('card-type-selected');
        
        // Update hidden input
        const typeValue = this.getAttribute('data-type');
        selectedTypeInput.value = typeValue;
        
        // Show/hide icon input based on type
        if (typeValue === 'icon' || typeValue === 'left-border-icon') {
          if (iconContainer) iconContainer.classList.remove('hidden');
        } else {
          if (iconContainer) iconContainer.classList.add('hidden');
        }
        
        updatePreview();
        updateCodeView();
      });
    });
    
    // Set initial visibility of icon container
    if (initialType === 'icon' || initialType === 'left-border-icon') {
      if (iconContainer) iconContainer.classList.remove('hidden');
    } else {
      if (iconContainer) iconContainer.classList.add('hidden');
    }
  }

  // Initialize accordion type options
  function initAccordionTypeOptions(accordionBlock) {
    const typeOptions = accordionBlock.querySelectorAll('.accordion-type-option');
    const selectedTypeInput = accordionBlock.querySelector('.selected-type');
    
    if (!typeOptions.length || !selectedTypeInput) return;
    
    // Mark initial selected type
    const initialType = selectedTypeInput.value;
    typeOptions.forEach(option => {
      if (option.getAttribute('data-type') === initialType) {
        option.classList.add('accordion-type-selected');
      }
      
      option.addEventListener('click', function() {
        // Update selected state
        typeOptions.forEach(opt => opt.classList.remove('accordion-type-selected'));
        this.classList.add('accordion-type-selected');
        
        // Update hidden input
        const typeValue = this.getAttribute('data-type');
        selectedTypeInput.value = typeValue;
        
        // Show/hide icon inputs based on type
        const iconContainers = accordionBlock.querySelectorAll('.panel-icon-container');
        if (typeValue === 'icon') {
          iconContainers.forEach(container => {
            container.classList.remove('hidden');
          });
        } else {
          iconContainers.forEach(container => {
            container.classList.add('hidden');
          });
        }
        
        updatePreview();
        updateCodeView();
      });
    });
    
    // Set initial visibility of icon containers
    const iconContainers = accordionBlock.querySelectorAll('.panel-icon-container');
    if (initialType === 'icon') {
      iconContainers.forEach(container => {
        container.classList.remove('hidden');
      });
    } else {
      iconContainers.forEach(container => {
        container.classList.add('hidden');
      });
    }
  }

  // Initialize timeline tabs
  function initTimelineTabs(timelineBlock) {
    const tabs = timelineBlock.querySelectorAll('.timeline-tab');
    const tabContents = timelineBlock.querySelectorAll('.timeline-tab-content');
    
    tabs.forEach(tab => {
      tab.addEventListener('click', function() {
        const tabName = this.getAttribute('data-tab');
        
        // Deactivate all tabs
        tabs.forEach(t => t.classList.remove('timeline-tab-active'));
        tabContents.forEach(tc => tc.classList.add('hidden'));
        
        // Activate selected tab
        this.classList.add('timeline-tab-active');
        const activeContent = timelineBlock.querySelector(`.timeline-tab-content[data-tab-content="${tabName}"]`);
        if (activeContent) {
          activeContent.classList.remove('hidden');
        }
      });
    });
  }

  // Initialize timeline type options
  function initTimelineTypeOptions(timelineBlock) {
    const typeOptions = timelineBlock.querySelectorAll('.timeline-type-option');
    const selectedTypeInput = timelineBlock.querySelector('.selected-timeline-type');
    
    if (!typeOptions.length || !selectedTypeInput) return;
    
    // Mark initial selected type
    const initialType = selectedTypeInput.value;
    typeOptions.forEach(option => {
      if (option.getAttribute('data-type') === initialType) {
        option.classList.add('timeline-type-selected');
      }

      option.addEventListener('click', function() {
        // Update selected state
        typeOptions.forEach(opt => opt.classList.remove('timeline-type-selected'));
        this.classList.add('timeline-type-selected');
        
        // Update hidden input
        const typeValue = this.getAttribute('data-type');
        selectedTypeInput.value = typeValue;
        
        // Show/hide card containers based on type
        const timelineItems = timelineBlock.querySelectorAll('.timeline-item');
        
        timelineItems.forEach(item => {
          const cardContainer = item.querySelector('.timeline-cards-container');
          
          if (typeValue === 'cards') {
            if (cardContainer) cardContainer.classList.remove('hidden');
          } else {
            if (cardContainer) cardContainer.classList.add('hidden');
          }
        });
        
        // Show/hide style tab for timeline with cards
        const styleTab = timelineBlock.querySelector('.timeline-tab[data-tab="style"]');
        if (styleTab) {
          if (typeValue === 'cards') {
            styleTab.classList.remove('hidden');
          } else {
            styleTab.classList.add('hidden');
            // Switch to content tab if currently on style tab
            const activeTab = timelineBlock.querySelector('.timeline-tab-active');
            if (activeTab && activeTab.getAttribute('data-tab') === 'style') {
              const contentTab = timelineBlock.querySelector('.timeline-tab[data-tab="content"]');
              if (contentTab) {
                contentTab.click();
              }
            }
          }
        }
        
        updatePreview();
        updateCodeView();
      });
    });

    // Set initial visibility of card containers
    const timelineItems = timelineBlock.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
      const cardContainer = item.querySelector('.timeline-cards-container');
      
      if (initialType === 'cards') {
        if (cardContainer) cardContainer.classList.remove('hidden');
      } else {
        if (cardContainer) cardContainer.classList.add('hidden');
      }
    });
    
    // Set initial visibility of style tab
    const styleTab = timelineBlock.querySelector('.timeline-tab[data-tab="style"]');
    if (styleTab) {
      if (initialType === 'cards') {
        styleTab.classList.remove('hidden');
      } else {
        styleTab.classList.add('hidden');
      }
    }
  }

  // Initialize timeline item sortable
  function initTimelineItemSortable(container) {
    if (!container) return;
    
    new Sortable(container, {
      animation: 150,
      handle: '.move-timeline-item',
      ghostClass: 'sortable-ghost',
      onEnd: function() {
        // Renumber items after sorting
        const items = Array.from(container.querySelectorAll('.timeline-item'));
        items.forEach((item, index) => {
          const itemHeader = item.querySelector('h4');
          if (itemHeader) {
            itemHeader.textContent = `Timeline Item ${index + 1}`;
          }
        });
        
        updatePreview();
        updateCodeView();
      }
    });

    // Add timeline item button functionality
    const addTimelineBtn = container.closest('.block-content').querySelector('.add-timeline-item');
    if (addTimelineBtn) {
      addTimelineBtn.addEventListener('click', function() {
        const itemsCount = container.querySelectorAll('.timeline-item').length;
        const timelineBlock = container.closest('.block-item[data-type="timeline"]');
        const timelineType = timelineBlock ? timelineBlock.querySelector('.selected-timeline-type').value : 'standard';
        
        // Call addTimelineItem function
        addTimelineItem(container, itemsCount + 1, timelineType);
        updatePreview();
        updateCodeView();
      });
    }

    // Initialize timeline cards if present for each item
    container.querySelectorAll('.timeline-item').forEach(item => {
      // Initialize timeline cards if present
      const timelineCardsContainer = item.querySelector('.timeline-cards');
      if (timelineCardsContainer) {
        initTimelineCardsSortable(timelineCardsContainer);
      }
      
      // Add timeline card button
      const addCardBtn = item.querySelector('.add-timeline-card');
      if (addCardBtn) {
        addCardBtn.addEventListener('click', function() {
          const cardsContainer = this.closest('.timeline-cards-container').querySelector('.timeline-cards');
          const cardsCount = cardsContainer.querySelectorAll('.timeline-card').length;
          const newCard = createTimelineCard(cardsCount + 1);
          cardsContainer.appendChild(newCard);
          
          // Initialize rich text editor for the new card
          const cardEditorDiv = newCard.querySelector('.rich-text-editor');
          const cardHiddenInput = newCard.querySelector('.editor-content');
          
          const cardEditor = new Quill(cardEditorDiv, quillOptions);
          cardEditor.root.innerHTML = cardHiddenInput.value;
          
          cardEditor.on('text-change', function() {
            cardHiddenInput.value = cardEditor.root.innerHTML;
            updatePreview();
            updateCodeView();
          });
          
          cardEditorDiv.quillEditor = cardEditor;
          
          updatePreview();
          updateCodeView();
        });
      }
      
      // Delete timeline item handler
      const deleteBtn = item.querySelector('.delete-timeline-item');
      if (deleteBtn) {
        deleteBtn.addEventListener('click', function() {
          deleteTimelineItem(container, item);
        });
      }
      
      // Initialize delete handlers for timeline cards
      item.querySelectorAll('.delete-timeline-card').forEach(btn => {
        btn.addEventListener('click', function() {
          const card = this.closest('.timeline-card');
          const cardsContainer = card.closest('.timeline-cards');
          deleteTimelineCard(cardsContainer, card);
        });
      });
    });
  }

  // Function to initialize timeline cards sortable
  function initTimelineCardsSortable(container) {
    if (!container) return;
    
    new Sortable(container, {
      animation: 150,
      handle: '.move-timeline-card',
      ghostClass: 'sortable-ghost',
      onEnd: function() {
        // Renumber cards after sorting
        const cards = Array.from(container.querySelectorAll('.timeline-card'));
        cards.forEach((card, index) => {
          const cardHeader = card.querySelector('h5');
          if (cardHeader) {
            cardHeader.textContent = `Card ${index + 1}`;
          }
        });
        
        updatePreview();
        updateCodeView();
      }
    });
  }

  // Helper function to create a timeline card
  function createTimelineCard(cardNumber) {
    // Create new card
    const cardDiv = document.createElement('div');
    cardDiv.className = 'timeline-card mb-2 p-2 border rounded bg-gray-100';
    
    // Card header
    const cardHeaderDiv = document.createElement('div');
    cardHeaderDiv.className = 'flex justify-between items-center mb-2';
    
    const cardTitle = document.createElement('h5');
    cardTitle.className = 'text-xs font-medium';
    cardTitle.textContent = `Card ${cardNumber}`;
    
    const cardControlsDiv = document.createElement('div');
    cardControlsDiv.className = 'flex';
    
    // Move card button
    const moveCardBtn = document.createElement('button');
    moveCardBtn.className = 'move-timeline-card text-gray-500 hover:text-gray-700 focus:outline-none mr-2 cursor-move';
    moveCardBtn.title = 'Drag to reorder';
    moveCardBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
      </svg>
    `;
    
    // Delete card button
    const deleteCardBtn = document.createElement('button');
    deleteCardBtn.className = 'delete-timeline-card text-red-500 hover:text-red-700 focus:outline-none';
    deleteCardBtn.title = 'Delete card';
    deleteCardBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    `;
    
    // Add delete card handler
    deleteCardBtn.addEventListener('click', function() {
      const cardsContainer = this.closest('.timeline-cards');
      const card = this.closest('.timeline-card');
      deleteTimelineCard(cardsContainer, card);
    });
    
    cardControlsDiv.appendChild(moveCardBtn);
    cardControlsDiv.appendChild(deleteCardBtn);
    
    cardHeaderDiv.appendChild(cardTitle);
    cardHeaderDiv.appendChild(cardControlsDiv);

    // Card title input
    const cardTitleDiv = document.createElement('div');
    cardTitleDiv.className = 'mb-2';
    
    const cardTitleLabel = document.createElement('label');
    cardTitleLabel.className = 'block mb-1 text-xs';
    cardTitleLabel.textContent = 'Card Title';
    
    const cardTitleInput = document.createElement('input');
    cardTitleInput.type = 'text';
    cardTitleInput.className = 'block-input w-full p-1 border rounded text-sm';
    cardTitleInput.value = `Card Title ${cardNumber}`;
    cardTitleInput.setAttribute('data-field', 'timeline-card-title');
    
    // Add input change handler
    cardTitleInput.addEventListener('input', function() {
      updatePreview();
      updateCodeView();
    });
    
    cardTitleDiv.appendChild(cardTitleLabel);
    cardTitleDiv.appendChild(cardTitleInput);
    
    // Card content field
    const cardContentDiv = document.createElement('div');
    cardContentDiv.className = 'mb-2';
    
    const cardContentLabel = document.createElement('label');
    cardContentLabel.className = 'block mb-1 text-xs';
    cardContentLabel.textContent = 'Card Content';
    
    const cardEditorContainer = document.createElement('div');
    cardEditorContainer.className = 'editor-container';
    cardEditorContainer.setAttribute('data-field', 'timeline-card-content');
    
    const cardEditorDiv = document.createElement('div');
    cardEditorDiv.className = 'rich-text-editor';
    
    const cardHiddenInput = document.createElement('input');
    cardHiddenInput.type = 'hidden';
    cardHiddenInput.className = 'editor-content';
    cardHiddenInput.value = 'Insert card content here. You can use paragraph text or lists inside cards.';
    
    cardEditorContainer.appendChild(cardEditorDiv);
    cardEditorContainer.appendChild(cardHiddenInput);
    
    cardContentDiv.appendChild(cardContentLabel);
    cardContentDiv.appendChild(cardEditorContainer);
    
    // Assemble card
    cardDiv.appendChild(cardHeaderDiv);
    cardDiv.appendChild(cardTitleDiv);
    cardDiv.appendChild(cardContentDiv);
    
    return cardDiv;
  }

  // Function to delete a timeline item
  function deleteTimelineItem(container, item) {
    // Make sure we don't delete the last item
    if (container.querySelectorAll('.timeline-item').length > 1) {
      item.remove();
      
      // Renumber remaining items
      const remainingItems = Array.from(container.querySelectorAll('.timeline-item'));
      remainingItems.forEach((item, index) => {
        const itemHeader = item.querySelector('h4');
        if (itemHeader) {
          itemHeader.textContent = `Timeline Item ${index + 1}`;
        }
      });
      
      updatePreview();
      updateCodeView();
    } else {
      alert('Timelines must have at least one item.');
    }
  }

  // Function to delete a timeline card
  function deleteTimelineCard(container, card) {
    // Make sure we don't delete the last card
    if (container.querySelectorAll('.timeline-card').length > 1) {
      card.remove();
      
      // Renumber remaining cards
      const remainingCards = Array.from(container.querySelectorAll('.timeline-card'));
      remainingCards.forEach((card, index) => {
        const cardHeader = card.querySelector('h5');
        if (cardHeader) {
          cardHeader.textContent = `Card ${index + 1}`;
        }
      });
      
      updatePreview();
      updateCodeView();
    } else {
      alert('Timeline cards must have at least one card.');
    }
  }

  // Function to add a timeline item
  function addTimelineItem(container, itemNumber, timelineType) {
    if (!container) return;
    
    // Create new timeline item
    const itemDiv = document.createElement('div');
    itemDiv.className = 'timeline-item mb-2 p-2 border rounded bg-gray-50';
    
    // Item header
    const headerDiv = document.createElement('div');
    headerDiv.className = 'flex justify-between items-center mb-2';
    
    const itemTitle = document.createElement('h4');
    itemTitle.className = 'text-sm font-medium';
    itemTitle.textContent = `Timeline Item ${itemNumber}`;
    
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'flex';
    
    // Move button
    const moveBtn = document.createElement('button');
    moveBtn.className = 'move-timeline-item text-gray-500 hover:text-gray-700 focus:outline-none mr-2 cursor-move';
    moveBtn.title = 'Drag to reorder';
    moveBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
      </svg>
    `;
    
    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-timeline-item text-red-500 hover:text-red-700 focus:outline-none';
    deleteBtn.title = 'Delete item';
    deleteBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    `;

    // Add delete item handler
    deleteBtn.addEventListener('click', function() {
      deleteTimelineItem(container, itemDiv);
    });
    
    // Assemble controls
    controlsDiv.appendChild(moveBtn);
    controlsDiv.appendChild(deleteBtn);
    
    headerDiv.appendChild(itemTitle);
    headerDiv.appendChild(controlsDiv);
    
    // Content field
    const contentDiv = document.createElement('div');
    contentDiv.className = 'mb-2';
    
    const contentLabel = document.createElement('label');
    contentLabel.className = 'block mb-1 text-sm';
    contentLabel.textContent = 'Content';
    
    const editorContainer = document.createElement('div');
    editorContainer.className = 'editor-container';
    editorContainer.setAttribute('data-field', 'timeline-content');
    
    const editorDiv = document.createElement('div');
    editorDiv.className = 'rich-text-editor';
    
    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.className = 'editor-content';
    hiddenInput.value = `<h3>Timeline Title ${itemNumber}</h3><p>Insert information about this point here.</p>`;
    
    editorContainer.appendChild(editorDiv);
    editorContainer.appendChild(hiddenInput);
    
    contentDiv.appendChild(contentLabel);
    contentDiv.appendChild(editorContainer);
    
    // Create timeline cards container (only for card timeline type)
    const cardsContainerDiv = document.createElement('div');
    cardsContainerDiv.className = 'timeline-cards-container mb-2 hidden';
    
    const cardsLabel = document.createElement('label');
    cardsLabel.className = 'block mb-1 text-sm';
    cardsLabel.textContent = 'Cards';
    
    const cardsDiv = document.createElement('div');
    cardsDiv.className = 'timeline-cards border p-2 rounded';
    
    // Add one default card
    const cardDiv = createTimelineCard(1);
    cardsDiv.appendChild(cardDiv);
    
    // Add card button
    const addCardBtn = document.createElement('button');
    addCardBtn.className = 'add-timeline-card mt-2 px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300 focus:outline-none flex items-center';
    addCardBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
      </svg>
      Add Card
    `;

    // Add card handler
    addCardBtn.addEventListener('click', function() {
      const cardsContainer = this.closest('.timeline-cards-container').querySelector('.timeline-cards');
      const cardsCount = cardsContainer.querySelectorAll('.timeline-card').length;
      const newCard = createTimelineCard(cardsCount + 1);
      cardsContainer.appendChild(newCard);
      
      // Initialize rich text editor for the new card
      const cardEditorDiv = newCard.querySelector('.rich-text-editor');
      const cardHiddenInput = newCard.querySelector('.editor-content');
      
      const cardEditor = new Quill(cardEditorDiv, quillOptions);
      cardEditor.root.innerHTML = cardHiddenInput.value;
      
      cardEditor.on('text-change', function() {
        cardHiddenInput.value = cardEditor.root.innerHTML;
        updatePreview();
        updateCodeView();
      });
      
      cardEditorDiv.quillEditor = cardEditor;
      
      updatePreview();
      updateCodeView();
    });
    
    cardsContainerDiv.appendChild(cardsLabel);
    cardsContainerDiv.appendChild(cardsDiv);
    cardsContainerDiv.appendChild(addCardBtn);
    
    // Assemble timeline item
    itemDiv.appendChild(headerDiv);
    itemDiv.appendChild(contentDiv);
    itemDiv.appendChild(cardsContainerDiv);
    
    // Set visibility based on timeline type
    if (timelineType === 'cards') {
      cardsContainerDiv.classList.remove('hidden');
    }
    
    // Add to container
    container.appendChild(itemDiv);
    
    // Initialize rich text editor for content
    const editor = new Quill(editorDiv, quillOptions);
    editor.root.innerHTML = hiddenInput.value;
    
    // Update hidden input when editor content changes
    editor.on('text-change', function() {
      hiddenInput.value = editor.root.innerHTML;
      updatePreview();
      updateCodeView();
    });
    
    // Store editor instance on the container
    editorDiv.quillEditor = editor;
    
    // Initialize rich text editor for card content
    const cardEditorDiv = cardDiv.querySelector('.rich-text-editor');
    const cardHiddenInput = cardDiv.querySelector('.editor-content');
    
    if (cardEditorDiv && cardHiddenInput) {
      const cardEditor = new Quill(cardEditorDiv, quillOptions);
      cardEditor.root.innerHTML = cardHiddenInput.value;
      
      // Update hidden input when editor content changes
      cardEditor.on('text-change', function() {
        cardHiddenInput.value = cardEditor.root.innerHTML;
        updatePreview();
        updateCodeView();
      });
      
      // Store editor instance on the container
      cardEditorDiv.quillEditor = cardEditor;
    }

    // Initialize sortable for timeline cards
    if (timelineType === 'cards') {
      initTimelineCardsSortable(cardsDiv);
    }
    
    return itemDiv;
  }

  // Function to initialize accordion panel sortable
  function initAccordionPanelSortable(container) {
    if (!container) return;
    
    new Sortable(container, {
      animation: 150,
      handle: '.move-panel',
      ghostClass: 'sortable-ghost',
      onEnd: function() {
        // Renumber panels after sorting
        const panels = Array.from(container.querySelectorAll('.accordion-panel'));
        panels.forEach((panel, index) => {
          const panelHeader = panel.querySelector('h4');
          if (panelHeader) {
            panelHeader.textContent = `Panel ${index + 1}`;
          }
        });
        
        updatePreview();
        updateCodeView();
      }
    });
    
    // Add panel button functionality
    const addPanelBtn = container.closest('.block-content').querySelector('.add-panel-btn');
    if (addPanelBtn) {
      addPanelBtn.addEventListener('click', function() {
        const panelsCount = container.querySelectorAll('.accordion-panel').length;
        addAccordionPanel(container, panelsCount + 1);
        updatePreview();
        updateCodeView();
      });
    }
    
    // Add delete panel handlers
    container.querySelectorAll('.delete-panel').forEach(btn => {
      btn.addEventListener('click', function() {
        const panel = this.closest('.accordion-panel');
        deleteAccordionPanel(container, panel);
      });
    });
  }

  // Function to add a new accordion panel
  function addAccordionPanel(container, panelNumber) {
    if (!container) return;
    
    // Create new panel
    const panelDiv = document.createElement('div');
    panelDiv.className = 'accordion-panel mb-2 p-2 border rounded bg-gray-50';
    
    // Panel header
    const headerDiv = document.createElement('div');
    headerDiv.className = 'flex justify-between items-center mb-2';
    
    const panelTitle = document.createElement('h4');
    panelTitle.className = 'text-sm font-medium';
    panelTitle.textContent = `Panel ${panelNumber}`;
    
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'flex';

    // Move button
    const moveBtn = document.createElement('button');
    moveBtn.className = 'move-panel text-gray-500 hover:text-gray-700 focus:outline-none mr-2 cursor-move';
    moveBtn.title = 'Drag to reorder';
    moveBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
      </svg>
    `;
    
    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-panel text-red-500 hover:text-red-700 focus:outline-none';
    deleteBtn.title = 'Delete panel';
    deleteBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    `;
    
    // Add delete panel handler
    deleteBtn.addEventListener('click', function() {
      deleteAccordionPanel(container, panelDiv);
    });
    
    // Assemble controls
    controlsDiv.appendChild(moveBtn);
    controlsDiv.appendChild(deleteBtn);
    
    headerDiv.appendChild(panelTitle);
    headerDiv.appendChild(controlsDiv);

    // Title input field
    const titleDiv = document.createElement('div');
    titleDiv.className = 'mb-2';
    
    const titleLabel = document.createElement('label');
    titleLabel.className = 'block mb-1 text-sm';
    titleLabel.textContent = 'Panel Title';
    
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.className = 'block-input w-full p-2 border rounded';
    titleInput.value = `Accordion Panel ${panelNumber}`;
    titleInput.setAttribute('data-field', 'panel-title');
    
    // Add input change handler
    titleInput.addEventListener('input', function() {
      updatePreview();
      updateCodeView();
    });
    
    titleDiv.appendChild(titleLabel);
    titleDiv.appendChild(titleInput);
    
    // Icon input field (hidden by default)
    const iconDiv = document.createElement('div');
    iconDiv.className = 'mb-2 panel-icon-container hidden';
    
    const iconLabel = document.createElement('label');
    iconLabel.className = 'block mb-1 text-sm';
    iconLabel.textContent = 'Icon URL (optional)';
    
    const iconInput = document.createElement('input');
    iconInput.type = 'text';
    iconInput.className = 'block-input w-full p-2 border rounded';
    iconInput.placeholder = '/content/enforced/your-course-id/your-icon.svg';
    iconInput.setAttribute('data-field', 'panel-icon');

    // Add input change handler
    iconInput.addEventListener('input', function() {
      updatePreview();
      updateCodeView();
    });
    
    const iconHelp = document.createElement('p');
    iconHelp.className = 'text-xs text-gray-500 mt-1';
    iconHelp.textContent = 'Full URL to the icon image';
    
    iconDiv.appendChild(iconLabel);
    iconDiv.appendChild(iconInput);
    iconDiv.appendChild(iconHelp);
    
    // Check if we should show the icon field
    const accordionBlock = container.closest('.block-item[data-type="accordion"]');
    if (accordionBlock) {
      const accordionTypeInput = accordionBlock.querySelector('.selected-type');
      if (accordionTypeInput && accordionTypeInput.value === 'icon') {
        iconDiv.classList.remove('hidden');
      }
    }
    
    // Content field
    const contentDiv = document.createElement('div');
    contentDiv.className = 'mb-2';
    
    const contentLabel = document.createElement('label');
    contentLabel.className = 'block mb-1 text-sm';
    contentLabel.textContent = 'Panel Content';
    
    const editorContainer = document.createElement('div');
    editorContainer.className = 'editor-container';
    editorContainer.setAttribute('data-field', 'panel-content');
    
    const editorDiv = document.createElement('div');
    editorDiv.className = 'rich-text-editor';
    
    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.className = 'editor-content';
    hiddenInput.value = 'Insert accordion content here.';
    
    editorContainer.appendChild(editorDiv);
    editorContainer.appendChild(hiddenInput);
    
    contentDiv.appendChild(contentLabel);
    contentDiv.appendChild(editorContainer);

    // Assemble panel
    panelDiv.appendChild(headerDiv);
    panelDiv.appendChild(titleDiv);
    panelDiv.appendChild(iconDiv);
    panelDiv.appendChild(contentDiv);
    
    // Add to container
    container.appendChild(panelDiv);
    
    // Initialize rich text editor
    const editor = new Quill(editorDiv, quillOptions);
    editor.root.innerHTML = hiddenInput.value;
    
    // Update hidden input when editor content changes
    editor.on('text-change', function() {
      hiddenInput.value = editor.root.innerHTML;
      updatePreview();
      updateCodeView();
    });
    
    // Store editor instance on the container
    editorDiv.quillEditor = editor;
    
    return panelDiv;
  }

  // Function to delete an accordion panel
  function deleteAccordionPanel(container, panel) {
    // Make sure we don't delete the last panel
    if (container.querySelectorAll('.accordion-panel').length > 1) {
      panel.remove();
      
      // Renumber remaining panels
      const remainingPanels = Array.from(container.querySelectorAll('.accordion-panel'));
      remainingPanels.forEach((panel, index) => {
        const panelHeader = panel.querySelector('h4');
        if (panelHeader) {
          panelHeader.textContent = `Panel ${index + 1}`;
        }
      });
      
      updatePreview();
      updateCodeView();
    } else {
      alert('Accordion sets must have at least one panel.');
    }
  }

  // Function to initialize tab panel sortable
  function initTabPanelSortable(container) {
    if (!container) return;
    
    new Sortable(container, {
      animation: 150,
      handle: '.move-tab',
      ghostClass: 'sortable-ghost',
      onEnd: function() {
        // Renumber tabs after sorting
        const tabs = Array.from(container.querySelectorAll('.tab-panel'));
        tabs.forEach((tab, index) => {
          const tabHeader = tab.querySelector('h4');
          if (tabHeader) {
            tabHeader.textContent = `Tab ${index + 1}`;
          }
        });
        
        updatePreview();
        updateCodeView();
      }
    });
    
    // Add tab button functionality
    const addTabBtn = container.closest('.block-content').querySelector('.add-tab-btn');
    if (addTabBtn) {
      addTabBtn.addEventListener('click', function() {
        const tabsCount = container.querySelectorAll('.tab-panel').length;
        
        // Limit to 6 tabs as per note
        if (tabsCount >= 6) {
          alert('It is recommended to limit the number of tabs to 6 or fewer. Consider an alternative formatting option.');
          return;
        }
        
        addTabPanel(container, tabsCount + 1);
        updatePreview();
        updateCodeView();
      });
    }
    
    // Add delete tab handlers
    container.querySelectorAll('.delete-tab').forEach(btn => {
      btn.addEventListener('click', function() {
        const panel = this.closest('.tab-panel');
        deleteTabPanel(container, panel);
      });
    });
  }

  // Function to add a new tab panel
  function addTabPanel(container, tabNumber) {
    if (!container) return;
    
    // Create new panel
    const panelDiv = document.createElement('div');
    panelDiv.className = 'tab-panel mb-2 p-2 border rounded bg-gray-50';
    
    // Panel header
    const headerDiv = document.createElement('div');
    headerDiv.className = 'flex justify-between items-center mb-2';
    
    const tabTitle = document.createElement('h4');
    tabTitle.className = 'text-sm font-medium';
    tabTitle.textContent = `Tab ${tabNumber}`;
    
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'flex';
    
    // Move button
    const moveBtn = document.createElement('button');
    moveBtn.className = 'move-tab text-gray-500 hover:text-gray-700 focus:outline-none mr-2 cursor-move';
    moveBtn.title = 'Drag to reorder';
    moveBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
      </svg>
    `;
    
    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-tab text-red-500 hover:text-red-700 focus:outline-none';
    deleteBtn.title = 'Delete tab';
    deleteBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    `;
    
    // Add delete tab handler
    deleteBtn.addEventListener('click', function() {
      deleteTabPanel(container, panelDiv);
    });
    
    // Assemble controls
    controlsDiv.appendChild(moveBtn);
    controlsDiv.appendChild(deleteBtn);
    
    headerDiv.appendChild(tabTitle);
    headerDiv.appendChild(controlsDiv);

    // Title input field
    const titleDiv = document.createElement('div');
    titleDiv.className = 'mb-2';
    
    const titleLabel = document.createElement('label');
    titleLabel.className = 'block mb-1 text-sm';
    titleLabel.textContent = 'Tab Title';
    
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.className = 'block-input w-full p-2 border rounded';
    titleInput.value = `Tab ${tabNumber}`;
    titleInput.setAttribute('data-field', 'tab-title');

    // Add input change handler
    titleInput.addEventListener('input', function() {
      updatePreview();
      updateCodeView();
    });
    
    const titleHelp = document.createElement('p');
    titleHelp.className = 'text-xs text-gray-500 mt-1';
    titleHelp.textContent = 'Keep titles short (2-3 words recommended)';
    
    titleDiv.appendChild(titleLabel);
    titleDiv.appendChild(titleInput);
    titleDiv.appendChild(titleHelp);
    
    // Content field
    const contentDiv = document.createElement('div');
    contentDiv.className = 'mb-2';
    
    const contentLabel = document.createElement('label');
    contentLabel.className = 'block mb-1 text-sm';
    contentLabel.textContent = 'Tab Content';
    
    const editorContainer = document.createElement('div');
    editorContainer.className = 'editor-container';
    editorContainer.setAttribute('data-field', 'tab-content');
    
    const editorDiv = document.createElement('div');
    editorDiv.className = 'rich-text-editor';
    
    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.className = 'editor-content';
    hiddenInput.value = `<p><strong>Tab ${tabNumber} Content</strong></p><p>Enter tab content here.</p>`;
    
    editorContainer.appendChild(editorDiv);
    editorContainer.appendChild(hiddenInput);
    
    contentDiv.appendChild(contentLabel);
    contentDiv.appendChild(editorContainer);

    // Assemble panel
    panelDiv.appendChild(headerDiv);
    panelDiv.appendChild(titleDiv);
    panelDiv.appendChild(contentDiv);
    
    // Add to container
    container.appendChild(panelDiv);
    
    // Initialize rich text editor
    const editor = new Quill(editorDiv, quillOptions);
    editor.root.innerHTML = hiddenInput.value;
    
    // Update hidden input when editor content changes
    editor.on('text-change', function() {
      hiddenInput.value = editor.root.innerHTML;
      updatePreview();
      updateCodeView();
    });
    
    // Store editor instance on the container
    editorDiv.quillEditor = editor;
    
    return panelDiv;
  }

  // Function to delete a tab panel
  function deleteTabPanel(container, panel) {
    // Make sure we don't delete the last tab
    if (container.querySelectorAll('.tab-panel').length > 1) {
      panel.remove();
      
      // Renumber remaining tabs
      const remainingTabs = Array.from(container.querySelectorAll('.tab-panel'));
      remainingTabs.forEach((tab, index) => {
        const tabHeader = tab.querySelector('h4');
        if (tabHeader) {
          tabHeader.textContent = `Tab ${index + 1}`;
        }
      });
      
      updatePreview();
      updateCodeView();
    } else {
      alert('Tab sets must have at least one tab.');
    }
  }

  // Initialize table tabs
  function initTableTabs(tableBlock) {
    const tabs = tableBlock.querySelectorAll('.table-tab');
    const tabContents = tableBlock.querySelectorAll('.table-tab-content');
    
    tabs.forEach(tab => {
      tab.addEventListener('click', function() {
        const tabName = this.getAttribute('data-tab');
        
        // Deactivate all tabs
        tabs.forEach(t => t.classList.remove('table-tab-active'));
        tabContents.forEach(tc => tc.classList.add('hidden'));
        
        // Activate selected tab
        this.classList.add('table-tab-active');
        const activeContent = tableBlock.querySelector(`.table-tab-content[data-tab-content="${tabName}"]`);
        if (activeContent) {
          activeContent.classList.remove('hidden');
        }
      });
    });
  }

  // Initialize table column options
  function initTableColumnOptions(tableBlock) {
    const colOptions = tableBlock.querySelectorAll('.table-cols-option');
    const selectedColsInput = tableBlock.querySelector('.selected-cols');
    
    if (!colOptions.length || !selectedColsInput) return;
    
    // Mark initial selected columns
    const initialCols = selectedColsInput.value;
    colOptions.forEach(option => {
      if (option.getAttribute('data-cols') === initialCols) {
        option.classList.add('table-cols-selected');
      }

      option.addEventListener('click', function() {
        // Update selected state
        colOptions.forEach(opt => opt.classList.remove('table-cols-selected'));
        this.classList.add('table-cols-selected');
        
        // Update hidden input
        const colsValue = this.getAttribute('data-cols');
        selectedColsInput.value = colsValue;
        
        // Update header inputs based on column count
        updateTableHeaders(tableBlock, parseInt(colsValue, 10));
        
        // Update row cells based on column count
        updateTableRowCells(tableBlock, parseInt(colsValue, 10));
        
        updatePreview();
        updateCodeView();
      });
    });
  }

  // Update table headers when column count changes
  function updateTableHeaders(tableBlock, columnCount) {
    const headersContainer = tableBlock.querySelector('.table-headers');
    if (!headersContainer) return;
    
    // Save existing header values
    const existingHeaders = [];
    headersContainer.querySelectorAll('input').forEach((input, index) => {
      existingHeaders[index] = input.value;
    });
    
    // Clear and rebuild header inputs
    headersContainer.innerHTML = '';
    headersContainer.className = `table-headers grid grid-cols-${columnCount} gap-2 mb-2`;
    
    for (let i = 0; i < columnCount; i++) {
      const headerInputDiv = document.createElement('div');
      headerInputDiv.className = 'header-input';
      
      const headerInput = document.createElement('input');
      headerInput.type = 'text';
      headerInput.className = 'block-input w-full p-2 border rounded';
      headerInput.value = existingHeaders[i] || (i === 0 ? 'Topics' : i === 1 ? 'Descriptions' : `Column ${i+1}`);
      headerInput.setAttribute('data-field', `header-${i}`);
      
      // Add input change handler
      headerInput.addEventListener('input', function() {
        // Update all cell labels when header changes
        updateCellLabels(tableBlock, i, this.value);
        updatePreview();
        updateCodeView();
      });
      
      headerInputDiv.appendChild(headerInput);
      headersContainer.appendChild(headerInputDiv);
    }
  }

  // Update cell labels when header values change
  function updateCellLabels(tableBlock, columnIndex, headerValue) {
    if (!tableBlock) return;
    
    const tableRows = tableBlock.querySelectorAll('.table-row');
    tableRows.forEach(row => {
      const cellContainers = row.querySelectorAll('.row-cells > div');
      if (cellContainers.length > columnIndex) {
        const cellLabel = cellContainers[columnIndex].querySelector('label');
        if (cellLabel) {
          cellLabel.textContent = headerValue;
        }
      }
    });
  }

  // Update row cells when column count changes
  function updateTableRowCells(tableBlock, columnCount) {
    const tableRows = tableBlock.querySelectorAll('.table-row');
    if (!tableRows.length) return;
    
    tableRows.forEach(row => {
      const cellsContainer = row.querySelector('.row-cells');
      if (!cellsContainer) return;
      
      // Save existing cell values
      const existingCells = [];
      cellsContainer.querySelectorAll('input, textarea').forEach((input, index) => {
        existingCells[index] = input.value;
      });

      // Clear and rebuild cell inputs
      cellsContainer.innerHTML = '';
      cellsContainer.className = `grid grid-cols-${columnCount} gap-2 row-cells`;
      
      // Get current header values for labels
      const headers = [];
      tableBlock.querySelectorAll('.table-headers input').forEach((input, index) => {
        headers[index] = input.value;
      });
      
      for (let i = 0; i < columnCount; i++) {
        const cellDiv = document.createElement('div');
        cellDiv.className = 'mb-2';
        
        const cellLabel = document.createElement('label');
        cellLabel.className = 'block mb-1 text-xs';
        cellLabel.textContent = headers[i] || `Column ${i+1}`;
        
        let cellInput;
        if (i === 0) {
          // First column is usually a header cell with shorter text
          cellInput = document.createElement('input');
          cellInput.type = 'text';
          cellInput.className = 'block-input w-full p-2 border rounded';
          cellInput.value = existingCells[i] || `Topic ${row.querySelector('h4').textContent.split(' ')[1]}`;
        } else {
          // Other columns are usually content cells with longer text
          cellInput = document.createElement('textarea');
          cellInput.className = 'block-input w-full p-2 border rounded';
          cellInput.rows = 3;
          cellInput.value = existingCells[i] || 'Lorem ipsum, dolor sit amet consectetur adipisicing elit.';
        }
        
        cellInput.setAttribute('data-field', `cell-${i}`);
        
        // Add input change handler
        cellInput.addEventListener('input', function() {
          updatePreview();
          updateCodeView();
        });
        
        cellDiv.appendChild(cellLabel);
        cellDiv.appendChild(cellInput);
        cellsContainer.appendChild(cellDiv);
      }
    });
  }

  // Initialize table rows sortable
  function initTableRowsSortable(container) {
    if (!container) return;
    
    new Sortable(container, {
      animation: 150,
      handle: '.move-row',
      ghostClass: 'sortable-ghost',
      onEnd: function() {
        // Renumber rows after sorting
        const rows = Array.from(container.querySelectorAll('.table-row'));
        rows.forEach((row, index) => {
          const rowHeader = row.querySelector('h4');
          if (rowHeader) {
            rowHeader.textContent = `Row ${index + 1}`;
          }
        });
        
        updatePreview();
        updateCodeView();
      }
    });

    // Add row button functionality
    const addRowBtn = container.closest('.block-content').querySelector('.add-row-btn');
    if (addRowBtn) {
      addRowBtn.addEventListener('click', function() {
        const tableBlock = container.closest('.block-item[data-type="table"]');
        const columnCount = tableBlock ? parseInt(tableBlock.querySelector('.selected-cols').value, 10) : 2;
        const rowsCount = container.querySelectorAll('.table-row').length;
        
        addTableRow(container, rowsCount + 1, columnCount, tableBlock);
        updatePreview();
        updateCodeView();
      });
    }
    
    // Add delete row handlers
    container.querySelectorAll('.delete-row').forEach(btn => {
      btn.addEventListener('click', function() {
        const row = this.closest('.table-row');
        deleteTableRow(container, row);
      });
    });
  }

  // Function to add a new table row
  function addTableRow(container, rowNumber, columnCount, tableBlock) {
    if (!container) return;
    
    // Create new row
    const rowDiv = document.createElement('div');
    rowDiv.className = 'table-row mb-2 p-2 border rounded bg-gray-50';
    
    // Row header
    const headerDiv = document.createElement('div');
    headerDiv.className = 'flex justify-between items-center mb-2';
    
    const rowTitle = document.createElement('h4');
    rowTitle.className = 'text-sm font-medium';
    rowTitle.textContent = `Row ${rowNumber}`;
    
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'flex';
    
    // Move button
    const moveBtn = document.createElement('button');
    moveBtn.className = 'move-row text-gray-500 hover:text-gray-700 focus:outline-none mr-2 cursor-move';
    moveBtn.title = 'Drag to reorder';
    moveBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
      </svg>
    `;
    
    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-row text-red-500 hover:text-red-700 focus:outline-none';
    deleteBtn.title = 'Delete row';
    deleteBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    `;

    // Add delete row handler
    deleteBtn.addEventListener('click', function() {
      deleteTableRow(container, rowDiv);
    });
    
    // Assemble controls
    controlsDiv.appendChild(moveBtn);
    controlsDiv.appendChild(deleteBtn);
    
    headerDiv.appendChild(rowTitle);
    headerDiv.appendChild(controlsDiv);
    
    // Cells container
    const cellsDiv = document.createElement('div');
    cellsDiv.className = `grid grid-cols-${columnCount} gap-2 row-cells`;
    rowDiv.appendChild(cellsDiv);
    
    // Get header values
    const headers = [];
    if (tableBlock) {
      const headerInputs = tableBlock.querySelectorAll('.table-headers input');
      headerInputs.forEach((input, index) => {
        headers[index] = input.value || `Column ${index+1}`;
      });
    }
    
    // Create cells based on column count
    for (let i = 0; i < columnCount; i++) {
      const cellDiv = document.createElement('div');
      cellDiv.className = 'mb-2';
      
      const cellLabel = document.createElement('label');
      cellLabel.className = 'block mb-1 text-xs';
      cellLabel.textContent = headers[i] || `Column ${i+1}`;
      
      let cellInput;
      if (i === 0) {
        // First column is usually a header cell with shorter text
        cellInput = document.createElement('input');
        cellInput.type = 'text';
        cellInput.className = 'block-input w-full p-2 border rounded';
        cellInput.value = `Topic ${rowNumber}`;
      } else {
        // Other columns are usually content cells with longer text
        cellInput = document.createElement('textarea');
        cellInput.className = 'block-input w-full p-2 border rounded';
        cellInput.rows = 3;
        cellInput.value = 'Lorem ipsum, dolor sit amet consectetur adipisicing elit.';
      }
      
      cellInput.setAttribute('data-field', `cell-${i}`);
      
      // Add input change handler
      cellInput.addEventListener('input', function() {
        updatePreview();
        updateCodeView();
      });
      
      cellDiv.appendChild(cellLabel);
      cellDiv.appendChild(cellInput);
      cellsDiv.appendChild(cellDiv);
    }
    
    // Assemble row
    rowDiv.appendChild(headerDiv);
    
    // Add to container
    container.appendChild(rowDiv);
    
    return rowDiv;
  }

  // Function to delete a table row
  function deleteTableRow(container, row) {
    // Make sure we don't delete the last row
    if (container.querySelectorAll('.table-row').length > 1) {
      row.remove();
      
      // Renumber remaining rows
      const remainingRows = Array.from(container.querySelectorAll('.table-row'));
      remainingRows.forEach((row, index) => {
        const rowHeader = row.querySelector('h4');
        if (rowHeader) {
          rowHeader.textContent = `Row ${index + 1}`;
        }
      });
      
      updatePreview();
      updateCodeView();
    } else {
      alert('Tables must have at least one row.');
    }
  }

  // Initialize video tabs
  function initVideoTabs(videoBlock) {
    const tabs = videoBlock.querySelectorAll('.video-tab');
    const tabContents = videoBlock.querySelectorAll('.video-tab-content');
    
    tabs.forEach(tab => {
      tab.addEventListener('click', function() {
        const tabName = this.getAttribute('data-tab');
        
        // Deactivate all tabs
        tabs.forEach(t => t.classList.remove('video-tab-active'));
        tabContents.forEach(tc => tc.classList.add('hidden'));
        
        // Activate selected tab
        this.classList.add('video-tab-active');
        const activeContent = videoBlock.querySelector(`.video-tab-content[data-tab-content="${tabName}"]`);
        if (activeContent) {
          activeContent.classList.remove('hidden');
        }
      });
    });
  }

  // Initialize video type options
  function initVideoTypeOptions(videoBlock) {
    const typeOptions = videoBlock.querySelectorAll('.video-type-option');
    const selectedTypeInput = videoBlock.querySelector('.selected-video-type');
    
    if (!typeOptions.length || !selectedTypeInput) return;
    
    // Mark initial selected type
    const initialType = selectedTypeInput.value;
    typeOptions.forEach(option => {
      if (option.getAttribute('data-type') === initialType) {
        option.classList.add('video-type-selected');
      }
      
      option.addEventListener('click', function() {
        // Update selected state
        typeOptions.forEach(opt => opt.classList.remove('video-type-selected'));
        this.classList.add('video-type-selected');
        
        // Update hidden input
        const typeValue = this.getAttribute('data-type');
        selectedTypeInput.value = typeValue;

        // Show/hide relevant inputs
        const youtubeInput = videoBlock.querySelector('.youtube-input');
        const yujaInput = videoBlock.querySelector('.yuja-input');
        
        if (typeValue === 'youtube') {
          youtubeInput.classList.remove('hidden');
          yujaInput.classList.add('hidden');
        } else if (typeValue === 'yuja') {
          youtubeInput.classList.add('hidden');
          yujaInput.classList.remove('hidden');
        }
        
        updatePreview();
        updateCodeView();
      });
    });
    
    // Set initial visibility of inputs
    const youtubeInput = videoBlock.querySelector('.youtube-input');
    const yujaInput = videoBlock.querySelector('.yuja-input');
    
    if (initialType === 'youtube') {
      youtubeInput.classList.remove('hidden');
      yujaInput.classList.add('hidden');
    } else if (initialType === 'yuja') {
      youtubeInput.classList.add('hidden');
      yujaInput.classList.remove('hidden');
    }
  }

  // Initialize image tabs
  function initImageTabs(imageBlock) {
    const tabs = imageBlock.querySelectorAll('.image-tab');
    const tabContents = imageBlock.querySelectorAll('.image-tab-content');
    
    tabs.forEach(tab => {
      tab.addEventListener('click', function() {
        const tabName = this.getAttribute('data-tab');
        
        // Deactivate all tabs
        tabs.forEach(t => t.classList.remove('image-tab-active'));
        tabContents.forEach(tc => tc.classList.add('hidden'));
        
        // Activate selected tab
        this.classList.add('image-tab-active');
        const activeContent = imageBlock.querySelector(`.image-tab-content[data-tab-content="${tabName}"]`);
        if (activeContent) {
          activeContent.classList.remove('hidden');
        }
      });
    });
  }

  // Initialize image alignment options
  function initImageAlignOptions(imageBlock) {
    const alignOptions = imageBlock.querySelectorAll('.image-align-option');
    const selectedAlignInput = imageBlock.querySelector('.selected-align');
    const columnTextContainer = imageBlock.querySelector('.column-text-container');
    
    if (!alignOptions.length || !selectedAlignInput) return;

    // Mark initial selected alignment
    const initialAlign = selectedAlignInput.value;
    alignOptions.forEach(option => {
      if (option.getAttribute('data-align') === initialAlign) {
        option.classList.add('image-align-selected');
      }
      
      option.addEventListener('click', function() {
        // Update selected state
        alignOptions.forEach(opt => opt.classList.remove('image-align-selected'));
        this.classList.add('image-align-selected');
        
        // Update hidden input
        const alignValue = this.getAttribute('data-align');
        selectedAlignInput.value = alignValue;
        
        // Show/hide column text based on alignment
        if (alignValue === 'column') {
          columnTextContainer.classList.remove('hidden');
        } else {
          columnTextContainer.classList.add('hidden');
        }
        
        updatePreview();
        updateCodeView();
      });
    });
    
    // Set initial visibility of column text container
    if (initialAlign === 'column') {
      columnTextContainer.classList.remove('hidden');
    } else {
      columnTextContainer.classList.add('hidden');
    }
  }

  // Function to add a card
  function addCard(container, cardNumber) {
    if (!container) return;
    
    // Create new card
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card-item mb-2 p-2 border rounded bg-gray-50';
    const cardBlock = container.closest('.block-item[data-type="card"]');
    let cardType = 'standard';
    if (cardBlock) {
      const cardTypeInput = cardBlock.querySelector('.selected-card-type');
      if (cardTypeInput) {
        cardType = cardTypeInput.value;
      }
    }
    
    // Card header
    const headerDiv = document.createElement('div');
    headerDiv.className = 'flex justify-between items-center mb-2';
    
    const cardTitle = document.createElement('h4');
    cardTitle.className = 'text-sm font-medium';
    cardTitle.textContent = `Card ${cardNumber}`;
    
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'flex';
    
    // Move button
    const moveBtn = document.createElement('button');
    moveBtn.className = 'move-card text-gray-500 hover:text-gray-700 focus:outline-none mr-2 cursor-move';
    moveBtn.title = 'Drag to reorder';
    moveBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
      </svg>
    `;
    
    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-card text-red-500 hover:text-red-700 focus:outline-none';
    deleteBtn.title = 'Delete card';
    deleteBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    `;

    // Add delete card handler
    deleteBtn.addEventListener('click', function() {
      // Make sure we don't delete the last card
      if (container.querySelectorAll('.card-item').length > 1) {
        cardDiv.remove();
        
        // Renumber remaining cards
        const remainingCards = Array.from(container.querySelectorAll('.card-item'));
        remainingCards.forEach((card, index) => {
          const cardHeader = card.querySelector('h4');
          if (cardHeader) {
            cardHeader.textContent = `Card ${index + 1}`;
          }
        });
        
        updatePreview();
        updateCodeView();
      } else {
        alert('Card sets must have at least one card.');
      }
    });
    
    // Assemble controls
    controlsDiv.appendChild(moveBtn);
    controlsDiv.appendChild(deleteBtn);
    
    headerDiv.appendChild(cardTitle);
    headerDiv.appendChild(controlsDiv);

    // Title input field
    const titleDiv = document.createElement('div');
    titleDiv.className = 'mb-2';
    
    const titleLabel = document.createElement('label');
    titleLabel.className = 'block mb-1 text-sm';
    titleLabel.textContent = 'Card Title';
    
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.className = 'block-input w-full p-2 border rounded';
    titleInput.value = `Card Title`;
    titleInput.setAttribute('data-field', 'card-title');
    
    // Add input change handler
    titleInput.addEventListener('input', function() {
      updatePreview();
      updateCodeView();
    });
    
    titleDiv.appendChild(titleLabel);
    titleDiv.appendChild(titleInput);

    // Assemble card (start with header and title)
    cardDiv.appendChild(headerDiv);
    cardDiv.appendChild(titleDiv);

    // Add icon input field if needed (for icon cards or left border + icon cards)
    if (cardType === 'icon' || cardType === 'left-border-icon') {
      const iconDiv = document.createElement('div');
      iconDiv.className = 'mb-2';
      
      const iconLabel = document.createElement('label');
      iconLabel.className = 'block mb-1 text-sm';
      iconLabel.textContent = 'Icon URL';
      
      const iconInput = document.createElement('input');
      iconInput.type = 'text';
      iconInput.className = 'block-input w-full p-2 border rounded';
      iconInput.placeholder = '/content/enforced/your-course-id/your-icon.svg';
      iconInput.setAttribute('data-field', 'card-icon');
      
      // Add input change handler
      iconInput.addEventListener('input', function() {
        updatePreview();
        updateCodeView();
      });
      
      const iconHelp = document.createElement('p');
      iconHelp.className = 'text-xs text-gray-500 mt-1';
      iconHelp.textContent = 'Full URL to the icon image';
      
      iconDiv.appendChild(iconLabel);
      iconDiv.appendChild(iconInput);
      iconDiv.appendChild(iconHelp);
      
      // Add icon field to card
      cardDiv.appendChild(iconDiv);
    }

    // Content field
    const contentDiv = document.createElement('div');
    contentDiv.className = 'mb-2';
    
    const contentLabel = document.createElement('label');
    contentLabel.className = 'block mb-1 text-sm';
    contentLabel.textContent = 'Card Content';
    
    const editorContainer = document.createElement('div');
    editorContainer.className = 'editor-container';
    editorContainer.setAttribute('data-field', 'card-content');
    
    const editorDiv = document.createElement('div');
    editorDiv.className = 'rich-text-editor';
    
    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.className = 'editor-content';
    hiddenInput.value = 'Insert card content here.';
    
    editorContainer.appendChild(editorDiv);
    editorContainer.appendChild(hiddenInput);
    
    contentDiv.appendChild(contentLabel);
    contentDiv.appendChild(editorContainer);

    // Add content field
    cardDiv.appendChild(contentDiv);
    
    // Add to container
    container.appendChild(cardDiv);
    
    // Initialize rich text editor
    const editor = new Quill(editorDiv, quillOptions);
    editor.root.innerHTML = hiddenInput.value;
    
    // Update hidden input when editor content changes
    editor.on('text-change', function() {
      hiddenInput.value = editor.root.innerHTML;
      updatePreview();
      updateCodeView();
    });
    
    // Store editor instance on the container
    editorDiv.quillEditor = editor;
    
    return cardDiv;
  }
  
  function clearEmptyMessage() {
    // Clear the empty state message if it exists
    const emptyMessage = sortableBlocks.querySelector('.text-center');
    if (emptyMessage) {
      sortableBlocks.innerHTML = '';
    }
  }
  
  function checkEmptyBlocks() {
    // Add back the empty state message if no blocks
    if (!sortableBlocks.querySelector('.block-item')) {
      sortableBlocks.innerHTML = '<div class="text-center text-gray-500">Add components from the selector above</div>';
    }
  }

  // Update preview
function updatePreview() {
  const html = generateHTML();
  
  // Update the iframe content
  const iframe = document.getElementById('preview-frame');
  if (!iframe) return;

  try {
    // Wait for iframe to be ready
    if (iframe.contentDocument) {
      const iframeDoc = iframe.contentDocument;
      
      // Clear and rewrite the document
      iframeDoc.open();
      iframeDoc.write(html);
      iframeDoc.close();
      
      // Wait for content to load then initialize interactive components
      const iframeWindow = iframe.contentWindow;
      if (iframeWindow) {
        // Give the scripts time to load, then initialize accordions and tabs
        setTimeout(() => {
          try {
            // Initialize accordions
            const accordions = iframeDoc.querySelectorAll('.accordion-controls a');
            accordions.forEach(accordion => {
              accordion.addEventListener('click', function(e) {
                e.preventDefault();
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                const contentId = this.getAttribute('aria-controls');
                const content = iframeDoc.getElementById(contentId);
                const toggle = this.querySelector('.accordion__toggle');
                
                if (content) {
                  if (isExpanded) {
                    this.setAttribute('aria-expanded', 'false');
                    content.setAttribute('aria-hidden', 'true');
                    content.style.maxHeight = '0';
                    if (toggle) toggle.style.transform = 'rotate(0deg)';
                  } else {
                    this.setAttribute('aria-expanded', 'true');
                    content.setAttribute('aria-hidden', 'false');
                    content.style.maxHeight = content.scrollHeight + 'px';
                    if (toggle) toggle.style.transform = 'rotate(180deg)';
                  }
                }
              });
            });
            
            // Initialize tabs
            const tabLinks = iframeDoc.querySelectorAll('.tabs-white a');
            tabLinks.forEach(tab => {
              tab.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Get all tabs and panels in this set
                const tabSet = this.closest('.tabs-white');
                const contentContainer = tabSet.nextElementSibling;
                
                if (!contentContainer) return;
                
                const allTabs = tabSet.querySelectorAll('a');
                const allPanels = contentContainer.querySelectorAll('[role="tabpanel"]');
                
                // Deactivate all tabs and panels
                allTabs.forEach(t => {
                  t.classList.remove('bg-deep-teal', 'text-white');
                  t.classList.add('inactive');
                  t.setAttribute('aria-selected', 'false');
                  t.setAttribute('tabindex', '-1');
                });
                
                allPanels.forEach(p => {
                  p.classList.add('hidden');
                  p.setAttribute('aria-hidden', 'true');
                });
                
                // Activate clicked tab
                this.classList.add('bg-deep-teal', 'text-white');
                this.classList.remove('inactive');
                this.setAttribute('aria-selected', 'true');
                this.setAttribute('tabindex', '0');
                
                // Show corresponding panel
                const panelId = this.getAttribute('aria-controls');
                const activePanel = iframeDoc.getElementById(panelId);
                if (activePanel) {
                  activePanel.classList.remove('hidden');
                  activePanel.setAttribute('aria-hidden', 'false');
                }
              });
            });
          } catch (e) {
            console.log('Could not initialize interactive components:', e);
          }
        }, 100);
      }
    } else {
      // Try alternative method for cross-origin issues
      iframe.srcdoc = html;
    }
  } catch (e) {
    console.error('Error updating preview:', e);
    // Fallback to srcdoc if there are permission issues
    iframe.srcdoc = html;
  }
}

  // HTML generation
  function generateHTML() {
    const pageTitleInput = document.querySelector('[data-type="pageTitle"] [data-field="title"]');
    if (!pageTitleInput) return '';
    
    const pageTitle = pageTitleInput.value;
    
    let html = `<!DOCTYPE html>
<html lang="en" class="w-full overflow-x-hidden">
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageTitle}</title>
  <link rel="stylesheet" href="https://mv-2022-theme.netlify.app/output.css">
  <script src="https://mv-2022-theme.netlify.app/main.js"><\/script>
  <link rel="icon" href="https://michiganvirtual.org/wp-content/uploads/2021/10/cropped-mv-favicon-32x32.png" sizes="32x32">
</head>
<body class="font-body w-full overflow-x-hidden">
<main>
<div class="container mx-auto px-4 lg:px-24 py-12">
<h1>${pageTitle}</h1>
<hr class="border-4 border-green w-12 mb-4">
`;

// Add content from blocks
const blocks = sortableBlocks.querySelectorAll('.block-item');
blocks.forEach(block => {
const type = block.dataset.type;

switch(type) {
  case 'text':
    // Get content from rich text editor's hidden input
    const textContainer = block.querySelector('[data-field="text"]');
    if (!textContainer) return;
    
    const textInput = textContainer.querySelector('.editor-content');
    if (!textInput) return;
    
    const textContent = textInput.value;
    html += `${textContent}\n`;
    break;
    
    case 'card':
      // Get card settings
      const colorInput = block.querySelector('[data-field="color"]');
      const layoutInput = block.querySelector('[data-field="layout"]');
      const cardTypeInput = block.querySelector('[data-field="card-type"]');
      
      if (!colorInput || !layoutInput || !cardTypeInput) return;
      
      const cardColor = colorInput.value;
      const cardLayout = layoutInput.value;
      const cardType = cardTypeInput.value;
      
      // Get all cards in the set
      const cardsContainer = block.querySelector('.cards-container');
      if (!cardsContainer) return;
      
      const cardItems = cardsContainer.querySelectorAll('.card-item');
      if (cardItems.length === 0) return;
      
      // Start card set container
      html += `<!-- START CARD SET -->
    <div class="grid grid-cols-1 lg:grid-cols-${cardLayout} gap-4 ${cardType === 'numbered' ? 'items-center' : ''} mb-12">`;
      
      // Generate each card
      cardItems.forEach((card, index) => {
        const titleInput = card.querySelector('[data-field="card-title"]');
        const contentContainer = card.querySelector('[data-field="card-content"]');
        const iconInput = card.querySelector('[data-field="card-icon"]');
        
        if (!titleInput || !contentContainer) return;
        
        const contentInput = contentContainer.querySelector('.editor-content');
        if (!contentInput) return;
        
        const cardTitle = titleInput.value;
        const cardContent = contentInput.value;
        const iconUrl = iconInput ? iconInput.value : '';
        
        // Different HTML based on card type
        if (cardType === 'standard') {
          // Standard card
          html += `
    <div class="border-4 rounded-md border-${cardColor} flex flex-col h-full w-full shadow-lg rounded-b-md">
      <div class="bg-${cardColor} flex justify-between items-center w-full">
        <h2 class="mb-0 p-4">${cardTitle}</h2>
      </div>
      <div class="text-lg font-normal p-4">${cardContent}</div>
    </div>`;
        } 
        else if (cardType === 'icon') {
          // Icon card
          html += `
    <div class="flex flex-col min-h-full justify-evenly bg-${cardColor} border-4 border-${cardColor} rounded-md w-full">
      <div class="flex flex-col md:flex-row items-center w-full p-4">
        <img src="${iconUrl}" width="30px" class="mb-4 md:mb-0 mr-0 md:mr-4" alt="">
        <h2 class="text-center md:text-left md:w-3/4 mb-0">${cardTitle}</h2>
      </div>
      <div class="bg-white p-4">
        <p class="font-normal">${cardContent}</p>
      </div>
    </div>`;
        }
        else if (cardType === 'left-border') {
          // Left border tab card
          html += `
    <div class="flex flex-col h-full border-l-[36px] border-4 border-${cardColor} p-8 mb-4 w-full rounded-md">
      <h2 class="">${cardTitle}</h2>
      <p class="md:text-lg font-normal">${cardContent}</p>
    </div>`;
        }
        else if (cardType === 'left-border-icon') {
          // Left border with icon card
          html += `
    <div class="flex flex-col md:flex-row border-10 border-${cardColor} rounded-md text-2xl w-full mb-8">
      <div class="flex justify-center items-center bg-${cardColor} w-auto py-4 pl-4 pr-6 md:mr-2">
        <img src="${iconUrl}" style="width: 35px; height: auto;" class="" alt="">
      </div>
      <div class="w-5/6 p-4">
        <h3 class="text-${cardColor}">${cardTitle}</h3>
        <p>${cardContent}</p>
      </div>
    </div>`;
        }
        else if (cardType === 'numbered') {
          // Numbered card
          html += `
    <div class="flex flex-col md:flex-row border-10 border-${cardColor} rounded-md text-2xl w-full mb-4">
      <div class="flex justify-center items-center bg-${cardColor} w-auto py-4 pl-4 pr-6 md:mr-2">
        <span class="font-bold text-5xl">${index + 1}</span>
      </div>
      <div class="w-5/6 p-4">
        <h3 class="text-${cardColor}">${cardTitle}</h3>
        <p>${cardContent}</p>
      </div>
    </div>`;
        }
      });
      
      // End card set container
      html += `
    </div>
    <!-- END CARD SET -->\n`;
      break;

    case 'accordion':
        // Get accordion settings
        const accordionColorInput = block.querySelector('[data-field="color"]');
        const accordionTypeInput = block.querySelector('[data-field="accordion-type"]');
        
        if (!accordionColorInput || !accordionTypeInput) return;
        
        const accordionColor = accordionColorInput.value;
        const accordionType = accordionTypeInput.value;
        
        // Get all panels in the set
        const panelsContainer = block.querySelector('.accordion-panels-container');
        if (!panelsContainer) return;
        
        const accordionPanels = panelsContainer.querySelectorAll('.accordion-panel');
        if (accordionPanels.length === 0) return;
        
        // Generate a unique ID for this accordion set
        const accordionSetId = 'accordion-set-' + Math.random().toString(36).substring(2, 9);
        
        // Start accordion set
        html += `<!-- BEGINNING of ${accordionType === 'icon' ? 'Icon ' : ''}Accordion Set -->
<ul class="shadow-box mb-8 accordion-controls" aria-label="Accordion Control Group Buttons">`;
        
        // Generate each accordion panel
        accordionPanels.forEach((panel, index) => {
          const panelTitleInput = panel.querySelector('[data-field="panel-title"]');
          const panelIconInput = panel.querySelector('[data-field="panel-icon"]');
          const panelContentContainer = panel.querySelector('[data-field="panel-content"]');
          
          if (!panelTitleInput || !panelContentContainer) return;
          
          const contentInput = panelContentContainer.querySelector('.editor-content');
          if (!contentInput) return;
          
          const panelTitle = panelTitleInput.value;
          const panelContent = contentInput.value;
          const panelId = `content-${accordionSetId}-${index + 1}`;
          const controlId = `accordion-control-${accordionSetId}-${index + 1}`;
          
          // Get icon URL if this is an icon accordion
          let iconUrl = '';
          if (accordionType === 'icon' && panelIconInput) {
            iconUrl = panelIconInput.value.trim();
          }
          
          // Determine if this is first, middle, or last panel (for rounded corners)
          const isFirst = index === 0;
          const isLast = index === accordionPanels.length - 1;
          
          const topClass = isFirst ? ' rounded-t-md' : '';
          const bottomClass = isLast ? ' rounded-b-md' : '';
          
          if (accordionType === 'icon') {
            // Icon accordion HTML
            html += `<!-- ACCORDION ${index + 1} -->
<li class="accordion-controls relative bg-${accordionColor} w-full text-left border-b border-gray-200${topClass}${isLast ? ' rounded-b-md' : ''}">
<a class="block flex items-center justify-between w-full h-full p-4" aria-controls="${panelId}" aria-expanded="false" id="${controlId}">
  <span class="flex items-center">
    <img src="${iconUrl}" alt="" class="mr-4" width="30"><span class="font-bold text-xl">${panelTitle}</span>
  </span>
  <img src="https://mv-2022-theme.netlify.app/assets/images/icons/expand-arrow-white.svg" class="accordion__toggle transition-all ease-in-out duration-500" width="30px" alt="">
</a>
<div class="accordion__content bg-white max-h-0 transition-all duration-300 ease-in-out overflow-hidden" aria-hidden="true" id="${panelId}">
  <div class="px-8 py-4 border-4 border-${accordionColor}">
    ${panelContent}
  </div>
</div>
</li>`;
          } else {
            // Regular accordion HTML
            html += `<!-- ACCORDION ${index + 1} -->
<li class="accordion-controls relative bg-${accordionColor} w-full text-left font-bold text-xl border-b border-gray-200${topClass}${isLast ? ' rounded-b-md' : ''}">
<a class="block flex items-center justify-between w-full h-full p-4" aria-controls="${panelId}" aria-expanded="false" id="${controlId}">
  <span class="w-3/4">${panelTitle}</span>
  <img src="https://mv-2022-theme.netlify.app/assets/images/icons/expand-arrow-white.svg" class="accordion__toggle transition-all ease-in-out duration-500" alt="" width="30px">
</a>
<div class="accordion__content bg-white font-normal max-h-0 transition-all duration-300 ease-in-out overflow-hidden" aria-hidden="true" id="${panelId}">
  <div class="px-8 py-4 border-4 border-${accordionColor}">
    ${panelContent}
  </div>
</div>
</li>`;
          }
        });
        
        // End accordion set
        html += `
</ul>
<!-- END of ${accordionType === 'icon' ? 'Icon ' : ''}Accordion Set -->\n`;
        break;

        case 'timeline':
// Get timeline settings
const timelineTypeInput = block.querySelector('[data-field="timeline-type"]');

if (!timelineTypeInput) return;

const timelineType = timelineTypeInput.value;

// Get all timeline items
const timelineItemsContainer = block.querySelector('.timeline-items-container');
if (!timelineItemsContainer) return;

const timelineItems = timelineItemsContainer.querySelectorAll('.timeline-item');
if (timelineItems.length === 0) return;

if (timelineType === 'standard') {
  // Generate standard timeline HTML
  
  // Start timeline
  html += `<!-- START OF TIMELINE -->
<ol class="relative border-l border-deep-teal mb-8">`;
  
  // Generate each timeline item
  timelineItems.forEach(item => {
    const contentContainer = item.querySelector('[data-field="timeline-content"]');
    
    if (!contentContainer) return;
    
    const contentInput = contentContainer.querySelector('.editor-content');
    if (!contentInput) return;
    
    const content = contentInput.value;
    
    html += `
<li class="mb-6 ml-4">
<div class="absolute w-3 h-3 bg-light-teal rounded-full mt-1.5 -left-1.5 border border-white"></div>
${content}
</li>`;
  });
  
  // End timeline
  html += `
</ol>
<!-- END OF TIMELINE -->`;
} 
else if (timelineType === 'cards') {
  // Get card settings (color and layout)
  const colorInput = block.querySelector('[data-field="color"]');
  const layoutInput = block.querySelector('[data-field="layout"]');
  
  if (!colorInput || !layoutInput) return;
  
  const cardColor = colorInput.value;
  const cardLayout = layoutInput.value;
  
  // Start timeline
  html += `<!-- START OF TIMELINE WITH CARDS -->
<ol class="relative border-l border-deep-teal">`;
  
  // Generate each timeline item with cards
  timelineItems.forEach(item => {
    const contentContainer = item.querySelector('[data-field="timeline-content"]');
    
    if (!contentContainer) return;
    
    const contentInput = contentContainer.querySelector('.editor-content');
    if (!contentInput) return;
    
    const content = contentInput.value;
    
    // Get all cards in this timeline item
    const timelineCards = item.querySelectorAll('.timeline-card');
    if (timelineCards.length === 0) return;
    
    html += `
<li class="mb-6 ml-4">
<div class="absolute w-3 h-3 bg-light-teal rounded-full mt-1.5 -left-1.5 border border-white"></div>
${content}
<div class="grid grid-cols-1 md:grid-cols-${cardLayout} gap-4 items-center md:p-4 mb-12">`;
    
    // Generate each card
    timelineCards.forEach(card => {
      const cardTitleInput = card.querySelector('[data-field="timeline-card-title"]');
      const cardContentContainer = card.querySelector('[data-field="timeline-card-content"]');
      
      if (!cardTitleInput || !cardContentContainer) return;
      
      const cardContentInput = cardContentContainer.querySelector('.editor-content');
      if (!cardContentInput) return;
      
      const cardTitle = cardTitleInput.value;
      const cardContent = cardContentInput.value;
      
      html += `
<div class="border-4 rounded-md border-${cardColor} flex flex-col h-full mb-4 w-full shadow-lg rounded-b-md">
<div class="bg-${cardColor} flex justify-between items-center w-full p-4">
<h4 class="mb-0">${cardTitle}</h4>
</div>
<p class="text-lg font-normal p-4">${cardContent}</p>
</div>`;
    });
    
    html += `
</div>
</li>`;
  });
  
  // End timeline
  html += `
</ol>
<!-- END OF TIMELINE WITH CARDS -->`;
}
break;

case 'tabs':
// Get all tabs in the set
const tabsContainer = block.querySelector('.tabs-container');
if (!tabsContainer) return;

const tabPanels = tabsContainer.querySelectorAll('.tab-panel');
if (tabPanels.length === 0) return;

// Generate a unique ID for this tab set
const tabSetId = 'tab-set-' + Math.random().toString(36).substring(2, 9);

// Start tabs header row
html += `<!-- START OF TABS HEADER ROW -->
<ul class="flex flex-wrap md:flex-nowrap font-medium text-white text-center tabs-white w-full">`;

// Generate tab headers
tabPanels.forEach((panel, index) => {
  const tabTitleInput = panel.querySelector('[data-field="tab-title"]');
  if (!tabTitleInput) return;
  
  const tabTitle = tabTitleInput.value;
  const isFirst = index === 0;
  const tabId = `tab-${tabSetId}-${index + 1}`;
  const panelId = `panel${index + 1}`;
  
  html += `
<li class="w-full lg:w-auto lg:mr-4"><a class="flex lg:inline-block bg-deep-teal border-deep-teal border border-4 border-b-0 ${isFirst ? 'rounded-t-md' : 'md:rounded-t-md'} justify-center items-center h-full py-2 px-4 hover:bg-white hover:text-dark-gray ${isFirst ? 'bg-deep-teal text-white' : 'inactive'}" href="javascript:void(0)" id="${tabId}" role="tab" aria-controls="${panelId}" aria-selected="${isFirst ? 'true' : 'false'}" tabindex="${isFirst ? '0' : '-1'}">${tabTitle}</a></li>`;
  });
  
  // End tabs header row and start content container
  html += `
</ul>
<!-- START OF TAB CONTENT FIELDS -->
<div class="tabs-white__content py-16 px-8 bg-white border border-deep-teal border-4 rounded-b-md">`;
  
  // Generate tab content panels
  tabPanels.forEach((panel, index) => {
    const contentContainer = panel.querySelector('[data-field="tab-content"]');
    if (!contentContainer) return;
    
    const contentInput = contentContainer.querySelector('.editor-content');
    if (!contentInput) return;
    
    const isFirst = index === 0;
    const tabId = `tab${index + 1}`;
    const panelId = `panel${index + 1}`;
    const content = contentInput.value;
    
    html += `
<div id="${panelId}" role="tabpanel" aria-labelledby="${tabId}" aria-hidden="${!isFirst}" class="${!isFirst ? 'hidden' : ''}">
  ${content}
</div>`;
  });
  
  // End tab content container
  html += `
</div>`;
  break;

  case 'table':
  // Get table settings
  const tableColsInput = block.querySelector('[data-field="columns"]');
  const tableColorInput = block.querySelector('[data-field="color"]');
  
  if (!tableColsInput || !tableColorInput) return;
  
  const columnCount = parseInt(tableColsInput.value, 10);
  const tableColor = tableColorInput.value;
  
  // Get header values
  const headerInputs = block.querySelectorAll('[data-field^="header-"]');
  if (headerInputs.length === 0) return;
  
  const headers = [];
  headerInputs.forEach((input) => {
    headers.push(input.value);
  });
  
  // Get all rows in the table
  const rowsContainer = block.querySelector('.table-rows-container');
  if (!rowsContainer) return;
  
  const tableRows = rowsContainer.querySelectorAll('.table-row');
  if (tableRows.length === 0) return;
  
  // Start table HTML
  html += `<div class="border-${tableColor} border-4 rounded-md mb-8">
<table class="table-fixed border-2 text-dark-gray rounded-md shadow-lg mx-auto">
<thead class="bg-${tableColor} text-white font-bold">
<tr>`;

// Add table headers
for (let i = 0; i < columnCount; i++) {
  const headerClass = i === 0 ? ' md:min-w-[200px]' : '';
  html += `
<th scope="col" class="${headerClass} px-2 py-4">${headers[i] || `Column ${i+1}`}</th>`;
}

html += `
</tr>
</thead>
<tbody>`;

// Generate each table row
tableRows.forEach((row) => {
  const cells = row.querySelectorAll('[data-field^="cell-"]');
  if (cells.length === 0) return;
  
  html += `
<tr>`;
  
  // Add cells for each row
  for (let i = 0; i < columnCount; i++) {
    const cellInput = cells[i];
    if (!cellInput) continue;
    
    const cellValue = cellInput.value;
    const headerValue = headers[i] || `Column ${i+1}`;
    
    if (i === 0) {
      // First column is a header cell
      html += `
<th scope="row" class="font-bold px-2 py-4" data-label="${headerValue}">${cellValue}</th>`;
    } else {
      // Regular cell
      html += `
<td class="px-2 py-4" data-label="${headerValue}">${cellValue}</td>`;
    }
  }
  
  html += `
</tr>`;
});

// End table HTML
html += `
</tbody>
</table>
</div>`;
break;

case 'video':
// Get video settings
const videoTypeInput = block.querySelector('[data-field="video-type"]');
const transcriptUrl = block.querySelector('[data-field="transcript-url"]')?.value;
const directUrl = block.querySelector('[data-field="direct-url"]')?.value;

if (!videoTypeInput) return;

const videoType = videoTypeInput.value;

// Video embed container
html += `<!-- START OF VIDEO DIV CONTAINER -->
<div class="video-container mb-4">`;

if (videoType === 'youtube') {
const youtubeUrl = block.querySelector('[data-field="youtube-url"]')?.value;
html += `<iframe src="${youtubeUrl}" title="YouTube video player?wmode=opaque" frameborder="0" class="mx-auto mb-4" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="allowfullscreen"></iframe>`;
} else if (videoType === 'yuja') {
const yujaCode = block.querySelector('[data-field="yuja-code"]')?.value;
// Extract just the iframe and remove any width/height attributes
let processedYujaCode = yujaCode.trim();
processedYujaCode = processedYujaCode.replace(/width="[^"]*"/g, '');
processedYujaCode = processedYujaCode.replace(/height="[^"]*"/g, '');
html += processedYujaCode;
}

html += `</div>
<!-- END OF VIDEO DIV CONTAINER -->`;
  
  // Add optional links if provided
  if (transcriptUrl || directUrl) {
    html += `
<ul class="text-lg text-dark-gray mb-8 list-disc list-outside ml-0">`;
    
    if (transcriptUrl) {
      html += `
<li class="flex items-center mb-4"><img src="/content/enforced/9569-SK-1-S/assets/img/file-regular.svg" width="18px" class="mr-4" alt=""><a href="${transcriptUrl}" target="_blank" rel="noopener">Download the Transcript</a></li>`;
    }
    
    if (directUrl) {
      html += `
<li class="flex items-center mb-4"><img src="/content/enforced/9569-SK-1-S/assets/img/circle-play-regular-orange.svg" width="24px" class="mr-4" alt=""><a href="${directUrl}" target="_blank" rel="noopener">Direct Video Link</a></li>`;
    }
    
    html += `
</ul>`;
  }
  break;

  case 'image':
  // Get image settings
  const imageUrl = block.querySelector('[data-field="image-url"]')?.value || '';
  const imageAlt = block.querySelector('[data-field="image-alt"]')?.value || '';
  const imageAttribution = block.querySelector('[data-field="image-attribution"]')?.value || '';
  const imageAlign = block.querySelector('[data-field="align"]')?.value || 'left';
  const reverseColumns = block.querySelector('[data-field="reverse-columns"]')?.checked || false;
  
  if (!imageUrl) return;
  
  if (imageAlign === 'left') {
    // Left aligned image
    html += `<div class="inline-flex flex-col"><img src="${imageUrl}" alt="${imageAlt}">`;
    if (imageAttribution) {
      html += `\n<p class="text-sm mb-8 text-center">${imageAttribution}</p>`;
    }
    html += `</div>\n`;
  } 
  else if (imageAlign === 'center') {
    // Center aligned image - wrap both the image and attribution in a centered div
    html += `<div class="flex flex-col items-center">
    <img src="${imageUrl}" alt="${imageAlt}" class="mx-auto">`;
    if (imageAttribution) {
      html += `\n<p class="text-sm text-center mb-8">${imageAttribution}</p>`;
    }
    html += `</div>\n`;
  }
  else if (imageAlign === 'column') {
    // 2-column layout
    const editorContainer = block.querySelector('.column-text-editor');
    let columnText = '<p>This paragraph is part of a two-column layout that will stack on tablet and mobile screens.</p>';
    
    if (editorContainer) {
      const hiddenInput = editorContainer.querySelector('.editor-content');
      if (hiddenInput) {
        columnText = hiddenInput.value;
      }
    }
    
    html += `<div class="grid md:grid-cols-2 gap-4 mb-8">`;
    
    // Text column
    const textColumn = `<div class="flex items-center">${columnText}</div>`;
    
    // Image column
    const imageColumn = `<div class="flex flex-col justify-center items-center"><img src="${imageUrl}" alt="${imageAlt}">
${imageAttribution ? `<p class="text-sm">${imageAttribution}</p>` : ''}</div>`;
    
    // Add columns in the right order
    if (reverseColumns) {
      html += `${imageColumn}\n${textColumn}`;
    } else {
      html += `${textColumn}\n${imageColumn}`;
    }
    
    html += `\n</div>\n`;
  }
  break;
          
        // Other component types would be handled here
      }
    });

    html += `</div>
</main>
</body>
</html>`;

    return html;
  }

  // Serialize all blocks from the editor
    function serializeEditorState() {
        const pageTitle = document.querySelector('[data-type="pageTitle"] [data-field="title"]')?.value || '';
        const blocks = [];
        
        const blockElements = sortableBlocks.querySelectorAll('.block-item');
        
        blockElements.forEach(blockEl => {
            const blockType = blockEl.dataset.type;
            const blockData = {
                type: blockType,
                collapsed: blockEl.dataset.collapsed === 'true',
                data: extractBlockData(blockEl, blockType)
            };
            
            blocks.push(blockData);
        });
        
        return {
            title: pageTitle,
            blocks: blocks
        };
    }

    // Extract data from a block based on its type
    function extractBlockData(blockEl, blockType) {
        switch(blockType) {
            case 'text':
                return extractTextData(blockEl);
            case 'card':
                return extractCardData(blockEl);
            case 'accordion':
                return extractAccordionData(blockEl);
            case 'timeline':
                return extractTimelineData(blockEl);
            case 'tabs':
                return extractTabsData(blockEl);
            case 'table':
                return extractTableData(blockEl);
            case 'video':
                return extractVideoData(blockEl);
            case 'image':
                return extractImageData(blockEl);
            default:
                return {};
        }
    }

    // Extract text block data
    function extractTextData(blockEl) {
        const textContainer = blockEl.querySelector('[data-field="text"]');
        const textInput = textContainer?.querySelector('.editor-content');
        return {
            content: textInput?.value || ''
        };
    }

    // Extract card block data
    function extractCardData(blockEl) {
        const cards = [];
        const cardItems = blockEl.querySelectorAll('.card-item');
        
        cardItems.forEach(card => {
            const title = card.querySelector('[data-field="card-title"]')?.value || '';
            const contentInput = card.querySelector('[data-field="card-content"] .editor-content');
            const content = contentInput?.value || '';
            const icon = card.querySelector('[data-field="card-icon"]')?.value || '';
            
            cards.push({ title, content, icon });
        });
        
        return {
            color: blockEl.querySelector('[data-field="color"]')?.value || 'deep-teal',
            layout: blockEl.querySelector('[data-field="layout"]')?.value || '1',
            cardType: blockEl.querySelector('[data-field="card-type"]')?.value || 'standard',
            cards: cards
        };
    }

    // Extract accordion block data
    function extractAccordionData(blockEl) {
        const panels = [];
        const panelItems = blockEl.querySelectorAll('.accordion-panel');
        
        panelItems.forEach(panel => {
            const title = panel.querySelector('[data-field="panel-title"]')?.value || '';
            const contentInput = panel.querySelector('[data-field="panel-content"] .editor-content');
            const content = contentInput?.value || '';
            const icon = panel.querySelector('[data-field="panel-icon"]')?.value || '';
            
            panels.push({ title, content, icon });
        });
        
        return {
            color: blockEl.querySelector('[data-field="color"]')?.value || 'deep-teal',
            accordionType: blockEl.querySelector('[data-field="accordion-type"]')?.value || 'standard',
            panels: panels
        };
    }

    // Extract timeline block data
    function extractTimelineData(blockEl) {
        const items = [];
        const timelineItems = blockEl.querySelectorAll('.timeline-item');
        const timelineType = blockEl.querySelector('.selected-timeline-type')?.value || 'standard';
        
        timelineItems.forEach(item => {
            const contentInput = item.querySelector('[data-field="timeline-content"] .editor-content');
            const content = contentInput?.value || '';
            
            const itemData = { content };
            
            // If timeline has cards, extract them
            if (timelineType === 'cards') {
                const cards = [];
                const cardElements = item.querySelectorAll('.timeline-card');
                
                cardElements.forEach(card => {
                    const title = card.querySelector('[data-field="timeline-card-title"]')?.value || '';
                    const cardContentInput = card.querySelector('[data-field="timeline-card-content"] .editor-content');
                    const cardContent = cardContentInput?.value || '';
                    
                    cards.push({ title, content: cardContent });
                });
                
                itemData.cards = cards;
            }
            
            items.push(itemData);
        });
        
        return {
            timelineType: timelineType,
            color: blockEl.querySelector('[data-field="color"]')?.value || 'deep-teal',
            layout: blockEl.querySelector('[data-field="layout"]')?.value || '1',
            items: items
        };
    }

    // Extract tabs block data
    function extractTabsData(blockEl) {
        const tabs = [];
        const tabPanels = blockEl.querySelectorAll('.tab-panel');
        
        tabPanels.forEach(panel => {
            const title = panel.querySelector('[data-field="tab-title"]')?.value || '';
            const contentInput = panel.querySelector('[data-field="tab-content"] .editor-content');
            const content = contentInput?.value || '';
            
            tabs.push({ title, content });
        });
        
        return { tabs };
    }

    // Extract table block data
    function extractTableData(blockEl) {
        const columns = parseInt(blockEl.querySelector('[data-field="columns"]')?.value || '2', 10);
        const headers = [];
        const rows = [];
        
        // Extract headers
        const headerInputs = blockEl.querySelectorAll('[data-field^="header-"]');
        headerInputs.forEach(input => {
            headers.push(input.value);
        });
        
        // Extract rows
        const tableRows = blockEl.querySelectorAll('.table-row');
        tableRows.forEach(row => {
            const cells = [];
            const cellInputs = row.querySelectorAll('[data-field^="cell-"]');
            
            cellInputs.forEach(input => {
                cells.push(input.value);
            });
            
            rows.push({ cells });
        });
        
        return {
            color: blockEl.querySelector('[data-field="color"]')?.value || 'deep-teal',
            columns: columns,
            headers: headers,
            rows: rows
        };
    }

    // Extract video block data
    function extractVideoData(blockEl) {
        const videoType = blockEl.querySelector('[data-field="video-type"]')?.value || 'youtube';
        
        return {
            videoType: videoType,
            youtubeUrl: blockEl.querySelector('[data-field="youtube-url"]')?.value || '',
            yujaCode: blockEl.querySelector('[data-field="yuja-code"]')?.value || '',
            transcriptUrl: blockEl.querySelector('[data-field="transcript-url"]')?.value || '',
            directUrl: blockEl.querySelector('[data-field="direct-url"]')?.value || ''
        };
    }

    // Extract image block data
    function extractImageData(blockEl) {
        const align = blockEl.querySelector('[data-field="align"]')?.value || 'left';
        const data = {
            imageUrl: blockEl.querySelector('[data-field="image-url"]')?.value || '',
            imageAlt: blockEl.querySelector('[data-field="image-alt"]')?.value || '',
            imageAttribution: blockEl.querySelector('[data-field="image-attribution"]')?.value || '',
            align: align
        };
        
        // If it's a column layout, get the column text
        if (align === 'column') {
            const columnTextInput = blockEl.querySelector('.column-text-editor .editor-content');
            data.columnText = columnTextInput?.value || '';
            data.reverseColumns = blockEl.querySelector('[data-field="reverse-columns"]')?.checked || false;
        }
        
        return data;
    }

    // Save to server
    async function saveToServer(pageId, saveChanges = true) {
        const editorState = serializeEditorState();
        
        const saveBtn = document.getElementById('save-page');
        if (saveBtn) {
            saveBtn.textContent = 'Saving...';
            saveBtn.disabled = true;
        }
        
        try {
            const url = window.editorMode === 'create' ? '/api/pages' : `/api/pages/${pageId}`;
            const method = window.editorMode === 'create' ? 'POST' : 'PUT';
            
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                    'Accept': 'application/json'
                },
                body: JSON.stringify(editorState)
            });

            console.log(url);
            
            if (response.ok) {
                const data = await response.json();
                showNotification('Page saved successfully', 'success');
                
                if (window.editorMode === 'create' && data.id) {
                    setTimeout(() => {
                        window.location.href = `/${data.id}/edit`;
                    }, 1000);
                }
            } else {
                throw new Error('Save failed');
            }
        } catch (error) {
            console.error('Error saving:', error);
            showNotification('Failed to save page', 'error');
        } finally {
            if (saveBtn) {
                saveBtn.textContent = 'Save Changes';
                saveBtn.disabled = false;
            }
        }
    }

    // Auto-save setup
    function setupAutoSave(pageId, interval = 120000) {
        let autoSaveTimeout;
        
        const scheduleAutoSave = () => {
            if (autoSaveTimeout) clearTimeout(autoSaveTimeout);
            
            autoSaveTimeout = setTimeout(() => {
                saveToServer(pageId, false);
                scheduleAutoSave();
            }, interval);
        };
        
        scheduleAutoSave();
    }

    // Show notification
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 px-6 py-3 rounded shadow-lg z-50 ${
            type === 'success' ? 'bg-green-500' : 
            type === 'error' ? 'bg-red-500' : 
            'bg-blue-500'
        } text-white`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.remove(), 3000);
    }

    // Restore editor state from saved data
    async function restoreEditorState(savedState) {
        console.log('Restoring editor state:', savedState);
        
        // Set page title
        const pageTitleInput = document.querySelector('[data-type="pageTitle"] [data-field="title"]');
        if (pageTitleInput && savedState.title) {
            pageTitleInput.value = savedState.title;
        }
        
        // Clear existing blocks (except the empty message)
        sortableBlocks = document.getElementById('sortable-blocks');
        const existingBlocks = sortableBlocks.querySelectorAll('.block-item');
        existingBlocks.forEach(block => block.remove());
        
        // Recreate blocks from saved data
        if (savedState.blocks && savedState.blocks.length > 0) {
            savedState.blocks.forEach(blockData => {
                recreateBlock(blockData);
            });
        }
        
        // Update preview and code view
        updatePreview();
        updateCodeView();
    }

    // Recreate a block from saved data
    function recreateBlock(blockData) {
        const blockType = blockData.type;
        const data = blockData.data || {};
        
        // Add the block using existing function
        addBlock(blockType);
        
        // Get the newly added block
        const newBlock = sortableBlocks.querySelector('.block-item:last-child');
        if (!newBlock) return;
        
        // Populate it with saved data
        populateBlockWithData(newBlock, blockType, data);
        
        // Set collapsed state
        if (blockData.collapsed) {
            newBlock.setAttribute('data-collapsed', 'true');
            const blockContent = newBlock.querySelector('.block-content');
            if (blockContent) {
                blockContent.style.display = 'none';
            }
            const toggleBtn = newBlock.querySelector('.collapse-toggle svg');
            if (toggleBtn) {
                toggleBtn.style.transform = 'rotate(-90deg)';
            }
        }
    }

    // Populate a block with its saved data
    function populateBlockWithData(blockEl, blockType, data) {
        switch(blockType) {
            case 'text':
                populateTextBlock(blockEl, data);
                break;
            case 'card':
                populateCardBlock(blockEl, data);
                break;
            case 'accordion':
                populateAccordionBlock(blockEl, data);
                break;
            case 'timeline':
                populateTimelineBlock(blockEl, data);
                break;
            case 'tabs':
                populateTabsBlock(blockEl, data);
                break;
            case 'table':
                populateTableBlock(blockEl, data);
                break;
            case 'video':
                populateVideoBlock(blockEl, data);
                break;
            case 'image':
                populateImageBlock(blockEl, data);
                break;
        }
    }

    // Populate text block
    function populateTextBlock(blockEl, data) {
        const editorContainer = blockEl.querySelector('[data-field="text"]');
        if (!editorContainer) return;
        
        const hiddenInput = editorContainer.querySelector('.editor-content');
        const editorDiv = editorContainer.querySelector('.rich-text-editor');
        
        if (hiddenInput) {
            hiddenInput.value = data.content || '';
        }
        
        if (editorDiv && editorDiv.quillEditor) {
            editorDiv.quillEditor.root.innerHTML = data.content || '';
        }
    }

    // Populate card block
    function populateCardBlock(blockEl, data) {
        // Set color
        const colorInput = blockEl.querySelector('[data-field="color"]');
        if (colorInput) {
            colorInput.value = data.color || 'deep-teal';
            // Update UI
            blockEl.querySelectorAll('.color-option').forEach(opt => {
                opt.classList.toggle('selected', opt.getAttribute('data-color') === data.color);
            });
        }
        
        // Set layout
        const layoutInput = blockEl.querySelector('[data-field="layout"]');
        if (layoutInput) {
            layoutInput.value = data.layout || '1';
            blockEl.querySelectorAll('.layout-option').forEach(opt => {
                opt.classList.toggle('layout-selected', opt.getAttribute('data-layout') === data.layout);
            });
        }
        
        // Set card type
        const cardTypeInput = blockEl.querySelector('[data-field="card-type"]');
        if (cardTypeInput) {
            cardTypeInput.value = data.cardType || 'standard';
            blockEl.querySelectorAll('.card-type-option').forEach(opt => {
                opt.classList.toggle('card-type-selected', opt.getAttribute('data-type') === data.cardType);
            });
            
            // Show/hide icon container
            const iconContainer = blockEl.querySelector('.card-icon-container');
            if (iconContainer) {
                if (data.cardType === 'icon' || data.cardType === 'left-border-icon') {
                    iconContainer.classList.remove('hidden');
                } else {
                    iconContainer.classList.add('hidden');
                }
            }
        }
        
        // Clear existing cards and add saved ones
        const cardsContainer = blockEl.querySelector('.cards-container');
        if (cardsContainer && data.cards && data.cards.length > 0) {
            // Remove default card
            cardsContainer.innerHTML = '';
            
            // Add each saved card
            data.cards.forEach((cardData, index) => {
                const cardNumber = index + 1;
                addCard(cardsContainer, cardNumber);
                
                const cardEl = cardsContainer.querySelector('.card-item:last-child');
                if (cardEl) {
                    // Set title
                    const titleInput = cardEl.querySelector('[data-field="card-title"]');
                    if (titleInput) {
                        titleInput.value = cardData.title || '';
                    }
                    
                    // Set icon if present
                    const iconInput = cardEl.querySelector('[data-field="card-icon"]');
                    if (iconInput) {
                        iconInput.value = cardData.icon || '';
                    }
                    
                    // Set content
                    const contentContainer = cardEl.querySelector('[data-field="card-content"]');
                    if (contentContainer) {
                        const hiddenInput = contentContainer.querySelector('.editor-content');
                        const editorDiv = contentContainer.querySelector('.rich-text-editor');
                        
                        if (hiddenInput) {
                            hiddenInput.value = cardData.content || '';
                        }
                        
                        if (editorDiv && editorDiv.quillEditor) {
                            editorDiv.quillEditor.root.innerHTML = cardData.content || '';
                        }
                    }
                }
            });
        }
    }

    // Populate accordion block
    function populateAccordionBlock(blockEl, data) {
        // Set color
        const colorInput = blockEl.querySelector('[data-field="color"]');
        if (colorInput) {
            colorInput.value = data.color || 'deep-teal';
            blockEl.querySelectorAll('.color-option').forEach(opt => {
                opt.classList.toggle('selected', opt.getAttribute('data-color') === data.color);
            });
        }
        
        // Set type
        const typeInput = blockEl.querySelector('[data-field="accordion-type"]');
        if (typeInput) {
            typeInput.value = data.accordionType || 'standard';
            blockEl.querySelectorAll('.accordion-type-option').forEach(opt => {
                opt.classList.toggle('accordion-type-selected', opt.getAttribute('data-type') === data.accordionType);
            });
        }
        
        // Clear existing panels and add saved ones
        const panelsContainer = blockEl.querySelector('.accordion-panels-container');
        if (panelsContainer && data.panels && data.panels.length > 0) {
            panelsContainer.innerHTML = '';
            
            data.panels.forEach((panelData, index) => {
                addAccordionPanel(panelsContainer, index + 1);
                
                const panelEl = panelsContainer.querySelector('.accordion-panel:last-child');
                if (panelEl) {
                    // Set title
                    const titleInput = panelEl.querySelector('[data-field="panel-title"]');
                    if (titleInput) {
                        titleInput.value = panelData.title || '';
                    }
                    
                    // Set icon if needed
                    if (data.accordionType === 'icon') {
                        const iconContainer = panelEl.querySelector('.panel-icon-container');
                        if (iconContainer) {
                            iconContainer.classList.remove('hidden');
                            const iconInput = iconContainer.querySelector('[data-field="panel-icon"]');
                            if (iconInput) {
                                iconInput.value = panelData.icon || '';
                            }
                        }
                    }
                    
                    // Set content
                    const contentContainer = panelEl.querySelector('[data-field="panel-content"]');
                    if (contentContainer) {
                        const hiddenInput = contentContainer.querySelector('.editor-content');
                        const editorDiv = contentContainer.querySelector('.rich-text-editor');
                        
                        if (hiddenInput) {
                            hiddenInput.value = panelData.content || '';
                        }
                        
                        if (editorDiv && editorDiv.quillEditor) {
                            editorDiv.quillEditor.root.innerHTML = panelData.content || '';
                        }
                    }
                }
            });
        }
    }

    // Populate timeline block
    function populateTimelineBlock(blockEl, data) {
        // Set timeline type
        const typeInput = blockEl.querySelector('.selected-timeline-type');
        if (typeInput) {
            typeInput.value = data.timelineType || 'standard';
            blockEl.querySelectorAll('.timeline-type-option').forEach(opt => {
                opt.classList.toggle('timeline-type-selected', opt.getAttribute('data-type') === data.timelineType);
            });
        }
        
        // Show/hide style tab
        const styleTab = blockEl.querySelector('.timeline-tab[data-tab="style"]');
        if (styleTab) {
            if (data.timelineType === 'cards') {
                styleTab.classList.remove('hidden');
            } else {
                styleTab.classList.add('hidden');
            }
        }
        
        // Set color and layout (for cards)
        if (data.timelineType === 'cards') {
            const colorInput = blockEl.querySelector('[data-field="color"]');
            if (colorInput) {
                colorInput.value = data.color || 'deep-teal';
            }
            
            const layoutInput = blockEl.querySelector('[data-field="layout"]');
            if (layoutInput) {
                layoutInput.value = data.layout || '1';
            }
        }
        
        // Populate timeline items
        const itemsContainer = blockEl.querySelector('.timeline-items-container');
        if (itemsContainer && data.items && data.items.length > 0) {
            itemsContainer.innerHTML = '';
            
            data.items.forEach((itemData, index) => {
                addTimelineItem(itemsContainer, index + 1, data.timelineType);
                
                const itemEl = itemsContainer.querySelector('.timeline-item:last-child');
                if (itemEl) {
                    // Set content
                    const contentContainer = itemEl.querySelector('[data-field="timeline-content"]');
                    if (contentContainer) {
                        const hiddenInput = contentContainer.querySelector('.editor-content');
                        const editorDiv = contentContainer.querySelector('.rich-text-editor');
                        
                        if (hiddenInput) {
                            hiddenInput.value = itemData.content || '';
                        }
                        
                        if (editorDiv && editorDiv.quillEditor) {
                            editorDiv.quillEditor.root.innerHTML = itemData.content || '';
                        }
                    }
                    
                    // Add cards if timeline has cards
                    if (data.timelineType === 'cards' && itemData.cards && itemData.cards.length > 0) {
                        const cardsContainer = itemEl.querySelector('.timeline-cards');
                        if (cardsContainer) {
                            cardsContainer.innerHTML = '';
                            
                            itemData.cards.forEach((cardData, cardIndex) => {
                                const newCard = createTimelineCard(cardIndex + 1);
                                cardsContainer.appendChild(newCard);
                                
                                // Set card title
                                const titleInput = newCard.querySelector('[data-field="timeline-card-title"]');
                                if (titleInput) {
                                    titleInput.value = cardData.title || '';
                                }
                                
                                // Set card content
                                const cardContentContainer = newCard.querySelector('[data-field="timeline-card-content"]');
                                if (cardContentContainer) {
                                    const hiddenInput = cardContentContainer.querySelector('.editor-content');
                                    const editorDiv = cardContentContainer.querySelector('.rich-text-editor');
                                    
                                    if (hiddenInput) {
                                        hiddenInput.value = cardData.content || '';
                                    }
                                    
                                    if (editorDiv) {
                                        const editor = new Quill(editorDiv, quillOptions);
                                        editor.root.innerHTML = cardData.content || '';
                                        editor.on('text-change', function() {
                                            hiddenInput.value = editor.root.innerHTML;
                                            updatePreview();
                                            updateCodeView();
                                        });
                                        editorDiv.quillEditor = editor;
                                    }
                                }
                            });
                        }
                    }
                }
            });
        }
    }

    // Populate tabs block
    function populateTabsBlock(blockEl, data) {
        const tabsContainer = blockEl.querySelector('.tabs-container');
        if (tabsContainer && data.tabs && data.tabs.length > 0) {
            tabsContainer.innerHTML = '';
            
            data.tabs.forEach((tabData, index) => {
                addTabPanel(tabsContainer, index + 1);
                
                const tabEl = tabsContainer.querySelector('.tab-panel:last-child');
                if (tabEl) {
                    // Set title
                    const titleInput = tabEl.querySelector('[data-field="tab-title"]');
                    if (titleInput) {
                        titleInput.value = tabData.title || '';
                    }
                    
                    // Set content
                    const contentContainer = tabEl.querySelector('[data-field="tab-content"]');
                    if (contentContainer) {
                        const hiddenInput = contentContainer.querySelector('.editor-content');
                        const editorDiv = contentContainer.querySelector('.rich-text-editor');
                        
                        if (hiddenInput) {
                            hiddenInput.value = tabData.content || '';
                        }
                        
                        if (editorDiv && editorDiv.quillEditor) {
                            editorDiv.quillEditor.root.innerHTML = tabData.content || '';
                        }
                    }
                }
            });
        }
    }

    // Populate table block
    function populateTableBlock(blockEl, data) {
        // Set color
        const colorInput = blockEl.querySelector('[data-field="color"]');
        if (colorInput) {
            colorInput.value = data.color || 'deep-teal';
        }
        
        // Set columns
        const colsInput = blockEl.querySelector('[data-field="columns"]');
        if (colsInput) {
            colsInput.value = data.columns || 2;
            blockEl.querySelectorAll('.table-cols-option').forEach(opt => {
                opt.classList.toggle('table-cols-selected', opt.getAttribute('data-cols') === String(data.columns));
            });
        }
        
        // Update headers
        if (data.headers && data.headers.length > 0) {
            updateTableHeaders(blockEl, data.columns);
            data.headers.forEach((header, index) => {
                const headerInput = blockEl.querySelector(`[data-field="header-${index}"]`);
                if (headerInput) {
                    headerInput.value = header;
                }
            });
        }
        
        // Populate rows
        const rowsContainer = blockEl.querySelector('.table-rows-container');
        if (rowsContainer && data.rows && data.rows.length > 0) {
            rowsContainer.innerHTML = '';
            
            data.rows.forEach((rowData, index) => {
                addTableRow(rowsContainer, index + 1, data.columns, blockEl);
                
                const rowEl = rowsContainer.querySelector('.table-row:last-child');
                if (rowEl && rowData.cells) {
                    rowData.cells.forEach((cellValue, cellIndex) => {
                        const cellInput = rowEl.querySelector(`[data-field="cell-${cellIndex}"]`);
                        if (cellInput) {
                            cellInput.value = cellValue;
                        }
                    });
                }
            });
        }
    }

    // Populate video block
    function populateVideoBlock(blockEl, data) {
        // Set video type
        const typeInput = blockEl.querySelector('[data-field="video-type"]');
        if (typeInput) {
            typeInput.value = data.videoType || 'youtube';
            blockEl.querySelectorAll('.video-type-option').forEach(opt => {
                opt.classList.toggle('video-type-selected', opt.getAttribute('data-type') === data.videoType);
            });
        }
        
        // Show/hide relevant inputs
        const youtubeInput = blockEl.querySelector('.youtube-input');
        const yujaInput = blockEl.querySelector('.yuja-input');
        
        if (data.videoType === 'youtube') {
            if (youtubeInput) youtubeInput.classList.remove('hidden');
            if (yujaInput) yujaInput.classList.add('hidden');
            
            const urlInput = blockEl.querySelector('[data-field="youtube-url"]');
            if (urlInput) {
                urlInput.value = data.youtubeUrl || '';
            }
        } else if (data.videoType === 'yuja') {
            if (youtubeInput) youtubeInput.classList.add('hidden');
            if (yujaInput) yujaInput.classList.remove('hidden');
            
            const codeInput = blockEl.querySelector('[data-field="yuja-code"]');
            if (codeInput) {
                codeInput.value = data.yujaCode || '';
            }
        }
        
        // Set optional fields
        const transcriptInput = blockEl.querySelector('[data-field="transcript-url"]');
        if (transcriptInput) {
            transcriptInput.value = data.transcriptUrl || '';
        }
        
        const directInput = blockEl.querySelector('[data-field="direct-url"]');
        if (directInput) {
            directInput.value = data.directUrl || '';
        }
    }

    // Populate image block
    function populateImageBlock(blockEl, data) {
        // Set image URL
        const urlInput = blockEl.querySelector('[data-field="image-url"]');
        if (urlInput) {
            urlInput.value = data.imageUrl || '';
        }
        
        // Set alt text
        const altInput = blockEl.querySelector('[data-field="image-alt"]');
        if (altInput) {
            altInput.value = data.imageAlt || '';
        }
        
        // Set attribution
        const attributionInput = blockEl.querySelector('[data-field="image-attribution"]');
        if (attributionInput) {
            attributionInput.value = data.imageAttribution || '';
        }
        
        // Set alignment
        const alignInput = blockEl.querySelector('[data-field="align"]');
        if (alignInput) {
            alignInput.value = data.align || 'left';
            blockEl.querySelectorAll('.image-align-option').forEach(opt => {
                opt.classList.toggle('image-align-selected', opt.getAttribute('data-align') === data.align);
            });
        }
        
        // Handle column layout
        const columnTextContainer = blockEl.querySelector('.column-text-container');
        if (data.align === 'column') {
            if (columnTextContainer) {
                columnTextContainer.classList.remove('hidden');
                
                // Set column text
                const editorContainer = columnTextContainer.querySelector('.column-text-editor');
                if (editorContainer) {
                    const hiddenInput = editorContainer.querySelector('.editor-content');
                    const editorDiv = editorContainer.querySelector('.column-text-rich-editor');
                    
                    if (hiddenInput) {
                        hiddenInput.value = data.columnText || '';
                    }
                    
                    if (editorDiv && editorDiv.quillEditor) {
                        editorDiv.quillEditor.root.innerHTML = data.columnText || '';
                    }
                }
                
                // Set reverse columns
                const reverseCheckbox = blockEl.querySelector('[data-field="reverse-columns"]');
                if (reverseCheckbox) {
                    reverseCheckbox.checked = data.reverseColumns || false;
                }
            }
        } else {
            if (columnTextContainer) {
                columnTextContainer.classList.add('hidden');
            }
        }
    }

    // Clear all blocks except page title
    function clearBlocks() {
        const blocks = Array.from(sortableBlocks.querySelectorAll('.block-item'));
        blocks.forEach(block => block.remove());
        checkEmptyBlocks();
    }

    // Check if blocks area is empty and show message
    function checkEmptyBlocks() {
        if (!sortableBlocks.querySelector('.block-item')) {
            sortableBlocks.innerHTML = '<div class="text-center text-gray-500">Add components from the selector above</div>';
        }
    }

    document.dispatchEvent(new Event('appReady'));

    // At the END of your app.js file, expose functions to window
      window.saveToServer = saveToServer;
      window.serializeEditorState = serializeEditorState;
      window.setupAutoSave = setupAutoSave;
      window.showNotification = showNotification;
      window.restoreEditorState = restoreEditorState;
      window.addBlock = addBlock; // If called from blade templates
      window.updatePreview = updatePreview;
      window.updateCodeView = updateCodeView;
      document.dispatchEvent(new Event('appReady'));
}); 
