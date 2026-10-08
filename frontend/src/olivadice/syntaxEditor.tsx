import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

export type SyntaxToken = { className: string; v: string };

type EditorProps = {
  value: string;
  onChange: (value: string) => void;
  tokens: SyntaxToken[];
  highlightClass: string;
  className?: string;
  wrapperClassName?: string;
  maxLength?: number;
  id?: string;
  disabled?: boolean;
  placeholder?: string;
};

export function SyntaxEditor({
  value,
  onChange,
  tokens,
  highlightClass,
  className,
  wrapperClassName = 'relative mt-2',
  maxLength,
  id,
  disabled,
  placeholder,
}: EditorProps) {
  const areaRef = React.useRef<HTMLTextAreaElement>(null);
  const preRef = React.useRef<HTMLPreElement>(null);
  const sync = () => {
    if (!areaRef.current || !preRef.current) return;
    preRef.current.scrollTop = areaRef.current.scrollTop;
    preRef.current.scrollLeft = areaRef.current.scrollLeft;
  };
  return (
    <div className={wrapperClassName}>
      <pre
        ref={preRef}
        aria-hidden
        className={cn(
          highlightClass,
          'pointer-events-none absolute inset-0 overflow-auto whitespace-pre-wrap break-words rounded-md border border-transparent px-3 py-2 font-mono text-sm leading-6',
        )}
      >
        {tokens.map((token, index) => (
          <span key={index} className={token.className}>{token.v}</span>
        ))}
        {'\n'}
      </pre>
      <Textarea
        ref={areaRef}
        id={id}
        value={value}
        maxLength={maxLength}
        disabled={disabled}
        placeholder={placeholder}
        spellCheck={false}
        onScroll={sync}
        onChange={event => onChange(event.target.value)}
        className={cn(
          'syntax-editor relative z-10 resize-y whitespace-pre-wrap break-words bg-transparent font-mono text-sm leading-6',
          className,
        )}
      />
    </div>
  );
}
