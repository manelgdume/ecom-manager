"use client"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { storage } from "@/lib/firebase"
import * as z from "zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useState, useEffect } from "react"
import axios from "axios"
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

const profileFormSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters').max(100, 'Name cannot exceed 20 characters'),
    stock: z.string(),
    price: z.string(),
    category: z.string().min(1, 'Category must be at least 1 character').max(50, 'Category cannot exceed 50 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters').max(300, 'Description cannot exceed 300 characters'),
    images: z.string({ required_error: "You have to select at least one image" })
});

type ProfileFormValues = z.infer<typeof profileFormSchema>
interface Category {
    name: string;
}
const initialValues = {
    name: '',
    price: '',
    images: [],
    category: '',
    stock: '',
    description: '',
};

function ProfileForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isFailed, setIsFailed] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { toast } = useToast()
    const [formData, setFormData] = useState(initialValues);

    const resetForm = () => {
        setFormData(initialValues);
    };
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [categoryOptions, setCategoryOptions] = useState<Array<Category>>([]);
    const [categoryName, setCategoryName] = useState('');
    useEffect(() => {
        getCategoires();
    }, []);
    const getCategoires = () => {
        axios.get("/api/auth/category/getCategories")
            .then(response => {
                setCategoryOptions(response.data);
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });;
    }
    const handleReload = () => {
        window.location.reload();
    };

    const handleAddCategory = async () => {
        try {
            await axios.post("/api/auth/category/create", {
                name: categoryName,
            }).then(response => {
                getCategoires();
            });

            setIsDialogOpen(false);
            console.log('Categoría agregada exitosamente');
            console.log(categoryName);
            setCategoryName('');

        } catch (error) {
            console.error('Error al agregar categoría:', error);
        }
    };
    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        mode: "onChange",
    })
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();

        const files = Array.from(e.dataTransfer.files);

        setImageFiles(prevFiles => [...prevFiles, ...files]);
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        setImageFiles(prevFiles => [...prevFiles, ...files]);

    };

    let jsonResult: { [key: string]: string } = {};

    async function uploadImages(imageFiles: File[], name: any): Promise<void> {
        let i = 0;
        for (const file of imageFiles) {
            const storageRef = ref(storage, 'images/' + name + "_" + file.name);

            try {
                await uploadBytes(storageRef, file);

                const downloadURL = await getDownloadURL(storageRef);
                jsonResult[i] = downloadURL;
                i++;
                console.log('Imagen subida correctamente:', file.name);
            } catch (error) {
                console.error('Error al subir la imagen:', error);
            }
        }
    }
    function resettForm() {
        form.setValue('name', "");
        form.setValue('price', "");
        form.setValue('images', "[]");
        form.setValue('category', "");
        form.setValue('stock', "");
        form.setValue('description', "");
        setImageFiles([])
    }

    async function onSubmit(data: ProfileFormValues) {
        let response: any
        try {
            setIsLoading(true); // Comienza la animación de carga 
            await uploadImages(imageFiles, data.name);
            response = await axios.post("/api/auth/product/create", {
                name: data.name,
                price: data.price,
                category: data.category,
                images: jsonResult,
                stock: data.stock,
                description: data.description,
            })
            setIsLoading(false)
            toast({
                action: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                ,
                title: "Product created",
                description: `Name: ${data.name}, Description: ${data.description}`,
            });
            resettForm();
        }
        catch (e) {

            setIsLoading(false)
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",

                action: <ToastAction altText="Close" >Close</ToastAction>,
            })
        }
        setIsLoading(false)

    }
    return (
        <div className=' min-h-screen flex ' >
            {isLoading ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-4 border-blue-500 mr-2"></div>Loading
                </div>
            ) : isFailed ? (
                <div className="text-center mt-4">
                    <p>{errorMessage}</p>
                </div>
            ) : null}
            <Navbar></Navbar>
            <Form {...form} >
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8 p-4">
                    <h1 className="font-medium text-2xl">Create Product</h1>

                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Your name" {...field} defaultValue={form.watch('name', '')} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Price</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="Price of the product" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                    <FormField
                        control={form.control}
                        name="images"
                        render={({ field }) => (
                            <div>
                                <FormItem>
                                    <FormLabel>
                                        Images
                                    </FormLabel>
                                    <FormDescription>
                                        Add Images
                                    </FormDescription>
                                    <FormMessage />
                                    <div className="flex text-sm">
                                        {imageFiles.map((file, index) => (
                                            <div key={index}>
                                                <img
                                                    src={URL.createObjectURL(file)}
                                                    className="w-24 h-24"
                                                    alt={`Image ${index}`}

                                                />
                                            </div>
                                        ))}
                                        <div
                                            onDrop={handleDrop}
                                            onDragOver={(e) => e.preventDefault()}
                                            className="w-24 h-24 p-2 text-center border-2 border-dashed border-border rounded"
                                        >
                                            <label className="flex items-center justify-center pt-4 text-gray-600">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15" />
                                                </svg>
                                                <p className="mt-2">Upload</p>
                                                <input
                                                    className="h-24 w-24 opacity-0 absolute cursor-pointer border-2"
                                                    type="file"
                                                    multiple
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        handleFileInputChange(e);

                                                        field.onChange(e);
                                                    }}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </FormItem>
                            </div>
                        )}
                    />



                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {categoryOptions.map((option) => (
                                            <SelectItem key={option.name} value={option.name}>
                                                {option.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormDescription>You can also add a new category.</FormDescription>

                                <Dialog>
                                    <DialogTrigger>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="mt-2"
                                            onClick={() => setIsDialogOpen(true)}
                                        >
                                            Add Category
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Create category</DialogTitle>
                                            <DialogDescription>
                                                <form>
                                                    <FormItem>
                                                        <FormLabel>Name</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                className=""
                                                                placeholder=""
                                                                value={categoryName}
                                                                onChange={(e) => setCategoryName(e.target.value)} />
                                                        </FormControl>
                                                        <FormDescription>
                                                            This is the name of the product. Is the name that will be displayed in the store
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                    <Button
                                                        type="button"
                                                        variant="default"
                                                        size="sm"

                                                        onClick={() => {
                                                            handleAddCategory()

                                                        }}
                                                    >
                                                        Add category
                                                    </Button>

                                                </form>
                                            </DialogDescription>
                                        </DialogHeader>
                                    </DialogContent>
                                </Dialog>
                            </FormItem>
                        )} />
                    <FormField
                        control={form.control}
                        name="stock"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Stock</FormLabel>
                                <FormControl>
                                    <Input type="number" min="1" step="1" placeholder="Number of products in stock" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Description" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    <Button type="submit" >Create product</Button>
                </form>
            </Form>
        </div>
    )
}

export default ProfileForm;
