import { useEffect, useCallback } from 'react';

/**
 * useKeyboardNavigation Hook
 * Adds keyboard shortcuts for common navigation actions
 */
export const useKeyboardNavigation = (handlers = {}) => {
    const {
        onEscape,
        onEnter,
        onTab,
        onArrowUp,
        onArrowDown,
        onArrowLeft,
        onArrowRight,
        onSave,  // Ctrl+S
        onNew,   // Ctrl+N
        onSearch // Ctrl+K
    } = handlers;

    const handleKeyDown = useCallback((event) => {
        const { key, ctrlKey, metaKey } = event;
        const isModifier = ctrlKey || metaKey;

        // Escape - close modals, cancel actions
        if (key === 'Escape' && onEscape) {
            event.preventDefault();
            onEscape();
            return;
        }

        // Enter - submit forms, confirm actions
        if (key === 'Enter' && !event.shiftKey && onEnter) {
            // Don't prevent default if in a textarea
            if (event.target.tagName !== 'TEXTAREA') {
                onEnter(event);
            }
            return;
        }

        // Tab navigation
        if (key === 'Tab' && onTab) {
            onTab(event.shiftKey ? 'prev' : 'next', event);
            return;
        }

        // Arrow key navigation
        if (key === 'ArrowUp' && onArrowUp) {
            event.preventDefault();
            onArrowUp();
            return;
        }
        if (key === 'ArrowDown' && onArrowDown) {
            event.preventDefault();
            onArrowDown();
            return;
        }
        if (key === 'ArrowLeft' && onArrowLeft) {
            onArrowLeft();
            return;
        }
        if (key === 'ArrowRight' && onArrowRight) {
            onArrowRight();
            return;
        }

        // Keyboard shortcuts with modifier
        if (isModifier) {
            // Ctrl+S - Save
            if (key === 's' && onSave) {
                event.preventDefault();
                onSave();
                return;
            }
            // Ctrl+N - New
            if (key === 'n' && onNew) {
                event.preventDefault();
                onNew();
                return;
            }
            // Ctrl+K - Search (spotlight)
            if (key === 'k' && onSearch) {
                event.preventDefault();
                onSearch();
                return;
            }
        }
    }, [onEscape, onEnter, onTab, onArrowUp, onArrowDown, onArrowLeft, onArrowRight, onSave, onNew, onSearch]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
};

/**
 * useFocusTrap Hook
 * Traps focus within a container (for modals/dialogs)
 */
export const useFocusTrap = (containerRef, isActive = true) => {
    useEffect(() => {
        if (!isActive || !containerRef.current) return;

        const container = containerRef.current;
        const focusableElements = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        // Focus first element
        firstElement?.focus();

        const handleKeyDown = (event) => {
            if (event.key !== 'Tab') return;

            if (event.shiftKey) {
                if (document.activeElement === firstElement) {
                    event.preventDefault();
                    lastElement?.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    event.preventDefault();
                    firstElement?.focus();
                }
            }
        };

        container.addEventListener('keydown', handleKeyDown);
        return () => container.removeEventListener('keydown', handleKeyDown);
    }, [containerRef, isActive]);
};

/**
 * KeyboardShortcutsHelp - Component showing available shortcuts
 */
export const KeyboardShortcutsHelp = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const shortcuts = [
        { keys: 'Ctrl + S', description: 'Save current work' },
        { keys: 'Ctrl + N', description: 'Create new quote' },
        { keys: 'Ctrl + K', description: 'Open search' },
        { keys: 'Escape', description: 'Close modal / Cancel' },
        { keys: 'Enter', description: 'Submit / Confirm' },
        { keys: '↑ ↓', description: 'Navigate list items' },
        { keys: 'Tab', description: 'Move to next field' }
    ];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">⌨️ Keyboard Shortcuts</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
                </div>
                <div className="space-y-2">
                    {shortcuts.map((shortcut, index) => (
                        <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                            <span className="text-gray-600">{shortcut.description}</span>
                            <kbd className="px-2 py-1 bg-gray-100 rounded text-sm font-mono text-gray-700">
                                {shortcut.keys}
                            </kbd>
                        </div>
                    ))}
                </div>
                <p className="mt-4 text-xs text-gray-400 text-center">
                    Press <kbd className="px-1 bg-gray-100 rounded">?</kbd> to show this help
                </p>
            </div>
        </div>
    );
};

export default {
    useKeyboardNavigation,
    useFocusTrap,
    KeyboardShortcutsHelp
};
