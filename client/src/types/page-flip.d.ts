declare module 'page-flip' {
  export interface PageFlipOptions {
    width?: number;
    height?: number;
    size?: 'fixed' | 'stretch';
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    showCover?: boolean;
    mobileScrollSupport?: boolean;
    usePortrait?: boolean;
    startPage?: number;
    drawShadow?: boolean;
    flippingTime?: number;
    useMouseEvents?: boolean;
    swipeDistance?: number;
    clickEventForward?: boolean;
    maxShadowOpacity?: number;
    showPageCorners?: boolean;
    disableFlipByClick?: boolean;
  }

  export class PageFlip {
    constructor(element: HTMLElement, options?: PageFlipOptions);
    
    loadFromHTML(pages: NodeListOf<Element> | Element[]): void;
    flipNext(): void;
    flipPrev(): void;
    flip(page: number): void;
    getCurrentPageIndex(): number;
    destroy(): void;
    on(event: string, callback: (e: any) => void): void;
    off(event: string): void;
  }
}
