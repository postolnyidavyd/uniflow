import NoteIcon from '../assets/Info.svg?react';
import TipIcon from '../assets/Bulb.svg?react';
import WarningIcon from '../assets/Triangle_Warning.svg?react';
import ImportantIcon from '../assets/Mail.svg?react';
import styled from 'styled-components';

import parse, { domToReact } from 'html-react-parser';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {oneLight} from "react-syntax-highlighter/src/styles/prism/index.js";

const alertIcons = {
  NOTE: <NoteIcon width="1.5rem" height="1.5rem" />,
  TIP: <TipIcon width="1.5rem" height="1.5rem" />,
  WARNING: <WarningIcon width="1.5rem" height="1.5rem" />,
  IMPORTANT: <ImportantIcon width="1.5rem" height="1.5rem" />,
  CAUTION: <WarningIcon width="1.5rem" height="1.5rem" />,
};

const HtmlRenderer = ({ htmlContent }) => {
  const options = {
    replace: (domNode) => {

      if (domNode.name === 'table') {
        return (
          <div className="table-wrapper">
            <table>{domToReact(domNode.children, options)}</table>
          </div>
        );
      }

      if (domNode.attribs && domNode.attribs.class === 'alert-title') {
        const type = domNode.children[0]?.data;

        const IconComponent = alertIcons[type] || alertIcons.NOTE;

        return (
          <div className="alert-title">
            {IconComponent}
            <span>{type}</span>
          </div>
        );
      }
      if (domNode.name === 'pre' && domNode.children[0]?.name === 'code') {
        const codeNode = domNode.children[0];

        const className = codeNode.attribs?.class || '';

        const match = /language-(\w+)/.exec(className);

        const language = match ? match[1] : 'text';

        const codeText = codeNode.children[0]?.data || '';

        return (
          <SyntaxHighlighter
            language={language}
            style={oneLight}
            showLineNumbers={true}
            customStyle={{ borderRadius: '0.5rem', margin: '1rem 0' }}
          >
            {codeText}
          </SyntaxHighlighter>
        );
      }
    },
  };

  return <ContentWrapper>{parse(htmlContent, options)}</ContentWrapper>;
};
const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 800px; /* Обмежуємо ширину читабельної зони */

  font-size: 1rem;
  font-style: normal;
  font-weight: 300;
  line-height: 1.5rem; /* 150% */
  letter-spacing: -0.02rem;
  //margin: 0 auto;

  /*ЗАГОЛОВКИ*/
  h1 {
    font-size: 3.5rem;
    font-style: normal;
    font-weight: 400;
    line-height: 3.75rem; /* 107.143% */
    letter-spacing: -0.07rem;
  }
  h2 {
    font-size: 2.375rem;
    font-style: normal;
    font-weight: 400;
    line-height: 2.5rem; /* 105.263% */
  }
  h3 {
    font-size: 1.75rem;
    font-style: normal;
    font-weight: 400;
    line-height: 2rem; /* 114.286% */
    letter-spacing: -0.035rem;
  }
  h4 {
    font-size: 1.5rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1.75rem; /* 116.667% */
    letter-spacing: -0.00719rem;
  }
  h5 {
    font-size: 1.25rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1.5rem; /* 120% */
    letter-spacing: -0.025rem;
  }
  h6 {
    font-size: 1.125rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1.75rem; /* 155.556% */
    letter-spacing: -0.0225rem;
  }
  /*СПИСОК*/
  ul {
    padding-left: 1.5rem;
    list-style-type: disc;
  }

  /* Нумерований список (з цифрами) */
  ul,
  ol {
    padding-left: 1.5rem;
  }

  ul {
    list-style-type: disc;
  }

  ol {
    list-style-type: decimal;
  }

  li {
    margin-bottom: 0.25rem;
  }
  /* ПОСИЛАННЯ */
  a {
    color: var(--radiance-100, #007eff);
    font-size: 1rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1.5rem; /* 150% */
    letter-spacing: -0.02rem;

    /* Оформлення підкреслення */
    text-decoration-line: underline;
    text-decoration-style: solid;
    text-decoration-skip-ink: auto;
    text-decoration-thickness: 1px;
    text-underline-offset: 4px;

    transition:
      color 0.2s ease,
      text-decoration-color 0.2s ease,
      opacity 0.2s ease,
      transform 0.1s ease;
  }

  a:hover {
    color: #005bb5;
    text-decoration-color: transparent;
  }

  a:focus-visible {
    outline: 2px solid var(--radiance-100, #007eff);
    outline-offset: 4px;
    border-radius: 4px;
    text-decoration-color: transparent;
  }

  a:active {
    opacity: 0.7;
    transform: translateY(1px);
  }

  /*ЖИРНИЙ ТЕКСТ*/
  strong {
    font-size: 1rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1.5rem; /* 150% */
    letter-spacing: -0.02rem;
  }

  /*ЗАКРЕСЛЕНИЙ ТЕКСТ*/
  del {
    text-decoration-line: line-through;
  }
  /*ІНЛАЙН КОД*/
  code.inline-code {
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
    background: var(--base-bright-grey, #e7eef3);

    color: var(--base-black, #000);
    font-feature-settings:
      'ss01' on,
      'cv01' on,
      'cv11' on;
    font-family: 'Source Code Pro', sans-serif;
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 400;

    display: inline-block;
    line-height: normal;
    margin: 0 0.125rem;
  }
  /*АЛЕРТИ*/
  .alert {
    display: flex;
    padding: 1.5rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.625rem;

    border-radius: 0.5rem;

    font-size: 0.8125rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1rem; /* 123.077% */
    letter-spacing: -0.02rem;
  }
  .alert-title {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
  }
  .alert p {
    color: var(--base-black);
  }

  .alert-note {
    background-color: var(--radiance-40); /* Підстав свої змінні */
    color: var(--radiance-100);
  }

  .alert-tip {
    background-color: var(--malachite-40);
    color: var(--malachite-100);
  }

  .alert-warning {
    background-color: var(--gorse-40);
    color: var(--gorse-100);
  }

  .alert-important {
    background-color: var(--dodger-blue-40);
    color: var(--dodger-blue-100);
  }

  .alert-caution {
    background-color: var(--brick-red-40);
    color: var(--brick-red-100);
  }

    /* ТАБЛИЦІ */
    .table-wrapper {
        width: 100%;
        overflow-x: auto;
        border: 2px solid var(--base-bright-grey, #e7eef3);
        border-radius: 0.5rem;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        
        font-family: 'e-Ukraine', sans-serif;
        font-size: 0.8125rem;
        line-height: 1rem;
        letter-spacing: -0.02rem;
        text-align: left;
        color: var(--base-black, #000);
    }

    table th,
    table td {
        padding: 1.25rem 1rem; /* 20px 16px */
        border: 2px solid var(--base-bright-grey, #e7eef3);
        min-width: 178px;
    }
    
    table tr:first-child th,
    table tr:first-child td {
        border-top: none;
    }
    table tr:last-child td {
        border-bottom: none;
    }
    table th:first-child,
    table td:first-child {
        border-left: none;
    }
    table th:last-child,
    table td:last-child {
        border-right: none;
    }

    table th {
        background-color: var(--base-bright-grey, #e7eef3);
        font-weight: 400;
    }

    table tbody tr {
        transition: background-color 0.3s ease-in-out;
    }

    /* Ефект зебри (чергування кольорів рядків) */
    table tbody tr:nth-child(even) {
        background-color: rgba(231, 238, 243, 0.3);
    }

    /* Підсвічування при наведенні для кращої навігації */
    table tbody tr:hover {
        background-color: rgba(231, 238, 243, 0.7);
    }

    
`;
export default HtmlRenderer;
