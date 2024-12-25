import * as pdfjsLib from 'pdfjs-dist';

export async function extractTableData(page: any) {
  const textContent = await page.getTextContent();
  const tables: string[][] = [];
  let currentTable: string[] = [];
  
  // Group text items into potential table rows based on y-position
  const items = textContent.items.sort((a: any, b: any) => b.transform[5] - a.transform[5]);
  
  let currentY = items[0]?.transform[5];
  
  items.forEach((item: any) => {
    if (Math.abs(item.transform[5] - currentY) > 5) {
      if (currentTable.length > 0) {
        tables.push([...currentTable]);
        currentTable = [];
      }
      currentY = item.transform[5];
    }
    currentTable.push(item.str);
  });
  
  if (currentTable.length > 0) {
    tables.push(currentTable);
  }
  
  return tables;
}