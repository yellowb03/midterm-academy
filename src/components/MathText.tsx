import React, { useMemo } from 'react';
import katex from 'katex';

interface MathTextProps {
  text: string;
  className?: string;
}

type Segment =
  | { type: 'text'; content: string }
  | { type: 'inline'; content: string }
  | { type: 'display'; content: string };

function parseMathSegments(input: string): Segment[] {
  const segments: Segment[] = [];
  let i = 0;
  let textStart = 0;

  while (i < input.length) {
    if (input[i] === '\\' && input[i + 1] === '$') {
      i += 2;
      continue;
    }
    if (input[i] === '$') {
      if (i > textStart) {
        segments.push({ type: 'text', content: input.slice(textStart, i) });
      }
      const isDisplay = input[i + 1] === '$';
      const delim = isDisplay ? '$$' : '$';
      const start = i + delim.length;
      const end = input.indexOf(delim, start);
      if (end === -1) {
        segments.push({ type: 'text', content: input.slice(i) });
        textStart = input.length;
        break;
      }
      segments.push({
        type: isDisplay ? 'display' : 'inline',
        content: input.slice(start, end).trim(),
      });
      i = end + delim.length;
      textStart = i;
    } else {
      i += 1;
    }
  }
  if (textStart < input.length) {
    segments.push({ type: 'text', content: input.slice(textStart) });
  }
  return segments;
}

function renderKatex(tex: string, displayMode: boolean): string {
  try {
    return katex.renderToString(tex, {
      displayMode,
      throwOnError: false,
      strict: false,
      trust: false,
    });
  } catch {
    return tex;
  }
}

export const MathText: React.FC<MathTextProps> = ({ text, className = '' }) => {
  const segments = useMemo(() => parseMathSegments(text), [text]);

  return (
    <span className={className}>
      {segments.map((seg, idx) => {
        if (seg.type === 'text') {
          const parts = seg.content.split('\n');
          return (
            <React.Fragment key={idx}>
              {parts.map((line, lIdx) => (
                <React.Fragment key={lIdx}>
                  {lIdx > 0 && <br />}
                  {line}
                </React.Fragment>
              ))}
            </React.Fragment>
          );
        }
        const html = renderKatex(seg.content, seg.type === 'display');
        if (seg.type === 'display') {
          return (
            <span
              key={idx}
              className="block my-2 overflow-x-auto"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        }
        return (
          <span
            key={idx}
            className="inline-block align-baseline mx-0.5"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      })}
    </span>
  );
};

interface MathBlockProps {
  tex: string;
  className?: string;
}

export const MathBlock: React.FC<MathBlockProps> = ({ tex, className = '' }) => {
  const html = useMemo(() => renderKatex(tex, true), [tex]);
  return (
    <div
      className={`overflow-x-auto py-1 ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
