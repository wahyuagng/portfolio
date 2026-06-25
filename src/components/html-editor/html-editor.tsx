import { Icon } from '@iconify/react';
import React, { useRef, useState, useEffect } from 'react';

import { Box, Tab, Tabs, Paper, Button, Divider, TextField, ButtonGroup } from '@mui/material';

interface HtmlEditorProps {
    value: string;
    onChange: (value: string) => void;
    height?: string;
}

const HtmlEditor: React.FC<HtmlEditorProps> = ({ value, onChange, height = '300px' }) => {
    const [currentValue, setCurrentValue] = useState(value);
    const [preview, setPreview] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [zoom, setZoom] = useState(1);

    const handleZoomIn = () => setZoom((z) => Math.min(z + 0.1, 3));
    const handleZoomOut = () => setZoom((z) => Math.max(z - 0.1, 0.5));

    useEffect(() => {
        setCurrentValue(value);
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        setCurrentValue(newValue);
        onChange(newValue);
    };

    const handleInsertTag = (openTag: string, closeTag: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = currentValue.substring(start, end);
        const beforeText = currentValue.substring(0, start);
        const afterText = currentValue.substring(end);

        const newValue = `${beforeText}${openTag}${selectedText}${closeTag}${afterText}`;
        setCurrentValue(newValue);
        onChange(newValue);

        // Set cursor position after update
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + openTag.length, end + openTag.length);
        }, 0);
    };

    const insertAtCursor = (text: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const beforeText = currentValue.substring(0, start);
        const afterText = currentValue.substring(start);

        const newValue = `${beforeText}${text}${afterText}`;
        setCurrentValue(newValue);
        onChange(newValue);

        // Set cursor position after update
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + text.length, start + text.length);
        }, 0);
    };

    const handleInsertLink = () => {
        const url = prompt('Enter URL:');
        if (!url) return;

        const text = prompt('Enter link text:', url);
        const linkHtml = `<a href="${url}">${text || url}</a>`;
        handleInsertTag(linkHtml, '');
    };

    const handleInsertImage = () => {
        const url = prompt('Enter image URL:');
        if (!url) return;

        const alt = prompt('Enter alt text:', '');
        const imgHtml = `<img src="${url}" alt="${alt || ''}" />`;
        insertAtCursor(imgHtml);
    };

    const handleInsertTable = () => {
        const rows = parseInt(prompt('Number of rows:', '3') || '3', 10);
        const cols = parseInt(prompt('Number of columns:', '3') || '3', 10);

        let tableHtml = '<table border="1" style="width:100%; border-collapse: collapse;">\n';

        // Header row
        tableHtml += '  <tr>\n';
        for (let c = 0; c < cols; c++) {
            tableHtml += `    <th style="padding: 8px; border: 1px solid #ddd;">Header ${c + 1}</th>\n`;
        }
        tableHtml += '  </tr>\n';

        // Data rows
        for (let r = 0; r < rows - 1; r++) {
            tableHtml += '  <tr>\n';
            for (let c = 0; c < cols; c++) {
                tableHtml += `    <td style="padding: 8px; border: 1px solid #ddd;">Cell ${r + 1}-${c + 1}</td>\n`;
            }
            tableHtml += '  </tr>\n';
        }

        tableHtml += '</table>';
        insertAtCursor(tableHtml);
    };

    const handleFormatText = (format: string) => {
        switch (format) {
            case 'bold':
                handleInsertTag('<strong>', '</strong>');
                break;
            case 'italic':
                handleInsertTag('<em>', '</em>');
                break;
            case 'underline':
                handleInsertTag('<u>', '</u>');
                break;
            case 'ul':
                handleInsertTag('<ul>\n  <li>', '</li>\n  <li>Item</li>\n</ul>');
                break;
            case 'ol':
                handleInsertTag('<ol>\n  <li>', '</li>\n  <li>Item</li>\n</ol>');
                break;
            case 'left':
                handleInsertTag('<div style="text-align: left;">', '</div>');
                break;
            case 'center':
                handleInsertTag('<div style="text-align: center;">', '</div>');
                break;
            case 'right':
                handleInsertTag('<div style="text-align: right;">', '</div>');
                break;
            case 'code':
                handleInsertTag('<code>', '</code>');
                break;
            case 'div':
                handleInsertTag('<div>', '</div>');
                break;
            default:
                break;
        }
    };

    const formatHTML = () => {
        try {
            let formatted = '';
            let indent = 0;
            let inContent = false;

            for (let i = 0; i < currentValue.length; i++) {
                const char = currentValue[i];

                if (char === '<' && currentValue[i + 1] !== '/') {
                    formatted += '\n' + ' '.repeat(indent) + '<';
                    indent += 2;
                    inContent = false;
                } else if (char === '<' && currentValue[i + 1] === '/') {
                    indent -= 2;
                    if (!inContent) formatted += '\n' + ' '.repeat(indent);
                    formatted += '<';
                    inContent = false;
                } else if (char === '>') {
                    formatted += '>';
                    inContent = true;
                } else {
                    formatted += char;
                }
            }

            setCurrentValue(formatted);
            onChange(formatted);
        } catch (error) {
            console.error('Error formatting HTML:', error);
        }
    };

    const cleanHtml = () => {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(currentValue, 'text/html');

            const walk = (node: Node) => {
                if (node.nodeType === Node.TEXT_NODE) {
                    node.textContent = node.textContent?.replace(/\s+/g, ' ').trim() || '';
                } else {
                    node.childNodes.forEach(walk);
                }
            };

            doc.body.childNodes.forEach(walk);
            const cleaned = doc.body.innerHTML.trim();
            setCurrentValue(cleaned);
            onChange(cleaned);
        } catch (error) {
            console.error('Error cleaning HTML:', error);
        }
    };

    const scaledHtml = `
    <html>
      <head>
        <style>
          body {
            margin: 0;
            transform: scale(${zoom});
            transform-origin: top left;
            width: ${100 / zoom}%;
          }
          html, body {
          height: 100%; /* Memastikan HTML dan body mengisi seluruh tinggi */
        }
        </style>
      </head>
      <body>
        ${currentValue}
      </body>
    </html>
  `;

    return (
        <Paper
            variant="outlined"
            sx={{
                mb: 2,
                width: '210mm',
                minHeight: '297mm',
                margin: '0 auto',
                boxShadow: 1,
                padding: 2,
                overflow: 'hidden',
                backgroundColor: '#fafafa',
            }}
        >
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs value={preview ? 1 : 0} onChange={(_, newValue) => setPreview(newValue === 1)}>
                    <Tab label="HTML" />
                    <Tab label="Preview" />
                </Tabs>
            </Box>

            {!preview && (
                <>
                    <ButtonGroup size="small" variant="outlined">
                        <Button onClick={() => handleFormatText('bold')} title="Bold">
                            <Icon icon="mdi:format-bold" fontSize={18} />
                        </Button>
                        <Button onClick={() => handleFormatText('italic')} title="Italic">
                            <Icon icon="mdi:format-italic" fontSize={18} />
                        </Button>
                        <Button onClick={() => handleFormatText('underline')} title="Underline">
                            <Icon icon="mdi:format-underline" fontSize={18} />
                        </Button>
                    </ButtonGroup>

                    <ButtonGroup size="small" variant="outlined">
                        <Button onClick={handleInsertLink} title="Insert Link">
                            <Icon icon="mdi:link-variant" fontSize={18} />
                        </Button>
                        <Button onClick={handleInsertImage} title="Insert Image">
                            <Icon icon="mdi:image" fontSize={18} />
                        </Button>
                    </ButtonGroup>

                    <ButtonGroup size="small" variant="outlined">
                        <Button onClick={() => handleFormatText('ul')} title="Bullet List">
                            <Icon icon="mdi:format-list-bulleted" fontSize={18} />
                        </Button>
                        <Button onClick={() => handleFormatText('ol')} title="Numbered List">
                            <Icon icon="mdi:format-list-numbered" fontSize={18} />
                        </Button>
                    </ButtonGroup>

                    <ButtonGroup size="small" variant="outlined">
                        <Button onClick={() => handleFormatText('left')} title="Align Left">
                            <Icon icon="mdi:format-align-left" fontSize={18} />
                        </Button>
                        <Button onClick={() => handleFormatText('center')} title="Align Center">
                            <Icon icon="mdi:format-align-center" fontSize={18} />
                        </Button>
                        <Button onClick={() => handleFormatText('right')} title="Align Right">
                            <Icon icon="mdi:format-align-right" fontSize={18} />
                        </Button>
                    </ButtonGroup>

                    <ButtonGroup size="small" variant="outlined">
                        <Button onClick={handleInsertTable} title="Insert Table">
                            <Icon icon="mdi:table" fontSize={18} />
                        </Button>
                        <Button onClick={() => handleFormatText('div')} title="Insert Div">
                            <Icon icon="mdi:table-rows" fontSize={18} />
                        </Button>
                        <Button onClick={() => handleFormatText('code')} title="Insert Code">
                            <Icon icon="mdi:code-tags" fontSize={18} />
                        </Button>
                    </ButtonGroup>

                    <ButtonGroup size="small" variant="outlined">
                        <Button onClick={formatHTML} title="Format HTML">
                            <Icon icon="mdi:format-indent-increase" fontSize={18} />
                        </Button>
                        <Button onClick={cleanHtml} title="Clean HTML">
                            <Icon icon="mdi:broom" fontSize={18} />
                        </Button>
                    </ButtonGroup>
                    <Divider sx={{ mt: 2 }} />

                    <TextField
                        inputRef={textareaRef}
                        multiline
                        fullWidth
                        variant="outlined"
                        value={currentValue}
                        onChange={handleChange}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 0,
                                fontFamily: 'monospace',
                                fontSize: '0.9rem',
                                '& fieldset': {
                                    border: 'none',
                                },
                                backgroundColor: '#fff',
                            },
                            '& .MuiInputBase-inputMultiline': {
                                height,
                                overflowY: 'scroll',
                                padding: 0,
                            },
                        }}
                    />
                </>
            )}

            {preview && (
                <Box>
                    <ButtonGroup sx={{ mb: 2 }}>
                        <Button onClick={handleZoomOut} startIcon={<Icon icon="mdi:magnify-minus-outline" />}>
                            Zoom Out
                        </Button>
                        <Button onClick={handleZoomIn} startIcon={<Icon icon="mdi:magnify-plus-outline" />}>
                            Zoom In
                        </Button>
                    </ButtonGroup>

                    <iframe
                        srcDoc={scaledHtml}
                        style={{
                            width: '100%',
                            height: '100vh',
                            border: '1px solid #ccc',
                            backgroundColor: '#fff',
                        }}
                        sandbox="allow-same-origin allow-scripts allow-forms"
                        title="Zoomable Preview"
                    />
                </Box>
            )}
        </Paper>
    );
};

export default HtmlEditor;
