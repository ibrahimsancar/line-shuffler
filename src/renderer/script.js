const { ipcRenderer } = require('electron');

// Global state management
class AppState {
    constructor() {
        this.currentTheme = 'dark'; // Sadece dark theme
        this.inputLines = [];
        this.fixedLines = []; // Array for multiple fixed lines
        this.lastShuffleResult = null;
        this.nextFixedLineId = 1;
        this.lastClipboardText = '';
        // 2025 Features
        this.history = [];
        this.historyIndex = -1;
        this.maxHistorySize = 20;
        this.stats = { totalShuffles: 0, linesProcessed: 0 };
    }

            // History functions removed

    setTheme(theme) {
        this.currentTheme = theme;
        // Dark theme default, no light theme
    }

    showToast(message, type = 'success') {
        // Toast notifications removed for cleaner design
        // Operations still work but without visual notifications
        console.log(`${type.toUpperCase()}: ${message}`);
    }

    updateLineCount() {
        const text = document.getElementById('inputText').value;
        const lines = text.split('\n').filter(line => line.trim());
        this.inputLines = lines;
        
        document.getElementById('lineCount').textContent = lines.length;
        this.updateFixedLineSelects();
    }

    updateFixedLineSelects() {
        // Update all fixed line selects
        const selects = document.querySelectorAll('.fixed-line-select');
        selects.forEach(select => {
            const currentValue = select.value;
            select.innerHTML = '<option value="">Select a line...</option>';
            
            this.inputLines.forEach((line, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = `${index + 1}. ${line.substring(0, 40)}${line.length > 40 ? '...' : ''}`;
                select.appendChild(option);
            });
            
            // Restore previous selection
            if (currentValue) select.value = currentValue;
        });
    }

    addFixedLine() {
        const fixedLine = {
            id: this.nextFixedLineId++,
            lineIndex: null,
            position: null
        };
        
        this.fixedLines.push(fixedLine);
        this.renderFixedLines();
    }

    removeFixedLine(id) {
        this.fixedLines = this.fixedLines.filter(fl => fl.id !== id);
        this.renderFixedLines();
    }

