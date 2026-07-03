declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    margin?: number | number[]
    filename?: string
    image?: { type?: string; quality?: number }
    html2canvas?: { scale?: number; [key: string]: unknown }
    jsPDF?: { unit?: string; format?: string; orientation?: string }
    [key: string]: unknown
  }
  function html2pdf(): {
    from(element: HTMLElement): {
      set(options: Html2PdfOptions): {
        save(): Promise<void>
      }
    }
  }
  export default html2pdf
}
