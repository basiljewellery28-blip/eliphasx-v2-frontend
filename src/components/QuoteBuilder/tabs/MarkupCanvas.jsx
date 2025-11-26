import React, { useRef, useState, useEffect } from 'react';

const MarkupCanvas = ({ value, onChange }) => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [tool, setTool] = useState('pen'); // pen, rectangle, circle, arrow, text
    const [color, setColor] = useState('#FF0000');
    const [lineWidth, setLineWidth] = useState(2);
    const [backgroundImage, setBackgroundImage] = useState(null);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [textInput, setTextInput] = useState('');
    const [textPosition, setTextPosition] = useState(null);

    useEffect(() => {
        // Load saved canvas data if exists
        if (value && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.onload = () => {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            };
            img.src = value;
        }
    }, []);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = canvasRef.current;
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

                    ctx.drawImage(img, 0, 0, width, height);
                    setBackgroundImage(event.target.result);
                    saveCanvas();
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    };

    const getMousePos = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
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
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (tool === 'pen') {
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
        }
    };

    const stopDrawing = (e) => {
        if (!isDrawing) return;

        const pos = getMousePos(e);
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

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

        setIsDrawing(false);
        saveCanvas();
    };

    const drawArrow = (ctx, fromX, fromY, toX, toY) => {
        const headLength = 15;
        const angle = Math.atan2(toY - fromY, toX - fromX);

        // Draw line
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();

        // Draw arrowhead
        ctx.beginPath();
        ctx.moveTo(toX, toY);
        ctx.lineTo(
            toX - headLength * Math.cos(angle - Math.PI / 6),
            toY - headLength * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(toX, toY);
        ctx.lineTo(
            toX - headLength * Math.cos(angle + Math.PI / 6),
            toY - headLength * Math.sin(angle + Math.PI / 6)
        );
        ctx.stroke();
    };

    const addText = () => {
        if (!textInput || !textPosition) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.font = `${lineWidth * 8}px Arial`;
        ctx.fillStyle = color;
        ctx.fillText(textInput, textPosition.x, textPosition.y);

        setTextInput('');
        setTextPosition(null);
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
            };
            img.src = backgroundImage;
        }

        saveCanvas();
    };

    const saveCanvas = () => {
        const canvas = canvasRef.current;
        if (canvas && onChange) {
            const dataUrl = canvas.toDataURL('image/png');
            onChange(dataUrl);
        }
    };

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

            {/* Canvas */}
            <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
                <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    className="cursor-crosshair w-full"
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
