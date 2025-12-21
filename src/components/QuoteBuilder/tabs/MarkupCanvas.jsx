import React, { useRef, useState, useEffect, useCallback } from 'react';

const MarkupCanvas = ({ value, onChange }) => {
    const canvasRef = useRef(null);
    const overlayRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [tool, setTool] = useState('pen'); // pen, rectangle, circle, arrow, text
    const [color, setColor] = useState('#FF0000');
    const [lineWidth, setLineWidth] = useState(2);
    const [backgroundImage, setBackgroundImage] = useState(null);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [textInput, setTextInput] = useState('');
    const [textPosition, setTextPosition] = useState(null);

    // Undo/Redo History
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const maxHistory = 50;

    // Initialize canvas with default size
    useEffect(() => {
        const canvas = canvasRef.current;
        const overlay = overlayRef.current;
        if (canvas && overlay) {
            canvas.width = 800;
            canvas.height = 600;
            overlay.width = 800;
            overlay.height = 600;

            // Load saved canvas data if exists
            if (value) {
                const img = new Image();
                img.onload = () => {
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    // Save initial state to history
                    saveToHistory();
                };
                img.src = value;
            }
        }
    }, []);

    // Keyboard shortcuts for undo/redo
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
                e.preventDefault();
                if (e.shiftKey) {
                    redo();
                } else {
                    undo();
                }
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
                e.preventDefault();
                redo();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [historyIndex, history]);

    // Save current canvas state to history
    const saveToHistory = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const dataUrl = canvas.toDataURL('image/png');

        setHistory(prev => {
            // Trim future states if we've undone and now making new changes
            const newHistory = prev.slice(0, historyIndex + 1);
            newHistory.push(dataUrl);

            // Limit history size
            if (newHistory.length > maxHistory) {
                newHistory.shift();
            }

            return newHistory;
        });

        setHistoryIndex(prev => Math.min(prev + 1, maxHistory - 1));
    }, [historyIndex]);

    // Undo action
    const undo = useCallback(() => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            restoreFromHistory(newIndex);
            setHistoryIndex(newIndex);
        }
    }, [historyIndex, history]);

    // Redo action
    const redo = useCallback(() => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            restoreFromHistory(newIndex);
            setHistoryIndex(newIndex);
        }
    }, [historyIndex, history]);

    // Restore canvas from history
    const restoreFromHistory = (index) => {
        if (index < 0 || index >= history.length) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            saveCanvas();
        };
        img.src = history[index];
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = canvasRef.current;
                    const overlay = overlayRef.current;
                    const ctx = canvas.getContext('2d');

                    // Set canvas size to image size (max 800x600)
                    const maxWidth = 800;
                    const maxHeight = 600;
                    let width = img.width;
                    let height = img.height;

                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }
                    if (height > maxHeight) {
                        width = (width * maxHeight) / height;
                        height = maxHeight;
                    }

                    canvas.width = width;
                    canvas.height = height;
                    overlay.width = width;
                    overlay.height = height;

                    ctx.drawImage(img, 0, 0, width, height);
                    setBackgroundImage(event.target.result);
                    saveToHistory();
                    saveCanvas();
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    };

    // 🎯 FIXED: Precise cursor positioning with scale ratio
    const getMousePos = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();

        // Calculate scale ratio between actual canvas size and displayed size
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    };

    const startDrawing = (e) => {
        const pos = getMousePos(e);
        setIsDrawing(true);
        setStartPos(pos);

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        if (tool === 'pen') {
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
        } else if (tool === 'text') {
            setTextPosition(pos);
        }
    };

    const draw = (e) => {
        if (!isDrawing || tool === 'text') return;

        const pos = getMousePos(e);

        if (tool === 'pen') {
            // Draw directly on main canvas for pen tool
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
        } else {
            // 🎯 LIVE PREVIEW: Draw on overlay canvas for shapes
            const overlay = overlayRef.current;
            const ctx = overlay.getContext('2d');

            // Clear overlay and redraw preview
            ctx.clearRect(0, 0, overlay.width, overlay.height);
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            if (tool === 'rectangle') {
                const width = pos.x - startPos.x;
                const height = pos.y - startPos.y;
                ctx.strokeRect(startPos.x, startPos.y, width, height);
            } else if (tool === 'circle') {
                const radius = Math.sqrt(
                    Math.pow(pos.x - startPos.x, 2) + Math.pow(pos.y - startPos.y, 2)
                );
                ctx.beginPath();
                ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
                ctx.stroke();
            } else if (tool === 'arrow') {
                drawArrow(ctx, startPos.x, startPos.y, pos.x, pos.y);
            }
        }
    };

    const stopDrawing = (e) => {
        if (!isDrawing) return;

        const pos = getMousePos(e);
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const overlay = overlayRef.current;

        // Clear overlay preview
        if (overlay) {
            overlay.getContext('2d').clearRect(0, 0, overlay.width, overlay.height);
        }

        // Draw final shape on main canvas
        if (tool === 'rectangle') {
            const width = pos.x - startPos.x;
            const height = pos.y - startPos.y;
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth;
            ctx.strokeRect(startPos.x, startPos.y, width, height);
        } else if (tool === 'circle') {
            const radius = Math.sqrt(
                Math.pow(pos.x - startPos.x, 2) + Math.pow(pos.y - startPos.y, 2)
            );
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth;
            ctx.beginPath();
            ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
            ctx.stroke();
        } else if (tool === 'arrow') {
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth;
            drawArrow(ctx, startPos.x, startPos.y, pos.x, pos.y);
        }

        setIsDrawing(false);
        saveToHistory();
        saveCanvas();
    };

    const drawArrow = (ctx, fromX, fromY, toX, toY) => {
        const headLength = Math.max(15, lineWidth * 5);
        const angle = Math.atan2(toY - fromY, toX - fromX);

        // Draw line
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();

        // Draw filled arrowhead for better visibility
        ctx.beginPath();
        ctx.moveTo(toX, toY);
        ctx.lineTo(
            toX - headLength * Math.cos(angle - Math.PI / 6),
            toY - headLength * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
            toX - headLength * Math.cos(angle + Math.PI / 6),
            toY - headLength * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
    };

    const addText = () => {
        if (!textInput || !textPosition) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.font = `bold ${lineWidth * 8}px Arial`;
        ctx.fillStyle = color;
        ctx.fillText(textInput, textPosition.x, textPosition.y);

        setTextInput('');
        setTextPosition(null);
        saveToHistory();
        saveCanvas();
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (backgroundImage) {
            const img = new Image();
            img.onload = () => {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                saveToHistory();
                saveCanvas();
            };
            img.src = backgroundImage;
        } else {
            saveToHistory();
            saveCanvas();
        }
    };

    const saveCanvas = () => {
        const canvas = canvasRef.current;
        if (canvas && onChange) {
            const dataUrl = canvas.toDataURL('image/png');
            onChange(dataUrl);
        }
    };

    const canUndo = historyIndex > 0;
    const canRedo = historyIndex < history.length - 1;

    return (
        <div className="space-y-4">
            {/* Tool Palette */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex flex-wrap items-center gap-3">
                    {/* Upload Button */}
                    <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium transition-colors">
                        📤 Upload Image
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                    </label>

                    <div className="h-6 w-px bg-gray-300"></div>

                    {/* Undo/Redo Buttons */}
                    <button
                        onClick={undo}
                        disabled={!canUndo}
                        className={`px-3 py-2 rounded-md font-medium transition-colors ${canUndo
                                ? 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                        title="Undo (Ctrl+Z)"
                    >
                        ↩️ Undo
                    </button>

                    <button
                        onClick={redo}
                        disabled={!canRedo}
                        className={`px-3 py-2 rounded-md font-medium transition-colors ${canRedo
                                ? 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                        title="Redo (Ctrl+Y)"
                    >
                        ↪️ Redo
                    </button>

                    <div className="h-6 w-px bg-gray-300"></div>

                    {/* Drawing Tools */}
                    <button
                        onClick={() => setTool('pen')}
                        className={`px-3 py-2 rounded-md font-medium transition-colors ${tool === 'pen'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                        title="Freehand Drawing"
                    >
                        ✏️ Pen
                    </button>

                    <button
                        onClick={() => setTool('rectangle')}
                        className={`px-3 py-2 rounded-md font-medium transition-colors ${tool === 'rectangle'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                        title="Rectangle"
                    >
                        ▭ Rectangle
                    </button>

                    <button
                        onClick={() => setTool('circle')}
                        className={`px-3 py-2 rounded-md font-medium transition-colors ${tool === 'circle'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                        title="Circle"
                    >
                        ⭕ Circle
                    </button>

                    <button
                        onClick={() => setTool('arrow')}
                        className={`px-3 py-2 rounded-md font-medium transition-colors ${tool === 'arrow'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                        title="Arrow"
                    >
                        ➜ Arrow
                    </button>

                    <button
                        onClick={() => setTool('text')}
                        className={`px-3 py-2 rounded-md font-medium transition-colors ${tool === 'text'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                        title="Text Annotation"
                    >
                        T Text
                    </button>

                    <div className="h-6 w-px bg-gray-300"></div>

                    {/* Color Picker */}
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">Color:</label>
                        <input
                            type="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                        />
                    </div>

                    {/* Line Width */}
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">Width:</label>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={lineWidth}
                            onChange={(e) => setLineWidth(parseInt(e.target.value))}
                            className="w-24"
                        />
                        <span className="text-sm text-gray-600 w-6">{lineWidth}</span>
                    </div>

                    <div className="h-6 w-px bg-gray-300"></div>

                    {/* Clear Button */}
                    <button
                        onClick={clearCanvas}
                        className="px-3 py-2 rounded-md font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                        title="Clear Drawings"
                    >
                        🗑️ Clear
                    </button>
                </div>

                {/* History indicator */}
                <div className="mt-2 text-xs text-gray-500">
                    History: {historyIndex + 1} / {history.length} states | Ctrl+Z to undo, Ctrl+Y to redo
                </div>
            </div>

            {/* Text Input (shown when text tool is active and position is set) */}
            {tool === 'text' && textPosition && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-3">
                        <input
                            type="text"
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                            placeholder="Enter text annotation..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') addText();
                            }}
                        />
                        <button
                            onClick={addText}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                        >
                            Add Text
                        </button>
                        <button
                            onClick={() => {
                                setTextPosition(null);
                                setTextInput('');
                            }}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-medium"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Canvas Container */}
            <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white relative">
                {/* Main Canvas */}
                <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    className="cursor-crosshair w-full"
                    style={{ maxWidth: '100%', height: 'auto', display: 'block' }}
                />
                {/* Overlay Canvas for live preview */}
                <canvas
                    ref={overlayRef}
                    className="absolute top-0 left-0 pointer-events-none w-full"
                    style={{ maxWidth: '100%', height: 'auto' }}
                />
            </div>

            {!backgroundImage && (
                <div className="text-center py-8 text-gray-500 text-sm">
                    Upload a reference image to start marking up designs
                </div>
            )}
        </div>
    );
};

export default MarkupCanvas;
