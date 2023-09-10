'use client'
import React, { useEffect, useState } from "react";
import Navbar from '@/components/Navbar'
import Link from "next/link";
import { storage } from "@/lib/firebase"
import { getDownloadURL, ref, deleteObject } from "firebase/storage"; // Import Firebase storage functions
import {
    CaretSortIcon,
    ChevronDownIcon,
    DotsHorizontalIcon,
} from "@radix-ui/react-icons";
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
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import axios from "axios";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";


export type Product = {
    _id: String,
    name: String,
    price: Number,
    images: String[],  // This is an array of strings
    category: String,
    stock: Number,
    description: String,
}

const data: Product[] = [];
let fetchData: () => void
let deleteProduct: () => void
export const columns: ColumnDef<Product>[] = [

    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "image",
        header: "Image",
        cell: ({ row }) => {
            console.log(row.original.images[0])
            const imageUrl = row.original.images[0];
            const [imageSrc, setImageSrc] = useState("");
            useEffect(() => {
                async function fetchImage() {
                    try {
                        const imageStorageRef = ref(storage, imageUrl.toString());
                        const imageDownloadUrl = await getDownloadURL(imageStorageRef);
                        setImageSrc(imageDownloadUrl);
                    } catch (error) {
                        console.error("Error fetching image:", error);
                    }
                }
                fetchImage();
            }, [imageUrl]);

            return (
                <div className="capitalize">
                    {imageSrc && <img src={imageSrc} alt="Product" className="w-20 h-20 " />}
                </div>
            );
        },
    },
    {
        accessorKey: "stock",
        header: "Stock",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("stock")}</div>
        ),
    },
    {
        accessorKey: "name",
        header: ({ column }) => <div>Name</div>,
        cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
    },
    {
        accessorKey: "category",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-left"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >Category<CaretSortIcon className="h-4 w-4  " />
                </Button>
            );
        },
        cell: ({ row }) => <div className="capitalize pl-4">{row.getValue("category")}</div>,
    },
    {
        accessorKey: "price",
        header: () => <div className="text-right">Price</div>,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("price"));

            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(amount);

            return <div className="text-right font-medium">{formatted}</div>;
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const payment = row.original;
            async function deleteFile(filePath: string) {
                try {
                    const fileRef = ref(storage, filePath);
                    await deleteObject(fileRef); // Usar deleteObject en lugar de fileRef.delete()
                    console.log(`Archivo ${filePath} eliminado exitosamente.`);
                } catch (error) {
                    console.error(`Error al eliminar el archivo ${filePath}:`, error);
                }
            }

            deleteProduct = async function deleteProduct() {

                const images = row.original.images;
                images.forEach(async url => {
                    await deleteFile(url.toString());
                })

                await axios.delete("/api/auth/product/delete", {
                    data: {
                        id: row.original._id
                    }
                });
                toast({
                    action: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                    ,
                    title: "Product deleted",
                    description: "The product was deleted from the database and the store"
                });
                fetchData();
            }


            return (
                <div>


                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <DotsHorizontalIcon className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <Link href={`products/edit/${row.original._id}`}><DropdownMenuItem>Edit</DropdownMenuItem></Link>
                            <AlertDialog >
                                <AlertDialogTrigger className="transition-colors outline-none text-sm py-1.5 px-2 rounded-sm text-left select-none hover:bg-slate-100 w-full">
                                    Delete
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete your account
                                            and remove your data from our servers.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => deleteProduct()}>Delete</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </DropdownMenuContent>


                    </DropdownMenu>

                </div>

            );
        },
    },
];

function DataTableDemo() {

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    );


    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});
    const [data, setData] = useState<Product[]>([]); // State to hold the data


    const table = useReactTable({
        data, // Now using the data state to populate the table
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
        },
    });
    fetchData = async function fetchData() {
        try {
            const response = await axios.get<Product[]>('/api/auth/product/getAll'); // Reemplaza con la URL de la API real
            const productsData: Product[] = response.data;
            setData(productsData); // Update the state with new data
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    React.useEffect(() => {
        fetchData();

    }, []);
    return (
        <div>
            <Header />
            <div className=' min-h-screen flex' suppressHydrationWarning={true} >
                <Navbar />
                <h1 className="font-medium text-2xl">Settings</h1>

            </div>
        </div>
    );
}

export default DataTableDemo;
