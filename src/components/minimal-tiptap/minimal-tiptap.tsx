import * as React from 'react';
import './styles/index.css';

import type { Content, Editor } from '@tiptap/react';
import type { UseMinimalTiptapEditorProps } from './hooks/use-minimal-tiptap';
import { EditorContent } from '@tiptap/react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { SectionOne } from './components/section/one';
import { SectionTwo } from './components/section/two';
import { SectionThree } from './components/section/three';
import { SectionFour } from './components/section/four';
import { SectionFive } from './components/section/five';
import { LinkBubbleMenu } from './components/bubble-menu/link-bubble-menu';
import { useMinimalTiptapEditor } from './hooks/use-minimal-tiptap';
import { MeasuredContainer } from './components/measured-container';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';

export interface MinimalTiptapProps
  extends Omit<UseMinimalTiptapEditorProps, 'onUpdate'> {
  value?: Content;
  onChange?: (value: Content) => void;
  className?: string;
  editorContentClassName?: string;
  hideToolbar?: boolean;
}

const Toolbar = ({ editor }: { editor: Editor }) => (
  <div className="shrink-0 overflow-x-auto border-b border-border p-2">
    <div className="flex w-max items-center gap-px">
      <SectionOne editor={editor} activeLevels={[1, 2, 3, 4, 5, 6]} />

      <Separator orientation="vertical" className="mx-2 h-7" />

      <SectionTwo
        editor={editor}
        activeActions={[
          'bold',
          'italic',
          'underline',
          'strikethrough',
          'code',
          'clearFormatting',
        ]}
        mainActionCount={3}
      />

      <Separator orientation="vertical" className="mx-2 h-7" />

      <SectionThree editor={editor} />

      <Separator orientation="vertical" className="mx-2 h-7" />

      <SectionFour
        editor={editor}
        activeActions={['orderedList', 'bulletList']}
        mainActionCount={0}
      />

      <Separator orientation="vertical" className="mx-2 h-7" />

      <SectionFive
        editor={editor}
        activeActions={['codeBlock', 'blockquote', 'horizontalRule']}
        mainActionCount={0}
      />
    </div>
  </div>
);

export const MinimalTiptapEditor = React.forwardRef<
  HTMLDivElement,
  MinimalTiptapProps
>(
  (
    {
      value,
      onChange,
      className,
      editorContentClassName,
      hideToolbar = false,
      ...props
    },
    ref
  ) => {
    const editor = useMinimalTiptapEditor({
      value,
      onUpdate: onChange,
      ...props,
    });

    const handleClick = () => {
      if (editor && !editor?.isFocused) {
        editor?.chain().focus().run();
      }
    };
    React.useEffect(() => {
      const handleSmoothScroll = () => {
        const element = document.getElementById('minimal-tiptap-edit-content');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      };

      if (editor) {
        editor.on('focus', handleSmoothScroll);
      }

      return () => {
        if (editor) {
          editor.off('focus', handleSmoothScroll);
        }
      };
    }, [editor]);

    if (!editor) {
      return null;
    }

    return (
      <MeasuredContainer
        as="div"
        name="editor"
        ref={ref}
        className={cn(
          'flex h-auto min-h-72 w-full flex-col rounded-md border border-input shadow-sm focus-within:border-primary',
          className
        )}
      >
        {!hideToolbar && <Toolbar editor={editor} />}
        <div className="h-full grow" onClick={handleClick}>
          <ScrollArea className="h-[80vh]">
            <EditorContent
              editor={editor}
              className={cn('minimal-tiptap-editor', editorContentClassName)}
            />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        <LinkBubbleMenu editor={editor} />
      </MeasuredContainer>
    );
  }
);

MinimalTiptapEditor.displayName = 'MinimalTiptapEditor';

export default MinimalTiptapEditor;
