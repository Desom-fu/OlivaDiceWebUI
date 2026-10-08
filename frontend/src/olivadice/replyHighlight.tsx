import React from 'react';
import { SyntaxEditor } from './syntaxEditor';

/**
 * OlivaDice reply highlighter.
 *
 * Tokens follow Core formatReplySTRReplace: `{key}` placeholders (template
 * values, deck names, {DEVIDE}/{OR}, escape sequences) and top-level `|`
 * random-reply splits.
 */

export type ReplyTokenKind = 'text' | 'brace' | 'var' | 'special' | 'escape' | 'deck' | 'split' | 'open';
export type ReplyToken = { k: ReplyTokenKind; v: string };

const SPECIALS = new Set(['DEVIDE', 'OR']);
const T_VAR = /^t[A-Za-z][A-Za-z0-9_]*$/;
const ESCAPE = /^\\[nrtfbav]$/;

function emit(tokens: ReplyToken[], k: ReplyTokenKind, v: string) {
  if (!v) return;
  const last = tokens[tokens.length - 1];
  if (last && last.k === k && k === 'text') last.v += v;
  else tokens.push({ k, v });
}

function keyKind(key: string): ReplyTokenKind {
  if (SPECIALS.has(key)) return 'special';
  if (ESCAPE.test(key)) return 'escape';
  if (T_VAR.test(key)) return 'var';
  return 'deck';
}

export function tokenizeReply(src: string): ReplyToken[] {
  const tokens: ReplyToken[] = [];
  let i = 0;
  while (i < src.length) {
    if (src[i] === '{') {
      const close = src.indexOf('}', i + 1);
      if (close === -1) {
        emit(tokens, 'open', src.slice(i));
        break;
      }
      const key = src.slice(i + 1, close);
      emit(tokens, 'brace', '{');
      emit(tokens, keyKind(key), key);
      emit(tokens, 'brace', '}');
      i = close + 1;
      continue;
    }
    if (src[i] === '|') {
      emit(tokens, 'split', '|');
      i += 1;
      continue;
    }
    emit(tokens, 'text', src[i]);
    i += 1;
  }
  return tokens;
}

type EditorProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  maxLength?: number;
  id?: string;
  disabled?: boolean;
  placeholder?: string;
};

export function ReplyEditor({ value, onChange, className, maxLength, id, disabled, placeholder }: EditorProps) {
  const tokens = React.useMemo(
    () => tokenizeReply(value).map(token => ({ className: `rv-token rv-${token.k}`, v: token.v })),
    [value],
  );
  return (
    <SyntaxEditor
      value={value}
      onChange={onChange}
      tokens={tokens}
      highlightClass="reply-highlight"
      wrapperClassName="relative"
      className={className}
      maxLength={maxLength}
      id={id}
      disabled={disabled}
      placeholder={placeholder}
    />
  );
}
