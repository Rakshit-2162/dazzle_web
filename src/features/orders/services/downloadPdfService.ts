
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { CategoryType } from "../../../constants";
import type { OrderItem, OrderMaster } from "../types";

const BLUE: [number, number, number] = [68, 114, 196];
const LIGHT_GREY: [number, number, number] = [242, 242, 242];

type AutoTableDoc = jsPDF & {
  lastAutoTable?: {
    finalY: number;
  };
};

export function exportToPdf(
  orderMaster: OrderMaster | null,
  orderItems: OrderItem[],
  fileName: string,
) {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  const primary = orderItems.filter(
    i => i.products?.categories?.type === CategoryType.PRIMARY
  );

  const categories = [...new Set(primary.map(i => i.products!.categories!.name))].sort();

  autoTable(doc,{
    theme:"grid",
    body:[
      ["Order No", orderMaster?.order_no ?? ""],
      ["Distributor", orderMaster?.clients?.name ?? ""],
      ["Total Qty", `${orderMaster?.total_qty ?? 0} item(s)`],
      ["Remarks", orderMaster?.remarks ?? ""],
      ["Date", orderMaster?.created_at ? new Date(orderMaster.created_at).toLocaleDateString("en-GB") : ""]
    ],
    columnStyles:{
      0:{fontStyle:"bold",fillColor:LIGHT_GREY},
      1:{cellWidth:"auto"}
    },
    styles:{fontSize:9}
  });

  const map: Record<string,{name:string;qty:Record<string,number>}> = {};

  primary.forEach(item=>{
    const p=item.products!;
    const key=p.name.toLowerCase().trim();
    if(!map[key]) map[key]={name:p.name,qty:{}};
    map[key].qty[p.categories!.name]=(map[key].qty[p.categories!.name]??0)+item.qty;
  });

  const pdf = doc as AutoTableDoc;

  autoTable(doc,{
    startY: (pdf.lastAutoTable?.finalY ?? 10) + 8,
    head:[["Product Name",...categories]],
    body:Object.values(map).map(p=>[
      p.name,
      ...categories.map(c=>p.qty[c]??"-")
    ]),
    theme:"grid",
    headStyles:{fillColor:BLUE,textColor:255},
    styles:{fontSize:8,cellPadding:2},
    tableWidth:"auto"
  });

  const secondary = orderItems.filter(
    i=>i.products?.categories?.type===CategoryType.SECONDARY
  );

  const groups: Record<string,OrderItem[]> = {};

  secondary.forEach(i=>{
    const n=i.products!.categories!.name;
    (groups[n]??=[]).push(i);
  });

  const groupEntries = Object.entries(groups);
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 10;
  const gap = 6;
  const tableWidth = (pageWidth - margin * 2 - gap) / 2;
  const leftX = margin;
  const rightX = margin + tableWidth + gap;
  
  for (let i = 0; i < groupEntries.length; i += 2) {
    const leftEntry = groupEntries[i];
    const rightEntry = groupEntries[i + 1];
  
    // capture startY BEFORE either table is drawn
    const startY = (pdf.lastAutoTable?.finalY ?? 10) + 8;
    let leftFinalY = startY;
    let rightFinalY = startY;
  
    // left table
    autoTable(doc, {
      startY,
      startX: leftX,
      margin: { left: leftX, right: rightX },
      head: [
        [{ content: leftEntry[0], colSpan: 2, styles: { halign: 'left' } }],
        ['Product Name', 'Qty'],
      ],
      body: leftEntry[1].map(item => [item.products?.name ?? '', item.qty]),
      theme: 'grid',
      headStyles: { fillColor: BLUE, textColor: 255, fontSize: 8 },
      styles: { fontSize: 8, cellPadding: 2 },
      columnStyles: {
        0: { cellWidth: tableWidth - 22 },
        1: { cellWidth: 20, halign: 'center' },
      },
      tableWidth,
      didDrawPage: () => {
        // reset so right table doesn't shift
      },
    });
  
    leftFinalY = pdf.lastAutoTable?.finalY ?? startY;
  
    // right table — reset lastAutoTable.finalY to startY so it draws at same Y
    if (rightEntry) {
      pdf.lastAutoTable = { finalY: startY - 8 };
  
      autoTable(doc, {
        startY,
        margin: { left: rightX, right: margin },
        head: [
          [{ content: rightEntry[0], colSpan: 2, styles: { halign: 'left' } }],
          ['Product Name', 'Qty'],
        ],
        body: rightEntry[1].map(item => [item.products?.name ?? '', item.qty]),
        theme: 'grid',
        headStyles: { fillColor: BLUE, textColor: 255, fontSize: 8 },
        styles: { fontSize: 8, cellPadding: 2 },
        columnStyles: {
          0: { cellWidth: tableWidth - 22 },
          1: { cellWidth: 20, halign: 'center' },
        },
        tableWidth,
      });
  
      rightFinalY = pdf.lastAutoTable?.finalY ?? startY;
    }
  
    // next pair starts below the taller table
    pdf.lastAutoTable = { finalY: Math.max(leftFinalY, rightFinalY) };
  }

  doc.save(fileName.endsWith(".pdf") ? fileName : fileName + ".pdf");
}
