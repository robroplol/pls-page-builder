
            <!-- Main App UI -->
          <div class="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6 h-screen max-h-[800px] overflow-hidden">
        
            
            <!-- Left Panel: Editor Panel with Component Selector -->
            <div class="w-full md:w-1/3 flex flex-col h-full">
              <!-- Component Selector -->
              <div class="bg-white rounded-lg shadow-md p-4 mb-4 flex-shrink-0">
                <div class="flex justify-between items-center mb-2">
                  <h2 class="text-xl font-bold">Add Component</h2>
                  <button id="toggle-components" class="text-gray-500 hover:text-gray-700 focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
                <div id="component-grid" class="grid grid-cols-2 gap-2">
                  <button class="component-btn p-2 border rounded hover:bg-blue-50" data-type="text">
                    <div class="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
                      </svg>
                      Text
                    </div>
                  </button>
                  <button class="component-btn p-2 border rounded hover:bg-blue-50" data-type="card">
                    <div class="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                        <path fill-rule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clip-rule="evenodd" />
                      </svg>
                      Card
                    </div>
                  </button>
                  <button class="component-btn p-2 border rounded hover:bg-blue-50" data-type="accordion">
                    <div class="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M3 7a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 11a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
                      </svg>
                      Accordion
                    </div>
                  </button>
                  <button class="component-btn p-2 border rounded hover:bg-blue-50" data-type="image">
                    <div class="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                      </svg>
                      Image
                    </div>
                  </button>
                  <button class="component-btn p-2 border rounded hover:bg-blue-50" data-type="table">
                    <div class="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clip-rule="evenodd" />
                      </svg>
                      Table
                    </div>
                  </button>
                  <button class="component-btn p-2 border rounded hover:bg-blue-50" data-type="video">
                    <div class="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                      </svg>
                      Video
                    </div>
                  </button>
                  <button class="component-btn p-2 border rounded hover:bg-blue-50" data-type="timeline">
                    <div class="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
                      </svg>
                      Timeline
                    </div>
                  </button>
                  <button class="component-btn p-2 border rounded hover:bg-blue-50" data-type="tabs">
                    <div class="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                      </svg>
                      Tabs
                    </div>
                  </button>
                </div>
              </div>
              
              <!-- Block Editor & HTML Code -->
            <div class="bg-white rounded-lg shadow-md p-4 flex flex-col flex-grow overflow-hidden">
              <!-- Tabs -->
              <div class="mb-4 flex-shrink-0">
                <div class="flex border-b">
                  <button class="tab-active py-2 px-4 focus:outline-none" id="blocks-tab">Blocks</button>
                  <button class="tab-inactive py-2 px-4 focus:outline-none" id="code-tab">HTML</button>
                </div>
              </div>
                
                <!-- Blocks Editor View -->
                <div id="blocks-container" class="blocks-view flex-grow overflow-y-auto">
                  <!-- Page Title Block (always present) -->
                  <div class="block-item p-4 mb-4 border rounded block-highlight" data-type="pageTitle" data-collapsed="false">
                    <div class="flex justify-between items-center mb-2">
                      <h3 class="font-bold">Page Title</h3>
                      <div>
                        <button class="collapse-toggle text-gray-500 hover:text-gray-700 focus:outline-none mr-2">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div class="block-content">
                      <input type="text" class="block-input w-full p-2 border rounded" value="Your Page Title" data-field="title">
                    </div>
                  </div>
                  
                  <!-- Blocks will be added here -->
                  <div id="sortable-blocks" class="min-h-[200px] border-2 border-dashed border-gray-300 p-4 rounded">
                    <div class="text-center text-gray-500">
                      Add components from the selector above
                    </div>
                  </div>
                </div>
                
                <!-- HTML Code View -->
                <div id="code-container" class="hidden flex-grow flex flex-col">
                  <textarea id="html-code" class="code-editor w-full p-4 border rounded flex-grow" spellcheck="false"></textarea>
                  <div class="mt-4 flex justify-between">
                    <div>
                      <button id="copy-html" class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 mr-2">
                        Copy HTML
                      </button>
                      <button id="download-html" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                        Download HTML
                      </button>
                    </div>
                    <button id="update-from-code" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Update Preview</button>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Right Panel: Preview -->
            <div class="w-full md:w-2/3 bg-white rounded-lg shadow-md p-4 flex flex-col h-full overflow-hidden">
              <h2 class="text-xl font-bold mb-4 flex-shrink-0">Preview</h2>
              <div class="border rounded flex-grow overflow-hidden">
                <iframe id="preview-frame" class="preview-frame h-full" title="Page Preview"></iframe>
              </div>
            </div>
          </div>
          <!-- Block Templates (Hidden) -->
          <div id="block-templates" class="hidden">
            <!-- Text Block Template -->
            <div id="text-template" class="block-item p-4 mb-4 border rounded block-highlight" data-type="text">
              <div class="flex justify-between items-center mb-2">
                <h3 class="font-bold">Text</h3>
                <div class="flex">
                  <button class="collapse-toggle text-gray-500 hover:text-gray-700 focus:outline-none mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <button class="move-block text-gray-500 hover:text-gray-700 focus:outline-none mr-2 cursor-move" title="Drag to reorder">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                  </button>
                  <button class="delete-block text-red-500 hover:text-red-700 focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <div class="block-content">
                <div class="editor-container" data-field="text">
                  <div class="rich-text-editor"></div>
                  <input type="hidden" class="editor-content" value="Enter your text here.">
                </div>
              </div>
            </div>
            
            <!-- Simplified Card Template -->
            <div id="card-template" class="block-item p-4 mb-4 border rounded block-highlight" data-type="card">
              <div class="flex justify-between items-center mb-2">
                <h3 class="font-bold">Card Set</h3>
                <div class="flex">
                  <button class="collapse-toggle text-gray-500 hover:text-gray-700 focus:outline-none mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <button class="move-block text-gray-500 hover:text-gray-700 focus:outline-none mr-2 cursor-move" title="Drag to reorder">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                  </button>
                  <button class="delete-block text-red-500 hover:text-red-700 focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <div class="block-content">
                <!-- Tabbed interface for card settings -->
                <div class="card-tabs mb-4 border-b">
                  <button class="card-tab card-tab-active px-3 py-2" data-tab="content">Content</button>
                  <button class="card-tab px-3 py-2" data-tab="style">Style</button>
                  <button class="card-tab px-3 py-2" data-tab="layout">Layout</button>
                  <button class="card-tab px-3 py-2" data-tab="type">Type</button>
                </div>
                
                <!-- Content Tab -->
                <div class="card-tab-content" data-tab-content="content">
                  <div class="mb-4">
                    <div class="cards-container border p-2 rounded">
                      <!-- Initial card item -->
                      <div class="card-item mb-2 p-2 border rounded bg-gray-50">
                        <div class="flex justify-between items-center mb-2">
                          <h4 class="text-sm font-medium">Card 1</h4>
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
                          <input type="text" class="block-input w-full p-2 border rounded" value="Card Title" data-field="card-title">
                        </div>
                        <div class="mb-2">
                          <label class="block mb-1 text-sm">Card Content</label>
                          <div class="editor-container" data-field="card-content">
                            <div class="rich-text-editor"></div>
                            <input type="hidden" class="editor-content" value="Insert card content here.">
                          </div>
                        </div>
                      </div>
                    </div>
                    <button class="add-card-btn mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 focus:outline-none flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
                      </svg>
                      Add Card
                    </button>
                  </div>
                </div>
                
                <!-- Style Tab -->
                <div class="card-tab-content hidden" data-tab-content="style">
                  <div class="mb-4">
                    <label class="block mb-1">Color Style</label>
                    <div class="grid grid-cols-2 gap-2">
                      <div class="color-option p-2 border rounded flex items-center cursor-pointer" data-color="deep-teal">
                        <div class="w-6 h-6 mr-2 rounded" style="background-color: #115e6e;"></div>
                        <span>Deep Teal (Preferred)</span>
                      </div>
                      <div class="color-option p-2 border rounded flex items-center cursor-pointer" data-color="dark-teal">
                        <div class="w-6 h-6 mr-2 rounded" style="background-color: #094154;"></div>
                        <span>Dark Teal</span>
                      </div>
                      <div class="color-option p-2 border rounded flex items-center cursor-pointer" data-color="ada-green">
                        <div class="w-6 h-6 mr-2 rounded" style="background-color: #046307;"></div>
                        <span>A11y Green</span>
                      </div>
                      <div class="color-option p-2 border rounded flex items-center cursor-pointer" data-color="ada-orange">
                        <div class="w-6 h-6 mr-2 rounded" style="background-color: #bb5504;"></div>
                        <span>A11y Orange</span>
                      </div>
                      <div class="color-option p-2 border rounded flex items-center cursor-pointer" data-color="dark-gray">
                        <div class="w-6 h-6 mr-2 rounded" style="background-color: #4d4d4d;"></div>
                        <span>Dark Gray</span>
                      </div>
                    </div>
                    <input type="hidden" class="selected-color" value="deep-teal" data-field="color">
                  </div>
                </div>
                
                <!-- Layout Tab -->
                <div class="card-tab-content hidden" data-tab-content="layout">
                  <div class="mb-4">
                    <label class="block mb-2">Column Layout</label>
                    <div class="grid grid-cols-2 gap-4">
                      <div class="layout-option p-3 border rounded flex flex-col items-center cursor-pointer layout-selected" data-layout="1">
                        <div class="w-full h-16 bg-gray-200 mb-2 rounded flex items-center justify-center">
                          <div class="w-3/4 h-12 bg-gray-300 rounded"></div>
                        </div>
                        <span class="text-sm">Single Column</span>
                      </div>
                      <div class="layout-option p-3 border rounded flex flex-col items-center cursor-pointer" data-layout="2">
                        <div class="w-full h-16 bg-gray-200 mb-2 rounded flex items-center justify-center space-x-2">
                          <div class="w-5/12 h-12 bg-gray-300 rounded"></div>
                          <div class="w-5/12 h-12 bg-gray-300 rounded"></div>
                        </div>
                        <span class="text-sm">Two Columns</span>
                      </div>
                    </div>
                    <input type="hidden" class="selected-layout" value="1" data-field="layout">
                    <p class="text-xs text-gray-500 mt-2">
                      Single Column shows cards stacked on all screens.<br>
                      Two Columns shows cards side-by-side on larger screens.
                    </p>
                  </div>
                </div>

                <!-- Type Tab -->
                <div class="card-tab-content hidden" data-tab-content="type">
                  <div class="mb-4">
                    <label class="block mb-2">Card Type</label>
                    <div class="grid grid-cols-2 gap-4">
                      <div class="card-type-option p-3 border rounded flex flex-col items-center cursor-pointer card-type-selected" data-type="standard">
                        <div class="w-full h-16 bg-gray-200 mb-2 rounded flex items-center justify-center">
                          <div class="w-3/4 h-12 bg-gray-300 rounded"></div>
                        </div>
                        <span class="text-sm">Standard Card</span>
                      </div>
                      <div class="card-type-option p-3 border rounded flex flex-col items-center cursor-pointer" data-type="icon">
                        <div class="w-full h-16 bg-gray-200 mb-2 rounded flex items-center justify-center">
                          <div class="w-6 h-6 bg-gray-400 rounded-full mr-2"></div>
                          <div class="w-2/3 h-12 bg-gray-300 rounded"></div>
                        </div>
                        <span class="text-sm">Icon Card</span>
                      </div>
                      <div class="card-type-option p-3 border rounded flex flex-col items-center cursor-pointer" data-type="left-border">
                        <div class="w-full h-16 bg-gray-200 mb-2 rounded flex items-center justify-center">
                          <div class="w-3 h-12 bg-gray-500 rounded-l"></div>
                          <div class="w-2/3 h-12 bg-gray-300 rounded-r"></div>
                        </div>
                        <span class="text-sm">Left Border Tab</span>
                      </div>
                      <div class="card-type-option p-3 border rounded flex flex-col items-center cursor-pointer" data-type="left-border-icon">
                        <div class="w-full h-16 bg-gray-200 mb-2 rounded flex items-center justify-center">
                          <div class="w-8 h-12 bg-gray-500 rounded-l flex items-center justify-center">
                            <div class="w-4 h-4 bg-white rounded-full"></div>
                          </div>
                          <div class="w-2/3 h-12 bg-gray-300 rounded-r"></div>
                        </div>
                        <span class="text-sm">Left Border + Icon</span>
                      </div>
                      <div class="card-type-option p-3 border rounded flex flex-col items-center cursor-pointer" data-type="numbered">
                        <div class="w-full h-16 bg-gray-200 mb-2 rounded flex items-center justify-center">
                          <div class="w-8 h-12 bg-gray-500 rounded-l flex items-center justify-center">
                            <div class="text-white font-bold">1</div>
                          </div>
                          <div class="w-2/3 h-12 bg-gray-300 rounded-r"></div>
                        </div>
                        <span class="text-sm">Numbered Cards</span>
                      </div>
                    </div>
                    <input type="hidden" class="selected-card-type" value="standard" data-field="card-type">
                  </div>
                  
                  <!-- Icon URL input (only for icon cards and left border + icon cards) -->
                  <div class="mb-4 card-icon-container hidden">
                    <label class="block mb-1 text-sm">Icon URL</label>
                    <input type="text" class="block-input w-full p-2 border rounded" placeholder="/content/enforced/your-course-id/your-icon.svg" data-field="card-icon">
                    <p class="text-xs text-gray-500 mt-1">Full URL to the icon image</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Accordion Template -->
            <div id="accordion-template" class="block-item p-4 mb-4 border rounded block-highlight" data-type="accordion">
              <div class="flex justify-between items-center mb-2">
                <h3 class="font-bold">Accordion Set</h3>
                <div class="flex">
                  <button class="collapse-toggle text-gray-500 hover:text-gray-700 focus:outline-none mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <button class="move-block text-gray-500 hover:text-gray-700 focus:outline-none mr-2 cursor-move" title="Drag to reorder">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                  </button>
                  <button class="delete-block text-red-500 hover:text-red-700 focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <div class="block-content">
                <!-- Tabbed interface for accordion settings -->
                <div class="accordion-tabs mb-4 border-b">
                  <button class="accordion-tab accordion-tab-active px-3 py-2" data-tab="content">Content</button>
                  <button class="accordion-tab px-3 py-2" data-tab="style">Style</button>
                  <button class="accordion-tab px-3 py-2" data-tab="options">Options</button>
                </div>
                
                <!-- Content Tab -->
                <div class="accordion-tab-content" data-tab-content="content">
                  <div class="mb-4">
                    <div class="accordion-panels-container border p-2 rounded">
                      <!-- Initial accordion panel -->
                      <div class="accordion-panel mb-2 p-2 border rounded bg-gray-50">
                        <div class="flex justify-between items-center mb-2">
                          <h4 class="text-sm font-medium">Panel 1</h4>
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
                          <input type="text" class="block-input w-full p-2 border rounded" value="Accordion Panel 1" data-field="panel-title">
                        </div>
                        <div class="mb-2 panel-icon-container hidden">
                          <label class="block mb-1 text-sm">Icon URL (optional)</label>
                          <input type="text" class="block-input w-full p-2 border rounded" placeholder="/content/enforced/your-course-id/your-icon.svg" data-field="panel-icon">
                          <p class="text-xs text-gray-500 mt-1">Full URL to the icon image</p>
                        </div>
                        <div class="mb-2">
                          <label class="block mb-1 text-sm">Panel Content</label>
                          <div class="editor-container" data-field="panel-content">
                            <div class="rich-text-editor"></div>
                            <input type="hidden" class="editor-content" value="Insert accordion content here.">
                          </div>
                        </div>
                      </div>
                    </div>
                    <button class="add-panel-btn mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 focus:outline-none flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
                      </svg>
                      Add Panel
                    </button>
                  </div>
                </div>
                
                <!-- Style Tab -->
                <div class="accordion-tab-content hidden" data-tab-content="style">
                  <div class="mb-4">
                    <label class="block mb-1">Color Style</label>
                    <div class="grid grid-cols-2 gap-2">
                      <div class="color-option p-2 border rounded flex items-center cursor-pointer" data-color="deep-teal">
                        <div class="w-6 h-6 mr-2 rounded" style="background-color: #115e6e;"></div>
                        <span>Deep Teal (Preferred)</span>
                      </div>
                      <div class="color-option p-2 border rounded flex items-center cursor-pointer" data-color="dark-teal">
                        <div class="w-6 h-6 mr-2 rounded" style="background-color: #094154;"></div>
                        <span>Dark Teal</span>
                      </div>
                      <div class="color-option p-2 border rounded flex items-center cursor-pointer" data-color="ada-green">
                        <div class="w-6 h-6 mr-2 rounded" style="background-color: #046307;"></div>
                        <span>A11y Green</span>
                      </div>
                      <div class="color-option p-2 border rounded flex items-center cursor-pointer" data-color="ada-orange">
                        <div class="w-6 h-6 mr-2 rounded" style="background-color: #bb5504;"></div>
                        <span>A11y Orange</span>
                      </div>
                      <div class="color-option p-2 border rounded flex items-center cursor-pointer" data-color="dark-gray">
                        <div class="w-6 h-6 mr-2 rounded" style="background-color: #4d4d4d;"></div>
                        <span>Dark Gray</span>
                      </div>
                    </div>
                    <input type="hidden" class="selected-color" value="deep-teal" data-field="color">
                  </div>
                </div>
                
                <!-- Options Tab -->
                <div class="accordion-tab-content hidden" data-tab-content="options">
                  <div class="mb-4">
                    <label class="block mb-2">Accordion Type</label>
                    <div class="grid grid-cols-2 gap-4">
                      <div class="accordion-type-option p-3 border rounded flex flex-col items-center cursor-pointer accordion-type-selected" data-type="standard">
                        <div class="w-full h-16 bg-gray-200 mb-2 rounded flex flex-col p-2">
                          <div class="w-full h-6 bg-gray-300 rounded mb-1"></div>
                          <div class="w-3/4 h-6 bg-gray-300 rounded"></div>
                        </div>
                        <span class="text-sm">Standard Accordion</span>
                      </div>
                      <div class="accordion-type-option p-3 border rounded flex flex-col items-center cursor-pointer" data-type="icon">
                        <div class="w-full h-16 bg-gray-200 mb-2 rounded flex flex-col p-2">
                          <div class="flex items-center mb-1">
                            <div class="w-4 h-4 bg-gray-400 rounded-full mr-2"></div>
                            <div class="w-3/4 h-6 bg-gray-300 rounded"></div>
                          </div>
                          <div class="w-3/4 h-6 bg-gray-300 rounded"></div>
                        </div>
                        <span class="text-sm">Icon Accordion</span>
                      </div>
                    </div>
                    <input type="hidden" class="selected-type" value="standard" data-field="accordion-type">
                    <p class="mt-2 text-xs text-gray-500">
                      <strong>Note:</strong> Icon accordions require icon URLs for each panel.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Timeline Block Template -->
            <div id="timeline-template" class="block-item p-4 mb-4 border rounded block-highlight" data-type="timeline">
              <div class="flex justify-between items-center mb-2">
                <h3 class="font-bold">Timeline</h3>
                <div class="flex">
                  <button class="collapse-toggle text-gray-500 hover:text-gray-700 focus:outline-none mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <button class="move-block text-gray-500 hover:text-gray-700 focus:outline-none mr-2 cursor-move" title="Drag to reorder">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                  </button>
                  <button class="delete-block text-red-500 hover:text-red-700 focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <div class="block-content">
                <!-- Tabbed interface for timeline settings -->
                <div class="timeline-tabs mb-4 border-b">
                  <button class="timeline-tab timeline-tab-active px-3 py-2" data-tab="content">Content</button>
                  <button class="timeline-tab px-3 py-2 hidden" data-tab="style">Style</button>
                </div>
                
                <!-- Content Tab -->
                <div class="timeline-tab-content" data-tab-content="content">
                  <div class="mb-4">
                    <label class="block mb-2">Timeline Type</label>
                    <div class="grid grid-cols-2 gap-4 mb-4">
                      <div class="timeline-type-option p-3 border rounded flex flex-col items-center cursor-pointer timeline-type-selected" data-type="standard">
                        <div class="w-full h-16 bg-gray-200 mb-2 rounded flex flex-col justify-center items-center p-2">
                          <div class="w-4 h-4 bg-gray-400 rounded-full mb-1"></div>
                          <div class="w-3/4 h-2 bg-gray-300 rounded mb-1"></div>
                          <div class="w-3/4 h-2 bg-gray-300 rounded"></div>
                        </div>
                        <span class="text-sm">Simple Timeline</span>
                      </div>
                      <div class="timeline-type-option p-3 border rounded flex flex-col items-center cursor-pointer" data-type="cards">
                        <div class="w-full h-16 bg-gray-200 mb-2 rounded flex flex-col justify-center items-center p-2">
                          <div class="w-4 h-4 bg-gray-400 rounded-full mb-1"></div>
                          <div class="w-3/4 h-6 bg-gray-300 rounded mb-1"></div>
                        </div>
                        <span class="text-sm">Timeline with Cards</span>
                      </div>
                    </div>
                    <input type="hidden" class="selected-timeline-type" value="standard" data-field="timeline-type">

                    <div class="timeline-items-container border p-2 rounded">
                      <!-- Initial timeline item -->
                      <div class="timeline-item mb-2 p-2 border rounded bg-gray-50">
                        <div class="flex justify-between items-center mb-2">
                          <h4 class="text-sm font-medium">Timeline Item 1</h4>
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
                        
                        <!-- Timeline content (always shown) -->
                        <div class="mb-2">
                          <label class="block mb-1 text-sm">Content</label>
                          <div class="editor-container" data-field="timeline-content">
                            <div class="rich-text-editor"></div>
                            <input type="hidden" class="editor-content" value="<h3>Timeline Title 1</h3><p>Insert information about this point here.</p>">
                          </div>
                        </div>
                        
                        <!-- Card container (conditionally shown based on timeline type) -->
                        <div class="timeline-cards-container mb-2 hidden">
                          <label class="block mb-1 text-sm">Cards</label>
                          <div class="timeline-cards border p-2 rounded">
                            <div class="timeline-card mb-2 p-2 border rounded bg-gray-100">
                              <div class="flex justify-between items-center mb-2">
                                <h5 class="text-xs font-medium">Card 1</h5>
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
                                <input type="text" class="block-input w-full p-1 border rounded text-sm" value="Card Title 1" data-field="timeline-card-title">
                              </div>
                              <div class="mb-2">
                                <label class="block mb-1 text-xs">Card Content</label>
                                <div class="editor-container" data-field="timeline-card-content">
                                  <div class="rich-text-editor"></div>
                                  <input type="hidden" class="editor-content" value="Insert card content here. You can use paragraph text or lists inside cards.">
                                </div>
                              </div>
                            </div>
                          </div>
                          <button class="add-timeline-card mt-2 px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300 focus:outline-none flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
                            </svg>
                            Add Card
                          </button>
                        </div>
                      </div>
                    </div>
                    <button class="add-timeline-item mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 focus:outline-none flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
                      </svg>
                      Add Timeline Item
                    </button>
                  </div>
                </div>
                
                <!-- Style Tab (for cards) -->
                <div class="timeline-tab-content hidden" data-tab-content="style">
                  <div class="mb-4">
                    <label class="block mb-1">Card Color (for Timeline with Cards)</label>
                    <div class="grid grid-cols-2 gap-2">
                      <div class="color-option p-2 border rounded flex items-center cursor-pointer" data-color="deep-teal">
                        <div class="w-6 h-6 mr-2 rounded" style="background-color: #115e6e;"></div>
                        <span>Deep Teal (Preferred)</span>
                      </div>
                      <div class="color-option p-2 border rounded flex items-center cursor-pointer" data-color="dark-teal">
                        <div class="w-6 h-6 mr-2 rounded" style="background-color: #094154;"></div>
                        <span>Dark Teal</span>
                      </div>
                      <div class="color-option p-2 border rounded flex items-center cursor-pointer" data-color="ada-green">
                        <div class="w-6 h-6 mr-2 rounded" style="background-color: #046307;"></div>
                        <span>A11y Green</span>
                      </div>
                      <div class="color-option p-2 border rounded flex items-center cursor-pointer" data-color="ada-orange">
                        <div class="w-6 h-6 mr-2 rounded" style="background-color: #bb5504;"></div>
                        <span>A11y Orange</span>
                      </div>
                      <div class="color-option p-2 border rounded flex items-center cursor-pointer" data-color="dark-gray">
                        <div class="w-6 h-6 mr-2 rounded" style="background-color: #4d4d4d;"></div>
                        <span>Dark Gray</span>
                      </div>
                    </div>
                    <input type="hidden" class="selected-color" value="deep-teal" data-field="color">
                  </div>

                  <div class="mb-4">
                    <label class="block mb-2">Card Layout</label>
                    <div class="grid grid-cols-2 gap-4">
                      <div class="layout-option p-3 border rounded flex flex-col items-center cursor-pointer layout-selected" data-layout="1">
                        <div class="w-full h-16 bg-gray-200 mb-2 rounded flex items-center justify-center">
                          <div class="w-3/4 h-12 bg-gray-300 rounded"></div>
                        </div>
                        <span class="text-sm">Single Column</span>
                      </div>
                      <div class="layout-option p-3 border rounded flex flex-col items-center cursor-pointer" data-layout="2">
                        <div class="w-full h-16 bg-gray-200 mb-2 rounded flex items-center justify-center space-x-2">
                          <div class="w-5/12 h-12 bg-gray-300 rounded"></div>
                          <div class="w-5/12 h-12 bg-gray-300 rounded"></div>
                        </div>
                        <span class="text-sm">Two Columns</span>
                      </div>
                    </div>
                    <input type="hidden" class="selected-layout" value="1" data-field="layout">
                    <p class="text-xs text-gray-500 mt-2">
                      Single Column shows cards stacked on all screens.<br>
                      Two Columns shows cards side-by-side on larger screens.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Timeline with Cards Template -->
            <div id="timeline-cards-template" class="block-item p-4 mb-4 border rounded block-highlight" data-type="timeline-cards">
              <!-- Similar structure to timeline-template but specifically for timeline with cards -->
            </div>

            <!-- Tabs Template -->
            <div id="tabs-template" class="block-item p-4 mb-4 border rounded block-highlight" data-type="tabs">
              <div class="flex justify-between items-center mb-2">
                <h3 class="font-bold">Tabs</h3>
                <div class="flex">
                  <button class="collapse-toggle text-gray-500 hover:text-gray-700 focus:outline-none mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <button class="move-block text-gray-500 hover:text-gray-700 focus:outline-none mr-2 cursor-move" title="Drag to reorder">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                  </button>
                  <button class="delete-block text-red-500 hover:text-red-700 focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <div class="block-content">
                <!-- Content Tab -->
                <div class="tabs-tab-content">
                  <div class="mb-4">
                    <div class="tabs-container border p-2 rounded">
                      <!-- Initial tab panel -->
                      <div class="tab-panel mb-2 p-2 border rounded bg-gray-50">
                        <div class="flex justify-between items-center mb-2">
                          <h4 class="text-sm font-medium">Tab 1</h4>
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
                          <input type="text" class="block-input w-full p-2 border rounded" value="Tab 1" data-field="tab-title">
                          <p class="text-xs text-gray-500 mt-1">Keep titles short (2-3 words recommended)</p>
                        </div>
                        <div class="mb-2">
                          <label class="block mb-1 text-sm">Tab Content</label>
                          <div class="editor-container" data-field="tab-content">
                            <div class="rich-text-editor"></div>
                            <input type="hidden" class="editor-content" value="<p>Enter tab content here.</p>">
                          </div>
                        </div>
                      </div>
                    </div>
                    <button class="add-tab-btn mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 focus:outline-none flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
                      </svg>
                      Add Tab
                    </button>
                    <p class="text-xs text-gray-500 mt-2">
                      <strong>Note:</strong> Limit the number of tabs to 6 or fewer. If more tabs are necessary, consider an alternative formatting option.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Table Template -->
            <div id="table-template" class="block-item p-4 mb-4 border rounded block-highlight" data-type="table">
              <div class="flex justify-between items-center mb-2">
                <h3 class="font-bold">Table</h3>
                <div class="flex">
                  <button class="collapse-toggle text-gray-500 hover:text-gray-700 focus:outline-none mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <button class="move-block text-gray-500 hover:text-gray-700 focus:outline-none mr-2 cursor-move" title="Drag to reorder">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                  </button>
                  <button class="delete-block text-red-500 hover:text-red-700 focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <div class="block-content">
                <!-- Tabbed interface for table settings -->
                <div class="table-tabs mb-4 border-b">
                  <button class="table-tab table-tab-active px-3 py-2" data-tab="content">Content</button>
                  <button class="table-tab px-3 py-2" data-tab="style">Style</button>
                </div>
                
                <!-- Content Tab -->
                <div class="table-tab-content" data-tab-content="content">
                  <div class="mb-4">
                    <label class="block mb-2">Table Structure</label>
                    <div class="grid grid-cols-2 gap-4 mb-4">
                      <div class="table-cols-option p-3 border rounded flex flex-col items-center cursor-pointer table-cols-selected" data-cols="2">
                        <div class="w-full h-16 bg-gray-200 mb-2 rounded flex items-center justify-center">
                          <div class="w-5/12 h-12 bg-gray-300 rounded mr-2"></div>
                          <div class="w-5/12 h-12 bg-gray-300 rounded"></div>
                        </div>
                        <span class="text-sm">2 Columns</span>
                      </div>
                      <div class="table-cols-option p-3 border rounded flex flex-col items-center cursor-pointer" data-cols="3">
                        <div class="w-full h-16 bg-gray-200 mb-2 rounded flex items-center justify-center">
                          <div class="w-3/12 h-12 bg-gray-300 rounded mr-1"></div>
                          <div class="w-3/12 h-12 bg-gray-300 rounded mr-1"></div>
                          <div class="w-3/12 h-12 bg-gray-300 rounded"></div>
                        </div>
                        <span class="text-sm">3 Columns</span>
                      </div>
                    </div>
                    <input type="hidden" class="selected-cols" value="2" data-field="columns">
                    
                    <!-- Table Headers -->
                    <div class="mb-4">
                      <label class="block mb-2">Header Titles</label>
                      <div class="table-headers grid grid-cols-2 gap-2 mb-2">
                        <div class="header-input">
                          <input type="text" class="block-input w-full p-2 border rounded" value="Topics" data-field="header-0">
                        </div>
                        <div class="header-input">
                          <input type="text" class="block-input w-full p-2 border rounded" value="Descriptions" data-field="header-1">
                        </div>
                      </div>
                    </div>
                    
                    <!-- Table Rows -->
                    <div class="mb-4">
                      <label class="block mb-2">Table Rows</label>
                      <div class="table-rows-container border p-2 rounded">
                        <!-- Initial row -->
                        <div class="table-row mb-2 p-2 border rounded bg-gray-50">
                          <div class="flex justify-between items-center mb-2">
                            <h4 class="text-sm font-medium">Row 1</h4>
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
                          <div class="grid grid-cols-2 gap-2 row-cells">
                            <div class="mb-2">
                              <label class="block mb-1 text-xs">Topic 1</label>
                              <input type="text" class="block-input w-full p-2 border rounded" value="Topic 1" data-field="cell-0">
                            </div>
                            <div class="mb-2">
                              <label class="block mb-1 text-xs">Descriptions</label>
                              <textarea class="block-input w-full p-2 border rounded" rows="3" data-field="cell-1">Lorem ipsum, dolor sit amet consectetur adipisicing elit.</textarea>
                            </div>
                          </div>
                        </div>
                      </div>
                      <button class="add-row-btn mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 focus:outline-none flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
                        </svg>
                        Add Row
                      </button>
                    </div>
                  </div>
                </div>
                
                <!-- Style Tab -->
                <div class="table-tab-content hidden" data-tab-content="style">
                  <div class="mb-4">
                    <label class="block mb-1">Table Color</label>
                    <div class="grid grid-cols-2 gap-2">
                      <div class="color-option p-2 border rounded flex items-center cursor-pointer" data-color="deep-teal">
                        <div class="w-6 h-6 mr-2 rounded" style="background-color: #115e6e;"></div>
                        <span>Deep Teal (Preferred)</span>
                      </div>
                      <div class="color-option p-2 border rounded flex items-center cursor-pointer" data-color="dark-teal">
                        <div class="w-6 h-6 mr-2 rounded" style="background-color: #094154;"></div>
                        <span>Dark Teal</span>
                      </div>
                      <div class="color-option p-2 border rounded flex items-center cursor-pointer" data-color="ada-green">
                        <div class="w-6 h-6 mr-2 rounded" style="background-color: #046307;"></div>
                        <span>A11y Green</span>
                      </div>
                      <div class="color-option p-2 border rounded flex items-center cursor-pointer" data-color="ada-orange">
                        <div class="w-6 h-6 mr-2 rounded" style="background-color: #bb5504;"></div>
                        <span>A11y Orange</span>
                      </div>
                      <div class="color-option p-2 border rounded flex items-center cursor-pointer" data-color="dark-gray">
                        <div class="w-6 h-6 mr-2 rounded" style="background-color: #4d4d4d;"></div>
                        <span>Dark Gray</span>
                      </div>
                    </div>
                    <input type="hidden" class="selected-color" value="deep-teal" data-field="color">
                  </div>
                </div>
              </div>
            </div>

            <!-- Video Template -->
            <div id="video-template" class="block-item p-4 mb-4 border rounded block-highlight" data-type="video">
              <div class="flex justify-between items-center mb-2">
                <h3 class="font-bold">Video</h3>
                <div class="flex">
                  <button class="collapse-toggle text-gray-500 hover:text-gray-700 focus:outline-none mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <button class="move-block text-gray-500 hover:text-gray-700 focus:outline-none mr-2 cursor-move" title="Drag to reorder">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                  </button>
                  <button class="delete-block text-red-500 hover:text-red-700 focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <div class="block-content">
                <!-- Tabbed interface for video settings -->
                <div class="video-tabs mb-4 border-b">
                  <button class="video-tab video-tab-active px-3 py-2" data-tab="content">Content</button>
                  <button class="video-tab px-3 py-2" data-tab="options">Options</button>
                </div>
                
                <!-- Content Tab -->
                <div class="video-tab-content" data-tab-content="content">
                  <div class="mb-4">
                    <label class="block mb-2">Video Type</label>
                    <div class="grid grid-cols-2 gap-4 mb-4">
                      <div class="video-type-option p-3 border rounded flex flex-col items-center cursor-pointer video-type-selected" data-type="youtube">
                        <div class="w-full h-16 bg-gray-200 mb-2 rounded flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                          </svg>
                        </div>
                        <span class="text-sm">YouTube</span>
                      </div>
                      <div class="video-type-option p-3 border rounded flex flex-col items-center cursor-pointer" data-type="yuja">
                        <div class="w-full h-16 bg-gray-200 mb-2 rounded flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0 18c4.411 0 8-3.589 8-8s-3.589-8-8-8-8 3.589-8 8 3.589 8 8 8zm-3-11c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5.672-1.5 1.5-1.5zm6 0c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5.672-1.5 1.5-1.5zm-9.5 5h14v1h-14v-1z"/>
                          </svg>
                        </div>
                        <span class="text-sm">YuJa</span>
                      </div>
                    </div>
                    <input type="hidden" class="selected-video-type" value="youtube" data-field="video-type">
                    
                    <!-- Video URL Input -->
                    <div class="mb-4 youtube-input">
                      <label class="block mb-1 text-sm">YouTube Embed URL</label>
                      <input type="text" class="block-input w-full p-2 border rounded" value="https://www.youtube.com/embed/cjk5HXc-iSg" placeholder="https://www.youtube.com/embed/VIDEO_ID" data-field="youtube-url">
                      <p class="text-xs text-gray-500 mt-1">
                        Get this from YouTube: Share > Embed > Copy only the src URL
                      </p>
                    </div>
                    <div class="mb-4 yuja-input hidden">
                      <label class="block mb-1 text-sm">YuJa Embed Code</label>
                      <textarea class="block-input w-full p-2 border rounded" rows="4" placeholder='<iframe title="..." src="https://michiganvirtual.video.yuja.com/..." frameborder="0" allowfullscreen></iframe>' data-field="yuja-code">
            <iframe title="Embedded Media titled: Icon Color Change Tutorial" src="https://michiganvirtual.video.yuja.com/V/Video?v=9988343&node=43658823&a=135111809&preload=false" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen loading="lazy"></iframe>
                      </textarea>
                      <p class="text-xs text-gray-500 mt-1">
                        Paste the full iframe embed code from YuJa
                      </p>
                    </div>
                  </div>
                </div>
                
                <!-- Options Tab -->
                <div class="video-tab-content hidden" data-tab-content="options">
                  <div class="mb-4">
                    <label class="block mb-2">Transcript Link (optional)</label>
                    <input type="text" class="block-input w-full p-2 border rounded mb-1" placeholder="https://example.com/transcript.pdf" data-field="transcript-url">
                  </div>
                  <div class="mb-4">
                    <label class="block mb-2">Direct Video Link (optional)</label>
                    <input type="text" class="block-input w-full p-2 border rounded mb-1" placeholder="https://example.com/video" data-field="direct-url">
                  </div>
                </div>
              </div>
            </div>

            <!-- Image Template -->
            <div id="image-template" class="block-item p-4 mb-4 border rounded block-highlight" data-type="image">
              <div class="flex justify-between items-center mb-2">
                <h3 class="font-bold">Image</h3>
                <div class="flex">
                  <button class="collapse-toggle text-gray-500 hover:text-gray-700 focus:outline-none mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <button class="move-block text-gray-500 hover:text-gray-700 focus:outline-none mr-2 cursor-move" title="Drag to reorder">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                  </button>
                  <button class="delete-block text-red-500 hover:text-red-700 focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <div class="block-content">
                <!-- Tabbed interface for image settings -->
                <div class="image-tabs mb-4 border-b">
                  <button class="image-tab image-tab-active px-3 py-2" data-tab="content">Content</button>
                  <button class="image-tab px-3 py-2" data-tab="style">Style</button>
                </div>
                
                <!-- Content Tab -->
                <div class="image-tab-content" data-tab-content="content">
                  <div class="mb-4">
                    <label class="block mb-2">Image URL</label>
                    <input type="text" class="block-input w-full p-2 border rounded mb-2" placeholder="/content/enforced/your-course-id/your-image.jpg" data-field="image-url">
                    <p class="text-xs text-gray-500 mb-4">
                      Enter the full path to your image in the course files.
                      <br>Example: /content/enforced/your-course-id/your-image.jpg
                    </p>
                    
                    <label class="block mb-2">Alt Text</label>
                    <input type="text" class="block-input w-full p-2 border rounded mb-2" placeholder="Describe the image" value="Placeholder Image" data-field="image-alt">
                    <p class="text-xs text-gray-500 mb-4">Provide a description of the image for screen readers</p>
                    
                    <label class="block mb-2">Image Attribution (optional)</label>
                    <input type="text" class="block-input w-full p-2 border rounded mb-2" placeholder="Source or credit information" value="Image Attribution" data-field="image-attribution">
                    <p class="text-xs text-gray-500">Leave blank if no attribution is needed</p>
                  </div>
                </div>
          
                <!-- Style Tab -->
                <div class="image-tab-content hidden" data-tab-content="style">
                  <div class="mb-4">
                    <label class="block mb-2">Alignment</label>
                    <div class="grid grid-cols-3 gap-4">
                      <div class="image-align-option p-3 border rounded flex flex-col items-center cursor-pointer image-align-selected" data-align="left">
                        <div class="w-full h-16 bg-gray-200 mb-2 rounded flex items-start justify-start p-2">
                          <div class="w-8 h-8 bg-gray-400 rounded"></div>
                        </div>
                        <span class="text-sm">Left Aligned</span>
                      </div>
                      <div class="image-align-option p-3 border rounded flex flex-col items-center cursor-pointer" data-align="center">
                        <div class="w-full h-16 bg-gray-200 mb-2 rounded flex items-start justify-center p-2">
                          <div class="w-8 h-8 bg-gray-400 rounded"></div>
                        </div>
                        <span class="text-sm">Center Aligned</span>
                      </div>
                      <div class="image-align-option p-3 border rounded flex flex-col items-center cursor-pointer" data-align="column">
                        <div class="w-full h-16 bg-gray-200 mb-2 rounded flex items-center justify-between p-2">
                          <div class="w-5 h-8 bg-gray-300 rounded"></div>
                          <div class="w-8 h-8 bg-gray-400 rounded"></div>
                        </div>
                        <span class="text-sm">2-Column Layout</span>
                      </div>
                    </div>
                    <input type="hidden" class="selected-align" value="left" data-field="align"> 
                    <div class="column-text-container mt-4 hidden">
                      <label class="block mb-2">Column Text</label>
                      <div class="editor-container column-text-editor">
                        <!-- We'll use a custom class to target this specific editor -->
                        <div class="column-text-rich-editor"></div>
                        <input type="hidden" class="editor-content" value="<p>This paragraph is part of a two-column layout that will stack on tablet and mobile screens.</p>">
                      </div>
                      
                      <label class="block mb-2 mt-4">Column Order</label>
                      <div class="flex items-center">
                        <input type="checkbox" id="reverse-columns" class="mr-2" data-field="reverse-columns">
                        <label for="reverse-columns">Reverse column order (image first, then text)</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- Templates for other component types would go here -->
          </div>
        @push('styles')
        <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">
        <link rel="stylesheet" href="{{ asset('css/styles.css') }}">
        @endpush

        @push('scripts')
        <script src="https://cdn.jsdelivr.net/npm/sortablejs@1.14.0/Sortable.min.js"></script>
        <script src="https://cdn.quilljs.com/1.3.6/quill.min.js"></script>
        @vite('resources/js/app.js')
        @endpush