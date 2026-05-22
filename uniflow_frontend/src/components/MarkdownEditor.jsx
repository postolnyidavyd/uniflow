import { useRef, useCallback } from 'react';
import styled from 'styled-components';
import NoteIcon from '../assets/Info.svg?react';
import TipIcon from '../assets/Bulb.svg?react';
import WarningIcon from '../assets/Triangle_Warning.svg?react';
import ImportantIcon from '../assets/Mail.svg?react';
import LinkIcon from '../assets/External_Link.svg?react';

const ICON_SIZE = '1rem';

const MarkdownEditor = ({ value = '', onChange }) => {
    const textareaRef = useRef(null);
    const lineNumbersRef = useRef(null);

    // Fallback to empty string for safety
    const safeValue = value ?? '';

    const handleScroll = useCallback((e) => {
        if (lineNumbersRef.current) {
            lineNumbersRef.current.scrollTop = e.target.scrollTop;
        }
    }, []);

    const insertSyntax = useCallback(
        ({ before, after = '', block = false }) => {
            const el = textareaRef.current;
            if (!el) return;

            const start = el.selectionStart;
            const end = el.selectionEnd;
            const selected = safeValue.slice(start, end);

            let newValue, newCursorStart, newCursorEnd;

            if (block && start === end) {
                const lineStart = safeValue.lastIndexOf('\n', start - 1) + 1;
                newValue = safeValue.slice(0, lineStart) + before + safeValue.slice(lineStart);
                newCursorStart = lineStart + before.length;
                newCursorEnd = newCursorStart;
            } else {
                newValue = safeValue.slice(0, start) + before + selected + after + safeValue.slice(end);
                newCursorStart = start + before.length;
                newCursorEnd = newCursorStart + selected.length;
            }

            onChange(newValue);
            requestAnimationFrame(() => {
                el.focus();
                el.setSelectionRange(newCursorStart, newCursorEnd);
            });
        },
        [safeValue, onChange]
    );

    const handleKeyDown = useCallback(
        (e) => {
            if (e.key === 'Tab') { e.preventDefault(); insertSyntax({ before: '  ', after: '' }); return; }
            if ((e.ctrlKey || e.metaKey) && e.key === 'b') { e.preventDefault(); insertSyntax({ before: '**', after: '**' }); return; }
            if ((e.ctrlKey || e.metaKey) && e.key === 'i') { e.preventDefault(); insertSyntax({ before: '*', after: '*' }); return; }
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); insertSyntax({ before: '[', after: '](url)' }); return; }
        },
        [insertSyntax]
    );

    const lineCount = safeValue.split('\n').length;

    return (
        <EditorRoot>
            <Toolbar>
                <ToolbarGroup>
                    {['H1','H2','H3'].map((h, i) => (
                        <ToolbarBtn key={h} title={`Заголовок ${i+1}`} onClick={() => insertSyntax({ before: '#'.repeat(i+1) + ' ', block: true })}>
                            {h}
                        </ToolbarBtn>
                    ))}
                </ToolbarGroup>

                <ToolbarGroup>
                    <ToolbarBtn title="Жирний (Ctrl+B)" onClick={() => insertSyntax({ before: '**', after: '**' })} style={{ fontWeight: 700 }}>B</ToolbarBtn>
                    <ToolbarBtn title="Курсив (Ctrl+I)" onClick={() => insertSyntax({ before: '*', after: '*' })} style={{ fontStyle: 'italic' }}>I</ToolbarBtn>
                    <ToolbarBtn title="Закреслений" onClick={() => insertSyntax({ before: '~~', after: '~~' })} style={{ textDecoration: 'line-through' }}>S</ToolbarBtn>
                </ToolbarGroup>

                <ToolbarGroup>
                    <ToolbarBtn title="Інлайн код" $mono onClick={() => insertSyntax({ before: '`', after: '`' })}>{`{ }`}</ToolbarBtn>
                    <ToolbarBtn title="Блок коду" $mono onClick={() => insertSyntax({ before: '```\n', after: '\n```', block: true })}>{`\`\`\``}</ToolbarBtn>
                </ToolbarGroup>

                <ToolbarGroup>
                    <ToolbarBtn title="Маркований список" onClick={() => insertSyntax({ before: '- ', block: true })}>—</ToolbarBtn>
                    <ToolbarBtn title="Нумерований список" onClick={() => insertSyntax({ before: '1. ', block: true })}>1.</ToolbarBtn>
                </ToolbarGroup>

                <ToolbarGroup>
                    <ToolbarBtn title="Посилання (Ctrl+K)" onClick={() => insertSyntax({ before: '[', after: '](url)' })}>
                        <LinkIcon width={ICON_SIZE} height={ICON_SIZE} />
                    </ToolbarBtn>
                </ToolbarGroup>

                <ToolbarGroup>
                    <ToolbarBtn title="NOTE" $alert="note" onClick={() => insertSyntax({ before: '> [!NOTE]\n> ', block: true })}>
                        <NoteIcon width={ICON_SIZE} height={ICON_SIZE} />
                    </ToolbarBtn>
                    <ToolbarBtn title="TIP" $alert="tip" onClick={() => insertSyntax({ before: '> [!TIP]\n> ', block: true })}>
                        <TipIcon width={ICON_SIZE} height={ICON_SIZE} />
                    </ToolbarBtn>
                    <ToolbarBtn title="WARNING" $alert="warning" onClick={() => insertSyntax({ before: '> [!WARNING]\n> ', block: true })}>
                        <WarningIcon width={ICON_SIZE} height={ICON_SIZE} />
                    </ToolbarBtn>
                    <ToolbarBtn title="IMPORTANT" $alert="important" onClick={() => insertSyntax({ before: '> [!IMPORTANT]\n> ', block: true })}>
                        <ImportantIcon width={ICON_SIZE} height={ICON_SIZE} />
                    </ToolbarBtn>
                    <ToolbarBtn title="CAUTION" $alert="caution" onClick={() => insertSyntax({ before: '> [!CAUTION]\n> ', block: true })}>
                        <WarningIcon width={ICON_SIZE} height={ICON_SIZE} />
                    </ToolbarBtn>
                </ToolbarGroup>

                <ShortcutsHint>
                    <kbd>Ctrl+B</kbd> жирний &nbsp;·&nbsp;
                    <kbd>Ctrl+I</kbd> курсив &nbsp;·&nbsp;
                    <kbd>Ctrl+K</kbd> посилання &nbsp;·&nbsp;
                    <kbd>Tab</kbd> відступ
                </ShortcutsHint>
            </Toolbar>

            <EditorBody>
                <LineNumbers ref={lineNumbersRef} aria-hidden="true">
                    {Array.from({ length: Math.max(lineCount, 1) }, (_, i) => (
                        <LineNum key={i}>{i + 1}</LineNum>
                    ))}
                </LineNumbers>
                <StyledTextarea
                    ref={textareaRef}
                    value={safeValue}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onScroll={handleScroll}
                    spellCheck={false}
                    placeholder="Почніть вводити Markdown-текст..."
                />
            </EditorBody>

            <Footer>
                <FooterStats>
                    <FooterStat>{lineCount} рядків</FooterStat>
                    <FooterStat>{safeValue.length} символів</FooterStat>
                    <FooterStat>{safeValue.trim() ? safeValue.trim().split(/\s+/).length : 0} слів</FooterStat>
                </FooterStats>
                <ShortcutsFooter>
                    <kbd>Ctrl+B</kbd> жирний &nbsp;·&nbsp;
                    <kbd>Ctrl+I</kbd> курсив &nbsp;·&nbsp;
                    <kbd>Ctrl+K</kbd> посилання &nbsp;·&nbsp;
                    <kbd>Tab</kbd> відступ
                </ShortcutsFooter>
            </Footer>
        </EditorRoot>
    );
};

