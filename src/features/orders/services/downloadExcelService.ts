import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { CategoryType } from "../../../constants";
import type { OrderItem, OrderMaster } from "../types";

const BORDER_THIN: Partial<ExcelJS.Borders> = {
  top: { style: "thin" },
  bottom: { style: "thin" },
  left: { style: "thin" },
  right: { style: "thin" },
};

const BLUE = "4472C4";
const LIGHT_GREY = "F2F2F2";

export async function exportToExcel(
  orderMaster: OrderMaster,
  orderItems: OrderItem[],
  fileName: string,
) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Dazzle";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet("Order");
  const primaryCategories = Array.from(
    new Set(
      orderItems
        .filter((i) => i.products?.categories?.type === CategoryType.PRIMARY)
        .map((i) => i.products!.categories!.name),
    ),
  );
  const totalColumns = 2 + primaryCategories.length;

  addMetadata(sheet, orderMaster, totalColumns);

  sheet.addRow([]);
  addPrimaryTable(sheet, orderItems);

  sheet.addRow([]);
  addSecondaryTables(sheet, orderItems);

  autoFitColumns(sheet);

  const buffer = await workbook.xlsx.writeBuffer();

  saveAs(
    new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    fileName,
  );
}

function addMetadata(sheet: ExcelJS.Worksheet, order: OrderMaster, totalColumns: number) {
  const rows = [
    ["Order No", order.order_no],
    ["Distributor", order.clients?.name ?? ""],
    ["Total Qty", `${order.total_qty} item(s)`],
    ["Remarks", order.remarks ?? ""],
    ["Date", order.created_at.slice(0, 10)],
  ];

  rows.forEach(([label, value]) => {
    const r = sheet.addRow([label, value]);
    sheet.mergeCells(r.number, 2, r.number, totalColumns);
    r.getCell(1).font = { bold: true };
    r.getCell(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: LIGHT_GREY },
    };
    r.eachCell((c) => {
      c.border = BORDER_THIN;
      c.alignment = { vertical: "middle", horizontal: "left" };
    });
  });
}

function addPrimaryTable(sheet: ExcelJS.Worksheet, items: OrderItem[]) {
  const primary = items.filter(
    (i) => i.products?.categories?.type === CategoryType.PRIMARY,
  );

  if (!primary.length) return;

  const categories = [
    ...new Set(primary.map((i) => i.products!.categories!.name)),
  ].sort();

  const header = sheet.addRow(["Product Code", "Product Name", ...categories]);

  styleHeader(header);

  const map: Record<
    string,
    {
      code: string;
      name: string;
      qty: Record<string, number>;
    }
  > = {};

  primary.forEach((item) => {
    const p = item.products!;
    map[p.code] ??= {
      code: p.code,
      name: p.name,
      qty: {},
    };

    map[p.code].qty[p.categories!.name] =
      (map[p.code].qty[p.categories!.name] ?? 0) + item.qty;
  });

  Object.values(map).forEach((p) => {
    const row = sheet.addRow([
      p.code,
      p.name,
      ...categories.map((c) => p.qty[c] ?? "-"),
    ]);

    row.eachCell((cell) => {
      cell.border = BORDER_THIN;
      cell.alignment = {
        horizontal: "center",
        vertical: "middle",
      };
    });

    row.getCell(2).alignment = { horizontal: "left" };
  });
}

function addSecondaryTables(sheet: ExcelJS.Worksheet, items: OrderItem[]) {
  const secondary = items.filter(
    (i) => i.products?.categories?.type === CategoryType.SECONDARY,
  );

  const groups: Record<string, OrderItem[]> = {};

  secondary.forEach((item) => {
    const name = item.products!.categories!.name;
    (groups[name] ??= []).push(item);
  });

  Object.entries(groups).forEach(([category, list]) => {
    sheet.addRow([]);

    const title = sheet.addRow([category]);
    sheet.mergeCells(title.number, 1, title.number, 3);
    styleHeader(title);

    const header = sheet.addRow(["Product Code", "Product Name", "Qty"]);

    styleHeader(header);

    list.forEach((item) => {
      const r = sheet.addRow([
        item.products?.code,
        item.products?.name,
        item.qty,
      ]);

      r.eachCell((c) => {
        c.border = BORDER_THIN;
        c.alignment = {
          horizontal: "center",
          vertical: "middle",
        };
      });

      r.getCell(2).alignment = { horizontal: "left" };
    });
  });
}

// function styleTitle(row: ExcelJS.Row) {
//   row.font = {
//     bold: true,
//     size: 14,
//     color: { argb: "FFFFFF" },
//   };

//   row.alignment = {
//     horizontal: "center",
//     vertical: "middle",
//   };

//   row.height = 22;

//   row.eachCell((c) => {
//     c.fill = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: { argb: BLUE },
//     };
//     c.border = BORDER_THIN;
//   });
// }

function styleHeader(row: ExcelJS.Row) {
  row.font = { bold: true, color: { argb: "FFFFFF" } };
  row.alignment = { horizontal: "center", vertical: "middle" };

  row.eachCell((c) => {
    c.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: BLUE },
    };
    c.border = BORDER_THIN;
  });
}

function autoFitColumns(sheet: ExcelJS.Worksheet) {
  (sheet.columns ?? []).forEach((col) => {
    let max = 0;

    col.eachCell?.({ includeEmpty: false }, (cell) => {
      // Ignore merged cells (metadata values)
      if (cell.isMerged) return;

      const value =
        cell.value == null
          ? ""
          : typeof cell.value === "object"
          ? cell.text
          : String(cell.value);

      max = Math.max(max, value.length);
    });

    col.width = Math.max(max + 2, 8);
  });
}
