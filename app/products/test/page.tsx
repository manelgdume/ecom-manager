"use client"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
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
import { toast } from "@/components/ui/use-toast"
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

const profileFormSchema = z.object({
    name: z.string().min(2).max(100),
    category: z.string().min(1).max(50),
    description: z.string().min(10).max(300),
    images: z.array(z.object({
        file: z.object({
            name: z.string(),
            size: z.number(),
            type: z.string(),
        }),
    })).refine(images => {
        return images.every(image => {
            const allowedFormats = ['image/png', 'image/jpeg'];
            const maxFileSize = 1024 * 1024; // 1 MB in bytes

            const isValidFormat = allowedFormats.includes(image.file.type);
            const isUnderMaxSize = image.file.size <= maxFileSize;

            return isValidFormat && isUnderMaxSize;
        });
    }, {
        message: 'Invalid image format or size',
    }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>
interface Category {
    name: string;
}


function ProfileForm() {
 
    function onSubmit(data: ProfileFormValues) {
        console.log(data)
        toast({
            title: "You submitted the following values:",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
        })
    }

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {/* Rest of the existing fields */}
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Your name" {...field} />
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
                                    <FormLabel >
                                        Images
                                    </FormLabel>
                                    <FormDescription >
                                        Add Images
                                    </FormDescription>
                                    <div className="flex text-sm">
                                        {imageFiles.map((file, index) => (
                                            <div key={index}>
                                                <img src={URL.createObjectURL(file)} className="w-24 h-24" alt={`Image ${index}`} {...field}/>
                                            </div>
                                        ))}
                                        <div
                                            onDrop={handleDrop}
                                            onDragOver={e => e.preventDefault()}
                                            className="w-24 h-24 p-2 text-center border-2 border-dashed border-border"
                                        >
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
                                            <SelectItem value={option.name}>
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
                                    <Textarea placeholder="Description" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    <Button type="submit">Create product</Button>
                    {/* Rest of the existing code */}
                </form>
            </Form>
        </div>
    )
}

export default ProfileForm;