const alertHoverColors = {
    note: 'var(--radiance-20)',
    tip: 'var(--malachite-20)',
    warning: 'var(--gorse-20)',
    important: 'var(--dodger-blue-20)',
    caution: 'var(--brick-red-20)',
};

const alertIconColors = {
    note: 'var(--radiance-100)',
    tip: 'var(--malachite-100)',
    warning: 'var(--gorse-100)',
    important: 'var(--dodger-blue-100)',
    caution: 'var(--brick-red-100)',
};

const EditorRoot = styled.div`
    display: flex;
    flex-direction: column;
    border-radius: 1.25rem;
    border: 1.901px solid var(--base-bright-grey, #e7eef3);
    overflow: hidden;
    background: var(--base-white, #fff);
    transition: border-color 0.2s ease;
    &:focus-within { border-color: var(--grey-60, #bfbfbf); }
`;

const Toolbar = styled.div`
    display: flex;
    align-items: center;
    gap: 0.125rem;
    padding: 0.5rem 0.75rem;
    border-bottom: 1.901px solid var(--base-bright-grey, #e7eef3);
    background: var(--base-very-bright-grey, #f4f7f9);
    flex-wrap: wrap;
    row-gap: 0.375rem;
`;

const ToolbarGroup = styled.div`
    display: flex;
    align-items: center;
    gap: 0.125rem;
    & + & {
        margin-left: 0.25rem;
        padding-left: 0.375rem;
        border-left: 1.5px solid var(--base-bright-grey, #e7eef3);
    }
`;

