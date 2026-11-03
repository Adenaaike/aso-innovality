// Simple, accurate SVG flags (emoji flags don't render on Windows)
const FLAGS: Record<string, React.ReactNode> = {
    ng: (<><rect width="1" height="2" fill="#008751" /><rect x="1" width="1" height="2" fill="#FFFFFF" /><rect x="2" width="1" height="2" fill="#008751" /></>),
    be: (<><rect width="1" height="2" fill="#000000" /><rect x="1" width="1" height="2" fill="#FDDA24" /><rect x="2" width="1" height="2" fill="#EF3340" /></>),
  };
  
  export function Flag({ code, name }: { code: string; name: string }) {
    const art = FLAGS[code];
    if (!art) return null;
    return (
      <span title={name} className="inline-flex overflow-hidden rounded-[3px] ring-1 ring-line">
        <svg viewBox="0 0 3 2" className="h-4 w-6" role="img" aria-label={name}>{art}</svg>
      </span>
    );
  }