    renderFixedLines() {
        const container = document.getElementById('fixedLinesContainer');
        
        if (this.fixedLines.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-info-circle"></i>
                    No fixed lines added yet
                </div>
            `;
            return;
        }

        container.innerHTML = this.fixedLines.map((fixedLine, index) => `
            <div class="fixed-line-entry" data-id="${fixedLine.id}">
                <div class="fixed-line-header">
                    <span class="fixed-line-number">Fixed Line #${index + 1}</span>
                    <button type="button" class="btn-remove" onclick="app.removeFixedLine(${fixedLine.id})">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="input-group">
                    <select class="fixed-line-select" data-id="${fixedLine.id}">
                        <option value="">Select a line...</option>
                    </select>
                    <input type="number" class="fixed-position-input" data-id="${fixedLine.id}" 
                           placeholder="Position" min="1" max="${this.inputLines.length}">
                </div>
            </div>
        `).join('');

        // Event listeners ekle
        container.querySelectorAll('.fixed-line-select').forEach(select => {
            select.addEventListener('change', (e) => {
                const id = parseInt(e.target.dataset.id);
                const fixedLine = this.fixedLines.find(fl => fl.id === id);
                if (fixedLine) {
                    fixedLine.lineIndex = e.target.value ? parseInt(e.target.value) : null;
                }
            });
        });

        container.querySelectorAll('.fixed-position-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const id = parseInt(e.target.dataset.id);
                const fixedLine = this.fixedLines.find(fl => fl.id === id);
                if (fixedLine) {
                    fixedLine.position = e.target.value ? parseInt(e.target.value) : null;
                }
            });
        });

        // Update options
        this.updateFixedLineSelects();
    }

    async pasteFromClipboard() {
        try {
            const text = await navigator.clipboard.readText();
            if (text && text.trim()) {
                document.getElementById('inputText').value = text;
                this.updateLineCount();
                this.showToast('Pasted from clipboard', 'success');
            } else {
                this.showToast('Clipboard is empty or contains no text', 'warning');
            }
        } catch (error) {
            this.showToast('Clipboard access permission required', 'error');
            console.error('Clipboard error:', error);
        }
    }

    async autopasteFromClipboard(text) {
        try {
            if (text && text.trim()) {
                document.getElementById('inputText').value = text;
                this.updateLineCount();
                
                const lineCount = text.split('\n').filter(line => line.trim()).length;
                this.showToast(`${lineCount} lines of text auto-pasted`, 'success');
            }
        } catch (error) {
            console.error('Autopaste error:', error);
        }
    }

    async detectClipboardChanges() {
        try {
            const currentText = await navigator.clipboard.readText();
            if (currentText && currentText.trim() && currentText !== this.lastClipboardText) {
                this.lastClipboardText = currentText;
                
                // Auto-paste if multi-line text
                const lineCount = currentText.split('\n').filter(line => line.trim()).length;
                if (lineCount > 1) {
                    await this.autopasteFromClipboard(currentText);
                }
            }
        } catch (error) {
            // Fail silently - don't show notification if no permission
        }
    }



    startClipboardMonitoring() {
        // Check clipboard every 2 seconds
        setInterval(() => {
            this.detectClipboardChanges();
        }, 2000);
    }

    // 2025 History Management
    saveToHistory(state) {
        const historyItem = {
            inputText: state.inputText,
            fixedLines: JSON.parse(JSON.stringify(state.fixedLines)),
            timestamp: new Date().toISOString(),
            action: state.action || 'Unknown'
        };

        // Remove future history if we're not at the end
        if (this.historyIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.historyIndex + 1);
        }

        this.history.push(historyItem);
        this.historyIndex++;

        // Limit history size
        if (this.history.length > this.maxHistorySize) {
            this.history.shift();
            this.historyIndex--;
        }
    }

    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            const historyItem = this.history[this.historyIndex];
            this.restoreFromHistory(historyItem);
            this.showToast(`Undone: ${historyItem.action}`, 'info');
            return true;
        }
        this.showToast('Nothing to undo', 'warning');
        return false;
    }

    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            const historyItem = this.history[this.historyIndex];
            this.restoreFromHistory(historyItem);
            this.showToast(`Redone: ${historyItem.action}`, 'info');
            return true;
        }
        this.showToast('Nothing to redo', 'warning');
        return false;
    }

    restoreFromHistory(historyItem) {
        document.getElementById('inputText').value = historyItem.inputText;
        this.fixedLines = JSON.parse(JSON.stringify(historyItem.fixedLines));
        this.updateLineCount();
        this.renderFixedLines();
    }

    updateStats(linesCount) {
        this.stats.totalShuffles++;
        this.stats.linesProcessed += linesCount;
        
        if (this.stats.totalShuffles % 10 === 0) {
            this.showToast(`🎉 ${this.stats.totalShuffles} shuffles completed!`, 'success');
        }
    }
}

// Shuffle algorithm (Fisher-Yates)
class ShuffleEngine {
    static fisherYatesShuffle(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    static shuffleWithFixedLines(lines, fixedLines) {
        if (lines.length === 0) return [];
        
        // Validasyon
        for (const fixedLine of fixedLines) {
            if (fixedLine.lineIndex < 0 || fixedLine.lineIndex >= lines.length) {
                throw new Error(`Invalid fixed line index: ${fixedLine.lineIndex + 1}`);
            }
            
            if (fixedLine.position < 1 || fixedLine.position > lines.length) {
                throw new Error(`Invalid fixed position: ${fixedLine.position}`);
            }
        }

        // Check for position conflicts
        const positions = fixedLines.map(fl => fl.position);
        const uniquePositions = new Set(positions);
        if (positions.length !== uniquePositions.size) {
            throw new Error('Cannot have multiple fixed lines at the same position');
        }

        // Create result array
        const result = new Array(lines.length);
        const usedLineIndices = new Set();

        // Place fixed lines
        for (const fixedLine of fixedLines) {
            const targetIndex = fixedLine.position - 1;
            result[targetIndex] = lines[fixedLine.lineIndex];
            usedLineIndices.add(fixedLine.lineIndex);
        }

        // Shuffle remaining lines
        const remainingLines = lines.filter((_, index) => !usedLineIndices.has(index));
        const shuffledRemaining = this.fisherYatesShuffle(remainingLines);

        // Fill empty positions
        let shuffledIndex = 0;
        for (let i = 0; i < result.length; i++) {
            if (result[i] === undefined) {
                result[i] = shuffledRemaining[shuffledIndex++];
            }
        }
        
        return result;
    }

    static shuffleLines(lines, fixedLines = []) {
        if (lines.length === 0) return [];
        
        // Filter valid fixed lines
        const validFixedLines = fixedLines.filter(fl => 
            fl.lineIndex !== null && 
            fl.position !== null &&
            fl.lineIndex >= 0 && 
            fl.lineIndex < lines.length &&
            fl.position >= 1 && 
            fl.position <= lines.length
        );
        
        if (validFixedLines.length > 0) {
            return this.shuffleWithFixedLines(lines, validFixedLines);
        } else {
            return this.fisherYatesShuffle(lines);
        }
    }
}

const app = new AppState();

function initializeEventHandlers() {
    // Theme toggle removed - dark theme only

    // Add fixed line button
    document.getElementById('addFixedLine').addEventListener('click', () => {
        app.addFixedLine();
    });

    document.getElementById('inputText').addEventListener('input', () => {
        app.updateLineCount();
    });

    // Clipboard paste button
    document.getElementById('pasteFromClipboard').addEventListener('click', () => {
        app.pasteFromClipboard();
    });

    document.getElementById('fileUpload').addEventListener('click', () => {
        document.getElementById('fileInput').click();
    });

    document.getElementById('fileInput').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                document.getElementById('inputText').value = e.target.result;
                app.updateLineCount();
                app.showToast('File loaded successfully', 'success');
            };
            reader.readAsText(file);
        }
    });

    document.getElementById('clearInput').addEventListener('click', () => {
        document.getElementById('inputText').value = '';
        app.updateLineCount();
        app.fixedLines = [];
        app.renderFixedLines();
        app.showToast('Input cleared', 'success');
    });

    document.getElementById('shuffleBtn').addEventListener('click', performShuffle);

    document.getElementById('previewBtn').addEventListener('click', () => {
        try {
            const result = validateAndGetShuffleInputs();
            if (result) {
                const shuffled = ShuffleEngine.shuffleLines(
                    result.lines,
                    result.fixedLines
                );
                displayOutput(shuffled.join('\n'));
                app.showToast('Preview prepared', 'success');
            }
        } catch (error) {
            app.showToast(error.message, 'error');
        }
    });

    document.getElementById('copyOutput').addEventListener('click', () => {
        if (app.lastShuffleResult) {
            navigator.clipboard.writeText(app.lastShuffleResult)
                        .then(() => app.showToast('Copied to clipboard', 'success'))
        .catch(() => app.showToast('Copy failed', 'error'));
        }
    });

    document.getElementById('saveOutput').addEventListener('click', async () => {
        if (app.lastShuffleResult) {
            try {
                const result = await ipcRenderer.invoke('save-file-dialog', app.lastShuffleResult);
                if (result.success) {
                    app.showToast('File saved successfully', 'success');
                } else if (!result.canceled) {
                    app.showToast('File save error: ' + result.error, 'error');
                }
            } catch (error) {
                app.showToast('File save error', 'error');
            }
        }
    });

    // History-related event handlers removed
}

function validateAndGetShuffleInputs() {
    const inputText = document.getElementById('inputText').value.trim();
    
    if (!inputText) {
        throw new Error('Please enter text to shuffle');
    }

    const lines = inputText.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
        throw new Error('At least 2 lines required');
    }

    // Validate fixed lines
    const validFixedLines = [];
    for (const fixedLine of app.fixedLines) {
        if (fixedLine.lineIndex !== null && fixedLine.position !== null) {
            if (fixedLine.lineIndex < 0 || fixedLine.lineIndex >= lines.length) {
                throw new Error(`Invalid line selection: ${fixedLine.lineIndex + 1}`);
            }
            if (fixedLine.position < 1 || fixedLine.position > lines.length) {
                throw new Error(`Invalid position: ${fixedLine.position}`);
            }
            validFixedLines.push(fixedLine);
        }
    }

    // Check for position conflicts
    const positions = validFixedLines.map(fl => fl.position);
    const uniquePositions = new Set(positions);
    if (positions.length !== uniquePositions.size) {
        throw new Error('Cannot have multiple fixed lines at the same position');
    }

    return {
        lines,
        fixedLines: validFixedLines,
        inputText
    };
}

function performShuffle() {
    try {
        const result = validateAndGetShuffleInputs();
        
        // Save to history before shuffle
        app.saveToHistory({
            inputText: result.inputText,
            fixedLines: result.fixedLines,
                            action: 'Shuffle'
        });
        
        const shuffled = ShuffleEngine.shuffleLines(
            result.lines,
            result.fixedLines
        );
        
        const outputText = shuffled.join('\n');
        displayOutput(outputText);
        
        // Update stats
        app.updateStats(result.lines.length);
        
        app.showToast('✨ Shuffle completed', 'success');
        
    } catch (error) {
        app.showToast(error.message, 'error');
    }
}

function displayOutput(text) {
    const outputArea = document.getElementById('outputArea');
    outputArea.innerHTML = `<pre>${text}</pre>`;
    
    app.lastShuffleResult = text;
    
    document.getElementById('copyOutput').disabled = false;
    document.getElementById('saveOutput').disabled = false;
}

ipcRenderer.on('file-opened', (event, content) => {
    document.getElementById('inputText').value = content;
    app.updateLineCount();
            app.showToast('File opened successfully', 'success');
});

ipcRenderer.on('save-file-request', () => {
    document.getElementById('saveOutput').click();
});

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
            case 's':
                e.preventDefault();
                if (app.lastShuffleResult) {
                    document.getElementById('saveOutput').click();
                }
                break;
            case 'v':
                // If text input is not focused, paste from clipboard
                if (document.activeElement !== document.getElementById('inputText')) {
                    e.preventDefault();
                    app.pasteFromClipboard();
                }
                break;
            case 'Enter':
                if (e.shiftKey) {
                    e.preventDefault();
                    performShuffle();
                }
                break;
        }
    }
});

// 2025 Modern Features
function initializeDragAndDrop() {
    const inputText = document.getElementById('inputText');
    const dropZone = inputText.parentElement;

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });

    function highlight(e) {
        dropZone.classList.add('drag-over');
    }

    function unhighlight(e) {
        dropZone.classList.remove('drag-over');
    }

    dropZone.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;

        if (files.length > 0) {
            const file = files[0];
            if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    inputText.value = e.target.result;
                    app.updateLineCount();
                    app.showToast(`${file.name} file loaded successfully`, 'success');
                };
                reader.readAsText(file);
            } else {
                app.showToast('Only .txt files are supported', 'error');
            }
        }
    }
}

function initializeSmartFeatures() {
    const inputText = document.getElementById('inputText');
    
    // Smart pattern detection
    inputText.addEventListener('input', () => {
        const text = inputText.value;
        const lines = text.split('\n').filter(line => line.trim());
        
        // URL pattern detection
        const urlPattern = /https?:\/\/[^\s]+/g;
        const urlCount = text.match(urlPattern)?.length || 0;
        
        if (urlCount > 5) {
            app.showToast(`${urlCount} URLs detected - URL shuffle mode active`, 'info');
        }
        
        // Social media pattern detection
        const socialPatterns = [
            /@[a-zA-Z0-9_]+/, // Twitter handles
            /instagram\.com\/[a-zA-Z0-9_]+/, // Instagram
            /youtube\.com\/[a-zA-Z0-9_]+/ // YouTube
        ];
        
        const hasSocialMedia = socialPatterns.some(pattern => pattern.test(text));
        if (hasSocialMedia && lines.length > 10) {
            app.showToast('Social media accounts detected', 'info');
        }
    });
}

function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 's':
                    e.preventDefault();
                    if (app.lastShuffleResult) {
                        document.getElementById('saveOutput').click();
                    }
                    break;
                case 'v':
                    if (document.activeElement !== document.getElementById('inputText')) {
                        e.preventDefault();
                        app.pasteFromClipboard();
                    }
                    break;
                case 'Enter':
                    if (e.shiftKey) {
                        e.preventDefault();
                        performShuffle();
                    }
                    break;
                case 'a':
                    if (e.shiftKey) {
                        e.preventDefault();
                        app.addFixedLine();
                        app.showToast('New fixed line added (Ctrl+Shift+A)', 'info');
                    }
                    break;
                case 'c':
                    if (e.shiftKey && app.lastShuffleResult) {
                        e.preventDefault();
                        document.getElementById('copyOutput').click();
                    }
                    break;
                case 'z':
                    if (e.shiftKey) {
                        e.preventDefault();
                        app.redo();
                    } else {
                        e.preventDefault();
                        app.undo();
                    }
                    break;
            }
        }
        
        // ESC key for clearing
        if (e.key === 'Escape') {
            const inputText = document.getElementById('inputText');
            if (inputText.value) {
                inputText.blur();
                app.showToast('Focus removed with ESC', 'info');
            }
        }
    });
}

function initializeApp() {
    app.setTheme(app.currentTheme);
    initializeEventHandlers();
    initializeDragAndDrop(); // 2025 Feature
    initializeSmartFeatures(); // 2025 Feature
    initializeKeyboardShortcuts(); // Enhanced shortcuts
    app.updateLineCount();
    app.renderFixedLines();
    app.startClipboardMonitoring();
    
    // Welcome animation
    setTimeout(() => {
        app.showToast('🎉 Line Shuffler 2025 - Ready!', 'success');
    }, 500);
    
    console.log('Line Shuffler 2025 application started');
}

document.addEventListener('DOMContentLoaded', initializeApp); 