import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  TextField,
  InputAdornment,
  Skeleton,
  Paper,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { useState } from "react";
import { useTheme } from "@mui/material";
import { tokens } from "../../styles/theme";

export interface DazzleTableColumn {
  field: string;
  headerName: string;
  width?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderCell?: (row: any) => React.ReactNode;
}

interface DazzleTableProps {
  columns: DazzleTableColumn[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rows: any[];
  isLoading?: boolean;
  rowsPerPage?: number;
  enableSearch?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onRowClick?: (row: any) => void;
}

const DazzleTable = ({
  columns,
  rows,
  isLoading = false,
  rowsPerPage: defaultRowsPerPage = 10,
  enableSearch = false,
  searchPlaceholder = "Search...",
  emptyMessage = "No data found",
  onRowClick,
}: DazzleTableProps) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRows = enableSearch
    ? rows.filter((row) =>
        Object.values(row).some((val) =>
          String(val).toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      )
    : rows;

  const paginatedRows = filteredRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(0);
  };

  return (
    <Box>
      {/* Search */}
      {enableSearch && (
        <Box sx={{ mb: 2 }}>
          <TextField
            size="small"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={handleSearch}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search
                      fontSize="small"
                      sx={{ color: colors.text.secondary }}
                    />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              width: 280,
              bgcolor: colors.background.paper,
              borderRadius: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />
        </Box>
      )}

      {/* Table */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 3,
          backgroundColor: colors.background.paper,
        }}
      >
        <Table>
          {/* Header */}
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.field}
                  sx={{
                    width: col.width,
                    fontWeight: 600,
                    fontSize: 13,
                    color: colors.text.secondary,
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.04)"
                        : "rgba(0,0,0,0.02)",
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    py: 1.5,
                  }}
                >
                  {col.headerName}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          {/* Body */}
          <TableBody>
            {isLoading ? (
              Array.from({ length: rowsPerPage }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((col) => (
                    <TableCell key={col.field}>
                      <Skeleton variant="text" width="80%" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : paginatedRows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  align="center"
                  sx={{ py: 6 }}
                >
                  <Typography
                    variant="body2"
                    sx={{ color: colors.text.secondary }}
                  >
                    {emptyMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedRows.map((row, rowIndex) => (
                <TableRow
                  key={row.id ?? rowIndex}
                  onClick={() => onRowClick?.(row)}
                  sx={{
                    cursor: onRowClick ? "pointer" : "default",
                    "&:hover": {
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? "rgba(255,255,255,0.04)"
                          : "rgba(0,0,0,0.02)",
                    },
                    "&:last-child td": { border: 0 },
                  }}
                >
                  {columns.map((col) => (
                    <TableCell
                      key={col.field}
                      sx={{
                        fontSize: 13,
                        color: colors.text.primary,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        py: 1.5,
                      }}
                    >
                      {col.renderCell
                        ? col.renderCell(row)
                        : (row[col.field] ?? "—")}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <TablePagination
          component="div"
          count={filteredRows.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          sx={{
            borderTop: `1px solid ${theme.palette.divider}`,
            color: colors.text.secondary,
            fontSize: 13,
          }}
        />
      </TableContainer>
    </Box>
  );
};

export default DazzleTable;
