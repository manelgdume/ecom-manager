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
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"
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
import { useState } from "react"



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
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

const defaultValues: Partial<ProfileFormValues> = {
    description: "",
    urls: [
        { value: "https://shadcn.com" },
        { value: "http://twitter.com/shadcn" },
    ],
}





function ProfileForm() {


    const [imageFiles, setImageFiles] = useState<File[]>([]);

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
                                    <div
                                        onDrop={handleDrop}
                                        onDragOver={e => e.preventDefault()}
                                        className="w-30 h-30 p-2 text-center border-2 border-dashed border-border"
                                    >
                                        <p>Drag images here or select from your device</p>

                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleFileInputChange}
                                        />


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
                                            <SelectItem value="Phone">Phone</SelectItem>
                                            <SelectItem value="PC">PC</SelectItem>
                                            <SelectItem value="TV">TV</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        You can add a new also
                                    </FormDescription>
                                    <Dialog>
                                        <DialogTrigger><Button type="button"
                                            variant="outline"
                                            size="sm"
                                            className="mt-2">Add Category</Button></DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Create category</DialogTitle>
                                                <DialogDescription>
                                                    <FormItem>
                                                        <FormLabel>Name</FormLabel>
                                                        <FormControl>
                                                            <Input className="" placeholder="" />
                                                        </FormControl>
                                                        <FormDescription>
                                                            This is the name of the product. Is the name that will be displayed in the store
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                    <div className="flex justify-end">
                                                        <Button
                                                            type="button"
                                                            variant="default"
                                                            size="sm"
                                                            className="mt-2"
                                                            onClick={() => append({ value: "" })}
                                                        >Add category
                                                        </Button>

                                                    </div>
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