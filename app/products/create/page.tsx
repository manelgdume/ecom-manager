"use client"

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

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
import { toast } from "@/components/ui/use-toast"
import Navbar from "@/components/Navbar"
import { useEffect, useState } from "react"
import axios from "axios"



const profileFormSchema = z.object({
    name: z
        .string()
        .min(3, {
            message: "Name must be at least 2 characters.",
        })
        .max(30, {
            message: "Name must not be longer than 30 characters.",
        }),
    category: z
        .string({
            required_error: "Please select an category.",
        }),
    description: z.string().max(160).min(4),
    urls: z
        .array(
            z.object({
                value: z.string().url({ message: "Please enter a valid URL." }),
            })
        )
        .optional(),
    images: z
        .array(
            z.object({
                value: z.string().url({ message: "Please enter a valid URL." }),
            })
        )
        .refine((images) => images.length > 0, {
            message: "Please upload at least one image.",
        })
        .optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

const defaultValues: Partial<ProfileFormValues> = {
    description: "",
    urls: [
        { value: "https://shadcn.com" },
        { value: "http://twitter.com/shadcn" },
    ],
    images: [],
}





function ProfileForm() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '' });
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [categoryOptions, setCategoryOptions] = useState([]);

    const [categoryName, setCategoryName] = useState('');
    useEffect(() => {
        getCategoires();
    }, []);

    const getCategoires = () => {
        axios.get("/api/auth/category/getCategories")
            .then(response => {
                console.log(response)
                setCategoryOptions(response.data);
                console.log(categoryOptions)
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });
    }

    const handleAddCategory = async () => {
        try {
            await axios.post("/api/auth/category/create", {
                name: categoryName,
            }).then(response => {
                getCategoires();
            });

            setIsDialogOpen(false); // Cerrar el diálogo
            console.log('Categoría agregada exitosamente');
            console.log(categoryName);
            setCategoryName('');
 
        } catch (error) {
            console.error('Error al agregar categoría:', error);
        }
    };
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();

        const files = Array.from(e.dataTransfer.files);

        setImageFiles(prevFiles => [...prevFiles, ...files]);
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        setImageFiles(prevFiles => [...prevFiles, ...files]);
        console.log(files)
    };


    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues,
        mode: "onChange",
    })

    function onSubmit(data: ProfileFormValues) {
        toast({
            title: "You submitted the following values:",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
        })
        console.log(JSON.stringify(data, null, 2))
    }


    return (
        <div className='flex h-screen color-w bg-background'>
            <Navbar></Navbar>
            <div className="flex flex-col content-center w-full bg-background">
                <Form {...form} >
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mx-3 p-2 mt-5">
                        <h2 className=' text-2xl font-bold tracking-tight'>Create product</h2>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input className="" placeholder="Name" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is the name of the product. Is the name that will be displayed in the store
                                    </FormDescription>
                                </FormItem>
                            )}
                        />
                        <div>
                            <FormItem>
                                <FormLabel >
                                    Images
                                </FormLabel>
                                <FormDescription >
                                    Add Images
                                </FormDescription>
                                <div className="flex text-sm">
                                    {imageFiles.map((file, index) => (
                                        <div key={index}>
                                            <img src={URL.createObjectURL(file)} className="w-24 h-24" />
                                        </div>
                                    ))}
                                    <div onDrop={handleDrop}
                                        onDragOver={e => e.preventDefault()}
                                        className="w-24 h-24 p-2 text-center border-2 border-dashed border-border">
                                        <label className="flex items-center justify-center pt-4 text-gray-600 ">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15" />
                                            </svg>
                                            <p>Upload</p>
                                            <input
                                                className="h-24 w-24 opacity-0  absolute cursor-pointer border-2"
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={handleFileInputChange}
                                            />
                                        </label>
                                    </div>

                                </div>

                            </FormItem>
                        </div>
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
                                                <SelectItem key={option._id} value={option.name}>
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
                                                                    onChange={(e) =>
                                                                        setCategoryName(e.target.value)
                                                                    }
                                                                />
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
                                                                handleAddCategory();

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
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Description of the product"
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Tell something about the product
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit">Create product</Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}
export default ProfileForm;