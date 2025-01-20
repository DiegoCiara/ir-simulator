import { useDeclaration } from '@/context/declaration-context';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowUpDown, CircleX, MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Declaration } from '@/types/Declaration';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useLoading } from '@/context/loading-context';
import DetailDeclarationModal from '@/components/modal/declaration/detail';
import DeleteDeclarationModal from '@/components/modal/declaration/delete';
import { useNavigate } from 'react-router-dom';
import { formatCurrency, formatDate, formatStatus } from '@/utils/formats';
import SubmitDeclarationModal from '@/components/modal/declaration/submited';
import { SelectInput } from '@/components/select-input/select-input';
import { Label } from '@/components/ui/label';
import UpdateDeclarationModal from '@/components/modal/declaration/update';
import { Badge } from '@/components/ui/badge';
import { yearsDeclaration } from '@/utils/mock';
import { AxiosError } from 'axios';

export default function Declarations() {
  const { onLoading, offLoading } = useLoading();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [typeFilter, setTypeFilter] = useState<string>('year');
  const [data, setData] = useState<Declaration[]>([]);
  const [submitModal, setSubmitModal] = useState<boolean>(false);
  const [detailModal, setDetailModal] = useState<boolean>(false);
  const [updateModal, setUpdateModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [id, setId] = useState<string>('');
  const [submitId, setSubmitId] = useState<string>('');
  const [deleteId, setDeleteId] = useState<string>('');
  const [updateId, setUpdateId] = useState<string>('');
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { getDeclarations } = useDeclaration();

  const navigate = useNavigate();

  function openUpdateModal(id: string) {
    if (id) {
      setUpdateId(id);
      setUpdateModal(!updateModal);
    }
  }
  function closeUpdateModal() {
    setUpdateId('');
    setUpdateModal(!updateModal);
  }

  function openSubmitModal(id: string) {
    if (id) {
      setSubmitId(id);
      setSubmitModal(!submitModal);
    }
  }
  function closeSubmitModal() {
    setSubmitId('');
    setSubmitModal(!submitModal);
  }

  function openDetailModal(id: string) {
    if (id) {
      setId(id);
      setDetailModal(!detailModal);
    }
  }
  function closeDetailModal() {
    setId('');
    setDetailModal(!detailModal);
  }

  function openDeleteModal(id: string) {
    if (id) {
      setDeleteId(id);
      setDeleteModal(!deleteModal);
    }
  }
  function closeDeleteModal() {
    setDeleteId('');
    setDeleteModal(!deleteModal);
  }

  async function fetchDeclarations() {
    await onLoading();
    try {
      const { data } = await getDeclarations();
      setData(data);

    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error);
        return toast.error(
          error.response?.data?.message || 'Algo deu errado, tente novamente.',
        );
      }
    } finally {
      await offLoading();
    }
  }

  useEffect(() => {
    fetchDeclarations();
  }, []);

  useEffect(() => {
    const calculatePageSize = () => {
      const availableHeight = window.innerHeight - 400;
      const rowHeight = 40;
      const itemsPerPage = Math.max(5, Math.floor(availableHeight / rowHeight));
      setPageSize(itemsPerPage);
    };
    calculatePageSize();
    window.addEventListener('resize', calculatePageSize);
    return () => {
      window.removeEventListener('resize', calculatePageSize);
    };
  }, []);

  const columns: ColumnDef<Declaration>[] = [
    {
      accessorKey: 'year',
      header: ({ column }) => {
        return (
          <div>
            Ano
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
            >
              <ArrowUpDown />
            </Button>
          </div>
        );
      },
      cell: ({ row }) => <div>{row.getValue('year')}</div>,
    },
    {
      accessorKey: 'values.rent',
      header: ({ column }) => {
        return (
          <div>
            Renda
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
            >
              <ArrowUpDown />
            </Button>
          </div>
        );
      },
      cell: ({ row }) => {
        const rent = row.original.values.rent!;
        return (
          <div className="uppercase">{formatCurrency(rent.toString())}</div>
        );
      },
    },
    {
      accessorKey: 'values.deduction',
      header: ({ column }) => {
        return (
          <div>
            Dedução
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
            >
              <ArrowUpDown />
            </Button>
          </div>
        );
      },
      cell: ({ row }) => {
        const deduction = row.original.values.deduction!;
        return (
          <div className="uppercase">
            {formatCurrency(deduction.toString())}
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => {
        return (
          <div>
            Status
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
            >
              <ArrowUpDown />
            </Button>
          </div>
        );
      },
      cell: ({ row }) => {
        const status = row.original.status!;
        return <div>{formatStatus(status)}</div>;
      },
    },
    {
      accessorKey: 'values.name',
      header: 'Usuário',
      cell: ({ row }) => {
        const name = row.original.user!.name;
        return <span>{name}</span>;
      },
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => {
        return (
          <div>
            Data de criação
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
            >
              <ArrowUpDown />
            </Button>
          </div>
        );
      },
      cell: ({ row }) => {
        const createdAt = row.original.createdAt!;
        return <div>{formatDate(createdAt.toString())}</div>;
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const item = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {item.status === 'SUBMITED' && (
                <DropdownMenuItem
                  onClick={() =>
                    navigate(`/declarations/retification/${item.id!}`)
                  }
                >
                  Retificar
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => openDetailModal(item.id!)}>
                Visualizar Declaração
              </DropdownMenuItem>
              {item.status === 'UNSUBMITED' && (
                <>
                  <DropdownMenuItem onClick={() => openUpdateModal(item.id!)}>
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => openSubmitModal(item.id!)}>
                    Submeter
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => openDeleteModal(item.id!)}>
                    Remover Declaração
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
  });

  const optionsFilter = [
    {
      title: 'Filtros',
      items: [
        {
          label: 'Ano',
          value: 'year',
        },
        {
          label: 'Status',
          value: 'status',
        },
      ],
    },
  ];

  const optionsStatus = [
    {
      title: 'Status',
      items: [
        {
          label: 'Submetido',
          value: 'SUBMITED',
        },
        {
          label: 'Não submetido',
          value: 'UNSUBMITED',
        },
      ],
    },
  ];

  async function clearAllFilters() {
    optionsFilter.map((e) => {
      e.items.map((i) => {
        table.getColumn(i.value)?.setFilterValue('');
      });
    });
  }

  function filterType() {
    switch (typeFilter) {
      case 'year':
        return (
          <div className="min-w-52 sm:min-w-[300px] relative">
            <Label className="text-[12px] text-muted-foreground">Filtro</Label>
            <SelectInput
              options={yearsDeclaration}
              placeholder={`Filtre por ano`}
              value={String(
                table.getColumn(typeFilter)?.getFilterValue() ?? '',
              )}
              onChange={(event) =>
                table.getColumn(typeFilter)?.setFilterValue(event)
              }
            />
            {columnFilters.length > 0 && (
              <Badge
                variant="secondary"
                className="p-0 absolute top-8 right-10 text-sm cursor-pointer"
                onClick={() => clearAllFilters()}
              >
                <CircleX height={18} />
              </Badge>
            )}
          </div>
        );
        break;
      case 'status':
        return (
          <div className="min-w-52 sm:min-w-[300px] relative">
            <Label className="text-[12px] text-muted-foreground">Filtro</Label>
            <SelectInput
              options={optionsStatus}
              placeholder={`Filtre por status`}
              value={String(
                table.getColumn(typeFilter)?.getFilterValue() ?? '',
              )}
              onChange={(event) =>
                table.getColumn(typeFilter)?.setFilterValue(event)
              }
            />
            {columnFilters.length > 0 && (
              <Badge
                variant="secondary"
                className="p-0 absolute top-8 right-10 text-sm cursor-pointer"
                onClick={() => clearAllFilters()}
              >
                <CircleX height={18} />
              </Badge>
            )}
          </div>
        );
        break;
      default:
        break;
    }
  }

  return (
    <>
      {updateId && (
        <UpdateDeclarationModal
          id={updateId}
          open={updateModal}
          close={closeUpdateModal}
          getData={fetchDeclarations}
        />
      )}
      {id && (
        <DetailDeclarationModal
          id={id}
          open={detailModal}
          close={closeDetailModal}
          getData={fetchDeclarations}
        />
      )}
      {submitId && (
        <SubmitDeclarationModal
          id={submitId}
          open={submitModal}
          close={closeSubmitModal}
          getData={fetchDeclarations}
        />
      )}
      {deleteId && (
        <DeleteDeclarationModal
          id={deleteId}
          open={deleteModal}
          close={closeDeleteModal}
          getData={fetchDeclarations}
        />
      )}
      <main>
        <section className="flex flex-col gap-5 items-start justify-start py-5 px-10">
          <div className="w-full flex items-center justify-between">
            <h1 className="text-[1.5rem] font-medium m-0">Declarações</h1>
            <Button onClick={() => navigate('/declarations/create')}>
              Adicionar declaração
            </Button>
          </div>
          <div className="w-full">
            <div className="flex items-center py-0 gap-2">
              {filterType()}
              <div>
                <Label className="text-[12px] text-muted-foreground">
                  Tipo
                </Label>
                <SelectInput
                  options={optionsFilter}
                  value={typeFilter}
                  className="w-[100px]"
                  placeholder="Selecione um tipo de filtro"
                  onChange={(e) => setTypeFilter(e)}
                />
              </div>
            </div>
            <div className="rounded-md border mt-4">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead
                            key={header.id}
                            className="min-w-[170px] sm:min-w-[30px]"
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && 'selected'}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            className="min-w-[170px] sm:min-w-[30px]"
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-12 text-start sm:text-center"
                      >
                        Sem resultados.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-end space-x-2 py-4">
              <div className="flex-1 text-[10px] text-muted-foreground">
                A quantidade de itens da tabela são renderizados de acordo com o
                tamanho de sua tela.
              </div>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    table.previousPage();
                    setPageIndex(table.getState().pagination.pageIndex - 1);
                  }}
                  disabled={!table.getCanPreviousPage()}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    table.nextPage();
                    setPageIndex(table.getState().pagination.pageIndex + 1);
                  }}
                  disabled={!table.getCanNextPage()}
                >
                  Próximo
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