const ToolbarBtn = styled.button`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 2rem;
    min-width: 2rem;
    padding: 0 0.4rem;
    border-radius: 0.5rem;
    border: none;
    background: transparent;
    cursor: pointer;
    font-family: ${({ $mono }) => ($mono ? "'Source Code Pro', monospace" : "'e-Ukraine', sans-serif")};
    font-size: 0.8125rem;
    font-weight: 400;
    color: ${({ $alert }) => $alert ? alertIconColors[$alert] : 'var(--base-black, #000)'};
    transition: background 0.15s ease;
    white-space: nowrap;
    svg { color: inherit; }
    &:hover {
        background: ${({ $alert }) => $alert ? alertHoverColors[$alert] : 'var(--base-bright-grey, #e7eef3)'};
    }
    &:active { transform: scale(0.94); }
`;

const ShortcutsHint = styled.div`
    margin-left: auto;
    font-size: 0.6875rem;
    color: var(--grey-100, #959595);
    white-space: nowrap;
    kbd {
        display: inline-block;
        padding: 0.0625rem 0.3rem;
        border-radius: 0.25rem;
        border: 1px solid var(--base-bright-grey, #e7eef3);
        background: var(--base-white, #fff);
        font-family: 'Source Code Pro', monospace;
        font-size: 0.625rem;
        color: var(--base-black, #000);
    }
    @media (max-width: 900px) { display: none; }
`;

const EditorBody = styled.div`
    display: flex;
    height: 25rem;
    overflow: hidden;
`;

const LineNumbers = styled.div`
    display: flex;
    flex-direction: column;
    padding: 1rem 0;
    min-width: 3rem;
    background: var(--base-very-bright-grey, #f4f7f9);
    border-right: 1.901px solid var(--base-bright-grey, #e7eef3);
    user-select: none;
    overflow: hidden;
`;

const LineNum = styled.span`
    display: block;
    padding: 0 0.75rem 0 0.5rem;
    font-family: 'Source Code Pro', monospace;
    font-size: 0.75rem;
    line-height: 1.6rem;
    color: var(--grey-100, #959595);
    text-align: right;
    flex-shrink: 0;
`;

const StyledTextarea = styled.textarea`
    flex: 1;
    padding: 1rem 1.25rem;
    font-family: 'Source Code Pro', monospace;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.6rem;
    color: var(--base-black, #000);
    background: transparent;
    border: none;
    outline: none;
    resize: none;
    tab-size: 2;
    overflow-y: auto;
    &::placeholder { color: var(--grey-80, #aaa); }
    &::-webkit-scrollbar { width: 6px; }
    &::-webkit-scrollbar-track { background: transparent; }
    &::-webkit-scrollbar-thumb { background: var(--grey-40, #d5d5d5); border-radius: 10px; }
`;

const Footer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.375rem 1rem;
    border-top: 1.901px solid var(--base-bright-grey, #e7eef3);
    background: var(--base-very-bright-grey, #f4f7f9);
`;

const FooterStats = styled.div`
    display: flex;
    gap: 1rem;
`;

const FooterStat = styled.span`
    font-size: 0.6875rem;
    color: var(--grey-100, #959595);
`;

const ShortcutsFooter = styled.div`
    font-size: 0.6875rem;
    color: var(--grey-100, #959595);
    white-space: nowrap;
    kbd {
        display: inline-block;
        padding: 0.0625rem 0.3rem;
        border-radius: 0.25rem;
        border: 1px solid var(--base-bright-grey, #e7eef3);
        background: var(--base-white, #fff);
        font-family: 'Source Code Pro', monospace;
        font-size: 0.625rem;
        color: var(--base-black, #000);
    }
    @media (max-width: 768px) { display: none; }
`;

export default MarkdownEditor;